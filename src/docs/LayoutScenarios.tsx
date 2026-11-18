import { useId, useState } from 'react';
import { ArrowRight, FolderOpen, Sparkles } from 'lucide-react';
import { AgentCard, Button, CalloutBanner, Card, Drawer, Grid, GridItem, PagePanel, TaskCard, TextArea, TextField } from '../system';
import { MasonryItem } from '../system/Masonry';
import { DrawerPage } from './DrawerPage';
import { GridItemDemo } from './GridDemo';
import { PagePanelPage } from './PagePanelPage';
import { TaskCardDemo } from './TaskCardDemo';
import { ExampleGallery, Showcase } from './shared';
import './layout-scenarios.css';

export const layoutScenarioNames = ['AgentCard', 'CalloutBanner', 'TaskCard', 'Drawer', 'PagePanel', 'GridItem'] as const;
export type LayoutScenarioName = typeof layoutScenarioNames[number];

const source = (...lines: string[]) => lines.join('\n');
const agentStates = [
  { name: 'Research agent', task: 'Finding the relevant component contracts.', status: 'running', elapsed: '00:42', tokens: '2.4k' },
  { name: 'Build agent', task: 'Waiting for the research notes.', status: 'waiting', elapsed: '00:00', tokens: '0' },
  { name: 'Review agent', task: 'The implementation review is complete.', status: 'succeeded', elapsed: '02:16', tokens: '8.1k' },
  { name: 'Planning agent', task: 'No task is assigned.', status: 'idle', elapsed: '00:00', tokens: '0' },
] as const;
const selectableAgents = [
  { name: 'Research agent', task: 'Tracing the public API.', status: 'running', elapsed: '00:42', tokens: '2.4k' },
  { name: 'Review agent', task: 'Checking the examples against their source.', status: 'waiting', elapsed: '00:00', tokens: '0' },
] as const;
const taskStates = [
  { taskId: 'DOC-101', title: 'Outline the component examples', status: 'todo', priority: 'low' },
  { taskId: 'DOC-102', title: 'Build the focused examples', status: 'in-progress', priority: 'medium' },
  { taskId: 'DOC-103', title: 'Review the displayed source', status: 'review', priority: 'high' },
  { taskId: 'DOC-104', title: 'Publish the reviewed examples', status: 'done', priority: 'medium' },
] as const;
const briefSections = [
  { title: 'Goal', text: 'Document one public component contract per example.' },
  { title: 'Scope', text: 'Use the existing public components and keep each example self-contained.' },
  { title: 'Dependencies', text: 'Read the component props before choosing the content and interactions.' },
  { title: 'Review', text: 'Compare every visible element with the source shown alongside the preview.' },
  { title: 'Handoff', text: 'Record the props, state transitions, and constraints shown by the example.' },
] as const;

