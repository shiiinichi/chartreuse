import { useState } from 'react';
import { LayoutDashboard, Plus, Search } from 'lucide-react';
import {
  Badge, BrandMark, Button, Card, Checkbox, EmptyState, Fieldset, Flex, Navbar, NavbarItem,
  Progress, Select, Sidebar, TextField, WorkspaceContent, WorkspaceLayout, Text,
} from '../../system';

interface Task { id: string; title: string; project: string; checks: boolean[] }

const initialTasks: Task[] = [
  { id: 'TASK-001', title: 'Display task metadata and attached reports', project: 'sample-app', checks: [true, true, false, false, false] },
  { id: 'DS-002', title: 'Document component props and interaction states', project: 'component-library', checks: [true, true, true] },
  { id: 'TASK-003', title: 'Store review decisions in task reports', project: 'sample-app', checks: [true, false, false, false] },
  { id: 'TASK-004', title: 'Verify empty and loading states in the library', project: 'frontend-client', checks: [false, false, false] },
  { id: 'DS-005', title: 'Audit keyboard interaction across components', project: 'component-library', checks: [true, true, false] },
  { id: 'TASK-006', title: 'Link conversation transcripts to task records', project: 'sample-app', checks: [true, false, false, false] },
];
const projects = ['sample-app', 'component-library', 'frontend-client'];
const checkLabels = [
  'Inspect task requirements', 'Define acceptance criteria', 'Implement the change', 'Review test results', 'Record review decisions',
];

export function TaskNavigationExample() {
  const [tasks, setTasks] = useState(initialTasks);
  const [project, setProject] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialTasks[1].id);
  const [announcement, setAnnouncement] = useState('');
  const search = query.toLowerCase();
  const filtered = tasks.filter(task => (project === 'all' || task.project === project) && `${task.title} ${task.id}`.toLowerCase().includes(search));
  const selected = filtered.find(task => task.id === selectedId) ?? filtered[0];
  const completed = selected?.checks.filter(Boolean).length ?? 0;

  function showAll() {
    setProject('all');
    setQuery('');
  }

  function createTask() {
    const next = tasks.length + 1;
    const task: Task = {
      id: `TASK-${next}`,
      title: `New task ${next}`,
      project: project === 'all' ? 'component-library' : project,
      checks: [false, false, false],
    };
    setTasks(previous => [task, ...previous]);
    setSelectedId(task.id);
    setQuery('');
    setAnnouncement(`${task.title} added.`);
  }

  function updateCheck(id: string, index: number, checked: boolean) {
    setTasks(previous => previous.map(task => task.id === id
      ? { ...task, checks: task.checks.map((value, position) => position === index ? checked : value) }
      : task));
  }

  return (
    <Card className="sidebar-example">
      <Navbar size="lg" width="full" surface="evergreen" aria-label="Task example pages"
        brand={<a href="#workspace"><BrandMark />Sample workspace</a>}>
        <NavbarItem href="#task-board">Task board</NavbarItem>
        <NavbarItem href="#agent-monitor">Agent monitor</NavbarItem>
      </Navbar>
      <WorkspaceLayout>
        <Sidebar variant="flush" className="sidebar-example-sidebar" aria-label="Workspace tasks" contentLabel="Main tasks"
          header={
            <Flex direction="column" gap={3}>
              <Button variant="primary" className="sidebar-example-create-task" icon={Plus} onClick={createTask}>New main task</Button>
              <Select label="Workspace project" className="sidebar-example-project-filter" value={project}
                onChange={event => setProject(event.currentTarget.value)}>
                <option value="all">All projects</option>
                {projects.map(name => <option key={name} value={name}>{name}</option>)}
              </Select>
              <Button variant="ghost" className="sidebar-example-all-tasks" icon={LayoutDashboard}
                aria-pressed={project === 'all' && query === ''} onClick={showAll}>
                All tasks <span className="sidebar-example-all-tasks-count">{tasks.length}</span>
              </Button>
              <Flex align="center" justify="space-between" wrap gap={2}>
                <Text size="heading-3" className="sidebar-example-task-heading">Main tasks</Text>
                <Badge>{filtered.length}</Badge>
              </Flex>
              <TextField label="Find a task" type="search" icon={Search} name="taskSearch" value={query}
                onChange={event => setQuery(event.currentTarget.value)} autoComplete="off" spellCheck={false} />
            </Flex>
          }
          footer={<Text size="small">Select a task to inspect it. Update checks to track completion.</Text>}>
          {filtered.length > 0 ? (
            <Flex direction="column" gap={2} className="sidebar-example-list" role="group" aria-label="Select a main task">
              {filtered.map(task => {
                const done = task.checks.filter(Boolean).length;
                const complete = done === task.checks.length;
                const active = selected?.id === task.id;
                return (
                  <Button key={task.id} variant="ghost" className="sidebar-example-task-choice"
                    aria-pressed={active} onClick={() => setSelectedId(task.id)}>
                    <span className="sidebar-example-choice">
                      <span className="sidebar-example-choice-meta">
                        <code>{task.id}</code>
                        <Badge variant="ghost" tone={complete ? 'success' : 'info'} dot>{complete ? 'Complete' : 'Active'}</Badge>
                      </span>
                      <span className="sidebar-example-task-title">{task.title}</span>
                      <span className="sidebar-example-choice-meta">
                        <Text size="small">{task.project}</Text>
                        <Text size="small">{done}/{task.checks.length}</Text>
                      </span>
                      <Progress value={done} max={task.checks.length} label={`${task.id} checklist progress`} />
                    </span>
                  </Button>
                );
              })}
            </Flex>
          ) : (
            <EmptyState icon={Search} title="No matching tasks" description="Try another project or task name."
              action={<Button size="sm" variant="ghost" onClick={showAll}>Show all tasks</Button>} />
          )}
        </Sidebar>
        <WorkspaceContent as="section" width="full" className="sidebar-example-inspector" aria-label="Selected task">
          {selected ? (
            <Flex direction="column" gap={4}>
              <Flex align="center" wrap gap={2}>
                <Badge>{selected.project}</Badge>
                <Badge variant="ghost" tone={completed === selected.checks.length ? 'success' : 'info'} dot>
                  {completed === selected.checks.length ? 'Complete' : 'In progress'}
                </Badge>
              </Flex>
              <Text size="heading-3">{selected.title}</Text>
              <Fieldset legend="Checklist">
                <Flex direction="column" gap={3}>
                  {selected.checks.map((checked, index) => (
                    <Checkbox key={checkLabels[index]} label={checkLabels[index]} checked={checked}
                      onChange={event => updateCheck(selected.id, index, event.currentTarget.checked)} />
                  ))}
                  <Progress value={completed} max={selected.checks.length} label="Task checks complete"
                    valueText={`${completed} of ${selected.checks.length} complete`} />
                </Flex>
              </Fieldset>
            </Flex>
          ) : <Text size="body">No tasks match the current filters.</Text>}
          <Text size="body" className="cr-sr-only" role="status">{announcement}</Text>
        </WorkspaceContent>
      </WorkspaceLayout>
    </Card>
  );
}
