import { useState } from 'react';
import { ArrowUpRight, Check, ClipboardList, FileText, GitBranch, Layers, MessageSquare, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Alert, AvatarGroup, Badge, BrandMark, Button, Checkbox, Dialog, Divider, Progress, Switch, Tabs, useToast, Text } from '../system';
import { ActivityFeed, CreateTaskDialog } from './Demos';
import { ExampleGallery, Showcase } from './shared';
import { GuidanceNotes } from './GuidanceNotes';
import { componentReferences } from './reference';
import { SplitContentExample } from './SplitContentExample';
import { SplitOptions } from './SplitOptions';
import type { SplitOptionsValue } from './SplitOptions';

type Example = 'simple' | 'form' | 'confirmation' | 'details' | 'split' | null;
const checklist = [
  'Render board, metadata, and task details',
  'Render task status labels',
  'Use shared color and spacing tokens',
  'Render the agent activity feed',
  'Check control alignment and spacing',
  'Validate narrow viewport behavior',
  'Validate keyboard navigation',
  'Review implementation constraints',
];

const simpleDialogCode = `import { useState } from 'react';
import { ArrowUpRight, Check, Layers } from 'lucide-react';
import { Badge, BrandMark, Button, Dialog, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

export function WelcomeDialogExample() {
  const [open, setOpen] = useState(false);

  return <>
    <Button variant="secondary" size="sm" iconRight={ArrowUpRight}
      onClick={() => setOpen(true)}>Open simple modal</Button>
    <Dialog open={open} onOpenChange={setOpen}
      title="Dialog open state"
      description="Close the dialog to update the controlled open state."
      footer={<Button iconRight={Check} autoFocus
        onClick={() => setOpen(false)}>Close dialog</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', gap: 17,
        padding: '26px 10px 16px' }}>
        <span style={{ display: 'grid', placeItems: 'center',
          width: 82, height: 82, borderRadius: 'var(--cr-radius-md)',
          border: '1px solid var(--cr-color-border)',
          background: 'var(--cr-color-success-bg)' }}>
          <BrandMark style={{ width: 53, height: 53 }} />
        </span>
        <Text size="heading-3" style={{ margin: 0, fontSize: 22, fontWeight: 500,
          letterSpacing: '-.65px' }}>Controlled modal example</Text>
        <Text size="body" style={{ margin: 0, maxWidth: '36ch', fontSize: 12,
          lineHeight: 1.9, color: 'var(--cr-color-muted)' }}>
          The parent owns open state. The footer action closes
          this dialog by updating that state.
        </Text>
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexWrap: 'wrap', gap: 8,
          marginTop: 5 }}>
          <Badge icon={Layers} style={{ fontSize: 9 }}>
            Controlled state
          </Badge>
          <Badge tone="success" dot style={{ fontSize: 9 }}>
            Native dialog
          </Badge>
        </div>
      </div>
    </Dialog>
  </>;
}`;

const formDialogCode = `import { useId, useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Alert, Button, Dialog, Select, TextArea, TextField,
  ToastProvider, useToast, type TaskCardProps } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

// Place ToastProvider once near the app root in your application.
export function CreateTaskExample() {
  return <ToastProvider><TaskFormExample /></ToastProvider>;
}

function TaskFormExample() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskCardProps['priority']>('medium');
  const [createdTask, setCreatedTask] = useState<TaskCardProps | null>(null);
  const formId = useId();
  const notify = useToast();

  return <>
    <Button variant="secondary" size="sm" iconRight={ArrowUpRight}
      onClick={() => setOpen(true)}>Open form modal</Button>
    {createdTask && <Alert tone="success" title="Task created locally">
      “{createdTask.title}” was created in this example.
    </Alert>}
    <Dialog open={open} onOpenChange={setOpen}
      title="Create task"
      description="Enter task details. Submit creates a task in local example state."
      footer={<>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" form={formId} icon={Plus}>Create task</Button>
      </>}
    >
      <form id={formId} style={{ display: 'flex', flexDirection: 'column',
        gap: 18, minWidth: 0 }} onSubmit={event => {
        event.preventDefault();
        const title = name.trim();
        setCreatedTask({
          taskId: 'TASK-' + Date.now().toString().slice(-5),
          title, description, priority, status: 'todo',
          completed: 0, total: 0, assignees: ['Sam Lee'],
        });
        notify('“' + title + '” created in this example.');
        setOpen(false);
        setName('');
        setDescription('');
        event.currentTarget.reset();
      }}>
        <TextField label="Task name" name="title" value={name}
          onChange={event => setName(event.target.value)}
          pattern=".*\\S.*" title="Enter a task name that includes text"
          placeholder="Enter a task title" autoFocus required />
        <TextArea label="Description" name="description" value={description}
          onChange={event => setDescription(event.target.value)}
          placeholder="Describe the task scope and acceptance criteria…" rows={3} />
        <Select label="Priority" name="priority" value={priority}
          onChange={event => setPriority(event.target.value as TaskCardProps['priority'])}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </form>
    </Dialog>
  </>;
}`;

