import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MainMenu } from './MainMenu';

describe('MainMenu component works as expected', () => {
  it('works', () => {
    render(
      <MemoryRouter>
        <MainMenu />
      </MemoryRouter>,
    );
  });
  it('shows the button for playing', () => {
    render(
      <MemoryRouter>
        <MainMenu />
      </MemoryRouter>,
    );
    setTimeout(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/Play/)).toBeInTheDocument();
    }, 2000);
  });
  it('shows the button for settings', () => {
    render(
      <MemoryRouter>
        <MainMenu />
      </MemoryRouter>,
    );
    setTimeout(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/Settings/)).toBeInTheDocument();
    }, 2000);
  });
});
