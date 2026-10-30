import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { useQueryClient } from '@tanstack/react-query';
import { AppDataProvider } from './AppDataProvider';
import { SessionProvider } from '../features/auth/SessionProvider';
import { useSession } from '../features/auth/SessionContext';
import { useSecurities } from '../shared/hooks/useSecurities';
import type { SecurityService } from '../services/securities/SecurityService';

function Catalog() {
  const { data, isSuccess } = useSecurities();
  return <output aria-label="catalog">{isSuccess ? data.map((security) => security.name).join(', ') : 'Loading'}</output>;
}

function SessionConsumer() {
  const { session, login, logout } = useSession();
  const client = useQueryClient();
  return <>
    <Catalog />
    <output aria-label="advisor">{session?.advisorId ?? 'Logged out'}</output>
    <output aria-label="cache entries">{client.getQueryCache().getAll().length}</output>
    <button onClick={() => login('northstar', 'northstar-emma')}>Emma</button>
    <button onClick={() => login('harborview', 'harborview-noah')}>Noah</button>
    <button onClick={logout}>Logout</button>
  </>;
}

afterEach(() => { localStorage.clear(); });

test('supplies the default mock catalog without requiring a backend', async () => {
  render(<AppDataProvider><Catalog /></AppDataProvider>);
  await waitFor(() => expect(screen.getByLabelText('catalog')).toHaveTextContent('Apple Inc. - Common Stock'));
  expect(screen.getByLabelText('catalog')).toHaveTextContent('Adamas Trust, Inc. - 9.125% Senior Notes Due 2029');
});

test('retains one shared catalog through login, logout, and a different firm/advisor session', async () => {
  const load = vi.fn<SecurityService['getSecurities']>().mockResolvedValue([
    { id: 'test', symbol: 'DEMTST', name: 'Shared Demo Security', type: 'stock', exchange: 'NASDAQ' },
  ]);
  const user = userEvent.setup();
  render(<AppDataProvider securityService={{ getSecurities: load }}><SessionProvider><SessionConsumer /></SessionProvider></AppDataProvider>);
  await waitFor(() => expect(screen.getByLabelText('catalog')).toHaveTextContent('Shared Demo Security'));
  await user.click(screen.getByRole('button', { name: 'Emma' }));
  expect(screen.getByLabelText('advisor')).toHaveTextContent('northstar-emma');
  await user.click(screen.getByRole('button', { name: 'Logout' }));
  expect(screen.getByLabelText('advisor')).toHaveTextContent('Logged out');
  await user.click(screen.getByRole('button', { name: 'Noah' }));
  expect(screen.getByLabelText('advisor')).toHaveTextContent('harborview-noah');
  expect(screen.getByLabelText('catalog')).toHaveTextContent('Shared Demo Security');
  expect(screen.getByLabelText('cache entries')).toHaveTextContent('1');
  expect(load).toHaveBeenCalledTimes(1);
});
