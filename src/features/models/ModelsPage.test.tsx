import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { ModelsPage } from './ModelsPage';

test('shows labeled preview rows, audit columns, and unavailable model actions', () => {
  render(<ModelsPage />);
  expect(screen.getByRole('heading', { name: 'Models', level: 1 })).toBeVisible();
  expect(screen.getByText('Layout preview · Fictional sample data')).toBeVisible();
  const table = screen.getByRole('table', { name: /Model research collections/ });
  expect(within(table).getAllByRole('row')).toHaveLength(13);
  for (const name of ['Model name', 'Created', 'Updated', 'Updated by']) {
    expect(within(table).getByRole('columnheader', { name })).toBeVisible();
  }
  expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Delete selected' })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('0 of 12 selected');
  expect(screen.getByRole('button', { name: 'Clear selection' })).toBeDisabled();
  expect(screen.getByRole('region', { name: 'Models table' })).toHaveAttribute('tabindex', '0');
});

test('selects individual models, supports mixed/select-all state, and clears without mutating rows', async () => {
  const user = userEvent.setup();
  render(<ModelsPage />);
  const all = screen.getByRole('checkbox', { name: 'Select all models' });
  const first = screen.getByRole('checkbox', { name: 'Select Balanced Research' });
  await user.click(first);
  expect(first).toBeChecked();
  expect(all).toBePartiallyChecked();
  expect(screen.getByRole('status')).toHaveTextContent('1 of 12 selected');
  expect(screen.getByRole('button', { name: 'Delete selected' })).toBeDisabled();
  await user.click(first);
  expect(first).not.toBeChecked();
  expect(all).not.toBePartiallyChecked();
  await user.click(all);
  expect(all).toBeChecked();
  expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(13);
  expect(screen.getByRole('status')).toHaveTextContent('12 of 12 selected');
  await user.click(all);
  expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(13);
  await user.click(first);
  await user.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(screen.getByRole('status')).toHaveTextContent('0 of 12 selected');
  expect(screen.getByRole('table')).toHaveTextContent('Balanced Research');
  expect(screen.getAllByRole('row')).toHaveLength(13);
});

test('supports keyboard selection', async () => {
  render(<ModelsPage />);
  const checkbox = screen.getByRole('checkbox', { name: 'Select Balanced Research' });
  checkbox.focus();
  await userEvent.keyboard(' ');
  expect(checkbox).toBeChecked();
});

test('renders an empty state with no active selection controls', () => {
  render(<ModelsPage rows={[]} />);
  expect(screen.getByText('No models to display.')).toBeVisible();
  expect(screen.getByRole('checkbox', { name: 'Select all models' })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('0 of 0 selected');
  expect(screen.getByRole('button', { name: 'Clear selection' })).toBeDisabled();
});
