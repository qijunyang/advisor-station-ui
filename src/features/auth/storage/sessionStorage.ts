import { validateSession } from '../sessionValidation';
import type { AuthSession } from '../types';

export const SESSION_KEY = 'advisor-station.auth.v1';

export function readSession(): AuthSession | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === null) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
  return validateSession(value);
}

export function writeSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function removeSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
