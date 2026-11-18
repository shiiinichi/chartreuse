import { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { gridBreakpoints } from './Grid';
import type { GridBreakpoint, GridGap, GridResponsive, GridSpan } from './Grid';
import { masonryGeometry } from './masonry-layout';
import './masonry.css';

export type MasonryResponsive<T> = GridResponsive<T>;
export type MasonryGap = GridGap;
export type MasonrySpan = GridSpan;

export interface MasonryProps extends ComponentPropsWithRef<'div'> {
  /** Exact counts at container tiers. Omit to fit columns to minColumnWidth. */
  columns?: MasonryResponsive<number>;
  /** Minimum column width for automatic columns. Numbers are CSS pixels. */
  minColumnWidth?: number | string;
  /** Upper limit for automatic columns, normalized to 1–24. */
  maxColumns?: number;
  /** Shared spacing-token steps, matching Grid. */
  gap?: MasonryResponsive<MasonryGap>;
  rowGap?: MasonryResponsive<MasonryGap>;
  columnGap?: MasonryResponsive<MasonryGap>;
}

export interface MasonryItemProps extends ComponentPropsWithRef<'div'> {
  span?: MasonryResponsive<MasonrySpan>;
}

export interface MasonrySpacerProps extends Pick<MasonryItemProps, 'span' | 'id' | 'className' | 'style' | 'ref'> {
  /** Reserved block size. Numbers are CSS pixels; defaults to 64px. */
  height?: MasonryResponsive<number | string>;
  /** Hidden spacers leave no item or gap at the relevant container tier. */
  visible?: MasonryResponsive<boolean>;
}

const tiers = Object.keys(gridBreakpoints) as GridBreakpoint[];
const gapSteps: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
const count = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? Math.min(24, Math.max(1, Math.floor(value))) : fallback;
const gapStep = (value: unknown, fallback: MasonryGap): MasonryGap => typeof value === 'number' && gapSteps.includes(value) ? value as MasonryGap : fallback;
const length = (value: unknown, fallback: string): string => typeof value === 'number' && Number.isFinite(value) ? `${Math.max(0, value)}px` : typeof value === 'string' && value.trim() ? value : fallback;
const gapValue = (value: MasonryGap) => value === 0 ? '0px' : `var(--cr-space-${value}, ${value * 4}px)`;

function expand<T>(value: MasonryResponsive<T> | undefined, fallback: T, normalize: (value: unknown, fallback: T) => T): Record<GridBreakpoint, T> {
  const overrides = value && typeof value === 'object' ? value as Partial<Record<GridBreakpoint, T>> : undefined;
  let previous = normalize(overrides ? overrides.base : value, fallback);
  return Object.fromEntries(tiers.map(tier => {
    if (overrides && overrides[tier] !== undefined) previous = normalize(overrides[tier], previous);
    return [tier, previous];
  })) as Record<GridBreakpoint, T>;
}

function variables<T>(prefix: string, values: Record<GridBreakpoint, T>, serialize: (value: T) => string | number): CSSProperties {
  return Object.fromEntries(tiers.map(tier => [`--cr-masonry-${prefix}-${tier}`, serialize(values[tier])])) as CSSProperties;
}

function setVariable(element: HTMLElement, name: string, value: string) {
  if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
}

const pixels = (value: string) => Number.parseFloat(value) || 0;
const positionedVariables = ['--cr-masonry-inline-size', '--cr-masonry-inline-start', '--cr-masonry-block-start'];

function layoutWidth(element: HTMLElement) {
  const style = getComputedStyle(element);
  const width = Number.parseFloat(style.width);
  if (!Number.isFinite(width)) return element.clientWidth;
  // Absolute children use the padding box. CSS used sizes retain subpixels and
  // stay in local coordinates when an ancestor applies a transform.
  return style.boxSizing === 'border-box'
    ? width - pixels(style.borderLeftWidth) - pixels(style.borderRightWidth)
    : width + pixels(style.paddingLeft) + pixels(style.paddingRight);
}

function borderBoxHeight(element: HTMLElement) {
  const style = getComputedStyle(element);
  const height = Number.parseFloat(style.height);
  if (!Number.isFinite(height)) return element.offsetHeight;
  return style.boxSizing === 'border-box' ? height
    : height + pixels(style.paddingTop) + pixels(style.paddingBottom) + pixels(style.borderTopWidth) + pixels(style.borderBottomWidth);
}

/** Packs real child boxes without changing their DOM order, mounted state, or refs. */
export function Masonry({ children, columns, minColumnWidth = 240, maxColumns = 24, gap = 4, rowGap, columnGap, className, ref, ...props }: MasonryProps) {
  const root = useRef<HTMLDivElement>(null);
  const layout = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const schedule = useRef<(() => void) | null>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const gaps = expand(gap, 4, gapStep);
  const recipe: CSSProperties = {
    ...variables('columns', expand(columns, 1, count), value => value),
    ...variables('row-gap', rowGap === undefined ? gaps : expand(rowGap, gaps.base, gapStep), gapValue),
    ...variables('column-gap', columnGap === undefined ? gaps : expand(columnGap, gaps.base, gapStep), gapValue),
    '--cr-masonry-min-column-width': length(minColumnWidth, '240px'),
    '--cr-masonry-max-columns': count(maxColumns, 24),
  } as CSSProperties;

  useLayoutEffect(() => {
    const surface = layout.current;
    const measure = probe.current;
    const container = root.current;
    if (!surface || !measure || !container || typeof ResizeObserver === 'undefined') return;
    let frame = 0;
    let stopped = false;
    const observed = new Set<HTMLElement>();

    const place = () => {
      frame = 0;
      if (stopped || !surface.isConnected) return;
      const width = layoutWidth(surface);
      if (!(width > 0)) return;
      const all = Array.from(surface.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child !== measure);
      const current = new Set(all);
      for (const child of observed) if (!current.has(child)) { resize.unobserve(child); observed.delete(child); }
      for (const child of all) if (!observed.has(child)) { resize.observe(child); observed.add(child); }
      const entries = all.map(child => ({ child, style: getComputedStyle(child) })).filter(({ child, style }) => !child.hidden && style.display !== 'none');
      const visible = new Set(entries.map(entry => entry.child));
      for (const child of all) if (!visible.has(child)) {
        if (child.hasAttribute('data-cr-masonry-positioned')) child.removeAttribute('data-cr-masonry-positioned');
        for (const name of positionedVariables) if (child.style.getPropertyValue(name)) child.style.removeProperty(name);
      }
      const itemData = entries.map(({ child, style }) => {
        const rawSpan = style.getPropertyValue('--cr-masonry-item-span').trim();
        const span: MasonrySpan = rawSpan === 'full' ? 'full' : count(Number.parseFloat(rawSpan), 1);
        return { child, span, marginInline: pixels(style.marginInlineStart) + pixels(style.marginInlineEnd), marginBlock: pixels(style.marginBlockStart) + pixels(style.marginBlockEnd) };
      });
      const probeStyle = getComputedStyle(measure);
      const automatic = measure.dataset.mode === 'auto';
      const trackCount = probeStyle.gridTemplateColumns.split(/\s+/).filter(track => /px$/.test(track)).length || 1;
      const limit = count(pixels(getComputedStyle(surface).getPropertyValue('--cr-masonry-max-columns')), 24);
      // Full-row items do not create otherwise-empty automatic columns. Numeric
      // spans count their occupied tracks, so a spanning card is not collapsed.
      const capacity = itemData.reduce((total, item) => total + (item.span === 'full' ? 0 : item.span), 0) || 1;
      const columnCount = automatic ? Math.max(1, Math.min(trackCount, limit, capacity)) : count(trackCount, 1);
      const rowSpacing = Math.max(0, pixels(probeStyle.rowGap));
      const columnSpacing = Math.max(0, pixels(probeStyle.columnGap));
      const widths = masonryGeometry(itemData.map(item => ({ height: 0, span: item.span })), { width, columns: columnCount, rowGap: rowSpacing, columnGap: columnSpacing });
      // Final span widths must be applied before height measurement (wrapping changes height).
      itemData.forEach((item, index) => {
        setVariable(item.child, '--cr-masonry-inline-size', `${Math.max(0, widths.placements[index].inlineSize - item.marginInline)}px`);
        if (!item.child.hasAttribute('data-cr-masonry-positioned')) item.child.setAttribute('data-cr-masonry-positioned', '');
      });
      if (!surface.hasAttribute('data-masonry-ready')) surface.setAttribute('data-masonry-ready', '');
      const packed = masonryGeometry(itemData.map(item => ({ height: borderBoxHeight(item.child) + item.marginBlock, span: item.span })), { width, columns: columnCount, rowGap: rowSpacing, columnGap: columnSpacing });
      itemData.forEach((item, index) => {
        const placement = packed.placements[index];
        setVariable(item.child, '--cr-masonry-inline-start', `${placement.inlineStart}px`);
        setVariable(item.child, '--cr-masonry-block-start', `${placement.blockStart}px`);
      });
      setVariable(surface, '--cr-masonry-block-size', `${packed.blockSize}px`);
    };
    const queue = () => { if (!stopped && !frame) frame = requestAnimationFrame(place); };
    schedule.current = queue;
    const resize = new ResizeObserver(queue);
    resize.observe(container);
    resize.observe(surface);
    const mutations = new MutationObserver(queue);
    mutations.observe(surface, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['style', 'class', 'hidden', 'open', 'dir'] });
    window.addEventListener('resize', queue);
    place();
    return () => {
      stopped = true;
      schedule.current = null;
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener('resize', queue);
      surface.removeAttribute('data-masonry-ready');
      surface.style.removeProperty('--cr-masonry-block-size');
      for (const child of observed) {
        child.removeAttribute('data-cr-masonry-positioned');
        for (const name of positionedVariables) child.style.removeProperty(name);
      }
    };
  }, []);
  useLayoutEffect(() => { schedule.current?.(); });

  return <div {...props} ref={root} className={['cr-masonry', className].filter(Boolean).join(' ')}>
    <div className="cr-masonry-layout" ref={layout} style={recipe}>
      <div ref={probe} className="cr-masonry-measure" data-mode={columns === undefined ? 'auto' : 'fixed'} aria-hidden="true" inert />
      {children}
    </div>
  </div>;
}

