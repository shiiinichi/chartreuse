import { withExampleStyles, withPatternPreview } from './pattern-preview-code';
import taskBoardSource from './TaskBoard.tsx?raw';
import taskBoardStyles from './task-board.css?raw';
import boardTaskListSource from './BoardTaskList.tsx?raw';
import boardTaskListStyles from './board-task-list.css?raw';

function taskBoardModule() {
  const imports = new Map([['@chartreuse/ui', new Set(['ToastProvider'])]]);
  const bodies = [taskBoardSource, boardTaskListSource].map(source => source
    .replace(/^import '\.\/[^'\n]+\.css';\r?\n/gm, '')
    .replace(/^import (type )?\{([^}]+)\} from '([^']+)';\r?\n/gm,
      (_, typePrefix: string | undefined, bindings: string, path: string) => {
        if (path === './BoardTaskList') return '';
        const moduleName = path === '../system' ? '@chartreuse/ui' : path;
        const names = imports.get(moduleName) ?? new Set<string>();
        for (const name of bindings.split(',').map(binding => binding.trim()).filter(Boolean)) {
          names.add(`${typePrefix ?? ''}${name}`);
        }
        imports.set(moduleName, names);
        return '';
      }).trim());
  const declarations = [...imports].map(([path, names]) => `import { ${[...names].join(', ')} } from '${path}';`);
  declarations.push("import '@chartreuse/ui/styles.css';");
  return [declarations.join('\n'), ...bodies].join('\n\n');
}

const boardCode = taskBoardModule();
const boardStyles = [taskBoardStyles.trim(), boardTaskListStyles.trim()].join('\n\n');

function taskBoardExample(page?: 'task-board' | 'workspace') {
  const board = page === 'workspace' ? '<TaskBoard workspace />' : '<TaskBoard />';
  const content = page ? `<PatternPreview page="${page}">\n        ${board}\n      </PatternPreview>` : board;
  const code = `${boardCode}

export function TaskBoardExample() {
  return (
    <ToastProvider>
      ${content}
    </ToastProvider>
  );
}`;
  return page ? withPatternPreview(code, boardStyles) : withExampleStyles(code, boardStyles);
}

export const taskBoardExampleCode = taskBoardExample();
export const taskBoardPatternCode = taskBoardExample('task-board');
export const workspacePatternCode = taskBoardExample('workspace');

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
