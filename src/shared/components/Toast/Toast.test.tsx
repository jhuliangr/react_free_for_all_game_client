import { describe, expect, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Toast } from '.';

describe('Toast component works as expected', () => {
  it('renders the title and message', () => {
    render(<Toast title="Alert" message="Hello world" onDismiss={() => {}} />);
    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('calls onDismiss after the default duration', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Alert" message="Bye" onDismiss={onDismiss} />);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('respects a custom duration prop', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <Toast
        title="Alert"
        message="Custom"
        onDismiss={onDismiss}
        duration={1000}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