function AgentCardScenarios() {
  const [selected, setSelected] = useState('Research agent');
  return <ExampleGallery className="layout-scenarios layout-example-gallery">
    <Showcase title="Agent lifecycle states" description="Running, waiting, complete, and idle each retain a visible text label." code={source(
      'import { AgentCard, Grid, GridItem } from "@chartreuse/ui";',
      '',
      `const agents = ${JSON.stringify(agentStates, null, 2)} as const;`,
      '',
      '<div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '  <Grid columns={{ base: 1, sm: 2 }} gap={4}>',
      '    {agents.map(agent => <GridItem key={agent.name} span={1}>',
      '      <AgentCard {...agent} />',
      '    </GridItem>)}',
      '  </Grid>',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 1, sm: 2 }} gap={4}>{agentStates.map(agent => <GridItem key={agent.name} span={1}><AgentCard {...agent} /></GridItem>)}</Grid></div></Showcase>
    <Showcase title="Controlled agent selection" description="The application owns the selection; selected supplies the card’s pressed state." code={source(
      'import { useState } from "react";',
      'import { AgentCard, Grid, GridItem } from "@chartreuse/ui";',
      '',
      `const agents = ${JSON.stringify(selectableAgents, null, 2)} as const;`,
      '',
      'export function AgentSelection() {',
      '  const [selected, setSelected] = useState("Research agent");',
      '  return <div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '    <Grid columns={{ base: 1, sm: 2 }} gap={4}>',
      '      {agents.map(agent => <GridItem key={agent.name} span={1}>',
      '        <AgentCard {...agent} selected={selected === agent.name}',
      '          onClick={() => setSelected(agent.name)} />',
      '      </GridItem>)}',
      '    </Grid>',
      '    <p role="status">Inspecting: {selected}</p>',
      '  </div>;',
      '}',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 1, sm: 2 }} gap={4}>{selectableAgents.map(agent => <GridItem key={agent.name} span={1}><AgentCard {...agent} selected={selected === agent.name} onClick={() => setSelected(agent.name)} /></GridItem>)}</Grid><p role="status">Inspecting: {selected}</p></div></Showcase>
    <Showcase title="Caller-supplied runtime strings" description="Elapsed time and token counts are display strings. Without onClick the summary has no action." code={source(
      'import { AgentCard } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 380, margin: 0 }}>',
      '  <AgentCard name="Long-running review"',
      '    task="Reviewed the migration plan and its supporting notes."',
      '    status="succeeded" elapsed="01:12:08" tokens="126,480" />',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 380, margin: 0 }}><AgentCard name="Long-running review" task="Reviewed the migration plan and its supporting notes." status="succeeded" elapsed="01:12:08" tokens="126,480" /></div></Showcase>
  </ExampleGallery>;
}

