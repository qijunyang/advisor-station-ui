import { useRef } from 'react';
import type { RefObject } from 'react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  names: readonly string[];
  onConfirm: () => void;
  onCancel: () => void;
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

export function ConfirmDialog({ title, message, names, onConfirm, onCancel, fallbackFocusRef }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Modal title={title} onClose={onCancel} initialFocusRef={cancelRef} fallbackFocusRef={fallbackFocusRef}
      footer={<><button ref={cancelRef} onClick={onCancel}>Cancel</button><button className="danger-button" onClick={onConfirm}>Confirm delete</button></>}>
      <p>{message}</p>
      <ul className="confirmation-list">{names.map((name, index) => <li key={index}>{name}</li>)}</ul>
    </Modal>
  );
}
