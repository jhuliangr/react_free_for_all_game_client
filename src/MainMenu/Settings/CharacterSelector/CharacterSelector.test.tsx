import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSettingsStore } from '#shared/stores';
import { CharacterSelector } from './CharacterSelector';

const baseStats = {
  base_hp: 100,
  base_damage: 10,
  attack_range: 150,
  knockback_distance: 50,
  cooldown_ms: 400,
  dot: false as const,
};

describe('CharacterSelector component works as expected', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      characters: [
        { id: 'knight', name: 'Knight', stats: baseStats },
        { id: 'mage', name: 'Mage', stats: baseStats },
      ],
      selectedCharacter: 'knight',
    });
  });

  it('renders all available characters', () => {
    render(<CharacterSelector />);
    expect(screen.getByText('Knight')).toBeInTheDocument();
    expect(screen.getByText('Mage')).toBeInTheDocument();
  });

  it('updates the selected character when clicking one', () => {
    render(<CharacterSelector />);
    fireEvent.click(screen.getByText('Mage'));
    expect(useSettingsStore.getState().selectedCharacter).toBe('mage');
  });

  it('shows stat labels for each character', () => {
    render(<CharacterSelector />);
    expect(screen.getAllByText('HP').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ATK').length).toBeGreaterThan(0);
  });
});
