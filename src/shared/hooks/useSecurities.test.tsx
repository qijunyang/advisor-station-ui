import { act, cleanup, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Security } from '../../services/securities/types';
import type { SecurityService } from '../../services/securities/SecurityService';
import { SecurityServiceContext } from './SecurityServiceContext';
import { SECURITIES_CACHE_MS, SECURITIES_QUERY_KEY, useSecurities } from './useSecurities';
import { MockSecurityService } from '../../services/securities/MockSecurityService';

const catalog: readonly Security[] = [{ id: 'test-stock', symbol: 'DEMTST', name: 'Test Demo Stock', type: 'stock', exchange: 'NASDAQ' }];
const updated: readonly Security[] = [{ id: 'test-bond', symbol: 'DEMTB', name: 'Test Demo Bond', type: 'bond', exchange: 'NASDAQ' }];
const clients: QueryClient[] = [];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((success, failure) => { resolve = success; reject = failure; });
  return { promise, resolve, reject };
}

function setup(service: SecurityService) {
  const client = new QueryClient();
  clients.push(client);
  function wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}><SecurityServiceContext.Provider value={service}>{children}</SecurityServiceContext.Provider></QueryClientProvider>;
  }
  return { client, wrapper };
}

async function flush() {
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-30T12:00:00Z'));
  focusManager.setFocused(true);
  onlineManager.setOnline(true);
});

afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
  focusManager.setFocused(undefined);
  onlineManager.setOnline(true);
  vi.useRealTimers();
});

test('requires the application service provider', () => {
  expect(() => renderHook(() => useSecurities())).toThrow('AppDataProvider is required');
});

test('deduplicates concurrent consumers and reuses fresh results on remount', async () => {
  const request = deferred<readonly Security[]>();
  const load = vi.fn(() => request.promise);
  const { wrapper } = setup({ getSecurities: load });
  const first = renderHook(() => ({ ...useSecurities() }), { wrapper });
  const second = renderHook(() => ({ ...useSecurities() }), { wrapper });
  expect(load).toHaveBeenCalledTimes(1);
  expect(first.result.current.isLoading).toBe(true);
  expect(first.result.current.data).toBeUndefined();
  request.resolve(catalog);
  await flush();
  expect(first.result.current.data).toEqual(catalog);
  expect(second.result.current.data).toEqual(catalog);
  first.unmount(); second.unmount();
  const third = renderHook(() => ({ ...useSecurities() }), { wrapper });
  expect(third.result.current.data).toEqual(catalog);
  expect(load).toHaveBeenCalledTimes(1);
});

test('measures freshness from completion and refetches on mount exactly at 300 seconds', async () => {
  const request = deferred<readonly Security[]>();
  const load = vi.fn<SecurityService['getSecurities']>().mockReturnValueOnce(request.promise).mockResolvedValue(updated);
  const { client, wrapper } = setup({ getSecurities: load });
  const initial = renderHook(() => ({ ...useSecurities() }), { wrapper });
  await act(async () => { await vi.advanceTimersByTimeAsync(20_000); });
  request.resolve(catalog);
  await flush();
  const completedAt = client.getQueryState(SECURITIES_QUERY_KEY)!.dataUpdatedAt;
  vi.setSystemTime(completedAt + 299_999);
  const fresh = renderHook(() => ({ ...useSecurities() }), { wrapper });
  expect(fresh.result.current.isStale).toBe(false);
  expect(load).toHaveBeenCalledTimes(1);
  vi.setSystemTime(completedAt + 300_000);
  const stale = renderHook(() => ({ ...useSecurities() }), { wrapper });
  expect(stale.result.current.data).toEqual(catalog);
  expect(stale.result.current.isStale).toBe(true);
  expect(load).toHaveBeenCalledTimes(2);
  await flush();
  expect(initial.result.current.data).toEqual(updated);
});

test('does not poll when time expires, but refreshes stale active data on focus and reconnect', async () => {
  const load = vi.fn<SecurityService['getSecurities']>().mockResolvedValue(catalog);
  const { wrapper } = setup({ getSecurities: load });
  renderHook(() => ({ ...useSecurities() }), { wrapper });
  await flush();
  await act(async () => { await vi.advanceTimersByTimeAsync(SECURITIES_CACHE_MS + 1); });
  expect(load).toHaveBeenCalledTimes(1);
  act(() => { focusManager.setFocused(false); focusManager.setFocused(true); });
  await flush();
  expect(load).toHaveBeenCalledTimes(2);
  await act(async () => { await vi.advanceTimersByTimeAsync(SECURITIES_CACHE_MS + 1); });
  act(() => { onlineManager.setOnline(false); onlineManager.setOnline(true); });
  await flush();
  expect(load).toHaveBeenCalledTimes(3);
});

test('explicit refetch works while fresh, exposes background refreshing, and replaces data', async () => {
  const refresh = deferred<readonly Security[]>();
  const load = vi.fn<SecurityService['getSecurities']>().mockResolvedValueOnce(catalog).mockReturnValueOnce(refresh.promise);
  const { wrapper } = setup({ getSecurities: load });
  const { result } = renderHook(() => ({ ...useSecurities() }), { wrapper });
  await flush();
  act(() => { void result.current.refetch(); });
  await flush();
  expect(result.current.data).toEqual(catalog);
  expect(result.current.isFetching).toBe(true);
  expect(result.current.isLoading).toBe(false);
  refresh.resolve(updated);
  await flush();
  expect(result.current.data).toEqual(updated);
  expect(result.current.isFetching).toBe(false);
});

