import { useState } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import './disclosure.css';

type DisclosureBase = Omit<ComponentPropsWithRef<'details'>, 'title' | 'children' | 'open' | 'onToggle' | 'name'> & {
  title: ReactNode;
  children: ReactNode;
  /** Keep the summary surface highlighted while open, or in both states. */
  headerHighlight?: 'hover' | 'open' | 'always';
};

export type DisclosureProps = DisclosureBase & (
  | { open: boolean; onOpenChange: (open: boolean) => void; defaultOpen?: never; name?: never }
  | { open?: undefined; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; name?: string }
);

/** A native disclosure. Shared names opt uncontrolled items into an exclusive group. */
export function Disclosure({ title, children, open, defaultOpen = false, onOpenChange, name, headerHighlight = 'hover', className, ...props }: DisclosureProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const expanded = open ?? internalOpen;
  return <details {...props} name={name} open={expanded} data-header-highlight={headerHighlight} className={['cr-disclosure', className].filter(Boolean).join(' ')} onToggle={event => {
    const next = event.currentTarget.open;
    if (open !== undefined) {
      // Native find-in-page can reveal a closed item. Request the new state
      // while keeping the DOM consistent until its owner accepts the change.
      if (next !== open) { event.currentTarget.open = open; onOpenChange?.(next); }
    } else if (next !== internalOpen) {
      setInternalOpen(next); onOpenChange?.(next);
    }
  }}>
    <summary className="cr-disclosure-summary" onClick={event => {
      if (open === undefined) return;
      event.preventDefault(); onOpenChange?.(!open);
    }}><ChevronDown className="cr-disclosure-chevron" size={16} aria-hidden="true" /><span className="cr-disclosure-title">{title}</span></summary>
    <div className="cr-disclosure-content">{children}</div>
  </details>;
}
