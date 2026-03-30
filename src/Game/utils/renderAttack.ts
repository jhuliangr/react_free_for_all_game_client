const PLAYER_RADIUS = 12;
const BLADE_OUTER = 65;
const SPREAD = Math.PI / 4;
const BLADE_WIDTH = Math.PI / 12;

export const renderAttack = (
  ctx: CanvasRenderingContext2D,
  angle: number,
  progress: number,
  cx = 400,
  cy = 300,
) => {
  const sweptAngle = progress * SPREAD * 2;
  if (sweptAngle < 0.01) return;

  const startAngle = angle - SPREAD;
  const currentAngle = startAngle + sweptAngle;
  const bladeWidth = Math.min(BLADE_WIDTH, sweptAngle);

  ctx.save();

  const trailAlpha = 0.32 * (1 - progress * 0.5);
  ctx.beginPath();
  ctx.arc(cx, cy, BLADE_OUTER, startAngle, currentAngle);
  ctx.arc(cx, cy, PLAYER_RADIUS, currentAngle, startAngle, true);
  ctx.closePath();
  ctx.fillStyle = `rgba(160, 210, 255, ${trailAlpha})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, BLADE_OUTER, currentAngle - bladeWidth, currentAngle);
  ctx.arc(cx, cy, PLAYER_RADIUS, currentAngle, currentAngle - bladeWidth, true);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 245, 180, 0.85)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, BLADE_OUTER, currentAngle - bladeWidth, currentAngle);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
};
