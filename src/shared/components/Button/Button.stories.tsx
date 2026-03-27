import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '.';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  args: { onClick: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled',
    disabled: true,
  },
};

export const LongLabel: Story = {
  args: {
    variant: 'primary',
    children: 'A button with a much longer label',
  },
};

export const CustomWidth: Story = {
  args: {
    variant: 'secondary',
    children: 'Narrow',
    className: 'w-auto',
  },
};
