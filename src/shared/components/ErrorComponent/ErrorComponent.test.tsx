import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorComponent } from './';

describe('ErrorComponent component works as expected', () => {
  it('works', () => {
    render(<ErrorComponent />);
  });
  it('shows the button for refreshing', () => {
    render(<ErrorComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });
});
