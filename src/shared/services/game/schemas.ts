import z from 'zod';

export const AchivementSchema = z.object({
  id: z.string(),
  name: z.string(),
  condition: z.object({
    type: z.string(),
    value: z.number(),
  }),
});

export type Achivement = z.infer<typeof AchivementSchema>;

export const GameRulesSchema = z.object({
  speed: z.number(),
  attackRange: z.number(),
  baseHp: z.number(),
  baseSwordDamage: z.number(),
  tickMs: z.number(),
  xpPerKill: z.number(),
});

export type GameRules = z.infer<typeof GameRulesSchema>;

export const SkinSchema = z.object({
  id: z.string(),
  name: z.string(),
  unlockCondition: z
    .object({
      type: z.string(),
      value: z.number(),
    })
    .nullable(),
});

export type Skin = z.infer<typeof SkinSchema>;

export const WeaponSchema = z.object({
  id: z.string(),
  name: z.string(),
  unlockCondition: z
    .object({
      type: z.string(),
      value: z.number(),
    })
    .nullable(),
});

export type Weapon = z.infer<typeof WeaponSchema>;

export const DotConfigSchema = z.object({
  damage_per_sec: z.number(),
  duration_sec: z.number(),
});

export const CharacterStatsSchema = z.object({
  base_hp: z.number(),
  base_damage: z.number(),
  attack_range: z.number(),
  knockback_distance: z.number(),
  cooldown_ms: z.number(),
  dot: z.union([z.literal(false), DotConfigSchema]),
});

export type CharacterStats = z.infer<typeof CharacterStatsSchema>;

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  stats: CharacterStatsSchema,
});

export type Character = z.infer<typeof CharacterSchema>;

export const GetGameServerInfoResponseSchema = z.object({
  achievements: z.array(AchivementSchema),
  gameRules: GameRulesSchema,
  skins: z.array(SkinSchema),
  weapons: z.array(WeaponSchema),
  characters: z.array(CharacterSchema),
});

export type GetGameServerInfoResponse = z.infer<
  typeof GetGameServerInfoResponseSchema
>;

export const MatchPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  kills: z.number(),
  xp: z.number(),
  level: z.number(),
});

export type MatchPlayer = z.infer<typeof MatchPlayerSchema>;

export const GetMatchPlayersResponseSchema = z.object({
  type: z.literal('match_players'),
  entries: z.array(MatchPlayerSchema),
});

export type GetMatchPlayersResponse = z.infer<
  typeof GetMatchPlayersResponseSchema
>;
