import { GameSocket } from './websocket-service';
export type {
  Player,
  WelcomeMessage,
  CombatEventMessage,
  ErrorMessage,
  MessageHandler,
  StateUpdateMessage,
} from './schemas';
export const gameSocket = new GameSocket();
