import type { AuthSession } from './types';

export function sessionScope(session: AuthSession) {
  return ['demo', session.firmId, session.advisorId, session.sessionId] as const;
}
