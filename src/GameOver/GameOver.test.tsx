import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { GameOver } from './GameOver';

describe('MainMenu component works as expected', () => {
  it('works', () => {
    render(
      <MemoryRouter>
        <GameOver />
      </MemoryRouter>,
    );
  });
  it('shows the button for playing again', () => {
    render(
      <MemoryRouter>
        <GameOver />
      </MemoryRouter>,
    );
    expect(screen.queryAllByRole('button')[0]).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
  });
  it('shows the button for going back to Main Menu', () => {
    render(
      <MemoryRouter>
        <GameOver />
      </MemoryRouter>,
    );
    expect(screen.queryAllByRole('button')[1]).toBeInTheDocument();
    expect(screen.getByText(/Back to Main Menu/)).toBeInTheDocument();
  });
  it('shows the button for going to settings', () => {
    render(
      <MemoryRouter>
        <GameOver />
      </MemoryRouter>,
    );
    expect(screen.queryAllByRole('button')[2]).toBeInTheDocument();
    expect(screen.getByText(/Settings/)).toBeInTheDocument();
  });
  it('Renders game over text', () => {
    render(
      <MemoryRouter>
        <GameOver />
      </MemoryRouter>,
    );
    expect(screen.getByText('Game Over')).toBeInTheDocument();
  });
});
