import { useGameStore } from '#shared/stores';
import type { GameStateStore } from '#shared/stores';

const initialState: GameStateStore = useGameStore.getState();

export const setMockGameState = (mockState: Partial<GameStateStore>) => {
  useGameStore.setState(
    {
      ...initialState,
      ...mockState,
    },
    true,
  );
};
