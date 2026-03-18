import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter component works as expected', () => {
  it('works', () => {
    render(<Counter />);
  });
  it('Starts in 0', () => {
    render(<Counter />);
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });
  it('Adds 1', () => {
    render(<Counter />);
    const incrementBtn = screen.getByText('Increment');
    fireEvent.click(incrementBtn);
    expect(screen.getByText('Counter: 1')).toBeInTheDocument();
  });
  it('Substracts 1', () => {
    render(<Counter />);
    const decrementBtn = screen.getByText('Decrement');
    fireEvent.click(decrementBtn);
    expect(screen.getByText('Counter: -1')).toBeInTheDocument();
  });
  it('Clears ', () => {
    render(<Counter />);
    const incrementBtn = screen.getByText('Increment');
    Array.from({ length: 10 }).map(() => {
      fireEvent.click(incrementBtn);
    });
    expect(screen.getByText('Counter: 10')).toBeInTheDocument();
    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });
});
