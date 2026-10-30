import { act } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
  document.body.replaceChildren();
  vi.resetModules();
});

test('mounts the application into the HTML root', async () => {
  const container = document.createElement('div');
  container.id = 'root';
  document.body.append(container);

  await act(async () => {
    await import('./main');
  });

  expect(container.querySelector('h1')).toHaveTextContent('Advisor Station UI');
  expect(container.querySelector('main')).toHaveTextContent('Choose a firm');
});

test('reports a missing HTML root instead of silently failing to mount', async () => {
  await expect(import('./main')).rejects.toThrow('The application root element is missing.');
});
