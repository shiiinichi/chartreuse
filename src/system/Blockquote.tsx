import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Tone } from './components';
import './content-blocks.css';

export interface BlockquoteProps extends Omit<ComponentPropsWithRef<'figure'>, 'children'> {
  children: ReactNode;
  /** Machine-readable source URL on the quotation, separate from its visible attribution. */
  cite?: string;
  /** Author, source, or other visible credit outside the quoted content. */
  attribution?: ReactNode;
  /** Plain left rule, or an inset quotation with a colored background. */
  variant?: 'plain' | 'filled';
  /** Colors the rule and, for filled quotations, the background. */
  tone?: Tone;
}

/** A quotation with a left rule and an optional, separate attribution. */
export function Blockquote({ children, cite, attribution, variant = 'plain', tone = 'neutral', className, ...props }: BlockquoteProps) {
  const hasAttribution = attribution !== undefined && attribution !== null && attribution !== false;
  return <figure {...props} className={['cr-blockquote', className].filter(Boolean).join(' ')} data-variant={variant} data-tone={tone}>
    <blockquote className="cr-blockquote-content" cite={cite}>{children}</blockquote>
    {hasAttribution && <figcaption className="cr-blockquote-attribution">{attribution}</figcaption>}
  </figure>;
}
