import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import type { Tone } from './components';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import './list.css';

export interface ListItem {
  id: string;
  /** Primary item text or caller-owned content, such as a link. */
  title: ReactNode;
  /** Secondary muted text below the title. */
  description?: ReactNode;
  /** Decorative leading icon that replaces the bullet or number for this item. */
  icon?: IconSource;
  /** Decorative leading content, such as an Avatar, that replaces the marker and icon. Keep the name in title. */
  leading?: ReactNode;
  /** Colors the marker or icon. */
  tone?: Tone;
  /** End-aligned content, such as a Badge, a count, or a small action. */
  trailing?: ReactNode;
}

export interface ListProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'role'> {
  items: readonly ListItem[];
  /** Renders a numbered ol instead of a bulleted ul. */
  ordered?: boolean;
  /** Bullets for ul and numbers for ol, or no marker. Item icons always render. */
  marker?: 'auto' | 'none';
  /** First number of an ordered list. */
  start?: number;
  size?: 'sm' | 'md';
  /** Draws a rule between items and adds block padding to each one. */
  dividers?: boolean;
  ref?: Ref<HTMLUListElement | HTMLOListElement>;
}

const hasNode = (value: ReactNode) => value !== undefined && value !== null && value !== false && value !== '';

/** A semantic bulleted or numbered list with optional icons, descriptions, trailing content, and dividers. */
export function List({ items, ordered = false, marker = 'auto', start, size = 'md', dividers = false, className, style, ref, ...props }: ListProps) {
  const Element = ordered ? 'ol' : 'ul';
  const counterStyle = ordered && start !== undefined && Number.isFinite(start) ? { counterReset: `cr-list ${Math.trunc(start) - 1}` } as CSSProperties : undefined;
  return <Element
    {...props}
    ref={ref as Ref<HTMLUListElement & HTMLOListElement>}
    // Custom markers remove list-style; an explicit role keeps list semantics in Safari.
    role="list"
    start={ordered ? start : undefined}
    style={counterStyle ? { ...counterStyle, ...style } : style}
    className={['cr-list', className].filter(Boolean).join(' ')}
    data-ordered={ordered || undefined}
    data-marker={marker}
    data-size={size}
    data-dividers={dividers || undefined}
  >
    {items.map(item => {
      const leading = hasNode(item.leading) ? item.leading : null;
      const icon = leading ? null : renderIcon(item.icon, { size: size === 'sm' ? 14 : 16 });
      const media = leading ? 'leading' : icon ? 'icon' : undefined;
      return <li key={item.id} className="cr-list-item" data-tone={item.tone ?? 'neutral'} data-media={media}>
        {(media || marker !== 'none') && <span className={leading ? 'cr-list-marker cr-list-leading' : 'cr-list-marker'} aria-hidden="true">{leading ?? icon}</span>}
        <div className="cr-list-content">
          <div className="cr-list-title">{item.title}</div>
          {hasNode(item.description) && <div className="cr-list-description">{item.description}</div>}
        </div>
        {hasNode(item.trailing) && <div className="cr-list-trailing">{item.trailing}</div>}
      </li>;
    })}
  </Element>;
}
