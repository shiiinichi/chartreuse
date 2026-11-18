import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import './page-panel.css';

export interface PagePanelProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  title: string;
  description?: ReactNode;
  leading?: ReactNode;
  headerActions?: ReactNode;
  navigation?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/** A full-height layout surface with one scrolling body and a separate action footer. */
export function PagePanel({ title, description, leading, headerActions, navigation, footer, children, className, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, ...props }: PagePanelProps) {
  const id = useId();
  const hasDescription = description !== undefined && description !== null && description !== false;
  return <section {...props} className={['cr-page-panel', className].filter(Boolean).join(' ')} aria-labelledby={labelledBy || `${id}-title`} aria-describedby={[describedBy, hasDescription && `${id}-description`].filter(Boolean).join(' ') || undefined}>
    <header className="cr-page-panel-header">{leading && <div className="cr-page-panel-leading">{leading}</div>}<div className="cr-page-panel-heading"><h2 id={`${id}-title`}>{title}</h2>{hasDescription && <div id={`${id}-description`} className="cr-page-panel-description">{description}</div>}</div>{headerActions && <div className="cr-page-panel-header-actions">{headerActions}</div>}</header>
    {navigation && <div className="cr-page-panel-navigation">{navigation}</div>}
    <div className="cr-page-panel-body" role="region" aria-label={`${title} content`} tabIndex={0}>{children}</div>
    {footer && <footer className="cr-page-panel-footer">{footer}</footer>}
  </section>;
}
