import type { Player } from '#shared/services/websocket';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  cx: number;
  cy: number;
  angle: number;
  progress: number;
  attackerId: string;
}

export interface PlayerRenderContext {
  ctx: CanvasRenderingContext2D;
  player: Player;
  sx: number;
  sy: number;
  facingAngle: number;
  hitTime: number | null;
  dotStartTime: number | null;
  isMe: boolean;
}

export interface CharacterDefinition {
  readonly id: string;
  readonly name: string;
  readonly attackDurationMs: number;

  getSpritePath(skinId?: string): string;
  getAttackSoundPath(): string;
  getHitSoundPath(): string;
  renderAttack(rc: RenderContext): void;
  renderPlayerEffect?(prc: PlayerRenderContext): void;
}
