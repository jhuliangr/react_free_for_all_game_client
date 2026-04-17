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
  kills: z.number(),
  deaths: z.number(),
  skin: z.string(),
  weapon: z.string(),
  character: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerDiffSchema = PlayerSchema.partial().extend({
  id: z.string(),
});
export type PlayerDiff = z.infer<typeof PlayerDiffSchema>;

export const WelcomeMessageSchema = z.object({
  type: z.literal('welcome'),
  playerId: z.string(),
  player: PlayerSchema,
  serverTick: z.number().optional(),
  serverTime: z.number().optional(),
});

export const StateUpdateMessageSchema = z.object({
  type: z.literal('state_update'),
  players: z.array(PlayerDiffSchema),
  removed: z.array(z.string()).default([]),
  tick: z.number().optional(),
  serverTime: z.number().optional(),
  ackTick: z.number().optional(),
});

export const CombatEventMessageSchema = z.object({
  type: z.literal('combat_event'),
  attackerId: z.string(),
  defenderId: z.string(),
  damage: z.number(),
});

export const ErrorMessageSchema = z.object({
  type: z.literal('error'),
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
