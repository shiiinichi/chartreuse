import { Children, useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, DragEvent, ReactNode } from 'react';
import { ChevronsLeft } from 'lucide-react';
import { Badge, IconButton } from './components';
import type { Tone } from './components';
import type { CategoryColor } from './tokens';
import { Text } from './Text';
import './swimlane.css';

export interface SwimlaneItemLabel {
  one: string;
  other: string;
}

export interface SwimlaneProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  title: string;
  count: number;
  tone?: Tone;
  /** Categorical color for the lane accent, tag, and dot. Overrides tone for color only. */
  accent?: CategoryColor;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  emptyContent?: ReactNode;
  /** Adds collapse and expand buttons. Defaults to true when collapsed, defaultCollapsed, or onCollapsedChange is set. */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. Defaults to false. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Noun for the count in the expand button's name. Defaults to { one: 'item', other: 'items' }. */
  itemLabel?: SwimlaneItemLabel;
  /** 'tag' draws the title in a toned badge; 'dot' draws an 8px dot, a 14px heading, and a pill count. Defaults to 'tag'. */
  headerStyle?: 'tag' | 'dot';
  /** 'card' is a standalone bordered lane; 'flush' sits inside a shared SwimlaneGroup surface. Defaults to 'card'. */
  variant?: 'card' | 'flush';
  /** 'compact' tightens header and body padding and the card gap. Defaults to 'default'. */
  density?: 'default' | 'compact';
}

const defaultItemLabel: SwimlaneItemLabel = { one: 'item', other: 'items' };

/** A status column surface; card data and board actions remain with the consumer. */
export function Swimlane({
  title, count, tone = 'neutral', accent, description, action, children, emptyContent, collapsible, collapsed, defaultCollapsed,
  onCollapsedChange, itemLabel = defaultItemLabel, headerStyle = 'tag', variant = 'card', density = 'default',
  onDragOver, onDragLeave, onDrop, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, ...props
}: SwimlaneProps) {
  const id = useId();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed ?? false);
  const [dropTarget, setDropTarget] = useState(false);
  const focusAfterToggle = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const collapseRef = useRef<HTMLButtonElement>(null);
  const isCollapsible = collapsible ?? (collapsed !== undefined || defaultCollapsed !== undefined || onCollapsedChange !== undefined);
  const isCollapsed = isCollapsible && (collapsed ?? internalCollapsed);
  const itemCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasAction = action !== undefined && action !== null && action !== false;
  const hasContent = Children.toArray(children).length > 0;
  const bodyId = `${id}-body`;

  useEffect(() => {
    if (!focusAfterToggle.current) return;
    focusAfterToggle.current = false;
    (isCollapsed ? toggleRef : collapseRef).current?.focus();
  }, [isCollapsed]);
  useEffect(() => { if (!isCollapsed) setDropTarget(false); }, [isCollapsed]);

  function setCollapsed(next: boolean) {
    focusAfterToggle.current = true;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  // Collapsed lanes stay drop targets. The hover state shows only once the consumer accepts the drag.
  const dragHandlers = isCollapsed ? {
    onDragOver(event: DragEvent<HTMLElement>) {
      onDragOver?.(event);
      if (event.defaultPrevented) setDropTarget(true);
    },
    onDragLeave(event: DragEvent<HTMLElement>) {
      onDragLeave?.(event);
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(false);
    },
    onDrop(event: DragEvent<HTMLElement>) {
      setDropTarget(false);
      onDrop?.(event);
    },
  } : { onDragOver, onDragLeave, onDrop };

  const titleId = `${id}-title`;
  const itemNoun = itemCount === 1 ? itemLabel.one : itemLabel.other;
  const heading = headerStyle === 'dot'
    ? <><span className="cr-swimlane-dot" aria-hidden="true" /><Text size="heading-3" id={titleId} className="cr-swimlane-title">{title}</Text></>
    : <Text size="heading-3" id={titleId}><Badge className="cr-swimlane-tag" tone={tone} accent={accent} dot><span className="cr-swimlane-title">{title}</span></Badge></Text>;
  const showDescription = hasDescription && !isCollapsed;

  return <section
    {...props}
    {...dragHandlers}
    className={['cr-swimlane', className].filter(Boolean).join(' ')}
    data-tone={tone}
    data-accent={accent}
    data-collapsible={isCollapsible || undefined}
    data-collapsed={isCollapsed ? 'true' : undefined}
    data-drop-target={isCollapsed && dropTarget ? 'true' : undefined}
    data-header-style={headerStyle === 'tag' ? undefined : headerStyle}
    data-variant={variant === 'card' ? undefined : variant}
    data-density={density === 'default' ? undefined : density}
    aria-label={ariaLabel}
    aria-labelledby={labelledBy || (ariaLabel ? undefined : titleId)}
    aria-describedby={[describedBy, showDescription && `${id}-description`].filter(Boolean).join(' ') || undefined}
  >
    {isCollapsed ? <div className="cr-swimlane-rail">
      {hasAction && <div className="cr-swimlane-action">{action}</div>}
      <button
        ref={toggleRef}
        type="button"
        className="cr-swimlane-toggle"
        aria-expanded="false"
        aria-controls={bodyId}
        onClick={() => setCollapsed(false)}
      >
        {/* The name comes from content, not aria-label, so it contains the visible title and count (WCAG 2.5.3). */}
        <span className="cr-sr-only">{`Expand ${title}, ${itemCount} ${itemNoun}`}</span>
        <span className="cr-swimlane-dot" aria-hidden="true" />
        <span className="cr-swimlane-toggle-title" id={titleId} aria-hidden="true">{title}</span>
        <span className="cr-swimlane-count" aria-hidden="true">{itemCount}</span>
      </button>
    </div> : <header className="cr-swimlane-header">
      <div className="cr-swimlane-heading">{heading}<span className="cr-swimlane-count">{itemCount}</span></div>
      {(hasAction || isCollapsible) && <div className="cr-swimlane-action">
        {hasAction && action}
        {isCollapsible && <IconButton
          ref={collapseRef}
          size="sm"
          icon={ChevronsLeft}
          label={`Collapse ${title}`}
          className="cr-swimlane-collapse"
          aria-expanded="true"
          aria-controls={bodyId}
          onClick={() => setCollapsed(true)}
        />}
      </div>}
      {showDescription && <div className="cr-swimlane-description" id={`${id}-description`}>{description}</div>}
    </header>}
    <div className="cr-swimlane-body" id={isCollapsible ? bodyId : undefined} hidden={isCollapsed || undefined}>{hasContent ? children : <div className="cr-swimlane-empty">{emptyContent !== undefined ? emptyContent : <Text size="body">No items in this lane.</Text>}</div>}</div>
  </section>;
}

