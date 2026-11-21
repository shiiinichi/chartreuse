import { useCallback, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ControlSize } from './control-size';
import type { IconSource } from './icons';
import { findOptionByTyping, isOptionNavigationKey, nextOptionIndex, OptionList, revealActiveOption } from './OptionList';
import type { OptionListGroup, OptionListItem } from './OptionList';
import { matchOptionListAnchor, optionListViewport, optionListViewportInset, trackOptionListAnchor } from './option-list-anchor';
import { Text } from './Text';

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {
  label: string;
  size?: ControlSize | number;
  /** Show the standard checkmark or a custom icon beside the selected popup option. Hidden by default. */
  checkmark?: boolean | IconSource;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
}

function readOptions(select: HTMLSelectElement) {
  const options: OptionListItem[] = [];
  const groups: OptionListGroup[] = [];
  let previousGroup: HTMLOptGroupElement | null = null;
  for (const [index, option] of Array.from(select.options).entries()) {
    const group = option.closest('optgroup');
    if (option.hidden || group?.hidden) continue;
    if (group && previousGroup !== group) {
      groups.push({ label: group.label, start: options.length, end: options.length, disabled: group.disabled });
    }
    if (group) groups[groups.length - 1].end += 1;
    previousGroup = group;
    options.push({ value: String(index), label: option.label, disabled: option.disabled || group?.disabled });
  }
  return { options, groups, selected: select.selectedIndex < 0 ? undefined : String(select.selectedIndex) };
}

function currentOption(list: ReturnType<typeof readOptions>) {
  const selected = list.options.findIndex(option => option.value === list.selected && !option.disabled);
  return selected >= 0 ? selected : nextOptionIndex(list.options, -1, 'Home');
}

