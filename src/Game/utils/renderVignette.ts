import { CANVAS_H, CANVAS_W } from './canvasConstants';

const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2;
const INNER_RADIUS = Math.min(CENTER_X, CENTER_Y);
const OUTER_RADIUS = Math.hypot(CENTER_X, CENTER_Y);

export function renderVignette(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(
    CENTER_X,
    CENTER_Y,
    INNER_RADIUS * 0.75,
    CENTER_X,
    CENTER_Y,
    OUTER_RADIUS,
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.6, 'rgba(0, 20, 0, 0.35)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();
}
