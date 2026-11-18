import { LoaderCircle } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Tone } from './components';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import './sequence.css';
import './timeline.css';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  content?: ReactNode;
  date?: ReactNode;
  dateTime?: string;
  icon?: IconSource;
  tone?: Tone;
}

export interface TimelineProps extends Omit<ComponentPropsWithRef<'ol'>, 'children' | 'reversed' | 'start' | 'type' | 'role'> {
  items: readonly TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  markerVariant?: 'outline' | 'solid';
  align?: 'start' | 'end' | 'alternate';
  datePlacement?: 'inline' | 'column';
  reverse?: boolean;
  pending?: ReactNode;
}

/** Chronological display data, in the same order as its accessible native list. */
export function Timeline({ items, orientation = 'vertical', markerVariant = 'outline', align = 'start', datePlacement = 'inline', reverse = false, pending, className, tabIndex, 'aria-label': ariaLabel, ...props }: TimelineProps) {
  const columnDates = orientation === 'vertical' && datePlacement === 'column' && align !== 'alternate';
  const orderedItems = reverse ? [...items].reverse() : items;
  const hasPending = pending !== undefined && pending !== null && pending !== false && pending !== '';
  const pendingItem = hasPending ? <li className="cr-sequence-item" data-pending="true" data-tone="neutral"><span className="cr-sequence-marker" data-custom="true" aria-hidden="true">{renderIcon(LoaderCircle, { size: 14, className: 'cr-sequence-pending-icon' })}</span>{columnDates && <div className="cr-timeline-date" />}<div className="cr-sequence-content"><div className="cr-sequence-title"><span className="cr-sr-only">Pending: </span>{pending}</div></div></li> : null;

  return <ol {...props} role="list" aria-label={ariaLabel ?? 'Timeline'} tabIndex={tabIndex ?? (orientation === 'horizontal' ? 0 : undefined)} className={['cr-sequence', 'cr-timeline', className].filter(Boolean).join(' ')} data-orientation={orientation} data-marker-variant={markerVariant} data-align={align} data-date-placement={columnDates ? 'column' : 'inline'} data-reverse={reverse || undefined}>
    {reverse && pendingItem}
    {orderedItems.map(item => {
      const hasDate = item.date !== undefined && item.date !== null && item.date !== false && item.date !== '';
      const hasContent = item.content !== undefined && item.content !== null && item.content !== false && item.content !== '';
      const date = hasDate ? item.dateTime ? <time dateTime={item.dateTime}>{item.date}</time> : <span>{item.date}</span> : null;
      return <li className="cr-sequence-item" key={item.id} data-tone={item.tone ?? 'neutral'}><span className="cr-sequence-marker" data-custom={Boolean(item.icon) || undefined} aria-hidden="true">{renderIcon(item.icon, { size: 14 })}</span>{columnDates && <div className="cr-timeline-date">{date}</div>}<div className="cr-sequence-content"><div className="cr-sequence-title">{item.title}</div>{!columnDates && hasDate && <div className="cr-timeline-date">{date}</div>}{hasContent && <div className="cr-sequence-body">{item.content}</div>}</div></li>;
    })}
    {!reverse && pendingItem}
  </ol>;
}
