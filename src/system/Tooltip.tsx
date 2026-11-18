import { Children, Fragment, cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent, HTMLAttributes, PointerEvent, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { normalizeTooltipPlacement, tooltipPosition } from './tooltip-position';
import type { TooltipPlacement, TooltipPosition } from './tooltip-position';
import './tooltip.css';

export type { TooltipPlacement } from './tooltip-position';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content' | 'title' | 'role' | 'tabIndex' | 'hidden' | 'popover' | 'aria-live'> {
  /** One HTML element or component forwarding native aria-describedby and title. */
  children: ReactElement;
  /** Supplementary text only. Keep essential instructions and interactive content inline. */
  content: ReactNode;
  placement?: TooltipPlacement;
  /** Pointer-hover delay in milliseconds. Keyboard focus opens immediately. */
  openDelay?: number;
  closeDelay?: number;
  arrow?: boolean;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type TriggerAttributes = { 'aria-describedby'?: string; title?: string };
const delay = (value: number, fallback: number) => Number.isFinite(value) ? Math.max(0, value) : fallback;
const samePosition = (a: TooltipPosition | null, b: TooltipPosition) => !!a && a.left === b.left && a.top === b.top && a.side === b.side && a.placement === b.placement && a.arrowX === b.arrowX && a.arrowY === b.arrowY;

/** A supplementary description; the child keeps its own action and keyboard focus. */
export function Tooltip({ children, content, placement = 'top', openDelay = 300, closeDelay = 100, arrow = true, disabled = false, open, defaultOpen = false, onOpenChange, id: suppliedId, className, style, onPointerEnter, onPointerLeave, ...props }: TooltipProps) {
  const generatedId = useId();
  const id = suppliedId || `${generatedId}-tooltip`;
  const child = Children.only(children) as ReactElement<TriggerAttributes>;
  if (child.type === Fragment) throw new Error('Tooltip needs one HTML element or component that forwards native aria-describedby and title.');
  const wrapper = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interest = useRef({ trigger: false, bubble: false, focus: false });
  const blocked = useRef(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [dismissed, setDismissed] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const hasContent = content !== null && content !== undefined && content !== false && (typeof content !== 'string' || content.trim().length > 0);
  const enabled = !disabled && hasContent;
  const requestedOpen = open === undefined ? internalOpen : open;
  const expanded = enabled && requestedOpen && !dismissed;
  const latest = useRef({ requestedOpen, enabled, onOpenChange, controlled: open !== undefined });
  latest.current = { requestedOpen, enabled, onOpenChange, controlled: open !== undefined };
  const previousControlledOpen = useRef(open);

  const clearTimer = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const request = (next: boolean) => {
    if (next && (!latest.current.enabled || blocked.current)) return;
    if (latest.current.requestedOpen === next) return;
    if (!latest.current.controlled) setInternalOpen(next);
    latest.current.onOpenChange?.(next);
  };
  const hasInterest = () => interest.current.trigger || interest.current.bubble || interest.current.focus;
  const begin = (source: 'trigger' | 'bubble' | 'focus') => {
    if (!latest.current.enabled) return;
    clearTimer();
    if (!hasInterest()) { blocked.current = false; setDismissed(false); }
    interest.current[source] = true;
    if (blocked.current) return;
    if (source === 'focus') request(true);
    else timer.current = setTimeout(() => { timer.current = null; request(true); }, delay(openDelay, 300));
  };
  const end = (source: 'trigger' | 'bubble' | 'focus') => {
    interest.current[source] = false;
    clearTimer();
    if (!hasInterest()) timer.current = setTimeout(() => { timer.current = null; request(false); }, delay(closeDelay, 100));
  };

  useEffect(() => {
    // Keeping the portal inside its native dialog also keeps it outside that
    // dialog's inert background. Popover promotion still escapes clipping.
    setHost(wrapper.current?.closest('dialog') || document.body);
    return () => clearTimer();
  }, []);
  useEffect(() => {
    if (open === true && previousControlledOpen.current !== true) {
      blocked.current = false;
      setDismissed(false);
    }
    previousControlledOpen.current = open;
  }, [open]);
  useEffect(() => {
    if (enabled) return;
    clearTimer();
    interest.current = { trigger: false, bubble: false, focus: false };
    blocked.current = false;
    setDismissed(false);
    if (open === undefined) setInternalOpen(false);
  }, [enabled, open]);

  useLayoutEffect(() => {
    const panel = bubble.current;
    if (!host || !panel) return;
    if (!expanded) {
      if (typeof panel.hidePopover === 'function' && panel.matches(':popover-open')) panel.hidePopover();
      setPosition(null);
      interest.current.bubble = false;
      return;
    }
    const targetHost = wrapper.current?.closest('dialog') || document.body;
    if (targetHost !== host) { setHost(targetHost); return; }
    let frame = 0;
    let stopped = false;
    let dirty = true;
    let lastAnchor = '';
    const place = () => {
      if (stopped) return;
      const anchor = wrapper.current?.firstElementChild || wrapper.current;
      const viewport = window.visualViewport;
      const bounds = {
        left: viewport?.offsetLeft || 0, top: viewport?.offsetTop || 0,
        width: viewport?.width || window.innerWidth, height: viewport?.height || window.innerHeight,
      };
      const rect = anchor?.getBoundingClientRect();
      if (!anchor || !anchor.isConnected || !rect || !anchor.getClientRects().length || rect.width <= 0 || rect.height <= 0
        || getComputedStyle(anchor).visibility !== 'visible'
        || rect.right <= bounds.left || rect.left >= bounds.left + bounds.width
        || rect.bottom <= bounds.top || rect.top >= bounds.top + bounds.height) {
        if (typeof panel.hidePopover === 'function' && panel.matches(':popover-open')) panel.hidePopover();
        setPosition(previous => previous === null ? previous : null);
        dirty = true;
        lastAnchor = '';
        frame = requestAnimationFrame(place);
        return;
      }
      const key = `${rect.left},${rect.top},${rect.width},${rect.height},${viewport?.offsetLeft},${viewport?.offsetTop},${viewport?.width},${viewport?.height}`;
      if (dirty || key !== lastAnchor) {
        for (const [property, value] of [['--cr-tooltip-available-width', `${Math.max(0, bounds.width - 16)}px`], ['--cr-tooltip-available-height', `${Math.max(0, bounds.height - 18)}px`]]) {
          if (panel.style.getPropertyValue(property) !== value) panel.style.setProperty(property, value);
        }
        if (typeof panel.showPopover === 'function' && !panel.matches(':popover-open')) {
          try { panel.showPopover(); } catch { /* Fixed portal positioning remains a usable fallback. */ }
        }
        const size = panel.getBoundingClientRect();
        const next = tooltipPosition(rect, size, bounds, normalizeTooltipPlacement(placement), getComputedStyle(anchor).direction === 'rtl');
        setPosition(previous => samePosition(previous, next) ? previous : next);
        dirty = false;
        lastAnchor = key;
      }
      frame = requestAnimationFrame(place);
    };
    const markDirty = () => { dirty = true; };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(markDirty);
    observer?.observe(panel);
    const anchor = wrapper.current?.firstElementChild || wrapper.current;
    if (anchor) observer?.observe(anchor);
    window.addEventListener('resize', markDirty);
    window.addEventListener('scroll', markDirty, true);
    window.visualViewport?.addEventListener('resize', markDirty);
    window.visualViewport?.addEventListener('scroll', markDirty);
    place();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', markDirty);
      window.removeEventListener('scroll', markDirty, true);
      window.visualViewport?.removeEventListener('resize', markDirty);
      window.visualViewport?.removeEventListener('scroll', markDirty);
    };
  }, [expanded, host, placement, content, arrow]);

  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: KeyboardEvent) => {
      const panel = bubble.current;
      if (event.key !== 'Escape' || !panel || panel.hidden || getComputedStyle(panel).visibility !== 'visible') return;
      clearTimer();
      blocked.current = true;
      setDismissed(true);
      request(false);
      event.preventDefault();
    };
    document.addEventListener('keydown', dismiss, true);
    return () => document.removeEventListener('keydown', dismiss, true);
  }, [expanded]);

  const description = enabled ? [...new Set([...(child.props['aria-describedby'] || '').split(/\s+/).filter(Boolean), id])].join(' ') : child.props['aria-describedby'];
  const trigger = cloneElement(child, { 'aria-describedby': description || undefined, title: '' });
  const floatingStyle: CSSProperties = {
    ...style,
    '--cr-tooltip-left': `${position?.left || 0}px`, '--cr-tooltip-top': `${position?.top || 0}px`,
    '--cr-tooltip-arrow-x': `${position?.arrowX || 0}px`, '--cr-tooltip-arrow-y': `${position?.arrowY || 0}px`,
    visibility: expanded && position ? 'visible' : 'hidden',
  } as CSSProperties;
  const panel = <div {...props} ref={bubble} id={id} role="tooltip" tabIndex={undefined} aria-live={undefined} title={undefined}
    popover="manual" hidden={!expanded || !host} className={['cr-tooltip', className].filter(Boolean).join(' ')}
    data-open={expanded && !!host} data-side={position?.side || 'top'} data-placement={position?.placement || placement} data-arrow={arrow}
    style={floatingStyle}
    onPointerEnter={(event: PointerEvent<HTMLDivElement>) => { onPointerEnter?.(event); if (!event.defaultPrevented && event.pointerType !== 'touch') begin('bubble'); }}
    onPointerLeave={(event: PointerEvent<HTMLDivElement>) => { onPointerLeave?.(event); if (!event.defaultPrevented && event.pointerType !== 'touch') end('bubble'); }}>
    <div className="cr-tooltip-content">{content}</div>
  </div>;
  return <><span ref={wrapper} className="cr-tooltip-trigger"
    onPointerEnter={event => { if (event.currentTarget.contains(event.target as Node) && event.pointerType !== 'touch' && !event.defaultPrevented) begin('trigger'); }}
    onPointerLeave={event => { if (event.currentTarget.contains(event.target as Node) && event.pointerType !== 'touch' && !event.defaultPrevented) end('trigger'); }}
    onFocus={(event: FocusEvent<HTMLSpanElement>) => { if (event.currentTarget.contains(event.target) && !event.defaultPrevented) begin('focus'); }}
    onBlur={(event: FocusEvent<HTMLSpanElement>) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) end('focus'); }}>{trigger}</span>
    {host ? createPortal(panel, host) : panel}
  </>;
}
