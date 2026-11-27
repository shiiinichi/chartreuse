import { useId, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import type { Tone } from './components';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import './row.css';
import './list.css';

/** A CSS length. Numbers are pixels. */
export type ListLength = number | string;

export interface ListSizeProps {
  minWidth?: ListLength;
  maxWidth?: ListLength;
  minHeight?: ListLength;
  maxHeight?: ListLength;
}

export interface ListItem extends ListSizeProps {
  id: string;
  /** Primary item text or caller-owned content, such as a link. Optional when content is set. */
  title?: ReactNode;
  /** Secondary muted text below the title. */
  description?: ReactNode;
  /** Decorative leading icon that replaces the bullet or number for this item. */
  icon?: IconSource;
  /** Decorative leading content, such as an Avatar, that replaces the marker and icon. Keep the name in title. */
  leading?: ReactNode;
  /** Colors the marker or icon. */
  tone?: Tone;
  /** End-aligned content, such as a Badge, a count, or a small action. Keep it non-interactive when href or onClick is set. */
  trailing?: ReactNode;
  /**
   * Free row content that replaces the marker, icon, title, description, and trailing slots. It lays out as a
   * plain block, so arrange anything inside, such as a Flex. Keep it free of links and buttons when the item is interactive.
   */
  content?: ReactNode;
  /** Accessible name for an interactive item. Defaults to the text of content, or of title. */
  label?: string;
  /** Marks the item as the current one: aria-current="true" on its link or button, and the selected row surface. */
  selected?: boolean;
  /** Make the whole item a link. */
  href?: string;
  /** Make the whole item a button. With href, it runs on the link click. */
  onClick?: () => void;
}

export interface ListProps extends ListSizeProps, Omit<HTMLAttributes<HTMLElement>, 'children' | 'role' | 'onSelect'> {
  items: readonly ListItem[];
  /** Renders a numbered ol instead of a bulleted ul. */
  ordered?: boolean;
  /** Bullets for ul and numbers for ol, or no marker. Item icons always render. Defaults to 'none' for the outline and plain variants. */
  marker?: 'auto' | 'none';
  /** First number of an ordered list. */
  start?: number;
  size?: 'sm' | 'md';
  /** Draws a rule between items and adds block padding to each one. Ignored by the outline and plain variants. */
  dividers?: boolean;
  /** 'outline' and 'plain' draw each item as a Tree-style row; the default keeps text list items. */
  variant?: 'default' | 'outline' | 'plain';
  /** With the outline and plain variants, drop the list's 4px outer padding, so row borders sit on the container's content edge. Defaults to false. */
  flush?: boolean;
  /** The selected item (controlled). Pass null for none. */
  selectedId?: string | null;
  /** The initially selected item when selectedId is not set. */
  defaultSelectedId?: string | null;
  /** Makes every item without href a button that selects it. */
  onSelectionChange?: (id: string, item: ListItem) => void;
  ref?: Ref<HTMLUListElement | HTMLOListElement>;
}

const hasNode = (value: ReactNode) => value !== undefined && value !== null && value !== false && value !== '';
const length = (value: ListLength | undefined) => typeof value === 'number' ? `${value}px` : value;
const sizeStyle = ({ minWidth, maxWidth, minHeight, maxHeight }: ListSizeProps): CSSProperties | undefined => {
  const style: CSSProperties = {};
  if (minWidth !== undefined) style.minInlineSize = length(minWidth);
  if (maxWidth !== undefined) style.maxInlineSize = length(maxWidth);
  if (minHeight !== undefined) style.minBlockSize = length(minHeight);
  if (maxHeight !== undefined) style.maxBlockSize = length(maxHeight);
  return Object.keys(style).length ? style : undefined;
};

/** A semantic bulleted or numbered list, or a list of Tree-style rows that can be links, buttons, and a single selection. */
export function List({ items, ordered = false, marker, start, size = 'md', dividers = false, variant = 'default', flush = false,
  selectedId, defaultSelectedId = null, onSelectionChange, minWidth, maxWidth, minHeight, maxHeight, className, style, ref, ...props }: ListProps) {
  const instance = useId();
  const [internalSelected, setInternalSelected] = useState<string | null>(defaultSelectedId);
  const selected = selectedId === undefined ? internalSelected : selectedId;
  const rows = variant !== 'default';
  const markerMode = marker ?? (rows ? 'none' : 'auto');
  const Element = ordered ? 'ol' : 'ul';
  const counterStyle = ordered && start !== undefined && Number.isFinite(start) ? { counterReset: `cr-list ${Math.trunc(start) - 1}` } as CSSProperties : undefined;
  const listStyle = { ...counterStyle, ...sizeStyle({ minWidth, maxWidth, minHeight, maxHeight }), ...style };
  return <Element
    {...props}
    ref={ref as Ref<HTMLUListElement & HTMLOListElement>}
    // Custom markers remove list-style; an explicit role keeps list semantics in Safari.
    role="list"
    start={ordered ? start : undefined}
    style={Object.keys(listStyle).length ? listStyle : undefined}
    className={['cr-list', className].filter(Boolean).join(' ')}
    data-ordered={ordered || undefined}
    data-marker={markerMode}
    data-size={size}
    data-dividers={!rows && dividers || undefined}
    data-variant={rows ? variant : undefined}
    data-flush={rows && flush || undefined}
    data-max-height={maxHeight !== undefined || undefined}
  >
    {items.map((item, index) => {
      const leading = hasNode(item.leading) ? item.leading : null;
      const icon = leading ? null : renderIcon(item.icon, { size: size === 'sm' ? 14 : 16 });
      const media = leading ? 'leading' : icon ? 'icon' : undefined;
      const selects = Boolean(onSelectionChange) && item.href === undefined;
      const interactive = item.href !== undefined || Boolean(item.onClick) || selects;
      const isSelected = item.selected ?? (selected !== null && selected === item.id);
      const activate = () => {
        item.onClick?.();
        if (!selects) return;
        if (selectedId === undefined) setInternalSelected(item.id);
        if (selected !== item.id) onSelectionChange?.(item.id, item);
      };
      const domId = `${instance}-${index}`;
      const custom = hasNode(item.content);
      const stretched = (rows || custom) && interactive;
      const titleId = `${domId}-title`;
      const descriptionId = hasNode(item.description) ? `${domId}-description` : undefined;
      const actionProps = {
        onClick: interactive ? activate : undefined,
        'aria-current': isSelected ? 'true' as const : undefined,
      };
      // Rows and free content stretch an empty native link or button over the item and name it from the item's
      // text, so the content can be any block layout without nesting it in a button.
      const rowAction = stretched ? {
        ...actionProps,
        className: 'cr-list-row-action',
        'aria-label': item.label,
        'aria-labelledby': item.label ? undefined : custom ? `${domId}-content` : titleId,
        'aria-describedby': item.label || custom ? undefined : descriptionId,
      } : null;
      const action = rowAction && (item.href !== undefined ? <a href={item.href} {...rowAction} /> : <button type="button" {...rowAction} />);
      const title = stretched || !interactive ? item.title
        : item.href !== undefined ? <a className="cr-list-link" href={item.href} aria-label={item.label} {...actionProps}>{item.title}</a>
          : <button type="button" className="cr-list-link" aria-label={item.label} {...actionProps}>{item.title}</button>;
      return <li key={item.id} className={rows ? 'cr-list-item cr-list-row' : 'cr-list-item'} style={sizeStyle(item)}
        data-tone={item.tone ?? 'neutral'} data-media={custom ? undefined : media} data-content={custom || undefined}
        data-interactive={interactive || undefined} data-selected={isSelected || undefined} data-max-height={item.maxHeight !== undefined || undefined}>
        {action}
        {custom ? <div id={`${domId}-content`} className="cr-list-row-content">{item.content}</div> : <>
          {(media || markerMode !== 'none') && <span className={leading ? 'cr-list-marker cr-list-leading' : 'cr-list-marker'} aria-hidden="true">{leading ?? icon}</span>}
          <div className="cr-list-content">
            <div className="cr-list-title" id={stretched ? titleId : undefined}>{title}</div>
            {hasNode(item.description) && <div className="cr-list-description" id={stretched ? descriptionId : undefined}>{item.description}</div>}
          </div>
          {hasNode(item.trailing) && <div className="cr-list-trailing">{item.trailing}</div>}
        </>}
      </li>;
    })}
  </Element>;
}
