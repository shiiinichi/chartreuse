import { useId, useState } from 'react';
import { Badge, Button, Select } from '../system/components';
import { SegmentedControl } from '../system/SegmentedControl';
import { Slider } from '../system/Slider';
import { Flex } from '../system/Flex';
import type { FlexAlignment, FlexDirection, FlexJustification } from '../system/Flex';
import { Grid, GridItem } from '../system/Grid';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './flex-demo.css';

const cellStyles = `.flex-demo-frame { box-sizing: border-box; padding: 16px; border: 1px solid var(--cr-color-border); border-radius: var(--cr-radius-md); background: var(--cr-color-canvas); min-width: 0; max-width: 100%; }
.flex-demo-cell { display: flex; align-items: center; justify-content: center; box-sizing: border-box; min-height: 48px; padding: 12px; border-radius: var(--cr-radius-sm); color: var(--cr-color-text); background: var(--cr-color-success-bg); font-size: 13px; text-align: center; overflow-wrap: anywhere; }`;
const source = (imports: string, body: string, react = '', css = '') => `${react ? `import { ${react} } from 'react';\n` : ''}import { ${imports} } from '@chartreuse/ui';\n\n${body}${css ? `\n\n/* Example layout:\n${css}\n*/` : ''}`;

function DirectionExample() {
  const id = useId();
  const [direction, setDirection] = useState<FlexDirection>('row');
  return <Showcase title="Set the main axis" description="direction changes the main axis while preserving DOM and reading order." code={source('Flex, Grid, GridItem, SegmentedControl', `export function DirectionExample() {
  const id = useId();
  const [direction, setDirection] = useState<'row' | 'column'>(${JSON.stringify(direction)});
  return <div className="flex-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <SegmentedControl label="Direction" name={id + '-direction'}
        options={[{ value: 'row', label: 'Horizontal' }, { value: 'column', label: 'Vertical' }]}
        value={direction} onValueChange={value => setDirection(value as 'row' | 'column')} />
    </GridItem></Grid>
    <div className="flex-demo-frame">
      <Flex direction={direction} gap={3} className="flex-demo-direction">
        <div className="flex-demo-cell">First</div>
        <div className="flex-demo-cell">Second</div>
        <div className="flex-demo-cell">Third</div>
      </Flex>
    </div>
  </div>;
}`, 'useId, useState', `${cellStyles}
.flex-demo-stack { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.flex-demo-direction > .cr-flex-layout > * { flex: 1; }`)}>
    <div className="flex-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><SegmentedControl label="Direction" name={`${id}-direction`} options={[{ value: 'row', label: 'Horizontal' }, { value: 'column', label: 'Vertical' }]} value={direction} onValueChange={value => setDirection(value as FlexDirection)} /></GridItem></Grid><div className="flex-demo-frame"><Flex direction={direction} gap={3} className="flex-demo-direction"><div className="flex-demo-cell">First</div><div className="flex-demo-cell">Second</div><div className="flex-demo-cell">Third</div></Flex></div></div>
  </Showcase>;
}

