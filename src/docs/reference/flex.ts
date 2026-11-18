import type { ComponentReference } from './types';

export const flexReferences: ComponentReference[] = [{
  name: 'Flex', slug: 'flex',
  summary: 'A container-responsive flex layout with row or column direction, spacing-token gaps, alignment, and wrapping.',
  importCode: "import { Flex, Button } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `<Flex gap={3} align="center" wrap>
  <Button>Save changes</Button>
  <Button variant="secondary">Cancel</Button>
</Flex>

// Stack in a narrow container and share a row when space permits.
<Flex direction={{ base: 'column', sm: 'row' }}
  align={{ base: 'stretch', sm: 'center' }} justify="space-between" gap={4}>
  <p>The review is ready.</p>
  <Button>Open review</Button>
</Flex>`,
  nativeElement: 'div query container containing one div flex container',
  nativeProps: 'Inherits native div attributes, events, style, className, and ref, except the legacy align attribute. Native props/ref target the outer query container. Children stay direct items of the inner flex container; Flex adds no per-child wrappers.',
  props: [
    { name: 'children', type: 'ReactNode', description: 'Content laid out in its original DOM order, without a wrapper around each child.' },
    { name: 'direction', type: "GridResponsive<'row' | 'column'>", defaultValue: "'row'", description: 'Main-axis direction. A scalar applies at every tier; an object changes with this Flex container’s own width.' },
    { name: 'wrap', type: 'GridResponsive<boolean>', defaultValue: 'false', description: 'Allows content to continue onto additional flex lines. Enable for actions or other content that can exceed a row.' },
    { name: 'align', type: "GridResponsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>", defaultValue: "'stretch'", description: 'Cross-axis alignment of the children. Start/end follow the cross-axis edges, which change with direction.' },
    { name: 'justify', type: "GridResponsive<'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'>", defaultValue: "'start'", description: 'Distributes children along the main axis. Distributed spacing adds to the configured gap.' },
    { name: 'gap', type: 'GridResponsive<GridGap>', defaultValue: '3', description: 'Shared spacing-token step for both axes. 3 selects space-3 (12px), rather than 3px.' },
    { name: 'rowGap', type: 'GridResponsive<GridGap>', defaultValue: 'gap', description: 'Optional independent row-gap recipe. Provided recipes replace the row axis and inherit their last supplied value upward.' },
    { name: 'columnGap', type: 'GridResponsive<GridGap>', defaultValue: 'gap', description: 'Optional independent column-gap recipe, with the same inheritance behavior as rowGap.' },
    { name: 'className', type: 'string', description: 'Additional classes on the outer query container.' },
    { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the outer query container.' },
  ],
  notes: [
    'Use Flex for content rows and stacks, compact action groups, and alignment along one axis. Keep Grid for grouped inputs and Masonry for collections with irregular heights.',
    'Flex creates one inner flex container and does not wrap each child. The children keep their original DOM order and native semantics.',
    'Enable wrap when a row can grow beyond its available space. Flex does not clip overflow; child controls and text retain their own sizing requirements.',
    'Alignment follows the chosen axis: justify distributes along the row or column, while align controls the cross axis. Stretch only stretches children whose cross size is automatic. A height or min-height on the outer Flex allocates space to its inner layout for alignment and distribution.',
    'Container tiers match Grid: base (0px), sm (480px), md (768px), lg (1024px), and xl (1280px). Nested Flex containers respond to their own widths.',
    'Responsive objects inherit the last supplied value upward. An omitted base starts at that property’s default. Explicit rowGap/columnGap recipes are independent of later gap overrides.',
    'Gap steps are 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, and 16. They select the shared spacing tokens; justify with distributed spacing can create additional space.',
    'The component exposes row and column directions, preserving reading and keyboard order. Use native content semantics and avoid visually reordering interactive children.',
  ],
}];
