import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Card, Button, Select, Switch } from '../system/components';
import { Grid, GridItem } from '../system/Grid';
import type { GridGap, GridSpan } from '../system/Grid';
import { Masonry, MasonryItem, MasonrySpacer } from '../system/Masonry';
import { ExampleGallery, Showcase } from './shared';
import './masonry-demo.css';

const notes = [
  { id: 'plan', title: 'Implementation plan', paragraphs: ['Verify column spans at each container breakpoint.'] },
  { id: 'review', title: 'Review notes', paragraphs: ['Check the component at its own available width.', 'Record the container width used for each check.', 'Document any remaining layout issues.'] },
  { id: 'handoff', title: 'Handoff notes', paragraphs: ['Summarize the changes and open issues.', 'The card height is determined by its content.'] },
  { id: 'ready', title: 'Next task', paragraphs: ['Review keyboard navigation through the examples.'] },
] as const;

function NoteCard({ note }: { note: typeof notes[number] }) {
  return <Card className="masonry-demo-card"><h4>{note.title}</h4>{note.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</Card>;
}

const noteSource = `const notes = ${JSON.stringify(notes, null, 2)} as const;

function NoteCard({ note }: { note: typeof notes[number] }) {
  return <Card className="masonry-demo-card">
    <h4>{note.title}</h4>
    {note.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </Card>;
}`;
const sampleStyles = `/* Example styles:
.masonry-demo-stack { display: flex; flex-direction: column; gap: var(--cr-space-4); min-width: 0; }
.masonry-demo-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--cr-space-3); }
.masonry-demo-card { display: flex; flex-direction: column; gap: var(--cr-space-3); min-width: 0; padding: var(--cr-space-4); }
.masonry-demo-card > h4 { margin: 0; font-size: 15px; line-height: 1.5; font-weight: 550; }
.masonry-demo-card > p { margin: 0; color: var(--cr-color-muted); font-size: 13px; line-height: 1.8; }
.masonry-demo-caption { margin: 0; color: var(--cr-color-muted); font-size: 13px; line-height: 1.8; }
.masonry-demo-frame { box-sizing: border-box; max-width: 100%; min-width: 0; padding: var(--cr-space-4); border: 1px solid var(--cr-color-border); border-radius: var(--cr-radius-md); }
*/`;
function exampleCode(components: string, example: string, react = false) {
  return `${react ? "import { useState } from 'react';\n" : ''}import { ${components} } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';\n\n${noteSource}\n\n${example}\n\n${sampleStyles}`;
}
const illustration: CSSProperties = { outline: '1px dashed var(--cr-color-input-border)', background: 'var(--cr-color-subtle)', borderRadius: 7 };
const illustrationSource = `const illustration = {
  outline: '1px dashed var(--cr-color-input-border)',
  background: 'var(--cr-color-subtle)', borderRadius: 7,
};`;
const spacerCaption = 'Outline and tint are illustration styling only. MasonrySpacer is invisible by default and still reserves space.';

function IntrinsicCards() {
  const [width, setWidth] = useState('full');
  const [gap, setGap] = useState<GridGap>(4);
  return <Showcase title="Pack cards by column height" description="Content determines each card’s height. Each card is placed in the shortest available column." code={exampleCode('Card, Grid, GridItem, Masonry, Select', `export function IntrinsicCards() {
  const [width, setWidth] = useState(${JSON.stringify(width)});
  const [gap, setGap] = useState<4 | 6 | 8>(${gap});
  return <div className="masonry-demo-stack">
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Select label="Frame width" value={width}
        onChange={event => setWidth(event.target.value)}>
        <option value="full">Available space</option><option value="320">320px</option>
        <option value="640">640px</option><option value="960">960px</option>
      </Select></GridItem>
      <GridItem span={1}><Select label="Card gap" value={gap}
        onChange={event => setGap(Number(event.target.value) as 4 | 6 | 8)}>
        <option value={4}>16px</option><option value={6}>24px</option><option value={8}>32px</option>
      </Select></GridItem>
    </Grid>
    <div className="masonry-demo-frame" style={{ width: width === 'full' ? '100%' : width + 'px' }}>
      <Masonry minColumnWidth={220} maxColumns={3} gap={gap}>
        {notes.map(note => <NoteCard key={note.id} note={note} />)}
      </Masonry>
    </div>
  </div>;
}`, true)}>
    <div className="masonry-demo-stack"><Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Select label="Frame width" value={width} onChange={event => setWidth(event.target.value)}><option value="full">Available space</option><option value="320">320px</option><option value="640">640px</option><option value="960">960px</option></Select></GridItem>
      <GridItem span={1}><Select label="Card gap" value={gap} onChange={event => setGap(Number(event.target.value) as GridGap)}><option value={4}>16px</option><option value={6}>24px</option><option value={8}>32px</option></Select></GridItem>
    </Grid><div className="masonry-demo-frame" style={{ inlineSize: width === 'full' ? '100%' : `${width}px` }}><Masonry minColumnWidth={220} maxColumns={3} gap={gap}>{notes.map(note => <NoteCard key={note.id} note={note} />)}</Masonry></div></div>
  </Showcase>;
}

function ChangingContent() {
  const [expanded, setExpanded] = useState(false);
  const [extra, setExtra] = useState(false);
  return <Showcase title="Repack after content changes" description="Expand a card or add a note. The layout repacks while the same controls remain mounted." code={exampleCode('Button, Card, Masonry', `export function ChangingContent() {
  const [expanded, setExpanded] = useState(${expanded});
  const [extra, setExtra] = useState(${extra});
  return <div className="masonry-demo-stack">
    <div className="masonry-demo-actions">
      <Button variant="secondary" onClick={() => setExtra(value => !value)}>
        {extra ? 'Remove the extra note' : 'Add an extra note'}
      </Button>
    </div>
    <Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
      <Card className="masonry-demo-card">
        <h4>Expandable review notes</h4><p>Open the detail to change this card’s height.</p>
        <Button variant="secondary" size="sm" aria-expanded={expanded}
          onClick={() => setExpanded(value => !value)}>
          {expanded ? 'Collapse review detail' : 'Expand review detail'}
        </Button>
        {expanded && <p>The team checked the source, compared the rendered examples,
          and recorded the remaining questions before handing the work over.</p>}
      </Card>
      {notes.slice(0, 3).map(note => <NoteCard key={note.id} note={note} />)}
      {extra && <NoteCard key="extra" note={notes[3]} />}
    </Masonry>
  </div>;
}`, true)}>
    <div className="masonry-demo-stack"><div className="masonry-demo-actions"><Button variant="secondary" onClick={() => setExtra(value => !value)}>{extra ? 'Remove the extra note' : 'Add an extra note'}</Button></div>
      <Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}><Card className="masonry-demo-card"><h4>Expandable review notes</h4><p>Open the detail to change this card’s height.</p><Button variant="secondary" size="sm" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Collapse review detail' : 'Expand review detail'}</Button>{expanded && <p>The team checked the source, compared the rendered examples, and recorded the remaining questions before handing the work over.</p>}</Card>{notes.slice(0, 3).map(note => <NoteCard key={note.id} note={note} />)}{extra && <NoteCard key="extra" note={notes[3]} />}</Masonry>
    </div>
  </Showcase>;
}

