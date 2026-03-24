import { SCALE_X, SCALE_Y, WORLD_SIZE } from './canvasConstants';

const WORLD_W = WORLD_SIZE * SCALE_X;
const WORLD_H = WORLD_SIZE * SCALE_Y;

export function renderMapBounds(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
) {
  ctx.save();
  ctx.strokeStyle = 'rgba(210, 60, 60, 0.85)';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 6]);
  ctx.strokeRect(offsetX, offsetY, WORLD_W, WORLD_H);
  ctx.restore();
}
