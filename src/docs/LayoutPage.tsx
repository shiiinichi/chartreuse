import { useEffect, useId, useState } from 'react';
import { Check, LayoutTemplate, ShieldCheck } from 'lucide-react';
import { Badge, Checkbox, Select, Switch, TextField } from '../system/components';
import { Fieldset } from '../system/Fieldset';
import { Grid, GridItem } from '../system/Grid';
import { SegmentedControl } from '../system/SegmentedControl';
import { Showcase } from './shared';
import { Text } from '../system';
import './LayoutPage.css';

type WidthMode = 'comfortable' | 'full';
const containerRecipe = `.layout-container {\n  box-sizing: border-box;\n  min-inline-size: 0;\n  inline-size: 100%;\n  max-inline-size: var(--cr-layout-content-max);\n  margin-inline: auto;\n  padding-inline: var(--cr-layout-gutter);\n}\n\n.layout-container[data-content-width="full"] {\n  max-inline-size: none;\n}\n\n/* Comfortable is the default.\n   Full fills its parent's allocated main area.\n   Both modes retain the same responsive gutters. */`;
const groupedInputsRecipe = `import { Checkbox, Fieldset, Grid, GridItem, Select, Switch, TextField } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

export function InputGroupLayout() {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cr-space-6)', width: '100%', maxWidth: 800, margin: 0 }}>
    <Fieldset legend="Review context" description="Choose what to include with the review.">
      <Grid columns={{ base: 1, sm: 2 }} gap={4}>
        <GridItem span={1}><Checkbox label="Include source notes" name="sourceNotes" defaultChecked /></GridItem>
        <GridItem span={1}><Checkbox label="Include task history" name="taskHistory" /></GridItem>
      </Grid>
    </Fieldset>
    <Fieldset legend="Task context" description="Repository and visibility settings.">
      <Grid columns={{ base: 1, sm: 2 }} gap={4}>
        <GridItem span={1}><TextField label="Repository" name="repository" defaultValue="component-library" /></GridItem>
        <GridItem span={1}><Select label="Visibility" name="visibility" defaultValue="workspace">
          <option value="workspace">Workspace members</option><option value="private">Only me</option>
        </Select></GridItem>
        <GridItem span="full"><Switch label="Include archived tasks" name="archived" /></GridItem>
      </Grid>
    </Fieldset>
  </div>;
}`;

function GroupedInputsExample() {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cr-space-6)', width: '100%', maxWidth: 800, margin: 0 }}><Fieldset legend="Review context" description="Choose what to include with the review."><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Checkbox label="Include source notes" name="sourceNotes" defaultChecked /></GridItem><GridItem span={1}><Checkbox label="Include task history" name="taskHistory" /></GridItem></Grid></Fieldset><Fieldset legend="Task context" description="Repository and visibility settings."><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><TextField label="Repository" name="repository" defaultValue="component-library" /></GridItem><GridItem span={1}><Select label="Visibility" name="visibility" defaultValue="workspace"><option value="workspace">Workspace members</option><option value="private">Only me</option></Select></GridItem><GridItem span="full"><Switch label="Include archived tasks" name="archived" /></GridItem></Grid></Fieldset></div>;
}

function readLayoutTokens() {
  if (typeof document === 'undefined') return { max: '', gutter: '' };
  const style = getComputedStyle(document.documentElement);
  return { max: style.getPropertyValue('--cr-layout-content-max').trim(), gutter: style.getPropertyValue('--cr-layout-gutter').trim() };
}

