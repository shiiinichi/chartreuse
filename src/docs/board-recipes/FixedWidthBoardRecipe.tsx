import { Plus } from 'lucide-react';
import { IconButton, Swimlane, SwimlaneGroup, TaskCard, type CategoryColor } from '../../system';

type Stage = { id: string; title: string; accent: CategoryColor };

const stages: Stage[] = [
  { id: 'backlog', title: 'Backlog', accent: 'cat-8' },
  { id: 'todo', title: 'To do', accent: 'cat-2' },
  { id: 'doing', title: 'In progress', accent: 'cat-3' },
  { id: 'review', title: 'In review', accent: 'cat-1' },
  { id: 'qa', title: 'QA', accent: 'cat-4' },
  { id: 'ready', title: 'Ready to ship', accent: 'cat-5' },
  { id: 'done', title: 'Done', accent: 'cat-6' },
];

const tasks = [
  { id: 'TASK-301', stage: 'backlog', title: 'Collect board feedback' },
  { id: 'TASK-302', stage: 'todo', title: 'Audit the lane headers', priority: 'high' as const },
  { id: 'TASK-303', stage: 'doing', title: 'Pin lane widths on large boards', completed: 2, total: 4 },
  { id: 'TASK-304', stage: 'review', title: 'Check horizontal scrolling' },
  { id: 'TASK-305', stage: 'ready', title: 'Publish the board recipe' },
  { id: 'TASK-306', stage: 'done', title: 'Ship the category palette' },
];

/** Seven stages at a fixed 240px: every header keeps its full title, and the row scrolls instead of squeezing lanes. */
export function FixedWidthBoardRecipe() {
  return <SwimlaneGroup label="Fixed-width board" variant="separate" laneWidth={256}>
    {stages.map(stage => {
      const laneTasks = tasks.filter(task => task.stage === stage.id);
      return <Swimlane key={stage.id} title={stage.title} count={laneTasks.length} accent={stage.accent}
        headerStyle="dot" defaultCollapsed={stage.id === 'done'} itemLabel={{ one: 'task', other: 'tasks' }}
        action={<IconButton icon={Plus} size="sm" label={`Add a task to ${stage.title}`} />}
        emptyContent="No tasks">
        {laneTasks.map(({ id, stage: _stage, ...task }) => <TaskCard key={id} taskId={id} density="compact" hideStatus {...task} />)}
      </Swimlane>;
    })}
  </SwimlaneGroup>;
}
