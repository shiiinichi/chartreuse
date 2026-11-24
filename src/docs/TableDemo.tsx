import { useState } from 'react';
import { Badge, Table } from '../system';
import type { TableColumn } from '../system';
import { ExampleGallery, Showcase } from './shared';
import { recipeCode } from './BoardRecipesDemo';
import { GroupedTableRecipe } from './board-recipes/GroupedTableRecipe';
import groupedTableRecipeSource from './board-recipes/GroupedTableRecipe.tsx?raw';
import { ArtifactTable } from './table-examples/ArtifactTable';
import { BuildTimingTable } from './table-examples/BuildTimingTable';
import { CapacityTable } from './table-examples/CapacityTable';
import { DeploymentTable } from './table-examples/DeploymentTable';
import { IssueQueueTable } from './table-examples/IssueQueueTable';
import { QueuePriorityTable } from './table-examples/QueuePriorityTable';
import { ReviewQueueTable } from './table-examples/ReviewQueueTable';
import artifactSource from './table-examples/ArtifactTable.tsx?raw';
import timingSource from './table-examples/BuildTimingTable.tsx?raw';
import capacitySource from './table-examples/CapacityTable.tsx?raw';
import deploymentSource from './table-examples/DeploymentTable.tsx?raw';
import issuesSource from './table-examples/IssueQueueTable.tsx?raw';
import prioritySource from './table-examples/QueuePriorityTable.tsx?raw';
import reviewSource from './table-examples/ReviewQueueTable.tsx?raw';

function exampleCode(source: string) {
  return source.replace("from '../../system';", "from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';").trim();
}

const runs = [
  { id: 'RUN-061', check: 'Theme contrast', target: 'library', status: 'Passed', seconds: 18 },
  { id: 'RUN-060', check: 'Sidebar keyboard navigation', target: 'docs', status: 'Passed', seconds: 24 },
  { id: 'RUN-059', check: 'Responsive workspace', target: 'docs', status: 'Needs review', seconds: 31 },
  { id: 'RUN-058', check: 'Focus order', target: 'library', status: 'Passed', seconds: 12 },
  { id: 'RUN-057', check: 'Component deep links', target: 'docs', status: 'Passed', seconds: 9 },
  { id: 'RUN-056', check: 'Control sizing', target: 'library', status: 'Passed', seconds: 16 },
] as const;

type Run = (typeof runs)[number];
const statusTones = { Passed: 'success', 'Needs review': 'warning' } as const;
const columns: readonly TableColumn<Run>[] = [
  { id: 'check', header: 'Validation check', rowHeader: true, render: run => run.check },
  { id: 'status', header: 'Result', render: run => <Badge tone={statusTones[run.status]} dot>{run.status}</Badge> },
  { id: 'duration', header: 'Duration (s)', align: 'end', render: run => run.seconds },
];

const pageSize = 3;
const groups = [
  { id: 'library', heading: 'Component library', rows: runs.filter(run => run.target === 'library') },
  { id: 'docs', heading: 'Documentation site', rows: runs.filter(run => run.target === 'docs') },
  { id: 'package', heading: 'Package artifacts', rows: [], emptyContent: 'No package validation runs yet.' },
];

const exampleSetup = `import { Badge, Table, type TableColumn } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

const runs = [
${runs.map(run => `  ${JSON.stringify(run)},`).join('\n')}
] as const;

type Run = (typeof runs)[number];
const statusTones = { Passed: 'success', 'Needs review': 'warning' } as const;
const columns: readonly TableColumn<Run>[] = [
  { id: 'check', header: 'Validation check', rowHeader: true,
    render: run => run.check },
  { id: 'status', header: 'Result',
    render: run => <Badge tone={statusTones[run.status]} dot>{run.status}</Badge> },
  { id: 'duration', header: 'Duration (s)', align: 'end',
    render: run => run.seconds },
];`;

const paginatedCode = `import { useState } from 'react';
${exampleSetup}

export function ValidationRuns() {
  const [page, setPage] = useState(1);
  const pageSize = ${pageSize};
  const offset = (page - 1) * pageSize;

  return (
    <Table
      label="Validation runs"
      columns={columns}
      rows={runs.slice(offset, offset + pageSize)}
      getRowKey={run => run.id}
      pagination={{
        page,
        pageCount: Math.ceil(runs.length / pageSize),
        onPageChange: setPage,
        'aria-label': 'Validation run pages',
      }}
    />
  );
}`;

const groupedCode = `${exampleSetup}

const groups = [
  { id: 'library', heading: 'Component library',
    rows: runs.filter(run => run.target === 'library') },
  { id: 'docs', heading: 'Documentation site',
    rows: runs.filter(run => run.target === 'docs') },
  { id: 'package', heading: 'Package artifacts',
    rows: [], emptyContent: 'No package validation runs yet.' },
];

export function ValidationTargets() {
  return (
    <Table label="Checks by validation target" columns={columns} groups={groups}
      getRowKey={run => run.id} />
  );
}`;

export function TableDemo() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * pageSize;

  return (
    <ExampleGallery maxColumns={1}>
      <Showcase title="Basic release artifacts" description="Use file names as row headers and align numeric sizes with their column heading."
        code={exampleCode(artifactSource)}>
        <ArtifactTable />
      </Showcase>
      <Showcase title="Sort build timings" description="Sort by build name or compare the fastest and slowest runs."
        code={exampleCode(timingSource)}>
        <BuildTimingTable />
      </Showcase>
      <Showcase title="Paginated validation runs" description="Choose a page to browse the validation history." code={paginatedCode}>
        <Table
          label="Validation runs"
          columns={columns}
          rows={runs.slice(offset, offset + pageSize)}
          getRowKey={run => run.id}
          pagination={{
            page,
            pageCount: Math.ceil(runs.length / pageSize),
            onPageChange: setPage,
            'aria-label': 'Validation run pages',
          }}
        />
      </Showcase>
      <Showcase title="Checks grouped by target" description="Group runs under shared headings and show a message for empty targets." code={groupedCode}>
        <Table label="Checks by validation target" columns={columns} groups={groups}
          getRowKey={run => run.id} />
      </Showcase>
      <Showcase span="full" title="Tasks grouped by stage" description="A list view of a board: category-colored group headings with counts, add actions, and headings that collapse a stage to a one-line summary when clicked anywhere outside the add action. Rows link to their task pages, long titles truncate, and comfortable density gives 48px rows."
        code={recipeCode(groupedTableRecipeSource)}>
        <GroupedTableRecipe />
      </Showcase>
      <Showcase title="Search and filter issues" description="Filter by title, ID, area, or status. A new filter starts at the first page."
        code={exampleCode(issuesSource)}>
        <IssueQueueTable />
      </Showcase>
      <Showcase title="Select and review rows" description="Choose individual checks or the whole pending queue, then mark the selection reviewed."
        code={exampleCode(reviewSource)}>
        <ReviewQueueTable />
      </Showcase>
      <Showcase title="Edit priorities inline" description="Change the priority of a job queue directly in its row."
        code={exampleCode(prioritySource)}>
        <QueuePriorityTable />
      </Showcase>
      <Showcase title="Open deployment details" description="View the notes, owner, and status for a deployment."
        code={exampleCode(deploymentSource)}>
        <DeploymentTable />
      </Showcase>
      <Showcase title="Scroll a wide table" description="Swipe to see more runner metrics, or focus the table and use the arrow keys."
        code={exampleCode(capacitySource)}>
        <CapacityTable />
      </Showcase>
    </ExampleGallery>
  );
}
