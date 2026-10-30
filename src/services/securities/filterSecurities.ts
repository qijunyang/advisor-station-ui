import type { Security } from './types';

export function filterSecurities(catalog: readonly Security[], search: string): readonly Security[] {
  const term = search.trim().toLowerCase();
  if (!term) return catalog;
  return catalog.filter((security) =>
    security.symbol.toLowerCase().includes(term) || security.name.toLowerCase().includes(term),
  );
}
