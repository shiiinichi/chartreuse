import { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import { AlertCircle, ChevronDown, Search, X } from 'lucide-react';
import type { ControlSize } from './control-size';
import type { IconSource } from './icons';
import { OptionList, revealActiveOption } from './OptionList';
import type { OptionListItem } from './OptionList';
import { trackOptionListAnchor } from './option-list-anchor';
import { Text } from './Text';
import './autocomplete.css';

export interface AutocompleteOption extends OptionListItem {}

export interface AutocompleteProps extends Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'> {
  label: string;
  size?: ControlSize;
  options: readonly AutocompleteOption[];
  value?: string;
  defaultValue?: string;
  /** Show the standard checkmark or a custom icon beside the selected option. Hidden by default. */
  checkmark?: boolean | IconSource;
  /** Keep the popover at the input's width, within the viewport. Defaults to false. */
  matchTriggerWidth?: boolean;
  onValueChange?: (value: string) => void;
  hint?: string;
  error?: string;
  emptyMessage?: string;
  /** Stretch the field to the full width of its container. Defaults to false. */
  fullWidth?: boolean;
}

export function Autocomplete({ label, size = 'md', options, value, defaultValue = '', checkmark, matchTriggerWidth = false, onValueChange, hint, error, fullWidth = false, emptyMessage = 'No matching options. Change the search text.', name, id: suppliedId, className, disabled, required, placeholder = 'Search options', ref, onFocus, onBlur, onKeyDown, ...props }: AutocompleteProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const listId = `${id}-options`;
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const selectedValue = value ?? internalValue;
  const selected = options.find(option => option.value === selectedValue && !option.disabled);
  const filterText = searching ? query.trim().toLocaleLowerCase() : '';
  const filtered = options.filter(option => !filterText || `${option.label} ${option.description || ''} ${option.value}`.toLocaleLowerCase().includes(filterText));
  const firstEnabled = filtered.findIndex(option => !option.disabled);
  const activeOption = filtered[active];
  const expanded = open && !disabled;

  useImperativeHandle(ref, () => input.current!, []);

  useEffect(() => {
    if (disabled) { setOpen(false); setSearching(false); setQuery(''); setActive(-1); }
  }, [disabled]);

  function updateValue(next: string) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }

  function choose(option: AutocompleteOption) {
    if (option.disabled) return;
    updateValue(option.value);
    setSearching(false); setQuery(''); setOpen(false); setActive(-1);
    input.current?.focus();
  }

  function showOptions() {
    if (disabled) return;
    setOpen(true);
    const current = filtered.findIndex(option => option.value === selected?.value && !option.disabled);
    setActive(current >= 0 ? current : firstEnabled);
  }

  function closeOptions() {
    setOpen(false); setSearching(false); setQuery(''); setActive(-1);
  }

  useEffect(() => {
    const control = input.current;
    if (!control) return;
    control.setCustomValidity(selected || !required ? '' : 'Select an option from the list.');
  }, [selected?.value, required]);

  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    const reset = () => {
      if (value === undefined) { setInternalValue(defaultValue); onValueChange?.(defaultValue); }
      setOpen(false); setSearching(false); setQuery(''); setActive(-1);
    };
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [defaultValue, value, onValueChange]);

  useLayoutEffect(() => {
    const panel = popup.current;
    if (!panel) return;
    if (!expanded) {
      if ('hidePopover' in panel && panel.matches(':popover-open')) panel.hidePopover();
      return;
    }
    const anchor = input.current;
    const host = root.current;
    const doc = panel.ownerDocument;
    const view = doc.defaultView;
    if (!anchor || !host || !view) return;
    if ('showPopover' in panel && !panel.matches(':popover-open')) panel.showPopover();

    const stopTracking = trackOptionListAnchor(anchor, panel, view, target => host.contains(target), closeOptions, matchTriggerWidth);
    const outside = (event: PointerEvent) => {
      if (!event.composedPath().includes(host)) closeOptions();
    };
    doc.addEventListener('pointerdown', outside, true);
    return () => {
      stopTracking();
      doc.removeEventListener('pointerdown', outside, true);
    };
  }, [expanded, matchTriggerWidth]);

  useEffect(() => {
    if (!expanded) return;
    setActive(index => filtered[index] && !filtered[index].disabled ? index : firstEnabled);
  }, [expanded, filterText, options]);

  useEffect(() => {
    if (!expanded || active < 0) return;
    revealActiveOption(popup.current, `${listId}-${active}`);
  }, [expanded, active, filterText, listId]);

  function navigate(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const enabled = filtered.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
      if (!enabled.length) { setOpen(true); setActive(-1); return; }
      if (!expanded) { setOpen(true); setActive(event.key === 'ArrowDown' ? enabled[0] : enabled[enabled.length - 1]); return; }
      const index = enabled.indexOf(active);
      const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : enabled.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length;
      setActive(enabled[next]);
    } else if (event.key === 'Enter' && expanded) {
      event.preventDefault();
      if (activeOption && !activeOption.disabled) choose(activeOption);
    } else if (event.key === 'Escape' && expanded) {
      event.preventDefault(); event.stopPropagation(); closeOptions();
    } else if (event.key === 'Tab') closeOptions();
  }

  return <div ref={root} className={['cr-field', 'cr-autocomplete', className].filter(Boolean).join(' ')} data-full-width={fullWidth || undefined}>
    <label htmlFor={id}>{label}{required && <span className="cr-required"> *</span>}</label>
    <div className="cr-autocomplete-control" data-cr-input-size={size}><Search size={16} aria-hidden="true" />
      <input {...props} ref={input} id={id} type="text" className="cr-input" role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={listId} aria-activedescendant={expanded && activeOption && !activeOption.disabled ? `${listId}-${active}` : undefined} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], (hint || error) && `${id}-${error ? 'error' : 'hint'}`].filter(Boolean).join(' ') || undefined} autoComplete="off" spellCheck={false} disabled={disabled} required={required} placeholder={placeholder} value={searching ? query : selected?.label || ''} onFocus={event => { onFocus?.(event); showOptions(); }} onClick={showOptions} onBlur={event => { onBlur?.(event); closeOptions(); }} onKeyDown={navigate} onChange={event => {
        const next = event.target.value;
        setQuery(next); setSearching(true); setOpen(true); setActive(-1);
        if (!next) updateValue('');
      }} />
      <div className="cr-autocomplete-actions">{selected && <button type="button" tabIndex={-1} disabled={disabled} aria-label={`Clear ${label}`} onPointerDown={event => event.preventDefault()} onClick={() => { updateValue(''); setSearching(false); setQuery(''); setOpen(true); setActive(firstEnabled); input.current?.focus(); }}><X size={13} aria-hidden="true" /></button>}<button type="button" tabIndex={-1} disabled={disabled} aria-label={`${expanded ? 'Hide' : 'Show'} ${label} options`} aria-expanded={expanded} onPointerDown={event => event.preventDefault()} onClick={() => { if (expanded) closeOptions(); else { input.current?.focus(); showOptions(); } }}><ChevronDown size={15} aria-hidden="true" /></button></div>
    </div>
    {hint && !error && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    {name && <input type="hidden" name={name} value={selected?.value || ''} disabled={disabled} />}
    {error && <Text size="small" className="cr-field-error" id={`${id}-error`}><AlertCircle size={12} aria-hidden="true" />{error}</Text>}
    <div ref={popup} id={listId} popover="manual" role="listbox" aria-label={`${label} options`} className="cr-autocomplete-popup cr-option-list-popup" data-open={expanded} hidden={!expanded}>
      <OptionList id={listId} options={filtered} active={active} value={selected?.value} checkmark={checkmark} emptyMessage={emptyMessage}
        onActivate={setActive} onSelect={choose} optionClassName="cr-autocomplete-option" emptyClassName="cr-autocomplete-empty" />
    </div>
  </div>;
}
