import { afterEach, expect, test, vi } from 'vitest';
import { readSession, removeSession, SESSION_KEY, writeSession } from './sessionStorage';
import type { AuthSession } from '../types';

const session: AuthSession = { version: 1, firmId: 'northstar', advisorId: 'northstar-emma', sessionId: 'b7a472b1-0102-4345-8678-123456789abc' };

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

test('reads, writes, and removes only the namespaced entry', () => {
  localStorage.setItem('unrelated', 'keep');
  expect(readSession()).toBeNull();
  writeSession(session);
  expect(readSession()).toEqual(session);
  expect(JSON.parse(localStorage.getItem(SESSION_KEY)!)).toEqual(session);
  removeSession();
  expect(readSession()).toBeNull();
  expect(localStorage.getItem('unrelated')).toBe('keep');
});

test.each(['{broken', 'null', '{}'])('treats invalid stored data as logged out: %s', (raw) => {
  localStorage.setItem(SESSION_KEY, raw);
  expect(readSession()).toBeNull();
});

test('propagates storage errors so callers cannot claim successful persistence', () => {
  for (const [method, action] of [['getItem', () => readSession()], ['setItem', () => writeSession(session)], ['removeItem', () => removeSession()]] as const) {
    const spy = vi.spyOn(Storage.prototype, method).mockImplementation(() => { throw new Error('blocked'); });
    expect(action).toThrow('blocked');
    spy.mockRestore();
  }
});
