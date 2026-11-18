import { useRef, useState } from 'react';
import { ArrowRight, Check, ChevronRight, GitBranch, LayoutDashboard, ListChecks, PanelLeftOpen, PanelRightOpen, Sparkles } from 'lucide-react';
import { Badge, Button, Checkbox, Progress, Select, TextField } from '../system/components';
import { Drawer } from '../system/Drawer';
import type { DrawerProps } from '../system/Drawer';
import { MessageComposer } from '../system/MessageComposer';
import { Showcase, SectionTitle } from './shared';
import './DrawerPage.css';

const prompts = ['Split the task into implementation cards', 'List the implementation prerequisites', 'Identify the next unblocked card'];
const initialMessages = [
  { id: 1, role: 'user', text: 'What should the workspace task view include?' },
  { id: 2, role: 'assistant', text: 'Include a task title, scope description, acceptance checklist, and implementation notes.' },
];

export function DrawerPage() {
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState<DrawerProps['mode']>('docked');
  const [side, setSide] = useState<DrawerProps['side']>('right');
  const [width, setWidth] = useState(380);
  const [maxWidth, setMaxWidth] = useState(520);
  const [harness, setHarness] = useState('codex');
  const [model, setModel] = useState('default');
  const [access, setAccess] = useState('read-only');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [checks, setChecks] = useState([true, true, false, false]);
  const footer = useRef<HTMLDivElement>(null);
  const completed = checks.filter(Boolean).length;
  const send = (message: string) => {
    // The example stays local. No harness, provider, or backend is contacted.
    const answer = message.toLowerCase().includes('card')
      ? 'Use separate cards for API inspection, implementation, and validation. Give each card a defined completion criterion.'
      : 'Inspect the task dependencies, select an unblocked task, and record its expected behavior and validation steps.';
    setMessages(previous => [...previous, { id: Date.now(), role: 'user', text: message }, { id: Date.now() + 1, role: 'assistant', text: answer }]);
    setDraft('');
  };

  const orchestrator = <Drawer open={open} onOpenChange={setOpen} mode={mode} side={side} width={width} maxWidth={maxWidth} title="Orchestrator" description="TASK-024 · Implement the workspace task board" footer={<div ref={footer}><MessageComposer label="Message the orchestrator" placeholder="Enter a task instruction…" hint="Messages are stored in local example state." value={draft} onValueChange={setDraft} onSend={send} rows={3} /></div>}>
    <div className="drawer-context-controls"><Select label="Harness" value={harness} onChange={event => setHarness(event.target.value)}><option value="codex">Codex</option><option value="hosted">Hosted agent</option></Select><Select label="Model" value={model} onChange={event => setModel(event.target.value)}><option value="default">Default</option><option value="fast">Fast</option><option value="reasoning">Reasoning</option></Select><Select label="Workspace access" value={access} onChange={event => setAccess(event.target.value)}><option value="read-only">Read only</option><option value="workspace-write">Workspace write</option></Select><span className="drawer-context-status"><Badge tone="success" dot>Local state</Badge><span>Provider settings are illustrative.</span></span></div>
    <section className="drawer-suggestions"><span className="drawer-suggestion-mark"><Sparkles size={23} aria-hidden="true" /></span><h3>Sample task instructions</h3><p>Select an instruction to populate the composer.</p>{prompts.map(prompt => <button type="button" key={prompt} onClick={() => { setDraft(prompt); footer.current?.querySelector('textarea')?.focus(); }}>{prompt}<ChevronRight size={14} aria-hidden="true" /></button>)}</section>
    <div className="drawer-conversation" role="log" aria-label="Orchestrator conversation" aria-relevant="additions" aria-live="polite">{messages.map(message => <article key={message.id} className="drawer-chat-message" data-role={message.role}><header><strong>{message.role === 'user' ? 'You' : 'Orchestrator'}</strong><span>{message.id < 3 ? 'Initial message' : 'Just now'}</span></header><p>{message.text}</p></article>)}</div>
  </Drawer>;

  const workspace = <div className="drawer-demo-workspace"><div className="drawer-demo-workspace-top"><span className="eyebrow">TASK-024 / WORKSPACE</span><Badge tone="success" dot>In progress</Badge></div><h2>Implement the workspace task board</h2><p>Add status lanes, task search, and task detail dialogs.</p><div className="drawer-workspace-facts"><span><GitBranch size={13} aria-hidden="true" />feat/workspace</span><span><ListChecks size={13} aria-hidden="true" />{completed} of 4 complete</span></div><div className="drawer-workspace-tabs"><span><LayoutDashboard size={14} aria-hidden="true" />Board</span><Badge>4 cards</Badge></div><div className="drawer-workspace-card"><div><span className="eyebrow">IMPLEMENTATION CHECKLIST</span><Badge tone="info" dot>In progress</Badge></div><h3>Verify workspace interactions</h3><p>Checklist edits update local state. Docked mode leaves these controls available.</p><Progress value={completed} max={4} label={`${completed} of four workspace checks complete`} /><div className="drawer-workspace-checks">{['Inspect task metadata', 'Identify task dependencies', 'Implement task view changes', 'Validate keyboard interactions'].map((label, index) => <Checkbox key={label} label={label} checked={checks[index]} onChange={event => setChecks(previous => previous.map((checked, i) => i === index ? event.target.checked : checked))} />)}</div></div><div className="drawer-workspace-note"><Sparkles size={16} aria-hidden="true" /><p>Docked mode shares the layout. Modal mode places the drawer in the native top layer.</p></div></div>;

  return <Showcase span="full" title="Configurable docked and modal drawer" description="Control mode, side, width, and maxWidth with the example inputs." code={`import { Drawer, MessageComposer } from '@chartreuse/ui';\n\n<Drawer\n  open={open}\n  onOpenChange={setOpen}\n  title="Orchestrator"\n  description="TASK-024 · Implement the workspace task board"\n  mode=${JSON.stringify(mode)}\n  side=${JSON.stringify(side)}\n  width={${width}}\n  maxWidth={${maxWidth}}\n  footer={<MessageComposer onSend={sendMessage} />}\n>\n  <ConversationContext />\n  <Conversation />\n</Drawer>`}>
    <div className="drawer-page-intro"><p>Docked mode renders an aside in the workspace. Modal mode opens a native dialog and confines focus until closed.</p><Badge>Interactive example</Badge></div>
    <div className="drawer-demo-controls"><Select label="Behavior" value={mode} onChange={event => { setOpen(false); setMode(event.target.value as DrawerProps['mode']); }}><option value="docked">Docked panel</option><option value="modal">Modal drawer</option></Select><Select label="Side" value={side} onChange={event => setSide(event.target.value as DrawerProps['side'])}><option value="right">Right</option><option value="left">Left</option></Select><TextField label="Width (px)" type="number" min={280} max={800} step={20} value={width} onChange={event => setWidth(Math.max(280, Math.min(800, Number(event.target.value) || 380)))} /><TextField label="Max width (px)" type="number" min={280} max={800} step={20} value={maxWidth} onChange={event => setMaxWidth(Math.max(280, Math.min(800, Number(event.target.value) || 520)))} /><Button variant="secondary" icon={side === 'left' ? PanelLeftOpen : PanelRightOpen} onClick={() => setOpen(value => !value)}>{open ? 'Hide drawer' : 'Show drawer'}</Button></div>
    <div className="drawer-example-frame" data-drawer-open={open && mode === 'docked'} data-side={side}><div className="drawer-example-topbar"><span><Sparkles size={16} aria-hidden="true" />Sample workspace</span><Badge>Workspace</Badge></div><div className="drawer-example-layout">{side === 'left' && orchestrator}{workspace}{side === 'right' && orchestrator}</div></div>
    <div className="document-section"><SectionTitle title="Drawer mode behavior" description="Mode determines layout participation and focus handling." /><div className="drawer-behavior-notes"><article><h3><Check size={16} aria-hidden="true" />Docked</h3><p>The panel participates in the workspace layout. Background controls remain interactive. Escape closes the drawer when focus is inside it.</p></article><article><h3><ArrowRight size={16} aria-hidden="true" />Modal</h3><p>A native modal drawer keeps focus inside until it closes. Escape dismisses it and returns focus to the control that opened it.</p></article></div></div>

  </Showcase>;
}