function FullWidthNote() {
  return <Showcase title="Span every column" description="A full-span item starts below the preceding columns. Later items continue below it." code={exampleCode('Card, Masonry, MasonryItem', `<Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
  {notes.slice(0, 3).map(note => <NoteCard key={note.id} note={note} />)}
  <MasonryItem span="full"><Card className="masonry-demo-card">
    <h4>Layout decision</h4>
    <p>This item starts below the preceding columns and spans the full container width.</p>
  </Card></MasonryItem>
  <NoteCard note={notes[3]} /><NoteCard note={notes[0]} />
</Masonry>`)}>
    <Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>{notes.slice(0, 3).map(note => <NoteCard key={note.id} note={note} />)}<MasonryItem span="full"><Card className="masonry-demo-card"><h4>Layout decision</h4><p>This item starts below the preceding columns and spans the full container width.</p></Card></MasonryItem><NoteCard note={notes[3]} /><NoteCard note={notes[0]} /></Masonry>
  </Showcase>;
}

export function MasonryDemo() {
  return <ExampleGallery className="masonry-example-gallery"><IntrinsicCards /><ChangingContent /><FullWidthNote /></ExampleGallery>;
}

function ResponsiveItem() {
  return <Showcase title="Responsive column spans" description="The item spans one column at the base tier and two columns from the sm tier." code={exampleCode('Card, Masonry, MasonryItem', `<Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
  <MasonryItem span={{ base: 1, sm: 2 }}><Card className="masonry-demo-card">
    <h4>Primary review notes</h4>
    <p>This note has a wider span when the Masonry container reaches 480px.</p>
    <p>Its height still comes from the content.</p>
  </Card></MasonryItem>
  {notes.map(note => <MasonryItem key={note.id}><NoteCard note={note} /></MasonryItem>)}
</Masonry>`)}>
    <Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}><MasonryItem span={{ base: 1, sm: 2 }}><Card className="masonry-demo-card"><h4>Primary review notes</h4><p>This note has a wider span when the Masonry container reaches 480px.</p><p>Its height still comes from the content.</p></Card></MasonryItem>{notes.map(note => <MasonryItem key={note.id}><NoteCard note={note} /></MasonryItem>)}</Masonry>
  </Showcase>;
}

