import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { ModelsPage } from './ModelsPage';

test('shows preview rows, audit columns, available Create, and initially disabled deletion', () => {
  render(<ModelsPage />);
  expect(screen.getByRole('heading', { name: 'Models', level: 1 })).toBeVisible();
  expect(screen.getByText('Layout preview · Fictional sample data')).toBeVisible();
  const table = screen.getByRole('table', { name: /Model research collections/ });
  expect(within(table).getAllByRole('row')).toHaveLength(13);
  for (const name of ['Model name', 'Created', 'Updated', 'Updated by']) {
    expect(within(table).getByRole('columnheader', { name })).toBeVisible();
  }
  expect(screen.getByRole('button', { name: 'Create' })).toBeEnabled();
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
  expect(screen.getByRole('button', { name: 'Delete selected' })).toBeEnabled();
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

test('creates a model, views it read-only, edits it, and discards cancelled drafts', async () => {
  const user = userEvent.setup();
  render(<ModelsPage />);
  await user.click(screen.getByRole('button', { name: 'Create' }));
  await user.type(screen.getByRole('textbox', { name: 'Name' }), ' New research ');
  await user.type(screen.getByRole('textbox', { name: /Description/ }), 'Some notes');
  await user.click(screen.getByRole('button', { name: 'Create model' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('0 of 13 selected');
  const actions = screen.getByRole('button', { name: 'Actions for New research' });
  await user.click(actions);
  await user.click(screen.getByRole('menuitem', { name: 'View' }));
  expect(screen.getByRole('dialog', { name: 'View model' })).toHaveTextContent('Some notes');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Close' }));
  await user.click(actions);
  await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
  await user.clear(screen.getByRole('textbox', { name: 'Name' }));
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Edited research');
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.getByRole('rowheader', { name: 'Edited research' })).toBeVisible();
  expect(screen.queryByRole('rowheader', { name: 'New research' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Actions for Edited research' }));
  await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
  await user.clear(screen.getByRole('textbox', { name: 'Name' }));
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Abandoned draft');
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  await user.click(screen.getByRole('button', { name: 'Actions for Edited research' }));
  await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Edited research');
});

test('cancels bulk deletion then removes only checked models and clears their selection', async () => {
  const user = userEvent.setup();
  render(<ModelsPage />);
  await user.click(screen.getByRole('checkbox', { name: 'Select Balanced Research' }));
  await user.click(screen.getByRole('checkbox', { name: 'Select Long-Term Growth' }));
  await user.click(screen.getByRole('button', { name: 'Delete selected' }));
  const confirmation = screen.getByRole('dialog', { name: 'Delete selected models' });
  expect(within(confirmation).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Balanced Research', 'Long-Term Growth']);
  await user.click(within(confirmation).getByRole('button', { name: 'Cancel' }));
  expect(screen.getByRole('status')).toHaveTextContent('2 of 12 selected');
  await user.click(screen.getByRole('button', { name: 'Delete selected' }));
  await user.click(screen.getByRole('button', { name: 'Confirm delete' }));
  expect(screen.getByRole('status')).toHaveTextContent('0 of 10 selected');
  expect(screen.queryByRole('rowheader', { name: 'Balanced Research' })).not.toBeInTheDocument();
  expect(screen.getByRole('rowheader', { name: 'Income Research' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Delete selected' })).toBeDisabled();
});

test('row deletion ignores unrelated selection and can delete into the empty state', async () => {
  const user = userEvent.setup();
  render(<ModelsPage rows={[
    { id: 'one', name: 'First', createdAt: '2026-10-01', updatedAt: '2026-10-02', updatedBy: 'Demo advisor' },
    { id: 'two', name: 'Second', createdAt: '2026-10-01', updatedAt: '2026-10-02', updatedBy: 'Demo advisor' },
  ]} />);
  await user.click(screen.getByRole('checkbox', { name: 'Select First' }));
  await user.click(screen.getByRole('button', { name: 'Actions for Second' }));
  await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
  expect(within(screen.getByRole('dialog')).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Second']);
  await user.click(screen.getByRole('button', { name: 'Confirm delete' }));
  expect(screen.getByRole('status')).toHaveTextContent('1 of 1 selected');
  expect(screen.getByRole('button', { name: 'Create' })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Delete selected' }));
  await user.click(screen.getByRole('button', { name: 'Confirm delete' }));
  expect(screen.getByText('No models to display.')).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('0 of 0 selected');
  expect(screen.getByRole('checkbox', { name: 'Select all models' })).toBeDisabled();
});

test('editing preserves the selected record identity and creation date without changing other models', async () => {
  const user = userEvent.setup();
  render(<ModelsPage />);
  await user.click(screen.getByRole('checkbox', { name: 'Select Balanced Research' }));
  await user.click(screen.getByRole('button', { name: 'Actions for Balanced Research' }));
  await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
  await user.clear(screen.getByRole('textbox', { name: 'Name' }));
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Renamed research');
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.getByRole('checkbox', { name: 'Select Renamed research' })).toBeChecked();
  const row = screen.getByRole('rowheader', { name: 'Renamed research' }).closest('tr')!;
  expect(within(row).getByText('2026-10-01')).toBeVisible();
  expect(screen.getByRole('rowheader', { name: 'Long-Term Growth' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('1 of 12 selected');
});
