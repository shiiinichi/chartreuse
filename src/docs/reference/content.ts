import type { ComponentReference } from './types';

export const contentReferences: ComponentReference[] = [
  {
    name: 'ActivityItem',
    slug: 'activity-item',
    summary: 'A task update article with a leading rule, wrapping metadata, and optional changed-field details.',
    importCode: "import { ActivityItem, Badge, Text } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<ActivityItem
  identifier="TASK-001.6"
  title="Expose the requested team in directory search"
  metadata={<>
    <Text bold>Added comment</Text>
    <Badge>Agent</Badge>
    <time dateTime="2026-11-17T08:50:05+08:00">Nov 17, 2026, 8:50 AM</time>
  </>}
  footer="Changed: Comments"
>
  <Text size="body">Recorded completion evidence and the live inspector session.</Text>
</ActivityItem>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'The update content, normally one or more paragraphs.' },
      { name: 'title', type: 'ReactNode', description: 'Optional task or entry heading. Renders as an h3 and names the article unless an accessible label is supplied.' },
      { name: 'identifier', type: 'ReactNode', description: 'Optional task identifier displayed beside the title, wrapping above it in narrow spaces.' },
      { name: 'metadata', type: 'ReactNode', description: 'Action, author badge, time, or other concise context in a wrapping row beneath the title.' },
      { name: 'footer', type: 'ReactNode', description: 'Optional supporting details after the update, such as changed fields.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer article.' },
      { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native ref to the outer article.' },
    ],
    nativeElement: 'article',
    nativeProps: 'Inherits native article attributes, events, style, and ref, excluding the native title attribute and children. title is the visible entry heading. aria-label or aria-labelledby can override the generated article name.',
    notes: [
      'Use ActivityItem for authored updates or audit entries. Use Blockquote when the content is a quotation.',
      'Metadata rows wrap to the available width. Keep the action and author visible, and use a native time element with an application-supplied dateTime value.',
      'The optional title is an h3; place the item under a section heading. If you omit title, use aria-label when the article needs its own accessible name.',
      'The entry is display content. Supply native links or buttons in its slots when an action is needed; it does not become a large clickable surface.',
      'For a feed, place entries in an ordered or unordered list and keep chronological order in the DOM. Announce new updates through the application’s live region only when needed.',
    ],
  },
  {
    name: 'Blockquote',
    slug: 'blockquote',
    summary: 'A native blockquote in a figure, with a leading rule, optional background, and attribution.',
    importCode: "import { Blockquote, Text } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Blockquote attribution={<>Sam Lee · <cite>API review</cite></>}>
  <Text size="body">Record the API change and its affected callers so the next reviewer can verify the migration.</Text>
</Blockquote>

// A neutral filled surface, or a colored tone for more emphasis.
<Blockquote variant="filled" tone="success"
  attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}>
  <Text size="body">The review is complete. All three specialist calls returned their findings.</Text>
</Blockquote>

// When the source is published, provide its URL separately.
<Blockquote cite="https://example.com/review"
  attribution={<a href="https://example.com/review">Read the review</a>}>
  <Text size="body">The implementation is ready for API and keyboard review.</Text>
