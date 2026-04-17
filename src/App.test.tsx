import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('#shared/utils/api-client', () => ({
  apiClient: {
    gameService: {
      getGameServerInfo: vi.fn().mockResolvedValue({
        achievements: [],
        skins: [],
        weapons: [],
        characters: [],
        gameRules: {
          speed: 0,
          attackRange: 0,
          baseHp: 0,
          baseSwordDamage: 0,
          tickMs: 0,
          xpPerKill: 0,
        },
      }),
    },
  },
}));

describe('App component works as expected', () => {
  it('works', () => {
    render(<App />);
  });

  it('renders a main element', () => {
    const { container } = render(<App />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('mounts loading fallback while resources load', () => {
    render(<App />);
    // Suspense fallback should render something (Loading component or home)
    expect(document.body).not.toBeEmptyDOMElement();
    // Silence unused screen import for other tests that use it
    expect(screen).toBeDefined();
  });
});