/** Optional native wrapper for a responsive number of adjacent columns. */
export function MasonryItem({ children, span = 1, className, style, ...props }: MasonryItemProps) {
  const spans = expand<MasonrySpan>(span, 1, (value, fallback) => value === 'full' ? value : typeof value === 'number' ? count(value, typeof fallback === 'number' ? fallback : 1) : fallback);
  return <div {...props} className={['cr-masonry-item', className].filter(Boolean).join(' ')} style={{ ...style, ...variables('item-span', spans, value => value) }}>{children}</div>;
}

/** Invisible, non-interactive reserved space. Hiding removes it from packing. */
export function MasonrySpacer({ span = 1, height = 64, visible = true, id, ref, className, style }: MasonrySpacerProps) {
  const heights = expand<number | string>(height, 64, (value, fallback) => length(value, length(fallback, '64px')));
  const visibility = expand(visible, true, (value, fallback) => typeof value === 'boolean' ? value : fallback);
  return <MasonryItem id={id} ref={ref} span={span} aria-hidden="true" inert className={['cr-masonry-spacer', className].filter(Boolean).join(' ')} style={{ ...style, ...variables('spacer-height', heights, value => length(value, '64px')), ...variables('spacer-display', visibility, value => value ? 'block' : 'none') }} />;
}