export function ModalsPage({ showGuidance = true }: { showGuidance?: boolean } = {}) {
  const [example, setExample] = useState<Example>(null);
  const [createdTask, setCreatedTask] = useState('');
  const [freezeHeight, setFreezeHeight] = useState(false);
  const [splitOptions, setSplitOptions] = useState<SplitOptionsValue>({ resizableSplit: true, sideContentMaxWidth: 640, maxWidth: 1600 });
  const [checks, setChecks] = useState(checklist.map((_, index) => index < 3));
  const notify = useToast();
  const close = () => setExample(null);
  const completed = checks.filter(Boolean).length;

  return <>
    <div className="modal-page-intro"><Text size="body">Six controlled examples demonstrate content, forms, confirmation, height behavior, split panes, and a workspace-contained dialog using the <code>Dialog</code> component.</Text><span><kbd>esc</kbd> to close</span></div>

    <ExampleGallery className="two-column modal-gallery" maxColumns={4}>
      <Showcase title="Controlled dialog with one close action" description="Default size with controlled open state and an auto-focused footer button." code={simpleDialogCode}>
        <div className="modal-example-preview" aria-hidden="true"><div className="modal-miniature"><div className="modal-miniature-mark"><BrandMark /></div><Text bold>Dialog open state</Text><Text size="body">The parent controls the dialog open state.</Text><span className="modal-miniature-action">Close dialog <ArrowUpRight size={12} /></span></div></div>
        <div className="modal-launch"><span>The footer button sets open to false.</span><Button variant="secondary" size="sm" iconRight={ArrowUpRight} onClick={() => setExample('simple')}>Open simple modal</Button></div>
      </Showcase>

      <Showcase title="Form submission from a dialog footer" description="Medium dialog with a body form and an associated footer submit button." code={formDialogCode}>
        <div className="modal-example-preview" aria-hidden="true"><div className="modal-miniature"><span className="eyebrow">LOCAL TASK FORM</span><Text bold>Create task</Text><span className="modal-miniature-label">Task name</span><div className="modal-miniature-input">Enter a task title</div><span className="modal-miniature-action"><Plus size={12} /> Create task</span></div></div>
        <div className="modal-launch"><span>The footer submit button targets the body form.</span><Button variant="secondary" size="sm" iconRight={ArrowUpRight} onClick={() => setExample('form')}>Open form modal</Button></div>
      </Showcase>

      <Showcase title="Destructive action confirmation" description="Small dialog with the cancel action focused on open." code={`import { Button, Dialog, Text } from '@chartreuse/ui';\n\n<Dialog size="sm" open={open} onOpenChange={setOpen}\n  title="Delete this task?"\n  description="Confirm deletion of the selected task."\n  footer={<>\n    <Button variant="secondary" autoFocus\n      onClick={() => setOpen(false)}>Keep task</Button>\n    <Button variant="danger" onClick={deleteTask}>\n      Delete task\n    </Button>\n  </>}\n>\n  <Text size="body">Check the task identifier before confirming deletion.</Text>\n</Dialog>`}>
        <div className="modal-example-preview" aria-hidden="true"><div className="modal-miniature"><span className="modal-miniature-warning"><Trash2 size={18} /></span><Text bold>Delete this task?</Text><Text size="body">Cancel receives focus before the destructive action.</Text><div className="modal-miniature-actions"><span>Keep task</span><span>Delete task</span></div></div></div>
        <div className="modal-launch"><span>autoFocus targets the cancel button.</span><Button variant="secondary" size="sm" iconRight={ArrowUpRight} onClick={() => setExample('confirmation')}>Open confirmation</Button></div>
      </Showcase>

      <Showcase title="Large dialog with content-driven height" description="Large dialog; freezeHeight optionally preserves its opening height." toolbar={<><Switch label="Freeze height while open" checked={freezeHeight} onChange={e => setFreezeHeight(e.target.checked)} /><span>Optional</span></>} code={`<Dialog size="lg" freezeHeight={freezeHeight} open={open} onOpenChange={setOpen}\n  title="Implement the workspace task board"\n  description="TASK-024 · Sample workspace"\n  footer={<Button onClick={() => setOpen(false)}>Done</Button>}\n>\n  <Tabs label="Task detail views" items={items} />\n</Dialog>\n\n// Height follows content by default.\n// Set freezeHeight to preserve the opening height.`}>
        <div className="modal-example-preview" aria-hidden="true"><div className="modal-miniature"><span className="eyebrow">TASK-024 / TASK DETAILS</span><Text bold>Task metadata and checklist</Text><div className="modal-miniature-meta"><Badge tone="info" dot>In progress</Badge><AvatarGroup names={['Alex Morgan', 'Sam Lee']} /></div><div className="modal-miniature-lines"><span /><span /><span /></div><span className="modal-miniature-scroll">Scrollable task body ↓</span></div></div>
        <div className="modal-launch"><span>Footer actions remain outside the scrolling body.</span><Button variant="secondary" size="sm" iconRight={ArrowUpRight} onClick={() => setExample('details')}>Open task details</Button></div>
      </Showcase>

      <Showcase span="full" title="Split body with a shared footer" description="Extra-large dialog with separate body panes and opt-in resizing." className="modal-split-showcase" toolbar={<SplitOptions value={splitOptions} onChange={setSplitOptions} />} code={`<Dialog\n  open={open}\n  onOpenChange={setOpen}\n  size="xl"\n  maxWidth={${splitOptions.maxWidth}}\n  resizableSplit={${splitOptions.resizableSplit}}\n  sideContentMaxWidth={${splitOptions.sideContentMaxWidth}}\n  title="Card details"\n  contentLabel="Details"\n  sideContentLabel="Comments"\n  sideContent={<CommentsPanel />}\n  footer={<SharedActions />}\n>\n  <CardDetails />\n</Dialog>\n\n// Resizing is opt-in. Drag the divider or use its arrow keys.\n// Both panes stay inside the body; the footer stays full width.`}>
        <div className="modal-example-preview" aria-hidden="true"><div className="modal-miniature modal-split-miniature"><Text bold>Card details</Text><div className="modal-split-miniature-body"><div><span className="eyebrow">TASK-024</span><Text bold>Implement the workspace task board</Text><div className="modal-miniature-lines"><span /><span /><span /></div><Badge tone="info" dot>In progress</Badge></div><div><Text bold><MessageSquare size={12} />Comments</Text><div className="modal-miniature-lines"><span /><span /></div><div className="modal-miniature-input">Enter a review comment…</div></div></div><div className="modal-split-miniature-footer"><span>One shared footer</span><span className="modal-miniature-action">Close</span></div></div></div>
        <div className="modal-launch"><span>Both panes scroll within the dialog body.</span><Button variant="secondary" size="sm" iconRight={ArrowUpRight} onClick={() => setExample('split')}>Open split content</Button></div>
      </Showcase>
      <Showcase span="full" title="Dialog contained in a workspace area" description="A non-modal dialog that covers one element, such as the workspace content, while the navigation beside it stays usable." code={`const [workspace, setWorkspace] = useState(null);

<WorkspaceContent ref={setWorkspace}>…</WorkspaceContent>
<Dialog open={open} onOpenChange={setOpen} container={workspace}
  title="Card details" description="TASK-024"
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
  <CardDetails />
</Dialog>

// No backdrop: the navbar and sidebars stay clickable.
// Escape and the close button still dismiss it.`}>
        <ContainedDialogExample />
      </Showcase>
    </ExampleGallery>

    {createdTask && <div className="document-section"><Alert tone="success" title="Task created locally">“{createdTask}” was created in this example.</Alert></div>}

    {showGuidance && <GuidanceNotes notes={componentReferences.find(reference => reference.name === 'Dialog')?.notes || []} />}

    <Dialog open={example === 'simple'} onOpenChange={close} title="Dialog open state" description="Close the dialog to update the controlled open state." footer={<Button iconRight={Check} autoFocus onClick={close}>Close dialog</Button>}>
      <div className="modal-welcome"><span><BrandMark /></span><Text size="heading-3">Controlled modal example</Text><Text size="body">The parent owns open state. The footer action closes this dialog by updating that state.</Text><div className="demo-row center-row"><Badge icon={Layers}>Controlled state</Badge><Badge tone="success" dot>Native dialog</Badge></div></div>
    </Dialog>

    <CreateTaskDialog open={example === 'form'} onOpenChange={close} onCreate={task => setCreatedTask(task.title)} />
    <SplitContentExample open={example === 'split'} onOpenChange={close} resizableSplit={splitOptions.resizableSplit} sideContentMaxWidth={splitOptions.sideContentMaxWidth} maxWidth={splitOptions.maxWidth} />

    <Dialog size="sm" open={example === 'confirmation'} onOpenChange={close} title="Delete this task?" description="Confirm deletion of the selected task." footer={<><Button variant="secondary" autoFocus onClick={close}>Keep task</Button><Button variant="danger" icon={Trash2} onClick={() => { close(); notify('Delete action completed in local example'); }}>Delete task</Button></>}>
      <div className="modal-confirm-task"><span><ClipboardList size={18} aria-hidden="true" /></span><div><Text bold>Implement the workspace task board</Text><Text size="body">TASK-024 · In progress</Text></div></div><Text size="body" className="modal-confirm-note">Check the task identifier before confirming deletion.</Text>
    </Dialog>

    <Dialog size="lg" freezeHeight={freezeHeight} open={example === 'details'} onOpenChange={close} title="Implement the workspace task board" description="TASK-024 · Sample workspace" footer={<><span className="modal-detail-progress"><Check size={13} aria-hidden="true" />{completed} of {checklist.length} complete</span><Button icon={Check} onClick={close}>Done</Button></>}>
      <div className="modal-detail-summary"><div className="demo-row"><Badge tone="info" dot>In progress</Badge><Badge tone="warning">High priority</Badge><span className="modal-detail-branch"><GitBranch size={13} aria-hidden="true" />feat/workspace</span></div><AvatarGroup names={['Alex Morgan', 'Sam Lee']} /></div>
      <Tabs label="Task detail views" items={[
        { value: 'overview', label: 'Overview', icon: FileText, content: <div className="modal-detail-content"><section><Text size="heading-3">Task scope</Text><Text size="body">Add status lanes, task search, and task detail dialogs.</Text></section><Divider /><section><div className="modal-checklist-heading"><Text size="heading-3">Acceptance checklist</Text><Badge tone="success">{completed}/{checklist.length}</Badge></div><Progress value={completed} max={checklist.length} label={`${completed} of ${checklist.length} checklist items complete`} /><div className="modal-detail-checklist">{checklist.map((label, index) => <Checkbox key={label} label={label} checked={checks[index]} onChange={e => setChecks(previous => previous.map((checked, i) => i === index ? e.target.checked : checked))} />)}</div></section><Divider /><section><Text size="heading-3">Implementation constraints</Text><Text size="body">Use shared color, spacing, and typography tokens. Validate narrow viewport layout and complete the workflow with keyboard input.</Text></section><Alert tone="neutral" title="Implementation notes">Record design decisions, state ownership, and validation results with the task.</Alert></div> },
        { value: 'activity', label: 'Activity', icon: Sparkles, content: <ActivityFeed /> },
      ]} />
    </Dialog>
  </>;
}

function ContainedDialogExample() {
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState<HTMLElement | null>(null);
  const [clicks, setClicks] = useState(0);
  return <div className="modal-contained-frame">
    <nav className="modal-contained-nav" aria-label="Example navigation">
      <Text bold>Navigation</Text>
      <Button variant="ghost" size="sm" onClick={() => setClicks(count => count + 1)}>Still clickable</Button>
      <Text size="body">{clicks} {clicks === 1 ? 'click' : 'clicks'}</Text>
    </nav>
    <section className="modal-contained-area" ref={setArea} aria-label="Example workspace content">
      <Text size="body">The dialog covers this area only.</Text>
      <Button variant="secondary" size="sm" iconRight={ArrowUpRight} onClick={() => setOpen(true)}>Open in this area</Button>
    </section>
    <Dialog open={open} onOpenChange={setOpen} container={area} title="Card details" description="TASK-024 · Sample workspace"
      footer={<Button icon={Check} onClick={() => setOpen(false)}>Done</Button>}>
      <Text size="body">Add status lanes, task search, and task detail dialogs.</Text>
    </Dialog>
  </div>;
}
