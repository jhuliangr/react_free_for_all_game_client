import { gameSocket } from '#shared/services/websocket';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

export function useAttackAnimation() {
  const [attackProgress, setAttackProgress] = useState<{
    angle: number;
    progress: number;
  } | null>(null);
  const rAFRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const angle = Math.atan2(
      e.clientY - rect.top - cy,
      e.clientX - rect.left - cx,
    );

    gameSocket.attack(angle);

    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    const startTime = performance.now();
    const duration = 50;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setAttackProgress({ angle, progress });
      if (progress < 1) {
        rAFRef.current = requestAnimationFrame(animate);
      } else {
        rAFRef.current = null;
        setTimeout(() => setAttackProgress(null), 80);
      }
    };
    rAFRef.current = requestAnimationFrame(animate);
  };

  return { attackProgress, handleCanvasClick };
}
