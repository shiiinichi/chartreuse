import { Table, type TableColumn } from '../../system';

const pools = [
  { name: 'Preview runners', region: 'Singapore', active: 18, limit: 24, queued: 6, completed: 284, cpu: 57, memory: 69 },
  { name: 'Validation runners', region: 'Frankfurt', active: 24, limit: 32, queued: 12, completed: 417, cpu: 81, memory: 76 },
  { name: 'Release runners', region: 'Sydney', active: 4, limit: 12, queued: 0, completed: 53, cpu: 24, memory: 41 },
];
type Pool = (typeof pools)[number];
const columns: TableColumn<Pool>[] = [
  { id: 'pool', header: 'Runner pool', rowHeader: true, render: pool => pool.name },
  { id: 'region', header: 'Region', render: pool => pool.region },
  { id: 'active', header: 'Active jobs', align: 'end', render: pool => pool.active },
  { id: 'limit', header: 'Job limit', align: 'end', render: pool => pool.limit },
  { id: 'queued', header: 'Queued jobs', align: 'end', render: pool => pool.queued },
  { id: 'completed', header: 'Completed (24h)', align: 'end', render: pool => pool.completed },
  { id: 'cpu', header: 'CPU', align: 'end', render: pool => `${pool.cpu}%` },
  { id: 'memory', header: 'Memory', align: 'end', render: pool => `${pool.memory}%` },
];

export function CapacityTable() {
  return <Table label="Runner pool capacity" columns={columns} rows={pools} getRowKey={pool => pool.name}
    style={{ minInlineSize: '72rem' }} />;
}
