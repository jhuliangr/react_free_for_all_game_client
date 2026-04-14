import type { Meta, StoryObj } from '@storybook/react';
import { LifeAndXpIndicator } from '.';
import type { GameStateStore } from '#shared/stores';

const meta: Meta<typeof LifeAndXpIndicator> = {
  title: 'Hud/LifeAndXpIndicator',
  component: LifeAndXpIndicator,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a2e' }],
    },
  },
};

export default meta;

type Story = StoryObj<typeof LifeAndXpIndicator>;

const basePlayer = {
  id: 'player-1',
  name: 'Hero',
  x: 0,
  y: 0,
  kills: 0,
  deaths: 0,
  skin: 'default',
  weapon: 'sword',
  character: 'warrior',
};

export const HealthyFullXp: Story = {
  parameters: {
    gameState: {
      myPlayerId: 'player-1',
      players: {
        'player-1': { ...basePlayer, hp: 100, max_hp: 100, level: 3, xp: 300 },
      },
    } satisfies Partial<GameStateStore>,
  },
};

export const LowHealth: Story = {
  parameters: {
    gameState: {
      myPlayerId: 'player-1',
      players: {
        'player-1': { ...basePlayer, hp: 50, max_hp: 100, level: 2, xp: 80 },
      },
    } satisfies Partial<GameStateStore>,
  },
};

export const HighLevel: Story = {
  parameters: {
    gameState: {
      myPlayerId: 'player-1',
      players: {
        'player-1': { ...basePlayer, hp: 15, max_hp: 100, level: 10, xp: 3500 },
      },
    } satisfies Partial<GameStateStore>,
  },
};
