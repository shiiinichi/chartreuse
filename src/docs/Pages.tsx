import { lazy, Suspense, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, Bell, Check, CheckCheck, CheckCircle2, ChevronDown, CircleCheck, Code2, Copy, Feather, Layers, LayoutDashboard, Network, Search, Settings, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Alert, Avatar, AvatarGroup, Badge, Breadcrumbs, BrandMark, Button, CalloutBanner, Card, Checkbox, Dialog, Divider, EmptyState, Progress, Skeleton, Spinner, Steps, Switch, Tabs, TextField, colors, radii, spacing, tokens, typography, useToast, Text } from '../system';
import { chartreuseVersion, componentCount, iconList, snippets } from './catalog';
import type { Page, PageId } from './catalog';
import { AgentMonitor, ButtonDemo, FormDemo, TaskBoard, TaskPreview } from './Demos';
import { ModalsPage } from './ModalsPage';
import { DrawerPage } from './DrawerPage';
import { MessageComposerDemo } from './MessageComposerDemo';
import { AutocompleteDemo } from './AutocompleteDemo';
import { DisclosurePage } from './DisclosurePage';
import { FieldsetPage } from './FieldsetPage';
import { FilePickerDemo } from './FilePickerDemo';
import { PagePanelPage } from './PagePanelPage';
import { CodeBlock, copyText, DownloadButton, SectionTitle, Showcase } from './shared';
import { agentMonitorPatternCode, taskBoardPatternCode, workspacePatternCode } from './pattern-example-sources';
import { PatternPreview } from './PatternPreview';
import { CliSkillPage } from './CliSkillPage';
import { CustomIconGuide } from './CustomIconGuide';
import { CommonPropsPage, ComponentReferencePage } from './ComponentReferencePage';
import { SegmentedControl } from '../system/SegmentedControl';
import { Slider } from '../system/Slider';
import { LayoutPage } from './LayoutPage';
import { GlobalTokensPage } from './GlobalTokensPage';
import { TokenCustomizationGuide } from './TokenCustomizationGuide';

type Navigate = (id: PageId) => void;
const SamplePatternPage = lazy(() => import('./SamplePatternPage').then(module => ({ default: module.SamplePatternPage })));
const MarkdownPage = lazy(() => import('./MarkdownPage').then(module => ({ default: module.MarkdownPage })));

function HeroArt() {
  return <div className="hero-art" aria-hidden="true"><div className="art-grid" /><svg viewBox="0 0 450 300" className="hero-drawing" fill="none"><path d="M34 164H416M229 26V280" stroke="currentColor" strokeDasharray="3 5" opacity=".18" /><circle cx="228" cy="153" r="109" stroke="currentColor" opacity=".12" /><circle cx="228" cy="153" r="78" stroke="currentColor" opacity=".1" />
    <g transform="translate(82 73) rotate(-12 75 75)"><rect width="149" height="149" rx="15" fill="var(--cr-color-surface)" stroke="var(--cr-color-border)" /><rect x="17" y="18" width="35" height="6" rx="3" fill="var(--cr-color-border)" /><rect x="17" y="34" width="70" height="5" rx="2.5" fill="var(--cr-color-border)" /><circle cx="47" cy="92" r="24" fill="var(--cr-chartreuse)" /><path d="m37 92 7 7 13-15" stroke="var(--cr-evergreen)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M84 80h40M84 91h31M84 102h36" stroke="var(--cr-color-border)" strokeWidth="4" strokeLinecap="round" /></g>
    <g transform="translate(214 64) rotate(9 72 80)"><rect width="145" height="170" rx="16" fill="#024340" /><g transform="translate(27 24) scale(2.3)"><path d="M20 20H5V5h4a11 11 0 0 1 11 11Zm0 0V5h15v4a11 11 0 0 1-11 11Zm0 0h15v15h-4a11 11 0 0 1-11-11Zm0 0v15H5v-4a11 11 0 0 1 11-11Z" fill="#dbffad" /></g><path d="M27 128h88M27 140h57" stroke="#dbffad" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round" /><circle cx="121" cy="145" r="4" fill="#dbffad" /></g>
    <circle cx="106" cy="48" r="5" fill="var(--cr-color-canvas)" stroke="currentColor" opacity=".7" /><path d="M373 82v16m-8-8h16M144 254v12m-6-6h12" stroke="currentColor" opacity=".4" strokeWidth="1.3" /><circle cx="355" cy="256" r="7" fill="#dbffad" stroke="#a9c78f" /><path d="m408 176-5 5 5 5 5-5-5-5Z" fill="currentColor" opacity=".3" /></svg><div className="art-status"><span className="cr-status-dot" /> Component preview</div><span className="art-caption">COMPONENTS · TOKENS · PATTERNS</span></div>;
}

export function Overview({ navigate }: { navigate: Navigate }) {
  const notify = useToast();
  return <><section className="hero"><div className="hero-copy"><div className="hero-eyebrow"><span />REACT COMPONENT LIBRARY</div><Text size="heading-1">React UI<br /><span>components.</span></Text><Text size="body">React 19 components, CSS variables, and composable interface patterns.</Text><div className="hero-buttons"><Button iconRight={ArrowRight} onClick={() => navigate('buttons')}>Browse components</Button><Button variant="ghost" onClick={() => navigate('getting-started')}>Get started<ArrowUpRight size={15} aria-hidden="true" /></Button></div></div><HeroArt /></section>
    <div className="system-facts"><span><span className="fact-number">{componentCount}</span>React components</span><span><Code2 size={15} aria-hidden="true" />Built with React 19</span><span><CircleCheck size={15} aria-hidden="true" />TypeScript props</span><span><span className="cr-status-dot" />Version {chartreuseVersion}</span></div>
    <section className="overview-section"><SectionTitle title="Design foundations" description="Color, typography, and spacing tokens used by the component library." action="Explore foundations" onAction={() => navigate('colors')} /><div className="foundation-grid">
      <button className="foundation-card color-foundation" type="button" onClick={() => navigate('colors')}><div className="mini-palette"><span /><span /><span /><span /><span /></div><div className="foundation-card-text"><div><Text size="heading-3">Color palette</Text><Text size="body">Brand colors and semantic theme tokens.</Text></div><ArrowUpRight size={15} aria-hidden="true" /></div></button>
      <button className="foundation-card type-foundation" type="button" onClick={() => navigate('typography')}><div className="type-foundation-sample"><span>Aa</span><div>Type scale<br /><span>Inter · Variable font</span></div></div><div className="foundation-card-text"><div><Text size="heading-3">Typography</Text><Text size="body">Font sizes, weights, and line heights.</Text></div><ArrowUpRight size={15} aria-hidden="true" /></div></button>
      <button className="foundation-card spacing-foundation" type="button" onClick={() => navigate('spacing')}><div className="spacing-foundation-sample"><span /><span /><span /><span /><span /><Text className="spacing-foundation-label">4 · 8 · 12 · 16 · 24</Text></div><div className="foundation-card-text"><div><Text size="heading-3">Spacing scale</Text><Text size="body">Four-pixel units for gaps and padding.</Text></div><ArrowUpRight size={15} aria-hidden="true" /></div></button>
    </div></section>
    <section className="overview-section"><SectionTitle title="Component examples" description="Interactive previews with React usage examples." action="Browse components" onAction={() => navigate('buttons')} /><div className="overview-showcases"><Showcase align="center" headingLevel={3} title="Buttons" description="Variants, sizes, and interaction states." code={snippets.buttons} toolbar={<><span>5 variants · 3 sizes</span><button type="button" onClick={() => navigate('buttons')}>View component<ArrowUpRight size={12} aria-hidden="true" /></button></>}><ButtonDemo compact /></Showcase><Showcase align="center" headingLevel={3} title="Task card" description="Task metadata, status, and progress." code={snippets.cards} className="task-showcase" toolbar={<><span>TaskCard preview</span><button type="button" onClick={() => navigate('components/task-card')}>View component<ArrowUpRight size={12} aria-hidden="true" /></button></>}><div className="task-preview-wrap"><TaskPreview /></div></Showcase><Showcase align="center" headingLevel={3} title="Form controls" description="Labeled inputs and selection controls." code={snippets.forms}><FormDemo compact /></Showcase><Showcase align="center" headingLevel={3} title="Status & activity" description="Task status and agent context usage." code={snippets.agent}><div className="status-demo"><div className="demo-row"><Badge dot>To do</Badge><Badge tone="info" dot>In progress</Badge><Badge tone="warning" dot>In review</Badge><Badge tone="success" icon={Check}>Done</Badge></div><AgentMonitor compact /></div></Showcase></div></section>
    <div className="overview-section"><CalloutBanner eyebrow="WORKSPACE PATTERN" title="Task board composition" description="Combine task cards, tabs, form controls, and status indicators in a workspace example." action={<Button variant="ghost" iconRight={ArrowRight} onClick={() => navigate('workspace')}>View workspace pattern</Button>} /></div>
    <div className="overview-note"><Feather size={15} aria-hidden="true" /><span>Component library, design tokens, and documentation for version {chartreuseVersion}.</span><button type="button" onClick={() => { notify('Opening the version ' + chartreuseVersion + ' release notes.', 'info'); navigate('changelog'); }}>Release notes<ArrowUpRight size={12} aria-hidden="true" /></button></div>
  </>;
}

