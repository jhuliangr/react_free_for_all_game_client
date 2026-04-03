import type { Decorator } from '@storybook/react';
import type { SettingsStoreState } from '#shared/stores';
import { setMockGameSettings } from '../mockGameSettings';

type StoryParams = {
  gameSettings?: Partial<SettingsStoreState>;
};

export const withGameSettings: Decorator = (Story, context) => {
  const { gameSettings } = context.parameters as StoryParams;

  if (gameSettings) {
    setMockGameSettings(gameSettings);
  }

  return <Story />;
};
