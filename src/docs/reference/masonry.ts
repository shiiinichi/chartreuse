import type { ComponentReference } from './types';

const containerNotes = [
  'Masonry packs each item into the shortest available column group. It suits cards, images, and example galleries with different content heights. Keep Grid for aligned input groups.',
  'The component keeps the original DOM order and does not move children between column wrappers. Keyboard navigation follows that source order; it does not add an ARIA grid role or grid keyboard behavior.',
  'A full-span item starts below all preceding columns. Later items continue below it, creating a full-width boundary between groups of cards.',
  'Responsive recipes use the Masonry container width, not the viewport: base (0px), sm (480px), md (768px), lg (1024px), and xl (1280px). Omitted tiers inherit the last supplied value upward.',
  'Content and container measurements update the packing after changes such as expanding a card, loading an image, or switching an example between Preview and Code. Stable children retain their component state and native focus.',
  'Before client measurement, content remains in the CSS fallback layout. Packed placement requires ResizeObserver and a positive measured container width; it does not require native CSS masonry support.',
  'Direct HTML element boxes are packed. Wrap raw text or a bare SVG in MasonryItem to give it a measurable HTML box.',
];

export const masonryReferences: ComponentReference[] = [
  {
    name: 'Masonry', slug: 'masonry',
    summary: 'A measured, container-responsive layout that places each item in the shortest available column group.',
    importCode: "import { Masonry, MasonryItem, Card } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Masonry minColumnWidth={240} maxColumns={3} gap={4}>
  <Card>Implementation notes</Card>
  <Card>A longer implementation note that wraps onto more lines.</Card>
  <Card>Validation results</Card>
  <MasonryItem span="full"><Card>Implementation decision across all columns</Card></MasonryItem>
</Masonry>

// Or choose exact column counts using the container tiers.
<Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
  <Card>First note</Card><Card>Second note</Card><Card>Third note</Card>
</Masonry>`,
    nativeElement: 'div container with an inner layout surface',
    nativeProps: 'Inherits native div attributes, events, className, style, and ref. Native props and ref target the outer container. Children keep their native content semantics.',
    props: [
      { name: 'children', type: 'ReactNode', description: 'HTML element boxes to pack. Ordinary direct elements occupy one column; use MasonryItem for spans or to wrap raw text and SVG. MasonrySpacer reserves empty space.' },
      { name: 'columns', type: 'MasonryResponsive<number>', description: 'Optional exact column recipe. Positive integer counts normalize to 1–24; omitted columns use the automatic minimum-width layout.' },
      { name: 'minColumnWidth', type: 'number | string', defaultValue: '240', description: 'Minimum width for automatic columns. Numbers are pixels; strings accept a CSS length. The layout still fits a container narrower than the minimum.' },
      { name: 'maxColumns', type: 'number', defaultValue: '24', description: 'Maximum automatic column count, normalized to 1–24.' },
      { name: 'gap', type: 'MasonryResponsive<MasonryGap>', defaultValue: '4', description: 'Shared spacing-token step for both axes: 4 means space-4, or 16px.' },
      { name: 'rowGap', type: 'MasonryResponsive<MasonryGap>', defaultValue: 'gap', description: 'Optional independent vertical gap recipe.' },
      { name: 'columnGap', type: 'MasonryResponsive<MasonryGap>', defaultValue: 'gap', description: 'Optional independent horizontal gap recipe.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer Masonry container.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the outer container.' },
    ],
    notes: [
      ...containerNotes,
      'Use minColumnWidth and maxColumns for automatic columns, or columns for an explicit responsive recipe. Normal item heights come from their content.',
      'Gap steps are 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, and 16, using the same shared spacing tokens as Grid. Axis-specific gap recipes are independent when supplied.',
      'Use MasonrySpacer for a deliberate empty slot. Ordinary gap is the consistent distance between adjacent items.',
    ],
  },
  {
    name: 'MasonryItem', slug: 'masonry-item',
    summary: 'An optional span wrapper for content inside Masonry, including full-width items.',
    importCode: "import { Masonry, MasonryItem, Card } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
  <MasonryItem span={{ base: 1, sm: 2 }}>
    <Card>Implementation notes with a responsive span</Card>
  </MasonryItem>
  <MasonryItem><Card>A one-column note</Card></MasonryItem>
  <MasonryItem span="full"><Card>Section boundary across every column</Card></MasonryItem>
</Masonry>`,
    nativeElement: 'div item wrapper',
    nativeProps: 'Inherits native div attributes, events, className, style, and ref. The wrapper adds layout placement; it does not add a role or interaction.',
    props: [
      { name: 'children', type: 'ReactNode', description: 'Native or component content whose natural height determines the item height.' },
      { name: 'span', type: "MasonryResponsive<MasonrySpan>", defaultValue: '1', description: 'Adjacent columns to occupy. Numeric spans normalize to 1–24 and clamp to the active count. Full occupies every column.' },
      { name: 'className', type: 'string', description: 'Additional classes on the native item wrapper.' },
      { name: 'style', type: 'CSSProperties', description: 'Native item styles. Configure placement with span; Masonry owns its measured position and width.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the item wrapper.' },
    ],
    notes: [
      'Use MasonryItem directly inside Masonry for a spanning item. An ordinary child already occupies one column and does not need a wrapper.',
      'MasonryItem defaults to one column. This differs from GridItem’s full-row default.',
      'Spans use the parent Masonry container tiers and inherit upward. A span larger than the current column count clamps to that count.',
      'A full-span item synchronizes the column bottoms before later items continue. Its height still comes from its content.',
      'Keep cards, quotations, links, and other native semantics inside the wrapper. The item does not convert its content into a grid widget.',
      'Changing a span changes layout placement without reparenting or reordering the child content.',
    ],
  },
  {
    name: 'MasonrySpacer', slug: 'masonry-spacer',
    summary: 'An empty decorative packing item that reserves height and columns in Masonry.',
    importCode: "import { Masonry, MasonrySpacer, Card } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
  <Card>Implementation notes</Card>
  <MasonrySpacer height={160} visible={{ base: false, sm: true }} />
  <Card>A longer note</Card>
  <Card>Validation results</Card>
</Masonry>

// Reserve several columns, or a full-width gap.
<MasonrySpacer span={2} height="8rem" />
<MasonrySpacer span="full" height={64} />`,
    nativeElement: 'empty div[aria-hidden="true"][inert] using MasonryItem placement',
    nativeProps: 'Accepts the listed layout properties plus native id, className, style, and a ref to the empty div. Children, event handlers, roles, and tabindex are not exposed or forwarded.',
    props: [
      { name: 'span', type: "MasonryResponsive<MasonrySpan>", defaultValue: '1', description: 'Columns reserved by the empty item, using the same clamping and container tiers as MasonryItem.' },
      { name: 'height', type: 'MasonryResponsive<number | string>', defaultValue: '64', description: 'Reserved block size at each container tier. Numbers are pixels; strings accept a CSS length such as 8rem.' },
      { name: 'visible', type: 'MasonryResponsive<boolean>', defaultValue: 'true', description: 'Whether the spacer participates in layout. False removes it from packing and avoids an empty item gap.' },
      { name: 'id', type: 'string', description: 'Optional native identifier on the empty item.' },
      { name: 'className', type: 'string', description: 'Additional classes on the empty item. The component supplies no visible decoration.' },
      { name: 'style', type: 'CSSProperties', description: 'Native styles, including optional illustration styling for documentation. The component owns its generated layout recipes.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the empty decorative item.' },
    ],
    notes: [
      'Use MasonrySpacer only when the space is intentional. Use Masonry gap for normal consistent spacing between items.',
      'The spacer is a real packing item. Its height and span reserve space even though it has no visible content, border, or background.',
      'The empty item is aria-hidden and inert. It does not receive keyboard focus, labels, or child content.',
      'Use visible={{ base: false, sm: true }} when a reserved gap should disappear from narrow one-column layouts. Visibility, height, and span follow the parent Masonry container tiers.',
      'Outline and tint in the examples are illustration styling only. Each outlined example has a switch that shows the same real spacer without that decoration.',
      'A full-span spacer starts below all preceding columns and reserves a full-width gap before the following items.',
    ],
  },
];
