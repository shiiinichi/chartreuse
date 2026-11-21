import { useState } from 'react';
import { Badge, Button, IconButton, TextField } from '../system/components';
import type { IconProps } from '../system/icons';
import { CodeBlock, Showcase } from './shared';
import { Text } from '../system';
import './custom-icon-guide.css';

function OrbitIcon({ size = 24, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-35 12 12)" /><path d="m18.5 3.5 1.1 1.1m-15.2 15 1.1 1.1" /></svg>;
}

const inlineMark = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 21 8v8l-9 5-9-5V8Z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>;

const example = `import { Button, IconButton, Badge, TextField } from '@chartreuse/ui';
import type { IconProps } from '@chartreuse/ui';

function OrbitIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="10" ry="5"
        transform="rotate(-35 12 12)" />
      <path d="m18.5 3.5 1.1 1.1m-15.2 15 1.1 1.1" />
    </svg>
  );
}

// IconSource accepts a component compatible with IconProps.
<Button icon={OrbitIcon}>Increment counter</Button>;

// An inline SVG element retains its viewBox and paths.
<IconButton label="Pin workspace" icon={
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 21 8v8l-9 5-9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </svg>
} />;

<Badge icon={OrbitIcon}>Connected</Badge>;
<TextField label="Search with a custom icon" icon={OrbitIcon}
  type="search" placeholder="Find a workspace…" />`;

const generationPrompt = `Create a React SVG icon representing a workspace connection.
Declare a 24 × 24 viewBox and use currentColor for strokes or fills.
Accept IconProps and forward SVG props so the host control can set size and accessibility attributes.
Keep vector paths and shapes inside the SVG; do not set fixed CSS dimensions.
Do not include scripts, event handlers, or embedded HTML.
Return a TypeScript React component or SVG JSX.
Set the accessible action name on the host Button or IconButton.`;

export function CustomIconGuide() {
  const [tries, setTries] = useState(0);
  const [pinned, setPinned] = useState(false);
  return <section className="custom-icon-guide"><div className="custom-icon-guide-heading"><Text size="heading-2">Custom SVG icon inputs</Text><Text size="body">Icon slots accept Lucide components, React SVG components, and inline SVG elements.</Text></div><Showcase title="Custom SVG icons" description="Pass an SVG component or element to the icon prop." headingLevel={3} code={example}><div className="custom-icon-guide-live"><div><Badge>SVG component</Badge><Button icon={OrbitIcon} onClick={() => setTries(count => count + 1)}>Increment counter{tries > 0 ? ` (${tries})` : ''}</Button></div><div><Badge>SVG element</Badge><IconButton icon={inlineMark} label={pinned ? 'Unpin workspace' : 'Pin workspace'} aria-pressed={pinned} variant="secondary" onClick={() => setPinned(value => !value)} /></div><div><Badge>Inherited color</Badge><Badge tone="success" icon={OrbitIcon}>Connected</Badge></div></div><TextField className="custom-icon-guide-field" label="Search with a custom icon" icon={OrbitIcon} type="search" placeholder="Find a workspace…" /></Showcase><div className="custom-icon-guide-generation"><Text size="heading-3">SVG component requirements</Text><CodeBlock code={generationPrompt} language="text" /></div><Text size="body" className="custom-icon-guide-note">Use <code>IconSource</code> for icon slot types and <code>IconProps</code> for SVG component props. Forward SVG props so controls can set size and decorative accessibility attributes. SVG strings are not accepted; convert markup to JSX or a React component first. Icon-only actions require a descriptive <code>label</code>.</Text></section>;
}
