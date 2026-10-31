import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface RowAction {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
}

export function RowActionMenu({ label, actions }: { label: string; actions: readonly RowAction[] }) {
  const [position, setPosition] = useState<{ top: number; left: number; anchorTop: number; anchorRight: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  function close() {
    setPosition(null);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!position) return;
    menuRef.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus();
    function outside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node) && !triggerRef.current?.contains(event.target as Node)) setPosition(null);
    }
    function dismiss() { setPosition(null); }
    function scrolled() {
      const bounds = triggerRef.current!.getBoundingClientRect();
      // Ignore queued scroll events from revealing the trigger before opening.
      if (Math.abs(bounds.top - position!.anchorTop) > 1 || Math.abs(bounds.right - position!.anchorRight) > 1) dismiss();
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('scroll', scrolled, true);
    window.addEventListener('resize', dismiss);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('scroll', scrolled, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [position]);

  return <>
    <button type="button" className="row-menu-trigger" ref={triggerRef} aria-label={label} aria-haspopup="menu" aria-expanded={position !== null} aria-controls={position ? menuId : undefined}
      onClick={() => {
        if (position) { close(); return; }
        const bounds = triggerRef.current!.getBoundingClientRect();
        setPosition({ top: Math.max(8, Math.min(bounds.bottom + 4, window.innerHeight - actions.length * 42 - 24)), left: Math.max(8, Math.min(bounds.right - 176, window.innerWidth - 184)), anchorTop: bounds.top, anchorRight: bounds.right });
      }}>⋮</button>
    {position && createPortal(
      <div id={menuId} ref={menuRef} role="menu" aria-label={label} className="row-menu" style={{ top: position.top, left: position.left }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') { event.preventDefault(); close(); }
          else if (event.key === 'Tab') close();
          else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const items = Array.from(menuRef.current!.querySelectorAll<HTMLElement>('[role=menuitem]'));
            const current = items.indexOf(document.activeElement as HTMLElement);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
            items[next]?.focus();
          }
        }}>
        {actions.map((action) => <button type="button" role="menuitem" key={action.label} className={action.destructive ? 'danger-text' : undefined} onClick={() => { close(); action.onSelect(); }}>{action.label}</button>)}
      </div>, document.body,
    )}
  </>;
}
