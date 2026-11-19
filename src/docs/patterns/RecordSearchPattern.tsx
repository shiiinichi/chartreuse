import { useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { Badge, Button, Card, Dialog, EmptyState, Flex, Form, Grid, GridItem, Select, TextField, WorkspaceContent } from '../../system';
import './record-search-pattern.css';

type RecordStatus = 'Active' | 'In review' | 'Archived';
type RecordType = 'Runbook' | 'Incident' | 'Change request';

interface SearchRecord {
  id: string;
  title: string;
  type: RecordType;
  status: RecordStatus;
  owner: string;
  updated: string;
  summary: string;
}

interface SearchFilters {
  query: string;
  status: RecordStatus | 'all';
  type: RecordType | 'all';
}

const records: readonly SearchRecord[] = [
  { id: 'REC-2041', title: 'API gateway rate limits', type: 'Runbook', status: 'Active', owner: 'Amina Shah', updated: '2026-11-17', summary: 'Request thresholds, response headers, and escalation steps for the public API gateway.' },
  { id: 'REC-2040', title: 'Event replay delay', type: 'Incident', status: 'In review', owner: 'Leo Tan', updated: '2026-11-16', summary: 'Timeline and follow-up actions for delayed event replay in the processing queue.' },
  { id: 'REC-2039', title: 'Storage encryption key rotation', type: 'Change request', status: 'In review', owner: 'Nora Patel', updated: '2026-11-15', summary: 'Proposed key rotation schedule, verification steps, and rollback conditions for object storage.' },
  { id: 'REC-2038', title: 'Deployment recovery', type: 'Runbook', status: 'Active', owner: 'Elias Cruz', updated: '2026-11-14', summary: 'Recover a failed service deployment and verify application health after rollback.' },
  { id: 'REC-2037', title: 'Queue visibility timeout', type: 'Incident', status: 'Active', owner: 'Leo Tan', updated: '2026-11-13', summary: 'Investigation of repeated queue deliveries after workers exceed the visibility timeout.' },
  { id: 'REC-2036', title: 'Service account credential rotation', type: 'Runbook', status: 'Active', owner: 'Amina Shah', updated: '2026-11-12', summary: 'Rotate service credentials, update dependent applications, and confirm access remains available.' },
  { id: 'REC-2035', title: 'Staging data retention', type: 'Change request', status: 'Archived', owner: 'Nora Patel', updated: '2026-11-10', summary: 'Completed change to remove staging snapshots after the approved retention period.' },
  { id: 'REC-2034', title: 'Webhook delivery timeout', type: 'Incident', status: 'Archived', owner: 'Maya Chen', updated: '2026-11-08', summary: 'Resolved delivery timeouts caused by a downstream endpoint exceeding the response deadline.' },
  { id: 'REC-2033', title: 'Worker capacity increase', type: 'Change request', status: 'Active', owner: 'Elias Cruz', updated: '2026-11-06', summary: 'Approved capacity adjustment for the processing workers, including resource limits and monitoring.' },
  { id: 'REC-2032', title: 'Audit log export', type: 'Runbook', status: 'In review', owner: 'Maya Chen', updated: '2026-11-04', summary: 'Export audit events for a specified interval and validate the resulting record count.' },
  { id: 'REC-2031', title: 'Scheduled report delivery', type: 'Incident', status: 'Active', owner: 'Nora Patel', updated: '2026-11-02', summary: 'Investigation of reports that remain pending after the scheduled delivery window.' },
  { id: 'REC-2030', title: 'Token exchange migration', type: 'Change request', status: 'Archived', owner: 'Amina Shah', updated: '2026-10-29', summary: 'Completed migration to the current token exchange endpoint with access verification results.' },
];

const initialFilters: SearchFilters = { query: '', status: 'all', type: 'all' };
const statusTones = { Active: 'success', 'In review': 'warning', Archived: 'neutral' } as const;
const dateFormatter = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatDate = (date: string) => dateFormatter.format(new Date(`${date}T00:00:00Z`));

function matchesRecord(record: SearchRecord, filters: SearchFilters): boolean {
  if (filters.status !== 'all' && record.status !== filters.status) return false;
  if (filters.type !== 'all' && record.type !== filters.type) return false;
  const searchableText = [record.id, record.title, record.owner, record.summary].join(' ').toLowerCase();
  const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every(term => searchableText.includes(term));
}

export function RecordSearchPattern() {
  const id = useId();
  const queryRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialFilters);
  const [selectedRecord, setSelectedRecord] = useState<SearchRecord | null>(null);
  const results = records.filter(record => matchesRecord(record, appliedFilters));
  const hasDraftChanges = filters.query.trim() !== appliedFilters.query
    || filters.status !== appliedFilters.status || filters.type !== appliedFilters.type;
  const appliedSummary = [
    appliedFilters.query ? `Query: “${appliedFilters.query}”` : 'Any query',
    appliedFilters.status === 'all' ? 'All statuses' : appliedFilters.status,
    appliedFilters.type === 'all' ? 'All types' : appliedFilters.type,
  ].join(' · ');

  function searchRecords(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters({ ...filters, query: filters.query.trim() });
  }

  function resetFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    queryRef.current?.focus();
  }

  const directory = <div className="record-search-pattern">
    <Flex align="start" justify="space-between" wrap gap={3}>
      <div className="record-search-pattern-introduction">
        <h2 className="record-search-pattern-heading" id={`${id}-title`}>Record directory</h2>
        <p>Search the operational records by query, status, and type.</p>
      </div>
      <Badge>12 local records</Badge>
    </Flex>

    <search aria-labelledby={`${id}-title`}>
      <Form className="record-search-pattern-form" layout="vertical" method="get" action=""
        aria-labelledby={`${id}-title`} onSubmit={searchRecords}
        onReset={event => { event.preventDefault(); resetFilters(); }}
        actions={<Flex className="record-search-pattern-actions" direction={{ base: 'column', sm: 'row' }} gap={3}>
          <Button type="submit" icon={Search}>Search records</Button>
          <Button type="reset" variant="secondary" icon={RotateCcw}>Reset filters</Button>
        </Flex>}>
        <Grid columns={{ base: 1, sm: 2, md: 4 }} gap={4} align="start">
          <GridItem span={{ base: 'full', md: 2 }}>
            <TextField ref={queryRef} label="Record query" name="query" type="search"
              icon={Search} placeholder="For example, gateway or REC-2041"
              hint="Match ID, title, owner, or summary. All search terms must match."
              autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="search"
              value={filters.query} onChange={event => setFilters({ ...filters, query: event.target.value })} />
          </GridItem>
          <GridItem span={1}>
            <Select label="Status" name="status" hint="Filter by lifecycle state."
              value={filters.status} onChange={event => setFilters({ ...filters, status: event.target.value as SearchFilters['status'] })}>
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="In review">In review</option>
              <option value="Archived">Archived</option>
            </Select>
          </GridItem>
          <GridItem span={1}>
            <Select label="Type" name="type" hint="Filter by record category."
              value={filters.type} onChange={event => setFilters({ ...filters, type: event.target.value as SearchFilters['type'] })}>
              <option value="all">All types</option>
              <option value="Runbook">Runbook</option>
              <option value="Incident">Incident</option>
              <option value="Change request">Change request</option>
            </Select>
          </GridItem>
        </Grid>
      </Form>
    </search>

    <p className="record-search-pattern-filter-feedback">
      {hasDraftChanges ? 'Filters changed. Choose Search records to apply them.' : 'Results reflect the submitted filters.'}
    </p>

    <section className="record-search-pattern-results" aria-labelledby={`${id}-results-title`}>
      <h3 className="record-search-pattern-results-title" id={`${id}-results-title`}>Results</h3>
      <p className="record-search-pattern-result-count" role="status" aria-atomic="true">
        <strong>{results.length} of {records.length} records</strong>
        <span>{appliedSummary}</span>
      </p>

      {results.length === 0 ? <Card className="record-search-pattern-empty">
        <EmptyState title="No matching records" icon={Search}
          description="Try fewer search terms, choose another status or type, or reset all filters."
          action={<Button type="button" variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset filters</Button>} />
      </Card> : <ul className="record-search-pattern-list" role="list">
        {results.map(record => <li key={record.id}>
          <Card className="record-search-pattern-result" aria-labelledby={`${id}-${record.id}`}>
            <Flex align="start" justify="space-between" wrap gap={3}>
              <div className="record-search-pattern-record-heading">
                <p className="record-search-pattern-reference"><code>{record.id}</code><span>{record.type}</span></p>
                <h4 id={`${id}-${record.id}`}>{record.title}</h4>
              </div>
              <Badge tone={statusTones[record.status]} dot>{record.status}</Badge>
            </Flex>
            <p className="record-search-pattern-summary">{record.summary}</p>
            <Flex className="record-search-pattern-record-footer" direction={{ base: 'column', sm: 'row' }}
              align={{ base: 'stretch', sm: 'center' }} justify="space-between" gap={3}>
              <dl className="record-search-pattern-metadata">
                <div><dt>Owner</dt><dd>{record.owner}</dd></div>
                <div><dt>Updated</dt><dd><time dateTime={record.updated}>{formatDate(record.updated)}</time></dd></div>
              </dl>
              <Button type="button" variant="secondary" aria-label={`View details for ${record.id}`}
                onClick={() => setSelectedRecord(record)}>View details</Button>
            </Flex>
          </Card>
        </li>)}
      </ul>}
    </section>

    <Dialog className="record-search-pattern-dialog" open={selectedRecord !== null}
      onOpenChange={open => { if (!open) setSelectedRecord(null); }}
      title={selectedRecord?.title ?? 'Record details'}
      description={selectedRecord ? `${selectedRecord.id} · ${selectedRecord.type}` : undefined}
      footer={<Button type="button" variant="secondary" onClick={() => setSelectedRecord(null)}>Close details</Button>}>
      {selectedRecord && <div className="record-search-pattern-details">
        <Badge tone={statusTones[selectedRecord.status]} dot>{selectedRecord.status}</Badge>
        <h3>Summary</h3>
        <p>{selectedRecord.summary}</p>
        <dl className="record-search-pattern-detail-metadata">
          <div><dt>Record ID</dt><dd><code>{selectedRecord.id}</code></dd></div>
          <div><dt>Type</dt><dd>{selectedRecord.type}</dd></div>
          <div><dt>Owner</dt><dd>{selectedRecord.owner}</dd></div>
          <div><dt>Last updated</dt><dd><time dateTime={selectedRecord.updated}>{formatDate(selectedRecord.updated)}</time></dd></div>
        </dl>
      </div>}
    </Dialog>
  </div>;

  return <WorkspaceContent as="section" width="full" aria-label="Example workspace content">{directory}</WorkspaceContent>;
}
