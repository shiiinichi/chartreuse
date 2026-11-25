import { useCallback, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './components';
import type { ButtonProps } from './components';
import type { IconSource } from './icons';
import { findOptionByTyping, isOptionNavigationKey, nextOptionIndex, OptionList, revealActiveOption } from './OptionList';
import type { OptionListItem } from './OptionList';
import { optionListViewport, trackOptionListAnchor } from './option-list-anchor';
import './floating-surface.css';
import './button-select.css';

export interface ButtonSelectControls {
  /** Dismiss the popover after committing a choice. */
  close: () => void;
}

export type ButtonSelectOption = OptionListItem;

export interface ButtonSelectProps extends Omit<ButtonProps,
  'content' | 'type' | 'popover' | 'popoverTarget' | 'popoverTargetAction' | 'command' | 'commandFor' | 'aria-controls' | 'aria-expanded'
> {
  /** Custom popover content, or a renderer that can close the panel after an interaction. */
  content?: ReactNode | ((controls: ButtonSelectControls) => ReactNode);
  /** Choices displayed in the built-in popover. */
  options?: readonly ButtonSelectOption[];
  /** Show the standard checkmark or a custom icon beside the selected built-in option. Hidden by default. */
  checkmark?: boolean | IconSource;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  /** Keep the popover at the trigger's width, within the viewport. Defaults to false. */
  matchTriggerWidth?: boolean;
  panelClassName?: string;
}

function positionCustomPanel(button: HTMLElement, panel: HTMLDivElement, view: Window, matchTriggerWidth: boolean, align: 'start' | 'end' = 'start') {
  const { left, top, right, bottom } = optionListViewport(view, panel.ownerDocument);
  const inset = 8;
  const gap = 6;
  const anchor = button.getBoundingClientRect();
  const maxWidth = Math.max(0, right - left - 2 * inset);
  const minTop = top + inset;
  const maxBottom = Math.max(minTop, bottom - inset);
  const belowStart = Math.min(maxBottom, Math.max(minTop, anchor.bottom + gap));
  const aboveEnd = Math.max(minTop, Math.min(maxBottom, anchor.top - gap));

  panel.style.maxWidth = `${maxWidth}px`;
  panel.style.width = matchTriggerWidth ? `${anchor.width}px` : '';
  const preferredHeight = panel.scrollHeight + panel.offsetHeight - panel.clientHeight;
  const below = maxBottom - belowStart;
  const above = aboveEnd - minTop;
  const opensAbove = below < preferredHeight && above > below;

  const available = opensAbove ? above : below;
  panel.style.maxHeight = `${available}px`;
  const { width, height } = panel.getBoundingClientRect();
  const rtl = view.getComputedStyle(button).direction === 'rtl';
  const start = rtl === (align === 'start') ? anchor.right - width : anchor.left;
  panel.style.left = `${Math.max(left + inset, Math.min(start, right - inset - width))}px`;
  panel.style.top = `${opensAbove ? aboveEnd - height : belowStart}px`;
  panel.dataset.positioned = '';
}


/** Keeps an open custom popover beside its anchor while the page scrolls or resizes. Returns the cleanup. */
export function trackCustomPanel(target: HTMLElement, popup: HTMLDivElement, view: Window & typeof globalThis, matchTriggerWidth: boolean, align: 'start' | 'end' = 'start') {
  popup.style.direction = '';
  popup.style.minWidth = '';
  popup.style.bottom = '';
  let frame = 0;
  const place = () => {
    if (popup.matches(':popover-open')) positionCustomPanel(target, popup, view, matchTriggerWidth, align);
  };
  const schedule = () => {
    view.cancelAnimationFrame(frame);
    frame = view.requestAnimationFrame(place);
  };
  const observer = new view.ResizeObserver(schedule);
  observer.observe(target);
  observer.observe(popup);
  view.addEventListener('scroll', schedule, true);
  view.addEventListener('resize', schedule);
  view.visualViewport?.addEventListener('resize', schedule);
  view.visualViewport?.addEventListener('scroll', schedule);
  place();
  return () => {
    observer.disconnect();
    view.cancelAnimationFrame(frame);
    view.removeEventListener('scroll', schedule, true);
    view.removeEventListener('resize', schedule);
    view.visualViewport?.removeEventListener('resize', schedule);
    view.visualViewport?.removeEventListener('scroll', schedule);
    delete popup.dataset.positioned;
  };
}

const noOptions: readonly ButtonSelectOption[] = [];

export interface ButtonSelectCoreProps extends ButtonSelectProps {
  /** Element the popover is positioned against and sized to with matchTriggerWidth. Defaults to the trigger. */
  anchor?: RefObject<HTMLElement | null>;
}

/** ButtonSelect's implementation; SplitButton anchors the popover to its whole group. Not part of the public API. */
export function ButtonSelectCore({ anchor, children, content, options = noOptions, value, defaultValue, checkmark, onValueChange,
  placeholder = 'Select an option', emptyMessage = 'No options available.', matchTriggerWidth = false, panelClassName,
  className, iconRight = ChevronDown, disabled, loading, ref, onBlur, onKeyDown, ...props }: ButtonSelectCoreProps) {
  const panelId = `${useId()}-button-select`;
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [selection, setSelection] = useState(() => defaultValue === undefined ? undefined : String(defaultValue));
  const [active, setActive] = useState(-1);
  const search = useRef({ query: '', at: 0 });
  const builtIn = content === undefined;
  const labelId = builtIn && !(props['aria-label'] || props['aria-labelledby']) ? `${panelId}-label` : undefined;
  const selectedValue = value === undefined ? selection : String(value);
  const selectedIndex = builtIn ? options.findIndex(option => !option.disabled && option.value === selectedValue) : -1;
  const selected = options[selectedIndex];
  const initialActive = selectedIndex >= 0 ? selectedIndex : options.findIndex(option => !option.disabled);
  const activeIndex = options[active] && !options[active].disabled ? active : initialActive;

  useImperativeHandle(ref, () => button.current!, []);

  const close = useCallback(() => {
    const popup = panel.current;
    if (popup?.hidePopover && popup.matches(':popover-open')) popup.hidePopover();
  }, []);

  useLayoutEffect(() => {
    if (disabled || loading) close();
  }, [disabled, loading, close]);

  useLayoutEffect(() => {
    const trigger = button.current;
    const popup = panel.current;
    const view = popup?.ownerDocument.defaultView;
    if (!expanded || !trigger || !popup || !view || !popup.matches(':popover-open')) return;
    const target = anchor?.current ?? trigger;
    if (builtIn) return trackOptionListAnchor(target, popup, view,
      hit => target.contains(hit) || popup.contains(hit), close, matchTriggerWidth);

    return trackCustomPanel(target, popup, view, matchTriggerWidth);
  }, [expanded, matchTriggerWidth, builtIn, close, anchor]);

  useLayoutEffect(() => {
    if (builtIn && expanded && activeIndex >= 0) revealActiveOption(panel.current, `${panelId}-${activeIndex}`);
  }, [builtIn, expanded, activeIndex, panelId]);

  function choose(option: ButtonSelectOption) {
    if (option.disabled) return;
    if (value === undefined) setSelection(option.value);
    onValueChange?.(option.value);
    close();
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    const popup = panel.current;
    if (event.defaultPrevented || event.nativeEvent.isComposing || !popup?.showPopover) return;
    const isOpen = popup.matches(':popover-open');
    const { key } = event;

    if (isOptionNavigationKey(key)) {
      event.preventDefault();
      if (!isOpen) event.currentTarget.click();
      setActive(nextOptionIndex(options, isOpen ? activeIndex : -1, key));
    } else if (isOpen && (key === 'Enter' || key === ' ')) {
      event.preventDefault();
      if (options[activeIndex]) choose(options[activeIndex]);
    } else if (isOpen && key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (isOpen && key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const match = findOptionByTyping(options, activeIndex, key, event.timeStamp, search.current);
      if (match >= 0) setActive(match);
    }
  }

  return <>
    <Button {...props} ref={button} type="button" iconRight={iconRight} disabled={disabled} loading={loading}
      value={builtIn ? selected?.value : value} defaultValue={builtIn ? undefined : defaultValue}
      className={['cr-button-select-trigger', className].filter(Boolean).join(' ')}
      popoverTarget={panelId} aria-controls={panelId} aria-expanded={expanded} onKeyDown={builtIn ? navigate : onKeyDown}
      onBlur={builtIn ? event => { onBlur?.(event); close(); } : onBlur}
      {...(builtIn && { role: 'combobox', 'aria-haspopup': 'listbox',
        'aria-activedescendant': expanded && activeIndex >= 0 ? `${panelId}-${activeIndex}` : undefined })}>
      <span className="cr-button-select-label" id={labelId}>{builtIn ? children ?? selected?.label ?? placeholder : children}</span>
    </Button>
    <div ref={panel} id={panelId} popover="auto" className={['cr-button-select-panel', builtIn && 'cr-option-list-popup', panelClassName].filter(Boolean).join(' ')}
      role={builtIn ? 'listbox' : undefined} aria-label={builtIn ? props['aria-label'] : undefined}
      aria-labelledby={builtIn ? props['aria-labelledby'] ?? labelId : undefined}
      onBeforeToggle={event => {
        if (event.target !== event.currentTarget) return;
        if (event.newState === 'closed' && event.currentTarget.matches(':focus-within')) {
          button.current?.focus({ preventScroll: true });
        }
        if (builtIn && event.newState === 'open') {
          setActive(initialActive);
          search.current = { query: '', at: 0 };
          button.current?.focus({ preventScroll: true });
        }
      }}
      onToggle={event => {
        if (event.target === event.currentTarget) setExpanded(event.newState === 'open');
      }}>
      {builtIn ? <OptionList id={panelId} options={options} active={expanded ? activeIndex : -1}
        value={selected?.value} checkmark={checkmark} emptyMessage={emptyMessage} onActivate={setActive} onSelect={choose} />
        : typeof content === 'function' ? content({ close }) : content}
    </div>
  </>;
}
