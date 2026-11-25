import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Ellipsis } from 'lucide-react';
import { Button } from './components';
import type { ButtonProps } from './components';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import { trackCustomPanel } from './button-select-core';
import { findOptionByTyping } from './OptionList';
import './floating-surface.css';
import './button-select.css';
import './option-list.css';
import './menu.css';

export interface MenuItem {
  type?: 'item';
  /** Unique within the menu. */
  id: string;
  label: string;
  icon?: IconSource;
  /** 'danger' colors a destructive action, such as Delete. */
  tone?: 'neutral' | 'danger';
  disabled?: boolean;
  /** Runs after the menu closes and focus returns to the trigger, so the action can move focus elsewhere. */
  onSelect: () => void;
}

export interface MenuSeparator {
  type: 'separator';
  id?: string;
}

export type MenuEntry = MenuItem | MenuSeparator;

export interface MenuProps extends Omit<ButtonProps,
  'children' | 'icon' | 'iconRight' | 'onSelect' | 'content' | 'type' | 'popover' | 'popoverTarget' | 'popoverTargetAction' | 'command' | 'commandFor' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup'
> {
  /** Accessible name of the trigger and the menu, such as "More actions for #5". Also the icon-only trigger's tooltip. */
  label: string;
  items: readonly MenuEntry[];
  /** Trigger icon. Defaults to Ellipsis (⋯). */
  icon?: IconSource;
  /** Visible trigger text. Without it the trigger is an icon button. */
  children?: ReactNode;
  /** Which trigger edge the menu lines up with. Defaults to 'end', for triggers at the end of a row. */
  align?: 'start' | 'end';
  panelClassName?: string;
}

function isItem(entry: MenuEntry): entry is MenuItem {
  return entry.type !== 'separator';
}

/** An action menu behind a trigger button: Edit, Copy link, Delete. For picking a value, use ButtonSelect. */
export function Menu({ label, items, icon = Ellipsis, children, align = 'end', variant = 'ghost', size = 'md', panelClassName,
  className, title, disabled, loading, onKeyDown, ref, ...props }: MenuProps) {
  const menuId = `${useId()}-menu`;
  const trigger = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const focusOnOpen = useRef<'first' | 'last'>('first');
  const search = useRef({ query: '', at: 0 });
  const iconOnly = children === undefined || children === null || children === false;
  const options = items.map(entry => isItem(entry) ? { value: entry.id, label: entry.label, disabled: entry.disabled } : { value: '', label: '', disabled: true });

  const menuItems = () => Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
  const focusIndex = (index: number) => panel.current?.querySelector<HTMLButtonElement>(`[data-index="${index}"]`)?.focus({ preventScroll: false });
  const enabledIndexes = () => options.flatMap((option, index) => option.disabled ? [] : [index]);

  const close = (returnFocus = true) => {
    const popup = panel.current;
    if (returnFocus) trigger.current?.focus({ preventScroll: true });
    if (popup?.hidePopover && popup.matches(':popover-open')) popup.hidePopover();
  };

  const open = (edge: 'first' | 'last') => {
    focusOnOpen.current = edge;
    const popup = panel.current;
    if (popup?.showPopover && !popup.matches(':popover-open')) popup.showPopover();
    else {
      const enabled = enabledIndexes();
      const target = edge === 'first' ? enabled[0] : enabled.at(-1);
      if (target !== undefined) focusIndex(target);
    }
  };

  useLayoutEffect(() => {
    if (disabled || loading) close(false);
  }, [disabled, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const target = trigger.current;
    const popup = panel.current;
    const view = popup?.ownerDocument.defaultView;
    if (!expanded || !target || !popup || !view || !popup.matches(':popover-open')) return;
    return trackCustomPanel(target, popup, view, false, align);
  }, [expanded, align]);

  function choose(item: MenuItem) {
    if (item.disabled) return;
    close();
    item.onSelect();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open(event.key === 'ArrowDown' ? 'first' : 'last');
    } else if (event.key === 'Enter' || event.key === ' ') {
      // The native click opens the popover; the first item then takes focus.
      focusOnOpen.current = 'first';
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.nativeEvent.isComposing) return;
    const current = Number((event.target as HTMLElement).closest<HTMLElement>('[data-index]')?.dataset.index ?? -1);
    const enabled = enabledIndexes();
    const position = enabled.indexOf(current);
    const { key } = event;
    let next: number | undefined;
    if (key === 'ArrowDown') next = enabled[position < 0 ? 0 : (position + 1) % enabled.length];
    else if (key === 'ArrowUp') next = enabled[position < 0 ? enabled.length - 1 : (position - 1 + enabled.length) % enabled.length];
    else if (key === 'Home' || key === 'PageUp') next = enabled[0];
    else if (key === 'End' || key === 'PageDown') next = enabled.at(-1);
    else if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    } else if (key === 'Tab') {
      // Focus moves on from the trigger, as if the menu had not been opened.
      close();
      return;
    } else if (key.length === 1 && key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const match = findOptionByTyping(options, current, key, event.timeStamp, search.current);
      if (match >= 0) focusIndex(match);
      return;
    } else return;
    event.preventDefault();
    if (next !== undefined) focusIndex(next);
  }

  return <>
    <Button {...props} ref={element => {
      trigger.current = element;
      if (typeof ref === 'function') return ref(element);
      if (ref) ref.current = element;
    }} type="button" variant={variant} size={size} icon={icon} disabled={disabled} loading={loading}
      className={['cr-menu-trigger', iconOnly && 'cr-icon-button', className].filter(Boolean).join(' ')}
      aria-label={iconOnly ? label : props['aria-label']} title={title ?? (iconOnly ? label : undefined)}
      aria-haspopup="menu" aria-expanded={expanded} aria-controls={menuId} popoverTarget={menuId}
      onKeyDown={onTriggerKeyDown}>{iconOnly ? null : children}</Button>
    <div ref={panel} id={menuId} popover="auto" role="menu" aria-label={label} aria-orientation="vertical"
      className={['cr-button-select-panel', 'cr-option-list-popup', 'cr-menu', panelClassName].filter(Boolean).join(' ')}
      onKeyDown={onMenuKeyDown}
      onBeforeToggle={event => {
        if (event.target !== event.currentTarget) return;
        if (event.newState === 'closed' && event.currentTarget.matches(':focus-within')) trigger.current?.focus({ preventScroll: true });
        if (event.newState === 'open') search.current = { query: '', at: 0 };
      }}
      onToggle={event => {
        if (event.target !== event.currentTarget) return;
        const isOpen = event.newState === 'open';
        setExpanded(isOpen);
        if (isOpen) {
          const enabled = enabledIndexes();
          const target = focusOnOpen.current === 'first' ? enabled[0] : enabled.at(-1);
          focusOnOpen.current = 'first';
          if (target !== undefined) focusIndex(target);
          else menuItems()[0]?.focus();
        }
      }}>
      {items.map((entry, index) => isItem(entry)
        ? <button key={entry.id} type="button" role="menuitem" tabIndex={-1} data-index={index} className="cr-menu-item"
          data-tone={entry.tone === 'danger' ? 'danger' : undefined} aria-disabled={entry.disabled || undefined}
          onPointerMove={event => { if (!entry.disabled && event.currentTarget.ownerDocument.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true }); }}
          onClick={() => choose(entry)}>
          {renderIcon(entry.icon, { size: 15 })}<span className="cr-menu-item-label">{entry.label}</span>
        </button>
        : <div key={entry.id ?? `separator-${index}`} role="separator" className="cr-menu-separator" />)}
    </div>
  </>;
}
