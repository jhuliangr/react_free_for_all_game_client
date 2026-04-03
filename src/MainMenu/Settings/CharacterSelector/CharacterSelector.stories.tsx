import type { Meta, StoryObj } from '@storybook/react';
import { CharacterSelector } from '.';

const meta: Meta<typeof CharacterSelector> = {
  title: 'Settings/CharacterSelector',
  component: CharacterSelector,
};

export default meta;

type Story = StoryObj<typeof CharacterSelector>;

export const Default: Story = {};
