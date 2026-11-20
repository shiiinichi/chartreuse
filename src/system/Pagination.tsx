import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button, IconButton } from './components';
import './pagination.css';

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'children' | 'role'> {
  /** The current page, starting at 1. */
  page: number;
  /** The total number of pages. Navigation is hidden when fewer than two are available. */
  pageCount: number;
  onPageChange: (page: number) => void;
}

function pageItems(page: number, count: number): (number | 'start-gap' | 'end-gap')[] {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, 'end-gap', count];
  if (page >= count - 3) return [1, 'start-gap', count - 4, count - 3, count - 2, count - 1, count];
  return [1, 'start-gap', page - 1, page, page + 1, 'end-gap', count];
}

export function Pagination({ page, pageCount, onPageChange, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, ...props }: PaginationProps) {
  const count = Number.isFinite(pageCount) ? Math.min(Math.floor(pageCount), Number.MAX_SAFE_INTEGER) : 0;
  if (count < 2) return null;

  const current = Number.isFinite(page) ? Math.max(1, Math.min(Math.floor(page), count)) : 1;
  const label = ariaLabel ?? (labelledBy ? undefined : 'Pagination');
  function changePage(next: number) {
    if (next >= 1 && next <= count && next !== current) onPageChange(next);
  }

  return <nav {...props} className={['cr-pagination', className].filter(Boolean).join(' ')} aria-label={label} aria-labelledby={labelledBy}>
    <div className="cr-pagination-controls">
      <IconButton className="cr-pagination-step" size="sm" icon={ChevronLeft} label="Previous page" aria-disabled={current === 1 || undefined} onClick={() => changePage(current - 1)} />
      {pageItems(current, count).map(item => typeof item === 'number'
        ? <Button key={item} className="cr-pagination-number" size="sm" variant={item === current ? 'primary' : 'ghost'} aria-label={`Page ${item}`} aria-current={item === current ? 'page' : undefined} onClick={() => changePage(item)}>{item}</Button>
        : <span key={item} className="cr-pagination-gap" aria-hidden="true">…</span>)}
      <span className="cr-pagination-summary cr-sr-only" role="status" aria-atomic="true">Page {current} of {count}</span>
      <IconButton className="cr-pagination-step" size="sm" icon={ChevronRight} label="Next page" aria-disabled={current === count || undefined} onClick={() => changePage(current + 1)} />
    </div>
  </nav>;
}
