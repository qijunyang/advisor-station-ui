import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { SessionContext } from '../auth/SessionContext';
import { WorkspaceLayout } from './WorkspaceLayout';

test('never renders workspace chrome without a valid selected advisor', () => {
  const { container } = render(
    <SessionContext.Provider value={{ session: null, error: null, login: vi.fn(), logout: vi.fn(), retry: vi.fn() }}>
      <WorkspaceLayout />
    </SessionContext.Provider>,
  );
  expect(container).toBeEmptyDOMElement();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});
