import { useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, Key, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Tone } from './components';
import { Pagination } from './Pagination';
import type { CategoryColor } from './tokens';
import type { PaginationProps } from './Pagination';
import './table.css';

export interface TableColumn<Row> {
  id: string;
  header: ReactNode;
  render: (row: Row) => ReactNode;
  align?: 'start' | 'center' | 'end';
  rowHeader?: boolean;
  /** Column width, as a CSS length or a pixel number. */
  width?: CSSProperties['inlineSize'];
  /** Clip the cell to one line with an ellipsis. The full text goes in title. Pair with width. Defaults to false. */
  truncate?: boolean;
  /** Full text for a truncated cell's title. Defaults to the rendered value when it is a string or number. */
  getTitle?: (row: Row) => string | undefined;
}

export interface TableGroup<Row> {
  id: string;
  heading: ReactNode;
  rows: readonly Row[];
  emptyContent?: ReactNode;
  /** Item count shown after the heading. */
  count?: number;
  /** Tone for the heading dot. A dot appears when tone or accent is set. */
  tone?: Tone;
  /** Categorical color for the heading dot. Overrides tone for color only. */
  accent?: CategoryColor;
  /** Trailing content in the heading row, such as an add button. */
  action?: ReactNode;
  /** Adds a chevron button that shows and hides the group's rows. Defaults to true when collapsed, defaultCollapsed, or onCollapsedChange is set. */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. Defaults to false. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** A single row shown in place of the rows while collapsed, such as "12 done this week". */
  collapsedSummary?: ReactNode;
}

export type TableProps<Row> = Omit<ComponentPropsWithRef<'table'>, 'children' | 'dangerouslySetInnerHTML'> & {
  label: string;
  columns: readonly TableColumn<Row>[];
  getRowKey: (row: Row) => Key;
  emptyContent?: ReactNode;
  /** Controls pagination. Supply the rows or groups for the current page. */
  pagination?: PaginationProps;
  /** 'comfortable' uses 48px rows, 20px cell padding, and taller group headings. Defaults to 'default'. */
  density?: 'default' | 'comfortable';
  /** Make each row a link. The row header (or first) cell's content becomes the link and the whole row is the hit area. */
  getRowHref?: (row: Row) => string | undefined;
  /** Make each row a button. The row header (or first) cell's content becomes the button and the whole row is the hit area. */
  onRowClick?: (row: Row) => void;
} & ({ rows: readonly Row[]; groups?: never } | { groups: readonly TableGroup<Row>[]; rows?: never });

