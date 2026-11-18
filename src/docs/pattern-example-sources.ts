const boardRecipe = `const columns = [
  { status: 'todo', title: 'To do', tone: 'neutral' },
  { status: 'in-progress', title: 'In progress', tone: 'info' },
  { status: 'review', title: 'In review', tone: 'warning' },
  { status: 'done', title: 'Done', tone: 'success' },
] as const;

function TaskBoardPattern({ cards, onOpen, onCreate }: {
  cards: TaskCardProps[];
  onOpen: (id: string) => void;
  onCreate: (status: NonNullable<TaskCardProps['status']>) => void;
}) {
  const [query, setQuery] = useState('');
  const visible = cards.filter(card =>
    (card.title + ' ' + card.taskId).toLowerCase().includes(query.toLowerCase()));
  return <>
    <Button onClick={() => onCreate('todo')}>New task</Button>
    <TextField label="Find a task" type="search" value={query}
      onChange={event => setQuery(event.target.value)} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
      gap: 16, overflowX: 'auto', marginTop: 20 }}>
      {columns.map(column => {
        const items = visible.filter(card => card.status === column.status);
        return <Swimlane key={column.status} title={column.title}
          tone={column.tone} count={items.length}
          action={<Button size="sm" onClick={() => onCreate(column.status)}>Add</Button>}>
          {items.map(card => <TaskCard key={card.taskId} {...card}
            onClick={() => onOpen(card.taskId)} />)}
        </Swimlane>;
      })}
    </div>
  </>;
}`;

export const taskBoardPatternCode = `import { useState } from 'react';
import { Swimlane, TaskCard, Button, TextField } from '@chartreuse/ui';
import type { TaskCardProps } from '@chartreuse/ui';

${boardRecipe}

// Supply your task data and the create/open handlers from the application.`;

export const workspacePatternCode = `import { useState } from 'react';
import { Card, Tabs, Alert, Swimlane, TaskCard, Button, TextField } from '@chartreuse/ui';
import type { TaskCardProps } from '@chartreuse/ui';

${boardRecipe}

function WorkspacePattern(props: Parameters<typeof TaskBoardPattern>[0]) {
  return <Card style={{ padding: 24 }}>
    <h2>Development workspace</h2>
    <p>Track task status, validation results, and workspace activity.</p>
    <Tabs label="Workspace views" items={[
      { value: 'board', label: 'Board', count: props.cards.length,
        content: <TaskBoardPattern {...props} /> },
      { value: 'validation', label: 'Validation',
        content: <Alert tone="success" title="Validation passed">
          All checks passed in this example.
        </Alert> },
      { value: 'activity', label: 'Activity',
        content: <p>Task updates and validation events for this workspace.</p> },
    ]} />
  </Card>;
}`;

export const agentMonitorPatternCode = `import { useState } from 'react';
import { Grid, GridItem, Card, AgentCard, Progress, Tabs } from '@chartreuse/ui';

const agents = [
  { name: 'Research agent', task: 'Inspecting the component API and dependencies.',
    status: 'running', tokens: '2.4k', elapsed: '00:42' },
  { name: 'Builder agent', task: 'Implementing the task board components.',
    status: 'running', tokens: '8.1k', elapsed: '02:18' },
  { name: 'Review agent', task: 'Waiting for the implementation to finish.',
    status: 'waiting', tokens: '0', elapsed: '00:00' },
] as const;

function AgentMonitorPattern() {
  const [selected, setSelected] = useState<string>(agents[0].name);
  const active = agents.find(agent => agent.name === selected)!;
  return <Grid columns={{ base: 1, md: 2 }} gap={6}>
    <GridItem span={1}>
      {agents.map(agent => <AgentCard key={agent.name} {...agent}
        selected={selected === agent.name} onClick={() => setSelected(agent.name)} />)}
    </GridItem>
    <GridItem span={1}><Card style={{ padding: 24 }}>
      <h3>{active.name}</h3><p>{active.task}</p>
      <p>{active.elapsed} · {active.tokens} tokens</p>
      <Progress value={active.status === 'waiting' ? 0 : 24} label="Context window" />
      <Tabs label="Agent details" items={[
        { value: 'activity', label: 'Activity', content: <p>Execution events for the selected agent.</p> },
        { value: 'context', label: 'Context', content: <p>Implement the workspace task board using shared design tokens and components. Verify filtering, task dialogs, and status updates.</p> },
      ]} />
    </Card></GridItem>
  </Grid>;
}`;
