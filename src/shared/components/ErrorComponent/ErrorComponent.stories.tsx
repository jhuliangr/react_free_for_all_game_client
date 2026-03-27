import type { Meta, StoryObj } from '@storybook/react';
import { ErrorComponent } from '.';

const meta: Meta<typeof ErrorComponent> = {
  title: 'Shared/ErrorComponent',
  component: ErrorComponent,
};

export default meta;
type Story = StoryObj<typeof ErrorComponent>;

export const Default: Story = {};
