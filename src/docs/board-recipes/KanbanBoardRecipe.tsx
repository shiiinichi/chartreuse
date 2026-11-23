import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Button, ChipGroup, IconButton, SegmentedProgress, Swimlane, SwimlaneGroup, TaskCard, ToggleChip,
  type CategoryColor,
} from '../../system';

type Stage = { id: string; title: string; accent: CategoryColor };
type Task = { id: string; stage: string; title: string; priority?: 'low' | 'medium' | 'high'; completed?: number; total?: number; assignees?: string[] };

const stages: Stage[] = [
  { id: 'backlog', title: 'Backlog', accent: 'cat-8' },
  { id: 'todo', title: 'To do', accent: 'cat-2' },
  { id: 'doing', title: 'In progress', accent: 'cat-3' },
  { id: 'review', title: 'In review', accent: 'cat-1' },
  { id: 'qa', title: 'QA', accent: 'cat-4' },
  { id: 'ready', title: 'Ready to ship', accent: 'cat-5' },
  { id: 'done', title: 'Done', accent: 'cat-6' },
];

const initialTasks: Task[] = [
  { id: 'TASK-101', stage: 'backlog', title: 'Draft the onboarding checklist' },
  { id: 'TASK-102', stage: 'todo', title: 'Audit color contrast on the board', priority: 'high' },
  { id: 'TASK-103', stage: 'doing', title: 'Add collapsible lanes', completed: 3, total: 5, assignees: ['Alex Morgan'] },
  { id: 'TASK-104', stage: 'doing', title: 'Write the grouped table recipe', assignees: ['Sam Lee'] },
  { id: 'TASK-105', stage: 'review', title: 'Review the release notes', completed: 2, total: 2 },
  { id: 'TASK-106', stage: 'done', title: 'Ship the category palette' },
];

export function KanbanBoardRecipe() {
  const [tasks, setTasks] = useState(initialTasks);
  const [hidden, setHidden] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | undefined>();
  const [collapsed, setCollapsed] = useState<string[]>(['done']);
  const visibleStages = stages.filter(stage => !hidden.includes(stage.id));
  const toggle = (list: string[], id: string) => list.includes(id) ? list.filter(item => item !== id) : [...list, id];
  const addTask = (stage: Stage) => setTasks(current => [...current,
    { id: `TASK-${110 + current.length}`, stage: stage.id, title: `New task in ${stage.title}` }]);

  return <div style={{ display: 'grid', gap: 16 }}>
    <SegmentedProgress label="Tasks by stage" size="md" segments={stages.map(stage => ({
      id: stage.id, label: stage.title, accent: stage.accent, value: tasks.filter(task => task.stage === stage.id).length,
    }))} />
    <ChipGroup label="Show stages">
      {stages.map(stage => {
        const count = tasks.filter(task => task.stage === stage.id).length;
        return <ToggleChip key={stage.id} dot accent={stage.accent} dotStyle={count ? 'solid' : 'outline'} count={count}
          pressed={!hidden.includes(stage.id)} onClick={() => setHidden(current => toggle(current, stage.id))}>
          {stage.title}
        </ToggleChip>;
      })}
    </ChipGroup>
    <SwimlaneGroup label="Kanban board" variant="separate" laneWidth={256}>
      {visibleStages.map(stage => {
        const laneTasks = tasks.filter(task => task.stage === stage.id);
        return <Swimlane key={stage.id} title={stage.title} count={laneTasks.length} accent={stage.accent} headerStyle="dot"
          collapsed={collapsed.includes(stage.id)} onCollapsedChange={() => setCollapsed(current => toggle(current, stage.id))}
          itemLabel={{ one: 'task', other: 'tasks' }}
          action={<IconButton icon={Plus} size="sm" label={`Add a task to ${stage.title}`} onClick={() => addTask(stage)} />}
          emptyContent={<Button variant="ghost" icon={Plus} onClick={() => addTask(stage)}>Add a task</Button>}>
          {laneTasks.map(task => <TaskCard key={task.id} taskId={task.id} title={task.title} priority={task.priority}
            completed={task.completed} total={task.total} assignees={task.assignees} hideStatus
            completedState={stage.id === 'done'} selected={selected === task.id}
            onClick={() => setSelected(task.id)} />)}
        </Swimlane>;
      })}
    </SwimlaneGroup>
  </div>;
}
