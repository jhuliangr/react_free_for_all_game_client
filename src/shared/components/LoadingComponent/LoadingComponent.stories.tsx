import type { Meta, StoryObj } from '@storybook/react';
import { LoadingComponent } from '.';

const meta: Meta<typeof LoadingComponent> = {
  title: 'Shared/LoadingComponent',
  component: LoadingComponent,
  argTypes: {
    size: {
      control: 'select',
      options: ['huge', 'medium', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingComponent>;

export const Huge: Story = {
  args: { size: 'huge' },
};

export const Medium: Story = {
  args: { size: 'medium' },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingComponent size="huge" />
      <LoadingComponent size="medium" />
      <LoadingComponent size="small" />
    </div>
  ),
};
