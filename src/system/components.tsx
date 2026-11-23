import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode, WheelEvent as ReactWheelEvent } from 'react';
import { AlertCircle, CheckCheck, ChevronRight, Circle, CircleCheck, Clock3, GitBranch, Info, LoaderCircle, Network, TriangleAlert, X } from 'lucide-react';
import { Link2 as TaskRelatedIcon, MessageSquare as TaskCommentsIcon, Paperclip as TaskAttachmentsIcon } from 'lucide-react';
import type { ControlSize } from './control-size';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import { Tooltip } from './Tooltip';
import { Text } from './Text';

export { Select } from './Select';
export type { SelectProps } from './Select';

export type Tone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';
const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis. 'link' renders the button as inline link text with no padding or background. */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'link';
  size?: ControlSize;
  icon?: IconSource;
  iconRight?: IconSource;
  loading?: boolean;
  /** Stretch the button to the full width of its container. Defaults to false. */
  fullWidth?: boolean;
}
export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, loading, fullWidth = false, disabled, className, type = 'button', ...props }: ButtonProps) {
  return <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cx('cr-button', className)} data-variant={variant} data-size={size} data-full-width={fullWidth || undefined} data-cr-autofocus={props.autoFocus || undefined}>
    {loading ? <LoaderCircle className="cr-spin" size={16} aria-hidden="true" /> : renderIcon(icon, { size: 16 })}
    {children}{renderIcon(iconRight, { size: 16 })}
  </button>;
}

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'fullWidth'> { icon: IconSource; label: string }
export function IconButton({ icon, label, variant = 'ghost', className, title, ...props }: IconButtonProps) {
  return <Button {...props} variant={variant} className={cx('cr-icon-button', className)} aria-label={label} title={title ?? label}>{renderIcon(icon, { size: 17 })}</Button>;
}

export function BrandMark({ className, ...props }: ComponentPropsWithRef<'svg'>) {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props} className={cx('cr-brand-mark', className)}><path d="M20 20H5V5h4a11 11 0 0 1 11 11Zm0 0V5h15v4a11 11 0 0 1-11 11Zm0 0h15v15h-4a11 11 0 0 1-11-11Zm0 0v15H5v-4a11 11 0 0 1 11-11Z" fill="currentColor" /></svg>;
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: 'soft' | 'ghost';
  dot?: boolean;
  icon?: IconSource;
}
export function Badge({ children, tone = 'neutral', variant = 'soft', dot, icon, className, ...props }: BadgeProps) {
  return <span {...props} className={cx('cr-badge', className)} data-tone={tone} data-variant={variant}>{icon ? renderIcon(icon, { size: 12 }) : dot && <span className="cr-status-dot" aria-hidden="true" />}{children}</span>;
}

export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  label: string;
  size?: ControlSize;
  hint?: string;
  error?: string;
  icon?: IconSource;
  /** Visually hide the label while keeping it as the input's accessible name. Defaults to false. */
  hideLabel?: boolean;
  /** Stretch the field to the full width of its container. Defaults to false. */
  fullWidth?: boolean;
}
export function TextField({ label, size = 'md', hint, error, icon, hideLabel = false, fullWidth = false, className, id: suppliedId, required, ...props }: TextFieldProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <div className={cx('cr-field', className)} data-full-width={fullWidth || undefined}>
    <label htmlFor={id} className={hideLabel ? 'cr-sr-only' : undefined}>{label}{required && <span className="cr-required"> *</span>}</label>
    <div className="cr-input-wrap" data-cr-input-size={size}>{renderIcon(icon, { size: 16 })}<input {...props} id={id} required={required} data-cr-autofocus={props.autoFocus || undefined} className="cr-input" aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], (error || hint) && `${id}-${error ? 'error' : 'hint'}`].filter(Boolean).join(' ') || undefined} /></div>
    {hint && !error && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    {error && <Text size="small" className="cr-field-error" id={`${id}-error`}><AlertCircle size={12} aria-hidden="true" /><span>{error}</span></Text>}
  </div>;
}

export interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
  label: string;
  hint?: string;
  error?: string;
  /** Visually hide the label while keeping it as the textarea's accessible name. Defaults to false. */
  hideLabel?: boolean;
  /** Stretch the field to the full width of its container. Defaults to false. */
  fullWidth?: boolean;
}
export function TextArea({ label, hint, error, hideLabel = false, fullWidth = false, id: suppliedId, className, ...props }: TextAreaProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <div className={cx('cr-field', className)} data-full-width={fullWidth || undefined}><label htmlFor={id} className={hideLabel ? 'cr-sr-only' : undefined}>{label}{props.required && ' *'}</label>
    <textarea {...props} id={id} data-cr-autofocus={props.autoFocus || undefined} className="cr-input" aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], (hint || error) && `${id}-${error ? 'error' : 'hint'}`].filter(Boolean).join(' ') || undefined} />
    {hint && !error && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    {error && <Text size="small" id={`${id}-error`} className="cr-field-error">{error}</Text>}
  </div>;
}

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> { label: string; hint?: string }
export function Checkbox({ label, hint, className, id: suppliedId, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <label htmlFor={id} className={cx('cr-checkbox', className)}><input {...props} type="checkbox" id={id} aria-describedby={hint ? `${id}-hint` : undefined} /><span>{label}{hint && <Text size="small" id={`${id}-hint`}>{hint}</Text>}</span></label>;
}

export function Switch({ label, hint, className, id: suppliedId, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <label htmlFor={id} className={cx('cr-switch', className)}><input {...props} id={id} type="checkbox" role="switch" aria-describedby={hint ? `${id}-hint` : undefined} /><span className="cr-switch-track" aria-hidden="true"><span /></span><span>{label}{hint && <Text size="small" id={`${id}-hint`}>{hint}</Text>}</span></label>;
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> { name: string; size?: 'sm' | 'md' | 'lg'; color?: 'green' | 'peach' | 'blue' | 'purple'; showName?: boolean; icon?: IconSource }
const avatarIconSizes = { sm: 14, md: 16, lg: 22 } as const;
export function Avatar({ name, size = 'md', color = 'green', showName = false, icon, className, ...props }: AvatarProps) {
  const glyph = renderIcon(icon, { size: avatarIconSizes[size] ?? avatarIconSizes.md }) ?? name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('');
  if (showName) return <span {...props} className={cx('cr-avatar-person', className)}>
    <span className="cr-avatar" data-size={size} data-color={color} aria-hidden="true">{glyph}</span>
    <span className="cr-avatar-name">{name}</span>
  </span>;
  return <span {...props} role="img" aria-label={name} title={name} className={cx('cr-avatar', className)} data-size={size} data-color={color}>{glyph}</span>;
}
/** One AvatarGroup entry: the person or entity name, plus an optional decorative icon shown instead of initials. */
export interface AvatarGroupItem { name: string; icon?: IconSource }
export type AvatarGroupProps = { max?: number } & ({ names: string[]; items?: never } | { items: AvatarGroupItem[]; names?: never });
export function AvatarGroup({ names, items, max = 3 }: AvatarGroupProps) {
  const palette = ['green', 'peach', 'blue', 'purple'] as const;
  const entries: AvatarGroupItem[] = items ?? (names ?? []).map(name => ({ name }));
  return <span className="cr-avatar-group">{entries.slice(0, max).map((item, i) => <Avatar key={`${i}:${item.name}`} name={item.name} icon={item.icon} color={palette[i % 4]} size="sm" />)}{entries.length > max && <span className="cr-avatar cr-avatar-more" role="img" aria-label={`${entries.length - max} more people`}>+{entries.length - max}</span>}</span>;
}

export interface ProgressProps extends Omit<ComponentPropsWithRef<'progress'>, 'value' | 'max'> {
  value: number;
  label: string;
  max?: number;
  showLabel?: boolean;
  valueText?: string;
  description?: ReactNode;
}
export function Progress({ value, label, max = 100, showLabel = false, valueText, description, className, id: suppliedId, 'aria-describedby': describedBy, 'aria-valuetext': accessibleValueText, ...props }: ProgressProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const hasValueText = valueText !== undefined && valueText !== '';
  const hasDescription = description !== undefined && description !== null && description !== false && description !== '';
  const bar = <progress {...props} id={id} className={cx('cr-progress', className)} value={value} max={max} aria-label={props['aria-label'] ?? label} aria-valuetext={accessibleValueText ?? (hasValueText ? valueText : undefined)} aria-describedby={[describedBy, hasDescription && `${generatedId}-description`].filter(Boolean).join(' ') || undefined} />;
  if (!showLabel && !hasValueText && !hasDescription) return bar;
  return <div className="cr-progress-group">{(showLabel || hasValueText) && <div className="cr-progress-heading">{showLabel && <label className="cr-progress-label" htmlFor={id}>{label}</label>}{hasValueText && <span className="cr-progress-value">{valueText}</span>}</div>}{bar}{hasDescription && <div className="cr-progress-description" id={`${generatedId}-description`}>{description}</div>}</div>;
}

export interface TabItem { value: string; label: string; icon?: IconSource; count?: number; content: ReactNode }
export interface TabsProps {
  items: TabItem[];
  label: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'pill' | 'highlight';
  size?: ControlSize;
  className?: string;
}
const TAB_DRAG_HOLD_MS = 180;
const TAB_DRAG_THRESHOLD_PX = 4;
const TAB_WHEEL_SCROLLBAR_MS = 600;

export function Tabs({ items, label, defaultValue, value, onValueChange, variant = 'line', size = 'md', className }: TabsProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue || items[0]?.value);
  const stopTabDrag = useRef<(() => void) | null>(null);
  const suppressTabClick = useRef(false);
  const wheelScrollbar = useRef<{ list: HTMLDivElement; timer: number } | null>(null);
  const selected = value ?? internal;
  const change = (next: string) => { if (value === undefined) setInternal(next); onValueChange?.(next); };

  const hideWheelScrollbar = useCallback(() => {
    const wheel = wheelScrollbar.current;
    if (!wheel) return;
    window.clearTimeout(wheel.timer);
    delete wheel.list.dataset.wheelScroll;
    wheelScrollbar.current = null;
  }, []);

  useEffect(() => () => {
    stopTabDrag.current?.();
    hideWheelScrollbar();
  }, [hideWheelScrollbar]);

  const showWheelScrollbar = (event: ReactWheelEvent<HTMLDivElement>) => {
    const list = event.currentTarget;
    const horizontal = event.deltaX !== 0 || (event.shiftKey && event.deltaY !== 0);
    if (!horizontal || event.ctrlKey || list.dataset.dragScroll === 'active' || list.scrollWidth <= list.clientWidth) return;

    if (wheelScrollbar.current) window.clearTimeout(wheelScrollbar.current.timer);
    else list.dataset.wheelScroll = 'true';
    wheelScrollbar.current = { list, timer: window.setTimeout(hideWheelScrollbar, TAB_WHEEL_SCROLLBAR_MS) };
  };

  const startTabPress = (event: ReactPointerEvent<HTMLDivElement>) => {
    stopTabDrag.current?.();
    suppressTabClick.current = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    const list = event.currentTarget;
    const tab = (event.target as Element).closest('button[role="tab"]');
    if (tab?.parentElement !== list || list.scrollWidth <= list.clientWidth) return;

    const { pointerId } = event;
    let lastX = event.clientX;
    let dragging = false;
    const listeners = new AbortController();
    const options = { capture: true, signal: listeners.signal };

    const finish = () => {
      window.clearTimeout(hold);
      listeners.abort();
      delete list.dataset.dragScroll;
      if (list.hasPointerCapture(pointerId)) list.releasePointerCapture(pointerId);
      stopTabDrag.current = null;
    };
    const start = () => {
      window.clearTimeout(hold);
      if (list.scrollWidth <= list.clientWidth) {
        finish();
        return;
      }
      list.setPointerCapture(pointerId);
      if (!list.hasPointerCapture(pointerId)) {
        finish();
        return;
      }
      dragging = true;
      suppressTabClick.current = true;
      hideWheelScrollbar();
      list.dataset.dragScroll = 'active';
    };
    const move = (pointer: PointerEvent) => {
      if (pointer.pointerId !== pointerId) return;
      if ((pointer.buttons & 1) === 0) {
        finish();
        return;
      }
      const delta = lastX - pointer.clientX;
      if (!dragging) {
        if (Math.abs(delta) < TAB_DRAG_THRESHOLD_PX) return;
        start();
        if (!dragging) return;
      }
      lastX = pointer.clientX;
      list.scrollBy({ left: delta, behavior: 'instant' });
    };
    const endPointer = (pointer: PointerEvent) => {
      if (pointer.pointerId === pointerId) finish();
    };

    const hold = window.setTimeout(start, TAB_DRAG_HOLD_MS);
    stopTabDrag.current = finish;
    list.dataset.dragScroll = 'pending';
    window.addEventListener('pointermove', move, options);
    window.addEventListener('pointerup', endPointer, options);
    window.addEventListener('pointercancel', endPointer, options);
    window.addEventListener('blur', finish, { signal: listeners.signal });
    list.addEventListener('lostpointercapture', endPointer, options);
  };

  return <div className={cx('cr-tabs', className)} data-variant={variant} data-size={size}><div role="tablist" aria-label={label} className="cr-tab-list"
    onWheel={showWheelScrollbar} onPointerDown={startTabPress} onClickCapture={event => {
      if (!suppressTabClick.current || event.detail === 0) return;
      suppressTabClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    }}>
    {items.map(({ value: key, label: text, icon, count }, index) => <button key={key} type="button" role="tab" id={`${id}-tab-${key}`} aria-selected={selected === key} tabIndex={selected === key ? 0 : -1} onClick={() => change(key)} onKeyDown={event => {
      const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowRight' ? (index + (rtl ? -1 : 1) + items.length) % items.length : event.key === 'ArrowLeft' ? (index + (rtl ? 1 : -1) + items.length) % items.length : null;
      if (next === null) return;
      event.preventDefault();
      change(items[next].value);
      const tab = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
      tab?.focus();
      tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }}>{renderIcon(icon, { size: 15 })}{text}{count !== undefined && <span>{count}</span>}</button>)}
  </div>{items.map(item => <div key={item.value} role="tabpanel" aria-labelledby={`${id}-tab-${item.value}`} hidden={selected !== item.value} tabIndex={selected === item.value ? 0 : -1}><div className="cr-tab-content">{item.content}</div></div>)}</div>;
}

export interface CardProps extends HTMLAttributes<HTMLElement> {
  header?: ReactNode;
  footer?: ReactNode;
  divided?: boolean;
}

export function Card(cardProps: CardProps) {
  const { header, children, footer, className, divided = false, ...props } = cardProps;
  // Keep the body mounted when slot content appears or disappears.
  const hasSlots = 'header' in cardProps || 'footer' in cardProps;
  const hasHeader = header != null && typeof header !== 'boolean';
  const hasFooter = footer != null && typeof footer !== 'boolean';
  const hasBody = children != null && typeof children !== 'boolean';
  const content = hasSlots ? <>
    {hasHeader && <header className="cr-card-region">{header}</header>}
    {!divided && hasBody ? <div className="cr-card-region">{children}</div> : children}
    {hasFooter && <footer className="cr-card-region">{footer}</footer>}
  </> : children;

  return <article {...props} className={cx('cr-card', className)} data-divided={divided ? 'true' : undefined}>
    {content}
  </article>;
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> { tone?: Tone; title: string; children?: ReactNode; onDismiss?: () => void }
export function Alert({ tone = 'info', title, children, onDismiss, className, ...props }: AlertProps) {
  const Icon = { neutral: Info, info: Info, success: CircleCheck, warning: TriangleAlert, danger: AlertCircle }[tone];
  return <div {...props} className={cx('cr-alert', className)} data-tone={tone}><Icon size={18} aria-hidden="true" /><div><Text bold>{title}</Text>{children && <Text size="body">{children}</Text>}</div>{onDismiss && <IconButton size="sm" label={`Dismiss ${title}`} icon={X} onClick={onDismiss} />}</div>;
}

export function Divider({ className, ...props }: ComponentPropsWithRef<'hr'>) {
  return <hr {...props} className={cx('cr-divider', className)} />;
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={cx('cr-skeleton', className)} aria-hidden="true" />;
}

export function Spinner({ label = 'Loading', size = 18, className }: { label?: string; size?: number; className?: string }) {
  return <span className={cx('cr-spinner', className)} role="status"><LoaderCircle className="cr-spin" size={size} aria-hidden="true" /><span className="cr-sr-only">{label}</span></span>;
}

interface DialogSplitProps {
  open: boolean;
  children: ReactNode;
  sideContent: ReactNode;
  contentLabel: string;
  sideContentLabel: string;
  resizable: boolean;
  minWidth: number;
  maxWidth: number;
}

function DialogSplit({ open, children, sideContent, contentLabel, sideContentLabel, resizable, minWidth, maxWidth }: DialogSplitProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const sideId = useId();
  const [activePane, setActivePane] = useState<'main' | 'side'>('main');
  const [paneWidth, setPaneWidth] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const splitterWidth = resizable ? 10 : 1;
  const reservedWidth = 280 + splitterWidth;
  const configuredMax = Number.isFinite(maxWidth) && maxWidth > 0 ? Math.max(1, Math.floor(maxWidth)) : 640;
  const configuredMin = Math.min(configuredMax, Number.isFinite(minWidth) && minWidth > 0 ? Math.floor(minWidth) : 260);
  const [bounds, setBounds] = useState({ min: configuredMin, max: configuredMax });
  const boundsRef = useRef(bounds);
  const measuredWidthRef = useRef<number | null>(null);
  const preferredWidthRef = useRef<number | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startWidth: number; rtl: boolean } | null>(null);

  const changeWidth = useCallback((requested: number) => {
    const limits = boundsRef.current;
    const next = Math.min(limits.max, Math.max(limits.min, Math.round(requested)));
    preferredWidthRef.current = next;
    measuredWidthRef.current = next;
    setPaneWidth(previous => previous === next ? previous : next);
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!open || !body) return;
    let lastWidth = -1;
    const measure = () => {
      const width = body.clientWidth;
      // The compact view uses a single pane and does not alter the saved split.
      if (width < 700 || width === lastWidth) return;
      lastWidth = width;
      const maximum = Math.max(0, Math.min(configuredMax, width - reservedWidth));
      const nextBounds = { min: Math.min(configuredMin, maximum), max: maximum };
      boundsRef.current = nextBounds;
      setBounds(previous => previous.min === nextBounds.min && previous.max === nextBounds.max ? previous : nextBounds);
      const next = Math.min(maximum, Math.max(nextBounds.min, Math.round(preferredWidthRef.current ?? width * .38)));
      measuredWidthRef.current = next;
      setPaneWidth(previous => previous === next ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, [open, configuredMin, configuredMax, reservedWidth]);

  useEffect(() => {
    if (!open || !resizable) {
      dragRef.current = null;
      setDragging(false);
    }
  }, [open, resizable]);

  const finishDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    if (event && dragRef.current?.pointerId !== event.pointerId) return;
    if (event?.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setDragging(false);
  };
  const resizeWithKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!resizable) return;
    const current = measuredWidthRef.current ?? boundsRef.current.min;
    const increment = event.shiftKey ? 48 : 16;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const next = event.key === 'Home' ? boundsRef.current.min
      : event.key === 'End' ? boundsRef.current.max
        : event.key === 'ArrowRight' ? current + (rtl ? increment : -increment)
          : event.key === 'ArrowLeft' ? current + (rtl ? -increment : increment) : null;
    if (next === null) return;
    event.preventDefault();
    changeWidth(next);
  };
  const splitStyle = {
    '--dialog-splitter-width': `${splitterWidth}px`,
    '--dialog-side-available-width': `calc(100% - ${reservedWidth}px)`,
    '--cr-dialog-side-min-width': `${configuredMin}px`,
    '--cr-dialog-side-max-width': `${configuredMax}px`,
    ...(paneWidth === null ? {} : { '--cr-dialog-side-width': `${paneWidth}px` }),
  } as CSSProperties;

  return <div ref={bodyRef} className="cr-dialog-body" data-layout="split" data-active-pane={activePane} data-resizing={dragging || undefined} style={splitStyle}>
    <div className="cr-dialog-pane-switcher" role="group" aria-label="Modal content view"><button type="button" aria-pressed={activePane === 'main'} onClick={() => setActivePane('main')}>{contentLabel}</button><button type="button" aria-pressed={activePane === 'side'} onClick={() => setActivePane('side')}>{sideContentLabel}</button></div>
    <div className="cr-dialog-pane" role="region" aria-label={contentLabel} tabIndex={0}>{children}</div>
    <div className="cr-dialog-splitter" data-resizable={resizable || undefined} data-dragging={dragging || undefined} role={resizable ? 'separator' : undefined} aria-hidden={resizable ? undefined : true} aria-label={resizable ? `Resize ${sideContentLabel} pane` : undefined} aria-orientation={resizable ? 'vertical' : undefined} aria-controls={resizable ? sideId : undefined} aria-valuemin={resizable ? bounds.min : undefined} aria-valuemax={resizable ? bounds.max : undefined} aria-valuenow={resizable ? paneWidth ?? bounds.min : undefined} aria-valuetext={resizable ? `${paneWidth ?? bounds.min} pixels` : undefined} tabIndex={resizable ? 0 : undefined} onKeyDown={resizeWithKeyboard}
      onPointerDown={event => {
        if (!resizable || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startWidth: measuredWidthRef.current ?? boundsRef.current.min, rtl: getComputedStyle(event.currentTarget).direction === 'rtl' };
        setDragging(true);
      }}
      onPointerMove={event => {
        const drag = dragRef.current;
        if (!resizable || !drag || drag.pointerId !== event.pointerId) return;
        changeWidth(drag.startWidth + (event.clientX - drag.startX) * (drag.rtl ? 1 : -1));
      }} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={() => finishDrag()} />
    <aside id={sideId} className="cr-dialog-side-content" aria-label={sideContentLabel}>{sideContent}</aside>
  </div>;
}

export interface DialogProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode; footer?: ReactNode; className?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; freezeHeight?: boolean; sideContent?: ReactNode; contentLabel?: string; sideContentLabel?: string; resizableSplit?: boolean; sideContentMinWidth?: number; sideContentMaxWidth?: number; maxWidth?: number }
export function Dialog({ open, onOpenChange, title, description, children, footer, className, size = 'md', freezeHeight = false, sideContent, contentLabel = 'Details', sideContentLabel = 'Related content', resizableSplit = false, sideContentMinWidth = 260, sideContentMaxWidth = 640, maxWidth }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const widthStyle = Number.isFinite(maxWidth) && (maxWidth ?? 0) > 0 ? { '--dialog-width': `${maxWidth}px` } as CSSProperties : undefined;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      dialog.style.removeProperty('--cr-dialog-height');
      return;
    }
    const opening = !dialog.open;
    if (opening) dialog.showModal();
    if (freezeHeight) {
      if (opening || !dialog.style.getPropertyValue('--cr-dialog-height')) {
        dialog.style.setProperty('--cr-dialog-height', `${dialog.getBoundingClientRect().height}px`);
      }
    } else {
      dialog.style.removeProperty('--cr-dialog-height');
    }
    if (opening) {
      // React applies autoFocus when mounting. A control mounted inside a closed
      // native dialog cannot receive focus then, so honor that intent on opening.
      dialog.querySelector<HTMLElement>('[autofocus], [data-cr-autofocus="true"]')?.focus();
    }
  }, [open, freezeHeight]);
  return <dialog ref={ref} className={cx('cr-dialog', className)} data-size={size} data-freeze-height={freezeHeight} style={widthStyle} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined} onClose={() => onOpenChange(false)}>
    <header className="cr-dialog-header"><div><Text size="heading-2" id={`${id}-title`}>{title}</Text>{description && <Text size="body" id={`${id}-description`}>{description}</Text>}</div><IconButton icon={X} label="Close dialog" onClick={() => ref.current?.close()} /></header>
    {sideContent ? <DialogSplit open={open} sideContent={sideContent} contentLabel={contentLabel} sideContentLabel={sideContentLabel} resizable={resizableSplit} minWidth={sideContentMinWidth} maxWidth={sideContentMaxWidth}>{children}</DialogSplit> : <div className="cr-dialog-body">{children}</div>}{footer && <footer className="cr-dialog-footer">{footer}</footer>}
  </dialog>;
}

