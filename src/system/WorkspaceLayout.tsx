import type { ComponentPropsWithRef } from 'react';
import './workspace-layout.css';

export type WorkspaceLayoutProps = ComponentPropsWithRef<'div'>;

/** A wrapping row for a sidebar and workspace content. */
export function WorkspaceLayout({ className, ...props }: WorkspaceLayoutProps) {
  return <div {...props} className={['cr-workspace-layout', className].filter(Boolean).join(' ')} />;
}