function AlignmentExample() {
  const [justify, setJustify] = useState<FlexJustification>('start');
  const [align, setAlign] = useState<FlexAlignment>('center');
  return <Showcase title="Align and distribute items" description="justify distributes items along the main axis. align positions items on the cross axis." code={source('Flex, Grid, GridItem, Select', `import type { FlexAlignment, FlexJustification } from '@chartreuse/ui';

export function AlignmentExample() {
  const [justify, setJustify] = useState<FlexJustification>(${JSON.stringify(justify)});
  const [align, setAlign] = useState<FlexAlignment>(${JSON.stringify(align)});
  return <div className="flex-demo-stack">
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Select label="Justify" value={justify}
        onChange={event => setJustify(event.currentTarget.value as FlexJustification)}>
        {(['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'] as const)
          .map(value => <option key={value} value={value}>{value}</option>)}
      </Select></GridItem>
      <GridItem span={1}><Select label="Align" value={align}
        onChange={event => setAlign(event.currentTarget.value as FlexAlignment)}>
        {(['start', 'center', 'end', 'stretch', 'baseline'] as const)
          .map(value => <option key={value} value={value}>{value}</option>)}
      </Select></GridItem>
    </Grid>
    <div className="flex-demo-frame">
      <Flex justify={justify} align={align} gap={3} className="flex-demo-alignment">
        <div className="flex-demo-cell" style={{ minHeight: 40 }}>One</div>
        <div className="flex-demo-cell" style={{ minHeight: 64 }}>Two</div>
        <div className="flex-demo-cell" style={{ minHeight: 88 }}>Three</div>
      </Flex>
    </div>
  </div>;
}`, 'useState', `${cellStyles}
.flex-demo-stack { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.flex-demo-alignment { min-height: 160px; }
.flex-demo-alignment .flex-demo-cell { flex: 0 1 76px; }`)}>
    <div className="flex-demo-stack"><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Select label="Justify" value={justify} onChange={event => setJustify(event.currentTarget.value as FlexJustification)}>{(['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'] as const).map(value => <option value={value} key={value}>{value}</option>)}</Select></GridItem><GridItem span={1}><Select label="Align" value={align} onChange={event => setAlign(event.currentTarget.value as FlexAlignment)}>{(['start', 'center', 'end', 'stretch', 'baseline'] as const).map(value => <option value={value} key={value}>{value}</option>)}</Select></GridItem></Grid><div className="flex-demo-frame"><Flex justify={justify} align={align} gap={3} className="flex-demo-alignment"><div className="flex-demo-cell" style={{ minHeight: 40 }}>One</div><div className="flex-demo-cell" style={{ minHeight: 64 }}>Two</div><div className="flex-demo-cell" style={{ minHeight: 88 }}>Three</div></Flex></div></div>
  </Showcase>;
}

function WrappingExample() {
  const [width, setWidth] = useState(360);
  return <Showcase title="Wrap actions to available width" description="Buttons retain their intrinsic widths. The gap token controls spacing between items and wrapped rows." code={source('Flex, Grid, GridItem, Button, Slider', `export function WrappingExample() {
  const [width, setWidth] = useState(${width});
  return <div className="flex-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <Slider label="Action row width" min={200} max={640} step={20}
        value={width} onValueChange={setWidth} formatValue={value => value + 'px'} />
    </GridItem></Grid>
    <div className="flex-demo-frame" style={{ width, maxWidth: '100%' }}>
      <Flex wrap gap={3} align="center">
        <Button size="sm">Create task</Button>
        <Button size="sm" variant="secondary">Review notes</Button>
        <Button size="sm" variant="secondary">Open workspace</Button>
        <Button size="sm" variant="secondary">Refresh</Button>
        <Button size="sm" variant="ghost">Cancel</Button>
      </Flex>
    </div>
  </div>;
}`, 'useState', `${cellStyles}
.flex-demo-stack { display: flex; flex-direction: column; gap: 24px; min-width: 0; }`)}>
    <div className="flex-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><Slider label="Action row width" min={200} max={640} step={20} value={width} onValueChange={setWidth} formatValue={value => `${value}px`} /></GridItem></Grid><div className="flex-demo-frame" style={{ width, maxWidth: '100%' }}><Flex wrap gap={3} align="center"><Button size="sm">Create task</Button><Button size="sm" variant="secondary">Review notes</Button><Button size="sm" variant="secondary">Open workspace</Button><Button size="sm" variant="secondary">Refresh</Button><Button size="sm" variant="ghost">Cancel</Button></Flex></div></div>
  </Showcase>;
}

