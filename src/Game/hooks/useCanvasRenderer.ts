import { useGameStore } from '#shared/stores';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import {
  CANVAS_H,
  CANVAS_W,
  SCALE_X,
  SCALE_Y,
  renderAttack,
  renderGrid,
  renderMapBounds,
  renderPlayer,
} from '../utils';

const ATTACK_DURATION_MS = 150;

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  spriteRef: RefObject<HTMLImageElement | null>,
  attackFlashRef: RefObject<{ angle: number; startTime: number } | null>,
  activeAttacksRef: RefObject<
    Record<string, { angle: number; startTime: number }>
  >,
) {
  useEffect(() => {
    let rafId: number;
    let ctx: CanvasRenderingContext2D | null = null;

    const loop = () => {
      if (!ctx) {
        const canvas = canvasRef.current;
        if (canvas) ctx = canvas.getContext('2d');
      }

      if (ctx) {
        const { players, myPlayerId } = useGameStore.getState();
        const me = myPlayerId ? players[myPlayerId] : null;

        if (me) {
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

          const offsetX = CANVAS_W / 2 - me.x * SCALE_X;
          const offsetY = CANVAS_H / 2 - me.y * SCALE_Y;

          renderGrid(ctx, offsetX, offsetY);
          renderMapBounds(ctx, offsetX, offsetY);

          ctx.font = '11px sans-serif';
          Object.values(players).forEach((p) =>
            renderPlayer(
              p,
              ctx!,
              offsetX,
              offsetY,
              myPlayerId!,
              spriteRef.current!,
            ),
          );

          const flash = attackFlashRef.current;
          if (flash) {
            const progress = Math.min(
              (performance.now() - flash.startTime) / ATTACK_DURATION_MS,
              1,
            );
            renderAttack(ctx, flash.angle, progress);
          }

          Object.entries(activeAttacksRef.current).forEach(
            ([attackerId, { angle, startTime }]) => {
              const attacker = players[attackerId];
              if (!attacker) return;
              const sx = attacker.x * SCALE_X + offsetX;
              const sy = attacker.y * SCALE_Y + offsetY;
              const progress = Math.min((Date.now() - startTime) / 280, 1);
              renderAttack(ctx!, angle, progress, sx, sy);
            },
          );
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
