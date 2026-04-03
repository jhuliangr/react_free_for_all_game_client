import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { GameOver } from './GameOver';

const meta: Meta<typeof GameOver> = {
  title: 'Pages/GameOver',
  component: GameOver,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GameOver>;

export const Default: Story = {};
