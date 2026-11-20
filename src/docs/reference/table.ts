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
    { name: 'getRowKey', type: '(row: Row) => Key', required: true, description: 'Returns a stable React key for a row.' },
    { name: 'rows', type: 'readonly Row[]', description: 'Rows for an ungrouped table, in display order.' },
    { name: 'groups', type: 'readonly TableGroup<Row>[]', description: 'Row groups in display order.' },
    { name: 'groups[].id', type: 'string', required: true, description: 'Stable, unique group identity.' },
    { name: 'groups[].heading', type: 'ReactNode', required: true, description: 'Visible heading for the group.' },
    { name: 'groups[].rows', type: 'readonly Row[]', required: true, description: 'Rows in this group, in display order.' },
    { name: 'groups[].emptyContent', type: 'ReactNode', description: 'Overrides the table’s empty content for this group.' },
    { name: 'emptyContent', type: 'ReactNode', defaultValue: "'No rows to display.'", description: 'Content for an empty table or group unless the group supplies its own content.' },
    { name: 'pagination', type: 'PaginationProps', description: 'Controlled Pagination rendered below the table. Pass the rows for the active page.' },
    { name: 'className', type: 'string', description: 'Additional classes on the table element.' },
    { name: 'ref', type: 'Ref<HTMLTableElement>', description: 'Native table ref.' },
  ],
  notes: [
    'Choose a caption that names the dataset. Mark the identifying column as a row header with rowHeader.',
    'Supply either rows or groups. Include empty groups when users need to see every status.',
    'The table scrolls horizontally within its container when the columns need more space. Keyboard focus can enter the scroll area when it overflows.',
    'For pagination, keep the page number and the total page count in the caller. Slice or fetch the rows for the selected page, then pass those rows and connect the pagination callback.',
  ],
}];
