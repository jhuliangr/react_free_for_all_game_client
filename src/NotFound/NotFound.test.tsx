import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NotFound } from './';

describe('NotFound component works as expected', () => {
  it('works', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
  });
  it('shows the button for going home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Go home')).toBeInTheDocument();
  });
});
