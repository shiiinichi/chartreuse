import type { ComponentPropsWithRef, CSSProperties } from 'react';
import type { GridGap, GridResponsive } from './Grid';
import './flex.css';

export type FlexDirection = 'row' | 'column';
export type FlexAlignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustification = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

export interface FlexProps extends Omit<ComponentPropsWithRef<'div'>, 'align'> {
  direction?: GridResponsive<FlexDirection>;
  wrap?: GridResponsive<boolean>;
  align?: GridResponsive<FlexAlignment>;
  justify?: GridResponsive<FlexJustification>;
  gap?: GridResponsive<GridGap>;
  rowGap?: GridResponsive<GridGap>;
  columnGap?: GridResponsive<GridGap>;
}

const tiers = ['base', 'sm', 'md', 'lg', 'xl'] as const;
type Tier = typeof tiers[number];
const gapSteps: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
const directions: readonly string[] = ['row', 'column'];
const alignments: readonly string[] = ['start', 'center', 'end', 'stretch', 'baseline'];
const justifications: readonly string[] = ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'];

function expand<T>(value: GridResponsive<T> | undefined, fallback: T, normalize: (value: unknown, fallback: T) => T): Record<Tier, T> {
  const overrides = value !== null && typeof value === 'object' ? value as Partial<Record<Tier, T>> : undefined;
  let previous = normalize(overrides ? overrides.base : value, fallback);
  return Object.fromEntries(tiers.map(tier => {
    if (overrides && overrides[tier] !== undefined) previous = normalize(overrides[tier], previous);
    return [tier, previous];
  })) as Record<Tier, T>;
}

function variables<T>(property: string, values: Record<Tier, T>, serialize: (value: T) => string | number): CSSProperties {
  return Object.fromEntries(tiers.map(tier => [`--cr-flex-${property}-${tier}`, serialize(values[tier])])) as CSSProperties;
}

const gapStep = (value: unknown, fallback: GridGap): GridGap => typeof value === 'number' && gapSteps.includes(value) ? value as GridGap : fallback;
const gapValue = (value: GridGap) => value === 0 ? '0px' : `var(--cr-space-${value}, ${value * 4}px)`;
const axisValue = (value: string) => value === 'start' ? 'flex-start' : value === 'end' ? 'flex-end' : value;

/** Container-responsive flex layout. Children remain direct flex items in DOM order. */
export function Flex({ children, direction = 'row', wrap = false, align = 'stretch', justify = 'start', gap = 3, rowGap, columnGap, className, ...props }: FlexProps) {
  const gaps = expand(gap, 3, gapStep);
  const layout: CSSProperties = {
    ...variables('direction', expand(direction, 'row', (value, fallback) => typeof value === 'string' && directions.includes(value) ? value as FlexDirection : fallback), value => value),
    ...variables('wrap', expand(wrap, false, (value, fallback) => typeof value === 'boolean' ? value : fallback), value => value ? 'wrap' : 'nowrap'),
    ...variables('align', expand(align, 'stretch', (value, fallback) => typeof value === 'string' && alignments.includes(value) ? value as FlexAlignment : fallback), axisValue),
    ...variables('justify', expand(justify, 'start', (value, fallback) => typeof value === 'string' && justifications.includes(value) ? value as FlexJustification : fallback), axisValue),
    ...variables('row-gap', rowGap === undefined ? gaps : expand(rowGap, gaps.base, gapStep), gapValue),
    ...variables('column-gap', columnGap === undefined ? gaps : expand(columnGap, gaps.base, gapStep), gapValue),
  };
  return <div {...props} className={['cr-flex', className].filter(Boolean).join(' ')}><div className="cr-flex-layout" style={layout}>{children}</div></div>;
}