test('caches empty success without treating it as failure', async () => {
  const load = vi.fn<SecurityService['getSecurities']>().mockResolvedValue([]);
  const { wrapper } = setup({ getSecurities: load });
  const first = renderHook(() => ({ ...useSecurities() }), { wrapper });
  await flush();
  expect(first.result.current.isSuccess).toBe(true);
  expect(first.result.current.data).toEqual([]);
  renderHook(() => ({ ...useSecurities() }), { wrapper });
  expect(load).toHaveBeenCalledTimes(1);
});

test('exposes initial failure without successful data or automatic retries and supports retry', async () => {
  const error = new Error('Catalog unavailable');
  const load = vi.fn<SecurityService['getSecurities']>().mockRejectedValueOnce(error).mockResolvedValue(catalog);
  const { wrapper } = setup({ getSecurities: load });
  const { result } = renderHook(() => ({ ...useSecurities() }), { wrapper });
  await flush();
  expect(result.current.isLoadingError).toBe(true);
  expect(result.current.error).toBe(error);
  expect(result.current.data).toBeUndefined();
  await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
  expect(load).toHaveBeenCalledTimes(1);
  await act(async () => { await result.current.refetch(); });
  await flush();
  expect(result.current.isSuccess).toBe(true);
  expect(result.current.error).toBeNull();
});

test('retains successful data and its age when refresh fails, then recovers', async () => {
  const refresh = deferred<readonly Security[]>();
  const load = vi.fn<SecurityService['getSecurities']>().mockResolvedValueOnce(catalog).mockReturnValueOnce(refresh.promise).mockResolvedValue(updated);
  const { client, wrapper } = setup({ getSecurities: load });
  const { result } = renderHook(() => ({ ...useSecurities() }), { wrapper });
  await flush();
  const completedAt = client.getQueryState(SECURITIES_QUERY_KEY)!.dataUpdatedAt;
  act(() => { void result.current.refetch(); });
  await flush();
  refresh.reject(new Error('Refresh failed'));
  await flush();
  expect(result.current.data).toEqual(catalog);
  expect(result.current.isRefetchError).toBe(true);
  expect(result.current.error?.message).toBe('Refresh failed');
  expect(client.getQueryState(SECURITIES_QUERY_KEY)!.dataUpdatedAt).toBe(completedAt);
  await act(async () => { await result.current.refetch(); });
  await flush();
  expect(result.current.data).toEqual(updated);
  expect(result.current.isRefetchError).toBe(false);
});

test('collects inactive data after 300 seconds separately from freshness and loads again', async () => {
  const load = vi.fn<SecurityService['getSecurities']>().mockResolvedValue(catalog);
  const { client, wrapper } = setup({ getSecurities: load });
  const first = renderHook(() => ({ ...useSecurities() }), { wrapper });
  await flush();
  first.unmount();
  await act(async () => { await vi.advanceTimersByTimeAsync(299_999); });
  expect(client.getQueryData(SECURITIES_QUERY_KEY)).toEqual(catalog);
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(client.getQueryData(SECURITIES_QUERY_KEY)).toBeUndefined();
  renderHook(() => ({ ...useSecurities() }), { wrapper });
  await flush();
  expect(load).toHaveBeenCalledTimes(2);
});

test('separate cache instances load independently', async () => {
  const load = vi.fn<SecurityService['getSecurities']>().mockResolvedValue(catalog);
  renderHook(() => ({ ...useSecurities() }), { wrapper: setup({ getSecurities: load }).wrapper });
  renderHook(() => ({ ...useSecurities() }), { wrapper: setup({ getSecurities: load }).wrapper });
  await flush();
  expect(load).toHaveBeenCalledTimes(2);
});

test('filters partial symbol/name searches locally without changing or refetching the full cached catalog', async () => {
  const service = new MockSecurityService();
  const load = vi.fn(() => service.getSecurities());
  const { client, wrapper } = setup({ getSecurities: load });
  const { result, rerender } = renderHook(({ search }) => ({ ...useSecurities(search) }), {
    wrapper, initialProps: { search: '  aAp  ' },
  });
  await flush();
  expect(result.current.data?.map((security) => security.symbol)).toEqual(['AAPL']);
  rerender({ search: 'MICROSOFT' });
  expect(result.current.data?.map((security) => security.symbol)).toEqual(['MSFT']);
  rerender({ search: 'no such security' });
  expect(result.current.isSuccess).toBe(true);
  expect(result.current.data).toEqual([]);
  rerender({ search: '' });
  expect(result.current.data).toHaveLength(40);
  expect(client.getQueryData<readonly Security[]>(SECURITIES_QUERY_KEY)).toHaveLength(40);
  expect(client.getQueryCache().getAll()).toHaveLength(1);
  expect(load).toHaveBeenCalledTimes(1);
});

test('concurrent consumers apply independent filters to one shared in-flight load', async () => {
  const request = deferred<readonly Security[]>();
  const load = vi.fn(() => request.promise);
  const { wrapper } = setup({ getSecurities: load });
  const first = renderHook(() => ({ ...useSecurities('AAPL') }), { wrapper });
  const second = renderHook(() => ({ ...useSecurities('Microsoft') }), { wrapper });
  request.resolve(await new MockSecurityService().getSecurities());
  await flush();
  expect(first.result.current.data?.map((security) => security.symbol)).toEqual(['AAPL']);
  expect(second.result.current.data?.map((security) => security.symbol)).toEqual(['MSFT']);
  expect(load).toHaveBeenCalledTimes(1);
});