</Blockquote>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Quoted content inside a native blockquote. Wrap paragraphs in p elements.' },
      { name: 'cite', type: 'string', description: 'Optional source URL placed on the blockquote’s native cite attribute. It is not a visible link.' },
      { name: 'attribution', type: 'ReactNode', description: 'Optional author or source credit, rendered in a figcaption outside the quotation.' },
      { name: 'variant', type: "'plain' | 'filled'", defaultValue: 'plain', description: 'Plain shows a leading rule. Filled adds a background, a stronger rule, and padding around the quotation and attribution.' },
      { name: 'tone', type: "'neutral' | 'success' | 'info' | 'warning' | 'danger'", defaultValue: 'neutral', description: 'Sets the rule color and, with the filled variant, its background. Neutral filled uses the subtle surface and accent rule. The text retains the shared foreground color.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer figure, including its leading rule.' },
      { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native ref to the outer figure.' },
    ],
    nativeElement: 'figure containing blockquote and optional figcaption',
    nativeProps: 'Inherits native figure attributes, events, style, and ref. cite is applied to the inner blockquote; attribution becomes the figure caption.',
    notes: [
      'Use Blockquote for text quoted from another person or source. Use ActivityItem for task updates and ordinary application content with a leading rule.',
      'Use variant="filled" for a padded quotation with a background. Choose a tone for its visual emphasis; tone does not add alert or live-region behavior.',
      'Attribution stays outside the quoted text, so it is not presented as part of the quotation.',
      'Use the cite element for the title of a work. Render an author’s name as ordinary text.',
      'A cite URL is machine-readable. Add a visible link in attribution when people should be able to visit the source.',
      'The component uses shared 13px body type and spacing tokens. Text, attribution, and long links wrap within the available component width.',
    ],
  },
  {
    name: 'List',
    slug: 'list',
    summary: 'A semantic bulleted or numbered list with optional icons, descriptions, trailing content, and dividers, or a list of Tree-style rows that can be links, buttons, and a single selection.',
    importCode: "import { CheckCircle2, CircleAlert } from 'lucide-react';\nimport { Badge, Flex, List, Text, type ListItem } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const checks: ListItem[] = [
  { id: 'types', title: 'Type check', description: 'No errors in 214 files.',
    icon: CheckCircle2, tone: 'success', trailing: <Badge tone="success">Passed</Badge> },
  { id: 'tests', title: 'Unit tests', description: 'Two tests need updated snapshots.',
    icon: CircleAlert, tone: 'warning', trailing: <Badge tone="warning">2 failing</Badge> },
];

<List aria-label="Release checks" items={checks} dividers />

// Plain bullets, or numbers with ordered.
<List items={[
  { id: 'scope', title: 'Confirm the release scope' },
  { id: 'notes', title: 'Draft the release notes' },
]} ordered />