export function DocumentPage({ page, navigate }: { page: Page; navigate: Navigate }) {
  if (page.component) return <ComponentReferencePage reference={page.component} group={page.group === 'Foundations' ? 'Foundations' : 'Components'} category={page.category} />;
  if (page.id === 'common-props') return <CommonPropsPage />;
  return <><header className="document-heading"><div className="eyebrow">{page.group}</div><div className="document-title-row"><Text size="heading-1">{page.label}</Text>{page.group === 'Components' && <Badge tone="success" icon={Check}>React component</Badge>}</div><Text size="body">{page.description}</Text></header><PageContent id={page.id} navigate={navigate} /></>;
}

function PageContent({ id, navigate }: { id: PageId; navigate: Navigate }) {
  if (id === 'settings-editor' || id === 'record-search' || id === 'record-detail' || id === 'metrics-dashboard') return <Suspense fallback={<Text size="body" className="muted">Loading pattern…</Text>}><SamplePatternPage name={id} /></Suspense>;
  if (id === 'colors') return <ColorsPage />;
  if (id === 'typography') return <TypographyPage />;
  if (id === 'spacing') return <SpacingPage />;
  if (id === 'layout') return <LayoutPage />;
  if (id === 'tokens') return <GlobalTokensPage />;
  if (id === 'elevation') return <ElevationPage />;
  if (id === 'icons') return <IconsPage />;
  if (id === 'buttons') return <ButtonsPage />;
  if (id === 'forms') return <FormsPage />;
  if (id === 'fieldsets') return <FieldsetPage />;
  if (id === 'badges') return <BadgesPage />;
  if (id === 'cards') return <CardsPage />;
  if (id === 'markdown') return <Suspense fallback={<Text size="body" className="muted">Loading Markdown preview…</Text>}><MarkdownPage /></Suspense>;
  if (id === 'disclosures') return <DisclosurePage />;
  if (id === 'navigation') return <NavigationPage />;
  if (id === 'modals') return <ModalsPage />;
  if (id === 'drawers') return <DrawerPage />;
  if (id === 'page-panels') return <PagePanelPage />;
  if (id === 'feedback') return <FeedbackPage />;
  if (id === 'workspace' || id === 'task-board') return <>
    <div className="pattern-note"><Sparkles size={16} aria-hidden="true" /><span>Create tasks, open task details, and change task status in this local example.</span><Badge>Interactive</Badge></div>
    <Showcase title={id === 'workspace' ? 'Workspace task board' : 'Task board'} description="Switch between status lanes and a paginated list grouped by the same statuses." code={id === 'workspace' ? workspacePatternCode : taskBoardPatternCode}>
      <PatternPreview page={id}><TaskBoard workspace={id === 'workspace'} /></PatternPreview>
    </Showcase>
    <div className="document-section"><SectionTitle title="Components used" />
      <div className="demo-row">{([['navbar', 'Navbar'], ['workspace-layout', 'WorkspaceLayout'], ['workspace-content', 'WorkspaceContent'], ['task-card', 'TaskCard'], ['table', 'Table'], ['pagination', 'Pagination'], ['segmented-control', 'SegmentedControl'], ['tabs', 'Tabs'], ['text-field', 'TextField']] as const).map(([component, label]) => (
        <Button key={component} variant="secondary" size="sm" iconRight={ArrowUpRight} onClick={() => navigate(`components/${component}`)}>{label}</Button>
      ))}</div>
    </div>
  </>;
  if (id === 'agent-monitor') return <>
    <div className="pattern-note"><Network size={16} aria-hidden="true" /><span>Select an agent to view its task, token usage, and activity.</span><Badge>Interactive demo</Badge></div>
    <Showcase title="Agent monitor" description="Agent selection with task context and sample activity." code={agentMonitorPatternCode}>
      <PatternPreview page={id}><AgentMonitor /></PatternPreview>
    </Showcase>
  </>;
  if (id === 'cli-and-skill') return <CliSkillPage />;
  if (id === 'changelog') return <Changelog />;
  return <GettingStarted navigate={navigate} />;
}

function ColorsPage() {
  const notify = useToast();
  const [format, setFormat] = useState('json');
  const css = `:root {\n${Object.values(colors).map(color => `  ${color.token}: ${color.value};`).join('\n')}\n}`;
  return <><div className="color-page-toolbar"><Text size="body" className="body-copy">Chartreuse brand palette.<br />Click any swatch to copy its value.</Text><div className="demo-row"><label className="sr-only" htmlFor="export-format">Token export format</label><span className="small-select-wrap"><select id="export-format" className="small-select" value={format} onChange={e => setFormat(e.target.value)}><option value="json">JSON</option><option value="css">CSS</option></select><ChevronDown size={12} aria-hidden="true" /></span><DownloadButton content={format === 'json' ? JSON.stringify(tokens, null, 2) : css} name={`chartreuse-tokens.${format}`} type={format === 'css' ? 'text/css' : 'application/json'} /></div></div><div className="color-grid">{Object.entries(colors).map(([name, color]) => {
    const label = name === 'evergreenLight' ? 'Light Evergreen' : name;
    return <button className="color-card" key={name} type="button" onClick={async () => {
      const success = await copyText(color.value);
      notify(success ? `${color.value} copied to clipboard` : 'Select the hex value to copy it.', success ? 'success' : 'warning');
    }} aria-label={`Copy ${label} ${color.value}`}><div className="color-swatch" style={{ '--swatch': color.value } as CSSProperties}><Copy size={16} aria-hidden="true" /></div><div className="color-card-info"><Text bold>{label.charAt(0).toUpperCase() + label.slice(1)}</Text><code>{color.value}</code><span>{color.role}</span></div></button>;
  })}</div><div className="document-section"><SectionTitle title="Semantic color roles" description="Use semantic CSS variables for surfaces, text, borders, and feedback." /><div className="semantic-grid"><div><span className="eyebrow">CONTENT & SURFACES</span><CodeBlock language="css" code={`.workspace {\n  color: var(--cr-color-text);\n  background: var(--cr-color-canvas);\n  border: 1px solid var(--cr-color-border);\n}`} /></div><div><span className="eyebrow">STATES & EMPHASIS</span><div className="stack semantic-alerts"><Alert tone="success" title="Success status">Include a label or icon with status colors.</Alert><Alert tone="warning" title="Warning status">Use semantic feedback tokens for each color scheme.</Alert></div></div></div></div><Alert tone="neutral" title="Brand and semantic tokens">Brand swatches retain their source values. Semantic tokens define surfaces, text, and feedback for light and dark themes. Use the header theme control to preview each scheme.</Alert></>;
}

function TypographyPage() {
  const [sample, setSample] = useState('');
  return <>
    <div className="typography-intro">
      <span className="type-giant">Ag</span>
      <div>
        <Badge>FONT FAMILY</Badge>
        <Text size="heading-2">Inter Variable</Text>
        <Text size="body">Use <a href="#components/text"><code>Text</code></a> to apply the sizes, weights, and line heights shown below.</Text>
        <Text className="muted small">Variable font · 100–900 · Locally bundled</Text>
      </div>
    </div>
    <TextField label="Preview text" name="typeSample" placeholder="Enter text to preview the type scale…" value={sample} onChange={e => setSample(e.target.value)} />
    <div className="type-scale">{typography.map(type => <div className="type-scale-row" key={type.id}>
      <div>
        <Text bold>{type.name}</Text>
        <code>{type.id} · {type.size}px / {type.lineHeight} / {type.weight}</code>
      </div>
      <Text size={type.id} display="inline">{sample || type.sample}</Text>
    </div>)}</div>
    <CodeBlock language="css" code={`font-family: var(--cr-font-sans);\n/* Inter Variable, followed by system fallbacks. */\n\nfont-family: var(--cr-font-mono);\n/* For IDs, branches, and numerical metadata. */`} />
  </>;
}

