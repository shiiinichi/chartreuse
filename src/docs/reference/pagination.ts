import type { ComponentReference } from './types';

export const paginationReferences: ComponentReference[] = [{
  name: 'Pagination',
  slug: 'pagination',
  summary: 'Controlled page navigation with numbered buttons and previous and next actions.',
  importCode: "import { useState } from 'react';\nimport { Pagination } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `export function RunHistoryPages() {
  const [page, setPage] = useState(1);

  return <Pagination page={page} pageCount={12}
    onPageChange={setPage} aria-label="Run history pages" />;
}`,
  nativeElement: 'nav with native buttons',
  nativeProps: 'Native attributes such as id, style, className, accessible naming, events, and ref target the navigation element. Page props determine its controls.',
  props: [
    { name: 'page', type: 'number', required: true, description: 'Current page number, starting at 1. Values outside the available range are clamped for display.' },
    { name: 'pageCount', type: 'number', required: true, description: 'Total number of available pages. The controls appear when two or more pages are available.' },
    { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Receives the requested one-based page when the user chooses another page.' },
    { name: 'aria-label', type: 'string', defaultValue: "'Pagination'", description: 'Accessible name for the navigation. Give each pager a distinct name when a view contains several.' },
    { name: 'className', type: 'string', description: 'Additional classes on the navigation element.' },
    { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native navigation ref.' },
  ],
  notes: [
    'Supply the selected page and total page count. Use onPageChange to update state and show the corresponding results.',
    'The current button uses aria-current="page". Previous and next are disabled at the first and last pages, respectively.',
    'Ellipses indicate skipped page numbers when the page count is large.',
    'In narrow containers, a page summary appears between the previous and next buttons.',
    'Use Pagination on its own for a collection or pass the same props to the Table pagination property.',
  ],
}];
