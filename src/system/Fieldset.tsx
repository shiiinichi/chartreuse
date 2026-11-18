import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import './fieldset.css';

export interface FieldsetProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'children'> {
  legend: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

/** A native form group with a legend, shared context, and optional group actions. */
export function Fieldset({ legend, description, hint, actions, children, className, 'aria-describedby': describedBy, ...props }: FieldsetProps) {
  const id = useId();
  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasHint = hint !== undefined && hint !== null && hint !== false;
  const descriptionId = `${id}-description`;
  const hintId = `${id}-hint`;
  return <fieldset {...props} className={['cr-fieldset', className].filter(Boolean).join(' ')} aria-describedby={[describedBy, hasDescription && descriptionId, hasHint && hintId].filter(Boolean).join(' ') || undefined}>
    <legend className="cr-fieldset-legend"><span>{legend}</span></legend>
    {(hasDescription || actions) && <div className="cr-fieldset-header">{hasDescription && <div className="cr-fieldset-description" id={descriptionId}>{description}</div>}{actions && <div className="cr-fieldset-actions">{actions}</div>}</div>}
    <div className="cr-fieldset-content">{children}</div>
    {hasHint && <div className="cr-fieldset-hint" id={hintId}>{hint}</div>}
  </fieldset>;
}
