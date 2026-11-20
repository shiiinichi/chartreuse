import { useState } from 'react';
import { Flex, Select, Table, type TableColumn } from '../../system';

const builds = [
  { id: 'BUILD-108', name: 'Component package', runner: 'Linux ARM64', seconds: 32 },
  { id: 'BUILD-109', name: 'Documentation site', runner: 'Linux x64', seconds: 78 },
  { id: 'BUILD-110', name: 'Browser fixtures', runner: 'macOS ARM64', seconds: 54 },
  { id: 'BUILD-111', name: 'Token export', runner: 'Linux x64', seconds: 16 },
];

type Build = (typeof builds)[number];
const names = new Intl.Collator('en-US', { numeric: true, sensitivity: 'base' });
const sortOrders = {
  longest: { label: 'Longest duration', compare: (a: Build, b: Build) => b.seconds - a.seconds },
  shortest: { label: 'Shortest duration', compare: (a: Build, b: Build) => a.seconds - b.seconds },
  name: { label: 'Build name', compare: (a: Build, b: Build) => names.compare(a.name, b.name) },
};
type SortOrder = keyof typeof sortOrders;

const columns: TableColumn<Build>[] = [
  { id: 'build', header: 'Build', rowHeader: true, render: build => build.name },
  { id: 'runner', header: 'Runner', render: build => build.runner },
  { id: 'duration', header: 'Duration (s)', align: 'end', render: build => build.seconds },
];

export function BuildTimingTable() {
  const [sort, setSort] = useState<SortOrder>('longest');
  const orderedBuilds = [...builds].sort(sortOrders[sort].compare);

  return (
    <Flex direction="column" gap={4}>
      <div style={{ maxInlineSize: '15rem' }}>
        <Select label="Sort by" value={sort} onChange={event => setSort(event.currentTarget.value as SortOrder)}>
          {Object.entries(sortOrders).map(([value, order]) => <option value={value} key={value}>{order.label}</option>)}
        </Select>
      </div>
      <span className="cr-sr-only" role="status">Sorted by {sortOrders[sort].label.toLowerCase()}</span>
      <Table label="Build timings" columns={columns} rows={orderedBuilds} getRowKey={build => build.id} />
    </Flex>
  );
}
