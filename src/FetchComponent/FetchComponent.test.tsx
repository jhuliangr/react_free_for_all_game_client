import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchComponent } from './FetchComponent';
import { useGetGameSettings } from './useGetGameSettings';

vi.mock('./useGetGameSettings', () => ({
  useGetGameSettings: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useGetGameSettings).mockReturnValue(null);
});

describe('FetchComponent works as expected', () => {
  it('works', () => {
    render(<FetchComponent />);
  });
  it('Calls the hook', () => {
    expect(useGetGameSettings).toHaveBeenCalled();
  });
  it('renders loading if data is null', () => {
    render(<FetchComponent />);
    expect(screen.getByText('Loading...')).toBeDefined();
  });
});
