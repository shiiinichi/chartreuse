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
  { id: 'TASK-201', stage: 'backlog', title: 'Collect board feedback', commentCount: 3 },
  { id: 'TASK-202', stage: 'todo', title: 'Document the compact density', priority: 'high' as const },
  { id: 'TASK-203', stage: 'doing', title: 'Align the collapsed rail actions', completed: 1, total: 4, assignees: ['Alex Morgan'] },
  { id: 'TASK-204', stage: 'review', title: 'Check forced-colors borders', attachmentCount: 2 },
  { id: 'TASK-205', stage: 'qa', title: 'Run the alignment tests', completed: 2, total: 3 },
  { id: 'TASK-206', stage: 'done', title: 'Publish the category tokens' },
];

export function CompactBoardRecipe() {
  return <SwimlaneGroup label="Compact board" laneWidth={256}>
    {stages.map(stage => {
      const laneTasks = tasks.filter(task => task.stage === stage.id);
      return <Swimlane key={stage.id} title={stage.title} count={laneTasks.length} accent={stage.accent}
        headerStyle="dot" variant="flush" density="compact" defaultCollapsed={stage.id === 'done'}
        itemLabel={{ one: 'task', other: 'tasks' }}
        action={<IconButton icon={Plus} size="sm" label={`Add a task to ${stage.title}`} />}
        emptyContent="No tasks">
        {laneTasks.map(({ id, stage: _stage, ...task }) => <TaskCard key={id} taskId={id} density="compact" hideStatus
          href={`#tasks/${id}`} {...task} />)}
      </Swimlane>;
    })}
  </SwimlaneGroup>;
}
