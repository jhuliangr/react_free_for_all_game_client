import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Joystick } from './Joystick';

function getBase(container: HTMLElement) {
  return container.querySelector('div.absolute') as HTMLDivElement;
}

describe('Joystick component works as expected', () => {
  it('renders a base and a knob element', () => {
    const { container } = render(<Joystick side="left" onMove={() => {}} />);
    const base = getBase(container);
    expect(base).toBeInTheDocument();
    expect(base.querySelector('div')).toBeInTheDocument();
  });

  it('positions the base on the left for side="left"', () => {
    const { container } = render(<Joystick side="left" onMove={() => {}} />);
    expect(getBase(container)).toHaveStyle({ left: '50px' });
  });

  it('calls onMove(0, 0) and onEnd when a touch ends', () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    const { container } = render(
      <Joystick side="right" onMove={onMove} onEnd={onEnd} />,
    );
    const base = getBase(container);
    fireTouch(base, 'touchstart', [
      { identifier: 1, clientX: 100, clientY: 100 },
    ]);
    fireTouch(base, 'touchend', [
      { identifier: 1, clientX: 100, clientY: 100 },
    ]);
    expect(onMove).toHaveBeenLastCalledWith(0, 0);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });
});

function fireTouch(
  el: HTMLElement,
  type: 'touchstart' | 'touchend',
  touches: Array<{ identifier: number; clientX: number; clientY: number }>,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, {
    changedTouches: touches,
    touches,
    targetTouches: touches,
  });
  el.dispatchEvent(event);
}