function ChosenSpan() {
  const [span, setSpan] = useState<GridSpan>(2);
  return <Showcase title="Change the span" description="Numeric spans clamp to the available columns. Full uses the whole width." code={exampleCode('Card, Grid, GridItem, Masonry, MasonryItem, Select', `export function ChosenSpan() {
  const [span, setSpan] = useState<number | 'full'>(${JSON.stringify(span)});
  return <div className="masonry-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <Select label="Featured card span" value={span}
        onChange={event => setSpan(event.target.value === 'full' ? 'full' : Number(event.target.value))}>
        <option value={1}>1 column</option><option value={2}>2 columns</option><option value="full">Every column</option>
      </Select>
    </GridItem></Grid>
    <Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
      <NoteCard note={notes[0]} />
      <MasonryItem span={span}><NoteCard note={notes[1]} /></MasonryItem>
      <NoteCard note={notes[2]} /><NoteCard note={notes[3]} />
    </Masonry>
  </div>;
}`, true)}>
    <div className="masonry-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><Select label="Featured card span" value={span} onChange={event => setSpan(event.target.value === 'full' ? 'full' : Number(event.target.value))}><option value={1}>1 column</option><option value={2}>2 columns</option><option value="full">Every column</option></Select></GridItem></Grid><Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}><NoteCard note={notes[0]} /><MasonryItem span={span}><NoteCard note={notes[1]} /></MasonryItem><NoteCard note={notes[2]} /><NoteCard note={notes[3]} /></Masonry></div>
  </Showcase>;
}

function OrdinaryAndWrappedItems() {
  return <Showcase title="Apply spans with MasonryItem" description="Direct children occupy one column. MasonryItem sets a span while the child content retains its semantics." code={exampleCode('Card, Masonry, MasonryItem', `<Masonry columns={{ base: 1, sm: 2 }} gap={4}>
  <NoteCard note={notes[0]} /><NoteCard note={notes[1]} />
  <MasonryItem span="full" data-context="handoff">
    <Card className="masonry-demo-card"><h4>Wrapped card</h4>
      <p>MasonryItem sets the span. Card retains its article semantics.</p>
    </Card>
  </MasonryItem>
  <NoteCard note={notes[2]} /><NoteCard note={notes[3]} />
</Masonry>`)}>
    <Masonry columns={{ base: 1, sm: 2 }} gap={4}><NoteCard note={notes[0]} /><NoteCard note={notes[1]} /><MasonryItem span="full" data-context="handoff"><Card className="masonry-demo-card"><h4>Wrapped card</h4><p>MasonryItem sets the span. Card retains its article semantics.</p></Card></MasonryItem><NoteCard note={notes[2]} /><NoteCard note={notes[3]} /></Masonry>
  </Showcase>;
}

