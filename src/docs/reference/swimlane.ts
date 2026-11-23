import type { ComponentReference } from './types';

export const swimlaneReferences: ComponentReference[] = [{
  name: 'Swimlane', slug: 'swimlane',
  summary: 'A status column with a labeled header, item count, optional action, and card content.',
  importCode: "import { useState } from 'react';\nimport { Swimlane, Button, IconButton, TaskCard } from '@chartreuse/ui';\nimport type { TaskCardProps } from '@chartreuse/ui';\nimport { Plus } from 'lucide-react';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `const [reviewCards, setReviewCards] = useState<TaskCardProps[]>([
  { taskId: 'TASK-024', title: 'Implement the workspace task board', status: 'review', priority: 'high' },
]);

function addReviewTask() {
  setReviewCards(cards => [...cards,
    { taskId: 'TASK-' + (101 + cards.length), title: 'Review the task summary', status: 'review' }]);
}

<Swimlane
  title="In review"
  count={reviewCards.length}
  tone="warning"
  description="Tasks awaiting review"
  action={<IconButton icon={Plus} label="Add a review task"
    onClick={addReviewTask} />}
  emptyContent={<Button variant="ghost" onClick={addReviewTask}>
    Add a task
  </Button>}
>
  {reviewCards.map(card => <TaskCard key={card.taskId} {...card} />)}
</Swimlane>`,
  nativeElement: 'section with a labeled header and content body',
  nativeProps: 'Inherits native section attributes, events, style, className, and ref, except title and children. Native props/ref target the section; aria-label/aria-labelledby overrides are respected.',
  props: [
    { name: 'title', type: 'string', required: true, description: 'Status label shown in the shared Badge and used to name the section.' },
    { name: 'count', type: 'number', required: true, description: 'Caller-provided item count, placed immediately beside the tag. Display normalizes nonfinite/negative values to zero and floors fractions.' },
    { name: 'tone', type: 'Tone', defaultValue: "'neutral'", description: 'Shared neutral/info/warning/success/danger tone for the status tag, top rule, and surface tint.' },
    { name: 'accent', type: 'CategoryColor', description: 'Categorical color (cat-1 … cat-8) for the tag, dot, top rule, and tint. Overrides tone for color only, so seven or more stages stay distinct without overriding --cr-swimlane-accent.' },
    { name: 'headerStyle', type: "'tag' | 'dot'", defaultValue: "'tag'", description: 'tag shows the status Badge. dot shows an 8px colored dot and a plain heading, with a pill count.' },
    { name: 'variant', type: "'card' | 'flush'", defaultValue: "'card'", description: 'flush drops the border, radius, background, and minimum height so the lane can sit inside a shared surface such as SwimlaneGroup.' },
    { name: 'density', type: "'default' | 'compact'", defaultValue: "'default'", description: 'compact tightens header and body padding and the card gap to 6px.' },
    { name: 'collapsible', type: 'boolean', defaultValue: 'true when a collapse prop is set', description: 'Adds a collapse button to the header. A collapsed lane becomes a 48px rail with a vertical title button that expands it.' },
    { name: 'collapsed', type: 'boolean', description: 'Controlled collapsed state.' },
    { name: 'defaultCollapsed', type: 'boolean', defaultValue: 'false', description: 'Initial collapsed state when uncontrolled.' },
    { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Called with the next state. Focus moves to the button that is shown after the change.' },
    { name: 'itemLabel', type: 'SwimlaneItemLabel', defaultValue: "{ one: 'item', other: 'items' }", description: 'Singular and plural nouns for the collapsed button’s name, “Expand {title}, {count} {noun}”.' },
    { name: 'description', type: 'ReactNode', description: 'Optional supporting context below the header row, associated through aria-describedby.' },
    { name: 'action', type: 'ReactNode', description: 'A compact header action, aligned on the right. Supply its accessible label and behavior.' },
    { name: 'children', type: 'ReactNode', description: 'Cards or other content. Their data and state remain with the consumer.' },
    { name: 'emptyContent', type: 'ReactNode', defaultValue: "'No items in this lane.'", description: 'Content for the dashed empty surface when there are no direct child nodes; can include a real add action.' },
    { name: 'className', type: 'string', description: 'Additional classes on the section surface.' },
    { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native section ref.' },
  ],
  notes: [
    'The title stays on one line. In a narrow lane it truncates with an ellipsis while the count, the action, and the collapse button keep their size and stay on the first row, so every header in a row has the same height. The full title remains the heading text and the section name; give many-stage boards a SwimlaneGroup laneWidth so titles are not cut.',
    'The count appears immediately after the status badge. Use a compact header action, such as IconButton, to leave room for the status label and count.',
    'The status badge includes text and a decorative dot. Its tone also colors the top rule and column surface.',
    'The board example uses the same header padding, card gaps, and body insets across all four status columns.',
    'Supply the count for the current view. Count is display metadata; the component does not filter cards or change their state.',
    'Empty content is independent of the count and comes from the absence of direct child nodes. Loading content can remain visible while a displayed count is zero.',
    'The host supplies task creation, filtering, and status changes. Swimlane does not implement drag-and-drop or board state.',
    'A collapsed lane keeps its action above the rail toggle, at the same top offset as the expanded header action. While collapsed, the lane still accepts drops: when your dragover handler calls preventDefault it shows a drop-target outline, and it does not expand on its own.',
    'Use accent with the cat-1 … cat-8 palette for boards with more stages than the five tones can tell apart. The title and count still name each lane.',
    'The default surface has a 360px minimum block size; native style/className can adapt the allocation. The parent manages the overall board layout and horizontal scrolling.',
  ],
}, {
  name: 'SwimlaneGroup', slug: 'swimlane-group',
  summary: 'A labeled, horizontally scrolling row of Swimlanes, either on one shared surface or as separate cards.',
  importCode: "import { Swimlane, SwimlaneGroup } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `<SwimlaneGroup label="Task board">
  <Swimlane title="Backlog" count={0} accent="cat-1" headerStyle="dot" variant="flush" density="compact" />
  <Swimlane title="In progress" count={0} accent="cat-3" headerStyle="dot" variant="flush" density="compact" />
  <Swimlane title="Done" count={0} accent="cat-6" headerStyle="dot" variant="flush" density="compact" defaultCollapsed />
