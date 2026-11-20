import { useRef, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import { Badge, Button, EmptyState, Flex, Grid, Select, Table, Text, TextField, type TableColumn } from '../../system';

const issues = [
  { id: 'UI-147', title: 'Restore focus after closing search', area: 'Navigation', status: 'Open' },
  { id: 'UI-146', title: 'Preserve a draft when switching tabs', area: 'Forms', status: 'In review' },
  { id: 'UI-145', title: 'Align badges in the release summary', area: 'Layout', status: 'Resolved' },
  { id: 'UI-144', title: 'Wrap long command names', area: 'Navigation', status: 'Open' },
  { id: 'UI-143', title: 'Fit the settings editor at 320 px', area: 'Layout', status: 'In review' },
  { id: 'UI-142', title: 'Label the retry action', area: 'Feedback', status: 'Resolved' },
  { id: 'UI-141', title: 'Show upload errors beside the field', area: 'Forms', status: 'Open' },
  { id: 'UI-140', title: 'Check contrast on muted notifications', area: 'Feedback', status: 'Open' },
] as const;

type Issue = (typeof issues)[number];
const statusTones = { Open: 'info', 'In review': 'warning', Resolved: 'success' } as const;
const columns: TableColumn<Issue>[] = [
  {
    id: 'issue',
    header: 'Issue',
    rowHeader: true,
    render: issue => <>
      {issue.title}
      <Text size="small" display="block" style={{ color: 'var(--cr-color-muted)' }}><code>{issue.id}</code></Text>
    </>,
  },
  { id: 'area', header: 'Area', render: issue => issue.area },
  { id: 'status', header: 'Status', render: issue => <Badge tone={statusTones[issue.status]} dot>{issue.status}</Badge> },
];
const pageSize = 3;

export function IssueQueueTable() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const search = useRef<HTMLInputElement>(null);
  const term = query.trim().toLowerCase();
  const matching = issues.filter(issue => {
    const searchable = `${issue.title} ${issue.id} ${issue.area}`.toLowerCase();
    return searchable.includes(term) && (status === 'all' || issue.status === status);
  });
  const offset = (page - 1) * pageSize;

  function clearFilters() {
    setQuery('');
    setStatus('all');
    setPage(1);
    search.current?.focus();
  }

  return (
    <Flex direction="column" gap={4}>
      <Grid columns={{ base: 1, sm: 2 }} gap={3}>
        <TextField label="Find an issue" type="search" placeholder="Title, ID, or area" icon={Search}
          ref={search} value={query} onChange={event => { setQuery(event.currentTarget.value); setPage(1); }} />
        <Select label="Status" value={status} onChange={event => { setStatus(event.currentTarget.value); setPage(1); }}>
          <option value="all">All statuses</option>
          {Object.keys(statusTones).map(value => <option key={value}>{value}</option>)}
        </Select>
      </Grid>
      <Text size="small" role="status">{matching.length} {matching.length === 1 ? 'issue' : 'issues'}</Text>
      <Table label="Component issues" columns={columns} rows={matching.slice(offset, offset + pageSize)}
        getRowKey={issue => issue.id}
        emptyContent={<EmptyState icon={SearchX} title="No matching issues"
          description="Try a different search or clear the filters."
          action={<Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>} />}
        pagination={{ page, pageCount: Math.ceil(matching.length / pageSize), onPageChange: setPage, 'aria-label': 'Issue pages' }} />
    </Flex>
  );
}
