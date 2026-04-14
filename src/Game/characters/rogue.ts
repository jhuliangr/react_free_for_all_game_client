import { characterRegistry } from './registry';
import type { CharacterDefinition, RenderContext } from './types';

const PLAYER_RADIUS = 12;
const SPREAD = Math.PI / 4;

/** Tracks slash direction per attacker — alternates left↔right */
const slashDirection: Record<string, boolean> = {};

const rogue: CharacterDefinition = {
  id: 'rogue',
  name: 'Rogue',
  attackDurationMs: 100,

  getSpritePath(skinId) {
    return `${import.meta.env.BASE_URL}assets/sprites/rogue-${skinId ?? 'default'}-sprite.png`;
  },

  getAttackSoundPath() {
    return `${import.meta.env.BASE_URL}assets/sounds/rogue-attack.mp3`;
  },

  getHitSoundPath() {
    return `${import.meta.env.BASE_URL}assets/sounds/rogue-hit.mp3`;
  },

  renderAttack(rc: RenderContext) {
    const { ctx, cx, cy, angle, progress, attackerId } = rc;
    const totalSweep = SPREAD * 1.5;
    const sweptAngle = progress * totalSweep;
    if (sweptAngle < 0.01) return;

    // Alternate direction on each new attack
    if (progress < 0.05) {
      slashDirection[attackerId] = !slashDirection[attackerId];
    }
    const leftToRight = slashDirection[attackerId] ?? true;

    ctx.save();

    const slashRange = 45;
    const alpha = 0.7 * (1 - progress * 0.6);

    let startAngle: number;
    let currentAngle: number;

    if (leftToRight) {
      startAngle = angle - totalSweep / 2;
      currentAngle = startAngle + sweptAngle;
    } else {
      startAngle = angle + totalSweep / 2;
      currentAngle = startAngle - sweptAngle;
    }

    // Slash trail
    const arcStart = Math.min(startAngle, currentAngle);
    const arcEnd = Math.max(startAngle, currentAngle);
    ctx.beginPath();
    ctx.arc(cx, cy, slashRange, arcStart, arcEnd);
    ctx.arc(cx, cy, PLAYER_RADIUS, arcEnd, arcStart, true);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
    ctx.fill();

    // Sharp edge lines
    for (let i = 0; i < 3; i++) {
      const t = (i + 1) / 3;
      const lineAngle = leftToRight
        ? startAngle + sweptAngle * t
        : startAngle - sweptAngle * t;
      ctx.beginPath();
      ctx.moveTo(
        cx + Math.cos(lineAngle) * PLAYER_RADIUS,
        cy + Math.sin(lineAngle) * PLAYER_RADIUS,
      );
      ctx.lineTo(
        cx + Math.cos(lineAngle) * slashRange,
        cy + Math.sin(lineAngle) * slashRange,
      );
      ctx.strokeStyle = `rgba(220, 220, 220, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  },
};

characterRegistry.register(rogue);