function SpacingPage() {
  return <><div className="spacing-intro"><div className="spacing-grid-art" aria-hidden="true"><div /><div /><div /><div /></div><div><Badge>FOUR-PIXEL SPACING SCALE</Badge><Text size="heading-2">Spacing tokens</Text><Text size="body">Use multiples of four pixels for component padding, layout gaps, and section spacing.</Text></div></div><div className="spacing-list">{spacing.map(space => <div className="spacing-row" key={space.name}><code>space-{space.name}</code><span>{space.value}px</span><div className="spacing-bar" style={{ '--space-width': `${space.value * 4}px` } as CSSProperties} /><code>var(--cr-space-{space.name})</code></div>)}</div><div className="document-section"><SectionTitle title="Spacing examples" /><div className="spacing-examples">{[{ title: 'Within a component', unit: '8px', description: 'Gap between an icon and its label.', cls: 'spacing-tight' }, { title: 'Between related pieces', unit: '16px', description: 'Gap between related form controls.', cls: 'spacing-normal' }, { title: 'Between sections', unit: '32px', description: 'Gap between separate content sections.', cls: 'spacing-loose' }].map(example => <div className={`spacing-example ${example.cls}`} key={example.unit}><div className="spacing-boxes"><span /><span /></div><Text size="heading-3">{example.title}<code>{example.unit}</code></Text><Text size="body">{example.description}</Text></div>)}</div></div></>;
}

function ElevationPage() {
  return <><SectionTitle title="Border radius tokens" description="Every Chartreuse corner uses --cr-radius-md, so overriding it reshapes the whole interface. Pills and circles use --cr-radius-full. The other steps remain for application CSS." /><div className="radii-grid">{Object.entries(radii).map(([name, value]) => <div className="radius-card" key={name}><div style={{ '--sample-radius': `${value}px` } as CSSProperties} /><Text bold>{name === 'full' ? 'Full' : name.toUpperCase()}</Text><code>--cr-radius-{name}</code><span>{value === 999 ? 'Pill / circle' : `${value}px`}</span></div>)}</div><div className="document-section"><SectionTitle title="Shadow tokens" description="Choose a shadow level according to the surface role." /><div className="shadow-grid">{['sm', 'md', 'lg'].map((size, i) => <div key={size} className="shadow-sample" data-shadow={size}><Layers size={24} aria-hidden="true" /><Text size="heading-3">{['Small shadow', 'Medium shadow', 'Large shadow'][i]}</Text><Text size="body">{['Cards and small controls', 'Floating panels and popovers', 'Dialogs and overlays'][i]}</Text><code>var(--cr-shadow-{size})</code></div>)}</div></div><div className="document-section"><TokenCustomizationGuide /></div></>;
}

function IconsPage() {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState(20);
  const [stroke, setStroke] = useState(1.5);
  const notify = useToast();
  const icons = Object.entries(iconList).filter(([name]) => name.toLowerCase().includes(query.toLowerCase()));
  return <><div className="icon-controls"><TextField type="search" label="Search icons" name="iconSearch" icon={Search} placeholder="Search by icon name…" value={query} onChange={e => setQuery(e.target.value)} /><SegmentedControl label="Size" name="icon-size" options={[16, 20, 24].map(value => ({ value: String(value), label: String(value) }))} value={String(size)} onValueChange={value => setSize(Number(value))} /><Slider label="Stroke" min={1} max={3} step={0.5} value={stroke} onValueChange={setStroke} formatValue={value => `${value}px`} /></div><Text size="body" className="muted small icon-note">{icons.length} icons from Lucide. Click to copy the import.</Text><div className="icon-grid">{icons.map(([name, Icon]) => <button type="button" key={name} onClick={async () => { const ok = await copyText(`import { ${name} } from 'lucide-react';`); notify(ok ? `${name} import copied` : 'Could not copy this import.', ok ? 'success' : 'warning'); }}><Icon size={size} strokeWidth={stroke} aria-hidden="true" /><code>{name}</code></button>)}</div>{icons.length === 0 && <EmptyState icon={Search} title="No matching icons" description="Try a broader icon name, such as layout or circle." />}<div className="document-section"><Alert tone="neutral" title="Icon sizing and labels">Use 16px icons in controls, 20px for navigation, and 24px for larger emphasis. Give every icon-only button an accessible label, and hide decorative icons from assistive technology.</Alert></div><CustomIconGuide /></>;
}

function ButtonsPage() {
  const notify = useToast();
  const [loading, setLoading] = useState(false);
  return <><Showcase title="Button variants" description="Compare button variants and their visual emphasis." code={snippets.buttons}><ButtonDemo /></Showcase><div className="document-section"><SectionTitle title="Button sizes" description="Select a size to match the surrounding controls." /><Showcase title="Sizes & states" code={`<Button size="sm">Small</Button>\n<Button size="md">Default</Button>\n<Button size="lg">Large</Button>\n<Button loading>Saving…</Button>\n<Button disabled>Unavailable</Button>`}><div className="stack"><div className="demo-row"><Button size="sm" onClick={() => notify('Small button selected')}>Small</Button><Button onClick={() => notify('Default button selected')}>Default</Button><Button size="lg" onClick={() => notify('Large button selected')}>Large</Button></div><div className="demo-row"><Button loading={loading} onClick={() => { setLoading(true); window.setTimeout(() => { setLoading(false); notify('Loading simulation complete'); }, 1200); }} icon={Check}>{loading ? 'Saving…' : 'Try loading state'}</Button><Button disabled>Unavailable</Button><Button variant="danger" size="sm" onClick={() => notify('This is a preview of a destructive action', 'warning')}>Delete task</Button></div></div></Showcase></div><ComponentNotes notes={['Lead with a clear verb: Create task, Save changes, Open workspace.', 'Use one primary action in each decision-making context.', 'Loading state shows a spinner and prevents repeat activation.']} /></>;
}

function FormsPage() {
  return <><div className="forms-page-grid"><Showcase title="Task form" description="Submit the example task form." code={snippets.forms}><FormDemo /></Showcase><div className="stack"><Showcase title="Field states" code={`<TextField label="Workspace" placeholder="Choose a workspace" />\n<TextField label="Branch" error="Use letters, numbers, or hyphens." />\n<TextField label="Repository" value="sample-app" disabled />`}><div className="stack"><TextField label="Workspace" placeholder="Choose a workspace" /><TextField label="Branch" defaultValue="my new branch" error="Use letters, numbers, or hyphens." /><TextField label="Repository" defaultValue="sample-app" disabled /></div></Showcase><Showcase title="Checkbox and switch" code={`<Checkbox label="Create a worktree" defaultChecked />\n<Switch label="Live updates" defaultChecked />`}><div className="stack"><Checkbox label="Create a worktree" hint="Example option for creating a task worktree." defaultChecked /><Switch label="Live updates" hint="Toggle the example live-update setting." defaultChecked /><Checkbox label="Optional follow-up" disabled /></div></Showcase></div></div><div className="document-section"><AutocompleteDemo /></div><div className="document-section"><Showcase title="Message composer" description="Compose a draft and submit it with the send action." code={snippets.composer}><MessageComposerDemo /></Showcase></div><div className="document-section"><FilePickerDemo /></div><ComponentNotes notes={['Associate each field with a visible label.', 'Use persistent hints for context, and a specific message to explain errors.', 'Native validation runs on submission. Custom error messages should clear as the user corrects the value.']} /></>;
}

function BadgesPage() {
  return <><Showcase title="Status badges" code={snippets.badges}><div className="badge-gallery"><Badge dot>To do</Badge><Badge tone="info" dot>In progress</Badge><Badge tone="warning" dot>In review</Badge><Badge tone="success" icon={Check}>Done</Badge><Badge tone="danger" icon={X}>Failed</Badge></div></Showcase><div className="document-section"><SectionTitle title="Avatars and progress" description="Display assignees and task completion." /><div className="two-column"><Showcase title="Avatars" code={`<Avatar name="Alex Morgan" />\n<AvatarGroup names={['Alex Morgan', 'Sam Lee', 'Jamie Park', 'Taylor Reed']} />`}><div className="demo-row"><Avatar name="Alex Morgan" size="lg" /><Avatar name="Sam Lee" color="peach" /><Avatar name="Jamie Park" size="sm" color="blue" /><span className="sample-separator" /><AvatarGroup names={['Alex Morgan', 'Sam Lee', 'Jamie Park', 'Taylor Reed', 'Robin Chen']} /></div></Showcase><Showcase title="Progress" code={`<Progress value={3} max={5} label="3 of 5 tasks complete" />`}><div className="progress-demo"><span><CheckCheck size={15} aria-hidden="true" />3 of 5 complete<Badge tone="success">60%</Badge></span><Progress value={3} max={5} label="3 of 5 tasks complete" /><Text size="body">3 of 5 tasks are complete.</Text></div></Showcase></div></div><ComponentNotes notes={['Express status with text alongside a dot or icon.', 'Keep labels short and consistent across the workspace.', 'Progress uses the native progress element so its value is available to assistive technology.']} /></>;
}

