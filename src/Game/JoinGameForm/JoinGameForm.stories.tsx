import type { Meta, StoryObj } from '@storybook/react';
import { JoinGameForm } from '.';
import { MemoryRouter } from 'react-router';

const meta: Meta<typeof JoinGameForm> = {
  title: 'Game/JoinGameForm',
  component: JoinGameForm,
  decorators: [
    () => (
      <MemoryRouter>
        <JoinGameForm onJoin={() => {}} />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof JoinGameForm>;

export const Default: Story = {};
