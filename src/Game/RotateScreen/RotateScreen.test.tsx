import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RotateScreen } from './RotateScreen';

function mockOrientation(isPortrait: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('portrait') ? isPortrait : !isPortrait,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
}

describe('RotateScreen component works as expected', () => {
  beforeEach(() => {
    mockOrientation(true);
  });

  it('returns null when not on mobile', () => {
    const { container } = render(<RotateScreen isMobile={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the rotate message on mobile in portrait orientation', () => {
    render(<RotateScreen isMobile={true} />);
    expect(screen.getByText('Rotate your device')).toBeInTheDocument();
  });

  it('shows the landscape hint on mobile in portrait orientation', () => {
    render(<RotateScreen isMobile={true} />);
    expect(
      screen.getByText('This game requires landscape mode'),
    ).toBeInTheDocument();
  });
});
