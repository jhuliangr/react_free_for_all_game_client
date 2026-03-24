import type { Player } from '#shared/services/websocket';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import { renderAttack, renderPlayer } from '../utils';

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
    ctx.clearRect(0, 0, 800, 600);

    const offsetX = 400 - me.x * (800 / 2000);
    const offsetY = 300 - me.y * (600 / 2000);

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
        const sx = attacker.x * (800 / 2000) + offsetX;
        const sy = attacker.y * (600 / 2000) + offsetY;
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
