import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { ComingSoon } from './ComingSoon';

const meta: Meta<typeof ComingSoon> = {
  title: 'Pages/ComingSoon',
  component: ComingSoon,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ComingSoon>;

export const Default: Story = {};