function CalloutBannerScenarios() {
  const [nextStep, setNextStep] = useState('No example action selected.');
  return <ExampleGallery className="layout-scenarios layout-example-gallery">
    <Showcase title="Default artwork" description="Omitting artwork renders the default brand illustration alongside the supplied text." code={source(
      'import { CalloutBanner } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '  <CalloutBanner eyebrow="Component documentation"',
      '    title="Document component behavior."',
      '    description="Record the public props, supported states, and integration constraints." />',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><CalloutBanner eyebrow="Component documentation" title="Document component behavior." description="Record the public props, supported states, and integration constraints." /></div></Showcase>
    <Showcase title="Omit artwork and compose description content" description="Pass null for artwork to remove the illustration. Description accepts composed content." code={source(
      'import { CalloutBanner } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 640, margin: 0 }}>',
      '  <CalloutBanner title="Component review complete" artwork={null}',
      '    description={<p>All <strong>four components</strong> have validated usage examples.</p>} />',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 640, margin: 0 }}><CalloutBanner title="Component review complete" artwork={null} description={<p>All <strong>four components</strong> have validated usage examples.</p>} /></div></Showcase>
    <Showcase title="Custom artwork and action slots" description="artwork and action accept composed content. These buttons update a local status message." code={source(
      'import { useState } from "react";',
      'import { ArrowRight, Sparkles } from "lucide-react";',
      'import { Button, CalloutBanner } from "@chartreuse/ui";',
      '',
      'export function CalloutActions() {',
      '  const [nextStep, setNextStep] = useState("No example action selected.");',
      '  return <div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '    <CalloutBanner eyebrow="Review actions" title="Select a documentation action."',
      '      description="Each button updates the local status message."',
      '      artwork={<Sparkles size={72} aria-hidden="true" />}',
      '      action={<>',
      '        <Button icon={ArrowRight} onClick={() => setNextStep("Checklist action selected.")}>Review checklist</Button>',
      '        <Button variant="ghost" onClick={() => setNextStep("Brief action selected.")}>Read the brief</Button>',
      '      </>} />',
      '    <p role="status">{nextStep}</p>',
      '  </div>;',
      '}',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><CalloutBanner eyebrow="Review actions" title="Select a documentation action." description="Each button updates the local status message." artwork={<Sparkles size={72} aria-hidden="true" />} action={<><Button icon={ArrowRight} onClick={() => setNextStep('Checklist action selected.')}>Review checklist</Button><Button variant="ghost" onClick={() => setNextStep('Brief action selected.')}>Read the brief</Button></>} /><p role="status">{nextStep}</p></div></Showcase>
  </ExampleGallery>;
}

function TaskCardScenarios() {
  return <ExampleGallery className="layout-scenarios layout-example-gallery">
    <Showcase title="Required TaskCard props" description="Only the ID and title are required. Status defaults to To do and priority to Medium." code={source(
      'import { TaskCard } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 360, margin: 0 }}>',
      '  <TaskCard taskId="DOC-100" title="Write the component brief" />',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 360, margin: 0 }}><TaskCard taskId="DOC-100" title="Write the component brief" /></div></Showcase>
    <Showcase title="Workflow status and priority" description="Status and priority render as separate badges and accept independent values." code={source(
      'import { Grid, GridItem, TaskCard } from "@chartreuse/ui";',
      '',
      `const tasks = ${JSON.stringify(taskStates, null, 2)} as const;`,
      '',
      '<div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '  <Grid columns={{ base: 1, sm: 2 }} gap={4}>',
      '    {tasks.map(task => <GridItem key={task.taskId} span={1}>',
      '      <TaskCard {...task} />',
      '    </GridItem>)}',
      '  </Grid>',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 1, sm: 2 }} gap={4}>{taskStates.map(task => <GridItem key={task.taskId} span={1}><TaskCard {...task} /></GridItem>)}</Grid></div></Showcase>
    <Showcase title="Optional context and explicit zero counts" description="Branch and assignees are optional. Explicit zero counts render; omitted counts are hidden." code={source(
      'import { Grid, GridItem, TaskCard } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '  <Grid columns={{ base: 1, sm: 2 }} gap={4}>',
      '    <GridItem span={1}><TaskCard taskId="DOC-105"',
      '      title="Review the layout examples" description="Check source, labels, and available space."',
      '      status="review" priority="high" branch="docs/layout-examples"',
      '      completed={3} total={5} dependencies={{ completed: 1, total: 2 }}',
      '      relatedCount={2} commentCount={4} attachmentCount={1}',
      '      assignees={["Alex Morgan", "Sam Lee"]} /></GridItem>',
      '    <GridItem span={1}><TaskCard taskId="DOC-106"',
      '      title="Verify zero-count metadata" description="All optional metadata counts are explicitly zero."',
      '      dependencies={{ completed: 0, total: 0 }}',
      '      relatedCount={0} commentCount={0} attachmentCount={0} /></GridItem>',
      '  </Grid>',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><TaskCard taskId="DOC-105" title="Review the layout examples" description="Check source, labels, and available space." status="review" priority="high" branch="docs/layout-examples" completed={3} total={5} dependencies={{ completed: 1, total: 2 }} relatedCount={2} commentCount={4} attachmentCount={1} assignees={['Alex Morgan', 'Sam Lee']} /></GridItem><GridItem span={1}><TaskCard taskId="DOC-106" title="Verify zero-count metadata" description="All optional metadata counts are explicitly zero." dependencies={{ completed: 0, total: 0 }} relatedCount={0} commentCount={0} attachmentCount={0} /></GridItem></Grid></div></Showcase>
    <TaskCardDemo />
  </ExampleGallery>;
}

function DrawerScenarios() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dockedOpen, setDockedOpen] = useState(true);
  const [leftOpen, setLeftOpen] = useState(false);
  return <ExampleGallery className="layout-scenarios" maxColumns={3}>
    <Showcase title="Controlled modal drawer" description="Modal mode uses a native dialog. Its close control, footer action, and Escape all update the controlled open state." code={source(
      'import { useState } from "react";',
      'import { Button, Drawer } from "@chartreuse/ui";',
      '',
      'export function ModalDrawer() {',
      '  const [open, setOpen] = useState(false);',
      '  return <div style={{ width: "100%", maxWidth: 380, margin: 0 }}>',
      '    <Button variant="secondary" onClick={() => setOpen(true)}>Open modal details</Button>',
      '    <Drawer open={open} onOpenChange={setOpen} mode="modal"',
      '      title="Review details" description="DOC-105 · Layout examples"',
      '      footer={<Button onClick={() => setOpen(false)}>Close details</Button>}>',
      '      <p>Check that the source includes every item shown in the preview.</p>',
      '    </Drawer>',
      '  </div>;',
      '}',
    )}><div style={{ width: '100%', maxWidth: 380, margin: 0 }}><Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal details</Button><Drawer open={modalOpen} onOpenChange={setModalOpen} mode="modal" title="Review details" description="DOC-105 · Layout examples" footer={<Button onClick={() => setModalOpen(false)}>Close details</Button>}><p>Check that the source includes every item shown in the preview.</p></Drawer></div></Showcase>
    <Showcase title="Docked drawer in a fixed-height parent" description="Docked mode stays in the document layout and fills its parent’s height. The rest of the page remains available." code={source(
      'import { useState } from "react";',
      'import { Button, Drawer, TextArea } from "@chartreuse/ui";',
      '',
      'export function DockedDrawer() {',
      '  const [open, setOpen] = useState(true);',
      '  return <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 420, margin: 0 }}>',
      '    <Button variant="secondary" onClick={() => setOpen(value => !value)}>',
      '      {open ? "Hide docked notes" : "Show docked notes"}',
      '    </Button>',
      '    <div style={{ height: 340, border: "1px solid var(--cr-color-border)", background: "var(--cr-color-subtle)" }}>',
      '      <Drawer open={open} onOpenChange={setOpen} mode="docked"',
      '        title="Task notes" width={420} maxWidth={420}',
      '        footer={<Button variant="secondary" onClick={() => setOpen(false)}>Close notes</Button>}>',
      '        <TextArea label="Review notes" rows={5}',
      '          defaultValue="Record implementation decisions and acceptance criteria." />',
      '      </Drawer>',
      '    </div>',
      '  </div>;',
      '}',
    )}><div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420, margin: 0 }}><Button variant="secondary" onClick={() => setDockedOpen(value => !value)}>{dockedOpen ? 'Hide docked notes' : 'Show docked notes'}</Button><div style={{ height: 340, border: '1px solid var(--cr-color-border)', background: 'var(--cr-color-subtle)' }}><Drawer open={dockedOpen} onOpenChange={setDockedOpen} mode="docked" title="Task notes" width={420} maxWidth={420} footer={<Button variant="secondary" onClick={() => setDockedOpen(false)}>Close notes</Button>}><TextArea label="Review notes" rows={5} defaultValue="Record implementation decisions and acceptance criteria." /></Drawer></div></div></Showcase>
    <Showcase title="Left drawer with a maximum width" description="The requested 560px width is capped at 340px. Modal drawers also fit within the viewport." code={source(
      'import { useState } from "react";',
      'import { Button, Drawer } from "@chartreuse/ui";',
      '',
      'export function LeftDrawer() {',
      '  const [open, setOpen] = useState(false);',
      '  return <div style={{ width: "100%", maxWidth: 380, margin: 0 }}>',
      '    <Button variant="secondary" onClick={() => setOpen(true)}>Open left drawer</Button>',
      '    <Drawer open={open} onOpenChange={setOpen} mode="modal" side="left"',
      '      title="Workspace outline" width={560} maxWidth={340}>',
      '      <p>The drawer opens from the left and uses the smaller width limit.</p>',
      '    </Drawer>',
      '  </div>;',
      '}',
    )}><div style={{ width: '100%', maxWidth: 380, margin: 0 }}><Button variant="secondary" onClick={() => setLeftOpen(true)}>Open left drawer</Button><Drawer open={leftOpen} onOpenChange={setLeftOpen} mode="modal" side="left" title="Workspace outline" width={560} maxWidth={340}><p>The drawer opens from the left and uses the smaller width limit.</p></Drawer></div></Showcase>
    <DrawerPage />
  </ExampleGallery>;
}

function PagePanelScenarios() {
  const formId = useId();
  const overviewId = useId();
  const checklistId = useId();
  const [name, setName] = useState('Sample workspace');
  const [saved, setSaved] = useState('Sample workspace');
  const [reviewed, setReviewed] = useState(false);
  return <ExampleGallery className="layout-scenarios layout-example-gallery" maxColumns={3}>
    <Showcase title="Fixed-height panel with a scrolling body" description="Give the parent a height. The panel fills it while longer body content scrolls independently." code={source(
      'import { PagePanel } from "@chartreuse/ui";',
      '',
      `const sections = ${JSON.stringify(briefSections, null, 2)};`,
      '',
      '<div style={{ height: 340, width: "100%", maxWidth: 720, margin: 0 }}>',
      '  <PagePanel title="Component brief" description="Public API, scope, and validation requirements.">',
      '    {sections.map(section => <section key={section.title}>',
      '      <h3>{section.title}</h3><p>{section.text}</p>',
      '    </section>)}',
      '  </PagePanel>',
      '</div>',
    )}><div style={{ height: 340, width: '100%', maxWidth: 720, margin: 0 }}><PagePanel title="Component brief" description="Public API, scope, and validation requirements.">{briefSections.map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.text}</p></section>)}</PagePanel></div></Showcase>
    <Showcase title="Submit the body form from the footer" description="A footer button can submit the body’s form through its form attribute. This example saves the name locally." code={source(
      'import { useId, useState } from "react";',
      'import { Button, PagePanel, TextField } from "@chartreuse/ui";',
      '',
      'export function PanelForm() {',
      '  const formId = useId();',
      '  const [name, setName] = useState("Sample workspace");',
      '  const [saved, setSaved] = useState("Sample workspace");',
      '  return <div style={{ height: 400, width: "100%", maxWidth: 720, margin: 0 }}>',
      '    <PagePanel title="Workspace name" description="Edit the draft, then save or reset it."',
      '      footer={<>',
      '        <span role="status" style={{ flex: "1 1 200px" }}>Saved name: {saved}</span>',
      '        <Button variant="secondary" onClick={() => setName(saved)}>Reset draft</Button>',
      '        <Button type="submit" form={formId}>Save name</Button>',
      '      </>}>',
      '      <form id={formId} onSubmit={event => { event.preventDefault(); setSaved(name); }}>',
      '        <TextField label="Workspace name" value={name} required',
      '          onChange={event => setName(event.target.value)} />',
      '        <p>The footer stays outside the scrolling form body.</p>',
      '      </form>',
      '    </PagePanel>',
      '  </div>;',
      '}',
    )}><div style={{ height: 400, width: '100%', maxWidth: 720, margin: 0 }}><PagePanel title="Workspace name" description="Edit the draft, then save or reset it." footer={<><span role="status" style={{ flex: '1 1 200px' }}>Saved name: {saved}</span><Button variant="secondary" onClick={() => setName(saved)}>Reset draft</Button><Button type="submit" form={formId}>Save name</Button></>}><form id={formId} onSubmit={event => { event.preventDefault(); setSaved(name); }}><TextField label="Workspace name" value={name} required onChange={event => setName(event.target.value)} /><p>The footer stays outside the scrolling form body.</p></form></PagePanel></div></Showcase>
    <Showcase title="Header actions and separate navigation" description="leading, headerActions, and navigation render outside the scrolling body." code={source(
      'import { useId, useState } from "react";',
      'import { FolderOpen } from "lucide-react";',
      'import { Button, PagePanel } from "@chartreuse/ui";',
      '',
      'export function PanelNavigation() {',
      '  const overviewId = useId();',
      '  const checklistId = useId();',
      '  const [reviewed, setReviewed] = useState(false);',
      '  return <div style={{ height: 380, width: "100%", maxWidth: 720, margin: 0 }}>',
      '    <PagePanel title="Review brief" leading={<FolderOpen size={24} aria-hidden="true" />}',
      '      headerActions={<Button variant="secondary" onClick={() => setReviewed(true)}>Mark reviewed</Button>}',
      '      navigation={<nav aria-label="Review brief sections" style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: "12px 24px" }}>',
      '        <a href={"#" + overviewId}>Overview</a>',
      '        <a href={"#" + checklistId}>Checklist</a>',
      '      </nav>}>',
      '      <section id={overviewId}><h3>Overview</h3>',
      '        <p>Review the focused examples before the interactive workspace.</p>',
      '        <p role="status">{reviewed ? "Reviewed in this example." : "Awaiting review."}</p>',
      '      </section>',
      '      <section id={checklistId}><h3>Checklist</h3>',
      '        <ul><li>Read the public props.</li><li>Compare the preview with its source.</li><li>Check the available space.</li></ul>',
      '      </section>',
      '    </PagePanel>',
      '  </div>;',
      '}',
    )}><div style={{ height: 380, width: '100%', maxWidth: 720, margin: 0 }}><PagePanel title="Review brief" leading={<FolderOpen size={24} aria-hidden="true" />} headerActions={<Button variant="secondary" onClick={() => setReviewed(true)}>Mark reviewed</Button>} navigation={<nav aria-label="Review brief sections" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '12px 24px' }}><a href={'#' + overviewId}>Overview</a><a href={'#' + checklistId}>Checklist</a></nav>}><section id={overviewId}><h3>Overview</h3><p>Review the focused examples before the interactive workspace.</p><p role="status">{reviewed ? 'Reviewed in this example.' : 'Awaiting review.'}</p></section><section id={checklistId}><h3>Checklist</h3><ul><li>Read the public props.</li><li>Compare the preview with its source.</li><li>Check the available space.</li></ul></section></PagePanel></div></Showcase>
    <PagePanelPage />
  </ExampleGallery>;
}

