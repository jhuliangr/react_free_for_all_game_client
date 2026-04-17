import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { JoinGameForm } from './JoinGameForm';

describe('JoinGameForm component works as expected', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Join button and name input', () => {
    render(
      <MemoryRouter>
        <JoinGameForm onJoin={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
  });

  it('calls onJoin with the entered name on submit', () => {
    const onJoin = vi.fn();
    render(
      <MemoryRouter>
        <JoinGameForm onJoin={onJoin} />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'Arthur' },
    });
    fireEvent.click(screen.getByText('Join'));
    expect(onJoin).toHaveBeenCalledWith('Arthur');
  });

  it('shows an error toast when submitting without a name', () => {
    const onJoin = vi.fn();
    render(
      <MemoryRouter>
        <JoinGameForm onJoin={onJoin} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Join'));
    expect(
      screen.getByText('Your character must have a name'),
    ).toBeInTheDocument();
    expect(onJoin).not.toHaveBeenCalled();
  });
});
