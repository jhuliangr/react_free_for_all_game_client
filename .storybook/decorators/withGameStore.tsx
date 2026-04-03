import type { Decorator } from '@storybook/react';
import type { GameStateStore } from '#shared/stores';
import { setMockGameState } from '../mockGameStore';

type StoryParams = {
  gameState?: Partial<GameStateStore>;
};

export const withGameStore: Decorator = (Story, context) => {
  const { gameState } = context.parameters as StoryParams;

  if (gameState) {
    setMockGameState(gameState);
  }

  return <Story />;
};