</SwimlaneGroup>`,
  nativeElement: 'div with role="region" around a scrolling flex row',
  nativeProps: 'Inherits native div attributes, events, style, className, and ref, except role. Native props and ref target the outer region.',
  props: [
    { name: 'label', type: 'string', required: true, description: 'Accessible name of the board region.' },
    { name: 'variant', type: "'surface' | 'separate'", defaultValue: "'surface'", description: 'surface draws one bordered surface with 1px dividers between lanes and subtle headers. separate keeps each lane’s own card with a 12px gap.' },
    { name: 'laneWidth', type: 'number | string', description: 'Fixed width for every expanded lane: a number in px or any CSS length, such as 280 or \'18rem\'. Lanes then neither grow nor shrink, and the row scrolls horizontally when they do not fit. Collapsed lanes stay 48px. When omitted, lanes share the width with a 168px minimum.' },
    { name: 'children', type: 'ReactNode', description: 'Swimlane elements. Expanded lanes share the width with a 168px minimum, or take laneWidth when it is set; collapsed lanes take 48px.' },
    { name: 'className', type: 'string', description: 'Additional classes on the region.' },
    { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the region.' },
  ],
  notes: [
    'Use the surface variant with variant="flush" lanes for a compact board where every stage fits on one surface. Use separate for the classic card-per-column board.',
    'The row scrolls horizontally when the lanes need more room than the container. Seven expanded lanes need about 1180px; collapse finished stages to fit narrower screens.',
    'For boards with many stages, set laneWidth (for example 240 or \'18rem\'). Shared-width lanes shrink to 168px, where header actions keep their row and long titles truncate with an ellipsis; a fixed width keeps titles readable and lets the row scroll instead.',
    'The group only lays lanes out. Board state, filtering, and drag-and-drop stay with the host.',
  ],
}];