export function MasonryItemDemo() {
  return <ExampleGallery className="masonry-example-gallery"><ResponsiveItem /><ChosenSpan /><OrdinaryAndWrappedItems /></ExampleGallery>;
}

function ReservedSpace() {
  const [reserve, setReserve] = useState(true);
  const [showOutline, setShowOutline] = useState(false);
  return <Showcase title="Reserve empty space" description="MasonrySpacer reserves height within the layout. Remove it to reposition later items." code={exampleCode('Card, Grid, GridItem, Masonry, MasonrySpacer, Switch', `${illustrationSource}

export function ReservedSpace() {
  const [reserve, setReserve] = useState(${reserve});
  const [showOutline, setShowOutline] = useState(${showOutline});
  return <div className="masonry-demo-stack">
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Switch label="Reserve an empty slot" checked={reserve}
        onChange={event => setReserve(event.target.checked)} /></GridItem>
      <GridItem span={1}><Switch label="Show spacer illustration" checked={showOutline}
        onChange={event => setShowOutline(event.target.checked)} /></GridItem>
    </Grid>
    <Masonry columns={{ base: 1, sm: 2 }} gap={4}>
      <NoteCard note={notes[0]} />
      {reserve && <MasonrySpacer height={160} style={showOutline ? illustration : undefined} />}
      <NoteCard note={notes[1]} /><NoteCard note={notes[2]} />
    </Masonry>
    <p className="masonry-demo-caption">${spacerCaption}</p>
  </div>;
}`, true)}>
    <div className="masonry-demo-stack"><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Switch label="Reserve an empty slot" checked={reserve} onChange={event => setReserve(event.target.checked)} /></GridItem><GridItem span={1}><Switch label="Show spacer illustration" checked={showOutline} onChange={event => setShowOutline(event.target.checked)} /></GridItem></Grid><Masonry columns={{ base: 1, sm: 2 }} gap={4}><NoteCard note={notes[0]} />{reserve && <MasonrySpacer height={160} style={showOutline ? illustration : undefined} />}<NoteCard note={notes[1]} /><NoteCard note={notes[2]} /></Masonry><p className="masonry-demo-caption">{spacerCaption}</p></div>
  </Showcase>;
}

function SizedSpace() {
  const [height, setHeight] = useState(160);
  const [span, setSpan] = useState<GridSpan>(1);
  const [showOutline, setShowOutline] = useState(true);
  return <Showcase title="Set spacer height and span" description="Height sets the reserved block size. Span reserves adjacent columns at that position." code={exampleCode('Card, Grid, GridItem, Masonry, MasonrySpacer, Select, Switch', `${illustrationSource}

export function SizedSpace() {
  const [height, setHeight] = useState(${height});
  const [span, setSpan] = useState<number | 'full'>(${JSON.stringify(span)});
  const [showOutline, setShowOutline] = useState(${showOutline});
  return <div className="masonry-demo-stack">
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Select label="Reserved height" value={height}
        onChange={event => setHeight(Number(event.target.value))}>
        <option value={80}>80px</option><option value={160}>160px</option><option value={240}>240px</option>
      </Select></GridItem>
      <GridItem span={1}><Select label="Reserved span" value={span}
        onChange={event => setSpan(event.target.value === 'full' ? 'full' : Number(event.target.value))}>
        <option value={1}>1 column</option><option value={2}>2 columns</option><option value="full">Every column</option>
      </Select></GridItem>
      <GridItem span="full"><Switch label="Show sized spacer illustration" checked={showOutline}
        onChange={event => setShowOutline(event.target.checked)} /></GridItem>
    </Grid>
    <Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
      <NoteCard note={notes[0]} />
      <MasonrySpacer height={height} span={span} style={showOutline ? illustration : undefined} />
      <NoteCard note={notes[1]} /><NoteCard note={notes[2]} /><NoteCard note={notes[3]} />
    </Masonry>
    <p className="masonry-demo-caption">${spacerCaption}</p>
  </div>;
}`, true)}>
    <div className="masonry-demo-stack"><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Select label="Reserved height" value={height} onChange={event => setHeight(Number(event.target.value))}><option value={80}>80px</option><option value={160}>160px</option><option value={240}>240px</option></Select></GridItem><GridItem span={1}><Select label="Reserved span" value={span} onChange={event => setSpan(event.target.value === 'full' ? 'full' : Number(event.target.value))}><option value={1}>1 column</option><option value={2}>2 columns</option><option value="full">Every column</option></Select></GridItem><GridItem span="full"><Switch label="Show sized spacer illustration" checked={showOutline} onChange={event => setShowOutline(event.target.checked)} /></GridItem></Grid><Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}><NoteCard note={notes[0]} /><MasonrySpacer height={height} span={span} style={showOutline ? illustration : undefined} /><NoteCard note={notes[1]} /><NoteCard note={notes[2]} /><NoteCard note={notes[3]} /></Masonry><p className="masonry-demo-caption">{spacerCaption}</p></div>
  </Showcase>;
}

