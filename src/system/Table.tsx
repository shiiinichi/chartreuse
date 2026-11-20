import { useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, Key, ReactNode } from 'react';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination';
import './table.css';

export interface TableColumn<Row> {
  id: string;
  header: ReactNode;
  render: (row: Row) => ReactNode;
  align?: 'start' | 'center' | 'end';
  rowHeader?: boolean;
}

export interface TableGroup<Row> {
  id: string;
  heading: ReactNode;
  rows: readonly Row[];
  emptyContent?: ReactNode;
}

export type TableProps<Row> = Omit<ComponentPropsWithRef<'table'>, 'children' | 'dangerouslySetInnerHTML'> & {
  label: string;
  columns: readonly TableColumn<Row>[];
  getRowKey: (row: Row) => Key;
  emptyContent?: ReactNode;
  /** Controls pagination. Supply the rows or groups for the current page. */
  pagination?: PaginationProps;
} & ({ rows: readonly Row[]; groups?: never } | { groups: readonly TableGroup<Row>[]; rows?: never });

/** A native table with optional row groups and controlled pagination. */
export function Table<Row>({
  label, columns, getRowKey, rows, groups, emptyContent = 'No rows to display.', pagination, className, ...props
}: TableProps<Row>) {
  const captionId = useId();
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
  function renderRows(items: readonly Row[], empty: ReactNode) {
    if (!items.length) {
      return <tr><td className="cr-table-empty" colSpan={columnSpan}>{empty}</td></tr>;
    }

    return items.map(row => <tr key={getRowKey(row)}>
      {columns.map(column => {
        const Cell = column.rowHeader ? 'th' : 'td';
        return <Cell key={column.id} scope={column.rowHeader ? 'row' : undefined} data-align={column.align}>
          {column.render(row)}
        </Cell>;
      })}
    </tr>);
  }

  return <div className="cr-table-frame" dir={props.dir}>
    <div
      className="cr-table-scroll"
      ref={scrollRef}
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? 'region' : undefined}
      aria-labelledby={scrollable ? captionId : undefined}
    >
      <table {...props} className={['cr-table', className].filter(Boolean).join(' ')}>
        <caption id={captionId} className="cr-sr-only">{label}</caption>
        <thead><tr>
          {columns.map(column => <th key={column.id} scope="col" data-align={column.align}>{column.header}</th>)}
        </tr></thead>
        {groups?.length ? groups.map(group => <tbody key={group.id}>
          <tr><th scope="rowgroup" colSpan={columnSpan}>{group.heading}</th></tr>
          {renderRows(group.rows, group.emptyContent === undefined ? emptyContent : group.emptyContent)}
        </tbody>) : <tbody>{renderRows(rows ?? [], emptyContent)}</tbody>}
      </table>
    </div>
    {pagination && <Pagination {...pagination} className={['cr-table-pagination', pagination.className].filter(Boolean).join(' ')} />}
  </div>;
}
