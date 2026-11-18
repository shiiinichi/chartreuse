import { cloneElement, createElement, isValidElement } from 'react';
import type { ComponentPropsWithRef, ComponentType, ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/** Props supplied to a custom SVG component by a control’s icon slot. */
export interface IconProps extends ComponentPropsWithRef<'svg'> {
  size?: number | string;
}

/** A Lucide icon, custom React SVG component, or an inline SVG JSX element. */
export type IconSource = LucideIcon | ComponentType<IconProps> | ReactElement<IconProps>;

/** @internal Render a decorative icon without interpreting SVG/HTML strings. */
export function renderIcon(source: IconSource | undefined, props: IconProps = {}): ReactNode {
  if (!source || typeof source === 'string') return null;
  const size = props.size ?? 16;
  const normalized: IconProps = {
    ...props,
    size,
    width: props.width ?? size,
    height: props.height ?? size,
    color: props.color ?? 'currentColor',
    'aria-hidden': true,
    focusable: false,
    tabIndex: -1,
  };

  if (isValidElement<IconProps>(source)) {
    // Native slots accept SVG roots; ordinary DOM elements and fragments are not icons.
    if (typeof source.type === 'string' && source.type !== 'svg') return null;
    if (typeof source.type === 'symbol') return null;
    const attributes = { ...normalized };
    if (source.type === 'svg') delete attributes.size;
    if (source.props.className || props.className) attributes.className = [source.props.className, props.className].filter(Boolean).join(' ');
    if (source.props.style || props.style) attributes.style = { ...source.props.style, ...props.style };
    return cloneElement(source, attributes);
  }

  // React SVG components (including Lucide’s forwardRef icons) remain React components.
  if (typeof source !== 'function' && !(typeof source === 'object' && '$$typeof' in source)) return null;
  return createElement(source, normalized);
}
