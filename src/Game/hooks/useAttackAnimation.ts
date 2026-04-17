import { gameSocket } from '#shared/services/websocket';
import { useSettingsStore } from '#shared/stores';
import type React from 'react';
import { useRef } from 'react';
import { characterRegistry } from '../characters';

export function useAttackAnimation(onAttack?: (characterId: string) => void) {
  const attackFlashRef = useRef<{ angle: number; startTime: number } | null>(
    null,
  );
  const lastAttackTimeRef = useRef(0);
  const cooldownActiveRef = useRef(false);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
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

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const angle = Math.atan2(
      e.clientY - rect.top - cy,
      e.clientX - rect.left - cx,
    );

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
  };

  return { attackFlashRef, handleCanvasClick, cooldownActiveRef };
}
