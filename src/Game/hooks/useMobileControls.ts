import { gameSocket } from '#shared/services/websocket';
import { useSettingsStore } from '#shared/stores';
import { useCallback, useEffect, useRef } from 'react';
import { characterRegistry } from '../characters';
import { predictionEngine } from '../engine/predictionEngine';

const MOVE_TICK_MS = 50;
const DEADZONE = 0.2;

export function useMobileControls(joined: boolean) {
  const moveDx = useRef(0);
  const moveDy = useRef(0);
  const tickRef = useRef<number | null>(null);

  const attackFlashRef = useRef<{ angle: number; startTime: number } | null>(
    null,
  );
  const lastAttackTimeRef = useRef(0);
  const cooldownActiveRef = useRef(false);

  const onMoveJoystick = useCallback((dx: number, dy: number) => {
    moveDx.current = dx;
    moveDy.current = dy;
  }, []);

  const onAttackJoystick = useCallback((dx: number, dy: number) => {
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    if (magnitude < DEADZONE) return;

    const stats = useSettingsStore.getState().getSelectedCharacterStats();
    const selectedChar = useSettingsStore.getState().selectedCharacter;
    const charDef = characterRegistry.get(selectedChar);
    const now = performance.now();

    if (
      stats.cooldown_ms > 0 &&
      now - lastAttackTimeRef.current < stats.cooldown_ms
    ) {
      return;
    }

    const angle = Math.atan2(dy, dx);
    lastAttackTimeRef.current = now;
    gameSocket.attack(angle, gameSocket.nextClientTick());
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
  }, []);

  const onAttackEnd = useCallback(() => {}, []);

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
    onAttackJoystick,
    onAttackEnd,
    attackFlashRef,
    cooldownActiveRef,
  };
}
