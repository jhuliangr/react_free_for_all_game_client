import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useGameStore } from '#shared/stores';
import { LifeAndXpIndicator } from './LifeAndXpIndicator';
import type { Player } from '#shared/services/websocket';

const basePlayer: Player = {
  id: 'me',
  name: 'Me',
  x: 0,
  y: 0,
  hp: 75,
  max_hp: 100,
  level: 3,
  xp: 120,
  kills: 4,
  skin: 'default',
  weapon: 'sword',
  character: 'knight',
};

describe('LifeAndXpIndicator component works as expected', () => {
  beforeEach(() => {
    useGameStore.setState({
      myPlayerId: null,
      players: {},
      lastCombatEvent: null,
    });
  });

  it('renders nothing when there is no player id', () => {
    const { container } = render(<LifeAndXpIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the player HP information', () => {
    useGameStore.setState({ myPlayerId: 'me', players: { me: basePlayer } });
    render(<LifeAndXpIndicator />);
    expect(screen.getByText(/HP: 75 \/ 100/)).toBeInTheDocument();
  });

  it('shows the player kill stats', () => {
    useGameStore.setState({ myPlayerId: 'me', players: { me: basePlayer } });
    render(<LifeAndXpIndicator />);
    expect(screen.getByText(/K: 4/)).toBeInTheDocument();
  });
});
