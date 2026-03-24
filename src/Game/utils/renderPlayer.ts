import type { Player } from '#shared/services/websocket';

export const renderPlayer = (
  p: Player,
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  playerId: string,
  sprite: HTMLImageElement,
) => {
  const sx = p.x * (800 / 2000) + offsetX;
  const sy = p.y * (600 / 2000) + offsetY;
  if (p.id === playerId && sprite && import.meta.env.VITE_SPRITES === 'true') {
    ctx.drawImage(sprite, sx - 30, sy - 30, 60, 60);
  } else {
    ctx.beginPath();
    ctx.arc(sx, sy, 12, 0, Math.PI * 2);
    ctx.fillStyle = p.id === playerId ? '#00F' : '#e22';
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillText(p.name, sx - 20, sy - 25);
};