function GridItemScenarios() {
  return <ExampleGallery className="layout-scenarios layout-example-gallery" maxColumns={4}>
    <Showcase title="Place items on explicit column spans" description="Span a known number of columns or use full for the entire active grid." code={source(
      'import { Card, Grid, GridItem } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '  <Grid columns={4} gap={3}>',
      '    <GridItem span={1}><Card style={{ padding: 16 }}>1 column</Card></GridItem>',
      '    <GridItem span={3}><Card style={{ padding: 16 }}>3 columns</Card></GridItem>',
      '    <GridItem span="full"><Card style={{ padding: 16 }}>The full row</Card></GridItem>',
      '  </Grid>',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={4} gap={3}><GridItem span={1}><Card style={{ padding: 16 }}>1 column</Card></GridItem><GridItem span={3}><Card style={{ padding: 16 }}>3 columns</Card></GridItem><GridItem span="full"><Card style={{ padding: 16 }}>The full row</Card></GridItem></Grid></div></Showcase>
    <Showcase title="Change spans with the container width" description="Items occupy full rows in the base two-column layout, then share a four-column row from the sm container tier." code={source(
      'import { Card, Grid, GridItem } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '  <Grid columns={{ base: 2, sm: 4 }} gap={4}>',
      '    <GridItem span={{ base: "full", sm: 3 }}>',
      '      <Card style={{ padding: 16 }}>Main content: full width, then 3 columns.</Card>',
      '    </GridItem>',
      '    <GridItem span={{ base: "full", sm: 1 }}>',
      '      <Card style={{ padding: 16 }}>Context: full width, then 1 column.</Card>',
      '    </GridItem>',
      '  </Grid>',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 2, sm: 4 }} gap={4}><GridItem span={{ base: 'full', sm: 3 }}><Card style={{ padding: 16 }}>Main content: full width, then 3 columns.</Card></GridItem><GridItem span={{ base: 'full', sm: 1 }}><Card style={{ padding: 16 }}>Context: full width, then 1 column.</Card></GridItem></Grid></div></Showcase>
    <Showcase title="Span two grid rows" description="rowSpan controls placement. The child surface fills the height allocated to that item." code={source(
      'import { Card, Grid, GridItem } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 680, margin: 0 }}>',
      '  <Grid columns={2} gap={4}>',
      '    <GridItem span={1} rowSpan={2}>',
      '      <Card style={{ padding: 16, height: "100%" }}>This item spans both rows.</Card>',
      '    </GridItem>',
      '    <GridItem span={1}><Card style={{ padding: 16, minHeight: 96 }}>Row 1 item</Card></GridItem>',
      '    <GridItem span={1}><Card style={{ padding: 16, minHeight: 96 }}>Row 2 item</Card></GridItem>',
      '  </Grid>',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 680, margin: 0 }}><Grid columns={2} gap={4}><GridItem span={1} rowSpan={2}><Card style={{ padding: 16, height: '100%' }}>This item spans both rows.</Card></GridItem><GridItem span={1}><Card style={{ padding: 16, minHeight: 96 }}>Row 1 item</Card></GridItem><GridItem span={1}><Card style={{ padding: 16, minHeight: 96 }}>Row 2 item</Card></GridItem></Grid></div></Showcase>
    <Showcase title="Align individual items within the row" description="At the sm container tier, the first item establishes the row height. The remaining items set align and justify independently." code={source(
      'import { Card, Grid, GridItem } from "@chartreuse/ui";',
      '',
      '<div style={{ width: "100%", maxWidth: 800, margin: 0 }}>',
      '  <Grid columns={{ base: 1, sm: 4 }} gap={4} align="stretch">',
      '    <GridItem span={1}><Card style={{ padding: 16, minHeight: 180 }}>Reference height</Card></GridItem>',
      '    <GridItem span={1} align="start" justify="start">',
      '      <Card style={{ padding: 12 }}>Start</Card>',
      '    </GridItem>',
      '    <GridItem span={1} align="center" justify="center">',
      '      <Card style={{ padding: 12 }}>Center</Card>',
      '    </GridItem>',
      '    <GridItem span={1} align="end" justify="end">',
      '      <Card style={{ padding: 12 }}>End</Card>',
      '    </GridItem>',
      '  </Grid>',
      '</div>',
    )}><div style={{ width: '100%', maxWidth: 800, margin: 0 }}><Grid columns={{ base: 1, sm: 4 }} gap={4} align="stretch"><GridItem span={1}><Card style={{ padding: 16, minHeight: 180 }}>Reference height</Card></GridItem><GridItem span={1} align="start" justify="start"><Card style={{ padding: 12 }}>Start</Card></GridItem><GridItem span={1} align="center" justify="center"><Card style={{ padding: 12 }}>Center</Card></GridItem><GridItem span={1} align="end" justify="end"><Card style={{ padding: 12 }}>End</Card></GridItem></Grid></div></Showcase>
    <MasonryItem span="full"><GridItemDemo /></MasonryItem>
  </ExampleGallery>;
}

/** Focused contracts first, followed by each component's existing interactive demo. */
export function LayoutScenarios({ name }: { name: LayoutScenarioName }) {
  switch (name) {
    case 'AgentCard': return <AgentCardScenarios />;
    case 'CalloutBanner': return <CalloutBannerScenarios />;
    case 'TaskCard': return <TaskCardScenarios />;
    case 'Drawer': return <DrawerScenarios />;
    case 'PagePanel': return <PagePanelScenarios />;
    case 'GridItem': return <GridItemScenarios />;
  }
}
