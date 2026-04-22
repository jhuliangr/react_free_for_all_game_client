import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router';

const connect = vi.fn();
const disconnect = vi.fn();
const join = vi.fn();
const onMessage = vi.fn(() => () => {});
const onClose = vi.fn(() => () => {});
const onReconnectFail = vi.fn(() => () => {});
const ping = vi.fn();

vi.mock('#shared/services/websocket', () => ({
  gameSocket: {
    connect: () => connect(),
    disconnect: () => disconnect(),
    join: (...args: unknown[]) => join(...args),
    onMessage: () => onMessage(),
    onClose: () => onClose(),
    onReconnectFail: () => onReconnectFail(),
    ping: (t: number) => ping(t),
  },
}));

import { useSocketSubscribe } from './useSocketSubscribe';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(MemoryRouter, null, children);

describe('useSocketSubscribe hook works as expected', () => {
  it('connects to gameSocket on mount', () => {
    connect.mockClear();
    renderHook(() => useSocketSubscribe(), { wrapper });
    expect(connect).toHaveBeenCalled();
  });

  it('returns the expected API shape', () => {
    const { result } = renderHook(() => useSocketSubscribe(), { wrapper });
    expect(result.current.joined).toBe(false);
    expect(result.current.reconnecting).toBe(false);
    expect(typeof result.current.join).toBe('function');
    expect(typeof result.current.leave).toBe('function');
    expect(typeof result.current.lost).toBe('function');
  });

  it('calls gameSocket.join with the given name when join is invoked', () => {
    join.mockClear();
    const { result } = renderHook(() => useSocketSubscribe(), { wrapper });
    result.current.join('Alice');
    expect(join).toHaveBeenCalledWith('Alice', undefined, expect.any(String));
  });
});
