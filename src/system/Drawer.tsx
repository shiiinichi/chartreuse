import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './components';
import './drawer.css';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'left' | 'right';
  mode?: 'docked' | 'modal';
  width?: number;
  maxWidth?: number;
  className?: string;
}

/** A docked workspace panel, or a native modal drawer when focus needs to stay inside. */
export function Drawer({ open, onOpenChange, title, description, children, footer, side = 'right', mode = 'docked', width = 380, maxWidth = 520, className = '' }: DrawerProps) {
  const id = useId();
  const panel = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const invoker = useRef<HTMLElement | null>(null);
  const focusWithin = useRef(false);
  const previous = useRef({ open, mode });
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 380;
  const safeMaxWidth = Number.isFinite(maxWidth) && maxWidth > 0 ? maxWidth : 520;
  const style = { '--cr-drawer-width': `${safeWidth}px`, '--cr-drawer-max-width': `${safeMaxWidth}px` } as CSSProperties;

  useEffect(() => {
    if (mode === 'modal') {
      const element = dialog.current;
      if (open && element && !element.open) {
        element.showModal();
        const first = element.querySelector<HTMLElement>('[autofocus], [data-cr-autofocus="true"]');
        (first || heading.current)?.focus({ preventScroll: true });
      } else if (!open && element?.open) {
        element.close();
      }
    } else {
      const wasOpen = previous.current.open && previous.current.mode === 'docked';
      if (open && !wasOpen) {
        const active = document.activeElement;
        invoker.current = active instanceof HTMLElement && !panel.current?.contains(active) ? active : null;
        heading.current?.focus({ preventScroll: true });
      } else if (!open && wasOpen && focusWithin.current && invoker.current?.isConnected) {
        invoker.current.focus({ preventScroll: true });
      }
    }
    previous.current = { open, mode };
  }, [open, mode]);

  const content = <>
    <header className="cr-drawer-header"><div><h2 id={`${id}-title`} ref={heading} tabIndex={-1}>{title}</h2>{description && <p id={`${id}-description`}>{description}</p>}</div><IconButton size="sm" icon={X} label="Close drawer" onClick={() => {
      if (mode === 'modal') dialog.current?.close();
      else onOpenChange(false);
    }} /></header>
    <div className="cr-drawer-body">{children}</div>
    {footer && <footer className="cr-drawer-footer">{footer}</footer>}
  </>;
  const common = {
    className: `cr-drawer ${className}`.trim(), style, 'data-mode': mode, 'data-side': side,
    'aria-labelledby': `${id}-title`, 'aria-describedby': description ? `${id}-description` : undefined,
  };

  if (mode === 'modal') return <dialog {...common} ref={dialog} onClose={() => onOpenChange(false)}>{content}</dialog>;

  return <aside {...common} ref={panel} hidden={!open} onFocusCapture={() => { focusWithin.current = true; }} onBlurCapture={event => {
    if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) focusWithin.current = false;
  }} onKeyDown={event => {
    if (event.key === 'Escape' && !event.defaultPrevented && !event.nativeEvent.isComposing) {
      event.preventDefault(); event.stopPropagation(); onOpenChange(false);
    }
  }}>{content}</aside>;
}
