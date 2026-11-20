import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Fieldset } from '../system/Fieldset';
import { Grid, GridItem, GridSpacer } from '../system/Grid';
import type { GridGap } from '../system/Grid';
import { Select, Switch, TextField } from '../system/components';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './grid-spacer-demo.css';

const outline: CSSProperties = { outline: '1px dashed var(--cr-color-input-border)', background: 'var(--cr-color-subtle)', borderRadius: 7 };
const outlineSource = `const outline = {
  outline: '1px dashed var(--cr-color-input-border)',
  background: 'var(--cr-color-subtle)', borderRadius: 7,
};`;
const illustrationCaption = 'Dashed outline and tint identify the spacer in this example. GridSpacer is invisible by default and still reserves space.';

export function GridSpacerSample({ gap = 4, frameStyle }: { gap?: GridGap; frameStyle?: CSSProperties } = {}) {
  const [reserve, setReserve] = useState(true);
  const [showOutline, setShowOutline] = useState(true);
  const code = `import { useState } from 'react';
import { Fieldset, Grid, GridItem, GridSpacer, Switch, TextField, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

${outlineSource}

export function ReservedInputSlot() {
  const [reserve, setReserve] = useState(${reserve});
  const [showOutline, setShowOutline] = useState(${showOutline});
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Switch label="Reserve first-row cell" checked={reserve}
        onChange={event => setReserve(event.target.checked)} /></GridItem>
      <GridItem span={1}><Switch label="Show spacer outline" checked={showOutline}
        onChange={event => setShowOutline(event.target.checked)} /></GridItem>
    </Grid>
    <Fieldset legend="Project details">
      <Grid columns={{ base: 1, sm: 2 }} gap={${gap}}>
        <GridItem span={1}><TextField label="Project name" defaultValue="Component library" /></GridItem>
        {reserve && <GridSpacer visible={{ base: false, sm: true }}
          style={showOutline ? outline : undefined} />}
        <GridItem span={1}><TextField label="Project owner" defaultValue="Alex Morgan" /></GridItem>
        <GridItem span={1}><TextField label="Project reviewer" defaultValue="Sam Lee" /></GridItem>
      </Grid>
    </Fieldset>
    <Text size="body" style={{ margin: 0 }}>${illustrationCaption}</Text>
    <Text size="body" style={{ margin: 0 }}>This example removes the spacer below 480px of grid width,
      so the three fields stack without an empty row.</Text>
  </div>;
}`;
  return <Showcase title="Reserve a field position" description="Reserve an empty grid cell. Toggle the spacer to compare placement of subsequent inputs." code={code}>
    <div className="grid-spacer-example" style={frameStyle}>
      <Grid columns={{ base: 1, sm: 2 }} gap={4}>
        <GridItem span={1}><Switch label="Reserve first-row cell" checked={reserve} onChange={event => setReserve(event.target.checked)} /></GridItem>
        <GridItem span={1}><Switch label="Show spacer outline" checked={showOutline} onChange={event => setShowOutline(event.target.checked)} /></GridItem>
      </Grid>
      <Fieldset legend="Project details"><Grid columns={{ base: 1, sm: 2 }} gap={gap}>
        <GridItem span={1}><TextField label="Project name" defaultValue="Component library" /></GridItem>
        {reserve && <GridSpacer visible={{ base: false, sm: true }} style={showOutline ? outline : undefined} />}
        <GridItem span={1}><TextField label="Project owner" defaultValue="Alex Morgan" /></GridItem>
        <GridItem span={1}><TextField label="Project reviewer" defaultValue="Sam Lee" /></GridItem>
      </Grid></Fieldset>
      <Text size="body">{illustrationCaption}</Text>
      <Text size="body">This example removes the spacer below 480px of grid width, so the three fields stack without an empty row.</Text>
    </div>
  </Showcase>;
}

function SpanningSpacerSample() {
  const [span, setSpan] = useState(2);
  const [showOutline, setShowOutline] = useState(true);
  const code = `import { useState } from 'react';
import { Fieldset, Grid, GridItem, GridSpacer, Select, Switch, TextField, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

${outlineSource}

export function WiderReservedSlot() {
  const [span, setSpan] = useState(${span});
  const [showOutline, setShowOutline] = useState(${showOutline});
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Grid columns={1} gap={4}>
      <GridItem span={1}><Select label="Reserved columns" value={span}
        onChange={event => setSpan(Number(event.target.value))} style={{ maxInlineSize: 240 }}>
        <option value={1}>1 column</option><option value={2}>2 columns</option>
      </Select></GridItem>
      <GridItem span={1}><Switch label="Show spanning spacer outline" checked={showOutline}
        onChange={event => setShowOutline(event.target.checked)} /></GridItem>
    </Grid>
    <Fieldset legend="Deployment details">
      <Grid columns={{ base: 1, sm: 4 }} gap={4}>
        <GridItem span={1}><TextField label="Environment" defaultValue="Staging" /></GridItem>
        <GridSpacer span={span} visible={{ base: false, sm: true }}
          style={showOutline ? outline : undefined} />
        <GridItem span={1}><TextField label="Region" defaultValue="ap-southeast-1" /></GridItem>
      </Grid>
    </Fieldset>
    <Text size="body" style={{ margin: 0 }}>${illustrationCaption}</Text>
    <Text size="body" style={{ margin: 0 }}>At wider grid sizes, the span setting reserves tracks;
      gap controls the normal distance between cells.</Text>
  </div>;
}`;
  return <Showcase title="Reserve several columns" description="GridSpacer accepts GridItem spans and reserves empty grid tracks." code={code}>
    <div className="grid-spacer-example">
      <Grid columns={1} gap={4}>
        <GridItem span={1}><Select label="Reserved columns" value={span} onChange={event => setSpan(Number(event.target.value))} style={{ maxInlineSize: 240 }}><option value={1}>1 column</option><option value={2}>2 columns</option></Select></GridItem>
        <GridItem span={1}><Switch label="Show spanning spacer outline" checked={showOutline} onChange={event => setShowOutline(event.target.checked)} /></GridItem>
      </Grid>
      <Fieldset legend="Deployment details"><Grid columns={{ base: 1, sm: 4 }} gap={4}>
        <GridItem span={1}><TextField label="Environment" defaultValue="Staging" /></GridItem>
        <GridSpacer span={span} visible={{ base: false, sm: true }} style={showOutline ? outline : undefined} />
        <GridItem span={1}><TextField label="Region" defaultValue="ap-southeast-1" /></GridItem>
      </Grid></Fieldset>
      <Text size="body">{illustrationCaption}</Text>
      <Text size="body">At wider grid sizes, the span setting reserves tracks; gap controls the normal distance between cells.</Text>
    </div>
  </Showcase>;
}

export function GridSpacerDemo() {
  return <ExampleGallery className="grid-spacer-examples"><GridSpacerSample /><SpanningSpacerSample /></ExampleGallery>;
}
