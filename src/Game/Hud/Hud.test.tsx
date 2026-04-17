import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useGameStore } from '#shared/stores';
import { Hud } from './Hud';
import type { Player } from '#shared/services/websocket';

const basePlayer: Player = {
  id: 'me',
  name: 'Me',
  x: 1.2345,
  y: 2.6789,
  hp: 80,
  max_hp: 100,
  level: 2,
  xp: 50,
  kills: 1,
  skin: 'default',
  weapon: 'sword',
  character: 'knight',
};

function Harness(props: {
  leave?: () => void;
  lastUnlockedAchievement?: React.ComponentProps<
    typeof Hud
  >['lastUnlockedAchievement'];
}) {
  const ref = useRef(false);
  return (
    <Hud
      leave={props.leave ?? (() => {})}
      cooldownActiveRef={ref}
      lastUnlockedAchievement={props.lastUnlockedAchievement ?? null}
      onDismissAchievement={() => {}}
    />
  );
}

describe('Hud component works as expected', () => {
  beforeEach(() => {
    useGameStore.setState({
      myPlayerId: 'me',
      players: { me: basePlayer },
      lastCombatEvent: null,
    });
  });

  it('shows the disconnect button', () => {
    render(<Harness />);
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('calls the leave callback when clicking Disconnect', () => {
    const leave = vi.fn();
    render(<Harness leave={leave} />);
    fireEvent.click(screen.getByText('Disconnect'));
    expect(leave).toHaveBeenCalledTimes(1);
  });

  it('shows the achievement notification when provided', () => {
    render(
      <Harness
        lastUnlockedAchievement={{
          id: 'a1',
          name: 'Rising Star',
          condition: { type: 'level', value: 2 },
        }}
      />,
    );
    expect(screen.getByText('Rising Star')).toBeInTheDocument();
  });
});
