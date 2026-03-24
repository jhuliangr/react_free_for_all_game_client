import z from 'zod';

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  hp: z.number(),
  max_hp: z.number(),
  level: z.number(),
  xp: z.number(),
  skin: z.string(),
  weapon: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;

export const WelcomeMessageSchema = z.object({
  type: 'welcome',
  playerId: z.string(),
  player: PlayerSchema,
});

export const StateUpdateMessageSchema = z.object({
  type: 'state_update',
  players: z.array(PlayerSchema),
});

export const CombatEventMessageSchema = z.object({
  type: 'combat_event',
  attackerId: z.string(),
  defenderId: z.string(),
  damage: z.number(),
});

export const ErrorMessageSchema = z.object({
  type: 'error',
  reason: z.string(),
});

export type WelcomeMessage = z.infer<typeof WelcomeMessageSchema>;

export type StateUpdateMessage = z.infer<typeof StateUpdateMessageSchema>;

export type CombatEventMessage = z.infer<typeof CombatEventMessageSchema>;

export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;

export type ServerMessage =
  | WelcomeMessage
  | StateUpdateMessage
  | CombatEventMessage
  | ErrorMessage;

export type MessageHandler = (msg: ServerMessage) => void;