function CardsPage() {
  return <><div className="two-column"><Showcase title="Task card" description="Task identifier, status, branch, and checklist progress." code={snippets.cards}><div className="task-preview-wrap"><TaskPreview /></div></Showcase><Showcase title="Agent card" description="Current task, token usage, and elapsed time." code={snippets.agent}><AgentMonitor compact /></Showcase></div><div className="document-section"><SectionTitle title="Base card composition" /><Showcase title="Base card" code={`import { Card, Text } from '@chartreuse/ui';\n\n<Card>\n  <Text size="heading-3">Workspace summary</Text>\n  <Text size="body">Group related information in a card surface.</Text>\n</Card>`}><Card className="base-card-demo"><span className="base-card-icon"><Sparkles size={23} aria-hidden="true" /></span><Text size="heading-3">Workspace summary</Text><Text size="body">Group related information in a card surface.</Text><Badge tone="success">Example</Badge></Card></Showcase></div><ComponentNotes notes={['Use a full-width button inside a task card for its primary interaction.', 'Keep actions distinct from metadata, and avoid nesting interactive controls.', 'Use the base Card to group related content.']} /></>;
}

function NavigationPage() {
  const tabItems = [{ value: 'board', label: 'Board', icon: LayoutDashboard, count: 4, content: <div className="navigation-demo-content"><LayoutDashboard size={26} aria-hidden="true" /><Text size="heading-3">Task board</Text><Text size="body">Tasks grouped by status.</Text></div> }, { value: 'activity', label: 'Activity', icon: Network, content: <div className="navigation-demo-content"><Network size={26} aria-hidden="true" /><Text size="heading-3">Workspace activity</Text><Text size="body">Task updates, branch changes, and comments.</Text></div> }, { value: 'settings', label: 'Settings', icon: Settings, content: <div className="navigation-demo-content"><Settings size={26} aria-hidden="true" /><Text size="heading-3">Workspace settings</Text><Switch label="Live updates" defaultChecked /></div> }];
  return <><Showcase title="Workspace tabs" description="Use the arrow keys to switch between views." code={snippets.navigation}><Tabs label="Example workspace views" items={tabItems} /></Showcase><div className="document-section"><div className="two-column"><Showcase title="Segmented tabs" code={`<Tabs variant="pill" label="View mode" items={items} />`}><Tabs label="Example view mode" variant="pill" items={tabItems.slice(0, 2)} /></Showcase><Showcase title="Breadcrumbs" code={`<Breadcrumbs items={[\n  { label: 'All tasks', href: '#overview' },\n  { label: 'Workspace', href: '#workspace' },\n  { label: 'Workspace task board' },\n]} />`}><div className="breadcrumb-demo"><Breadcrumbs items={[{ label: 'All tasks', href: '#overview' }, { label: 'Workspace', href: '#workspace' }, { label: 'Workspace task board' }]} /></div></Showcase></div></div><ComponentNotes notes={['Tabs show content within the current page. Use links to move between pages.', 'Arrow keys, Home, and End move between tabs. Selection follows focus.', 'An underline identifies the selected tab. The tab list scrolls when space is limited.']} /></>;
}

function FeedbackPage() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const notify = useToast();
  return <><Showcase title="Alert variants" code={snippets.feedback}><div className="stack"><Alert tone="success" title="All changes saved">Your workspace is up to date.</Alert><Alert tone="info" title="Agents running">Agents are processing their assigned tasks.</Alert>{!dismissed && <Alert tone="warning" title="Review required" onDismiss={() => setDismissed(true)}>One task is ready for review.</Alert>}<Alert tone="danger" title="Connection interrupted">Retry the request when the connection is available.</Alert></div></Showcase><div className="document-section"><div className="two-column"><Showcase title="Dialog" code={snippets.dialog}><div className="feedback-action-demo"><span className="base-card-icon"><Layers size={23} aria-hidden="true" /></span><Text size="body">Open the example dialog.</Text><Button variant="secondary" onClick={() => setOpen(true)} iconRight={ArrowUpRight}>Open dialog</Button></div></Showcase><Showcase title="Toast notification" code={snippets.feedback}><div className="feedback-action-demo"><span className="base-card-icon"><Bell size={23} aria-hidden="true" /></span><Text size="body">Display the result of a user action.</Text><Button variant="secondary" onClick={() => notify('Task created')} icon={Check}>Show notification</Button></div></Showcase></div></div><div className="document-section"><div className="two-column"><Showcase title="Empty state" code={`<EmptyState\n  icon={Sparkles}\n  title="No tasks"\n  description="Create a task to populate this workspace."\n/>`}><EmptyState icon={Sparkles} title="No tasks" description="Create a task to populate this workspace." /></Showcase><Showcase title="Loading state" code={`<div aria-busy="true" aria-label="Loading task">\n  <Skeleton />\n  <Skeleton />\n</div>`}><div className="skeleton-demo" aria-busy="true" aria-label="Loading example task"><div><Skeleton /><Skeleton /></div><Skeleton /><Skeleton /><Skeleton /><div className="demo-row"><Spinner label="Loading example content" /><span className="muted small">Loading example content…</span></div></div></Showcase></div></div><Dialog open={open} onOpenChange={setOpen} title="Example dialog" description="Native dialog with cancel and confirm actions." footer={<><Button variant="secondary" onClick={() => setOpen(false)} autoFocus>Cancel</Button><Button icon={Check} onClick={() => { setOpen(false); notify('Example confirmed'); }}>Confirm</Button></>}><div className="dialog-example-illustration"><BrandMark /><Text size="body">Confirm to close this example dialog.</Text></div></Dialog></>;
}

function ComponentNotes({ notes }: { notes: string[] }) {
  return <div className="component-notes"><Text size="heading-2"><ShieldCheck size={17} aria-hidden="true" />Implementation notes</Text><ul>{notes.map(note => <li key={note}><Check size={13} aria-hidden="true" /><span>{note}</span></li>)}</ul></div>;
}

function GettingStarted({ navigate }: { navigate: Navigate }) {
  return <>
    <div className="getting-started-banner"><BrandMark /><div><Text size="heading-2">Install and configure Chartreuse</Text><Text size="body">React 19 components with TypeScript props and a shared CSS stylesheet.</Text></div><Badge>v{chartreuseVersion}</Badge></div>
    <Steps className="getting-started-steps" aria-label="Get started with Chartreuse" items={[
      { id: 'install', title: <Text size="heading-2">Configure package access and install</Text>, content: <><Text size="body">Configure the consuming application’s .npmrc. Replace OWNER with the lowercase GitHub repository owner and set NODE_AUTH_TOKEN to a classic GitHub token with read:packages. For private packages, the token owner also needs read access to the package. The npm alias preserves @chartreuse/ui imports.</Text><CodeBlock language="ini" code={snippets.registry} /><CodeBlock language="sh" code={snippets.install} /></> },
      { id: 'compose', title: <Text size="heading-2">Import components and styles</Text>, content: <><Text size="body">Import @chartreuse/ui/styles.css once at your application entry. Wrap components that use notifications in ToastProvider.</Text><CodeBlock code={snippets.basic} /><div className="demo-row"><Button variant="secondary" size="sm" iconRight={ArrowRight} onClick={() => navigate('components/workspace-layout')}>Compose a workspace layout</Button></div></> },
      { id: 'tokens', title: <Text size="heading-2">Use semantic CSS variables</Text>, content: <><Text size="body">Reference semantic CSS variables for text, surfaces, spacing, and radii. Semantic color tokens adapt to the active color scheme. To change a token itself, such as the corner radii across the whole app, declare it on :root in unlayered application CSS; the design tokens page explains when to use :root or a wrapper.</Text><CodeBlock language="css" code={`.my-workspace {\n  color: var(--cr-color-text);\n  background: var(--cr-color-canvas);\n  padding: var(--cr-space-6);\n  border-radius: var(--cr-radius-md);\n}`} /><div className="demo-row"><Button variant="secondary" size="sm" iconRight={ArrowRight} onClick={() => navigate('tokens')}>View design tokens</Button><Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => navigate('elevation')}>Customize radius tokens</Button><Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => navigate('buttons')}>Browse components</Button></div></> },
    ]} />
    <Alert tone="neutral" title="Package distribution">The release workflow publishes @OWNER/chartreuse to GitHub Packages. Registry authentication is required, including for public packages. React and React DOM 19 are peer dependencies provided by the application.</Alert>
  </>;
}

