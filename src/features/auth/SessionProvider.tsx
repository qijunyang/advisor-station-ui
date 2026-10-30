import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { SessionContext } from './SessionContext';
import type { SessionState } from './SessionContext';
import { findAdvisor } from './sessionValidation';
import { readSession, removeSession, SESSION_KEY, writeSession } from './storage/sessionStorage';

function restore(): SessionState {
  try {
    return { session: readSession(), error: null };
  } catch {
    return { session: null, error: 'Browser storage is unavailable. Enable site storage and try again.' };
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(restore);

  function reconcile() {
    setState(restore());
  }

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === SESSION_KEY || event.key === null) reconcile();
    }
    window.addEventListener('storage', sync);
    window.addEventListener('focus', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', reconcile);
      document.removeEventListener('visibilitychange', reconcile);
    };
  }, []);

  function login(firmId: string, advisorId: string) {
    if (!findAdvisor(firmId, advisorId)) {
      setState({ session: null, error: 'Choose an advisor belonging to the selected firm.' });
      return;
    }
    try {
      // Reuse a session another tab (or a repeated click) already established.
      const session = readSession() ?? { version: 1 as const, firmId, advisorId, sessionId: crypto.randomUUID() };
      writeSession(session);
      setState(restore());
    } catch {
      setState({ session: null, error: 'Unable to save your demo session. Check site storage and try again.' });
    }
  }

  function logout() {
    try {
      removeSession();
      reconcile();
    } catch {
      setState((current) => ({ ...current, error: 'Unable to log out. Your shared session is still active. Try again.' }));
    }
  }

  return (
    <SessionContext.Provider value={{ ...state, login, logout, retry: reconcile }}>
      {children}
    </SessionContext.Provider>
  );
}
