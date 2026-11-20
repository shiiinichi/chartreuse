import patternPreviewSource from './PatternPreview.tsx?raw';
import patternPreviewStyles from './pattern-preview.css?raw';

const previewCode = patternPreviewSource
  .replace("import './pattern-preview.css';\n", '')
  .replace("from '../system'", "from '@chartreuse/ui'")
  .trim();

export function withPatternPreview(code: string, patternStyles = '') {
  const stylesheet = [patternPreviewStyles, patternStyles].filter(Boolean).join('\n\n').replaceAll('*/', '* /').trim();
  return `${code}\n\n${previewCode}\n\n/* Add these rules to your stylesheet.\n${stylesheet}\n*/`;
}

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

export const taskBoardPatternCode = withPatternPreview(`import { useState } from 'react';
import { Swimlane, TaskCard, Button, TextField, WorkspaceContent } from '@chartreuse/ui';
import type { TaskCardProps } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

${boardRecipe}

// Supply your task data and the create/open handlers from the application.
export function TaskBoardExample(props: Parameters<typeof TaskBoardPattern>[0]) {
  return (
    <PatternPreview page="task-board">
      <WorkspaceContent as="section" width="full" aria-label="Example workspace content">
        <TaskBoardPattern {...props} />
      </WorkspaceContent>
    </PatternPreview>
  );
}`);

export const workspacePatternCode = withPatternPreview(`import { useState } from 'react';
import { Tabs, Alert, Swimlane, TaskCard, Button, TextField, WorkspaceContent, Text } from '@chartreuse/ui';
import type { TaskCardProps } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

${boardRecipe}

export function WorkspacePattern(props: Parameters<typeof TaskBoardPattern>[0]) {
  return (
    <PatternPreview page="workspace">
      <WorkspaceContent as="section" width="full" aria-label="Example workspace content">
        <Text size="heading-2">Development workspace</Text>
        <Text size="body">Track task status, validation results, and workspace activity.</Text>
        <Tabs label="Workspace views" items={[
          { value: 'board', label: 'Board', count: props.cards.length,
            content: <TaskBoardPattern {...props} /> },
          { value: 'validation', label: 'Validation',
            content: <Alert tone="success" title="Validation passed">
              All checks passed in this example.
            </Alert> },
          { value: 'activity', label: 'Activity',
            content: <Text size="body">Task updates and validation events for this workspace.</Text> },
        ]} />
      </WorkspaceContent>
    </PatternPreview>
  );
}`);

export const agentMonitorPatternCode = withPatternPreview(`import { useState } from 'react';
import { Grid, GridItem, Card, AgentCard, Progress, Tabs, WorkspaceContent, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

const agents = [
  { name: 'Research agent', task: 'Inspecting the component API and dependencies.',
    status: 'running', tokens: '2.4k', elapsed: '00:42' },
  { name: 'Builder agent', task: 'Implementing the task board components.',
    status: 'running', tokens: '8.1k', elapsed: '02:18' },
  { name: 'Review agent', task: 'Waiting for the implementation to finish.',
    status: 'waiting', tokens: '0', elapsed: '00:00' },
] as const;

export function AgentMonitorPattern() {
  const [selected, setSelected] = useState<string>(agents[0].name);
  const active = agents.find(agent => agent.name === selected)!;
  return (
    <PatternPreview page="agent-monitor">
      <WorkspaceContent as="section" width="full" aria-label="Example workspace content">
        <Grid columns={{ base: 1, md: 2 }} gap={6}>
          <GridItem span={1}>
            {agents.map(agent => <AgentCard key={agent.name} {...agent}
              selected={selected === agent.name} onClick={() => setSelected(agent.name)} />)}
          </GridItem>
          <GridItem span={1}><Card style={{ padding: 24 }}>
            <Text size="heading-3">{active.name}</Text><Text size="body">{active.task}</Text>
            <Text size="body">{active.elapsed} · {active.tokens} tokens</Text>
            <Progress value={active.status === 'waiting' ? 0 : 24} label="Context window" />
            <Tabs label="Agent details" items={[
              { value: 'activity', label: 'Activity', content: <Text size="body">Execution events for the selected agent.</Text> },
              { value: 'context', label: 'Context', content: <Text size="body">Implement the workspace task board using shared design tokens and components. Verify filtering, task dialogs, and status updates.</Text> },
            ]} />
          </Card></GridItem>
        </Grid>
      </WorkspaceContent>
    </PatternPreview>
  );
}`);