export function LayoutPage() {
  const [mode, setMode] = useState<WidthMode>('comfortable');
  const [preview, setPreview] = useState('wide');
  const [tokens, setTokens] = useState(readLayoutTokens);
  const modeId = useId();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTokens(readLayoutTokens()));
    };
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('resize', update); cancelAnimationFrame(frame); };
  }, []);

  return <>
    <div className="layout-foundation-intro"><Text size="body">Use a centered container with a maximum width or fill the main area beside navigation. Both modes retain responsive gutters and shrink on narrower screens.</Text><Badge icon={LayoutTemplate}>Container foundation</Badge></div>
    <div className="layout-mode-notes"><article><Badge>Default</Badge><Text size="heading-2">Comfortable</Text><Text size="body">Center content within the shared maximum width. Use this for prose, forms, and documentation.</Text></article><article><Badge>Optional</Badge><Text size="heading-2">Full</Text><Text size="body">Fill the main area allocated by the layout. Use this for boards, tables, and other wide layouts.</Text></article></div>

    <section className="layout-foundation-choices" aria-labelledby="layout-foundations-heading"><Text size="heading-2" id="layout-foundations-heading">Layout components</Text><ul>
      <li><Text size="heading-3"><a href="#components/grid">Grid for input groups</a></Text><Text size="body">Align complete labeled inputs in rows or stacks. GridItem controls spans; GridSpacer reserves an empty grid cell.</Text></li>
      <li><Text size="heading-3"><a href="#components/masonry">Masonry for uneven content</a></Text><Text size="body">Pack cards and examples into the shortest available columns. MasonryItem controls spans; MasonrySpacer reserves an invisible space.</Text></li>
      <li><Text size="heading-3"><a href="#components/flex">Flex for rows and stacks</a></Text><Text size="body">Arrange and align content along one axis, with optional wrapping.</Text></li>
      <li><Text size="heading-3"><a href="#components/workspace-content">WorkspaceContent for the main area</a></Text><Text size="body">Place it beside Sidebar and below Navbar, then choose Comfortable or Full width.</Text></li>
      <li><Text size="heading-3"><a href="#components/workspace-layout">WorkspaceLayout for the sidebar and main area</a></Text><Text size="body">Arrange Sidebar and WorkspaceContent beneath Navbar with responsive wrapping.</Text></li>
    </ul></section>

    <div className="document-section"><Showcase title="Compare container width modes" description="Preview either container mode independently of the documentation width preference." code={containerRecipe} language="css">
      <div className="layout-foundation-example"><Grid columns={{ base: 1, sm: 2 }} gap={5} align="end" className="layout-preview-controls"><GridItem span={1}><SegmentedControl label="Preview mode" name={`layout-mode-${modeId}`} options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'full', label: 'Full' }]} value={mode} onValueChange={value => setMode(value === 'full' ? 'full' : 'comfortable')} /></GridItem><GridItem span={1}><Select label="Available area" value={preview} onChange={event => setPreview(event.target.value)}><option value="wide">Wide example</option><option value="constrained">Constrained example</option></Select></GridItem></Grid>
        <figure className="layout-preview-figure"><div className="layout-preview-scroll" role="region" aria-label="Container layout preview" tabIndex={0}><div className="layout-preview-viewport" data-area={preview} role="img" aria-label={`${mode === 'full' ? 'Full' : 'Comfortable'} container beside navigation. The content keeps its gutters; comfortable mode leaves unused space when the main area exceeds its shared cap.`}><div className="layout-preview-sidebar"><Text bold>Navigation</Text><span /><span /><span /></div><div className="layout-preview-main"><div className="layout-preview-content" data-content-width={mode}><header><Text bold>Main area</Text><Badge>{mode === 'full' ? 'Full' : 'Comfortable'}</Badge></header><div className="layout-preview-cards"><span /><span /><span /></div><div className="layout-preview-copy"><span /><span /><span /></div></div></div></div></div><figcaption>This schematic uses half-scale dimensions to show a wide container inside the page. The recipe and docs use the full shared token values.</figcaption></figure>
      </div>
    </Showcase></div>

    <div className="document-section"><Showcase title="Group inputs with Grid" description="Grid spaces the inputs inside each Fieldset. space-4 (16px) separates input rows and columns; inputs stack below 480px of available group width and share two columns from that tier." code={groupedInputsRecipe}>
      <GroupedInputsExample />
    </Showcase></div>

    <section className="layout-token-section"><Text size="heading-2">Shared layout tokens</Text><Text size="body">The documentation shell and this recipe use the same CSS tokens. Changing the docs preference removes the maximum; it keeps the gutter.</Text><dl className="layout-token-readout"><div><dt><code>--cr-layout-content-max</code></dt><dd>{tokens.max || 'Shared maximum'}<span>Comfortable container cap, including its gutters.</span></dd></div><div><dt><code>--cr-layout-gutter</code></dt><dd>{tokens.gutter || 'Responsive gutter'}<span>Current horizontal gutter. It responds to the viewport.</span></dd></div></dl></section>

    <div className="component-notes"><Text size="heading-2"><ShieldCheck size={17} aria-hidden="true" />Container behavior</Text><ul>{[
      'Comfortable mode caps the container width and shrinks to the available width on smaller screens.',
      'Full means the parent’s main area, so content stays beside the sidebar and inside the normal gutters.',
      'Individual components can retain their own width constraints inside a full-width container.',
      'Use Grid and one GridItem per complete labeled input for vertical input stacks and responsive input rows. Start with columns={1}; use responsive columns when inputs can share a row, with a token gap for spacing on both axes.',
      'Keep related controls inside a native Fieldset with its legend and individual visible labels. Preserve their logical DOM order as the columns change.',
      'Keep each input’s label, hint, and internal controls together in the same GridItem.',
      'Change Content width in Display preferences to apply either mode across all documentation pages. The desktop header shortcut toggles the same preference.',
      'The docs remember your choice across navigation and reloads, and synchronize it between tabs.',
    ].map(note => <li key={note}><Check size={13} aria-hidden="true" /><span>{note}</span></li>)}</ul></div>
  </>;
}