function SpacingExample() {
  const [gap, setGap] = useState<3 | 6>(3);
  return <Showcase title="Set spacing in a vertical stack" description="gap applies a spacing token between direct children in a column." code={source('Flex, Grid, GridItem, Badge, Button, Select, Text', `export function ContentStack() {
  const [gap, setGap] = useState<3 | 6>(${gap});
  return <div className="flex-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <Select label="Stack spacing" value={gap}
        onChange={event => setGap(Number(event.currentTarget.value) as 3 | 6)}>
        <option value={3}>space-3 · 12px</option>
        <option value={6}>space-6 · 24px</option>
      </Select>
    </GridItem></Grid>
    <div className="flex-demo-frame">
      <Flex direction="column" align="start" gap={gap}>
        <Badge tone="info">Ready for review</Badge>
        <Text size="heading-3" className="flex-demo-title">Review brief</Text>
        <Text size="body" className="flex-demo-copy">The status, brief, and action use the selected spacing token.</Text>
        <Button size="sm" variant="secondary">Read the brief</Button>
      </Flex>
    </div>
  </div>;
}`, 'useState', `${cellStyles}
.flex-demo-stack { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.flex-demo-title { margin: 0; font-size: 16px; line-height: 1.5; font-weight: 550; }
.flex-demo-copy { margin: 0; color: var(--cr-color-muted); font-size: 13px; line-height: 1.8; }`)}>
    <div className="flex-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><Select label="Stack spacing" value={gap} onChange={event => setGap(Number(event.currentTarget.value) as 3 | 6)}><option value={3}>space-3 · 12px</option><option value={6}>space-6 · 24px</option></Select></GridItem></Grid><div className="flex-demo-frame"><Flex direction="column" align="start" gap={gap}><Badge tone="info">Ready for review</Badge><Text size="heading-3" className="flex-demo-title">Review brief</Text><Text size="body" className="flex-demo-copy">The status, brief, and action use the selected spacing token.</Text><Button size="sm" variant="secondary">Read the brief</Button></Flex></div></div>
  </Showcase>;
}

function ResponsiveExample() {
  const [width, setWidth] = useState('full');
  return <Showcase span="full" title="Respond to container width" description="Items stack below 480px of container width and form a row at wider widths. Each instance responds to its own container." code={source('Flex, Grid, GridItem, Button, Select, Text', `export function ResponsiveRow() {
  const [width, setWidth] = useState(${JSON.stringify(width)});
  return <div className="flex-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <Select label="Responsive preview width" value={width}
        onChange={event => setWidth(event.currentTarget.value)}>
        <option value="full">Available space</option>
        <option value="280">Narrow · 280px</option>
        <option value="640">Wide · 640px</option>
      </Select>
    </GridItem></Grid>
    <div className="flex-demo-frame" style={{ width: width === 'full' ? '100%' : Number(width), maxWidth: '100%' }}>
      <Flex direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'stretch', sm: 'center' }} justify="space-between" gap={4}>
        <Text size="body" className="flex-demo-copy flex-demo-grow">Component review ready.</Text>
        <Button size="sm">Open review</Button>
        <Button size="sm" variant="secondary">Keep editing</Button>
      </Flex>
    </div>
  </div>;
}`, 'useState', `${cellStyles}
.flex-demo-stack { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.flex-demo-copy { margin: 0; color: var(--cr-color-muted); font-size: 13px; line-height: 1.8; }
.flex-demo-grow { flex: 1; }`)}>
    <div className="flex-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><Select label="Responsive preview width" value={width} onChange={event => setWidth(event.currentTarget.value)}><option value="full">Available space</option><option value="280">Narrow · 280px</option><option value="640">Wide · 640px</option></Select></GridItem></Grid><div className="flex-demo-frame" style={{ width: width === 'full' ? '100%' : Number(width), maxWidth: '100%' }}><Flex direction={{ base: 'column', sm: 'row' }} align={{ base: 'stretch', sm: 'center' }} justify="space-between" gap={4}><Text size="body" className="flex-demo-copy flex-demo-grow">Component review ready.</Text><Button size="sm">Open review</Button><Button size="sm" variant="secondary">Keep editing</Button></Flex></div></div>
  </Showcase>;
}

export function FlexDemo() {
  return <ExampleGallery className="flex-demo"><DirectionExample /><AlignmentExample /><WrappingExample /><SpacingExample /><ResponsiveExample /></ExampleGallery>;
}
