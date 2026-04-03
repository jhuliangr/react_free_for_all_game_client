import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { NotFound } from './NotFound';

const meta: Meta<typeof NotFound> = {
  title: 'Pages/NotFound',
  component: NotFound,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};
