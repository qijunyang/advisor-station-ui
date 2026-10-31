import { useEffect, useId, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

export function Modal({ title, children, footer, onClose, initialFocusRef, fallbackFocusRef }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current!;
    const trigger = document.activeElement;
    const fallback = fallbackFocusRef?.current;
    dialog.showModal();
    initialFocusRef?.current?.focus();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected && !trigger.matches(':disabled')) trigger.focus();
      else fallback?.focus();
    };
  }, [initialFocusRef, fallbackFocusRef]);

  return createPortal(
    <dialog ref={dialogRef} className="modal" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab' || event.ctrlKey || event.altKey) return;
        const items = Array.from(dialogRef.current!.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]'));
        event.preventDefault();
        const current = items.indexOf(document.activeElement as HTMLElement);
        const next = (current + (event.shiftKey ? -1 : 1) + items.length) % items.length;
        items[next]?.focus();
      }}>
      <header className="modal-header"><h2 id={titleId}>{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}>×</button></header>
      <div className="modal-body">{children}</div>
      {footer && <footer className="modal-footer">{footer}</footer>}
    </dialog>,
    document.body,
  );
}
