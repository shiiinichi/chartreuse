import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Plus } from 'lucide-react';
import { Button, ChipGroup, IconButton, List, SegmentedProgress, Swimlane, SwimlaneGroup, Table, TaskCard, ToggleChip } from '../../src/system';
import { KanbanBoardRecipe } from '../../src/docs/board-recipes/KanbanBoardRecipe';
import { CompactBoardRecipe } from '../../src/docs/board-recipes/CompactBoardRecipe';
import { GroupedTableRecipe } from '../../src/docs/board-recipes/GroupedTableRecipe';

const add = (label: string) => <IconButton label={`Add to ${label}`} icon={Plus} size="sm" />;

function AlignmentLanes({ variant }: { variant: 'card' | 'flush' }) {
  const lanes = (
    <>
      <Swimlane data-testid={`${variant}-expanded`} title="Doing" count={1} accent="cat-2" headerStyle="dot" variant={variant} collapsible defaultCollapsed={false} action={add('Doing')}>
        <TaskCard taskId="T-1" title="Write the brief" />
      </Swimlane>
      <Swimlane data-testid={`${variant}-collapsed`} title="Done" count={3} accent="cat-6" headerStyle="dot" variant={variant} collapsible defaultCollapsed action={add('Done')} />
    </>
  );
  return variant === 'flush'
    ? <SwimlaneGroup label="Flush lanes" data-testid="flush-group">{lanes}</SwimlaneGroup>
    : <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>{lanes}</div>;
}

const narrowStages = ['To do', 'In progress', 'In review', 'QA', 'Ready to ship', 'Shipped to customers', 'Done'];

/** Seven shared-width collapsible lanes, about 176px each, with titles long enough to overflow their header. */
function NarrowLanes({ style }: { style: 'tag' | 'dot' }) {
  return (
    <SwimlaneGroup label={`Narrow ${style} lanes`} variant={style === 'dot' ? 'surface' : 'separate'} data-testid={`narrow-${style}`}>
      {narrowStages.map((title, index) => (
        <Swimlane key={title} title={title} count={0} accent={`cat-${index + 1}` as 'cat-1'} headerStyle={style}
          variant={style === 'dot' ? 'flush' : 'card'} density={style === 'dot' ? 'compact' : 'default'}
          collapsible defaultCollapsed={title === 'Done'} action={add(title)} />
      ))}
    </SwimlaneGroup>
  );
}

function Controls() {
  const [pressed, setPressed] = useState(true);
  return (
    <section aria-label="Controls" style={{ display: 'grid', gap: 16 }}>
      <ChipGroup label="Stages">
        <ToggleChip dot pressed={pressed} onClick={() => setPressed(!pressed)} accent="cat-1" count={4}>Backlog</ToggleChip>
        <ToggleChip dot accent="cat-3" variant="dashed" addIcon>Review</ToggleChip>
      </ChipGroup>
      <SegmentedProgress label="Board progress" legend segments={[{ id: 'done', label: 'Done', value: 3, accent: 'cat-6' }, { id: 'doing', label: 'Doing', value: 2, accent: 'cat-2' }, { id: 'todo', label: 'Todo', value: 5 }]} />
      <List items={[{ id: 'a', title: 'Linked item', href: '#a' }, { id: 'b', title: 'Clickable item', onClick: () => {} }]} />
      <Button variant="dashed">Add task</Button>
      <TaskCard taskId="T-2" title="Linked card" href="#card" density="compact" statusAccent="cat-4" status="Review" />
    </section>
  );
}

function Fixture() {
  return (
    <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 32, padding: 24 }}>
      <h1>Board fixture</h1>
      <div data-testid="alignment-card"><AlignmentLanes variant="card" /></div>
      <div data-testid="alignment-flush"><AlignmentLanes variant="flush" /></div>
      <div data-testid="kanban"><KanbanBoardRecipe /></div>
      <div data-testid="compact"><CompactBoardRecipe /></div>
      <div data-testid="fixed-width">
        <SwimlaneGroup label="Fixed-width lanes" variant="separate" laneWidth={240}>
          <Swimlane title="One" count={0} variant="card" headerStyle="dot" />
          <Swimlane title="Two" count={0} variant="card" headerStyle="dot" collapsible defaultCollapsed />
          <Swimlane title="Three" count={0} variant="card" headerStyle="dot" />
        </SwimlaneGroup>
      </div>
      <div data-testid="overflow" style={{ maxInlineSize: 360 }}>
        <SwimlaneGroup label="Overflowing lanes" laneWidth={600}>
          <Swimlane title="One" count={0} variant="flush" headerStyle="dot" />
          <Swimlane title="Two" count={0} variant="flush" headerStyle="dot" />
          <Swimlane title="Three" count={0} variant="flush" headerStyle="dot" />
          <Swimlane title="Four" count={2} variant="flush" headerStyle="dot" collapsible defaultCollapsed />
        </SwimlaneGroup>
      </div>
      <NarrowLanes style="dot" />
      <NarrowLanes style="tag" />
      <div data-testid="table"><GroupedTableRecipe /></div>
      <div data-testid="comfortable-table">
        <Table label="Comfortable groups" density="comfortable" getRowKey={(row: { id: number; name: string }) => row.id}
          columns={[{ id: 'name', header: 'Name', rowHeader: true, render: (row: { id: number; name: string }) => row.name }]}
          groups={[
            { id: 'todo', heading: 'To do', count: 1, accent: 'cat-2', collapsible: true, rows: [{ id: 1, name: 'Write the spec' }],
              action: <IconButton icon={Plus} size="sm" variant="ghost" label="Add to To do" /> },
            { id: 'done', heading: 'Done', count: 1, accent: 'cat-6', collapsible: true, rows: [{ id: 2, name: 'Ship it' }] },
          ]} />
      </div>
      <div data-testid="controls"><Controls /></div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
