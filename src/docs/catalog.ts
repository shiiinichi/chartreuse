import { Activity, BookOpen, Box, Braces, CircleDot, ClipboardList, Component, Grid2X2, History, Layers, LayoutDashboard, LayoutTemplate, MousePointer2, Palette, Search, Settings, FileText, PanelTop, Radius, Ruler, Sparkles, TextCursorInput, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { componentReferences, createComponentNavigation } from './reference';
import type { ComponentReference } from './reference/types';
import { componentSidebarIcons } from './sidebar-icons';
import { samplePatternDefinitions } from './pattern-definitions';
import { basicAppSnippet } from './setup-guide';
import { componentPageAliases } from './component-aliases';
import type { SamplePatternId } from './pattern-definitions';
import { version as chartreuseVersion } from '../../package.json';

export { chartreuseVersion };

export type LegacyPageId = 'overview' | 'getting-started' | 'changelog' | 'colors' | 'typography' | 'spacing' | 'elevation' | 'icons' | 'buttons' | 'forms' | 'fieldsets' | 'badges' | 'cards' | 'markdown' | 'disclosures' | 'navigation' | 'modals' | 'drawers' | 'feedback' | 'task-board' | 'agent-monitor' | 'workspace' | 'page-panels';
export type ComponentPageId = `components/${string}`;
export type PageId = LegacyPageId | ComponentPageId | SamplePatternId | 'common-props' | 'layout' | 'tokens';
export interface Page { id: PageId; label: string; group: string; category?: string; icon: LucideIcon; description: string; tag?: string; hidden?: boolean; component?: ComponentReference }

// Documentation placement is independent of whether an API is a React export.
const foundationExportCategories: Readonly<Partial<Record<string, 'Brand' | 'Layout'>>> = {
  BrandMark: 'Brand',
  Grid: 'Layout',
  GridItem: 'Layout',
  GridSpacer: 'Layout',
  Masonry: 'Layout',
  MasonryItem: 'Layout',
  MasonrySpacer: 'Layout',
  Flex: 'Layout',
};
export const componentNavigation = createComponentNavigation(componentReferences);
export const componentPages: Page[] = componentNavigation.map(item => {
  const category = foundationExportCategories[item.label];
  return { ...item, group: category ? 'Foundations' : 'Components', category, icon: componentSidebarIcons[item.label] || Component };
});
const samplePatternIcons: Record<SamplePatternId, LucideIcon> = { 'settings-editor': Settings, 'record-search': Search, 'record-detail': FileText, 'metrics-dashboard': LayoutDashboard };
export const pages: Page[] = [
  { id: 'overview', label: 'Overview', group: 'Start here', icon: Grid2X2, description: 'React components, design tokens, and interface patterns.' },
  { id: 'getting-started', label: 'Getting started', group: 'Start here', icon: BookOpen, description: 'Build and package the library, install its archive, and import components and styles.' },
  { id: 'common-props', label: 'Common DOM props', group: 'Start here', icon: Braces, description: 'A single reference for inherited attributes, events, and explicitly supported native refs.' },
  { id: 'changelog', label: 'Changelog', group: 'Start here', icon: History, description: 'Release history and changes to the component library and documentation.', tag: chartreuseVersion.split('.').slice(0, 2).join('.') },
  { id: 'colors', label: 'Color', group: 'Foundations', icon: Palette, description: 'Brand palette, semantic color roles, and light and dark theme tokens.' },
  { id: 'typography', label: 'Typography', group: 'Foundations', icon: Type, description: 'Inter font sizes, weights, line heights, and type scale previews.' },
  { id: 'spacing', label: 'Spacing', group: 'Foundations', icon: Ruler, description: 'Four-pixel spacing tokens for padding, gaps, and layout.' },
  { id: 'layout', label: 'Layout', group: 'Foundations', icon: LayoutTemplate, description: 'Bounded and full-width containers with shared content gutters.' },
  { id: 'tokens', label: 'Design tokens', group: 'Foundations', icon: Braces, description: 'Source-audited CSS tokens, their scopes, and their connection to JavaScript exports.' },
  { id: 'elevation', label: 'Radius & elevation', group: 'Foundations', icon: Radius, description: 'Shared border radius values and shadow levels.' },
  { id: 'icons', label: 'Iconography', group: 'Foundations', icon: Sparkles, description: 'Lucide icon imports, size and stroke controls, and custom SVG guidance.' },
  ...componentPages,
  { id: 'workspace', label: 'Workspace', group: 'Patterns', icon: LayoutTemplate, description: 'Task board, validation, and activity views composed from shared components.' },
  { id: 'task-board', label: 'Task board', group: 'Patterns', icon: ClipboardList, description: 'Switch between a status board and a paginated list with shared search and task details.' },
  { id: 'agent-monitor', label: 'Agent monitor', group: 'Patterns', icon: Activity, description: 'Agent selection, task context, token usage, and sample activity.' },
  ...samplePatternDefinitions.map(pattern => ({ id: pattern.id, label: pattern.label, group: 'Patterns', icon: samplePatternIcons[pattern.id], description: pattern.description })),
  { id: 'forms', label: 'Form controls gallery', group: 'Components', icon: TextCursorInput, hidden: true, description: 'Compatibility gallery for the original form-controls link.' },
];

export const componentAliases: Readonly<Record<string, ComponentPageId>> = componentPageAliases;
export function resolvePageId(value: string): PageId {
  const candidate = componentAliases[value] || value;
  return pages.some(page => page.id === candidate) ? candidate as PageId : 'overview';
}
export const groups = ['Start here', 'Foundations', 'Components', 'Patterns'];
export const componentCount = componentReferences.length;
export const iconList = { Activity, BookOpen, Box, Braces, CircleDot, ClipboardList, Component, Grid2X2, History, Layers, LayoutDashboard, LayoutTemplate, MousePointer2, Palette, PanelTop, Radius, Ruler, Sparkles, TextCursorInput, Type };

export const snippets = {
  registry: `# .npmrc: replace OWNER with the lowercase GitHub repository owner\n@OWNER:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}`,
  install: `npm install @chartreuse/ui@npm:@OWNER/chartreuse@latest`,
  basic: basicAppSnippet,
  buttons: `<Button icon={Plus}>Create task</Button>\n<Button variant="secondary">View workspace</Button>\n<Button variant="accent" iconRight={ArrowRight}>Get started</Button>\n<Button variant="ghost">Cancel</Button>\n<Button variant="danger">Delete task</Button>`,
  forms: `<TextField\n  label="Task name"\n  name="title"\n  placeholder="Enter a task title"\n  required\n/>\n<Select label="Priority" name="priority">\n  <option>Medium</option>\n  <option>High</option>\n</Select>\n<Switch label="Live updates" defaultChecked />`,
  composer: `<MessageComposer\n  label="Message"\n  placeholder="Enter a message"\n  value={message}\n  onValueChange={setMessage}\n  onSend={sendMessage}\n  hint="Messages are submitted within this example."\n/>`,
  autocomplete: `<Autocomplete\n  label="Workspace"\n  name="workspace"\n  options={workspaces}\n  value={workspace}\n  onValueChange={setWorkspace}\n  hint="Search by workspace name or description."\n  required\n/>`,
  filePicker: `<FilePicker\n  label="Attachments"\n  name="attachments"\n  multiple\n  accept=".md,.txt,.pdf"\n  onFilesChange={setFiles}\n/>\n\n<FilePicker\n  label="Working folder"\n  mode="folder"\n  name="folderFiles"\n  onFilesChange={setFolderFiles}\n/>`,
  badges: `<Badge tone="neutral" dot>To do</Badge>\n<Badge tone="info" dot>In progress</Badge>\n<Badge tone="warning" dot>In review</Badge>\n<Badge tone="success" icon={Check}>Done</Badge>`,
  cards: `<TaskCard\n  taskId="TASK-024"\n  title="Implement the workspace task board"\n  description="Add status lanes, task search, and task detail dialogs."\n  status="in-progress"\n  priority="high"\n  branch="feat/workspace"\n  completed={3}\n  total={5}\n  assignees={['Alex Morgan', 'Sam Lee']}\n  onClick={() => openTask()}\n/>`,
  navigation: `<Tabs label="Workspace views" items={[\n  { value: 'board', label: 'Board', icon: LayoutDashboard,\n    content: <TaskBoard /> },\n  { value: 'activity', label: 'Activity', icon: Activity,\n    content: <ActivityFeed /> },\n  { value: 'settings', label: 'Settings', icon: Settings,\n    content: <WorkspaceSettings /> },\n]} />`,
  feedback: `<Alert tone="success" title="All changes saved">\n  Your workspace is up to date.\n</Alert>\n\n// Inside a ToastProvider\nconst notify = useToast();\n<Button onClick={() => notify('Task created')}>Create task</Button>`,
  dialog: `<Dialog\n  open={open}\n  onOpenChange={setOpen}\n  title="Example dialog"\n  description="Native dialog with cancel and confirm actions."\n>\n  <TextField label="Task name" autoFocus required />\n</Dialog>`,
  agent: `<AgentCard\n  name="Research agent"\n  task="Inspecting the component API and dependencies."\n  status="running"\n  tokens="2.4k"\n  elapsed="00:42"\n  onClick={() => selectAgent()}\n/>`,
};
