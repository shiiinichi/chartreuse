import type { ComponentReference } from './types';

export const swimlaneReferences: ComponentReference[] = [{
  name: 'Swimlane', slug: 'swimlane',
  summary: 'A status column with a labeled header, item count, optional action, and card content.',
  importCode: "import { Swimlane, Button, IconButton, TaskCard } from '@chartreuse/ui';\nimport { Plus } from 'lucide-react';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `<Swimlane\n  title="In review"\n  count={reviewCards.length}\n  tone="warning"\n  description="Tasks awaiting review"\n  action={<IconButton icon={Plus} label="Add a review task"\n    onClick={addReviewTask} />}\n  emptyContent={<Button variant="ghost" onClick={addReviewTask}>\n    Add a task\n  </Button>}\n>\n  {reviewCards.map(card => <TaskCard key={card.taskId} {...card} />)}\n</Swimlane>`,
  nativeElement: 'section with a labeled header and content body',
  nativeProps: 'Inherits native section attributes, events, style, className, and ref, except title and children. Native props/ref target the section; aria-label/aria-labelledby overrides are respected.',
  props: [
    { name: 'title', type: 'string', required: true, description: 'Status label shown in the shared Badge and used to name the section.' },
    { name: 'count', type: 'number', required: true, description: 'Caller-provided item count, placed immediately beside the tag. Display normalizes nonfinite/negative values to zero and floors fractions.' },
    { name: 'tone', type: 'Tone', defaultValue: "'neutral'", description: 'Shared neutral/info/warning/success/danger tone for the status tag, top rule, and surface tint.' },
    { name: 'description', type: 'ReactNode', description: 'Optional supporting context below the header row, associated through aria-describedby.' },
    { name: 'action', type: 'ReactNode', description: 'A compact header action, aligned on the right. Supply its accessible label and behavior.' },
    { name: 'children', type: 'ReactNode', description: 'Cards or other content. Their data and state remain with the consumer.' },
    { name: 'emptyContent', type: 'ReactNode', defaultValue: "'No items in this lane.'", description: 'Content for the dashed empty surface when there are no direct child nodes; can include a real add action.' },
    { name: 'className', type: 'string', description: 'Additional classes on the section surface.' },
    { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native section ref.' },
  ],
  notes: [
    'The count appears immediately after the status badge. Use a compact header action, such as IconButton, to leave room for the status label and count.',
    'The status badge includes text and a decorative dot. Its tone also colors the top rule and column surface.',
    'The board example uses the same header padding, card gaps, and body insets across all four status columns.',
    'Supply the count for the current view. Count is display metadata; the component does not filter cards or change their state.',
    'Empty content is independent of the count and comes from the absence of direct child nodes. Loading content can remain visible while a displayed count is zero.',
    'The host supplies task creation, filtering, and status changes. Swimlane does not implement drag-and-drop or board state.',
    'The default surface has a 360px minimum block size; native style/className can adapt the allocation. The parent manages the overall board layout and horizontal scrolling.',
  ],
}];