function ResponsiveSpace() {
  const [width, setWidth] = useState('960');
  const [showOutline, setShowOutline] = useState(true);
  return <Showcase title="Hide spacers in narrow containers" description="The spacer disappears below 480px of Masonry width. At wider tiers its height and span can change too." code={exampleCode('Card, Grid, GridItem, Masonry, MasonrySpacer, Select, Switch', `${illustrationSource}

export function ResponsiveSpace() {
  const [width, setWidth] = useState(${JSON.stringify(width)});
  const [showOutline, setShowOutline] = useState(${showOutline});
  return <div className="masonry-demo-stack">
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Select label="Responsive frame width" value={width}
        onChange={event => setWidth(event.target.value)}>
        <option value="320">320px</option><option value="640">640px</option><option value="960">960px</option>
      </Select></GridItem>
      <GridItem span={1}><Switch label="Show responsive spacer illustration" checked={showOutline}
        onChange={event => setShowOutline(event.target.checked)} /></GridItem>
    </Grid>
    <div className="masonry-demo-frame" style={{ width: width + 'px' }}>
      <Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        <NoteCard note={notes[0]} />
        <MasonrySpacer visible={{ base: false, sm: true }}
          height={{ base: 80, md: 160 }} span={{ base: 1, md: 2 }}
          style={showOutline ? illustration : undefined} />
        <NoteCard note={notes[1]} /><NoteCard note={notes[2]} />
      </Masonry>
    </div>
    <p className="masonry-demo-caption">${spacerCaption}</p>
  </div>;
}`, true)}>
    <div className="masonry-demo-stack"><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Select label="Responsive frame width" value={width} onChange={event => setWidth(event.target.value)}><option value="320">320px</option><option value="640">640px</option><option value="960">960px</option></Select></GridItem><GridItem span={1}><Switch label="Show responsive spacer illustration" checked={showOutline} onChange={event => setShowOutline(event.target.checked)} /></GridItem></Grid><div className="masonry-demo-frame" style={{ inlineSize: `${width}px` }}><Masonry columns={{ base: 1, sm: 2, md: 3 }} gap={4}><NoteCard note={notes[0]} /><MasonrySpacer visible={{ base: false, sm: true }} height={{ base: 80, md: 160 }} span={{ base: 1, md: 2 }} style={showOutline ? illustration : undefined} /><NoteCard note={notes[1]} /><NoteCard note={notes[2]} /></Masonry></div><p className="masonry-demo-caption">{spacerCaption}</p></div>
  </Showcase>;
}

export function MasonrySpacerDemo() {
  return <ExampleGallery className="masonry-example-gallery"><ReservedSpace /><SizedSpace /><ResponsiveSpace /></ExampleGallery>;
}
