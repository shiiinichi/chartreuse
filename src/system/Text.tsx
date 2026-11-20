import { createElement } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import type { typography } from './tokens';
import './text.css';

export type TextSize = typeof typography[number]['id'];

const elements: Record<TextSize, string | undefined> = {
  display: 'h1',
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  body: 'p',
  small: 'small',
  label: undefined,
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  size?: TextSize;
  display?: 'inline' | 'block';
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  ref?: Ref<HTMLElement>;
}

/** Applies the Chartreuse type scale with native text semantics. */
export function Text({ size, display, bold, italic, strikethrough, className, ...props }: TextProps) {
  const nativeElement = size && elements[size];
  const inline = bold ? 'strong' : italic ? 'em' : strikethrough ? 'del' : 'span';
  let element = nativeElement ?? inline;
  if (display === 'inline') element = inline;
  if (display === 'block' && !element.startsWith('h')) element = 'div';
  return createElement(element, {
    ...props,
    className: className ? `cr-text ${className}` : 'cr-text',
    'data-size': size,
    'data-display': display,
    'data-bold': bold || undefined,
    'data-italic': italic || undefined,
    'data-strikethrough': strikethrough || undefined,
  });
}
