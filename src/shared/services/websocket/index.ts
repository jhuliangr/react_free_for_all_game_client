import { GameSocket } from './websocket-service';
export type {
  Player,
  PlayerDiff,
  Pickup,
  WelcomeMessage,
  CombatEventMessage,
  ErrorMessage,
  KickedMessage,
  MessageHandler,
  StateUpdateMessage,
} from './schemas';
export const gameSocket = new GameSocket();
