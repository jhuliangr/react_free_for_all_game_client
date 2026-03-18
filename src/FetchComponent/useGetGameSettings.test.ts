import { renderHook } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useGetGameSettings } from './useGetGameSettings';

vi.mock('#shared/utils/api-client', () => ({
  apiClient: {
    gameService: {
      getGameServerInfo: vi.fn().mockResolvedValue(null),
    },
  },
}));

describe('Hook useGetGameSettings works as expected', () => {
  it('Works', () => {
    renderHook(() => useGetGameSettings());
  });
});
