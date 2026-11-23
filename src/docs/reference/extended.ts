import type { ComponentReference } from './types';

/** Public API reference data, checked against the owning component signatures. */
export const extendedReferences: ComponentReference[] = [
  {
    name: 'Autocomplete',
    slug: 'autocomplete',
    summary: 'Search a set of options and select one value with a labeled combobox.',
    importCode: "import { useState } from 'react';\nimport { Autocomplete } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [repository, setRepository] = useState('sample-app');

<Autocomplete
  label="Repository"
  name="repository"
  options={[
    { value: 'sample-app', label: 'Sample app', description: 'Sample workspace' },
    { value: 'component-library', label: 'Component library', description: 'Shared interface components' },
  ]}
  value={repository}
  onValueChange={setRepository}
  hint="Choose the workspace for this task."
/>`,
    props: [
      { name: 'label', type: 'string', required: true, description: 'Visible label connected to the combobox input.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'The control size. Use the same size on a Button to match the input height.' },
      { name: 'options', type: 'readonly AutocompleteOption[]', required: true, description: 'Options with value, label, optional description, and optional disabled state.' },
      { name: 'value', type: 'string', description: 'Selected option value for a controlled combobox.' },
      { name: 'defaultValue', type: 'string', defaultValue: '""', description: 'Initial selected option value when uncontrolled.' },
      { name: 'checkmark', type: 'boolean | IconSource', defaultValue: 'false', description: 'Shows a selection icon beside the selected option. Pass true for the standard checkmark or supply a custom icon.' },
      { name: 'matchTriggerWidth', type: 'boolean', defaultValue: 'false', description: 'Keeps the popup at the rendered input width, within the viewport.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when an option is selected or the selection is cleared.' },
      { name: 'hint', type: 'string', description: 'Supporting text beneath the input control, associated with aria-describedby.' },
      { name: 'error', type: 'string', description: 'Validation message and invalid state; replaces the displayed hint.' },
      { name: 'emptyMessage', type: 'string', defaultValue: '"No matching options. Change the search text."', description: 'Message shown when the query matches no options.' },
      { name: 'placeholder', type: 'string', defaultValue: '"Search options"', description: 'Hint shown before a selection or query is entered.' },
      { name: 'name', type: 'string', description: 'Form name for the hidden input containing the selected option value.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Native input disabled state; also disables combobox helper actions.' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Requires a valid enabled option to be selected for form submission.' },
      { name: 'id', type: 'string', description: 'Input ID; otherwise a unique ID is generated.' },
      { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Stretches the field to the full width of its container, including inside flex rows.' },
      { name: 'className', type: 'string', description: 'Additional classes on the field wrapper.' },
      { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Ref to the visible combobox input.' },
    ],
    nativeElement: 'input[type="text"] with listbox',
    nativeProps: 'Inherits input props/ref except value, defaultValue, onChange, size, and type. Compatible attributes and ref target the visible input; name targets a hidden input and className targets the wrapper. The component manages combobox ARIA state. onFocus, onBlur, and onKeyDown callbacks are composed with its behavior.',
    notes: [
      'AutocompleteOption is { value: string; label: string; description?: string; disabled?: boolean }.',
      'Options use fixed-height, single-line rows. The popup starts at the input width and grows within the viewport to fit longer options. With matchTriggerWidth, overflowing text is truncated with an ellipsis.',
      'The visible input shows an option label; the named hidden input submits its value.',
      'Arrow keys move through enabled options, Enter selects, and Escape closes the list.',
      'Clearing the selection emits an empty string. Search text is separate from the selected value.',
      'Space this complete labeled field and its peers with Grid and GridItem span={1}: columns={1} gap={4} for a vertical stack, or columns={{ base: 1, sm: 2 }} gap={4} for a responsive row. Keep its options and helper actions within the combobox.',
    ],
  },
  {
    name: 'MessageComposer',
    slug: 'message-composer',
    summary: 'A multiline textarea and submit action in a dedicated message form.',
    importCode: "import { useState } from 'react';\nimport { MessageComposer } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [message, setMessage] = useState('');
const [sent, setSent] = useState<string[]>([]);

// The composer clears after onSend resolves. Replace with your API call; throw to keep the draft.
async function sendMessage(text: string) {
  setSent(current => [...current, text]);
}

<MessageComposer
  label="Message the orchestrator"
  placeholder="Ask the orchestrator to work on this task…"
  hint={sent.length ? sent.length + ' sent. Command/Ctrl+Enter sends.' : 'Enter adds a new line. Command/Ctrl+Enter sends.'}
  value={message}
  onValueChange={setMessage}
  onSend={sendMessage}
/>`,
    props: [
      { name: 'onSend', type: '(message: string) => void | Promise<void>', required: true, description: 'Receives trimmed, nonempty message text on submission.' },
      { name: 'label', type: 'string', defaultValue: '"Message"', description: 'Accessible label for the textarea and its composer form.' },
      { name: 'hint', type: 'ReactNode', defaultValue: '"Enter adds a new line. Command/Ctrl+Enter sends."', description: 'Supporting content beside the send action; null or false hides it.' },
      { name: 'controls', type: 'ReactNode', description: 'Controls at the start of the footer, such as a ButtonSelect for the model or mode. They stay outside the hint, which describes the textarea.' },
      { name: 'placeholder', type: 'string', defaultValue: '"Enter a message"', description: 'Text displayed in the empty textarea.' },
      { name: 'value', type: 'string', description: 'Draft text for a controlled composer.' },
      { name: 'defaultValue', type: 'string', defaultValue: '""', description: 'Initial draft text when uncontrolled.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Reports edits and a successful submission’s draft reset.' },
      { name: 'sendLabel', type: 'string', defaultValue: '"Send message"', description: 'Accessible name and title of the send button.' },
      { name: 'sendSize', type: "'sm' | 'md' | 'lg'", defaultValue: '"md"', description: 'Size of the send button: 32px, 36px, or 44px square. Coarse pointers always get a 44px target.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the textarea and submission action.' },
      { name: 'rows', type: 'number', defaultValue: '4', description: 'Native textarea row count.' },
      { name: 'name', type: 'string', defaultValue: '"message"', description: 'Native textarea form name.' },
      { name: 'id', type: 'string', description: 'Textarea ID; otherwise a unique ID is generated.' },
      { name: 'className', type: 'string', description: 'Additional classes on the composer form.' },
      { name: 'ref', type: 'Ref<HTMLTextAreaElement>', description: 'Native ref passed to the textarea.' },
    ],
    nativeElement: 'form containing textarea and submit button',
    nativeProps: 'Inherits textarea props/ref except children, value, defaultValue, and onSubmit. className targets the form; native textarea callbacks are forwarded.',
    notes: [
      'Enter adds a line. Ctrl+Enter or Cmd+Enter submits while respecting IME composition.',
      'The send action waits for onSend. Rejections show an error and preserve the draft.',
      'A successful send clears the submitted draft; a newer draft typed during the request is retained.',
      'Pending and success/error announcements are handled inside the composer.',
    ],
  },
  {
    name: 'Drawer',
    slug: 'drawer',
    summary: 'A docked workspace panel or a native modal drawer with a scrolling body.',
    importCode: "import { useState } from 'react';\nimport { Conversation, Drawer, MessageComposer } from '@chartreuse/ui';\nimport type { ConversationMessage } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [drawerOpen, setDrawerOpen] = useState(true);
const [messages, setMessages] = useState<ConversationMessage[]>([
  { id: 'welcome', role: 'agent', sender: 'Orchestrator', body: 'Ready to plan the task board.' },
]);

function sendMessage(body: string) {
  setMessages(current => [...current, { id: \`m-\${current.length}\`, role: 'user', body }]);
}

<Drawer
  open={drawerOpen}
  onOpenChange={setDrawerOpen}
  title="Orchestrator"
  description="TASK-024 · Implement the workspace task board"
  mode="docked"
  side="right"
  width={380}
  maxWidth={520}
  footer={<MessageComposer onSend={sendMessage} />}
>
  <Conversation messages={messages} label="Orchestrator conversation" />
</Drawer>`,
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled visibility of the drawer.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Receives close requests from the close action or Escape.' },
      { name: 'title', type: 'string', required: true, description: 'Visible heading and accessible name of the panel.' },
      { name: 'description', type: 'string', description: 'Supporting text beneath the title.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Content in the independently scrolling body.' },
      { name: 'footer', type: 'ReactNode', description: 'Persistent content below the body, such as a composer.' },
      { name: 'side', type: '"left" | "right"', defaultValue: '"right"', description: 'Edge used by the modal and border placement for a docked panel.' },
      { name: 'mode', type: '"docked" | "modal"', defaultValue: '"docked"', description: 'Docked participates in the host layout; modal uses a native dialog to contain focus.' },
      { name: 'width', type: 'number', defaultValue: '380', description: 'Preferred width in pixels, constrained by maxWidth and available space.' },
      { name: 'maxWidth', type: 'number', defaultValue: '520', description: 'Maximum drawer width in pixels.' },
      { name: 'className', type: 'string', defaultValue: '""', description: 'Additional classes on the panel root.' },
    ],
    nativeElement: 'aside (docked) or dialog (modal)',
    nativeProps: 'Only DrawerProps are accepted. className targets the root aside or dialog; additional native attributes, event handlers, and ref are not forwarded.',
    notes: [
      'Docked drawers participate in their host layout; place the panel before or after the main content to match side.',
      'Escape closes a docked drawer when focus is inside it.',
      'Modal mode uses showModal() for focus containment, Escape dismissal, and native focus return.',
      'Header and footer stay visible while the body scrolls.',
    ],
  },
  {
    name: 'MarkdownRenderer',
    slug: 'markdown-renderer',
    summary: 'Render CommonMark and GitHub Flavored Markdown, including tables, task lists, and code blocks.',
    importCode: "import { MarkdownRenderer } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<MarkdownRenderer>{\`## Workspace review\n\nRecord implementation decisions and validation results.\n\n- [x] Gather the notes\n- [ ] Review the result\n\n| Status | Task |\n| --- | --- |\n| In progress | Workspace review |\n\`}</MarkdownRenderer>`,
    props: [
      { name: 'children', type: 'string', required: true, description: 'Markdown source to render.' },
      { name: 'className', type: 'string', description: 'Additional classes on the rendering wrapper.' },
    ],
    nativeElement: 'div',
    nativeProps: 'Only children and className are accepted. className targets the div wrapper; additional native attributes, events, and ref are not forwarded.',
    notes: [
      'Supports CommonMark and GFM features including tables, task lists, strikethrough, and footnotes.',
      'Raw HTML is skipped and URLs pass through react-markdown’s default URL filter.',
      'Code blocks provide a copy action; wide tables and code blocks remain scrollable.',
      'External web links open in a new tab with noopener and noreferrer. Footnote IDs are unique per instance.',
    ],
  },
  {
    name: 'Disclosure',
    slug: 'disclosure',
    summary: 'A native expandable section with controlled or uncontrolled state.',
    importCode: "import { Disclosure, Text } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Disclosure title="Workspace notes" headerHighlight="open" defaultOpen>\n  <Text size="body">Record implementation decisions and links to related tasks.</Text>\n</Disclosure>\n\n<Disclosure title="Review checklist" name="workspace-details">\n  <Text size="body">Confirm API usage, keyboard behavior, and validation results.</Text>\n</Disclosure>\n<Disclosure title="Related context" name="workspace-details" headerHighlight="always">\n  <Text size="body">List related tasks and recorded implementation decisions.</Text>\n</Disclosure>`,
    props: [
      { name: 'title', type: 'ReactNode', required: true, description: 'Content of the native summary control.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Content revealed when expanded.' },
      { name: 'open', type: 'boolean', description: 'Controlled expansion state; requires onOpenChange.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Reports expansion changes; required when open is controlled.' },
      { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Initial expansion state when uncontrolled.' },
      { name: 'headerHighlight', type: "'hover' | 'open' | 'always'", defaultValue: "'hover'", description: 'Controls the summary background: hover shows hover feedback; open also keeps the background while expanded; always applies it in both states. The body surface is unchanged.' },
      { name: 'name', type: 'string', description: 'Shared name for an exclusive group of uncontrolled disclosures.' },
      { name: 'className', type: 'string', description: 'Additional classes on the details element.' },
      { name: 'ref', type: 'Ref<HTMLDetailsElement>', description: 'Native ref to the details element.' },
    ],
    nativeElement: 'details with summary',
    nativeProps: 'Inherits details props/ref except title, children, open, onToggle, and name; the component supplies their documented alternatives.',
    notes: [
      'Native details and summary preserve Enter, Space, focus, and find-in-page behavior.',
      'Keep the chevron beside its label with the shared 12px gap and a full-width summary target. Put links and actions in the revealed content.',
      'Summary and body use shared 13px typography, with 12px between paragraphs.',
      'Use defaultOpen for internal state, or open with onOpenChange when application state owns visibility.',
      'Use headerHighlight="open" to retain the summary background after expansion, or "always" for both states. This affects the header surface and preserves native focus and expansion behavior.',
      'Optional matching names make uncontrolled disclosures exclusive. Controlled groups leave exclusivity to their owner.',
    ],
  },
  {
    name: 'Fieldset',
    slug: 'fieldset',
    summary: 'Group related form controls under a native legend and shared context.',
    importCode: "import { Trash2 } from 'lucide-react';\nimport { Fieldset, Grid, GridItem, IconButton, Select, TextField } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Fieldset\n  legend="Guidance rule 1"\n  description="All repositories · Draft"\n  actions={<IconButton icon={Trash2} label="Remove guidance rule" />}\n  hint="Describe the preferred implementation approach."\n>\n  <Grid columns={1} gap={4}>\n    <GridItem span={1}><TextField label="Title" name="title" required /></GridItem>\n    <GridItem span={1}>\n      <Select label="Mode" name="mode">\n        <option value="guidance">Guidance</option>\n        <option value="requirement">Requirement</option>\n      </Select>\n    </GridItem>\n  </Grid>\n</Fieldset>`,
    props: [
      { name: 'legend', type: 'ReactNode', required: true, description: 'Native legend and accessible name for the group.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Related form controls and content.' },
      { name: 'description', type: 'ReactNode', description: 'Context near the group actions, associated with aria-describedby.' },
      { name: 'hint', type: 'ReactNode', description: 'Supporting content below the controls, associated with aria-describedby.' },
      { name: 'actions', type: 'ReactNode', description: 'Group actions rendered inside the fieldset, outside the legend.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Native disabled state for descendant controls and group actions.' },
      { name: 'name', type: 'string', description: 'Native fieldset name.' },
      { name: 'className', type: 'string', description: 'Additional classes on the fieldset element.' },
      { name: 'ref', type: 'Ref<HTMLFieldSetElement>', description: 'Native ref to the fieldset element.' },
    ],
    nativeElement: 'fieldset with legend',
    nativeProps: 'Inherits native fieldset props/ref, including disabled, name, form, id, style, events, and ARIA attributes.',
    notes: [
      'The native legend is the first child, names the form group, and interrupts the fieldset border.',
      'Descriptions and hints are connected to the fieldset; their IDs merge with any supplied aria-describedby value.',
      'Actions stay inside the group, outside the legend, so native disabled also covers remove buttons and other group controls.',
      'Group related controls, and give each input its own visible label.',
      'Place Grid inside Fieldset to space grouped inputs in both axes: columns={1} gap={4} for an input stack, or columns={{ base: 1, sm: 2 }} gap={4} for a responsive input row. Wrap each complete labeled input in GridItem span={1}.',
      'Keep the native Fieldset and legend around the Grid. Each Checkbox, Switch, and field retains its visible label and hint associations, and the items remain in logical DOM order.',
      'The rules editor stores changes in local example state.',
    ],
  },
  {
    name: 'FilePicker',
    slug: 'file-picker',
    summary: 'Choose local files or a folder using a labeled native file input.',
    importCode: "import { useState } from 'react';\nimport { FilePicker } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [files, setFiles] = useState<File[]>([]);
const [workspaceFiles, setWorkspaceFiles] = useState<File[]>([]);

<FilePicker
  label="Reports & files"
  name="attachments"
  multiple
  accept=".md,.txt,.pdf"
  hint={files.length + ' files attached to this task.'}
  onFilesChange={setFiles}
/>

<FilePicker
  label="Workspace folder"
  mode="folder"
  hint={workspaceFiles.length + ' files in the folder.'}
  onFilesChange={setWorkspaceFiles}
/>`,
    props: [
      { name: 'label', type: 'string', required: true, description: 'Visible label connected to the file input.' },
      { name: 'mode', type: '"file" | "folder"', defaultValue: '"file"', description: 'Chooses regular file selection or directory selection where supported.' },
      { name: 'hint', type: 'ReactNode', description: 'Supporting content beneath the file control, associated with the input.' },
      { name: 'error', type: 'string', description: 'Validation message displayed in an alert region.' },
      { name: 'onFilesChange', type: '(files: File[]) => void', description: 'Reports selected files, clearing, and mode/reset changes.' },
      { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allows multiple files in file mode; folder mode always enables it.' },
      { name: 'accept', type: 'string', description: 'File-type hint passed to the native picker in file mode.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables file selection and the clear action.' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Requires a selection using native form validation.' },
      { name: 'name', type: 'string', description: 'Native file input form name.' },
      { name: 'id', type: 'string', description: 'File input ID; otherwise a unique ID is generated.' },
      { name: 'className', type: 'string', description: 'Additional classes on the picker wrapper.' },
      { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Native ref to the file input.' },
    ],
    nativeElement: 'input[type="file"]',
    nativeProps: 'Inherits input props/ref except type, value, defaultValue, and children. Native onChange is forwarded alongside onFilesChange.',
    notes: [
      'Selection stays local. The picker displays metadata and does not upload files.',
      'Folder mode uses directory selection where available and falls back to choosing files.',
      'Changing file/folder or multiple-selection mode clears the previous selection.',
      'Native form reset clears the picker after the reset event completes.',
      'Arrange the complete labeled picker with peer fields in Grid/GridItem using token gaps for vertical stacks as well as shared rows. Start with columns={1} gap={4}, add responsive columns when space permits, and use span="full" when file names or metadata need their own row.',
    ],
  },
  {
    name: 'PagePanel',
    slug: 'page-panel',
    summary: 'A full-height section with a persistent header, scrolling body, and optional footer.',
    importCode: "import { Settings } from 'lucide-react';\nimport { Button, NavbarItem, PagePanel, TextField } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<PagePanel
  title="Workspace settings"
  description="Configure repository access and task defaults."
  leading={<Settings size={20} aria-hidden="true" />}
  headerActions={<Button variant="secondary">View workspace</Button>}
  navigation={<NavbarItem href="#general" aria-current="page">General</NavbarItem>}
  footer={<Button type="submit" form="workspace-settings">Save changes</Button>}
>
  <form id="workspace-settings">
    <TextField label="Workspace name" name="workspaceName" defaultValue="Sample app" />
  </form>
</PagePanel>`,
    props: [
      { name: 'title', type: 'string', required: true, description: 'Visible heading and default accessible name of the panel.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Content in the independently scrolling body.' },
      { name: 'description', type: 'ReactNode', description: 'Supporting content beneath the heading.' },
      { name: 'leading', type: 'ReactNode', description: 'Content before the heading, such as an icon.' },
      { name: 'headerActions', type: 'ReactNode', description: 'Actions at the trailing edge of the header.' },
      { name: 'navigation', type: 'ReactNode', description: 'Navigation row between the header and scrolling body.' },
      { name: 'footer', type: 'ReactNode', description: 'Action area that docks to the bottom of the surrounding scroll viewport, with square bottom corners while docked.' },
      { name: 'stickyFooter', type: 'boolean', defaultValue: 'true', description: 'Allows the footer to dock when the available scroll viewport is at least 480px tall.' },
      { name: 'className', type: 'string', description: 'Additional classes on the section element.' },
      { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native ref to the section element.' },
    ],
    nativeElement: 'section',
    nativeProps: 'Inherits section props/ref except native title and children. Supplied ARIA description IDs merge with the generated description ID.',
    notes: [
      'Place the panel in a host with a defined height so the body can scroll independently.',
      'The header, optional navigation, and footer remain outside the scrolling body.',
      'The body is a named, keyboard-focusable scroll region.',
      'The title renders as an h2; choose an appropriate surrounding heading structure.',
    ],
  },
  {
    name: 'CalloutBanner',
    slug: 'callout-banner',
    summary: 'A section with a heading, supporting content, an action slot, and optional artwork.',
    importCode: "import { useState } from 'react';\nimport { ArrowRight } from 'lucide-react';\nimport { Button, CalloutBanner } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [workspaceOpen, setWorkspaceOpen] = useState(false);
const openWorkspace = () => setWorkspaceOpen(true);

<CalloutBanner
  eyebrow="WORKSPACE"
  title="Review workspace activity"
  description="Inspect task status, agent activity, and pending reviews."
  action={
    <Button variant="ghost" iconRight={ArrowRight} onClick={openWorkspace}>
      {workspaceOpen ? 'Workspace open' : 'Open workspace'}
    </Button>
  }
/>`,
    props: [
      { name: 'title', type: 'string', required: true, description: 'Visible h2 heading and default accessible name of the section.' },
      { name: 'eyebrow', type: 'string', description: 'Short introductory label above the heading.' },
      { name: 'description', type: 'ReactNode', description: 'Supporting content beneath the heading.' },
      { name: 'action', type: 'ReactNode', description: 'Consumer-supplied button, link, or related action content.' },
      { name: 'artwork', type: 'ReactNode', defaultValue: '<BrandMark />', description: 'Optional illustration; pass null to hide the default artwork.' },
      { name: 'className', type: 'string', description: 'Additional classes on the section element.' },
      { name: 'ref', type: 'Ref<HTMLElement>', description: 'Native ref to the section element.' },
    ],
    nativeElement: 'section',
    nativeProps: 'Inherits section props/ref except native title and children. aria-labelledby defaults to the generated heading unless an accessible label is supplied.',
    notes: [
      'The consumer owns the action and its navigation or event handler.',
      'Undefined artwork uses the decorative shared BrandMark; null removes the artwork area.',
      'Custom artwork retains its own semantics. Provide suitable alt text or hide decorative content as appropriate.',
      'The banner uses an evergreen surface and chartreuse accents in both color themes.',
    ],
  },
  {
    name: 'PathSelector',
    slug: 'path-selector',
    summary: 'Enter a file or folder path, with optional browsing supplied by the host.',
    importCode: "import { useState } from 'react';\nimport { PathSelector } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [workspacePath, setWorkspacePath] = useState('');
const [reportPath, setReportPath] = useState('');

// Replace with the host's file dialog for the requested mode (for example an
// Electron or Tauri bridge). Resolve null when the dialog is cancelled.
async function browsePathFromHost(_mode: 'file' | 'folder'): Promise<string | null> {
  return null;
}

<PathSelector
  label="Workspace folder"
  name="workspace"
  mode="folder"
  value={workspacePath}
  onValueChange={setWorkspacePath}
  hint="Enter the repository folder path."
/>

<PathSelector
  label="Report file"
  mode="file"
  value={reportPath}
  onValueChange={setReportPath}
  onBrowse={browsePathFromHost}
/>`,
    props: [
      { name: 'label', type: 'string', required: true, description: 'Visible label connected to the path input.' },
      { name: 'mode', type: '"file" | "folder"', defaultValue: '"folder"', description: 'Selects the path icon, default placeholder, and host browse mode.' },
      { name: 'value', type: 'string', description: 'Path string for a controlled field.' },
      { name: 'defaultValue', type: 'string', defaultValue: '""', description: 'Initial uncontrolled path and the target requested on form reset.' },
      { name: 'onValueChange', type: '(path: string) => void', description: 'Reports typing, browse results, clearing, and native form reset requests.' },
      { name: 'onBrowse', type: '(mode: "file" | "folder") => string | null | Promise<string | null>', description: 'Optional host path chooser; returning null cancels the selection.' },
      { name: 'hint', type: 'string', description: 'Supporting text beneath the input control when there is no error.' },
      { name: 'error', type: 'string', description: 'External validation message; takes precedence over a host browse error.' },
      { name: 'placeholder', type: 'string', defaultValue: '"Enter a folder path" / "Enter a file path"', description: 'Empty-field hint; the default follows mode.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables path entry, clearing, and browsing.' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Requires a path using native text-input validation.' },
      { name: 'name', type: 'string', description: 'Native form name; the submitted value is a path string.' },
      { name: 'autoComplete', type: 'string', defaultValue: '"off"', description: 'Native input autocomplete behavior.' },
      { name: 'autoCapitalize', type: 'string', defaultValue: '"none"', description: 'Native capitalization preference for path entry.' },
      { name: 'autoCorrect', type: 'string', defaultValue: '"off"', description: 'Native text-correction preference for path entry.' },
      { name: 'spellCheck', type: 'boolean | "true" | "false"', defaultValue: 'false', description: 'Native spell-check preference for path entry.' },
      { name: 'id', type: 'string', description: 'Text input ID; otherwise a unique ID is generated.' },
      { name: 'className', type: 'string', description: 'Additional classes on the field wrapper.' },
      { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Native ref to the editable text input.' },
    ],
    nativeElement: 'input[type="text"]',
    nativeProps: 'Inherits input props/ref except type, value, defaultValue, size, and children. Native onChange is forwarded alongside onValueChange; className targets the wrapper.',
    notes: [
      'Manual typing and paste work without onBrowse. The Browse action appears only when a host callback is supplied.',
      'A canceled browse preserves the current path. A pending result also preserves any path edited while the chooser was open.',
      'Host browse errors are displayed locally and keep the path available for correction.',
      'In controlled mode, update value in response to onValueChange, including clear and reset requests.',
      'The value is a path string. Browser file inputs do not provide real absolute filesystem paths; use a suitable host adapter for native browsing.',
      'Place the complete PathSelector in a GridItem with peer fields. Use Grid columns={1} gap={4} for a spaced stack or columns={{ base: 1, sm: 2 }} for a responsive row; keep the label, path input, and browse action together.',
    ],
  },
];