export type Notify = (message: string, tone?: Tone) => void;
const ToastContext = createContext<Notify | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; tone: Tone; id: number } | null>(null);
  const notify = useCallback<Notify>((message, tone = 'success') => setToast({ message, tone, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  return <ToastContext value={notify}>{children}<div className="cr-toast-region"><div role="status" aria-atomic="true">{toast && <div className="cr-toast" data-tone={toast.tone}><CircleCheck size={18} aria-hidden="true" /><span>{toast.message}</span><IconButton icon={X} label="Dismiss notification" size="sm" onClick={() => setToast(null)} /></div>}</div></div></ToastContext>;
}
export function useToast(): Notify {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error('useToast must be called inside ToastProvider.');
  return notify;
}

export interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
  underline?: 'always' | 'hover' | 'none';
  separator?: ReactNode;
}
export function Breadcrumbs({
  items,
  underline = 'always',
  separator = <ChevronRight className="cr-breadcrumbs-chevron" size={12} />,
}: BreadcrumbsProps) {
  return <nav className="cr-breadcrumbs" data-underline={underline} aria-label="Breadcrumb">
    <ol>
      {items.map(({ label, href }, index) => {
        const isCurrent = index === items.length - 1;
        return <li key={`${label}-${index}`}>
          {href && !isCurrent ? <a href={href}>{label}</a> : <span aria-current={isCurrent ? 'page' : undefined}>{label}</span>}
          {!isCurrent && <span className="cr-breadcrumbs-separator" aria-hidden="true">{separator}</span>}
        </li>;
      })}
    </ol>
  </nav>;
}

export interface TaskCardDependencies { completed: number; total: number }
export interface TaskCardProps {
  taskId: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
  branch?: string;
  completed?: number;
  total?: number;
  dependencies?: TaskCardDependencies;
  relatedCount?: number;
  commentCount?: number;
  attachmentCount?: number;
  hideMetadataLabels?: boolean;
  assignees?: string[];
  onClick?: () => void;
}
export function TaskCard({ taskId, title, description, status = 'todo', priority = 'medium', branch, completed = 0, total = 0, dependencies, relatedCount, commentCount, attachmentCount, hideMetadataLabels = false, assignees = [], onClick }: TaskCardProps) {
  const metadataId = useId();
  const actionButton = useRef<HTMLButtonElement>(null);
  const tone: Tone = status === 'done' ? 'success' : status === 'review' ? 'warning' : status === 'in-progress' ? 'info' : 'neutral';
  const labels = { todo: 'To do', 'in-progress': 'In progress', review: 'In review', done: 'Done' };
  const count = (value: number) => Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
  const checklistTotal = count(total);
  const checklistCompleted = Math.min(count(completed), checklistTotal);
  const metadata: { key: string; icon: ReactNode; value: number | string; label: string; description: string }[] = [];
  if (checklistTotal > 0) metadata.push({
    key: 'checklist',
    icon: <CheckCheck size={14} aria-hidden="true" />,
    value: `${checklistCompleted}/${checklistTotal}`,
    label: 'checklist',
    description: `${checklistCompleted} of ${checklistTotal} checklist ${checklistTotal === 1 ? 'item' : 'items'} complete.`,
  });
  if (dependencies) {
    const dependencyTotal = count(dependencies.total);
    const dependencyCompleted = Math.min(count(dependencies.completed), dependencyTotal);
    metadata.push({
      key: 'dependencies',
      icon: <Network size={13} aria-hidden="true" />,
      value: dependencyTotal ? `${dependencyCompleted}/${dependencyTotal}` : 0,
      label: 'deps',
      description: dependencyTotal ? `${dependencyCompleted} of ${dependencyTotal} ${dependencyTotal === 1 ? 'dependency' : 'dependencies'} complete.` : '0 dependencies.',
    });
  }
  if (relatedCount !== undefined) {
    const related = count(relatedCount);
    metadata.push({ key: 'related', icon: <TaskRelatedIcon size={13} aria-hidden="true" />, value: related, label: 'related', description: `${related} related ${related === 1 ? 'card' : 'cards'}.` });
  }
  if (commentCount !== undefined) {
    const comments = count(commentCount);
    const label = comments === 1 ? 'comment' : 'comments';
    metadata.push({ key: 'comments', icon: <TaskCommentsIcon size={13} aria-hidden="true" />, value: comments, label, description: `${comments} ${label}.` });
  }
  if (attachmentCount !== undefined) {
    const attachments = count(attachmentCount);
    const label = attachments === 1 ? 'file' : 'files';
    metadata.push({ key: 'attachments', icon: <TaskAttachmentsIcon size={13} aria-hidden="true" />, value: attachments, label, description: `${attachments} attached ${label}.` });
  }
  return <Card className="cr-task-card" data-has-metadata={metadata.length > 0 || undefined} onClick={onClick && (event => {
    const target = event.target as Node;
    const button = actionButton.current;
    // Clicks from portaled tooltip bubbles also reach this React handler.
    if (event.defaultPrevented || !button?.matches(':enabled') || !event.currentTarget.contains(target) || button.contains(target)) return;
    button.focus({ preventScroll: true });
    onClick();
  })}>
    <button ref={actionButton} type="button" className="cr-task-button" onClick={onClick} disabled={!onClick} aria-describedby={metadata.length ? metadataId : undefined}>
      <span className="cr-task-meta"><span className="cr-mono">{taskId}</span><Badge tone={priority === 'high' ? 'warning' : 'neutral'}>{priority === 'high' && <TriangleAlert size={11} aria-hidden="true" />}{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge></span>
      <Text size="heading-3">{title}</Text>{description && <Text size="body">{description}</Text>}{branch && <span className="cr-task-branch"><GitBranch size={13} aria-hidden="true" />{branch}</span>}
    </button>
    {metadata.length > 0 && <ul className="cr-task-metadata" id={metadataId}>
      {metadata.map(item => {
        const label = `${item.value} ${item.label}`;
        const content = <>{item.icon}<span aria-hidden="true">{hideMetadataLabels ? item.value : label}</span></>;
        return <li key={item.key} data-info={item.key} title={hideMetadataLabels ? undefined : item.description}>
          {hideMetadataLabels ? <Tooltip content={label} aria-label={item.description}>
            <span className="cr-task-metadata-trigger" tabIndex={0}>{content}</span>
          </Tooltip> : content}
          <span className="cr-sr-only">{item.description}</span>
        </li>;
      })}
    </ul>}
    <div className="cr-task-footer"><Badge tone={tone} dot>{labels[status]}</Badge>{assignees.length > 0 && <AvatarGroup names={assignees} />}</div>
  </Card>;
}

export interface AgentCardProps { name: string; task: string; status?: 'running' | 'succeeded' | 'waiting' | 'idle'; tokens?: string; elapsed?: string; selected?: boolean; onClick?: () => void }
export function AgentCard({ name, task, status = 'running', tokens = '2.4k', elapsed = '00:42', selected, onClick }: AgentCardProps) {
  const tone: Tone = status === 'succeeded' ? 'success' : status === 'waiting' ? 'warning' : status === 'idle' ? 'neutral' : 'info';
  const labels = { running: 'Running', succeeded: 'Complete', waiting: 'Waiting', idle: 'Idle' };
  return <button type="button" className="cr-agent-card" aria-pressed={selected} onClick={onClick} disabled={!onClick}>
    <span className="cr-agent-header"><span className="cr-agent-icon"><Network size={17} aria-hidden="true" /></span><Text bold>{name}</Text><Badge tone={tone} dot>{labels[status]}</Badge></span>
    <span className="cr-agent-task">{task}</span><span className="cr-agent-facts"><span><Clock3 size={12} aria-hidden="true" />{elapsed}</span><span>{tokens} tokens</span></span>
  </button>;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconSource;
  action?: ReactNode;
  variant?: 'default' | 'dashed';
  align?: 'start' | 'center' | 'end';
}

export function EmptyState({ title, description, icon = Circle, action, variant = 'default', align = 'center' }: EmptyStateProps) {
  return <div className="cr-empty-state" data-variant={variant} data-align={align}>
    <span className="cr-empty-state-icon">{renderIcon(icon, { size: variant === 'dashed' ? 24 : 26 })}</span>
    <Text size="heading-3">{title}</Text>
    <Text size="body">{description}</Text>
    {action}
  </div>;
}

export type { CSSProperties, ReactNode };
