import { useId, useState } from 'react';
import { Bot, Check, Clock3, MessageSquare, Users, X } from 'lucide-react';
import { Avatar, AvatarGroup, Badge, BrandMark, Button, Card, Divider, Select } from '../system/components';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';

const snippet = (...lines: string[]) => lines.join('\n');
const people = ['Alex Morgan', 'Sam Lee', 'Jamie Park', 'Taylor Reed', 'Robin Chen'];

export function BadgeScenarios() {
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Status badges" description="Combine dot and tone with a visible status label." code={snippet(
      'import { Badge } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>',
      '  <Badge dot>To do</Badge>',
      '  <Badge tone="info" dot>In progress</Badge>',
      '  <Badge tone="warning" dot>In review</Badge>',
      '  <Badge tone="success" dot>Done</Badge>',
      '  <Badge tone="danger" dot>Failed</Badge>',
      '</div>',
    )}><div className="core-example-row"><Badge dot>To do</Badge><Badge tone="info" dot>In progress</Badge><Badge tone="warning" dot>In review</Badge><Badge tone="success" dot>Done</Badge><Badge tone="danger" dot>Failed</Badge></div></Showcase>
    <Showcase title="Ghost status badges" description="Ghost badges keep the status color on a transparent surface." code={snippet(
      'import { Badge } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>',
      '  <Badge variant="ghost" dot>To do</Badge>',
      '  <Badge variant="ghost" tone="info" dot>In progress</Badge>',
      '  <Badge variant="ghost" tone="warning" dot>In review</Badge>',
      '  <Badge variant="ghost" tone="success" dot>Done</Badge>',
      '  <Badge variant="ghost" tone="danger" dot>Failed</Badge>',
      '</div>',
    )}>
      <div className="core-example-row">
        <Badge variant="ghost" dot>To do</Badge>
        <Badge variant="ghost" tone="info" dot>In progress</Badge>
        <Badge variant="ghost" tone="warning" dot>In review</Badge>
        <Badge variant="ghost" tone="success" dot>Done</Badge>
        <Badge variant="ghost" tone="danger" dot>Failed</Badge>
      </div>
    </Showcase>
    <Showcase title="Badges with icons" description="Pass a decorative icon to identify the state alongside its text label." code={snippet(
      'import { Check, Clock3, X } from "lucide-react";',
      'import { Badge } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>',
      '  <Badge tone="success" icon={Check}>Checked</Badge>',
      '  <Badge tone="warning" icon={Clock3}>Waiting</Badge>',
      '  <Badge tone="danger" icon={X}>Unavailable</Badge>',
      '</div>',
    )}><div className="core-example-row"><Badge tone="success" icon={Check}>Checked</Badge><Badge tone="warning" icon={Clock3}>Waiting</Badge><Badge tone="danger" icon={X}>Unavailable</Badge></div></Showcase>
    <Showcase title="Counts and contextual labels" description="Render counts as badge content, including zero." code={snippet(
      'import { MessageSquare } from "lucide-react";',
      'import { Badge } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>',
      '  <Badge>0 tasks</Badge>',
      '  <Badge tone="info">12 tasks</Badge>',
      '  <Badge icon={MessageSquare}>3 comments</Badge>',
      '  <Badge data-context="workspace">Workspace</Badge>',
      '</div>',
    )}><div className="core-example-row"><Badge>0 tasks</Badge><Badge tone="info">12 tasks</Badge><Badge icon={MessageSquare}>3 comments</Badge><Badge data-context="workspace">Workspace</Badge></div></Showcase>
  </ExampleGallery>;
}

