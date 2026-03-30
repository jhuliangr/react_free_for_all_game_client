import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '.';
import { Button } from '../Button';

const meta: Meta<typeof Box> = {
  title: 'Shared/Box',
  component: Box,
};

export default meta;
type Story = StoryObj<typeof Box>;

export const WithText: Story = {
  args: {
    children: 'This is a simple box with some text inside.',
  },
};

export const WithMultipleChildren: Story = {
  render: () => (
    <Box>
      <p>First line of content</p>
      <p>Second line of content</p>
      <p>Third line of content</p>
    </Box>
  ),
};

export const WithButtons: Story = {
  render: () => (
    <Box>
      <p>Choose an action:</p>
      <Button variant="primary">Confirm</Button>
      <Button variant="secondary">Cancel</Button>
    </Box>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Box>
      <label htmlFor="name">Enter your name</label>
      <input
        id="name"
        type="text"
        placeholder="Player name"
        className="px-3 py-1 rounded-md border"
      />
      <Button>Submit</Button>
    </Box>
  ),
};
