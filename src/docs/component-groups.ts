// Dependency-free component grouping shared with the agent CLI (`chartreuse list`).
// test/cli.test.mjs checks that every public component appears in exactly one group.

export interface ComponentGroup {
  name: string;
  components: readonly string[];
}

export const componentGroups: readonly ComponentGroup[] = [
  { name: 'Actions', components: ['Button', 'IconButton', 'ButtonSelect'] },
  {
    name: 'Forms',
    // SegmentedControl is a native radio group with a label, hint, error, and form submission, so it sits with the inputs.
    components: ['TextField', 'TextArea', 'Select', 'Autocomplete', 'SegmentedControl', 'Checkbox', 'Switch', 'NumberInput', 'Slider',
      'PathSelector', 'FilePicker', 'Form', 'FormLayout', 'Fieldset', 'MessageComposer'],
  },
  { name: 'Feedback', components: ['Alert', 'CalloutBanner', 'Badge', 'Progress', 'Spinner', 'Skeleton', 'EmptyState', 'ToastProvider'] },
  {
    name: 'Content',
    components: ['Text', 'Card', 'Divider', 'Avatar', 'AvatarGroup', 'BrandMark', 'Blockquote', 'MarkdownRenderer', 'Disclosure',
      'Stat', 'StatGroup', 'Table', 'Timeline', 'ActivityItem', 'Steps', 'Tree'],
  },
  { name: 'Navigation', components: ['Navbar', 'NavbarItem', 'Sidebar', 'Tabs', 'Breadcrumbs', 'Pagination'] },
  // Tooltip floats above the page and renders into document.body or the enclosing dialog, like the other overlays.
  { name: 'Overlays', components: ['Dialog', 'Drawer', 'Tooltip'] },
  {
    name: 'Layout',
    // PagePanel is a full-height section with a persistent header and scrolling body, not a navigation control.
    components: ['Grid', 'GridItem', 'GridSpacer', 'Flex', 'Masonry', 'MasonryItem', 'MasonrySpacer', 'WorkspaceLayout',
      'WorkspaceContent', 'PagePanel', 'Swimlane'],
  },
  { name: 'Agents', components: ['AgentActivity', 'AgentCard', 'Conversation', 'TaskCard'] },
];
