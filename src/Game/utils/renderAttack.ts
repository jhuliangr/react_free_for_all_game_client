export const renderAttack = (
  ctx: CanvasRenderingContext2D,
  angle: number,
  progress: number,
  cx = 400,
  cy = 300,
) => {
  const spread = Math.PI / 4;
  const startAngle = angle - spread;
  const currentAngle = startAngle + progress * spread * 2;
  const range = 65;

  ctx.save();

  // Wide fading trail arc
  ctx.beginPath();
  ctx.arc(cx, cy, range, startAngle, currentAngle);
  ctx.lineWidth = 12;
  ctx.strokeStyle = `rgba(160, 210, 255, ${0.45 * (1 - progress * 0.4)})`;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Bright thin arc on top (the blade edge)
  ctx.beginPath();
  ctx.arc(cx, cy, range, startAngle, currentAngle);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.stroke();

  // Leading sword blade: line from center to tip
  const tipX = cx + Math.cos(currentAngle) * range;
  const tipY = cy + Math.sin(currentAngle) * range;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(tipX, tipY);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 240, 180, 0.95)';
  ctx.stroke();

  ctx.restore();
};
