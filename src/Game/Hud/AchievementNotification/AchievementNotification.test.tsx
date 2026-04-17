import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Achivement } from '#shared/services/game';
import { AchievementNotification } from './AchievementNotification';

const achievement: Achivement = {
  id: 'first-kill',
  name: 'First Blood',
  condition: { type: 'kills', value: 1 },
};

describe('AchievementNotification component works as expected', () => {
  it('renders the achievement name', () => {
    render(
      <AchievementNotification
        achievement={achievement}
        onDismiss={() => {}}
      />,
    );
    expect(screen.getByText('First Blood')).toBeInTheDocument();
  });

  it('renders the "Achievement Unlocked" title', () => {
    render(
      <AchievementNotification
        achievement={achievement}
        onDismiss={() => {}}
      />,
    );
    expect(screen.getByText('Achievement Unlocked')).toBeInTheDocument();
  });

  it('invokes onDismiss after the toast duration expires', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <AchievementNotification
        achievement={achievement}
        onDismiss={onDismiss}
      />,
    );
    vi.advanceTimersByTime(4000);
    expect(onDismiss).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
