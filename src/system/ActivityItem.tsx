import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Text } from './Text';
import './content-blocks.css';

export interface ActivityItemProps extends Omit<ComponentPropsWithRef<'article'>, 'title' | 'children'> {
  title?: ReactNode;
  identifier?: ReactNode;
  metadata?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/** A self-contained update with context, metadata, and a continuous left rule. */
export function ActivityItem({ title, identifier, metadata, footer, children, className, 'aria-labelledby': labelledBy, 'aria-label': ariaLabel, ...props }: ActivityItemProps) {
  const id = useId();
  const hasTitle = title !== undefined && title !== null && title !== false;
  const hasIdentifier = identifier !== undefined && identifier !== null && identifier !== false;
  const hasMetadata = metadata !== undefined && metadata !== null && metadata !== false;
  const hasFooter = footer !== undefined && footer !== null && footer !== false;
  return <article {...props} className={['cr-activity-item', className].filter(Boolean).join(' ')} aria-label={ariaLabel} aria-labelledby={labelledBy || (!ariaLabel && hasTitle ? `${id}-title` : undefined)}>
    {(hasTitle || hasIdentifier || hasMetadata) && <header className="cr-activity-item-header">
      {(hasTitle || hasIdentifier) && <div className="cr-activity-item-title-row">{hasIdentifier && <span className="cr-activity-item-identifier">{identifier}</span>}{hasTitle && <Text size="heading-3" id={`${id}-title`} className="cr-activity-item-title">{title}</Text>}</div>}
      {hasMetadata && <div className="cr-activity-item-metadata">{metadata}</div>}
    </header>}
    <div className="cr-activity-item-content">{children}</div>
    {hasFooter && <footer className="cr-activity-item-footer">{footer}</footer>}
  </article>;
}
