import type { Meta, StoryObj } from '@storybook/react';
import { EventLog } from '.';
import type { GameStateStore } from '#shared/stores';

const meta: Meta<typeof EventLog> = {
  title: 'Hud/EventLog',
  component: EventLog,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a2e' }],
    },
  },
};

export default meta;

type Story = StoryObj<typeof EventLog>;

export const Hit: Story = {
  parameters: {
    gameState: {
      myPlayerId: 'player-1',
      lastCombatEvent: {
        defenderId: 'player-2',
        type: 'combat_event',
        attackerId: 'player-1',
        damage: 12.5,
      },
    } satisfies Partial<GameStateStore>,
  },
};

export const Received: Story = {
  parameters: {
    gameState: {
      myPlayerId: 'player-1',
      lastCombatEvent: {
        defenderId: 'player-2',
        type: 'combat_event',
        attackerId: 'enemy-1',
        damage: 8.2,
      },
    } satisfies Partial<GameStateStore>,
  },
};

export const Empty: Story = {
  parameters: {
    gameState: {
      myPlayerId: 'player-1',
      lastCombatEvent: null,
    } satisfies Partial<GameStateStore>,
  },
};
