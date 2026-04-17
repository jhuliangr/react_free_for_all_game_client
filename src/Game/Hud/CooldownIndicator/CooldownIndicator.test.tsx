import { describe, expect, it, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { useSettingsStore } from '#shared/stores';
import { CooldownIndicator } from './CooldownIndicator';

function Harness({ cooldownMs }: { cooldownMs: number }) {
  useSettingsStore.setState({
    characters: [
      {
        id: 'knight',
        name: 'Knight',
        stats: {
          base_hp: 100,
          base_damage: 10,
          attack_range: 150,
          knockback_distance: 50,
          cooldown_ms: cooldownMs,
          dot: false,
        },
      },
    ],
    selectedCharacter: 'knight',
  });
  const ref = useRef(false);
  return <CooldownIndicator cooldownActiveRef={ref} />;
}

describe('CooldownIndicator component works as expected', () => {
  beforeEach(() => {
    useSettingsStore.setState({ selectedCharacter: 'knight' });
  });

  it('returns null when cooldown is zero', () => {
    const { container } = render(<Harness cooldownMs={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders an indicator when cooldown is greater than zero', () => {
    const { container } = render(<Harness cooldownMs={500} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders within a positioned wrapper element', () => {
    const { container } = render(<Harness cooldownMs={500} />);
    const wrapper = container.querySelector('div.absolute');
    expect(wrapper).toBeInTheDocument();
  });
});
