import type {
  GetGameServerInfoResponse,
  Skin,
  Weapon,
  CharacterStats,
} from '#shared/services/game';

export type SettingsStoreState = GetGameServerInfoResponse & {
  selectedCharacter: string;
  selectedSkin: Skin | null;
  unlockedAchievementIds: string[];
  selectedWeapon: Weapon | null;
  setSelectedSkin: (skin: Skin) => void;
  unlockAchievement: (id: string) => boolean;
  setSelectedWeapon: (weapon: Weapon) => void;
  setSettingsFromServer: (settings: GetGameServerInfoResponse) => void;
  setSelectedCharacter: (character: string) => void;
  getSelectedCharacterStats: () => CharacterStats;
};
