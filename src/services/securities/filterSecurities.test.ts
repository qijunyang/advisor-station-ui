import { expect, test } from 'vitest';
import { filterSecurities } from './filterSecurities';
import type { Security } from './types';

const catalog: readonly Security[] = Object.freeze([
  Object.freeze({ id: 'apple', symbol: 'AAPL', name: 'Apple Inc. - Common Stock', type: 'stock', exchange: 'NASDAQ' } as const),
  Object.freeze({ id: 'microsoft', symbol: 'MSFT', name: 'Microsoft Corporation - Common Stock', type: 'stock', exchange: 'NASDAQ' } as const),
  Object.freeze({ id: 'spy', symbol: 'SPY', name: 'State Street SPDR S&P 500 ETF Trust', type: 'etf', exchange: 'NYSE Arca' } as const),
]);

test.each(['', '   ', '\t\n'])('returns the full catalog for blank search: %j', (search) => {
  expect(filterSecurities(catalog, search)).toBe(catalog);
});

test.each([
  ['aa', ['AAPL']], ['PpLe', ['AAPL']], ['  mSf  ', ['MSFT']],
  ['CORPORATION', ['MSFT']], ['Common Stock', ['AAPL', 'MSFT']],
  ['s&p', ['SPY']], ['no matches', []], ['NASDAQ', []], ['.*', []],
] as const)('matches literal partial symbols or names, ignoring case and outer whitespace: %s', (search, symbols) => {
  expect(filterSecurities(catalog, search).map((security) => security.symbol)).toEqual(symbols);
  expect(catalog.map((security) => security.id)).toEqual(['apple', 'microsoft', 'spy']);
});

test('accepts an empty successful catalog', () => {
  expect(filterSecurities([], 'apple')).toEqual([]);
});
