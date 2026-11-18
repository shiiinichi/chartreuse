import { Check, X } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import './sequence.css';
import './steps.css';

export interface StepItem {
  id: string;
  title: ReactNode;
  content?: ReactNode;
  icon?: IconSource;
  status?: 'complete' | 'current' | 'upcoming' | 'error';
}

export interface StepsProps extends Omit<ComponentPropsWithRef<'ol'>, 'children' | 'reversed' | 'start' | 'type' | 'role'> {
  items: readonly StepItem[];
  orientation?: 'vertical' | 'horizontal';
  markerVariant?: 'outline' | 'solid';
  numbered?: boolean;
  current?: string;
}

/** An ordered guide or process display; the caller owns its current step and state. */
export function Steps({ items, orientation = 'vertical', markerVariant = 'outline', numbered = true, current, className, tabIndex, 'aria-label': ariaLabel, ...props }: StepsProps) {
  const currentIndex = current === undefined ? -1 : items.findIndex(item => item.id === current);
  return <ol {...props} role="list" aria-label={ariaLabel ?? 'Steps'} tabIndex={tabIndex ?? (orientation === 'horizontal' ? 0 : undefined)} className={['cr-sequence', 'cr-steps', className].filter(Boolean).join(' ')} data-orientation={orientation} data-marker-variant={markerVariant}>
    {items.map((item, index) => {
      const derived = currentIndex < 0 ? 'neutral' : index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
      const status = item.status ?? derived;
      const isCurrent = item.id === current || status === 'current';
      const stateLabel = status === 'complete' ? 'Completed.' : status === 'error' ? 'Needs attention.' : status === 'upcoming' ? 'Upcoming.' : '';
      const hasContent = item.content !== undefined && item.content !== null && item.content !== false && item.content !== '';
      const icon = item.icon ?? (status === 'complete' ? Check : status === 'error' ? X : undefined);
      return <li className="cr-sequence-item" key={item.id} data-status={status} aria-current={isCurrent ? 'step' : undefined}><span className="cr-sequence-marker" aria-hidden="true">{icon ? renderIcon(icon, { size: 16 }) : numbered ? <span className="cr-step-number">{String(index + 1).padStart(2, '0')}</span> : <span className="cr-step-dot" />}</span><div className="cr-sequence-content"><div className="cr-sequence-title"><span className="cr-sr-only">Step {index + 1}. </span>{item.title}</div>{stateLabel && <span className="cr-sr-only">{stateLabel}</span>}{hasContent && <div className="cr-sequence-body">{item.content}</div>}</div></li>;
    })}
  </ol>;
}
