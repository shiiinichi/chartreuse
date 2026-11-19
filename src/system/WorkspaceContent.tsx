import type { ComponentPropsWithRef } from 'react';
import './workspace-content.css';

export interface WorkspaceContentProps extends ComponentPropsWithRef<'main'> {
  as?: 'main' | 'section';
  width?: 'comfortable' | 'full';
}

/** The content region of a workspace with a configurable inner width. */
export function WorkspaceContent({ as: Element = 'main', width = 'comfortable', children, className, ...props }: WorkspaceContentProps) {
  return (
    <Element {...props} className={['cr-workspace-content', className].filter(Boolean).join(' ')} data-width={width}>
      <div className="cr-workspace-content-inner">{children}</div>
    </Element>
  );
}
