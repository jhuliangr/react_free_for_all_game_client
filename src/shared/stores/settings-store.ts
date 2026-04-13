import type { CharacterStats } from '#shared/services/game';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsStoreState } from './types/SettingsStoreState';

const DEFAULT_STATS: CharacterStats = {
  base_hp: 100,
  base_damage: 10,
  attack_range: 150,
  knockback_distance: 50,
  cooldown_ms: 334,
  dot: false,
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      characters: [{ id: '', name: '', stats: DEFAULT_STATS }],
      selectedCharacter: 'knight',
      selectedSkin: null,
      unlockedAchievementIds: [],
      selectedWeapon: null,
      achievements: [],
      gameRules: {
        attackRange: 0,
        baseHp: 0,
        baseSwordDamage: 0,
        speed: 0,
        tickMs: 0,
        xpPerKill: 0,
      },
      skins: [],
      weapons: [],
      setSettingsFromServer: (settings) =>
        set({
          achievements: settings.achievements,
          gameRules: settings.gameRules,
          skins: settings.skins,
          weapons: settings.weapons,
          characters: settings.characters,
        }),
      getSelectedCharacterStats: () => {
        const { characters, selectedCharacter } = get();
        const found = characters.find((c) => c.id === selectedCharacter);
        return found?.stats ?? DEFAULT_STATS;
      },
      setSelectedSkin: (skin) =>
        set({
          selectedSkin: skin,
        }),
      setSelectedWeapon: (weapon) =>
        set({
          selectedWeapon: weapon,
        }),
      unlockAchievement: (id) => {
        const { unlockedAchievementIds } = get();
        if (unlockedAchievementIds.includes(id)) {
          return false;
        }
        set({ unlockedAchievementIds: [...unlockedAchievementIds, id] });
        return true;
      },
      setSelectedCharacter: (character) =>
        set({
          selectedCharacter: character,
        }),
    }),
    {
      name: 'settings-storage',
    },
  ),
);