export function AvatarScenarios() {
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Initials and sizes" description="size accepts sm, md (default), and lg. name supplies initials and the accessible image label." code={snippet(
      'import { Avatar } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", alignItems: "center", gap: 12 }}>',
      '  <Avatar name="Alex Morgan" size="sm" />',
      '  <Avatar name="Sam Lee" />',
      '  <Avatar name="Jamie Park" size="lg" />',
      '</div>',
    )}><div className="core-example-row"><Avatar name="Alex Morgan" size="sm" /><Avatar name="Sam Lee" /><Avatar name="Jamie Park" size="lg" /></div></Showcase>
    <Showcase title="Avatar colors" description="color selects the avatar background; name supplies its initials and accessible label." code={snippet(
      'import { Avatar } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", gap: 12 }}>',
      '  <Avatar name="Sam Lee" color="green" />',
      '  <Avatar name="Sam Lee" color="peach" />',
      '  <Avatar name="Sam Lee" color="blue" />',
      '  <Avatar name="Sam Lee" color="purple" />',
      '</div>',
    )}><div className="core-example-row"><Avatar name="Sam Lee" color="green" /><Avatar name="Sam Lee" color="peach" /><Avatar name="Sam Lee" color="blue" /><Avatar name="Sam Lee" color="purple" /></div></Showcase>
    <Showcase title="Avatar with a visible name" description="showName renders the full name beside decorative initials." code={snippet(
      'import { Avatar } from "@chartreuse/ui";',
      '',
      '<Avatar name="Alex Morgan" showName />',
    )}><Avatar name="Alex Morgan" showName /></Showcase>
    <Showcase title="Icon avatar" description="icon replaces the initials with a decorative icon for agents, bots, or teams. name remains the accessible label." code={snippet(
      'import { Bot, Users } from "lucide-react";',
      'import { Avatar } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", alignItems: "center", gap: 12 }}>',
      '  <Avatar name="Review agent" icon={Bot} color="purple" />',
      '  <Avatar name="Design team" icon={Users} color="blue" size="lg" />',
      '  <Avatar name="Review agent" icon={Bot} color="purple" showName />',
      '</div>',
    )}><div className="core-example-row"><Avatar name="Review agent" icon={Bot} color="purple" /><Avatar name="Design team" icon={Users} color="blue" size="lg" /><Avatar name="Review agent" icon={Bot} color="purple" showName /></div></Showcase>
  </ExampleGallery>;
}

export function AvatarGroupScenarios() {
  const [max, setMax] = useState(3);
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Default overflow count" description="AvatarGroup shows up to three avatars by default and displays the remaining count." code={snippet(
      'import { AvatarGroup } from "@chartreuse/ui";',
      '',
      '<AvatarGroup names={["Alex Morgan", "Sam Lee", "Jamie Park", "Taylor Reed", "Robin Chen"]} />',
    )}><AvatarGroup names={people} /></Showcase>
    <Showcase title="Configurable visible count" description="max limits rendered avatars. When the group exceeds max, the last item shows the overflow count." code={snippet(
      'import { useState } from "react";',
      'import { AvatarGroup, Select } from "@chartreuse/ui";',
      '',
      'const names = ["Alex Morgan", "Sam Lee", "Jamie Park", "Taylor Reed", "Robin Chen"];',
      'function VisiblePeople() {',
      '  const [max, setMax] = useState(' + max + ');',
      '  return <>',
      '    <Select label="Visible people" value={max}',
      '      onChange={event => setMax(Number(event.target.value))}>',
      '      {[1, 2, 3, 4, 5].map(count => <option key={count} value={count}>{count}</option>)}',
      '    </Select>',
      '    <AvatarGroup names={names} max={max} />',
      '  </>;',
      '}',
    )}><div className="core-example-stack core-example-field"><Select label="Visible people" value={max} onChange={event => setMax(Number(event.target.value))}>{[1, 2, 3, 4, 5].map(count => <option key={count} value={count}>{count}</option>)}</Select><AvatarGroup names={people} max={max} /></div></Showcase>
    <Showcase title="Accessible group context" description="Wrap AvatarGroup in a labeled group to identify the assignment represented by the names." code={snippet(
      'import { AvatarGroup, Text } from "@chartreuse/ui";',
      '',
      '<div role="group" aria-label="Assigned reviewers">',
      '  <Text size="body">Assigned reviewers</Text>',
      '  <AvatarGroup names={["Alex Morgan", "Sam Lee"]} max={3} />',
      '</div>',
    )}><div className="core-example-stack" role="group" aria-label="Assigned reviewers"><Text size="body" className="core-example-note">Assigned reviewers</Text><AvatarGroup names={['Alex Morgan', 'Sam Lee']} max={3} /></div></Showcase>
    <Showcase title="Icon avatar" description="items accepts { name, icon } entries, so an agent or team can show an icon beside people's initials. The +N overflow count is unchanged." code={snippet(
      'import { Bot, Users } from "lucide-react";',
      'import { AvatarGroup } from "@chartreuse/ui";',
      '',
      '<AvatarGroup items={[',
      '  { name: "Review agent", icon: Bot },',
      '  { name: "Design team", icon: Users },',
      '  { name: "Alex Morgan" },',
      '  { name: "Sam Lee" },',
      ']} max={3} />',
    )}><AvatarGroup items={[{ name: 'Review agent', icon: Bot }, { name: 'Design team', icon: Users }, { name: 'Alex Morgan' }, { name: 'Sam Lee' }]} max={3} /></Showcase>
  </ExampleGallery>;
}

