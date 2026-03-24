import type { Player } from '#shared/services/websocket';
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

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  players: Record<string, Player>,
  me: Player | null,
  myPlayerId: string | null,
  sprite: HTMLImageElement | null,
  attackProgress: { angle: number; progress: number } | null,
  activeAttacks: Record<string, { angle: number; startTime: number }>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !me) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const offsetX = CANVAS_W / 2 - me.x * SCALE_X;
    const offsetY = CANVAS_H / 2 - me.y * SCALE_Y;

    renderGrid(ctx, offsetX, offsetY);
    renderMapBounds(ctx, offsetX, offsetY);

    ctx.font = '11px sans-serif';
    Object.values(players).forEach((p) =>
      renderPlayer(
        p,
        ctx,
        offsetX,
        offsetY,
        myPlayerId as string,
        sprite as HTMLImageElement,
      ),
    );

    if (attackProgress !== null) {
      renderAttack(ctx, attackProgress.angle, attackProgress.progress);
    }

    Object.entries(activeAttacks).forEach(
      ([attackerId, { angle, startTime }]) => {
        const attacker = players[attackerId];
        if (!attacker) return;
        const sx = attacker.x * SCALE_X + offsetX;
        const sy = attacker.y * SCALE_Y + offsetY;
        const progress = Math.min((Date.now() - startTime) / 280, 1);
        renderAttack(ctx, angle, progress, sx, sy);
      },
    );
  }, [
    players,
    me,
    myPlayerId,
    sprite,
    attackProgress,
    activeAttacks,
    canvasRef,
  ]);
}
