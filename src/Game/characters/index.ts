export type {
  CharacterDefinition,
  RenderContext,
  PlayerRenderContext,
} from './types';
export { characterRegistry } from './registry';

// Side-effect imports: register all built-in characters
import './knight';
import './mage';
import './rogue';
import './golem';
