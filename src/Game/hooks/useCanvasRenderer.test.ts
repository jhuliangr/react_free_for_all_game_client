import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { useCanvasRenderer } from './useCanvasRenderer';

describe('useCanvasRenderer hook works as expected', () => {
  it('can be called with null refs without throwing', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const spriteRef = { current: {} };
    const attackFlashRef = { current: null };
    const activeAttacksRef = { current: {} };
    const bgImageRef = { current: null };
    expect(() =>
      renderHook(() =>
        useCanvasRenderer(
          canvasRef,
          spriteRef,
          attackFlashRef,
          activeAttacksRef,
          bgImageRef,
        ),
      ),
    ).not.toThrow();
  });

  it('schedules an animation frame on mount', () => {
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1);
    renderHook(() =>
      useCanvasRenderer(
        createRef<HTMLCanvasElement>(),
        { current: {} },
        { current: null },
        { current: {} },
        { current: null },
      ),
    );
    expect(raf).toHaveBeenCalled();
    raf.mockRestore();
  });

  it('cancels the animation frame on unmount', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 42);
    const cancel = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});
    const { unmount } = renderHook(() =>
      useCanvasRenderer(
        createRef<HTMLCanvasElement>(),
        { current: {} },
        { current: null },
        { current: {} },
        { current: null },
      ),
    );
    unmount();
    expect(cancel).toHaveBeenCalledWith(42);
  });
});