export interface SwimlaneGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'role'> {
  /** Accessible name for the board region, e.g. "Board". */
  label: string;
  /**
   * 'surface' joins flush lanes on one bordered surface with 1px dividers;
   * 'separate' spaces card lanes 12px apart with no shared surface. Defaults to 'surface'.
   */
  variant?: 'surface' | 'separate';
  /**
   * Gives every expanded lane this fixed width: a number in px or any CSS length, e.g. 280 or '18rem'.
   * Lanes then neither grow nor shrink, and the row scrolls when they do not fit. When omitted, lanes share the width with a 168px minimum.
   */
  laneWidth?: number | string;
  children?: ReactNode;
}

/**
 * A row of Swimlanes. Expanded lanes share the width with a 168px minimum, or take laneWidth when it is set; collapsed lanes take
 * --cr-swimlane-collapsed-size, and the row scrolls horizontally inside its own box when it must.
 */
export function SwimlaneGroup({ label, variant = 'surface', laneWidth, children, className, style, ...props }: SwimlaneGroupProps) {
  const width = typeof laneWidth === 'number' ? (Number.isFinite(laneWidth) && laneWidth > 0 ? `${laneWidth}px` : undefined) : laneWidth?.trim() || undefined;
  return <div
    {...props}
    role="region"
    aria-label={label}
    className={['cr-swimlane-group', className].filter(Boolean).join(' ')}
    data-variant={variant}
    data-lane-width={width ? 'fixed' : undefined}
    style={width ? { ...style, '--cr-swimlane-lane-width': width } as CSSProperties : style}
  >
    <div className="cr-swimlane-group-scroll">{children}</div>
  </div>;
}
