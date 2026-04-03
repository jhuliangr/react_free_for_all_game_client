import { useSettingsStore } from '#shared/stores';
import type { SettingsStoreState } from '#shared/stores';

const initialState: SettingsStoreState = useSettingsStore.getState();

export const setMockGameSettings = (mockState: Partial<SettingsStoreState>) => {
  useSettingsStore.setState(
    {
      ...initialState,
      ...mockState,
    },
    true,
  );
};
