import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { SessionProvider } from './SessionProvider';
import { useSession } from './SessionContext';
import { SESSION_KEY } from './storage/sessionStorage';
import type { AuthSession } from './types';

const first: AuthSession = { version: 1, firmId: 'northstar', advisorId: 'northstar-emma', sessionId: 'b7a472b1-0102-4345-8678-123456789abc' };
const second: AuthSession = { version: 1, firmId: 'harborview', advisorId: 'harborview-noah', sessionId: '8d368e4c-0102-4345-8678-123456789abc' };

function Consumer() {
  const { session, error, login, logout, retry } = useSession();
  return <>
    <output>{session ? JSON.stringify(session) : 'Logged out'}</output>
    {error && <p role="alert">{error}</p>}
    <button onClick={() => login('northstar', 'northstar-emma')}>Login</button>
    <button onClick={() => login('northstar', 'harborview-noah')}>Invalid selection</button>
    <button onClick={logout}>Logout</button><button onClick={retry}>Retry</button>
    <button onClick={() => { login('northstar', 'northstar-emma'); login('northstar', 'northstar-emma'); }}>Repeated login</button>
  </>;
}

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

test('requires a provider', () => { expect(() => render(<Consumer />)).toThrow('SessionProvider is required.'); });

test('restores, logs out, creates a fresh login, and reuses repeated submissions', async () => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(first));
  const user = userEvent.setup();
  render(<SessionProvider><Consumer /></SessionProvider>);
  expect(screen.getByRole('status')).toHaveTextContent(first.sessionId);
  await user.click(screen.getByRole('button', { name: 'Logout' }));
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
  const uuid = vi.spyOn(crypto, 'randomUUID').mockReturnValue(second.sessionId as ReturnType<typeof crypto.randomUUID>);
  await user.click(screen.getByRole('button', { name: 'Repeated login' }));
  expect(uuid).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('status')).toHaveTextContent(second.sessionId);
  await user.click(screen.getByRole('button', { name: 'Login' }));
  expect(uuid).toHaveBeenCalledTimes(1);
});

test('rejects advisors from another firm without storing a session', async () => {
  render(<SessionProvider><Consumer /></SessionProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Invalid selection' }));
  expect(screen.getByRole('alert')).toHaveTextContent('belonging to the selected firm');
  expect(localStorage.getItem(SESSION_KEY)).toBeNull();
});

test('blocks restoration if reads fail and recovers after storage is available', async () => {
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  render(<SessionProvider><Consumer /></SessionProvider>);
  expect(screen.getByRole('alert')).toHaveTextContent('Browser storage is unavailable');
  read.mockRestore();
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
});

test('does not claim login when writing fails and can retry', async () => {
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('full'); });
  render(<SessionProvider><Consumer /></SessionProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Login' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to save');
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
  write.mockRestore();
  await userEvent.click(screen.getByRole('button', { name: 'Login' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('northstar-emma');
});

test('keeps the active session and reports failed logout instead of claiming success', async () => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(first));
  const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
  render(<SessionProvider><Consumer /></SessionProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
  expect(screen.getByRole('alert')).toHaveTextContent('shared session is still active');
  expect(screen.getByRole('status')).toHaveTextContent(first.sessionId);
  expect(localStorage.getItem(SESSION_KEY)).not.toBeNull();
  remove.mockRestore();
  await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
});

test('reconciles latest storage on events, focus, and visibility; ignores unrelated keys and unsubscribes', () => {
  const { unmount } = render(<SessionProvider><Consumer /></SessionProvider>);
  localStorage.setItem(SESSION_KEY, JSON.stringify(first));
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated' })));
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
  localStorage.setItem(SESSION_KEY, JSON.stringify(second));
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: SESSION_KEY, newValue: JSON.stringify(first) })));
  expect(screen.getByRole('status')).toHaveTextContent(second.sessionId);
  localStorage.removeItem(SESSION_KEY);
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: null })));
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
  localStorage.setItem(SESSION_KEY, JSON.stringify(first));
  act(() => window.dispatchEvent(new Event('focus')));
  expect(screen.getByRole('status')).toHaveTextContent(first.sessionId);
  localStorage.setItem(SESSION_KEY, 'invalid');
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(screen.getByRole('status')).toHaveTextContent('Logged out');
  const windowRemove = vi.spyOn(window, 'removeEventListener');
  const documentRemove = vi.spyOn(document, 'removeEventListener');
  unmount();
  expect(windowRemove).toHaveBeenCalledWith('storage', expect.any(Function));
  expect(windowRemove).toHaveBeenCalledWith('focus', expect.any(Function));
  expect(documentRemove).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
});
