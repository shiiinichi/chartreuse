import { useCallback, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './components';
import type { ButtonProps } from './components';
import './button-select.css';

export interface ButtonSelectControls {
  /** Dismiss the popover after committing a choice. */
  close: () => void;
}

export interface ButtonSelectProps extends Omit<ButtonProps,
  'content' | 'type' | 'popover' | 'popoverTarget' | 'popoverTargetAction' | 'command' | 'commandFor' | 'aria-controls' | 'aria-expanded'
> {
  /** Popover content, or a renderer that can close the panel after an interaction. */
  content: ReactNode | ((controls: ButtonSelectControls) => ReactNode);
  /** Size the popover to the trigger's width, within the viewport. */
  matchTriggerWidth?: boolean;
  panelClassName?: string;
}

function positionPanel(button: HTMLButtonElement, panel: HTMLDivElement, view: Window, matchTriggerWidth: boolean) {
  const viewport = view.visualViewport;
  const viewportLeft = viewport?.offsetLeft ?? 0;
  const viewportTop = viewport?.offsetTop ?? 0;
  const viewportWidth = viewport?.width ?? panel.ownerDocument.documentElement.clientWidth;
  const viewportHeight = viewport?.height ?? panel.ownerDocument.documentElement.clientHeight;
  const inset = 8;
  const gap = 6;
  const anchor = button.getBoundingClientRect();
  const maxWidth = Math.max(0, viewportWidth - 2 * inset);
  const minTop = viewportTop + inset;
  const maxBottom = Math.max(minTop, viewportTop + viewportHeight - inset);
  const belowStart = Math.min(maxBottom, Math.max(minTop, anchor.bottom + gap));
  const aboveEnd = Math.max(minTop, Math.min(maxBottom, anchor.top - gap));

  panel.style.maxWidth = `${maxWidth}px`;
  panel.style.width = matchTriggerWidth ? `${anchor.width}px` : '';
  const contentHeight = panel.scrollHeight + panel.offsetHeight - panel.clientHeight;
  const below = maxBottom - belowStart;
  const above = aboveEnd - minTop;
  const opensAbove = below < contentHeight && above > below;

  panel.style.maxHeight = `${opensAbove ? above : below}px`;
  const { width, height } = panel.getBoundingClientRect();
  const start = view.getComputedStyle(button).direction === 'rtl' ? anchor.right - width : anchor.left;
  panel.style.left = `${Math.max(viewportLeft + inset, Math.min(start, viewportLeft + viewportWidth - inset - width))}px`;
  panel.style.top = `${opensAbove ? aboveEnd - height : belowStart}px`;
  panel.dataset.positioned = '';
}

/** A Button that reveals a panel whose layout and selection are owned by the caller. */
export function ButtonSelect({ children, content, matchTriggerWidth = false, panelClassName, className, iconRight = ChevronDown, disabled, loading, ref, ...props }: ButtonSelectProps) {
  const panelId = `${useId()}-button-select`;
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

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

    let frame = 0;
    const place = () => {
      if (popup.matches(':popover-open')) positionPanel(trigger, popup, view, matchTriggerWidth);
    };
    const schedule = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(place);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(trigger);
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
  }, [expanded, matchTriggerWidth]);

  return <>
    <Button {...props} ref={button} type="button" iconRight={iconRight} disabled={disabled} loading={loading}
      className={['cr-button-select-trigger', className].filter(Boolean).join(' ')}
      popoverTarget={panelId} aria-controls={panelId} aria-expanded={expanded}>
      <span className="cr-button-select-label">{children}</span>
    </Button>
    <div ref={panel} id={panelId} popover="auto" className={['cr-button-select-panel', panelClassName].filter(Boolean).join(' ')}
      onBeforeToggle={event => {
        if (event.target === event.currentTarget && event.newState === 'closed' && event.currentTarget.matches(':focus-within')) {
          button.current?.focus({ preventScroll: true });
        }
      }}
      onToggle={event => {
        if (event.target === event.currentTarget) setExpanded(event.newState === 'open');
      }}>
      {typeof content === 'function' ? content({ close }) : content}
    </div>
  </>;
}
