import type { ComponentReference } from './types';

export const chipReferences: ComponentReference[] = [
  {
    name: 'ToggleChip', slug: 'toggle-chip',
    summary: 'A compact native button with an optional colored dot, label, and count, for filters and quick actions.',
    importCode: "import { useState } from 'react';\nimport { ChipGroup, ToggleChip } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `export function StageFilter() {
  const [active, setActive] = useState<string[]>(['review']);
  const toggle = (id: string) => setActive(current =>
    current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <ChipGroup label="Filter by stage">
    <ToggleChip dot accent="cat-2" count={4} pressed={active.includes('todo')}
      onClick={() => toggle('todo')}>To do</ToggleChip>
    <ToggleChip dot accent="cat-4" count={2} pressed={active.includes('review')}
      onClick={() => toggle('review')}>In review</ToggleChip>
    <ToggleChip variant="dashed" addIcon>Add stage</ToggleChip>
  </ChipGroup>;
}`,
    nativeElement: 'button',
    nativeProps: "Extends ComponentPropsWithRef<'button'> except children. Native attributes, events, and ref go to the button; type defaults to button and className is merged.",
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Visible label. It starts the accessible name; the count follows it.' },
      { name: 'pressed', type: 'boolean', description: 'Sets aria-pressed so the chip is a toggle, and draws the pressed surface. Leave undefined for a plain action chip.' },
      { name: 'dot', type: 'boolean', defaultValue: 'false', description: 'Shows an 8px dot before the label in the tone or accent color.' },
      { name: 'dotStyle', type: "'solid' | 'outline'", defaultValue: "'solid'", description: 'solid fills the dot; outline draws a 1.5px ring, for example for a stage with no items.' },
      { name: 'tone', type: 'Tone', defaultValue: "'neutral'", description: 'Status color for the dot.' },
      { name: 'accent', type: 'CategoryColor', description: 'Categorical color (cat-1 … cat-8) for the dot. Overrides tone for color only.' },
      { name: 'count', type: 'number', description: 'A trailing tabular count. Zero renders the label at a lower weight in the muted color; nonfinite or negative values show 0.' },
      { name: 'variant', type: "'ghost' | 'outline' | 'dashed'", defaultValue: "'ghost'", description: 'ghost is transparent until hovered or pressed, outline adds a border, and dashed is for add actions.' },
      { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Height: sm 30px, md 32px. Both grow to 44px under a coarse pointer.' },
      { name: 'addIcon', type: 'boolean', defaultValue: 'false', description: 'Shows a trailing plus icon. Only the dashed variant draws it.' },
      { name: 'className', type: 'string', description: 'Additional classes on the button.' },
      { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Native button ref.' },
    ],
    notes: [
      'The pressed state uses a subtle surface, a border, and aria-pressed, so it never depends on color alone. The dot color identifies a category; the label names it.',
      'Group related chips in ChipGroup so assistive technology hears the group’s name.',
      'Use SegmentedControl for one choice from a set, and ToggleChip when any number of filters can be on at once.',
    ],
  },
  {
    name: 'ChipGroup', slug: 'chip-group',
    summary: 'A labeled, wrapping group for ToggleChips.',
    importCode: "import { ChipGroup, ToggleChip } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<ChipGroup label="Quick filters">
  <ToggleChip pressed={false}>Assigned to me</ToggleChip>
  <ToggleChip pressed>High priority</ToggleChip>
</ChipGroup>`,
    nativeElement: 'div with role="group"',
    nativeProps: "Extends ComponentPropsWithRef<'div'> except role. Native attributes, events, and ref go to the div; className is merged.",
    props: [
      { name: 'label', type: 'string', required: true, description: 'Accessible name of the group, applied as aria-label.' },
      { name: 'children', type: 'ReactNode', description: 'ToggleChip elements or other compact controls.' },
      { name: 'className', type: 'string', description: 'Additional classes on the group.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native div ref.' },
    ],
    notes: ['Chips wrap onto new rows with a 4px row gap and a 6px column gap. Each chip stays a separate Tab stop.'],
  },
  {
    name: 'SegmentedProgress', slug: 'segmented-progress',
    summary: 'A stacked bar of several values, announced as one image with a text alternative, with an optional legend.',
    importCode: "import { SegmentedProgress } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<SegmentedProgress label="Cards by stage" legend segments={[
  { id: 'todo', label: 'To do', value: 6, accent: 'cat-2' },
  { id: 'doing', label: 'In progress', value: 3, accent: 'cat-3' },
  { id: 'done', label: 'Done', value: 9, accent: 'cat-6' },
]} />`,
    nativeElement: 'div holding a role="img" track and an optional legend',
    nativeProps: "Extends ComponentPropsWithRef<'div'> except children. Native attributes, events, and ref go to the outer div; className is merged.",
    props: [
      { name: 'label', type: 'string', required: true, description: 'Names the bar. The image’s accessible name is the label followed by every segment and its value.' },
      { name: 'segments', type: 'readonly SegmentedProgressSegment[]', required: true, description: 'Segments in display order. Zero values take no space but stay in the name and legend.' },
      { name: 'segments[].id', type: 'string', required: true, description: 'Stable, unique segment identity.' },
      { name: 'segments[].label', type: 'string', required: true, description: 'Plain-text label used in the accessible name and the legend.' },
      { name: 'segments[].value', type: 'number', required: true, description: 'Segment value. Nonfinite and negative values count as 0.' },
      { name: 'segments[].tone', type: 'Tone', defaultValue: "'neutral'", description: 'Status color for the segment.' },
      { name: 'segments[].accent', type: 'CategoryColor', description: 'Categorical color for the segment. Overrides tone for color only.' },
      { name: 'max', type: 'number', description: 'Total the track represents. Defaults to the sum of the values; any unused space stays empty.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'lg'", description: 'Track height: sm 4px, md 6px, lg 8px. The same ProgressSize values as Progress.' },
      { name: 'legend', type: "boolean | 'interactive'", defaultValue: 'false', description: 'true renders a static legend list. interactive renders one ToggleChip per segment in a ChipGroup.' },
      { name: 'onSegmentSelect', type: '(id: string) => void', description: 'Called with the segment id when an interactive legend chip is activated.' },
      { name: 'selectedSegments', type: 'readonly string[]', description: 'Ids whose interactive legend chips are pressed. When omitted, legend chips have no pressed state.' },
      { name: 'children', type: 'ReactNode', description: 'Optional content between the track and the legend, such as a total.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer div.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native div ref.' },
    ],
    notes: [
      'The track is one image, so screen readers hear a single sentence instead of a run of unlabeled shapes. Show a legend whenever sighted users need the values too.',
      'Adjacent segments are separated by a 1px surface gap so neighboring colors stay distinguishable, and forced-colors mode draws each segment with a system color and border.',
      'Use Progress for a single value toward a goal.',
    ],
  },
];
