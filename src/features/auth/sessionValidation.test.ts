import { expect, test } from 'vitest';
import { authDirectory } from './authDirectory';
import { findAdvisor, validateSession } from './sessionValidation';
import { sessionScope } from './sessionScope';

const valid = { version: 1 as const, firmId: 'northstar', advisorId: 'northstar-emma', sessionId: 'b7a472b1-0102-4345-8678-123456789abc' };

test('defines exactly two fictional firms with three uniquely identified advisors each', () => {
  expect(authDirectory.map((firm) => [firm.name, firm.advisors.length])).toEqual([['Northstar Advisory', 3], ['Harborview Wealth', 3]]);
  expect(new Set(authDirectory.flatMap((firm) => firm.advisors.map((advisor) => advisor.id))).size).toBe(6);
});

test('resolves only advisors belonging to the requested firm', () => {
  expect(findAdvisor('northstar', 'northstar-emma')?.advisor.name).toBe('Emma Parker');
  expect(findAdvisor('harborview', 'harborview-noah')?.firm.name).toBe('Harborview Wealth');
  expect(findAdvisor('missing', 'northstar-emma')).toBeNull();
  expect(findAdvisor('northstar', 'harborview-noah')).toBeNull();
});

test('accepts current sessions without trusting stored display names', () => {
  expect(validateSession({ ...valid, advisorName: 'Untrusted name' })).toEqual(valid);
});

test.each([
  null, false, 'session', [], {}, { ...valid, version: 2 }, { ...valid, version: undefined },
  { version: 1 }, { version: 1, firmId: 'northstar' }, { version: 1, firmId: 'northstar', advisorId: 'northstar-emma' },
  { ...valid, firmId: 1 }, { ...valid, advisorId: 1 }, { ...valid, sessionId: 1 },
  { ...valid, firmId: '' }, { ...valid, advisorId: '' }, { ...valid, sessionId: '' },
  { ...valid, sessionId: 'not-a-uuid' }, { ...valid, firmId: 'unknown' },
  { ...valid, advisorId: 'unknown' }, { ...valid, advisorId: 'harborview-noah' },
])('rejects invalid or obsolete session data: %j', (value) => {
  expect(validateSession(value)).toBeNull();
});

test('keeps scope stable within a session and separates sessions, advisors, and firms', () => {
  expect(sessionScope(valid)).toEqual(['demo', 'northstar', 'northstar-emma', valid.sessionId]);
  expect(sessionScope({ ...valid })).toEqual(sessionScope(valid));
  for (const changed of [{ ...valid, sessionId: '8d368e4c-0102-4345-8678-123456789abc' }, { ...valid, advisorId: 'northstar-liam' }, { ...valid, firmId: 'harborview' }]) {
    expect(sessionScope(changed)).not.toEqual(sessionScope(valid));
  }
});
