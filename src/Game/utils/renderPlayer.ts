import type { Player } from '#shared/services/websocket';
import { SCALE_X, SCALE_Y } from './canvasConstants';

const SPRITE_DEFAULT_ANGLE = Math.PI / 2;
const SPRITE_SIZE = 60;
const HIT_DURATION_MS = 350;

export const renderPlayer = (
  p: Player,
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  playerId: string,
  sprites: Record<string, HTMLImageElement>,
  facingAngle: number,
  hitTime: number | null,
) => {
  const sx = p.x * SCALE_X + offsetX;
  const sy = p.y * SCALE_Y + offsetY;
  console.log('==> ', sprites[p.character], p.character);
  const sprite = sprites[p.character] ?? Object.values(sprites)[0];

  if (sprite && import.meta.env.VITE_SPRITES === 'true') {
    const half = SPRITE_SIZE / 2;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(facingAngle - SPRITE_DEFAULT_ANGLE);
    ctx.drawImage(sprite, -half, -half, SPRITE_SIZE, SPRITE_SIZE);

    if (hitTime !== null) {
      const elapsed = performance.now() - hitTime;
      if (elapsed < HIT_DURATION_MS) {
        const progress = elapsed / HIT_DURATION_MS;
        ctx.globalAlpha = 0.55 * (1 - progress);
        ctx.fillStyle = '#ff2020';
        ctx.beginPath();
        ctx.arc(0, 0, half, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(sx, sy, 12, 0, Math.PI * 2);
    ctx.fillStyle = p.id === playerId ? '#00F' : '#e22';
    ctx.fill();
  }

  ctx.fillStyle = '#fff';
  ctx.fillText(p.name, sx - 20, sy - 25);
};
