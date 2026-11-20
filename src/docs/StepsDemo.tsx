import { useId, useState } from 'react';
import { FolderOpen, ShieldCheck } from 'lucide-react';
import { Badge, Select, Switch } from '../system/components';
import { MarkdownRenderer } from '../system/MarkdownRenderer';
import { SegmentedControl } from '../system/SegmentedControl';
import { Steps } from '../system/Steps';
import type { StepItem } from '../system/Steps';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './sequence-demo.css';

const process = [
  { id: 'prepare', title: 'Prepare', content: 'Inspect the component API and dependencies.' },
  { id: 'build', title: 'Build', content: 'Implement the task board with shared components.' },
  { id: 'review', title: 'Review', content: 'Review the implementation and validation results.' },
] satisfies StepItem[];
const guide: StepItem[] = [
  { id: 'install', title: 'Build the library.', content: <><Text size="body">Install dependencies and build the shared library from this workspace.</Text><MarkdownRenderer>{'```sh\nnpm install\nnpm run build:lib\n```'}</MarkdownRenderer></> },
  { id: 'compose', title: 'Import components and styles.', content: <><Text size="body">Import the stylesheet once, then render the components in your application.</Text><MarkdownRenderer>{'```tsx\nimport { Button, TextField } from "@chartreuse/ui";\nimport "@chartreuse/ui/styles.css";\n\n<>\n  <TextField label="Task name" />\n  <Button>Create task</Button>\n</>\n```'}</MarkdownRenderer></> },
  { id: 'connect', title: 'Use design tokens.', content: <><Text size="body">Use token variables for spacing, text color, and surface color.</Text><MarkdownRenderer>{'```css\n.workspace {\n  padding: var(--cr-space-6);\n  color: var(--cr-color-text);\n  background: var(--cr-color-surface);\n}\n```'}</MarkdownRenderer></> },
];
const explicit: StepItem[] = [
  { id: 'context', title: 'Requirements recorded', icon: FolderOpen, status: 'complete', content: 'The task includes requirements and acceptance criteria.' },
  { id: 'work', title: 'Implementation', status: 'current', content: <><Text size="body">The component implementation is in progress.</Text><Badge tone="info">In progress</Badge></> },
  { id: 'attention', title: 'Verification failed', status: 'error', content: 'Resolve the failed verification before completing the task.' },
  { id: 'finish', title: 'Independent review', icon: ShieldCheck, status: 'upcoming', content: 'Review the implementation and verification results.' },
];

export function StepsDemo() {
  const [current, setCurrent] = useState('build');
  const [variant, setVariant] = useState<'outline' | 'solid'>('outline');
  const [numbered, setNumbered] = useState(true);
  const groupId = useId();
  return <div className="sequence-demo">
    <Text size="body" className="sequence-demo-intro">Use Steps for an ordered process or setup guide. Items accept React content, and the caller sets the current step and item status.</Text>
    <ExampleGallery className="sequence-demo-gallery">
    <Showcase title="Setup guide with code examples" description="Zero-padded markers and connectors track the height of each item’s content." code={`import { MarkdownRenderer, Steps, Text } from '@chartreuse/ui';\n\n<Steps aria-label="Set up Chartreuse" items={[\n  { id: 'install', title: 'Build the library.',\n    content: <>\n      <Text size="body">Install dependencies and build the shared library from this workspace.</Text>\n      <MarkdownRenderer>{'\`\`\`sh\\nnpm install\\nnpm run build:lib\\n\`\`\`'}</MarkdownRenderer>\n    </> },\n  { id: 'compose', title: 'Import components and styles.',\n    content: <>\n      <Text size="body">Import the stylesheet once, then render the components in your application.</Text>\n      <MarkdownRenderer>{'\`\`\`tsx\\nimport { Button, TextField } from "@chartreuse/ui";\\nimport "@chartreuse/ui/styles.css";\\n\\n<>\\n  <TextField label="Task name" />\\n  <Button>Create task</Button>\\n</>\\n\`\`\`'}</MarkdownRenderer>\n    </> },\n  { id: 'connect', title: 'Use design tokens.',\n    content: <>\n      <Text size="body">Use token variables for spacing, text color, and surface color.</Text>\n      <MarkdownRenderer>{'\`\`\`css\\n.workspace {\\n  padding: var(--cr-space-6);\\n  color: var(--cr-color-text);\\n  background: var(--cr-color-surface);\\n}\\n\`\`\`'}</MarkdownRenderer>\n    </> },\n]} />`}><Steps aria-label="Set up Chartreuse" items={guide} /></Showcase>
    <Showcase title="Horizontal process with a current step" description="The current prop sets step state. Markers display status and do not act as navigation buttons." code={`import { Steps, type StepItem } from '@chartreuse/ui';\n\nconst process: StepItem[] = ${JSON.stringify(process, null, 2)};\n\n<Steps aria-label="Workspace process" items={process}\n  orientation="horizontal" current="${current}"\n  markerVariant="${variant}" numbered={${numbered}}\n/>`}><div className="sequence-demo-controls"><Select label="Current step" value={current} onChange={event => setCurrent(event.target.value)}>{process.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</Select><SegmentedControl label="Marker style" name={`steps-markers-${groupId}`} value={variant} onValueChange={value => setVariant(value === 'solid' ? 'solid' : 'outline')} options={[{ value: 'outline', label: 'Outline' }, { value: 'solid', label: 'Solid' }]} /><Switch label="Show numbers" checked={numbered} onChange={event => setNumbered(event.target.checked)} /></div><Steps aria-label="Workspace process" items={process} orientation="horizontal" current={current} markerVariant={variant} numbered={numbered} /></Showcase>
    <Showcase title="Explicit states and custom markers" description="Each item can set its status and replace its marker with an icon." code={`import { FolderOpen, ShieldCheck } from 'lucide-react';\nimport { Badge, Steps, Text } from '@chartreuse/ui';\n\n<Steps aria-label="Review process" items={[\n  { id: 'context', title: 'Requirements recorded', icon: FolderOpen,\n    status: 'complete', content: 'The task includes requirements and acceptance criteria.' },\n  { id: 'work', title: 'Implementation', status: 'current',\n    content: <><Text size="body">The component implementation is in progress.</Text>\n      <Badge tone="info">In progress</Badge></> },\n  { id: 'attention', title: 'Verification failed', status: 'error',\n    content: 'Resolve the failed verification before completing the task.' },\n  { id: 'finish', title: 'Independent review', icon: ShieldCheck,\n    status: 'upcoming', content: 'Review the implementation and verification results.' },\n]} />`}><Steps aria-label="Review process" items={explicit} /></Showcase>
    </ExampleGallery>
  </div>;
}