// Selectable Tree-style rows with free content. Keep selectedId in state.
<List aria-label="Run history" variant="outline" maxWidth={480}
  selectedId="run-12" onSelectionChange={id => console.log('select', id)}
  items={[{ id: 'run-12', content: <Flex direction="column" gap={2}>
    <Flex direction="row" justify="space-between" align="start" gap={3}>
      <Text bold>Refactor the board columns</Text><Badge tone="info">Running</Badge>
    </Flex>
    <Flex direction="row" justify="space-between" gap={3}><span>6 files</span><time>2:14 PM</time></Flex>
  </Flex> }]} />`,
    props: [
      { name: 'items', type: 'readonly ListItem[]', required: true, description: 'Items in their rendered order.' },
      { name: 'items[].id', type: 'string', required: true, description: 'Unique stable identity used as the item’s React key.' },
      { name: 'items[].title', type: 'ReactNode', description: 'Primary item text or caller-owned content, such as a link. Optional when content is set.' },
      { name: 'items[].content', type: 'ReactNode', description: 'Free item content that replaces the marker, icon, title, description, and trailing slots. It lays out as a plain block with min-inline-size: 0, so arrange anything inside, such as a Flex with a status pinned top right. Keep it free of links and buttons when the item is interactive.' },
      { name: 'items[].label', type: 'string', description: 'Accessible name for an interactive item. Defaults to the text of content, or of title (with description as its description).' },
      { name: 'items[].selected', type: 'boolean', description: 'Marks the item as the current one: aria-current="true" on its link or button, and the selected surface in row variants. Overrides selectedId for this item.' },
      { name: 'items[].minWidth / maxWidth / minHeight / maxHeight', type: 'number | string', description: 'Inline min-inline-size, max-inline-size, min-block-size, and max-block-size on the item. Numbers are pixels; strings are any CSS length. An item taller than maxHeight is clipped (overflow: clip).' },
      { name: 'items[].description', type: 'ReactNode', description: 'Secondary muted text below the title. A nested List can go here.' },
      { name: 'items[].icon', type: 'IconSource', description: 'Decorative leading icon that replaces the bullet or number for this item: Lucide, React SVG component, or SVG JSX.' },
      { name: 'items[].leading', type: 'ReactNode', description: 'Decorative leading content, such as an Avatar. It replaces the icon and marker, is hidden from assistive technology, and keeps its own size.' },
      { name: 'items[].tone', type: "'neutral' | 'success' | 'info' | 'warning' | 'danger'", defaultValue: "'neutral'", description: 'Colors the bullet, number, or icon from the shared semantic palette. Text keeps its own colors.' },
      { name: 'items[].trailing', type: 'ReactNode', description: 'End-aligned content, such as a Badge, a count, a time, or a small action. Keep it non-interactive when the item has href or onClick.' },
      { name: 'items[].href', type: 'string', description: 'Makes the item a native link to this URL. The whole item is clickable and shows a hover surface. In the default variant the title is the link; in row variants, or with content, an empty link stretched over the item is named by its text.' },
      { name: 'items[].onClick', type: '() => void', description: 'Makes the item a native button that runs this callback, with the same full-item hit area as href. With href, it runs on the link click.' },
      { name: 'ordered', type: 'boolean', defaultValue: 'false', description: 'Renders a numbered ol instead of a bulleted ul.' },
      { name: 'marker', type: "'auto' | 'none'", defaultValue: "'auto'", description: 'Auto shows bullets for unordered lists and numbers for ordered lists. None hides them; item icons still render.' },
      { name: 'start', type: 'number', description: 'First number of an ordered list, applied to the native start attribute and the visible numbers.' },
      { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Text size and spacing, matching the sm and md sizes of Button, TextField, Tabs, and SegmentedControl: 13px titles for md and 12px for sm. Descriptions are 12px in both sizes.' },
      { name: 'dividers', type: 'boolean', defaultValue: 'false', description: 'Draws a rule between items and adds block padding to each item. Ignored by the outline and plain variants.' },
      { name: 'variant', type: "'default' | 'outline' | 'plain'", defaultValue: "'default'", description: 'outline draws each item as a Tree outline row (card surface, border, 16px padding, 12px when the list is under 400px wide) and plain as a Tree plain row. Both share Tree’s hover and selected surface, and default marker to none.' },
      { name: 'selectedId', type: 'string | null', description: 'The selected item (controlled). Pass null for none.' },
      { name: 'defaultSelectedId', type: 'string | null', defaultValue: 'null', description: 'The initially selected item when selectedId is not set.' },
      { name: 'onSelectionChange', type: '(id: string, item: ListItem) => void', description: 'Makes every item without href a native button that selects it. Called only when the selection changes.' },
      { name: 'minWidth / maxWidth / minHeight / maxHeight', type: 'number | string', description: 'Inline min-inline-size, max-inline-size, min-block-size, and max-block-size on the list. Numbers are pixels. A list taller than maxHeight scrolls vertically.' },
      { name: 'aria-label', type: 'string', description: 'Optional accessible name, for a list without a visible heading.' },
      { name: 'className', type: 'string', description: 'Additional classes on the list element.' },
      { name: 'ref', type: 'Ref<HTMLUListElement | HTMLOListElement>', description: 'Native ref to the ul, or to the ol when ordered.' },
    ],
    nativeElement: 'ul, or ol when ordered, with li items',
    nativeProps: 'Inherits global HTML attributes, events, style, and ref except children and role. Items own list content; role stays list because the custom markers remove the native list style.',
    notes: [
      'Use List for a short set of related items read in sequence: bullets, numbered instructions, a checklist summary, or a compact set of records with a status.',
      'Use Table when items have several comparable columns, Tree for nested items people expand and select, and Timeline or Steps for events over time or a process.',
      'Use ordered when the order matters. The numbers are drawn with CSS counters that follow start, while screen readers announce position from the native ol.',
      'An item icon or leading content replaces that item’s bullet or number and is decorative. Put meaning, such as a person’s name, in the title or description, not only in the icon, avatar, or tone.',
      'Give an item href or onClick to make the whole item a link or button, or onSelectionChange to make every item a button that selects it. Each item is its own Tab stop with native Enter and Space or link behavior; there is no arrow-key navigation, unlike Tree.',
      'The selected item carries aria-current="true" on its link or button: the current item among a set of actions or links, not a pressed toggle. Use Tree when people need arrow-key navigation through a hierarchy.',
      'An interactive item stretches its link or button over the item. Its description, leading, trailing content, and content must not contain other links or buttons.',
      'Like every Chartreuse component, List draws no focus indicator; supply your own for .cr-list-row-action:focus-visible and .cr-list-link:focus-visible.',
      'variant="outline" and "plain" share their row surface, padding, hover, and selection with Tree through one stylesheet, so the two stay identical. The list is a size container and resolves the 12px narrow padding against its own width, also inside Flex.',
      'Size props are inline styles. A row taller than its maxHeight is clipped, so clamp long text inside it; a list taller than its maxHeight scrolls.',
      'MarkdownRenderer styles lists inside rendered Markdown. Use List for lists the application builds from data.',
      'Titles and descriptions wrap within the available width; trailing content keeps its size and takes at most half the row.',
    ],
  },
];
