import { useState } from 'react';
import { FolderOpen, RotateCcw } from 'lucide-react';
import { Badge, Button, Card, EmptyState, Grid, GridItem, IconButton, Swimlane, Text } from '../system';
import { TaskBoard } from './TaskBoard';
import { taskBoardExampleCode } from './pattern-example-sources';
import { ExampleGallery, Showcase } from './shared';
import './swimlane-demo.css';

const statusLanes = [
  { title: 'In progress', tone: 'info', description: 'Implementation in progress', items: ['Inspect the public props', 'Build the component preview'] },
  { title: 'Awaiting implementation review', tone: 'warning', description: 'The count remains adjacent when the title wraps.', items: ['Compare the preview with its source'] },
] as const;

export function SwimlaneDemo() {
  const [hasNote, setHasNote] = useState(false);
  return <ExampleGallery className="swimlane-demo" maxColumns={2}>
    <Showcase title="Status heading and item count" description="The count prop sets the item count. Long titles wrap while the count remains beside the status tag." code={`import { Card, Grid, GridItem, Swimlane } from '@chartreuse/ui';

const lanes = ${JSON.stringify(statusLanes, null, 2)} as const;

<div style={{ width: '100%', maxWidth: 800, margin: 0 }}>
  <Grid columns={{ base: 1, sm: 2 }} gap={4}>
    {lanes.map(lane => <GridItem key={lane.title} span={1}>
      <Swimlane title={lane.title} tone={lane.tone}
        count={lane.items.length} description={lane.description}>
        {lane.items.map(item => <Card key={item} style={{ padding: 16 }}>{item}</Card>)}
      </Swimlane>
    </GridItem>)}
  </Grid>
</div>`}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 1, sm: 2 }} gap={4}>{statusLanes.map(lane => <GridItem key={lane.title} span={1}><Swimlane title={lane.title} tone={lane.tone} count={lane.items.length} description={lane.description}>{lane.items.map(item => <Card key={item} style={{ padding: 16 }}>{item}</Card>)}</Swimlane></GridItem>)}</Grid></div></Showcase>
    <Showcase title="Custom empty state and reference content" description="emptyContent renders when the lane has no children. Add a reference card, then clear it with the header action." code={`import { useState } from 'react';
import { FolderOpen, RotateCcw } from 'lucide-react';
import { Badge, Button, Card, EmptyState, IconButton, Swimlane, Text } from '@chartreuse/ui';

export function ReferenceLane() {
  const [hasNote, setHasNote] = useState(false);
  return <div style={{ width: '100%', maxWidth: 420, margin: 0 }}>
    <Swimlane title="Reference notes" count={hasNote ? 1 : 0}
      description={<Text size="body">Review the <Text bold>definition of done</Text> before closing the task.</Text>}
      action={<IconButton icon={RotateCcw} label="Reset reference lane" size="sm"
        disabled={!hasNote} onClick={() => setHasNote(false)} />}
      emptyContent={<EmptyState icon={FolderOpen} title="No reference notes"
        description="Add the acceptance criteria for this review."
        action={<Button variant="secondary" onClick={() => setHasNote(true)}>Add reference note</Button>} />}>
      {hasNote ? <Card style={{ padding: 16 }}>
        <Badge tone="info">Reference</Badge><Text size="heading-3">Definition of done</Text>
        <Text size="body">An example is complete when its preview matches the displayed source.</Text>
        <ul><li>Use the public component API.</li><li>Verify labels and responsive layout.</li></ul>
      </Card> : null}
    </Swimlane>
  </div>;
}`}><div style={{ width: '100%', maxWidth: 420, margin: 0 }}><Swimlane title="Reference notes" count={hasNote ? 1 : 0} description={<Text size="body">Review the <Text bold>definition of done</Text> before closing the task.</Text>} action={<IconButton icon={RotateCcw} label="Reset reference lane" size="sm" disabled={!hasNote} onClick={() => setHasNote(false)} />} emptyContent={<EmptyState icon={FolderOpen} title="No reference notes" description="Add the acceptance criteria for this review." action={<Button variant="secondary" onClick={() => setHasNote(true)}>Add reference note</Button>} />}>{hasNote ? <Card style={{ padding: 16 }}><Badge tone="info">Reference</Badge><Text size="heading-3">Definition of done</Text><Text size="body">An example is complete when its preview matches the displayed source.</Text><ul><li>Use the public component API.</li><li>Verify labels and responsive layout.</li></ul></Card> : null}</Swimlane></div></Showcase>
    <Showcase span="full" title="Task board with status lanes" description="Switch between status lanes and a paginated list. Both views share search, task details, and status changes." code={taskBoardExampleCode}><TaskBoard /></Showcase>
  </ExampleGallery>;
}
