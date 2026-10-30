import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('identifies the application and its fictional demo purpose in the main content', () => {
  render(<App />);

  const main = screen.getByRole('main');
  expect(within(main).getByRole('heading', { level: 1, name: 'Advisor Station UI' })).toBeVisible();
  expect(within(main).getByText('A fictional demo foundation for a financial advisor workspace.')).toBeVisible();
});