export function Select({ label, size = 'md', checkmark, hint, error, hideLabel = false, id: suppliedId, className, children,
  ref, onBlur, onClick, onMouseDown, onKeyDown, ...props }: SelectProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const labelId = `${id}-label`;
  const listId = `${id}-options`;
  const nativeSize = typeof size === 'number' ? size : undefined;
  const isListbox = props.multiple || (nativeSize ?? 1) > 1;
  const controlSize = typeof size === 'string' ? size : 'md';
  const select = useRef<HTMLSelectElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const search = useRef({ query: '', at: 0 });
  const cancelledMouseDown = useRef(false);
  const [list, setList] = useState<ReturnType<typeof readOptions> | null>(null);
  const [active, setActive] = useState(-1);
  const expanded = list !== null && !props.disabled && !isListbox;
  const activeIndex = list && list.options[active] && !list.options[active].disabled ? active : list ? currentOption(list) : -1;

  useImperativeHandle(ref, () => select.current!, []);

  const close = useCallback(() => setList(null), []);

  useLayoutEffect(() => {
    if (props.disabled || isListbox) close();
  }, [props.disabled, isListbox, close]);

  useLayoutEffect(() => {
    const panel = popup.current;
    const trigger = select.current;
    if (!panel?.showPopover || !trigger) return;
    if (!expanded) {
      if (panel.matches(':popover-open')) panel.hidePopover();
      return;
    }

    const doc = panel.ownerDocument;
    const view = doc.defaultView;
    if (!view) return;
    if (!panel.matches(':popover-open')) panel.showPopover();

    const place = (rect: DOMRect, viewport: ReturnType<typeof optionListViewport>) => {
      if (trigger.matches(':disabled')) { close(); return; }
      const direction = view.getComputedStyle(trigger).direction;
      const availableWidth = Math.max(0, viewport.right - viewport.left - 2 * optionListViewportInset);
      panel.style.direction = direction;
      panel.style.minWidth = `${Math.min(rect.width, availableWidth)}px`;
      panel.style.maxWidth = `${availableWidth}px`;
      const { width } = panel.getBoundingClientRect();
      const position = matchOptionListAnchor(rect, viewport, width, direction === 'rtl');
      panel.style.left = `${position.left}px`;
      panel.style.top = position.above ? 'auto' : `${position.top}px`;
      panel.style.bottom = position.above ? `${position.bottom}px` : 'auto';
      panel.style.maxHeight = `${position.maxHeight}px`;
    };
    const stopTracking = trackOptionListAnchor(trigger, view,
      target => trigger.contains(target) || panel.contains(target), place, close);
    const resize = new view.ResizeObserver(() => place(trigger.getBoundingClientRect(), optionListViewport(view, doc)));
    resize.observe(panel, { box: 'border-box' });
    const outside = (event: PointerEvent) => {
      const path = event.composedPath();
      if (!path.includes(panel) && !path.includes(trigger) && !Array.from(trigger.labels ?? []).some(label => path.includes(label))) close();
    };
    const refresh = () => {
      if (trigger.matches(':disabled')) close();
      else setList(readOptions(trigger));
    };
    const observer = new MutationObserver(refresh);
    observer.observe(trigger, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['label', 'disabled', 'hidden', 'value', 'selected'] });
    const form = trigger.form;
    form?.addEventListener('reset', close);
    trigger.addEventListener('change', close);
    doc.addEventListener('pointerdown', outside, true);
    return () => {
      stopTracking();
      resize.disconnect();
      observer.disconnect();
      form?.removeEventListener('reset', close);
      trigger.removeEventListener('change', close);
      doc.removeEventListener('pointerdown', outside, true);
    };
  }, [expanded, props.form, close]);

  useLayoutEffect(() => {
    if (expanded && select.current) setList(readOptions(select.current));
  }, [expanded, props.value]);

  useLayoutEffect(() => {
    if (expanded && activeIndex >= 0) revealActiveOption(popup.current, `${listId}-${activeIndex}`);
  }, [expanded, activeIndex, listId]);

  function open(trigger: HTMLSelectElement, key?: 'ArrowDown' | 'ArrowUp' | 'Home' | 'End') {
    const choices = readOptions(trigger);
    search.current = { query: '', at: 0 };
    setActive(key ? nextOptionIndex(choices.options, -1, key) : currentOption(choices));
    setList(choices);
  }

  function choose(option: OptionListItem) {
    const trigger = select.current;
    const index = Number(option.value);
    const item = trigger?.options[index];
    if (!trigger || !item || trigger.matches(':disabled') || item.disabled || item.closest('optgroup')?.disabled) return;
    close();
    if (trigger.selectedIndex === index) return;
    trigger.selectedIndex = index;
    const EventType = (trigger.ownerDocument.defaultView as (Window & typeof globalThis) | null)?.Event ?? Event;
    trigger.dispatchEvent(new EventType('input', { bubbles: true, composed: true }));
    trigger.dispatchEvent(new EventType('change', { bubbles: true }));
  }

  function suppressNativePicker(event: MouseEvent<HTMLSelectElement>) {
    onMouseDown?.(event);
    if (!popup.current?.showPopover || event.button !== 0) return;
    cancelledMouseDown.current = event.defaultPrevented;
    if (event.defaultPrevented || event.currentTarget.matches(':disabled')) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
  }

  function toggle(event: MouseEvent<HTMLSelectElement>) {
    onClick?.(event);
    const wasCancelled = event.detail > 0 && cancelledMouseDown.current;
    cancelledMouseDown.current = false;
    if (!popup.current?.showPopover || event.defaultPrevented || event.currentTarget.matches(':disabled')) return;
    event.preventDefault();
    if (wasCancelled) return;
    event.currentTarget.focus({ preventScroll: true });
    if (expanded) close();
    else open(event.currentTarget);
  }

  function navigate(event: KeyboardEvent<HTMLSelectElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.ctrlKey || event.metaKey
      || !popup.current?.showPopover || event.currentTarget.matches(':disabled')) return;
    const { key, altKey } = event;
    if (list && expanded && (key === 'Escape' || key === 'F4' || (key === 'ArrowUp' && altKey))) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (key === 'Tab') {
      close();
    } else if (isOptionNavigationKey(key)) {
      event.preventDefault();
      if (list && expanded) setActive(nextOptionIndex(list.options, activeIndex, key));
      else if (!(key === 'ArrowUp' && altKey)) open(event.currentTarget, altKey ? undefined : key);
    } else if (key === 'Enter' || key === ' ' || key === 'F4') {
      event.preventDefault();
      if (!list || !expanded) open(event.currentTarget);
      else if (list.options[activeIndex]) choose(list.options[activeIndex]);
    } else if (list && expanded && key.length === 1 && !altKey) {
      event.preventDefault();
      const match = findOptionByTyping(list.options, activeIndex, key, event.timeStamp, search.current);
      if (match >= 0) setActive(match);
    }
  }

  return <div className={['cr-field', className].filter(Boolean).join(' ')}>
    <label htmlFor={id} id={isListbox ? undefined : labelId} className={hideLabel ? 'cr-sr-only' : undefined}>{label}{props.required && ' *'}</label>
    <div className="cr-select-wrap" data-cr-input-size={isListbox ? undefined : controlSize}>
      <select {...props} ref={select} size={nativeSize} className="cr-input cr-select" id={id}
        data-cr-autofocus={props.autoFocus || undefined} aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={[props['aria-describedby'], (hint || error) && `${id}-${error ? 'error' : 'hint'}`].filter(Boolean).join(' ') || undefined}
        {...(expanded && { 'aria-expanded': true, 'aria-controls': listId, 'aria-haspopup': 'listbox',
          'aria-activedescendant': activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined })}
        onBlur={isListbox ? onBlur : event => { onBlur?.(event); close(); }}
        onMouseDown={isListbox ? onMouseDown : suppressNativePicker} onClick={isListbox ? onClick : toggle}
        onKeyDown={isListbox ? onKeyDown : navigate}>{children}</select>
      <ChevronDown size={14} aria-hidden="true" />
      {!isListbox && <div ref={popup} id={listId} popover="manual" hidden={!expanded} className="cr-select-popup cr-option-list-popup"
        role="listbox" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId)}>
        {expanded && <OptionList id={listId} options={list.options} groups={list.groups} active={activeIndex} value={list.selected} checkmark={checkmark}
          emptyMessage="No options available." onActivate={setActive} onSelect={choose} />}
      </div>}
    </div>
    {hint && !error && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    {error && <Text size="small" id={`${id}-error`} className="cr-field-error">{error}</Text>}
  </div>;
}
