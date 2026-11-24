import type { ComponentReference } from './types';

export const tableReferences: ComponentReference[] = [{
  name: 'Table',
  slug: 'table',
  summary: 'A data table with typed columns, optional row groups, and pagination controls.',
  importCode: "import { Table, type TableColumn } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `type VerificationRun = {
  id: string;
  workflow: string;
  passed: number;
  checks: number;
};

const columns: TableColumn<VerificationRun>[] = [
  { id: 'workflow', header: 'Workflow', render: run => run.workflow, rowHeader: true },
  { id: 'id', header: 'Run', render: run => run.id },
  { id: 'checks', header: 'Checks passed', align: 'end',
    render: run => [run.passed, run.checks].join(' / ') },
];

export function VerificationTable() {
  return <Table label="Workspace verification runs" columns={columns}
    getRowKey={run => run.id} groups={[
      { id: 'review', heading: 'Awaiting review', rows: [
        { id: 'RUN-182', workflow: 'Keyboard navigation', passed: 8, checks: 9 },
      ] },
      { id: 'verified', heading: 'Verified', rows: [
        { id: 'RUN-179', workflow: 'Theme contrast', passed: 12, checks: 12 },
      ] },
    ]} />;
}`,
  nativeElement: 'table with a caption, a thead, and one or more tbody elements',
  nativeProps: 'Native table attributes, events, style, className, and ref target the table element. Columns and rows or groups provide its content.',
  props: [
    { name: 'label', type: 'string', required: true, description: 'Accessible table name, rendered as a visually hidden caption.' },
    { name: 'columns', type: 'readonly TableColumn<Row>[]', required: true, description: 'Column definitions in display order.' },
    { name: 'columns[].id', type: 'string', required: true, description: 'Stable, unique column identity.' },
    { name: 'columns[].header', type: 'ReactNode', required: true, description: 'Content of the column header.' },
    { name: 'columns[].render', type: '(row: Row) => ReactNode', required: true, description: 'Renders a cell for the given row. Cells can contain text, links, or interactive controls.' },
    { name: 'columns[].align', type: "'start' | 'center' | 'end'", defaultValue: "'start'", description: 'Logical text alignment for the header and its cells. End alignment uses tabular digits.' },
    { name: 'columns[].rowHeader', type: 'boolean', defaultValue: 'false', description: 'Marks cells in this column as row headers.' },
    { name: 'columns[].width', type: 'string | number', description: 'Column inline size, as a CSS length or a pixel number, set on the header cell.' },
    { name: 'columns[].truncate', type: 'boolean', defaultValue: 'false', description: 'Clips each cell to one line with an ellipsis and puts the full text in title. Pair it with width.' },
    { name: 'columns[].getTitle', type: '(row: Row) => string | undefined', description: 'Full text for a truncated cell’s title. Defaults to the rendered value when it is a string or number.' },
    { name: 'getRowKey', type: '(row: Row) => Key', required: true, description: 'Returns a stable React key for a row.' },
    { name: 'rows', type: 'readonly Row[]', description: 'Rows for an ungrouped table, in display order.' },
    { name: 'groups', type: 'readonly TableGroup<Row>[]', description: 'Row groups in display order.' },
    { name: 'groups[].id', type: 'string', required: true, description: 'Stable, unique group identity.' },
    { name: 'groups[].heading', type: 'ReactNode', required: true, description: 'Visible heading for the group.' },
    { name: 'groups[].rows', type: 'readonly Row[]', required: true, description: 'Rows in this group, in display order.' },
    { name: 'groups[].emptyContent', type: 'ReactNode', description: 'Overrides the table’s empty content for this group.' },
    { name: 'groups[].count', type: 'number', description: 'Item count shown after the heading in tabular muted text.' },
    { name: 'groups[].tone', type: 'Tone', description: 'Color of an 8px heading dot. The dot appears when tone or accent is set; the heading text still names the group.' },
    { name: 'groups[].accent', type: 'CategoryColor', description: 'Categorical color (cat-1 … cat-8) for the heading dot. Overrides tone for color only.' },
    { name: 'groups[].action', type: 'ReactNode', description: 'Trailing content in the heading row, such as an add button.' },
    { name: 'groups[].collapsible', type: 'boolean', defaultValue: 'true when a collapse prop is set', description: 'Adds a chevron button with aria-expanded that shows and hides the group’s rows. A click anywhere else on the heading row toggles it too, except on the action or while selecting text.' },
    { name: 'groups[].collapsed', type: 'boolean', description: 'Controlled collapsed state.' },
    { name: 'groups[].defaultCollapsed', type: 'boolean', defaultValue: 'false', description: 'Initial collapsed state when uncontrolled.' },
    { name: 'groups[].onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Called with the next state when the chevron or the heading row is activated.' },
    { name: 'groups[].collapsedSummary', type: 'ReactNode', description: 'A single row shown in place of the rows while collapsed, such as “12 done this week”.' },
    { name: 'emptyContent', type: 'ReactNode', defaultValue: "'No rows to display.'", description: 'Content for an empty table or group unless the group supplies its own content.' },
    { name: 'density', type: "'default' | 'comfortable'", defaultValue: "'default'", description: 'comfortable uses 48px rows, 20px inline cell padding, and taller group headings.' },
    { name: 'getRowHref', type: '(row: Row) => string | undefined', description: 'Makes each row a link. The row-header (or first) cell content becomes a native link and the whole row is its hit area. Return undefined to leave a row plain.' },
    { name: 'onRowClick', type: '(row: Row) => void', description: 'Makes each row a button, with the same cell and hit area as getRowHref.' },
    { name: 'pagination', type: 'PaginationProps', description: 'Controlled Pagination rendered below the table. Pass the rows for the active page.' },
    { name: 'className', type: 'string', description: 'Additional classes on the table element.' },
    { name: 'ref', type: 'Ref<HTMLTableElement>', description: 'Native table ref.' },
  ],
  notes: [
    'Choose a caption that names the dataset. Mark the identifying column as a row header with rowHeader.',
    'Supply either rows or groups. Include empty groups when users need to see every status.',
    'The table scrolls horizontally within its container when the columns need more space. Keyboard focus can enter the scroll area when it overflows.',
    'Give a group count, tone or accent, action, or a collapse prop to render the enhanced heading row: dot, title, count, and action, with an optional chevron. Groups with only a heading render as before.',
    'A collapsible group’s whole heading row toggles it on click and shows a pointer and hover background. The chevron stays the only keyboard and assistive-technology control, with aria-expanded and aria-controls; the action keeps its own clicks and hover, and dragging to select heading text does not toggle.',
    'When any group has a chevron, the first column is inset by the chevron width so its text lines up with the group dot.',
    'Row links stretch over the row. Other cells in a linked row must not contain links or buttons; put row actions in a detail view instead.',
    'For pagination, keep the page number and the total page count in the caller. Slice or fetch the rows for the selected page, then pass those rows and connect the pagination callback.',
  ],
}];
