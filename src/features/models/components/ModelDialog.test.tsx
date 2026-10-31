import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { ModelDialog } from './ModelDialog';

const model = { id: 'one', name: 'Research', description: 'Original notes', createdAt: '2026-10-01', updatedAt: '2026-10-02', updatedBy: 'Demo advisor' };

test('creates a trimmed draft, validates required/length limits, and offers cancellation', async () => {
  const save = vi.fn(); const close = vi.fn();
  const user = userEvent.setup();
  render(<ModelDialog mode="create" onSave={save} onClose={close} />);
  const dialog = screen.getByRole('dialog', { name: 'Create model' });
  const name = within(dialog).getByRole('textbox', { name: 'Name' });
  const description = within(dialog).getByRole('textbox', { name: /Description/ });
  expect(name).toHaveFocus();
  expect(name).toHaveAttribute('maxlength', '100');
  expect(description).toHaveAttribute('maxlength', '1000');
  await user.click(within(dialog).getByRole('button', { name: 'Create model' }));
  expect(within(dialog).getByRole('alert')).toBeVisible();
  expect(save).not.toHaveBeenCalled();
  fireEvent.change(name, { target: { value: 'x'.repeat(101) } });
  await user.click(within(dialog).getByRole('button', { name: 'Create model' }));
  expect(save).not.toHaveBeenCalled();
  fireEvent.change(name, { target: { value: '  New research  ' } });
  fireEvent.change(description, { target: { value: 'x'.repeat(1001) } });
  await user.click(within(dialog).getByRole('button', { name: 'Create model' }));
  expect(save).not.toHaveBeenCalled();
  fireEvent.change(description, { target: { value: '  Notes  ' } });
  await user.click(within(dialog).getByRole('button', { name: 'Create model' }));
  expect(save).toHaveBeenCalledExactlyOnceWith({ name: 'New research', description: 'Notes' });
  await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
  expect(close).toHaveBeenCalledOnce();
});

test('view mode shows current details without editable fields or Save and supports Close', async () => {
  const close = vi.fn();
  render(<ModelDialog mode="view" model={model} onClose={close} />);
  const dialog = screen.getByRole('dialog', { name: 'View model' });
  expect(dialog).toHaveTextContent('Research');
  expect(dialog).toHaveTextContent('Original notes');
  expect(dialog).toHaveTextContent('2026-10-01');
  expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument();
  expect(within(dialog).queryByRole('button', { name: /Save/ })).not.toBeInTheDocument();
  await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
  expect(close).toHaveBeenCalled();
});

test('view mode provides an empty-description fallback', () => {
  render(<ModelDialog mode="view" model={{ ...model, description: '' }} onClose={vi.fn()} />);
  expect(screen.getByText('No description.')).toBeVisible();
});

test('edit mode initializes values and submits only an edited draft', async () => {
  const save = vi.fn();
  render(<ModelDialog mode="edit" model={model} onSave={save} onClose={vi.fn()} />);
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Research');
  expect(screen.getByRole('textbox', { name: /Description/ })).toHaveValue('Original notes');
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Updated research' } });
  await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(save).toHaveBeenCalledExactlyOnceWith({ name: 'Updated research', description: 'Original notes' });
});
