import { characterRegistry } from '../characters';

export const renderAttack = (
  ctx: CanvasRenderingContext2D,
  angle: number,
  progress: number,
  cx = 400,
  cy = 300,
  characterId = 'knight',
  attackerId = '_self',
) => {
  const charDef = characterRegistry.get(characterId);
  charDef.renderAttack({ ctx, cx, cy, angle, progress, attackerId });
};
