import type { ComponentTokenDoc } from './types';

const paginationGlobals = [
  '--cr-color-muted', '--cr-color-active', '--cr-color-on-active', '--cr-color-active-border',
  '--cr-color-subtle', '--cr-color-text', '--cr-duration-fast', '--cr-font-sans',
  '--cr-radius-md', '--cr-shadow-sm', '--cr-space-1', '--cr-space-4',
];

export const tableTokenDocs: ComponentTokenDoc[] = [
  {
    component: 'Pagination',
    componentTokens: [{
      name: '--cr-pagination-gap',
      fallback: true,
      description: 'Spacing between pagination controls.',
      type: 'length',
      defaultValue: 'var(--cr-space-1)',
      source: { file: 'src/system/pagination.css', selector: '.cr-pagination-controls' },
      references: ['--cr-space-1'],
      notes: ['Set this property on the navigation element or an ancestor.'],
    }],
    globalTokens: paginationGlobals,
    notes: [
      'The ellipsis width uses space-4. The shared font and muted color style the ellipses and compact page summary.',
      'The current page uses the solid evergreen highlight. Other page buttons and the previous and next buttons use the ghost palette.',
    ],
  },
  {
    component: 'Table',
    componentTokens: [{
      name: '--cr-table-leading-inset',
      description: 'Extra start padding for the first column when groups have collapse chevrons, so its content lines up with the group dot.',
      type: 'length',
      defaultValue: '0px',
      source: { file: 'src/system/table.css', selector: '.cr-table' },
      sources: [{ file: 'src/system/table.css', selector: '.cr-table[data-group-toggles]', detail: 'calc(28px + 8px): the chevron width plus the heading gap.' }],
    }],
    globalTokens: [...new Set([
      '--cr-color-border', '--cr-color-canvas', '--cr-color-muted',
      '--cr-color-subtle', '--cr-color-surface', '--cr-color-text', '--cr-font-sans',
      '--cr-radius-lg', '--cr-space-2', '--cr-space-3', '--cr-space-4', '--cr-space-6',
      ...paginationGlobals,
    ])],
    notes: [
      'The table frame uses the shared surface and large radius. Column headers use the subtle surface, and row-group headers use the canvas surface.',
      'Shared spacing tokens set cell insets, empty-state padding, and the pager inset.',
      'The optional pager uses Pagination’s styling hook and shared tokens. Apply pager overrides to the navigation element or an ancestor that contains it.',
    ],
  },
];