const releases = [
  {
    version: '1.27.0',
    date: '2026-11-27',
    title: 'Dashed empty-state tiles and even Disclosure insets',
    summary: 'The dashed EmptyState keeps the default icon tile, and Disclosure takes contentInset for an even content inset.',
    changes: [
      'EmptyState variant="dashed" shows the same 58px tinted icon tile and 26px icon as the default variant, with 16px between the tile and the heading. The dashed border, tighter padding and smaller heading are unchanged.',
      'Disclosure contentInset="even" gives the revealed content the summary’s 20px start padding on both sides. The default, "aligned", keeps the content lined up with the title past the chevron.',
    ],
  },
  {
    version: '1.26.1',
    date: '2026-11-27',
    title: 'Flush List and Tree rows',
    summary: 'List row variants and Tree take flush, which drops their 4px outer padding so rows line up with the content around them. The default is unchanged.',
    changes: [
      'flush on List (outline and plain) and Tree removes the 4px outer padding, so each row’s border sits on the container’s content edge, in line with a search field or heading above it.',
      'Row hover, the selected surface and an app focus ring all draw inside the row, so flush rows are never clipped by a scrolling ancestor.',
    ],
  },
  {
    version: '1.26.0',
    date: '2026-11-27',
    title: 'Selectable List rows shared with Tree',
    summary: 'List gains outline and plain row variants with free content, button or link rows, single selection and size props. Tree and List now share one row stylesheet. The default List is unchanged.',
    changes: [
      'List variant="outline" and variant="plain" draw each item as a Tree-style row. An item’s content can be any layout, such as a Flex, and the whole row activates through a native button or link stretched over it.',
      'Rows select with selectedId, defaultSelectedId and onSelectionChange, or per item with selected; the selected row is marked aria-current="true". Link rows take href.',
      'minWidth, maxWidth, minHeight and maxHeight size the list and each row. A row taller than its maxHeight clips; a list taller than its maxHeight scrolls.',
      'Tree and List rows share one stylesheet, so their padding (16px, or 12px under 400px wide), borders, hover and selected states match exactly. Each List resolves its padding against its own width, including inside Flex.',
      'A selected Tree row keeps its surface when hovered again, fixing a regression from 1.25.3.',
    ],
  },
  {
    version: '1.25.3',
    date: '2026-11-27',
    title: 'Clickable Tree chevrons',
    summary: 'A Tree branch’s chevron now expands or collapses it on click without selecting it. No props or markup change.',
    changes: [
      'Clicking a Tree branch’s chevron toggles that branch without changing the selection, so an unselected branch no longer needs a click to select it first. Row clicks and keyboard behaviour are unchanged, and the chevron stays out of the tab order.',
      'The chevron shows a pointer cursor and its own ghost hover in normal and selected rows; its row drops its hover background meanwhile.',
    ],
  },
  {
    version: '1.25.2',
    date: '2026-11-27',
    title: 'Inline MessageComposer height after a width change',
    summary: 'Fixes an inline MessageComposer that kept a stale height after it widened. No props or markup change.',
    changes: [
      'An inline MessageComposer now measures its field again when its width changes, so an empty field whose placeholder wrapped while narrow returns to one row once it widens, and a draft rewraps to its new height.',
    ],
  },
  {
    version: '1.25.1',
    date: '2026-11-27',
    title: 'Even insets in TaskCard counts and CommentThread',
    summary: 'Restores the TaskCard counts row height in default density and gives CommentThread content 16px from every edge. No props or markup change.',
    changes: [
      'In default density, a TaskCard count shown in Tooltip no longer makes the counts row taller: its 24px target overhangs the text line, as it already did in compact density, so the row’s bottom inset matches its top.',
      'CommentThread’s card region and reply band now keep 16px between their content and each card edge, so a reply composer at the bottom of a thread is no longer 12px from the edge. Narrow threads keep their tighter spacing.',
    ],
  },
  {
    version: '1.25.0',
    date: '2026-11-27',
    title: 'TaskCard actions, icon checklist progress and count tooltips',
    summary: 'Adds an actions slot and an icon checklist display to TaskCard, and shows icon-only counts in Tooltip. Cards without the new props render the same markup as before.',
    changes: [
      'TaskCard takes actions: controls shown at the right end of the counts row, outside the card’s main button, so a card can carry its own buttons. Clicking an action never runs the card’s onClick or follows its href, and the row keeps its height.',
      'TaskCard progressDisplay accepts "icon": a checklist icon with the completed/total ratio, shown as one item in the counts row.',
      'Counts shown as an icon and number only (hideMetadataLabels, compact density and the icon checklist) now show their full label in Tooltip instead of a native title.',
    ],
  },
  {
    version: '1.24.1',
    date: '2026-11-26',
    title: 'Vertical scrolling over wide Markdown tables and code blocks',
    summary: 'Fixes MarkdownRenderer tables and code blocks that stopped the page or panel behind them from scrolling. No props or markup change.',
    changes: [
      'A MarkdownRenderer table or code block wider than its container no longer traps the vertical wheel. Both now set overscroll-behavior-inline: contain instead of overscroll-behavior: contain, as Table already does, so sideways overscroll stays in the block while vertical scrolling passes to the page or panel around it, such as a narrow chat panel.',
    ],
  },
  {
    version: '1.24.0',
    date: '2026-11-25',
    title: 'Menu, CommentThread, RunStatus, inline MessageComposer, and Markdown clamp',
    summary: 'Adds three components, Menu, CommentThread, and RunStatus, plus an inline MessageComposer layout, a MarkdownRenderer line clamp, an icon-only SplitButton, and highlighted and danger-footer Cards. All additions are opt-in; existing defaults and markup are unchanged.',
    changes: [
      "Menu is a new action menu behind a trigger button (⋯ by default), with icon items, separators, disabled items, and tone: 'danger'. It follows the menu button keyboard pattern: arrow keys, Home and End, typeahead, Escape returning focus to the trigger, and Tab closing it. It uses the option-list popup surface and, like the rest of the library, draws no focus styles.",
      'CommentThread is a new component: a comment in a Card with its replies in a tinted band below, each marked by a 2px start rule. Header rows hold the sender Badge, a reference, the time and meta, and an actions slot. Only the latest visibleReplies (2) show until "Show N earlier replies"; Collapse hides the replies while its toggle stays in place and reads Expand, with a summary in the bar. Below 360px it tightens its padding and shows time.shortLabel.',
      'A CommentThread reply can carry ask: a quiet "You asked" line above the reply in the same item, with the agent summary, its own reference, time, actions, anchor id, and a 2-line clamp. Leave out the reply body to show the ask with a running status before the agent answers.',
      'RunStatus is a new live row for running work: a spinner, the current step, the elapsed time, and an optional Stop button that goes icon-only below 360px. Only the step is announced, never the timer.',
      'MessageComposer adds layout="inline": the field, controls, and send share one row with no footer. The field grows with the draft, and once the draft no longer fits beside the controls it takes the full width with the controls on the line below.',
      'MarkdownRenderer adds maxLines, expandLabel, and collapseLabel. The content clamps with a fade, and the toggle appears only when it overflows; focusing a link past the edge expands it.',
      'SplitButton adds iconOnly (true or \'narrow\'). \'narrow\' shows only the action icon in a size container under 360px, such as an inline MessageComposer, keeping the text as the accessible name.',
      'Card adds highlighted, a focus-colour ring for a card opened from a link, and footerTone="danger", a tinted footer for inline confirmations. A CommentThread footer sets its text to the comment body size.',
    ],
  },
  {
    version: '1.23.0',
    date: '2026-11-25',
    title: 'Spinner keeps its size and aligns to the first line',
    summary: 'Fixes Spinner shrinking beside truncating text in a flex row, and adds an opt-in align prop. No markup changes for existing spinners.',
    changes: [
      'Spinner no longer shrinks in a flex row: it and its icon keep their size beside text that truncates or wraps. Before, a truncating sibling could squeeze it to a sliver.',
      'Spinner adds align. align="first-line" makes it one line tall and aligns it to the start of the row, so it stays centered on the first line of wrapping text. It uses its container\'s line height.',
    ],
  },
  {
    version: '1.22.0',
    date: '2026-11-25',
    title: 'Headerless AgentActivity lists and Tree chevrons after titles',
    summary: 'AgentActivity lists can drop their heading row, with a countAgentActivity helper for host headers, and Tree can place its chevron after the title. Both additions are opt-in. Tree chevrons are no longer a separate click target: a click selects a row, and a click on the selected branch expands or collapses it.',
    changes: [
      'AgentActivity adds header for variant="list". header={false} removes the heading row, its status counts, and the collapse footer, keeps every row visible without the left connector, and keeps label as the group name. Row details, streaming output, and announce work as before.',
      'countAgentActivity(events) returns { total, queued, running, completed, failed, interrupted, info }, counted as rows show them: a missing status is info and a nonzero exitCode is failed.',
      'Tree adds togglePosition="end", which places the chevron after the title and reserves no space on leaf rows. renderNode receives state.toggle to place beside its own title; unused, the chevron ends the row\'s first line.',
      'Tree adds alignLeaves. With the default start position, alignLeaves={false} drops the empty 24px chevron slot on leaf rows.',
      'Tree chevrons are decoration only and lose their hover background. The first click on a row selects it, including on the chevron; a click on the selected branch expands or collapses it. Before, a chevron click toggled without selecting. Keyboard behavior is unchanged.',
    ],
  },
  {
    version: '1.21.0',
    date: '2026-11-25',
    title: 'Quote selected Conversation text into MessageComposer',
    summary: 'Conversation adds an opt-in onQuote prop that shows a Quote button beside selected message text, and MessageComposer adds insertQuote and formatQuote helpers that add it to the draft as a Markdown blockquote. Without onQuote, Conversation is unchanged apart from a data-message-id attribute on each message body.',
    changes: [
      'Conversation adds onQuote(text, message) and quoteLabel (default "Quote"). A Quote button appears below text selected within one message body and hides when the selection collapses or spans several messages. Tab reaches it after a pointer selection, and Escape dismisses it. Markdown messages give the selection as Markdown, keeping emphasis, inline code, links, lists, tables and fenced code; text messages give plain text.',
      'insertQuote(textarea, text) adds text to a MessageComposer, given its ref, as a Markdown blockquote followed by a blank line. It inserts at the cursor the composer last had, or appends when it was never focused, then focuses the composer with the cursor after the quote. Command/Ctrl+Z removes it. formatQuote(text) returns the quote text alone.',
    ],
  },
  {
    version: '1.20.1',
    date: '2026-11-25',
    title: 'Truncated Table cells with onRowClick',
    summary: 'Fixes truncate on Table cells whose row link is a button. No props or markup change.',
    changes: [
      'Table columns with truncate now end in an ellipsis when onRowClick renders the row link as a button, including a row-header column with no width. Before, the button kept its full text width and spilled into the next columns. Row links from getRowHref also fill their cell explicitly.',
    ],
  },
  {
    version: '1.20.0',
    date: '2026-11-25',
    title: 'SplitButton divider option and clickable Table group headings',
    summary: 'SplitButton adds an opt-in divider prop to hide the line between its segments. Collapsible Table groups now toggle from a click anywhere on the heading row; the chevron stays the keyboard and accessible control.',
    changes: [
      'SplitButton adds divider (default true). divider={false} hides the line between the action and menu segments, including the action’s end border, while keeping the 1px join, so size and alignment do not change. Forced-colors mode still outlines each segment.',
      'Table groups with a collapse prop toggle when any part of the heading row is clicked, and show a pointer and hover background. The action keeps its own clicks and hover, dragging to select heading text does not toggle, and the chevron keeps aria-expanded and aria-controls as the only keyboard control. Heading rows of collapsible groups carry data-collapsible.',
    ],
  },
  {
    version: '1.19.0',
    date: '2026-11-24',
    title: 'Contained Dialog, one-line AgentActivity rows, and a quieter composer footer',
    summary: 'Dialog adds an opt-in container prop for a non-modal dialog over one region of the page. AgentActivity rows with titleLines="single" now stay on one line in narrow containers, and MessageComposer no longer reflows its footer while a send is pending with the hint hidden.',
    changes: [
      'Dialog adds container: pass an element, such as WorkspaceContent, to open the dialog with show() over that element only. It has no backdrop, square corners, and no shadow, follows the element as it moves or resizes, closes on Escape, and returns focus to the opener. null keeps it closed until the element exists; size, maxWidth, and freezeHeight do not apply.',
      'AgentActivity with titleLines="single" keeps each row on one line at every width: the title ends in an ellipsis and the duration, status, and chevron stay beside it. Rows also carry data-single-line. The default titleLines="multiple" still moves the status under the title in containers 440px or narrower.',
      'MessageComposer with hint={null} or false announces “Sending message…” to assistive technology only, so the footer layout no longer changes while a send is pending. A visible hint is still replaced by that text.',
    ],
  },
  {
    version: '1.18.0',
    date: '2026-11-24',
    title: 'SplitButton',
    summary: 'Adds SplitButton, a primary action joined to a menu segment that opens choices or custom popover content. It is a new, opt-in component; existing components keep their props, markup, and visuals.',
    changes: [
      'SplitButton joins an action Button to a menu segment that opens the ButtonSelect popover: pass options with value and onValueChange, or content for custom controls with close().',
      'Button props such as onClick, icon, disabled, title, and loading apply to the action segment. menuLabel names the menu segment, menuDisabled disables it independently, and groupLabel overrides the group name.',
      'Both segments take the Button variant (primary, secondary, accent, ghost, or danger) and size, so an sm SplitButton matches an sm Button or MessageComposer send button. The segments share one border at the seam, drawn in --cr-split-button-divider.',
      'The popover aligns to the start of the whole control. Enter, Space, or ArrowDown opens the menu segment, and Escape closes it and returns focus.',
    ],
  },
  {
    version: '1.17.1',
    date: '2026-11-24',
    title: 'No empty band under overflowing tabs',
    summary: 'Fixes a blank strip under overflowing Tabs on platforms with classic scrollbars, such as Windows. Markup and props are unchanged.',
    changes: [
      'Tabs hides its scrollbar with scrollbar-width: none, so a row that overflows no longer reserves scrollbar height and the selected underline sits on the bottom border.',
      'A horizontal wheel or trackpad scroll still reveals the scrollbar where scrollbars overlay the content, as on macOS. Classic scrollbars stay hidden so the row never grows. Drag-to-scroll and keyboard selection are unchanged.',
    ],
  },
  {
    version: '1.17.0',
    date: '2026-11-24',
    title: 'Segmented navbar links, one corner radius, and popup fixes',
    summary: 'Adds NavbarItemGroup and NavbarItem icons. Every corner now reads --cr-radius-md, which changes default corner sizes. Popups keep the page palette, and option descriptions move to a second line.',
    changes: [
      'NavbarItemGroup groups NavbarItem links. variant="segmented" draws a page switcher whose aria-current="page" link is filled, on both Navbar surfaces. iconOnly keeps each label as the accessible name and title. Restyle it with the --cr-navbar-segment-* hooks.',
      'NavbarItem adds an icon prop shown before its label.',
      'Every corner in the library now reads --cr-radius-md (7px), so one override reshapes the whole interface. Cards, toasts, popups and panels were 10px, dialogs and page panels 14px, and badges and some highlights 4px. Containers around inset highlights add their inset: option popups use --cr-radius-md + 6px, and segmented tracks, pill tab lists and segmented navbar groups use + 4px. --cr-radius-sm, -lg and -xl remain for application CSS.',
      'Select, Autocomplete and ButtonSelect popups restore the root --cr-color-* tokens and color scheme. A trigger in an evergreen Navbar or a recolored wrapper keeps a default popup. Recolor a popup on :root or on the popup itself.',
      'Option descriptions in Select, Autocomplete and ButtonSelect render on a second line under the label in smaller muted text, with the checkmark centered. Option text truncates with an ellipsis past 30rem.',
      'Segmented NavbarItemGroup links draw a focus ring, and grow to 44px on coarse pointers.',
      'A collapsible md TextField stays square at 44px on coarse pointers.',
      'The Design tokens and Radius & elevation pages explain how to customize tokens: :root for app-wide changes, a wrapper for one feature, and why unlayered CSS wins.',
    ],
  },
  {
    version: '1.16.4',
    date: '2026-11-23',
    title: 'Aligned collapsed lane dots',
    summary: 'A fix for collapsed Swimlane rails, whose dot sat higher than the dots of the expanded lanes beside them. Nothing else changes.',
    changes: [
      'The collapsed Swimlane toggle now has 12px top padding, so its dot is centered on the 32px header row of expanded collapsible lanes. It sat 2px high before.',
      'In a SwimlaneGroup that has a collapsible lane, every lane header now has a 32px row. Lanes that could not collapse had a 24px row, so their dots sat 4px higher and their headers were shorter than their neighbours\'.',
    ],
  },
  {
    version: '1.16.3',
    date: '2026-11-23',
    title: 'Aligned compact lane headers',
    summary: 'A fix for compact Swimlane headers, which sat 6px further in than the lane content. Nothing else changes.',
    changes: [
      'Swimlane with density="compact" now pads its header 8px on both sides, matching the lane body. The title was 14px in, so the dot or tag sat 6px right of the cards and empty state, and the collapse button sat 2px inside their right edge.',
    ],
  },
  {
    version: '1.16.2',
    date: '2026-11-23',
    title: 'Centered Table group headings and quieter row links',
    summary: 'Two Table fixes. Nothing else changes.',
    changes: [
      'Table group heading rows in the comfortable density now have even padding (11px top and bottom, 20px sides). Their content was 3px low before. The row stays 55px tall.',
      'Row header links and buttons in an interactive Table no longer underline on hover. The whole row is the click target and already has its own hover background.',
    ],
  },
  {
    version: '1.16.1',
    date: '2026-11-23',
    title: 'Square large icon buttons',
    summary: 'A fix for large icon buttons, which took the text button padding and rendered as wide rectangles. Nothing else changes.',
    changes: [
      'IconButton with size="lg" is now a 46px square, matching the 32px sm and 40px md squares. It previously inherited the text button\'s 1.25rem side padding, so large Navbar sidebar toggles were about 59px wide and sat further from the side edge than from the top and bottom.',
      'The Navbar workspace example adds a Size control to show the large toggles.',
    ],
  },
  {
    version: '1.16.0',
    date: '2026-11-23',
    title: 'Collapsible text fields, composer controls, and even sidebar toggles',
    summary: 'TextField can collapse to a square icon control, and MessageComposer takes footer controls; both are opt-in. Workspace Navbar sidebar toggles change their default icons, drop the open-state highlight, and use a tighter side inset, and MessageComposer uses tighter padding.',
    changes: [
      'TextField adds collapsible. While empty and unfocused the field is a square icon control the size of its size preset; on focus it expands to the free space in a flex row or the full width of a block container. It stays open while it has a value and collapses on blur, or on Escape while empty. The label is always visually hidden.',
      'MessageComposer adds controls, a slot at the start of the footer for controls such as a ButtonSelect for the model or mode, kept apart from the hint. The textarea and footer padding is tighter.',
      'Workspace Navbar sidebar toggles default to a Menu icon on the left and a PanelRight icon on the right. toggleIcon and openToggleIcon still replace them.',
      'Workspace Navbar sidebar toggles no longer show a highlight while their sidebar is open; aria-expanded still reports the state.',
      'A workspace Navbar end with a sidebar toggle uses the same inline padding as its block padding, so the toggle sits as far from the side edge as from the top and bottom.',
    ],
  },
  {
    version: '1.15.0',
    date: '2026-11-23',
    title: 'Collapsible lanes, category colors, chips, and grouped tables',
    summary: 'Swimlanes can collapse and sit in a shared SwimlaneGroup, a categorical palette and accent prop color lanes and badges, and new ToggleChip, ChipGroup, and SegmentedProgress components support kanban, compact, and grouped-table boards. Every addition is opt-in. Existing Swimlane titles now stay on one line and truncate in narrow lanes; otherwise existing markup is unchanged.',
    changes: [
      'Tokens add an eight-color categorical palette, --cr-color-cat-1 to --cr-color-cat-8, with light and dark values. Badge, Swimlane, TaskCard, ToggleChip, SegmentedProgress, and Table groups take accent="cat-N" to use them.',
      'Swimlane adds collapsible, collapsed, defaultCollapsed, and onCollapsedChange. A collapsed lane becomes a 48px rail with its action, a vertical title, and its count; its expand button is named "Expand {title}, {count} items", and itemLabel changes the noun. Focus moves between the collapse and expand buttons.',
      'Swimlane adds headerStyle="dot", variant="flush", and density="compact". The new SwimlaneGroup lays lanes side by side as a labelled region, either on one bordered surface or as separate cards, and scrolls horizontally when they do not fit. Set laneWidth to give every expanded lane a fixed width.',
      'Swimlane titles stay on one line and truncate with an ellipsis when a lane is too narrow, so the action and collapse button always stay on the first header row and every header in a row has the same height. The title text is wrapped in span.cr-swimlane-title (h3.cr-swimlane-title for headerStyle="dot"). Set SwimlaneGroup laneWidth to keep titles whole on boards with many stages.',
      'SwimlaneGroup clips visually hidden text of lanes scrolled out of view, so a collapsed lane past the edge no longer widens the page.',
      'ToggleChip is a compact native button with an optional dot, label, and count; pressed sets aria-pressed for filters, and variant="dashed" with addIcon suits add actions. ChipGroup groups chips with role="group".',
      'SegmentedProgress shows a stacked bar of categories with an accessible name that lists every segment, plus an optional static or interactive legend.',
      'Progress adds size="sm" | "md" | "lg" for 4px, 6px, and 8px bars, the same sizes SegmentedProgress takes. Progress defaults to sm with unchanged markup; SegmentedProgress defaults to lg.',
      'Table group headings add count, tone, accent, action, and collapsible groups with collapsedSummary. Columns add width, truncate, and getTitle; rows add getRowHref and onRowClick; and density="comfortable" sets 48px rows.',
      'TaskCard accepts any status string with statusLabel, statusTone, and statusAccent, and adds hideStatus, progressDisplay, descriptionLines, completedState, href, selected, and density="compact".',
      'List items add href and onClick to make the whole item a link or button.',
      'Button adds variant="dashed" for add actions such as an empty lane.',
      'The Swimlane and Table pages add kanban board, compact board, fixed-lane-width, and grouped table recipes built only from library components.',
    ],
  },
  {
    version: '1.14.0',
    date: '2026-11-23',
    title: 'Persistent workspace sidebars and link buttons',
    summary: 'Workspace sidebars drop the pin button and stay open until toggled, sidebar toggles can change icon when open, and Button adds a link variant.',
    changes: [
      'Workspace Navbar sidebars no longer have a pin button. A sidebar stays open until its Navbar toggle closes it; clicking the center and pressing Escape leave it open. The pinned, defaultPinned, and onPinnedChange props are removed.',
      'Navbar sidebars add storageKey to remember the open state in localStorage across visits.',
      'Navbar sidebars add openToggleIcon to show a different toggle icon while open. The Navbar reference now lists every sidebar field, including toggleIcon.',
      'Workspace sidebar headers are at least as tall as the Navbar and grow when their content wraps.',
      'Button adds variant="link": a native button that reads as link-colored text, with no padding, border, text decoration, or hover background, so it can sit inside a sentence.',
    ],
  },
  {
    version: '1.13.0',
    date: '2026-11-23',
    title: 'List component, icon avatars, and hidden text field labels',
    summary: 'A new List component renders semantic bulleted and numbered lists, avatars can show icons, and text fields can hide their labels.',
    changes: [
      'List renders a semantic ul, or a numbered ol with ordered and start. Items take a title, description, icon or leading content such as an Avatar, tone, and trailing content. Set size="sm", dividers, or marker="none" to adjust the layout.',
      'Avatar adds icon to show a decorative icon instead of initials; the name stays the accessible label. AvatarGroup takes items with a name and optional icon in place of names.',
      'TextField and TextArea add hideLabel, matching Select, Slider, and SegmentedControl. The label is hidden visually but remains the control’s accessible name.',
      'The documentation sidebar now uses List for its navigation groups.',
    ],
  },
  {
    version: '1.12.0',
    date: '2026-11-23',
    title: 'Full-width controls, draggable tabs, and composer send sizes',
    summary: 'Fields and buttons can fill flex rows, overflowing tabs scroll by dragging, and the composer send button comes in three sizes.',
    changes: [
      'Button, ButtonSelect, TextField, TextArea, Select, Autocomplete, NumberInput, and Slider add fullWidth. It stretches the control to its container, including inside flex rows.',
      'When tabs overflow, hold down a tab and drag sideways to scroll the row. The tab scrollbar stays hidden until horizontal wheel or trackpad scrolling briefly reveals it.',
      'MessageComposer adds sendSize: sm, md, or lg for a 32px, 36px, or 44px send button. The default md keeps the current 36px size, and coarse pointers always get a 44px target.',
      'The chartreuse CLI adds setup, foundation, and choosing guides, more accurate search with name suggestions, and self-contained usage examples. JSON output stays at schemaVersion 1.',
    ],
  },
  {
    version: '1.11.0',
    date: '2026-11-21',
    title: 'ButtonSelect and Autocomplete popup sizing',
    summary: 'Narrow controls can show the full option text when the viewport has room.',
    changes: [
      'ButtonSelect and Autocomplete match Select’s fixed row height. Each label and its optional description share one line.',
      'Built-in popups start at the trigger width and expand within the viewport to fit longer options.',
      'Autocomplete adds matchTriggerWidth. Enable it on either picker to keep the trigger width and truncate overflow with an ellipsis. Pass it explicitly on ButtonSelect to retain the width behavior from 1.10.0.',
    ],
  },
  {
    version: '1.10.0',
    date: '2026-11-21',
    title: 'Select popup sizing and optional checkmarks',
    summary: 'Select popups fit longer options on one line. Autocomplete, ButtonSelect, and Select let you choose whether to show a selection icon.',
    changes: [
      'Select uses fixed-height, single-line rows. The popup matches the trigger width and expands within the viewport for longer options. Grouped choices are indented under their labels.',
      'Autocomplete, ButtonSelect, and Select hide the selection checkmark by default. Pass checkmark for the standard icon or pass a custom icon.',
      'Removed keyboard-only focus marks and the green outlines from FilePicker and PathSelector. Active text inputs use the feathered border.',
    ],
  },
  {
    version: '1.9.0',
    date: '2026-11-21',
    title: 'Shared option pickers and active states',
    summary: 'Select, ButtonSelect, and Autocomplete share a popup design. A common palette styles active controls across light and dark themes.',
    changes: [
      'ButtonSelect accepts an options array and shows the selected label on the trigger. The built-in popup matches the trigger width by default. Use content to render a custom picker.',
      'Single-choice Select uses the shared popup with native option groups, form values, and validation. Set multiple or a numeric size greater than one for an inline listbox.',
      'AgentActivity list mode adds a group heading with status counts. Lists with more than six events can collapse from the heading or footer. The footer also jumps back to the heading.',
      'The --cr-color-active, --cr-color-on-active, and --cr-color-active-border tokens set the active palette. MessageComposer uses the shared field focus styling.',
    ],
  },
  {
    version: '1.8.0',
    date: '2026-11-20',
    title: 'Workspace navigation, tables, and ButtonSelect sizing',
    summary: 'Build workspaces with pinnable sidebars, display grouped data in a table, and control how ButtonSelect sizes its popover.',
    changes: [
      'Navbar adds variant="workspace" with optional full-height sidebars. Use surface="white" or surface="evergreen" to set its color independently of the layout.',
      'Table supports typed columns, flat or grouped rows, and optional page controls. Use Pagination on its own for other collections.',
      'The task board adds a paginated List view with the same search, task creation, and status changes as the Board view.',
      'ButtonSelect fits the trigger and popover to their own contents by default. Set matchTriggerWidth to match their widths or use panelClassName to set a custom popover width.',
    ],
  },
  {
    version: '1.7.0',
    date: '2026-11-20',
    title: 'ButtonSelect, activity lists, and input focus',
    summary: 'ButtonSelect pairs standard Button styling with a native popover for choosing views, columns, or other options.',
    changes: [
      'ButtonSelect accepts custom popover content. Content render functions receive close() to dismiss the popover after a selection.',
      'AgentActivity list mode uses flat rows. Lists with more than six events start open and can collapse as a group.',
      'TextField, TextArea, Select, NumberInput, and Autocomplete use a softer focus highlight that fades outward. The field border keeps its size through focus and blur.',
      'Decorative button icons follow the trigger’s native focus behavior when clicked.',
    ],
  },
  {
    version: '1.6.0',
    date: '2026-11-20',
    title: 'Shared typography and component options',
    summary: 'Text brings the shared type scale to headings, paragraphs, and inline formatting. This release also updates cards, tabs, empty states, page panels, and activity logs.',
    changes: [
      'Text adds seven type presets and supports bold, italic, and strikethrough. Browse the Typography page or run chartreuse guide typography.',
      'Card adds header and footer slots and a divided layout with sections that wrap as space narrows.',
      'Tabs adds variant="highlight" for a selected tab with a subtle fill and accent underline.',
      'EmptyState adds variant="dashed" and start, center, and end alignment.',
      'PagePanel footers dock when the surrounding scroll viewport is at least 480px tall. Set stickyFooter={false} to keep the footer in its normal position.',
      'AgentActivity adds titleLines="single" to truncate long event titles with an ellipsis. Expand a row to read the full title.',
      'TaskCard with an onClick handler responds across the full card, including its metadata and footer.',
      'The dark green Navbar highlights the current page in Light Evergreen, available as --cr-evergreen-light.',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-11-19',
    title: 'Activity lists and navigation refinements',
    summary: 'Four components gain layout or display updates, and the interactive documentation is now available on GitHub Pages.',
    changes: [
      'AgentActivity adds variant="list" to display every event as a row with expandable details.',
      'SegmentedControl adds variant="solid" for a filled selection. The default variant is "outline".',
      'Breadcrumbs uses chevrons by default. Set separator to decorative text or JSX, or pass null to hide separators.',
      'Resizable split dialogs have a 10px gutter with a centered grip. Drag the divider or use the arrow keys to resize the panes.',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-11-19',
    title: 'Navbar sizes, ghost badges, and sidebar examples',
    summary: 'Workspace navigation gains a larger size, lighter status badges, and updated run and task examples.',
    changes: [
      'Navbar adds size="lg" for taller link targets, more vertical padding, and larger text. The default size is "md".',
      'Badge adds variant="ghost" for a transparent background with the same semantic text and icon colors. The default variant is "soft".',
      'Ghost buttons in the Sidebar body highlight the selected item when aria-pressed is true. The gallery shows searchable run history with a Load more action and project-filtered tasks with editable checklists.',
      'Workspace layout and application pattern previews use the large Navbar. The WorkspaceContent example shows navigation links in the sidebar.',
      'The release workflow supports public GitHub Packages and checks that package and repository visibility match.',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-11-19',
    title: 'Workspace navigation and layout',
    summary: 'Compose an application shell from shared navigation and layout components.',
    changes: [
      'Navbar supports Comfortable and Full widths and an evergreen variant. NavbarItem supports native links, controls, and custom content.',
      'WorkspaceLayout arranges Sidebar and WorkspaceContent beneath Navbar and wraps on narrow screens. WorkspaceContent supports Comfortable and Full widths.',
      'The Sidebar examples and all seven pattern previews use the shared workspace components. Pattern previews join the navbar and body in one frame, with matching code examples.',
      'TaskCard supports hideMetadataLabels for icon-and-count metadata with labels on hover and keyboard focus.',
      'Tabs supports small, medium, and large sizes that match Button. The default is medium.',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-11-19',
    title: 'Conversation and control sizing',
    summary: 'A clearer conversation layout, refinements to agent activity, and consistent form control sizes.',
    changes: [
      'TextField, Select, NumberInput, and Autocomplete now support small, medium, and large sizes that match Button. The default is medium.',
      'Conversation groups agent activity with the corresponding reply and places user messages in subdued cards. Message timestamps share a trailing edge.',
      'AgentActivity places the chevron after the activity count. The header stays transparent on hover by default. Set headerHighlight="hover" for a subtle background.',
      'Expanded activity details show the event title when there is no description or visible output.',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-11-18',
    title: 'Offline CLI and agent skill',
    summary: 'Query the reference for your installed version of Chartreuse from the terminal.',
    changes: [
      'The chartreuse CLI searches components and returns props, usage examples, design tokens, and layout guidance.',
      'Commands support structured JSON output for agents and scripts.',
      'The private package includes the Chartreuse skill for Codex.',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-11-18',
    title: 'Initial release',
    summary: 'Initial release of the Chartreuse component library and documentation.',
    changes: [
      'The original evergreen, chartreuse, and paper palette, with semantic light and dark themes.',
      '58 React 19 components with TypeScript props and a standalone library build.',
      'A four-pixel spacing scale, Inter typography, shared radii, and three elevations.',
      'Interactive task board, workspace, and agent monitor examples.',
      'Keyboard navigation, native dialogs, labeled controls, and reduced-motion support.',
      'Searchable documentation, copyable examples, and exportable design tokens.',
    ],
  },
];

const releaseDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });

function Changelog() {
  return <div className="release-list">
    {releases.map(({ version, date, title, summary, changes }, index) => <section key={version}>
      <div className="release-heading">
        {index === 0 && <Badge tone="success" dot>Current version</Badge>}
        <time dateTime={date}>{releaseDate.format(new Date(date))}</time>
      </div>
      <article className="release-card">
        <div className="release-version"><span>{version}</span><BrandMark /></div>
        <div>
          <Text size="heading-2">{title}</Text>
          <Text size="body">{summary}</Text>
          <Divider />
          <Text size="heading-3">Included in this release</Text>
          <ul>{changes.map(text => <li key={text}><CheckCircle2 size={15} aria-hidden="true" />{text}</li>)}</ul>
        </div>
      </article>
    </section>)}
  </div>;
}
