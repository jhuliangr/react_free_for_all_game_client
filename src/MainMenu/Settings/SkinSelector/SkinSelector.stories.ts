import type { Meta, StoryObj } from '@storybook/react';
import { SkinSelector } from '.';

const meta: Meta<typeof SkinSelector> = {
  title: 'Settings/SkinSelector',
  component: SkinSelector,
};

export default meta;

type Story = StoryObj<typeof SkinSelector>;

export const Default: Story = {};
