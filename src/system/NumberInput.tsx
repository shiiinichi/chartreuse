import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ControlSize } from './control-size';
import { Text } from './Text';
import './number-input.css';

export interface NumberInputProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'children' | 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  size?: ControlSize;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  hint?: string;
  error?: string;
}

function numeric(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function text(value: number | null | undefined): string {
  const number = numeric(value);
  return number === null ? '' : String(number);
}

function draftNumber(value: string): number | null {
  const number = value === '' ? NaN : Number(value);
  return Number.isFinite(number) ? number : null;
}

/** Native number editing with steppers revealed only while the field is active. */
export function NumberInput({ label, size = 'md', value, defaultValue = null, onValueChange, hint, error, className, id: suppliedId, ref, disabled, readOnly, required, step, ...props }: NumberInputProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const input = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(() => text(value === undefined ? defaultValue : value));
  const controlled = value !== undefined;
  const controlledValue = numeric(value);
  const inputText = controlled && !Object.is(draftNumber(draft), controlledValue) ? text(value) : draft;
  const valueRef = useRef(value);
  const defaultValueRef = useRef(defaultValue);
  const callbackRef = useRef(onValueChange);
  valueRef.current = value;
  defaultValueRef.current = defaultValue;
  callbackRef.current = onValueChange;
  const hasSteppers = !disabled && !readOnly && step !== 'any';

  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => {
    if (controlled && inputText !== draft) setDraft(inputText);
  }, [controlled, inputText, draft]);
  useEffect(() => {
    const owner = input.current?.form;
    if (!owner) return;
    let active = true;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (!active || event.defaultPrevented || !input.current) return;
        const next = valueRef.current === undefined ? defaultValueRef.current : valueRef.current;
        const nextText = text(next);
        input.current.value = nextText;
        setDraft(nextText);
        if (valueRef.current === undefined) callbackRef.current?.(numeric(next));
      });
    };
    owner.addEventListener('reset', reset);
    return () => { active = false; owner.removeEventListener('reset', reset); };
  }, [props.form]);

  const report = (control: HTMLInputElement) => {
    setDraft(control.value);
    callbackRef.current?.(Number.isFinite(control.valueAsNumber) ? control.valueAsNumber : null);
  };
  const changeStep = (direction: 1 | -1) => {
    const control = input.current;
    if (!control || control.disabled || control.readOnly || control.step === 'any') return;
    const before = control.value;
    try {
      if (direction === 1) control.stepUp(); else control.stepDown();
      if (control.value !== before) report(control);
    } catch {
      // Native invalid constraints do not prevent direct editing or form validation.
    }
  };

  return <div className={['cr-field', 'cr-number-input', className].filter(Boolean).join(' ')}>
    <label htmlFor={id}>{label}{required && <span className="cr-required"> *</span>}</label>
    <div className="cr-number-input-control" data-cr-input-size={size} data-steppers={hasSteppers || undefined}>
      <input {...props} ref={input} id={id} type="number" className="cr-input cr-number-input-native" value={inputText} step={step} disabled={disabled} readOnly={readOnly} required={required} data-cr-autofocus={props.autoFocus || undefined} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], (error || hint) && `${id}-${error ? 'error' : 'hint'}`].filter(Boolean).join(' ') || undefined} onChange={event => report(event.currentTarget)} />
      {hasSteppers && <div className="cr-number-input-steppers" role="group" aria-label={`${label} step controls`}>
        <button type="button" className="cr-number-input-step" aria-label={`Increase ${label}`} aria-controls={id} onPointerDown={event => { if (event.button === 0) { event.preventDefault(); input.current?.focus({ preventScroll: true }); } }} onClick={() => changeStep(1)}><ChevronUp size={13} aria-hidden="true" /></button>
        <button type="button" className="cr-number-input-step" aria-label={`Decrease ${label}`} aria-controls={id} onPointerDown={event => { if (event.button === 0) { event.preventDefault(); input.current?.focus({ preventScroll: true }); } }} onClick={() => changeStep(-1)}><ChevronDown size={13} aria-hidden="true" /></button>
      </div>}
    </div>
    {hint && !error && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    {error && <Text size="small" className="cr-field-error" id={`${id}-error`} role="alert"><AlertCircle size={12} aria-hidden="true" /><span>{error}</span></Text>}
  </div>;
}
