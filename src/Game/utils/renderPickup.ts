import type { Pickup } from '#shared/services/websocket';
import { SCALE_X, SCALE_Y } from './canvasConstants';

const PICKUP_RADIUS_PX = 8;
const PULSE_PERIOD_MS = 2000;

export function renderPickup(
  ctx: CanvasRenderingContext2D,
  pickup: Pickup,
  offsetX: number,
  offsetY: number,
  now: number,
) {
  const cx = pickup.x * SCALE_X + offsetX;
  const cy = pickup.y * SCALE_Y + offsetY;

  const phase = (now % PULSE_PERIOD_MS) / PULSE_PERIOD_MS;
  const pulse = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2);
  const alpha = 0.6 + 0.4 * pulse;
  const scale = 0.9 + 0.2 * pulse;
  const radius = PICKUP_RADIUS_PX * scale;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowBlur = 18 + 10 * pulse;
  ctx.fillStyle = '#22ff66';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#d6ffe2';
  ctx.beginPath();
  ctx.arc(
    cx - radius * 0.25,
    cy - radius * 0.25,
    radius * 0.35,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}
