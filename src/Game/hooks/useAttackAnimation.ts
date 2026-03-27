import { gameSocket } from '#shared/services/websocket';
import type React from 'react';
import { useRef } from 'react';

const ATTACK_DURATION_MS = 150;

export function useAttackAnimation(onAttack?: () => void) {
  const attackFlashRef = useRef<{ angle: number; startTime: number } | null>(
    null,
  );

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const angle = Math.atan2(
      e.clientY - rect.top - cy,
      e.clientX - rect.left - cx,
    );

    gameSocket.attack(angle);
    onAttack?.();
    attackFlashRef.current = { angle, startTime: performance.now() };
    setTimeout(() => {
      attackFlashRef.current = null;
    }, ATTACK_DURATION_MS + 80);
  };

  return { attackFlashRef, handleCanvasClick };
}
