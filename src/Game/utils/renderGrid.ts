import { CANVAS_H, CANVAS_W } from './canvasConstants';

const SPACING = 40;
const DOT_RADIUS = 1.5;

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
) {
  const startX = ((offsetX % SPACING) + SPACING) % SPACING;
  const startY = ((offsetY % SPACING) + SPACING) % SPACING;

  const path = new Path2D();
  for (let x = startX; x < CANVAS_W; x += SPACING) {
    for (let y = startY; y < CANVAS_H; y += SPACING) {
      path.moveTo(x + DOT_RADIUS, y);
      path.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
    }
  }

  ctx.fillStyle = 'rgba(120, 120, 120, 0.35)';
  ctx.fill(path);
}
