import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useGameStore } from '#shared/stores';
import { EventLog } from './EventLog';

const basePlayer = {
  id: 'me',
  name: 'Me',
  x: 0,
  y: 0,
  hp: 100,
  max_hp: 100,
  level: 1,
  xp: 0,
  kills: 0,
  deaths: 0,
  skin: 'default',
  weapon: 'sword',
  character: 'knight',
};

describe('EventLog component works as expected', () => {
  beforeEach(() => {
    useGameStore.setState({
      myPlayerId: 'me',
      players: { me: basePlayer },
      lastCombatEvent: null,
    });
  });

  it('renders nothing when there is no combat event', () => {
    const { container } = render(<EventLog />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a "Hit" message when the player is the attacker', () => {
    useGameStore.setState({
      lastCombatEvent: {
        type: 'combat_event',
        attackerId: 'me',
        defenderId: 'enemy',
        damage: 12.5,
      },
    });
    render(<EventLog />);
    expect(screen.getByText(/Hit 12\.5 damage/)).toBeInTheDocument();
  });

  it('renders a "Received" message when the player is the defender', () => {
    useGameStore.setState({
      lastCombatEvent: {
        type: 'combat_event',
        attackerId: 'enemy',
        defenderId: 'me',
        damage: 8.2,
      },
    });
    render(<EventLog />);
    expect(screen.getByText(/Received 8\.2 damage/)).toBeInTheDocument();
  });
});
