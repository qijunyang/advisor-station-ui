import { authDirectory } from './authDirectory';
import type { AuthSession } from './types';

export function findAdvisor(firmId: string, advisorId: string) {
  const firm = authDirectory.find((item) => item.id === firmId);
  const advisor = firm?.advisors.find((item) => item.id === advisorId);
  return firm && advisor ? { firm, advisor } : null;
}

export function validateSession(value: unknown): AuthSession | null {
  if (typeof value !== 'object' || value === null) return null;
  if (!('version' in value) || value.version !== 1) return null;
  if (!('firmId' in value) || typeof value.firmId !== 'string') return null;
  if (!('advisorId' in value) || typeof value.advisorId !== 'string') return null;
  if (!('sessionId' in value) || typeof value.sessionId !== 'string') return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.sessionId)) return null;
  if (!findAdvisor(value.firmId, value.advisorId)) return null;
  return { version: 1, firmId: value.firmId, advisorId: value.advisorId, sessionId: value.sessionId };
}
