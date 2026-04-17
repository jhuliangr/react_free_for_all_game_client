import { useGameStore } from '#shared/stores';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { characterRegistry } from '../characters';
import { predictionEngine } from '../engine/predictionEngine';
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

function lerpAngle(current: number, target: number, t: number): number {
  let diff = target - current;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return current + diff * t;
}

// Per-frame lerp factor used to smooth remote players toward their latest
// server-confirmed position. Half-life ~2.4 frames (~40ms at 60Hz): near
// players (50ms updates) barely lag; mid-range players (~150ms updates)
// transition continuously instead of teleporting every third tick.
const REMOTE_SMOOTH = 0.25;
// When a remote player jumps more than this in a single frame, the cause is
// almost certainly a respawn / re-entry after the 1s grace period, not real
// motion. Snap to the new position to avoid a long visible glide across the
// map. Upper bound on legitimate per-frame motion is ~10 units after a 150ms
// throttle gap.
const REMOTE_SNAP_THRESHOLD = 80;

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
  const smoothedRemote = useRef<Record<string, { x: number; y: number }>>({});
  const targetFacingAngles = useRef<Record<string, number>>({});
  const facingAngles = useRef<Record<string, number>>({});
  const hitTimesRef = useRef<Record<string, number>>({});
  const dotPlayersRef = useRef<Record<string, number>>({});
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
        const meAuthoritative = myPlayerId ? players[myPlayerId] : null;

        // Track hit events and DoT effects
        if (lastCombatEvent !== lastCombatRef.current) {
          if (lastCombatEvent) {
            hitTimesRef.current[lastCombatEvent.defenderId] = performance.now();
            if (lastCombatEvent.attackerId === 'dot') {
              dotPlayersRef.current[lastCombatEvent.defenderId] =
                performance.now();
            }
          }
          lastCombatRef.current = lastCombatEvent;
        }

        // Resolve on-screen position for every player:
        //  - local player: client-predicted + smoothed toward the latest
        //    reconciled position.
        //  - others: eased toward the store's last server-confirmed
        //    coordinates. This smooths both the per-tick micro-jumps of
        //    nearby players (50ms updates) and the larger jumps of
        //    throttled mid-range players (~150ms between updates) into
        //    continuous motion.
        const renderedPositions: Record<string, { x: number; y: number }> = {};
        Object.values(players).forEach((p) => {
          if (p.id === myPlayerId) {
            renderedPositions[p.id] = predictionEngine.getLocalRenderedPosition(
              { x: p.x, y: p.y },
            ) ?? {
              x: p.x,
              y: p.y,
            };
            return;
          }
          const target = { x: p.x, y: p.y };
          const prev = smoothedRemote.current[p.id];
          let next: { x: number; y: number };
          if (!prev) {
            next = target;
          } else if (
            Math.hypot(target.x - prev.x, target.y - prev.y) >
            REMOTE_SNAP_THRESHOLD
          ) {
            next = target;
          } else {
            next = {
              x: prev.x + (target.x - prev.x) * REMOTE_SMOOTH,
              y: prev.y + (target.y - prev.y) * REMOTE_SMOOTH,
            };
          }
          smoothedRemote.current[p.id] = next;
          renderedPositions[p.id] = next;
        });

        // Drop smoothed state for players no longer in the store.
        for (const id of Object.keys(smoothedRemote.current)) {
          if (!players[id]) delete smoothedRemote.current[id];
        }

        const mePos = meAuthoritative
          ? renderedPositions[meAuthoritative.id]
          : null;

        if (meAuthoritative && mePos) {
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

          const offsetX = CANVAS_W / 2 - mePos.x * SCALE_X;
          const offsetY = CANVAS_H / 2 - mePos.y * SCALE_Y;

          renderBackground(ctx, offsetX, offsetY, bgImageRef.current);
          renderMapBounds(ctx, offsetX, offsetY);

          // Update target facing angles from position deltas
          Object.values(players).forEach((p) => {
            const pos = renderedPositions[p.id];
            const prev = prevPositions.current[p.id];
            if (prev) {
              const ddx = pos.x - prev.x;
              const ddy = pos.y - prev.y;
              if (ddx !== 0 || ddy !== 0) {
                targetFacingAngles.current[p.id] = Math.atan2(ddy, ddx);
              }
            }
            prevPositions.current[p.id] = { x: pos.x, y: pos.y };
          });

          // Snap own sprite toward attack direction
          if (attackFlashRef.current && myPlayerId) {
            targetFacingAngles.current[myPlayerId] =
              attackFlashRef.current.angle;
          }

          // Smooth interpolation toward target angle
          Object.keys(targetFacingAngles.current).forEach((id) => {
            const target = targetFacingAngles.current[id];
            const current = facingAngles.current[id] ?? target;
            facingAngles.current[id] = lerpAngle(current, target, 0.2);
          });

          // Clean up expired DoT markers (5 seconds)
          const now = performance.now();
          for (const id of Object.keys(dotPlayersRef.current)) {
            if (now - dotPlayersRef.current[id] > 5000) {
              delete dotPlayersRef.current[id];
            }
          }

          ctx.font = '11px sans-serif';
          Object.values(players).forEach((p) => {
            const pos = renderedPositions[p.id];
            renderPlayer(
              { ...p, x: pos.x, y: pos.y },
              ctx!,
              offsetX,
              offsetY,
              myPlayerId!,
              spriteRef.current,
              facingAngles.current[p.id] ?? Math.PI / 2,
              hitTimesRef.current[p.id] ?? null,
              dotPlayersRef.current[p.id] ?? null,
            );
          });

          // My own attack flash
          const flash = attackFlashRef.current;
          if (flash) {
            const myCharacter = meAuthoritative.character ?? 'knight';
            const charDef = characterRegistry.get(myCharacter);
            const progress = Math.min(
              (performance.now() - flash.startTime) / charDef.attackDurationMs,
              1,
            );
            renderAttack(
              ctx,
              flash.angle,
              progress,
              400,
              300,
              myCharacter,
              myPlayerId!,
            );
          }

          // Other players' attacks
          Object.entries(activeAttacksRef.current).forEach(
            ([attackerId, { angle, startTime }]) => {
              const attacker = players[attackerId];
              if (!attacker) return;
              const attackerPos = renderedPositions[attackerId];
              const sx = attackerPos.x * SCALE_X + offsetX;
              const sy = attackerPos.y * SCALE_Y + offsetY;
              const attackerChar = attacker.character ?? 'knight';
              const charDef = characterRegistry.get(attackerChar);
              const progress = Math.min(
                (Date.now() - startTime) / charDef.attackDurationMs,
                1,
              );
              renderAttack(
                ctx!,
                angle,
                progress,
                sx,
                sy,
                attackerChar,
                attackerId,
              );
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
