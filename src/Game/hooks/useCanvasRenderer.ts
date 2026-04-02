import { useGameStore } from '#shared/stores';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import {
  CANVAS_H,
  CANVAS_W,
  SCALE_X,
  SCALE_Y,
  renderAttack,
  renderBackground,
  renderMapBounds,
  renderPlayer,
} from '../utils';

const ATTACK_DURATION_MS = 150;

function lerpAngle(current: number, target: number, t: number): number {
  let diff = target - current;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return current + diff * t;
}

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  spriteRef: RefObject<Record<string, HTMLImageElement>>,
  attackFlashRef: RefObject<{ angle: number; startTime: number } | null>,
  activeAttacksRef: RefObject<
    Record<string, { angle: number; startTime: number }>
  >,
  bgImageRef: RefObject<HTMLImageElement | null>,
) {
  const prevPositions = useRef<Record<string, { x: number; y: number }>>({});
  const targetFacingAngles = useRef<Record<string, number>>({});
  const facingAngles = useRef<Record<string, number>>({});
  const hitTimesRef = useRef<Record<string, number>>({});
  const lastCombatRef = useRef<object | null>(null);

  useEffect(() => {
    let rafId: number;
    let ctx: CanvasRenderingContext2D | null = null;

    const loop = () => {
      // Reset ctx whenever the canvas element changes (e.g. after remount)
      const canvas = canvasRef.current;
      if (ctx?.canvas !== canvas) {
        ctx = canvas ? canvas.getContext('2d') : null;
      }

      if (ctx) {
        const { players, myPlayerId, lastCombatEvent } =
          useGameStore.getState();
        const me = myPlayerId ? players[myPlayerId] : null;

        // Track hit events
        if (lastCombatEvent !== lastCombatRef.current) {
          if (lastCombatEvent) {
            hitTimesRef.current[lastCombatEvent.defenderId] = performance.now();
          }
          lastCombatRef.current = lastCombatEvent;
        }

        if (me) {
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

          const offsetX = CANVAS_W / 2 - me.x * SCALE_X;
          const offsetY = CANVAS_H / 2 - me.y * SCALE_Y;

          renderBackground(ctx, offsetX, offsetY, bgImageRef.current);
          renderMapBounds(ctx, offsetX, offsetY);

          // Update target facing angles from position deltas
          Object.values(players).forEach((p) => {
            const prev = prevPositions.current[p.id];
            if (prev) {
              const ddx = p.x - prev.x;
              const ddy = p.y - prev.y;
              if (ddx !== 0 || ddy !== 0) {
                targetFacingAngles.current[p.id] = Math.atan2(ddy, ddx);
              }
            }
            prevPositions.current[p.id] = { x: p.x, y: p.y };
          });

          // Smooth interpolation toward target angle
          Object.keys(targetFacingAngles.current).forEach((id) => {
            const target = targetFacingAngles.current[id];
            const current = facingAngles.current[id] ?? target;
            facingAngles.current[id] = lerpAngle(current, target, 0.2);
          });

          ctx.font = '11px sans-serif';
          Object.values(players).forEach((p) =>
            renderPlayer(
              p,
              ctx!,
              offsetX,
              offsetY,
              myPlayerId!,
              spriteRef.current,
              facingAngles.current[p.id] ?? Math.PI / 2,
              hitTimesRef.current[p.id] ?? null,
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
