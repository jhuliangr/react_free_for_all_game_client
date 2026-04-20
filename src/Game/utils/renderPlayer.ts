import type { Player } from '#shared/services/websocket';
import { characterRegistry } from '../characters';
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
  dotStartTime: number | null,
  animationFrame: HTMLImageElement | null,
) => {
  const sx = p.x * SCALE_X + offsetX;
  const sy = p.y * SCALE_Y + offsetY;
  const staticSprite = sprites[p.character] ?? Object.values(sprites)[0];
  const sprite = animationFrame ?? staticSprite;

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

  // Delegate character-specific player effects (e.g. DoT aura) to the registry
  const charDef = characterRegistry.get(p.character);
  if (charDef.renderPlayerEffect) {
    charDef.renderPlayerEffect({
      ctx,
      player: p,
      sx,
      sy,
      facingAngle,
      hitTime,
      dotStartTime,
      isMe: p.id === playerId,
    });
  }

  // HP bar above player
  const barWidth = 40;
  const barHeight = 4;
  const barX = sx - barWidth / 2;
  const barY = sy - 32;

  // Player name above HP bar
  ctx.fillStyle = '#fff';
  ctx.fillText(p.name, sx - 20, barY - 4);
  const hpRatio = Math.max(0, p.hp / p.max_hp);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  ctx.fillStyle = hpRatio > 0.25 ? '#4ade80' : '#ef4444';
  ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
};
