import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ComingSoon } from './';

describe('ComingSoon component works as expected', () => {
  it('works', () => {
    render(
      <MemoryRouter>
        <ComingSoon />
      </MemoryRouter>,
    );
  });
  it('shows the button for going home', () => {
    render(
      <MemoryRouter>
        <ComingSoon />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Go home')).toBeInTheDocument();
  });
});
