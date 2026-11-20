import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import { Text } from './Text';
import './segmented-control.css';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: IconSource;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'children' | 'name' | 'onChange' | 'defaultValue'> {
  label: string;
  /** Shared native radio name; also the submitted form key. */
  name: string;
  options: readonly SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md';
  variant?: 'outline' | 'solid';
}

/** A compact, single-choice field built from a native radio group. */
export function SegmentedControl({ label, name, options, value, defaultValue = '', onValueChange, hideLabel = false, hint, error, required = false, fullWidth = false, size = 'md', variant = 'outline', disabled, id: suppliedId, className, ref, form, 'aria-describedby': describedBy, ...props }: SegmentedControlProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const root = useRef<HTMLFieldSetElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selected = value === undefined ? internalValue : value;
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const description = [describedBy, descriptionId].filter(Boolean).join(' ') || undefined;
  useImperativeHandle(ref, () => root.current!, []);

  useEffect(() => {
    const owner = root.current?.form;
    if (!owner || value !== undefined) return;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        setInternalValue(defaultValue);
        onValueChange?.(defaultValue);
      });
    };
    owner.addEventListener('reset', reset);
    return () => owner.removeEventListener('reset', reset);
  }, [defaultValue, value, onValueChange, form]);

  return <fieldset {...props} id={id} ref={root} form={form} disabled={disabled} className={['cr-segmented-control', className].filter(Boolean).join(' ')} aria-describedby={description} aria-invalid={error ? true : props['aria-invalid']} data-size={size} data-variant={variant} data-full-width={fullWidth || undefined}>
    <legend className="cr-segmented-legend" data-hidden={hideLabel || undefined}>{label}{required && <span className="cr-required" aria-hidden="true"> *</span>}</legend>
    <div className="cr-segmented-track">{options.map((option, index) => <label className="cr-segmented-option" key={option.value} htmlFor={`${id}-option-${index}`}>
      <input className="cr-segmented-input" id={`${id}-option-${index}`} type="radio" name={name} form={form} value={option.value} checked={selected === option.value} disabled={option.disabled} required={required} aria-describedby={description} aria-invalid={error ? true : undefined} onChange={event => {
        if (!event.currentTarget.checked) return;
        if (value === undefined) setInternalValue(option.value);
        onValueChange?.(option.value);
      }} />
      <span className="cr-segmented-label">{renderIcon(option.icon, { size: 15 })}<span>{option.label}</span></span>
    </label>)}</div>
    {(error || hint) && <Text size="body" className="cr-segmented-message" id={descriptionId} data-error={!!error || undefined} role={error ? 'alert' : undefined}>{error && <AlertCircle size={12} aria-hidden="true" />}<span>{error || hint}</span></Text>}
  </fieldset>;
}
