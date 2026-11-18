import type { ComponentReference } from './types';

export const stepsReferences: ComponentReference[] = [{
  name: 'Steps',
  slug: 'steps',
  summary: 'An ordered process or guide with numbered markers, React content, and optional current-step state.',
  importCode: "import { Steps, type StepItem } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `const process: StepItem[] = [
  { id: 'prepare', title: 'Prepare', content: 'Inspect the component API and dependencies.' },
  { id: 'build', title: 'Build', content: 'Implement the task board with shared components.' },
  { id: 'review', title: 'Review', content: 'Review the implementation and validation results.' },
];

<Steps aria-label="Workspace process" items={process}
  orientation="horizontal" current="build"
/>

// Omit current and status for a static numbered guide.
// Each content slot can hold code blocks and other React content.`,
  props: [
    { name: 'items', type: 'readonly StepItem[]', required: true, description: 'Steps in their intended process order.' },
    { name: 'items[].id', type: 'string', required: true, description: 'Unique stable identity, also matched by current.' },
    { name: 'items[].title', type: 'ReactNode', required: true, description: 'Step title or caller-owned title content.' },
    { name: 'items[].content', type: 'ReactNode', description: 'Supporting React content, including code, fields, links, or actions.' },
    { name: 'items[].icon', type: 'IconSource', description: 'Decorative custom marker, overriding the number or automatic status icon.' },
    { name: 'items[].status', type: "'complete' | 'current' | 'upcoming' | 'error'", description: 'Explicit display state; overrides automatic visual state derived from current.' },
    { name: 'current', type: 'string', description: 'Current item ID. Unspecified item states derive as complete before it and upcoming after it.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Vertical guide or horizontal process that scrolls locally when needed.' },
    { name: 'markerVariant', type: "'outline' | 'solid'", defaultValue: "'outline'", description: 'Outlined or filled markers.' },
    { name: 'numbered', type: 'boolean', defaultValue: 'true', description: 'Shows zero-padded ordinals for ordinary markers; false uses a small dot.' },
    { name: 'aria-label', type: 'string', defaultValue: "'Steps'", description: 'Accessible name for the ordered process list.' },
    { name: 'tabIndex', type: 'number', defaultValue: '0 for horizontal; native default for vertical', description: 'Horizontal lists are focusable for keyboard scrolling unless overridden.' },
    { name: 'className', type: 'string', description: 'Additional classes on the ordered list.' },
    { name: 'ref', type: 'Ref<HTMLOListElement>', description: 'Native ordered-list ref.' },
  ],
  nativeElement: 'ol with li steps',
  nativeProps: 'Inherits ordered-list attributes, events, style, and ref except children, start, type, reversed, and role. Items own the list content and visual ordinal markers; role remains list.',
  notes: [
    'Use Steps for an ordered process or guide and Timeline for chronological events.',
    'Omit current and per-item status for a static 01/02/03 guide with connecting lines.',
    'When current matches an item ID, earlier unspecified items show complete and later ones show upcoming. Explicit item status takes precedence for its visual state.',
    'Use a single current step. The current item has aria-current="step"; completed, upcoming, and error meanings are also available to assistive technology.',
    'Custom icons override ordinal and status icons. Completed/error markers otherwise show a check or cross, and ordinary markers follow numbered.',
    'Items keep their DOM order. Horizontal steps scroll within their own boundary on narrow screens.',
    'Content determines each vertical item’s height, while the connector continues to the following marker.',
    'The component displays state; the caller owns validation, advancement, navigation, and workflow behavior.',
  ],
}];
