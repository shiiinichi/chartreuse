// Dependency-free decision table for components that are easy to confuse. The agent CLI prints it as
// the `choosing` guide and derives each component's `seeAlso` from it, so the two cannot drift apart.
// Every sentence restates a component's summary, notes, or source; review them when components change.

export interface ComponentChoiceOption {
  name: string;
  /** One sentence that starts with "Use <name>". */
  reason: string;
}

export interface ComponentChoice {
  label: string;
  options: readonly ComponentChoiceOption[];
}

export const componentChoices: readonly ComponentChoice[] = [
  {
    label: 'Dialog vs Drawer vs Sidebar vs Navbar',
    options: [
      { name: 'Dialog', reason: 'Use Dialog for a focused modal task or confirmation: native showModal keeps focus inside and Escape closes it. Focus returns to the opener when open turns false on a mounted Dialog, so keep it mounted rather than writing {open && <Dialog open />}.' },
      { name: 'Drawer', reason: 'Use Drawer for a side panel whose visibility you control, docked in the host layout or opened as a native modal with mode.' },
      { name: 'Sidebar', reason: 'Use Sidebar for a persistent aside in WorkspaceLayout; it does not fix itself to the viewport, collapse automatically, or open modally.' },
      { name: 'Navbar', reason: 'Use Navbar variant="workspace" with leftSidebar or rightSidebar for full-height collapsible sidebars that span the shell beside the bar and content and stay open until toggled.' },
    ],
  },
  {
    label: 'Select vs Autocomplete vs ButtonSelect vs SegmentedControl',
    options: [
      { name: 'Select', reason: 'Use Select for a labeled native select in a form; single choices use the shared option popup, and multiple or a size greater than one gives an inline native listbox.' },
      { name: 'Autocomplete', reason: 'Use Autocomplete when people type to search the options before selecting one value.' },
      { name: 'ButtonSelect', reason: 'Use ButtonSelect for a Button that opens an anchored option picker or custom popover content; it has no label, hint, or error props.' },
      { name: 'SegmentedControl', reason: 'Use SegmentedControl for a small set of mutually exclusive choices that stay visible as a native radio group.' },
    ],
  },
  {
    label: 'Button vs ButtonSelect vs SplitButton vs Menu',
    options: [
      { name: 'Button', reason: 'Use Button for a single action that runs when pressed, with no menu of alternatives.' },
      { name: 'ButtonSelect', reason: 'Use ButtonSelect when pressing the button only opens a menu of choices or custom popover content and runs nothing by itself.' },
      { name: 'SplitButton', reason: 'Use SplitButton when one action runs on press and a joined menu segment changes how it runs, such as the merge method or the agent and model to ask; both segments share the Button variant and size.' },
      { name: 'Menu', reason: 'Use Menu for a list of actions behind one trigger, such as Edit, Copy link, and Delete on a comment; it runs an action and keeps no selected value.' },
    ],
  },
  {
    label: 'Conversation vs CommentThread',
    options: [
      { name: 'Conversation', reason: 'Use Conversation for a chat log of turns between a person and an agent, with Markdown agent replies and work shown between turns.' },
      { name: 'CommentThread', reason: 'Use CommentThread for a comment with replies on a card or document, with per-comment actions, a collapsible replies band, and a reply composer.' },
    ],
  },
  {
    label: 'PathSelector vs FilePicker',
    options: [
      { name: 'PathSelector', reason: 'Use PathSelector to type or paste a file or folder path as a string, with optional browsing supplied by the host through onBrowse.' },
      { name: 'FilePicker', reason: 'Use FilePicker to choose local files or a folder through the native file input; it shows metadata, does not upload, and browsers do not reveal absolute paths.' },
    ],
  },
  {
    label: 'Alert vs CalloutBanner vs ToastProvider vs EmptyState',
    options: [
      { name: 'Alert', reason: 'Use Alert for an inline notice with a tone, title, optional details, and dismissal; add role="status" or role="alert" when it appears dynamically.' },
      { name: 'CalloutBanner', reason: 'Use CalloutBanner for a prominent section with a heading, supporting content, an action, and artwork (BrandMark by default; null removes it) on an evergreen surface.' },
      { name: 'ToastProvider', reason: 'Use ToastProvider and useToast for a transient notification; the latest toast replaces the previous one and dismisses after 5 seconds.' },
      { name: 'EmptyState', reason: 'Use EmptyState when a view has no content yet, with a message, a decorative icon, and an optional next-step action.' },
    ],
  },
  {
    label: 'Grid vs Flex vs Masonry',
    options: [
      { name: 'Grid', reason: 'Use Grid for grouped form inputs, cards, and panels in container-responsive columns, with each labeled field in one GridItem.' },
      { name: 'Flex', reason: 'Use Flex for rows, stacks, and action groups that align along one axis.' },
      { name: 'Masonry', reason: 'Use Masonry for cards or gallery items with uneven heights, packed into the shortest column while the DOM order stays the same.' },
    ],
  },
  {
    label: 'Progress vs Spinner vs Skeleton',
    options: [
      { name: 'Progress', reason: 'Use Progress when you know a numeric value toward a maximum, shown as a native progress bar.' },
      { name: 'Spinner', reason: 'Use Spinner for loading without a known amount; it is a status region with a visually hidden label.' },
      { name: 'Skeleton', reason: 'Use Skeleton for decorative placeholder bars in a loading layout; it is hidden from assistive technology, so announce loading with Spinner or aria-busy.' },
    ],
  },
  {
    label: 'TextField vs TextArea vs NumberInput vs Slider',
    options: [
      { name: 'TextField', reason: 'Use TextField for single-line text, including identifiers such as postal codes, account numbers, or digit strings whose formatting matters.' },
      { name: 'TextArea', reason: 'Use TextArea for multiline text; people can resize it vertically.' },
      { name: 'NumberInput', reason: 'Use NumberInput for a quantity with numeric meaning that people type directly or step; empty and incomplete edits report null.' },
      { name: 'Slider', reason: 'Use Slider to adjust a bounded numeric value with a native range input; use NumberInput when people need direct numeric entry.' },
    ],
  },
  {
    label: 'Form vs FormLayout vs Fieldset vs Grid',
    options: [
      { name: 'Form', reason: 'Use Form for the one native form that collects named values with FormData, constraints, submit, and reset, in a vertical, horizontal, or inline layout.' },
      { name: 'FormLayout', reason: 'Use FormLayout inside a form to give one section a different label layout; it never adds a second form or binds values.' },
      { name: 'Fieldset', reason: 'Use Fieldset to group related controls under a native legend; its native disabled also covers the group actions.' },
      { name: 'Grid', reason: 'Use Grid inside Form, FormLayout, or Fieldset to space peer inputs, with each complete labeled control in one GridItem.' },
    ],
  },
  {
    label: 'Switch vs Checkbox',
    options: [
      { name: 'Switch', reason: 'Use Switch for a setting with on and off states, drawn as a switch track over a native checkbox.' },
      { name: 'Checkbox', reason: 'Use Checkbox for an independent choice with a text label, often one of several related options in a Fieldset; it has no indeterminate prop, so set indeterminate on the input through the forwarded ref.' },
    ],
  },
  {
    label: 'Tabs vs SegmentedControl vs Navbar',
    options: [
      { name: 'Tabs', reason: 'Use Tabs to switch between views within a page; inactive panels stay mounted, and page navigation should use links instead.' },
      { name: 'SegmentedControl', reason: 'Use SegmentedControl to choose one value from a small set, as a native radio group that submits with a form.' },
      { name: 'Navbar', reason: 'Use Navbar for application-wide navigation links, marking the current route with aria-current="page".' },
    ],
  },
  {
    label: 'Navbar vs NavbarItem vs NavbarItemGroup vs Breadcrumbs vs Pagination vs Tabs',
    options: [
      { name: 'Navbar', reason: 'Use Navbar for the application-wide bar with branding, top-level links, and actions.' },
      { name: 'NavbarItem', reason: 'Use NavbarItem for each link, control, or display item in a Navbar or a Sidebar nav; mark the current route with aria-current="page".' },
      { name: 'NavbarItemGroup', reason: 'Use NavbarItemGroup to group related NavbarItem page links; variant="segmented" draws them as a page switcher with the current page filled. The items stay links, unlike SegmentedControl, which is a radio group for form values.' },
      { name: 'Breadcrumbs', reason: 'Use Breadcrumbs for a native trail of links to the current page; the last item is always plain text with aria-current="page", even with an href.' },
      { name: 'Pagination', reason: 'Use Pagination to move between pages of a collection with controlled page and pageCount; for a Table, pass the same props to its pagination property instead.' },
      { name: 'Tabs', reason: 'Use Tabs to switch views within one page, not to navigate between pages.' },
    ],
  },
  {
    label: 'Tooltip vs Disclosure vs ButtonSelect content',
    options: [
      { name: 'Tooltip', reason: 'Use Tooltip for a short, noninteractive clarification of an already named control, shown on hover or keyboard focus.' },
      { name: 'Disclosure', reason: 'Use Disclosure for an inline expandable section built on native details and summary; put links and actions in its revealed content.' },
      { name: 'ButtonSelect', reason: 'Use ButtonSelect with content for an anchored popover of interactive controls; Escape and outside clicks dismiss it, and close() ends it when the user finishes.' },
    ],
  },
  {
    label: 'Text vs Blockquote vs MarkdownRenderer',
    options: [
      { name: 'Text', reason: 'Use Text for headings, paragraphs, labels, and inline formatting on the shared type scale.' },
      { name: 'Blockquote', reason: 'Use Blockquote for text quoted from another person or source, with attribution kept outside the quotation.' },
      { name: 'MarkdownRenderer', reason: 'Use MarkdownRenderer to render CommonMark and GitHub Flavored Markdown, including tables and code blocks with a copy action; raw HTML is skipped.' },
    ],
  },
  {
    label: 'Card vs PagePanel vs CalloutBanner',
    options: [
      { name: 'Card', reason: 'Use Card for a content surface within a page, with an optional header, footer, and divided body.' },
      { name: 'PagePanel', reason: 'Use PagePanel for a full-height section with a persistent header, optional navigation and footer, and a body that scrolls inside a host with a defined height.' },
      { name: 'CalloutBanner', reason: 'Use CalloutBanner for a prominent evergreen section with a heading, supporting content, and an action.' },
    ],
  },
  {
    label: 'Card vs TaskCard vs AgentCard',
    options: [
      { name: 'Card', reason: 'Use Card for a general article surface with an optional header, footer, and divided body.' },
      { name: 'TaskCard', reason: 'Use TaskCard for a task summary with status, priority, assignee avatars, and compact metadata counts.' },
      { name: 'AgentCard', reason: 'Use AgentCard for a selectable agent button with its assignment, status, elapsed time, and token count; the parent controls selection.' },
    ],
  },
  {
    label: 'List vs Table vs Tree vs MarkdownRenderer',
    options: [
      { name: 'List', reason: 'Use List for a short bulleted or numbered set of items built from data, with optional icons, descriptions, trailing content, and dividers.' },
      { name: 'Table', reason: 'Use Table when each item has several comparable values that read best in columns.' },
      { name: 'Tree', reason: 'Use Tree for nested items that people expand, collapse, and select.' },
      { name: 'MarkdownRenderer', reason: 'Use MarkdownRenderer when list content arrives as Markdown text, including agent responses.' },
    ],
  },
  {
    label: 'Stat vs StatGroup',
    options: [
      { name: 'Stat', reason: 'Use Stat for one metric label and value with numeric formatting, supporting content, and a loading state.' },
      { name: 'StatGroup', reason: 'Use StatGroup to arrange related Stat or Card children in Grid columns; it does not aggregate or inspect values.' },
    ],
  },
  {
    label: 'Timeline vs Steps vs ActivityItem vs AgentActivity vs Conversation',
    options: [
      { name: 'Timeline', reason: 'Use Timeline for events over time, with date labels and connected markers.' },
      { name: 'Steps', reason: 'Use Steps for an ordered process or guide with numbered markers and an optional current step.' },
      { name: 'ActivityItem', reason: 'Use ActivityItem for one authored update or audit entry; put several in a list for a feed.' },
      { name: 'AgentActivity', reason: 'Use AgentActivity for a chronological log of agent events with status counts and expandable command, input, and output details.' },
      { name: 'Conversation', reason: 'Use Conversation for a transcript of user, agent, and system messages, with Markdown agent bodies and optional AgentActivity before a message body.' },
    ],
  },
];
