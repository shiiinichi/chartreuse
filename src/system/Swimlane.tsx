import { Children, useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Badge } from './components';
import type { Tone } from './components';
import './swimlane.css';

export interface SwimlaneProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  title: string;
  count: number;
  tone?: Tone;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  emptyContent?: ReactNode;
}

/** A status column surface; card data and board actions remain with the consumer. */
export function Swimlane({ title, count, tone = 'neutral', description, action, children, emptyContent, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, ...props }: SwimlaneProps) {
  const id = useId();
  const itemCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasAction = action !== undefined && action !== null && action !== false;
  const hasContent = Children.toArray(children).length > 0;
  return <section {...props} className={['cr-swimlane', className].filter(Boolean).join(' ')} data-tone={tone} aria-label={ariaLabel} aria-labelledby={labelledBy || (ariaLabel ? undefined : `${id}-title`)} aria-describedby={[describedBy, hasDescription && `${id}-description`].filter(Boolean).join(' ') || undefined}>
    <header className="cr-swimlane-header"><div className="cr-swimlane-heading"><h3 id={`${id}-title`}><Badge className="cr-swimlane-tag" tone={tone} dot>{title}</Badge></h3><span className="cr-swimlane-count">{itemCount}</span></div>{hasAction && <div className="cr-swimlane-action">{action}</div>}{hasDescription && <div className="cr-swimlane-description" id={`${id}-description`}>{description}</div>}</header>
    <div className="cr-swimlane-body">{hasContent ? children : <div className="cr-swimlane-empty">{emptyContent !== undefined ? emptyContent : <p>No items in this lane.</p>}</div>}</div>
  </section>;
}