export function CardScenarios() {
  const [acknowledged, setAcknowledged] = useState(false);
  const cardTitleId = useId();
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Divided card" description="The header and footer span the card. The content sections wrap to fit the available width." span="full" code={snippet(
      'import { Card, Text } from "@chartreuse/ui";',
      '',
      '<Card divided aria-label="Workspace settings"',
      '  header={<Text size="heading-3">Workspace settings</Text>}',
      '  footer={<span>Changes apply to this workspace.</span>}>',
      '  <section>',
      '    <Text size="body" display="block" bold>Repository</Text>',
      '    <Text size="body">Choose the repository and default branch for this workspace.</Text>',
      '  </section>',
      '  <section>',
      '    <Text size="body" display="block" bold>Schedule</Text>',
      '    <Text size="body">Set how often the workspace checks for updates.</Text>',
      '  </section>',
      '  <section>',
      '    <Text size="body" display="block" bold>Notifications</Text>',
      '    <Text size="body">Choose where activity updates and alerts appear.</Text>',
      '  </section>',
      '</Card>',
    )}>
      <Card divided className="core-example-divided-card" aria-label="Workspace settings"
        header={<Text size="heading-3">Workspace settings</Text>}
        footer={<span>Changes apply to this workspace.</span>}>
        <section>
          <Text size="body" display="block" bold>Repository</Text>
          <Text size="body">Choose the repository and default branch for this workspace.</Text>
        </section>
        <section>
          <Text size="body" display="block" bold>Schedule</Text>
          <Text size="body">Set how often the workspace checks for updates.</Text>
        </section>
        <section>
          <Text size="body" display="block" bold>Notifications</Text>
          <Text size="body">Choose where activity updates and alerts appear.</Text>
        </section>
      </Card>
    </Showcase>
    <Showcase title="Card content" description="Card renders an article element. Supply content as children and control spacing with classes or styles." code={snippet(
      'import { Card, Text } from "@chartreuse/ui";',
      '',
      '<Card style={{ padding: 24, maxWidth: 380 }}>',
      '  <Text size="heading-3">Workspace configuration</Text>',
      '  <Text size="body">Review repository settings and task defaults.</Text>',
      '</Card>',
    )}><Card className="core-example-card"><Text size="heading-3">Workspace configuration</Text><Text size="body">Review repository settings and task defaults.</Text></Card></Showcase>
    <Showcase title="Card with an action" description="Compose a Button inside Card and manage its result in application state." code={snippet(
      'import { useState } from "react";',
      'import { Card, Button, Text } from "@chartreuse/ui";',
      '',
      'function CardAction() {',
      '  const [acknowledged, setAcknowledged] = useState(false);',
      '  return <Card style={{ padding: 24, maxWidth: 380 }}>',
      '    <Text size="heading-3">Configuration review</Text>',
      '    <Text size="body">Confirm that the branch settings match the deployment target.</Text>',
      '    <Button variant="secondary" onClick={() => setAcknowledged(true)}>Mark reviewed</Button>',
      '    <Text size="body" role="status">{acknowledged ? "Review recorded." : "Review pending."}</Text>',
      '  </Card>;',
      '}',
    )}><Card className="core-example-card"><Text size="heading-3">Configuration review</Text><Text size="body">Confirm that the branch settings match the deployment target.</Text><Button variant="secondary" onClick={() => setAcknowledged(true)}>Mark reviewed</Button><Text size="body" className="core-example-result" role="status" style={{ marginBlockStart: 16, marginBlockEnd: 0 }}>{acknowledged ? 'Review recorded.' : 'Review pending.'}</Text></Card></Showcase>
    <Showcase title="Card header and footer" description="Use header and footer for content above and below the padded body." code={snippet(
      'import { useId } from "react";',
      'import { Badge, Button, Card, Text } from "@chartreuse/ui";',
      '',
      'function ReviewSummaryCard() {',
      '  const titleId = useId();',
      '  return <Card aria-labelledby={titleId} style={{ maxWidth: 380 }}',
      '    header={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>',
      '      <Text size="heading-3" id={titleId} style={{ margin: 0 }}>Review summary</Text><Badge tone="info" dot>In progress</Badge>',
      '    </div>}',
      '    footer={<Button variant="secondary">View review notes</Button>}>',
      '    <Text size="body">Review the changed files and resolve open comments before merging.</Text>',
      '  </Card>;',
      '}',
    )}>
      <Card className="core-example-sectioned-card" aria-labelledby={cardTitleId}
        header={<div className="core-example-card-header"><Text size="heading-3" id={cardTitleId}>Review summary</Text><Badge tone="info" dot>In progress</Badge></div>}
        footer={<Button variant="secondary">View review notes</Button>}>
        <Text size="body" className="core-example-card-section">Review the changed files and resolve open comments before merging.</Text>
      </Card>
    </Showcase>
  </ExampleGallery>;
}