/** A native table with optional row groups and controlled pagination. */
export function Table<Row>({
  label, columns, getRowKey, rows, groups, emptyContent = 'No rows to display.', pagination, density = 'default', getRowHref, onRowClick, className, ...props
}: TableProps<Row>) {
  const captionId = useId();
  const tableId = useId();
  const [internalCollapsed, setInternalCollapsed] = useState<Record<string, boolean>>(() => Object.fromEntries((groups ?? []).map(group => [group.id, group.defaultCollapsed ?? false])));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(true);

  useEffect(() => {
    const viewport = scrollRef.current;
    const table = viewport?.firstElementChild;
    const Observer = viewport?.ownerDocument.defaultView?.ResizeObserver;
    if (!viewport || !table || !Observer) return;

    const measure = () => setScrollable(viewport.scrollWidth > viewport.clientWidth);
    const resize = new Observer(measure);
    resize.observe(viewport);
    resize.observe(table);
    return () => resize.disconnect();
  }, []);

  const columnSpan = Math.max(1, columns.length);
  const linkColumn = columns.find(column => column.rowHeader) ?? columns[0];
  const interactiveRows = Boolean(getRowHref || onRowClick);
  const isCollapsible = (group: TableGroup<Row>) => group.collapsible ?? (group.collapsed !== undefined || group.defaultCollapsed !== undefined || group.onCollapsedChange !== undefined);
  const hasGroupToggles = Boolean(groups?.some(isCollapsible));

  function renderCell(column: TableColumn<Row>, row: Row) {
    const content = column.render(row);
    const withLink = (value: ReactNode) => {
      if (!interactiveRows || column !== linkColumn) return value;
      const href = getRowHref?.(row);
      if (href !== undefined) return <a className="cr-table-row-link" href={href} onClick={onRowClick && (() => onRowClick(row))}>{value}</a>;
      if (onRowClick) return <button type="button" className="cr-table-row-link" onClick={() => onRowClick(row)}>{value}</button>;
      return value;
    };
    if (!column.truncate) return withLink(content);
    const title = column.getTitle?.(row) ?? (typeof content === 'string' || typeof content === 'number' ? String(content) : undefined);
    return withLink(<span className="cr-table-truncate" title={title}>{content}</span>);
  }

  function renderRows(items: readonly Row[], empty: ReactNode, rowIdPrefix?: string, hidden?: boolean) {
    if (!items.length) {
      return <tr id={rowIdPrefix && `${rowIdPrefix}-empty`} hidden={hidden || undefined}><td className="cr-table-empty" colSpan={columnSpan}>{empty}</td></tr>;
    }

    return items.map((row, index) => <tr key={getRowKey(row)} id={rowIdPrefix && `${rowIdPrefix}-${index}`} hidden={hidden || undefined} data-interactive={interactiveRows || undefined}>
      {columns.map(column => {
        const Cell = column.rowHeader ? 'th' : 'td';
        return <Cell key={column.id} scope={column.rowHeader ? 'row' : undefined} data-align={column.align} data-truncate={column.truncate || undefined}>
          {renderCell(column, row)}
        </Cell>;
      })}
    </tr>);
  }

  function renderGroup(group: TableGroup<Row>, groupIndex: number) {
    const empty = group.emptyContent === undefined ? emptyContent : group.emptyContent;
    const collapsible = isCollapsible(group);
    const enhanced = collapsible || group.count !== undefined || group.tone !== undefined || group.accent !== undefined || group.action !== undefined;
    if (!enhanced) return <tbody key={group.id}>
      <tr><th scope="rowgroup" colSpan={columnSpan}>{group.heading}</th></tr>
      {renderRows(group.rows, empty)}
    </tbody>;

    const prefix = `${tableId}-group-${groupIndex}`;
    const collapsed = collapsible && (group.collapsed ?? internalCollapsed[group.id] ?? group.defaultCollapsed ?? false);
    const rowIds = group.rows.length ? group.rows.map((_, index) => `${prefix}-${index}`) : [`${prefix}-empty`];
    const hasSummary = group.collapsedSummary !== undefined && group.collapsedSummary !== null && group.collapsedSummary !== false;
    const count = group.count === undefined ? undefined : Number.isFinite(group.count) ? Math.max(0, Math.floor(group.count)) : 0;
    const toggle = () => {
      const next = !collapsed;
      if (group.collapsed === undefined) setInternalCollapsed(current => ({ ...current, [group.id]: next }));
      group.onCollapsedChange?.(next);
    };
    return <tbody key={group.id} data-collapsed={collapsed ? 'true' : undefined}>
      <tr data-group-heading="true" data-collapsible={collapsible || undefined} onClick={collapsible ? event => {
        // A click anywhere on the heading toggles the group, like the chevron, which stays the keyboard
        // and accessible control. Interactive content (the chevron, the action) and text selections keep their own behavior.
        if (event.defaultPrevented || event.button !== 0) return;
        const target = event.target as Element;
        if (target.closest('a, button, input, select, textarea, label, summary, [role="button"], [contenteditable=""], [contenteditable="true"], .cr-table-group-action')) return;
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && event.currentTarget.contains(selection.anchorNode)) return;
        toggle();
      } : undefined}><th scope="rowgroup" colSpan={columnSpan}>
        <div className="cr-table-group-heading">
          {collapsible && <button type="button" className="cr-table-group-toggle" aria-expanded={!collapsed} aria-controls={[...rowIds, hasSummary && `${prefix}-summary`].filter(Boolean).join(' ')} aria-labelledby={`${prefix}-title`} onClick={toggle}>
            <ChevronRight size={16} aria-hidden="true" />
          </button>}
          {(group.tone !== undefined || group.accent !== undefined) && <span className="cr-table-group-dot" data-tone={group.tone} data-accent={group.accent} aria-hidden="true" />}
          <span className="cr-table-group-title" id={`${prefix}-title`}>{group.heading}</span>
          {count !== undefined && <span className="cr-table-group-count"><span className="cr-sr-only">, </span>{count}</span>}
          {group.action !== undefined && group.action !== null && group.action !== false && <span className="cr-table-group-action">{group.action}</span>}
        </div>
      </th></tr>
      {renderRows(group.rows, empty, prefix, collapsed)}
      {hasSummary && <tr id={`${prefix}-summary`} data-summary="true" hidden={!collapsed || undefined}><td colSpan={columnSpan}>{group.collapsedSummary}</td></tr>}
    </tbody>;
  }

  return <div className="cr-table-frame" dir={props.dir}>
    <div
      className="cr-table-scroll"
      ref={scrollRef}
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? 'region' : undefined}
      aria-labelledby={scrollable ? captionId : undefined}
    >
      <table {...props} className={['cr-table', className].filter(Boolean).join(' ')} data-density={density === 'default' ? undefined : density} data-group-toggles={hasGroupToggles || undefined}>
        <caption id={captionId} className="cr-sr-only">{label}</caption>
        <thead><tr>
          {columns.map(column => <th key={column.id} scope="col" data-align={column.align} style={column.width === undefined ? undefined : { inlineSize: column.width }}>{column.header}</th>)}
        </tr></thead>
        {groups?.length ? groups.map(renderGroup) : <tbody>{renderRows(rows ?? [], emptyContent)}</tbody>}
      </table>
    </div>
    {pagination && <Pagination {...pagination} className={['cr-table-pagination', pagination.className].filter(Boolean).join(' ')} />}
  </div>;
}
