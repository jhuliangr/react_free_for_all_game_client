import type { Preview } from '@storybook/react';
import '../src/index.css';
import { withGameStore } from './decorators/withGameStore';
import { withGameSettings } from './decorators/withGameSettings';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withGameStore, withGameSettings],
};

export default preview;