export function BrandMarkScenarios() {
  return <ExampleGallery className="core-scenarios">
    <Showcase title="SVG dimensions" description="Set inlineSize and blockSize through style to control the SVG dimensions." code={snippet(
      'import { BrandMark } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", alignItems: "center", gap: 24 }}>',
      '  {[20, 32, 48].map(size => <figure key={size} style={{ margin: 0 }}>',
      '    <BrandMark style={{ inlineSize: size, blockSize: size }} />',
      '    <figcaption>{size}px</figcaption>',
      '  </figure>)}',
      '</div>',
    )}><div className="core-example-row" style={{ gap: 24 }}>{[20, 32, 48].map(size => <figure className="core-example-brand-size" key={size}><BrandMark style={{ inlineSize: size, blockSize: size }} /><figcaption>{size}px</figcaption></figure>)}</div></Showcase>
    <Showcase title="Inherited SVG color" description="The mark uses currentColor and inherits color from each surrounding surface." code={snippet(
      'import { BrandMark } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>',
      '  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24,',
      '    color: "var(--cr-color-text)", background: "var(--cr-color-surface)" }}>',
      '    <BrandMark style={{ inlineSize: 32, blockSize: 32 }} /><span>Chartreuse</span>',
      '  </div>',
      '  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24,',
      '    color: "var(--cr-chartreuse)", background: "var(--cr-evergreen)" }}>',
      '    <BrandMark style={{ inlineSize: 32, blockSize: 32 }} /><span>Chartreuse</span>',
      '  </div>',
      '</div>',
    )}><div className="core-example-row"><div className="core-example-brand-surface"><BrandMark /><span>Chartreuse</span></div><div className="core-example-brand-surface" data-tone="brand"><BrandMark /><span>Chartreuse</span></div></div></Showcase>
    <Showcase title="Accessible brand mark" description="Set role, aria-hidden, and aria-label when the mark needs its own accessible name." code={snippet(
      'import { BrandMark } from "@chartreuse/ui";',
      '',
      '<BrandMark role="img" aria-hidden={false} aria-label="Chartreuse design system"',
      '  style={{ inlineSize: 40, blockSize: 40 }} />',
    )}><BrandMark role="img" aria-hidden={false} aria-label="Chartreuse design system" style={{ inlineSize: 40, blockSize: 40 }} /></Showcase>
  </ExampleGallery>;
}

export function DividerScenarios() {
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Semantic section separator" description="Divider renders a native hr element." code={snippet(
      'import { Divider, Text } from "@chartreuse/ui";',
      '',
      '<div>',
      '  <Text size="body">Configuration summary.</Text>',
      '  <Divider />',
      '  <Text size="body">Validation results.</Text>',
      '</div>',
    )}><div className="core-example-field"><Text size="body" className="core-example-note">Configuration summary.</Text><Divider /><Text size="body" className="core-example-note">Validation results.</Text></div></Showcase>
    <Showcase title="Custom separator spacing" description="Use native style props to adjust the divider margins." code={snippet(
      'import { Card, Divider, Text } from "@chartreuse/ui";',
      '',
      '<Card style={{ padding: 24, maxWidth: 380 }}>',
      '  <Text size="heading-3">Deployment decision</Text>',
      '  <Text size="body">Deploy after the required reviews are complete.</Text>',
      '  <Divider style={{ marginBlock: 32 }} />',
      '  <Text size="body">Next step: review the changed files.</Text>',
      '</Card>',
    )}><Card className="core-example-card"><Text size="heading-3">Deployment decision</Text><Text size="body">Deploy after the required reviews are complete.</Text><Divider style={{ marginBlock: 32 }} /><Text size="body" style={{ margin: 0 }}>Next step: review the changed files.</Text></Card></Showcase>
  </ExampleGallery>;
}
