import { gameSocket } from '#shared/services/websocket';
import { useSettingsStore } from '#shared/stores';
import { useCallback, useEffect, useRef } from 'react';
import { characterRegistry } from '../characters';
import { predictionEngine } from '../engine/predictionEngine';

const MOVE_TICK_MS = 50;
const DEADZONE = 0.2;
export const ATTACK_DEADZONE = 0.3;
const MIN_ATTACK_INTERVAL_MS = 200;
const DEFAULT_FACING_ANGLE = Math.PI / 2;

export function useMobileControls(
  joined: boolean,
  onAttack?: (characterId: string) => void,
) {
  const moveDx = useRef(0);
  const moveDy = useRef(0);
  const tickRef = useRef<number | null>(null);

  const attackFlashRef = useRef<{ angle: number; startTime: number } | null>(
    null,
  );
  const lastAttackTimeRef = useRef(0);
  const cooldownActiveRef = useRef(false);
  const attackActiveRef = useRef(false);

  const onMoveJoystick = useCallback((dx: number, dy: number) => {
    moveDx.current = dx;
    moveDy.current = dy;
  }, []);

  const tryAttack = useCallback(
    (angle: number) => {
      const now = performance.now();
      if (now - lastAttackTimeRef.current < MIN_ATTACK_INTERVAL_MS) return;

      const stats = useSettingsStore.getState().getSelectedCharacterStats();
      if (
        stats.cooldown_ms > 0 &&
        now - lastAttackTimeRef.current < stats.cooldown_ms
      ) {
        return;
      }

      const selectedChar = useSettingsStore.getState().selectedCharacter;
      const charDef = characterRegistry.get(selectedChar);

      lastAttackTimeRef.current = now;
      gameSocket.attack(angle, gameSocket.nextClientTick());
      onAttack?.(selectedChar);
      attackFlashRef.current = { angle, startTime: now };

      if (stats.cooldown_ms > 0) {
        cooldownActiveRef.current = true;
        setTimeout(() => {
          cooldownActiveRef.current = false;
        }, stats.cooldown_ms);
      }

      setTimeout(() => {
        attackFlashRef.current = null;
      }, charDef.attackDurationMs + 80);
    },
    [onAttack],
  );

  const onAttackStart = useCallback(() => {
    attackActiveRef.current = true;
    const facing = predictionEngine.getLastInputAngle() ?? DEFAULT_FACING_ANGLE;
    tryAttack(facing);
  }, [tryAttack]);

  const onAttackJoystick = useCallback(
    (dx: number, dy: number) => {
      if (!attackActiveRef.current) return;
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      if (magnitude < ATTACK_DEADZONE) return;
      tryAttack(Math.atan2(dy, dx));
    },
    [tryAttack],
  );

  const onAttackEnd = useCallback(() => {
    attackActiveRef.current = false;
  }, []);

  useEffect(() => {
    if (!joined) return;

    tickRef.current = window.setInterval(() => {
      const dx = moveDx.current;
      const dy = moveDy.current;

      if (Math.abs(dx) < DEADZONE && Math.abs(dy) < DEADZONE) return;

      const normDx = dx > DEADZONE ? 1 : dx < -DEADZONE ? -1 : 0;
      const normDy = dy > DEADZONE ? 1 : dy < -DEADZONE ? -1 : 0;

      if (normDx === 0 && normDy === 0) return;
      const tick = gameSocket.nextClientTick();
      predictionEngine.applyLocalMove(normDx, normDy, tick);
      gameSocket.move(normDx, normDy, tick);
    }, MOVE_TICK_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [joined]);

  return {
    onMoveJoystick,
    onAttackStart,
    onAttackJoystick,
    onAttackEnd,
    attackFlashRef,
    cooldownActiveRef,
  };
}
