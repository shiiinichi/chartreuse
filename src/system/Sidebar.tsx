import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import './sidebar.css';

export interface SidebarProps extends Omit<ComponentPropsWithRef<'aside'>, 'children'> {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'floating' | 'flush';
  width?: number;
  maxWidth?: number;
  contentLabel?: string;
}

const positive = (value: number | undefined) => typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined;

/** A parent-sized complementary surface. Content owns its navigation or selection semantics. */
export function Sidebar({ header, children, footer, variant = 'flush', width = 280, maxWidth, contentLabel = 'Sidebar content', className, style, ...props }: SidebarProps) {
  const hasHeader = header !== undefined && header !== null && header !== false;
  const hasFooter = footer !== undefined && footer !== null && footer !== false;
  const sizing: CSSProperties = { '--cr-sidebar-width': `${positive(width) ?? 280}px`, '--cr-sidebar-max-width': positive(maxWidth) ? `${maxWidth}px` : '100%', ...style } as CSSProperties;
  return <aside {...props} style={sizing} className={['cr-sidebar', className].filter(Boolean).join(' ')} data-variant={variant} data-has-header={hasHeader} data-has-footer={hasFooter}>
    {hasHeader && <header className="cr-sidebar-header">{header}</header>}
    <div className="cr-sidebar-body" role="region" aria-label={contentLabel} tabIndex={0}>{children}</div>
    {hasFooter && <footer className="cr-sidebar-footer">{footer}</footer>}
  </aside>;
}
