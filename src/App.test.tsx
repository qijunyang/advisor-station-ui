import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import App from './App';
import { AppRoutes } from './app/AppRoutes';
import { SessionProvider } from './features/auth/SessionProvider';
import { SESSION_KEY } from './features/auth/storage/sessionStorage';

const session = { version: 1, firmId: 'northstar', advisorId: 'northstar-emma', sessionId: 'b7a472b1-0102-4345-8678-123456789abc' };

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

function renderRoute(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><SessionProvider><AppRoutes /></SessionProvider></MemoryRouter>);
}

test('redirects to login, filters advisors by firm, and opens the Dashboard workspace', async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Advisor Station UI' })).toBeVisible();
  expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Emma Parker' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Northstar Advisory/ }));
  expect(screen.getByRole('button', { name: 'Emma Parker' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Liam Bennett' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Olivia Hayes' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: /Harborview Wealth/ }));
  expect(screen.queryByRole('button', { name: 'Emma Parker' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ava Collins' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Ethan Reed' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Noah Brooks' }));
  expect(await screen.findByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  expect(within(screen.getByRole('banner')).getByText('Noah Brooks')).toBeVisible();
  expect(screen.getByRole('navigation', { name: 'Workspace navigation' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('main')).toHaveTextContent('Your dashboard is ready');
  await user.click(screen.getByRole('button', { name: 'Logout' }));
  expect(await screen.findByRole('heading', { name: 'Advisor Station UI' })).toBeVisible();
  expect(localStorage.getItem(SESSION_KEY)).toBeNull();
});

test.each(['/login', '/', '/workspace'])('restores the selected advisor from %s', async (path) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  renderRoute(path);
  expect(await screen.findByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  expect(screen.getByText('Emma Parker')).toBeVisible();
});

test('guards unknown paths while logged out and adopts a login from another tab', async () => {
  renderRoute('/missing');
  expect(await screen.findByRole('heading', { name: 'Advisor Station UI' })).toBeVisible();
  act(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new StorageEvent('storage', { key: SESSION_KEY }));
  });
  expect(await screen.findByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
});

test('shows not-found inside the authenticated shell and recovers through Dashboard', async () => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  renderRoute('/workspace/missing');
  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await userEvent.click(screen.getByRole('link', { name: 'Return to Dashboard' }));
  expect(await screen.findByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
});

test('guards storage read failure and allows retry after storage recovers', async () => {
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  renderRoute('/workspace');
  expect(screen.getByRole('heading', { name: 'Session unavailable' })).toBeVisible();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  read.mockRestore();
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('heading', { name: 'Advisor Station UI' })).toBeVisible();
});

test('shows a recoverable login storage error without entering the workspace', async () => {
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  renderRoute('/login');
  expect(screen.getByRole('alert')).toHaveTextContent('Browser storage is unavailable');
  read.mockRestore();
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('shows failed logout in the workspace and keeps the advisor until removal succeeds', async () => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
  renderRoute('/workspace');
  await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to log out');
  expect(screen.getByText('Emma Parker')).toBeVisible();
  remove.mockRestore();
  await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
  expect(await screen.findByRole('heading', { name: 'Advisor Station UI' })).toBeVisible();
});

test('navigates through Dashboard, Models, and Portfolios and resets model selection on leaving', async () => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  const user = userEvent.setup();
  renderRoute('/workspace');
  const navigation = screen.getByRole('navigation', { name: 'Workspace navigation' });
  expect(within(navigation).getAllByRole('link').map((link) => link.textContent)).toEqual(['Dashboard', 'Models', 'Portfolios']);
  await user.click(within(navigation).getByRole('link', { name: 'Models' }));
  expect(screen.getByRole('heading', { name: 'Models' })).toBeVisible();
  expect(within(navigation).getByRole('link', { name: 'Models' })).toHaveAttribute('aria-current', 'page');
  await user.click(screen.getByRole('checkbox', { name: 'Select Balanced Research' }));
  expect(screen.getByRole('status')).toHaveTextContent('1 of 12 selected');
  await user.click(within(navigation).getByRole('link', { name: 'Portfolios' }));
  expect(screen.getByRole('heading', { name: 'Portfolios' })).toBeVisible();
  expect(within(navigation).getByRole('link', { name: 'Portfolios' })).toHaveAttribute('aria-current', 'page');
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  await user.click(within(navigation).getByRole('link', { name: 'Models' }));
  expect(screen.getByRole('status')).toHaveTextContent('0 of 12 selected');
});

test('resets selected rows when the shared session is replaced in another tab', async () => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  renderRoute('/workspace/models');
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select Balanced Research' }));
  act(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, firmId: 'harborview', advisorId: 'harborview-noah', sessionId: '8d368e4c-0102-4345-8678-123456789abc' }));
    window.dispatchEvent(new StorageEvent('storage', { key: SESSION_KEY }));
  });
  expect(screen.getByText('Noah Brooks')).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('0 of 12 selected');
});
