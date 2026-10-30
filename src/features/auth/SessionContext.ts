import { createContext, useContext } from 'react';
import type { AuthSession } from './types';

export interface SessionState {
  session: AuthSession | null;
  error: string | null;
}

interface SessionContextValue extends SessionState {
  login: (firmId: string, advisorId: string) => void;
  logout: () => void;
  retry: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('SessionProvider is required.');
  return context;
}
