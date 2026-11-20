import { useRef, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { Badge, Button, Checkbox, Flex, Table, Text, type TableColumn } from '../../system';

const initialChecks = [
  { id: 'CHECK-52', name: 'Color contrast in dark mode', area: 'Accessibility', reviewed: false },
  { id: 'CHECK-53', name: 'Keyboard access to the account menu', area: 'Accessibility', reviewed: false },
  { id: 'CHECK-54', name: 'Documentation links in the package', area: 'Release', reviewed: false },
  { id: 'CHECK-55', name: 'Named exports match the catalog', area: 'Release', reviewed: true },
];
type ReviewCheck = (typeof initialChecks)[number];

export function ReviewQueueTable() {
  const [checks, setChecks] = useState(initialChecks);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const summary = useRef<HTMLElement>(null);
  const pending = checks.filter(check => !check.reviewed);
  const allSelected = pending.length > 0 && selected.size === pending.length;

  function selectCheck(id: string, checked: boolean) {
    setSelected(previous => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function markReviewed() {
    setChecks(previous => previous.map(check => selected.has(check.id) ? { ...check, reviewed: true } : check));
    setSelected(new Set());
    summary.current?.focus();
  }

  const columns: TableColumn<ReviewCheck>[] = [
    {
      id: 'selection',
      header: <Checkbox label="" aria-label="Select all pending checks" checked={allSelected} disabled={!pending.length}
        ref={input => { if (input) input.indeterminate = selected.size > 0 && !allSelected; }}
        onChange={event => setSelected(new Set(event.currentTarget.checked ? pending.map(check => check.id) : []))} />,
      render: check => <Checkbox label="" aria-label={`Select ${check.name}`} checked={selected.has(check.id)}
        disabled={check.reviewed} onChange={event => selectCheck(check.id, event.currentTarget.checked)} />,
    },
    { id: 'check', header: 'Check', rowHeader: true, render: check => check.name },
    { id: 'area', header: 'Area', render: check => check.area },
    { id: 'review', header: 'Status', render: check => <Badge tone={check.reviewed ? 'success' : 'warning'} dot>
      {check.reviewed ? 'Reviewed' : 'Awaiting review'}
    </Badge> },
  ];

  return (
    <Flex direction="column" gap={4}>
      <Flex wrap align="center" justify="space-between" gap={3}>
        <Text size="small" role="status" tabIndex={-1} ref={summary}>{selected.size} selected · {pending.length} awaiting review</Text>
        <Button icon={CheckCheck} size="sm" variant="secondary" disabled={!selected.size} onClick={markReviewed}>
          Mark reviewed
        </Button>
      </Flex>
      <Table label="Release review queue" columns={columns} rows={checks} getRowKey={check => check.id} />
    </Flex>
  );
}
