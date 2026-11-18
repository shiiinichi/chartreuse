import type { ComponentReference } from './types';

export const contentReferences: ComponentReference[] = [
  {
    name: 'ActivityItem',
    slug: 'activity-item',
    summary: 'A task update article with a leading rule, wrapping metadata, and optional changed-field details.',
    importCode: "import { ActivityItem, Badge } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<ActivityItem
  identifier="TASK-001.6"
  title="Expose the requested team in directory search"
  metadata={<>
    <strong>Added comment</strong>
    <Badge>Agent</Badge>
    <time dateTime="2026-11-17T08:50:05+08:00">Nov 17, 2026, 8:50 AM</time>
  </>}
  footer="Changed: Comments"
>
  <p>Recorded completion evidence and the live inspector session.</p>
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
    importCode: "import { Blockquote } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Blockquote attribution={<>Sam Lee · <cite>API review</cite></>}>
  <p>Record the API change and its affected callers so the next reviewer can verify the migration.</p>
</Blockquote>

// A neutral filled surface, or a colored tone for more emphasis.
<Blockquote variant="filled" tone="success"
  attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}>
  <p>The review is complete. All three specialist calls returned their findings.</p>
</Blockquote>

// When the source is published, provide its URL separately.
<Blockquote cite="https://example.com/review"
  attribution={<a href="https://example.com/review">Read the review</a>}>
  <p>The implementation is ready for API and keyboard review.</p>
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
];
