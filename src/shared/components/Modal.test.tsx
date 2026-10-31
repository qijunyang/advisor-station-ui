import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { expect, test } from 'vitest';
import { Modal } from './Modal';
import { ConfirmDialog } from './ConfirmDialog';

function Example() {
  const [open, setOpen] = useState(false);
  return <><button onClick={() => setOpen(true)}>Open</button>{open && <Modal title="Example" onClose={() => setOpen(false)}><p>Reusable content</p></Modal>}</>;
}

test('provides a named portal dialog, closes through cancel events and restores focus', async () => {
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Open' });
  await userEvent.click(trigger);
  expect(screen.getByRole('dialog', { name: 'Example' })).toHaveTextContent('Reusable content');
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false, cancelable: true }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('generic confirmation focuses Cancel and restores fallback if the opener is removed', async () => {
  function Confirmation() {
    const [open, setOpen] = useState(false);
    const [removed, setRemoved] = useState(false);
    const fallback = useRef<HTMLButtonElement>(null);
    return <><button ref={fallback}>Fallback</button>{!removed && <button onClick={() => setOpen(true)}>Delete record</button>}
      {open && <ConfirmDialog title="Confirm operation" message="Remove these records?" names={['First', 'Second']} onCancel={() => setOpen(false)} onConfirm={() => { setRemoved(true); setOpen(false); }} fallbackFocusRef={fallback} />}</>;
  }
  render(<Confirmation />);
  await userEvent.click(screen.getByRole('button', { name: 'Delete record' }));
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.getByRole('button', { name: 'Delete record' })).toHaveFocus();
  await userEvent.click(screen.getByRole('button', { name: 'Delete record' }));
  await userEvent.click(screen.getByRole('button', { name: 'Confirm delete' }));
  expect(screen.getByRole('button', { name: 'Fallback' })).toHaveFocus();
});
