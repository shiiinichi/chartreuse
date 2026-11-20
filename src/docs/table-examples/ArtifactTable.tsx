import { Table, type TableColumn } from '../../system';

const artifacts = [
  { filename: 'chartreuse-ui.tgz', format: 'npm package', size: 92.4 },
  { filename: 'chartreuse.css', format: 'Stylesheet', size: 118.7 },
  { filename: 'tokens.json', format: 'Design tokens', size: 12.8 },
];

type Artifact = (typeof artifacts)[number];
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const columns: TableColumn<Artifact>[] = [
  { id: 'artifact', header: 'Artifact', rowHeader: true, render: artifact => artifact.filename },
  { id: 'format', header: 'Format', render: artifact => artifact.format },
  { id: 'size', header: 'Size (KiB)', align: 'end', render: artifact => number.format(artifact.size) },
];

export function ArtifactTable() {
  return <Table label="Release artifacts" columns={columns} rows={artifacts} getRowKey={artifact => artifact.filename} />;
}
