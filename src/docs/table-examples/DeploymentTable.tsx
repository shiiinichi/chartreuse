import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Avatar, Badge, Button, Dialog, Flex, IconButton, Table, Text, type TableColumn } from '../../system';

const deployments = [
  { id: 'DEP-034', environment: 'Documentation preview', owner: 'Mira Santos', status: 'Live',
    summary: 'The preview includes the updated keyboard navigation guide and examples.' },
  { id: 'DEP-033', environment: 'Package staging', owner: 'Imani Reid', status: 'Needs attention',
    summary: 'The package built successfully. The installation check is waiting for a fresh runner.' },
  { id: 'DEP-032', environment: 'Token reference', owner: 'Noel Tan', status: 'Live',
    summary: 'The color and spacing reference passed validation and is available to the workspace.' },
] as const;
type Deployment = (typeof deployments)[number];
const tones = { Live: 'success', 'Needs attention': 'warning' } as const;

export function DeploymentTable() {
  const [active, setActive] = useState<Deployment | null>(null);
  const columns: TableColumn<Deployment>[] = [
    { id: 'environment', header: 'Environment', rowHeader: true, render: deployment => deployment.environment },
    { id: 'owner', header: 'Owner', render: deployment => <Avatar name={deployment.owner} size="sm" showName /> },
    { id: 'status', header: 'Status', render: deployment => <Badge tone={tones[deployment.status]} dot>{deployment.status}</Badge> },
    {
      id: 'details',
      header: 'Details',
      align: 'end',
      render: deployment => <IconButton icon={ArrowUpRight} size="sm"
        label={`View details for ${deployment.environment}`} onClick={() => setActive(deployment)} />,
    },
  ];

  return <>
    <Table label="Latest deployments" columns={columns} rows={deployments} getRowKey={deployment => deployment.id} />
    <Dialog open={active !== null} onOpenChange={open => { if (!open) setActive(null); }}
      title={active?.environment ?? 'Deployment details'} description={active?.id}
      footer={<Button size="sm" onClick={() => setActive(null)}>Close</Button>}>
      {active && <Flex direction="column" gap={4}>
        <Text size="body">{active.summary}</Text>
        <Flex wrap align="center" gap={3}>
          <Avatar name={active.owner} size="sm" showName />
          <Badge tone={tones[active.status]} dot>{active.status}</Badge>
        </Flex>
      </Flex>}
    </Dialog>
  </>;
}
