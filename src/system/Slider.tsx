import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { AlertCircle } from 'lucide-react';
import { Text } from './Text';
import './slider.css';

export interface SliderProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'children' | 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'> {
  label: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number | 'any';
  onValueChange?: (value: number) => void;
  formatValue?: (value: number) => string;
  showValue?: boolean;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

function rangeValue(value: number | undefined, min: number, max: number, step: number | 'any') {
  const requested = value !== undefined && Number.isFinite(value) ? value : min + (max - min) / 2;
  const clamped = Math.max(min, Math.min(max, requested));
  if (step === 'any') return clamped;
  const steps = Math.min(Math.round((clamped - min) / step), Math.floor((max - min) / step + 1e-10));
  return Number((min + steps * step).toPrecision(12));
}

/** A native range input with a visible value and the shared field relationships. */
export function Slider({ label, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, formatValue, showValue = true, hideLabel = false, hint, error, id: suppliedId, className, style, ref, onChange, 'aria-describedby': describedBy, 'aria-valuetext': valueText, ...props }: SliderProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  const lower = Number.isFinite(min) ? min : 0;
  const upper = Number.isFinite(max) ? Math.max(lower, max) : Math.max(lower, 100);
  const increment = step === 'any' ? step : Number.isFinite(step) && step > 0 ? step : 1;
  const [internal, setInternal] = useState(() => rangeValue(defaultValue, lower, upper, increment));
  const controlled = value !== undefined;
  const current = controlled ? rangeValue(value, lower, upper, increment) : rangeValue(internal, lower, upper, increment);
  const formatted = formatValue ? formatValue(current) : String(current);
  const initial = rangeValue(defaultValue, lower, upper, increment);
  const progress = upper > lower ? (current - lower) / (upper - lower) * 100 : 0;

  useEffect(() => {
    if (!controlled && input.current) setInternal(input.current.valueAsNumber);
  }, [controlled, lower, upper, increment, defaultValue]);

  useEffect(() => {
    const element = input.current;
    const form = element?.form;
    if (!form || controlled) return;
    let active = true;
    const onReset = (event: Event) => {
      // WebKit can run a microtask before applying the native reset. Read the
      // range in the next task, after the default action and all reset handlers.
      window.setTimeout(() => {
        if (active && !event.defaultPrevented && input.current === element) setInternal(element.valueAsNumber);
      }, 0);
    };
    form.addEventListener('reset', onReset);
    return () => { active = false; form.removeEventListener('reset', onReset); };
  }, [controlled, props.form]);

  return <div className={['cr-field', 'cr-slider', className].filter(Boolean).join(' ')} data-disabled={props.disabled || undefined}>
    <div className="cr-slider-header"><label htmlFor={id} className={hideLabel ? 'cr-sr-only' : undefined}>{label}</label>{showValue && <output htmlFor={id} className="cr-slider-value" aria-hidden="true">{formatted}</output>}</div>
    <input {...props} ref={input} type="range" id={id} min={lower} max={upper} step={increment}
      value={controlled ? current : undefined} defaultValue={controlled ? undefined : initial}
      data-cr-autofocus={props.autoFocus || undefined}
      className="cr-slider-input" style={{ ...style, '--cr-slider-progress': `${progress}%` } as CSSProperties}
      aria-invalid={error ? true : props['aria-invalid']}
      aria-describedby={[describedBy, (error || hint) && `${id}-${error ? 'error' : 'hint'}`].filter(Boolean).join(' ') || undefined}
      aria-valuetext={valueText ?? (formatValue ? formatted : undefined)}
      onChange={event => {
        const next = event.currentTarget.valueAsNumber;
        if (!controlled) setInternal(next);
        onValueChange?.(next);
        onChange?.(event);
      }} />
    {hint && !error && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    {error && <Text size="small" className="cr-field-error" id={`${id}-error`}><AlertCircle size={12} aria-hidden="true" /><span>{error}</span></Text>}
  </div>;
}
