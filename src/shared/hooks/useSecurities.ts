import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SecurityServiceContext } from './SecurityServiceContext';
import { filterSecurities } from '../../services/securities/filterSecurities';

export const SECURITIES_QUERY_KEY = ['securities', 'catalog'] as const;
export const SECURITIES_CACHE_MS = 300_000;

export function useSecurities(search = '') {
  const service = useContext(SecurityServiceContext);
  if (!service) throw new Error('AppDataProvider is required to load securities.');

  return useQuery({
    queryKey: SECURITIES_QUERY_KEY,
    queryFn: () => service.getSecurities(),
    select: (catalog) => filterSecurities(catalog, search),
    staleTime: SECURITIES_CACHE_MS,
    gcTime: SECURITIES_CACHE_MS,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false,
  });
}
