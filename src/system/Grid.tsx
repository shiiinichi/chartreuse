import type { ComponentPropsWithRef, CSSProperties } from 'react';
import './grid.css';

export const gridBreakpoints = Object.freeze({ base: 0, sm: 480, md: 768, lg: 1024, xl: 1280 } as const);
export const gridDefaultColumns = Object.freeze({ base: 4, sm: 8, md: 12 } as const);
export type GridBreakpoint = keyof typeof gridBreakpoints;
export type GridResponsive<T> = T | Partial<Record<GridBreakpoint, T>>;
/** Positive integer column counts are normalized to 1–24. */
export type GridColumns = number;
export type GridSpan = number | 'full';
/** Shared spacing steps: 4 means var(--cr-space-4), or 16px. */
export type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
export type GridAlignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type GridJustification = 'start' | 'center' | 'end' | 'stretch';

export interface GridProps extends Omit<ComponentPropsWithRef<'div'>, 'align'> {
  columns?: GridResponsive<GridColumns>;
  gap?: GridResponsive<GridGap>;
  rowGap?: GridResponsive<GridGap>;
  columnGap?: GridResponsive<GridGap>;
  align?: GridResponsive<GridAlignment>;
  justify?: GridResponsive<GridJustification>;
}

export interface GridItemProps extends Omit<ComponentPropsWithRef<'div'>, 'align'> {
  span?: GridResponsive<GridSpan>;
  rowSpan?: GridResponsive<number>;
  align?: GridResponsive<GridAlignment | 'auto'>;
  justify?: GridResponsive<GridJustification | 'auto'>;
}

export interface GridSpacerProps extends Pick<GridItemProps, 'span' | 'rowSpan' | 'className' | 'style' | 'id' | 'ref'> {
  visible?: GridResponsive<boolean>;
}

const tiers = Object.keys(gridBreakpoints) as GridBreakpoint[];
const gapSteps: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
const alignments: readonly string[] = ['start', 'center', 'end', 'stretch', 'baseline', 'auto'];
const justifications: readonly string[] = ['start', 'center', 'end', 'stretch', 'auto'];
const count = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? Math.min(24, Math.max(1, Math.floor(value))) : fallback;
const gapStep = (value: unknown, fallback: GridGap): GridGap => typeof value === 'number' && gapSteps.includes(value) ? value as GridGap : fallback;

function expand<T>(value: GridResponsive<T> | undefined, fallback: T, normalize: (value: unknown, fallback: T) => T): Record<GridBreakpoint, T> {
  const overrides = value && typeof value === 'object' ? value as Partial<Record<GridBreakpoint, T>> : undefined;
  let previous = normalize(overrides ? overrides.base : value, fallback);
  return Object.fromEntries(tiers.map(tier => {
    if (overrides && overrides[tier] !== undefined) previous = normalize(overrides[tier], previous);
    return [tier, previous];
  })) as Record<GridBreakpoint, T>;
}

function variables<T>(prefix: string, values: Record<GridBreakpoint, T>, serialize: (value: T) => string | number): CSSProperties {
  return Object.fromEntries(tiers.map(tier => [`--cr-${prefix}-${tier}`, serialize(values[tier])])) as CSSProperties;
}
const gapValue = (value: GridGap) => value === 0 ? '0px' : `var(--cr-space-${value}, ${value * 4}px)`;
const alignValue = (value: unknown, fallback: string) => typeof value === 'string' && alignments.includes(value) ? value : fallback;
const justifyValue = (value: unknown, fallback: string) => typeof value === 'string' && justifications.includes(value) ? value : fallback;

/** Container-responsive layout. Native props/ref belong to the outer query container. */
export function Grid({ children, columns = gridDefaultColumns, gap = 4, rowGap, columnGap, align = 'stretch', justify = 'stretch', className, ...props }: GridProps) {
  const gaps = expand(gap, 4, gapStep);
  const layout: CSSProperties = {
    ...variables('grid-columns', expand(columns, 4, count), value => value),
    ...variables('grid-row-gap', rowGap === undefined ? gaps : expand(rowGap, gaps.base, gapStep), gapValue),
    ...variables('grid-column-gap', columnGap === undefined ? gaps : expand(columnGap, gaps.base, gapStep), gapValue),
    ...variables('grid-align', expand<string>(align, 'stretch', (value, fallback) => value === 'auto' ? fallback : alignValue(value, fallback)), value => value),
    ...variables('grid-justify', expand<string>(justify, 'stretch', (value, fallback) => value === 'auto' ? fallback : justifyValue(value, fallback)), value => value),
  };
  return <div {...props} className={['cr-grid', className].filter(Boolean).join(' ')}><div className="cr-grid-layout" style={layout}>{children}</div></div>;
}

/** An optional span wrapper. Every responsive value is reset locally for safe nesting. */
export function GridItem({ children, span = 'full', rowSpan = 1, align = 'auto', justify = 'auto', className, style, ...props }: GridItemProps) {
  const spans = expand<GridSpan>(span, 'full', (value, fallback) => value === 'full' ? value : typeof value === 'number' ? count(value, typeof fallback === 'number' ? fallback : 24) : fallback);
  const placement: CSSProperties = {
    ...style,
    ...variables('grid-item-span', spans, value => value === 'full' ? 'var(--cr-grid-columns, 1)' : value),
    ...variables('grid-item-rows', expand(rowSpan, 1, count), value => value),
    ...variables('grid-item-align', expand<string>(align, 'auto', alignValue), value => value),
    ...variables('grid-item-justify', expand<string>(justify, 'auto', justifyValue), value => value),
  };
  return <div {...props} style={placement} className={['cr-grid-item', className].filter(Boolean).join(' ')}>{children}</div>;
}

/** An empty, decorative grid cell. Responsive visibility removes its placement when hidden. */
export function GridSpacer({ span = 1, rowSpan = 1, visible = true, className, style, id, ref }: GridSpacerProps) {
  const visibility = expand(visible, true, (value, fallback) => typeof value === 'boolean' ? value : fallback);
  return <GridItem id={id} ref={ref} span={span} rowSpan={rowSpan} aria-hidden="true" inert
    className={['cr-grid-spacer', className].filter(Boolean).join(' ')}
    style={{ ...style, ...variables('grid-spacer-display', visibility, value => value ? 'block' : 'none') }} />;
}
