/**
 * @jest-environment jsdom
 */
import React from 'react';
import {renderHook, act} from '@testing-library/react';
import {useApiRequest} from '@/hooks/useApiRequest';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';

// ── Mock fetch globally ──────────────────────────────────────
const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Fake timers for setInterval ──────────────────────────────
beforeEach(() => {
  jest.useFakeTimers();
  mockFetch.mockReset();
  useAppStore.setState({...INITIAL_STATE});
});

afterEach(() => {
  jest.useRealTimers();
});

/** Simulate a successful fetch response. */
function mockSuccess(body: string, status = 200, statusText = 'OK') {
  mockFetch.mockResolvedValue({
    status,
    statusText,
    ok: status >= 200 && status < 300,
    text: async () => body,
    headers: {entries: () => [['content-type', 'application/json']]},
  } as unknown as Response);
}

/** Simulate a network error. */
function mockNetworkError() {
  mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
}

// ──────────────────────────────────────────────────────────────
// GREEN — success path
// ──────────────────────────────────────────────────────────────
describe('useApiRequest — GREEN — success path', () => {
  it('sets loading=true at the start and false after completion', async () => {
    // Use a promise we control so we can observe the in-flight state
    let resolveFetch!: (v: unknown) => void;
    mockFetch.mockReturnValue(
      new Promise((res) => {
        resolveFetch = res;
      }),
    );
    const {result} = renderHook(() => useApiRequest());

    // Fire but do not await — send() is now awaiting fetch
    act(() => {
      void result.current.send();
    });
    expect(useAppStore.getState().loading).toBe(true);

    // Resolve the fetch so the hook can finish
    await act(async () => {
      resolveFetch({
        status: 200,
        statusText: 'OK',
        ok: true,
        text: async () => '{}',
        headers: {entries: () => []},
      });
      await Promise.resolve();
    });
  });

  it('sets loading=false after request completes', async () => {
    mockSuccess('{"id":1}');
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().loading).toBe(false);
  });

  it('stores response body in the store', async () => {
    mockSuccess('{"id":1}');
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    const response = useAppStore.getState().response;
    expect(response).not.toBeNull();
    expect(response?.body).toBe('{"id":1}');
  });

  it('stores response status in the store', async () => {
    mockSuccess('{}', 201, 'Created');
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().response?.status).toBe(201);
  });

  it('pushes a history entry after successful request', async () => {
    mockSuccess('{}');
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().history).toHaveLength(1);
  });

  it('switches respTab to body after success', async () => {
    mockSuccess('{}');
    useAppStore.setState({respTab: 'raw'});
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().respTab).toBe('body');
  });

  it('response note is null on a live success', async () => {
    mockSuccess('{}');
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().response?.note).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// RED — network error path
// ──────────────────────────────────────────────────────────────
describe('useApiRequest — RED — network error', () => {
  it('sets response with ok=false on network error', async () => {
    mockNetworkError();
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    const response = useAppStore.getState().response;
    expect(response).not.toBeNull();
    expect(response?.ok).toBe(false);
    expect(response?.status).toBe(0);
  });

  it('sets a descriptive note on network error', async () => {
    mockNetworkError();
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().response?.note).toBeTruthy();
  });

  it('does not push a history entry on network error', async () => {
    mockNetworkError();
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().history).toHaveLength(0);
  });

  it('loading is false after fallback', async () => {
    mockNetworkError();
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(useAppStore.getState().loading).toBe(false);
  });

  it('does not call fetch again if already loading', async () => {
    mockSuccess('{}');
    useAppStore.setState({loading: true});
    const {result} = renderHook(() => useApiRequest());

    await act(async () => {
      await result.current.send();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
