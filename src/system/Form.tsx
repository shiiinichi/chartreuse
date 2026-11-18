import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import './form.css';

export type FormLayoutMode = 'vertical' | 'horizontal' | 'inline';
export type FormLabelAlignment = 'start' | 'end';

interface FormLayoutOptions {
  /** Labels stack by default. Horizontal and inline layouts stack below 480px. */
  layout?: FormLayoutMode;
  /** Preferred label-column width in horizontal layouts. Numbers are CSS pixels. */
  labelWidth?: number | string;
  /** Label text alignment in the wide horizontal and inline layouts. */
  labelAlign?: FormLabelAlignment;
  /** Native form actions, kept outside the input Grid in a compact wrapping row. */
  actions?: ReactNode;
}

export interface FormProps extends ComponentPropsWithRef<'form'>, FormLayoutOptions {}
export interface FormLayoutProps extends ComponentPropsWithRef<'div'>, FormLayoutOptions {}

function labelLength(value: number | string): string {
  if (typeof value === 'number') return Number.isFinite(value) ? `${Math.max(0, value)}px` : '144px';
  return typeof value === 'string' && value.trim() ? value.trim() : '144px';
}

function FormBody({ children, layout = 'vertical', labelWidth = 144, labelAlign = 'start', actions }: FormLayoutOptions & { children?: ReactNode }) {
  const mode = layout === 'horizontal' || layout === 'inline' ? layout : 'vertical';
  const recipe = {
    '--cr-form-label-width': labelLength(labelWidth),
    '--cr-form-label-align': labelAlign === 'end' ? 'end' : 'start',
  } as CSSProperties;
  return <div className="cr-form-body" data-layout={mode} style={recipe}>
    {children}
    {actions !== undefined && actions !== null && actions !== false && <div className="cr-form-actions">{actions}</div>}
  </div>;
}

/** Native form behavior with a container-responsive presentation for existing fields. */
export function Form({ children, layout, labelWidth, labelAlign, actions, className, ...props }: FormProps) {
  return <form {...props} className={['cr-form', className].filter(Boolean).join(' ')}>
    <FormBody layout={layout} labelWidth={labelWidth} labelAlign={labelAlign} actions={actions}>{children}</FormBody>
  </form>;
}

/** A local layout scope for mixed sections inside one native form. */
export function FormLayout({ children, layout, labelWidth, labelAlign, actions, className, ...props }: FormLayoutProps) {
  return <div {...props} className={['cr-form-layout', className].filter(Boolean).join(' ')}>
    <FormBody layout={layout} labelWidth={labelWidth} labelAlign={labelAlign} actions={actions}>{children}</FormBody>
  </div>;
}
