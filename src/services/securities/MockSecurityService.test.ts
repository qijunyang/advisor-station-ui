import { expect, expectTypeOf, test } from 'vitest';
import { MockSecurityService } from './MockSecurityService';
import type { SecurityService } from './SecurityService';
import type { Security } from './types';

test('loads a deterministic 40-security metadata snapshot through the readonly asynchronous contract', async () => {
  const service: SecurityService = new MockSecurityService();
  const request = service.getSecurities();
  expect(request).toBeInstanceOf(Promise);
  expectTypeOf(request).toEqualTypeOf<Promise<readonly Security[]>>();
  const catalog = await request;
  expect(catalog).toHaveLength(40);
  expect(new Set(catalog.map((security) => security.id)).size).toBe(40);
  for (const security of catalog) {
    expect(Object.keys(security).sort()).toEqual(['exchange', 'id', 'name', 'symbol', 'type']);
    expect(security.id.trim()).not.toBe('');
    expect(security.symbol.trim()).not.toBe('');
    expect(security.name.trim()).not.toBe('');
    expect(['NASDAQ', 'NYSE Arca']).toContain(security.exchange);
    expect(['stock', 'etf', 'bond']).toContain(security.type);
  }
  for (const [type, count] of [['stock', 20], ['etf', 18], ['bond', 2]] as const) {
    expect(catalog.filter((security) => security.type === type)).toHaveLength(count);
  }
  expect(catalog.find((security) => security.symbol === 'AAPL')).toEqual({ id: 'nasdaq-aapl', symbol: 'AAPL', name: 'Apple Inc. - Common Stock', type: 'stock', exchange: 'NASDAQ' });
  expect(catalog.find((security) => security.symbol === 'SPY')).toMatchObject({ type: 'etf', exchange: 'NYSE Arca' });
  expect(catalog.find((security) => security.symbol === 'AGG')?.type).toBe('etf');
  expect(catalog.find((security) => security.symbol === 'ADAMG')).toMatchObject({ type: 'bond', exchange: 'NASDAQ' });
  expect(await service.getSecurities()).toEqual(catalog);
});

test('does not let callers mutate results or corrupt future seed loads', async () => {
  const service = new MockSecurityService();
  const first = await service.getSecurities();
  expect(Object.isFrozen(first)).toBe(true);
  expect(first.every(Object.isFrozen)).toBe(true);
  expect(() => Reflect.set(first[0]!, 'name', 'Corrupted')).not.toThrow();
  expect(Reflect.set(first[0]!, 'name', 'Corrupted')).toBe(false);
  expect(Reflect.set(first, '0', { id: 'bad' })).toBe(false);
  const second = await service.getSecurities();
  expect(second).toEqual(first);
  expect(second).not.toBe(first);
  expect(second[0]).not.toBe(first[0]);
});
