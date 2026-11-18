import { useId, useState } from 'react';
import { Check, Clock3, FolderOpen, LayoutDashboard, Plus, Search, Sparkles } from 'lucide-react';
import { Sidebar } from '../system/Sidebar';
import { Badge, BrandMark, Button, Checkbox, EmptyState, Progress, Select } from '../system/components';
import { ExampleGallery, Showcase } from './shared';
import './sidebar-demo.css';

type RunState = 'Succeeded' | 'Running' | 'Waiting' | 'Failed';
const runTitles = ['Load task metadata and attached review reports.', 'Check task dependencies and checklist status.', 'Inspect the active agent and tool events.', 'Verify build results before closing the task.', 'Attach the conversation transcript to the task.', 'Record review findings in the task report.', 'Check sidebar overflow at narrow widths.', 'Summarize command results from this run.', 'Define acceptance criteria for the next change.'];
const firstRuns = runTitles.map((title, i) => ({ id: `run-${String(1009 - i)}`, title, provider: i % 3 === 2 ? 'Hosted agent' : 'Codex', status: (i === 1 ? 'Running' : i === 3 ? 'Waiting' : i === 6 ? 'Failed' : 'Succeeded') as RunState, time: i === 0 ? 'A moment ago' : `${i * 12} min ago`, tokens: (i + 1) * 1240 }));
const runTone = (status: RunState) => status === 'Succeeded' ? 'success' : status === 'Running' ? 'info' : status === 'Waiting' ? 'warning' : 'danger';

function SearchField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId();
  return <div className="sidebar-demo-search"><label htmlFor={id} className="cr-sr-only">{label}</label><div className="cr-input-wrap"><Search size={16} aria-hidden="true" /><input id={id} name={label === 'Search loaded runs' ? 'runSearch' : 'taskSearch'} className="cr-input" type="search" placeholder={label === 'Search loaded runs' ? 'Search loaded runs…' : 'Find a task…'} value={value} onChange={event => onChange(event.target.value)} autoComplete="off" spellCheck={false} /></div></div>;
}

function RunHistoryExample() {
  const [runs, setRuns] = useState(firstRuns);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(firstRuns[0].id);
  const filtered = runs.filter(run => `${run.title} ${run.id} ${run.provider} ${run.status}`.toLowerCase().includes(query.toLowerCase()));
  const selected = filtered.find(run => run.id === selectedId) || filtered[0];
  return <div className="sidebar-demo-frame"><div className="sidebar-run-layout"><Sidebar variant="floating" width={280} aria-label="Run history" contentLabel="Recorded runs" header={<div className="sidebar-run-header"><div className="sidebar-demo-panel-title"><h3>Run history</h3><Badge>{filtered.length}</Badge></div><SearchField label="Search loaded runs" value={query} onChange={setQuery} /></div>} footer={<div className="sidebar-run-footer"><span>{runs.length} recorded runs</span><Button size="sm" variant="ghost" icon={Plus} onClick={() => setRuns(previous => [...previous, ...firstRuns.slice(0, 3).map((run, i) => ({ ...run, id: `run-${1000 - previous.length - i}`, time: 'Earlier in this example' }))])}>Load more</Button></div>}>
    {filtered.length ? <ul className="sidebar-run-list" role="list">{filtered.map(run => <li key={run.id}><button type="button" className="sidebar-run-choice" aria-pressed={selected?.id === run.id} onClick={() => setSelectedId(run.id)}><span className="sidebar-run-choice-title"><strong>Coordinator</strong><Badge tone={runTone(run.status)} dot>{run.status}</Badge></span><span className="sidebar-run-excerpt">{run.title}</span><strong className="sidebar-run-provider">{run.provider}</strong><span className="sidebar-run-time"><Clock3 size={13} aria-hidden="true" />{run.time}</span></button></li>)}</ul> : <EmptyState icon={Search} title="No matching runs" description="Search by task title, run ID, provider, or status." action={<Button variant="secondary" size="sm" onClick={() => setQuery('')}>Clear search</Button>} />}
  </Sidebar><section className="sidebar-run-inspector" aria-label="Selected run">{selected ? <><div className="sidebar-demo-inspector-title"><span>Selected run</span><Badge>Local example</Badge></div><h3>Coordinator</h3><Badge tone={runTone(selected.status)} dot>{selected.status}</Badge><p>{selected.title}</p><dl><div><dt>Run</dt><dd><code>{selected.id}</code></dd></div><div><dt>Provider</dt><dd>{selected.provider}</dd></div><div><dt>Recorded</dt><dd>{selected.time}</dd></div><div><dt>Tokens</dt><dd>{selected.tokens.toLocaleString()}</dd></div></dl><div className="sidebar-demo-context-note"><Sparkles size={19} aria-hidden="true" /><p>Select a run to view its ID, provider, timestamp, and token count. This example owns filtering and selection state.</p></div></> : <p className="muted">Change or clear the search to select a run.</p>}</section></div></div>;
}

interface DemoTask { id: string; title: string; project: string; checks: boolean[] }
const firstTasks: DemoTask[] = [
  { id: 'TASK-001', title: 'Display task metadata and attached reports', project: 'sample-app', checks: [true, true, false, false, false] },
  { id: 'DS-002', title: 'Document component props and interaction states', project: 'component-library', checks: [true, true, true] },
  { id: 'TASK-003', title: 'Store review decisions in task reports', project: 'sample-app', checks: [true, false, false, false] },
  { id: 'TASK-004', title: 'Verify empty and loading states in the library', project: 'frontend-client', checks: [false, false, false] },
  { id: 'DS-005', title: 'Audit keyboard interaction across components', project: 'component-library', checks: [true, true, false] },
  { id: 'TASK-006', title: 'Link conversation transcripts to task records', project: 'sample-app', checks: [true, false, false, false] },
];

function WorkspaceNavigationExample() {
  const [tasks, setTasks] = useState(firstTasks);
  const [project, setProject] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(firstTasks[1].id);
  const [announcement, setAnnouncement] = useState('');
  const filtered = tasks.filter(task => (project === 'all' || task.project === project) && `${task.title} ${task.id}`.toLowerCase().includes(query.toLowerCase()));
  const selected = filtered.find(task => task.id === selectedId) || filtered[0];
  const completed = selected?.checks.filter(Boolean).length || 0;
  return <div className="sidebar-demo-frame sidebar-workspace-shell"><header className="sidebar-workspace-topbar"><BrandMark /><div><h3>Sample workspace</h3><p>Tasks, checklists, and agent run history.</p></div></header><div className="sidebar-workspace-layout"><Sidebar variant="flush" width={280} aria-label="Workspace tasks" contentLabel="Main tasks" header={<div className="sidebar-workspace-controls"><Button icon={Plus} onClick={() => { const task: DemoTask = { id: `TASK-${tasks.length + 1}`, title: `New task ${tasks.length + 1}`, project: project === 'all' ? 'component-library' : project, checks: [false, false, false] }; setTasks(previous => [task, ...previous]); setSelectedId(task.id); setQuery(''); setAnnouncement('Task added to the local example.'); }}>New main task</Button><Select label="Workspace project" value={project} onChange={event => setProject(event.target.value)}><option value="all">All projects</option><option value="sample-app">sample-app</option><option value="component-library">component-library</option><option value="frontend-client">frontend-client</option></Select><Button variant="ghost" className="sidebar-all-tasks" icon={LayoutDashboard} onClick={() => { setProject('all'); setQuery(''); }}>All tasks<Badge>{tasks.length}</Badge></Button><div className="sidebar-task-search"><div className="sidebar-demo-panel-title"><h3>Main tasks</h3><span>{filtered.length}</span></div><SearchField label="Find a task" value={query} onChange={setQuery} /></div></div>} footer={<div className="sidebar-workspace-footer"><Sparkles size={17} aria-hidden="true" /><span>Select a task to inspect it.<br />Update checks to track completion.</span></div>}>
    {filtered.length ? <div className="sidebar-task-list" role="group" aria-label="Select a main task">{filtered.map(task => { const done = task.checks.filter(Boolean).length; const complete = done === task.checks.length; return <button type="button" key={task.id} className="sidebar-task-choice" aria-pressed={selected?.id === task.id} onClick={() => setSelectedId(task.id)}><span className="sidebar-task-meta"><code>{task.id}</code><span className="sidebar-task-state"><span className="cr-status-dot" aria-hidden="true" />{complete ? 'Complete' : 'Active'}</span></span><strong>{task.title}</strong><span className="sidebar-task-meta"><span>{task.project}</span><span>{done}/{task.checks.length}</span></span><Progress value={done} max={task.checks.length} label={`${task.id}: ${done} of ${task.checks.length} complete`} /></button>; })}</div> : <EmptyState icon={Search} title="No matching tasks" description="Try another project or task name." action={<Button size="sm" variant="secondary" onClick={() => { setProject('all'); setQuery(''); }}>Show all tasks</Button>} />}
    </Sidebar><section className="sidebar-workspace-inspector" aria-label="Selected task">{selected ? <><div className="sidebar-demo-inspector-title"><span><FolderOpen size={15} aria-hidden="true" />{selected.project}</span><Badge>Local example</Badge></div><h3>{selected.title}</h3><Badge tone={completed === selected.checks.length ? 'success' : 'info'} dot>{completed === selected.checks.length ? 'Complete' : 'In progress'}</Badge><p>Select a task and toggle checklist items. The progress value is the number of completed checks.</p><div className="sidebar-demo-checklist">{selected.checks.map((checked, index) => <Checkbox key={index} label={['Inspect task requirements', 'Define acceptance criteria', 'Implement the change', 'Review test results', 'Record review decisions'][index]} checked={checked} onChange={event => setTasks(previous => previous.map(task => task.id === selected.id ? { ...task, checks: task.checks.map((value, i) => i === index ? event.target.checked : value) } : task))} />)}</div><Progress value={completed} max={selected.checks.length} label={`${completed} of ${selected.checks.length} task checks complete`} /><p className="sidebar-demo-progress-label"><Check size={14} aria-hidden="true" />{completed} of {selected.checks.length} complete</p></> : <p className="muted">No tasks match the current filters.</p>}<p className="cr-sr-only" role="status">{announcement}</p></section></div></div>;
}

export function SidebarDemo() {
  const searchBoxCode = [
    'function SearchBox({ label, value, onChange }: {',
    '  label: string; value: string; onChange: (value: string) => void;',
    '}) {',
    '  const id = useId();',
    '  return <div style={{ minWidth: 0 }}>',
    '    <label htmlFor={id} className="cr-sr-only">{label}</label>',
    '    <div className="cr-input-wrap">',
    '      <Search size={16} aria-hidden="true" />',
    '      <input id={id} className="cr-input" type="search"',
    '        name={label === "Search loaded runs" ? "runSearch" : "taskSearch"}',
    '        placeholder={label === "Search loaded runs" ? "Search loaded runs…" : "Find a task…"}',
    '        value={value} onChange={event => onChange(event.target.value)}',
    '        autoComplete="off" spellCheck={false} />',
    '    </div>',
    '  </div>;',
    '}',
  ].join('\n');
  const floatingCode = [
    'import { useId, useState } from "react";',
    'import { Clock3, Plus, Search, Sparkles } from "lucide-react";',
    'import { Badge, Button, EmptyState, Sidebar } from "@chartreuse/ui";',
    'import type { Tone } from "@chartreuse/ui";',
    'import "@chartreuse/ui/styles.css";',
    '',
    'interface Run {',
    '  id: string; title: string; provider: string;',
    '  status: "Succeeded" | "Running" | "Waiting" | "Failed";',
    '  time: string; tokens: number;',
    '}',
    'const initialRuns: Run[] = ' + JSON.stringify(firstRuns, null, 2) + ';',
    'const runTone = (status: Run["status"]): Tone => status === "Succeeded"',
    '  ? "success" : status === "Running" ? "info" : status === "Waiting" ? "warning" : "danger";',
    '',
    searchBoxCode,
    '',
    'function RunHistorySidebar() {',
    '  const [runs, setRuns] = useState(initialRuns);',
    '  const [query, setQuery] = useState("");',
    '  const [selectedId, setSelectedId] = useState(initialRuns[0].id);',
    '  const filtered = runs.filter(run =>',
    '    [run.title, run.id, run.provider, run.status].join(" ").toLowerCase()',
    '      .includes(query.toLowerCase()));',
    '  const selected = filtered.find(run => run.id === selectedId) || filtered[0];',
    '  return <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 24 }}>',
    '    <div style={{ height: 620, flex: "0 1 280px", maxWidth: "100%", minWidth: 0 }}>',
    '      <Sidebar variant="floating" width={280} aria-label="Run history"',
    '        contentLabel="Recorded runs" header={<div style={{ display: "grid", gap: 14 }}>',
    '          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>',
    '            <h3>Run history</h3><Badge>{filtered.length}</Badge>',
    '          </div>',
    '          <SearchBox label="Search loaded runs" value={query} onChange={setQuery} />',
    '        </div>} footer={<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>',
    '          <span>{runs.length} recorded runs</span>',
    '          <Button size="sm" variant="ghost" icon={Plus}',
    '            onClick={() => setRuns(previous => [...previous,',
    '              ...initialRuns.slice(0, 3).map((run, index) => ({ ...run,',
    '                id: "run-" + (1000 - previous.length - index),',
    '                time: "Earlier in this example",',
    '              })),',
    '            ])}>Load more</Button>',
    '        </div>}>',
    '        {filtered.length ? <ul style={{ margin: 0, padding: 0, listStyle: "none" }} role="list">',
    '          {filtered.map(run => <li key={run.id}>',
    '            <button type="button" aria-pressed={selected?.id === run.id}',
    '              onClick={() => setSelectedId(run.id)} style={{ display: "grid", gap: 12,',
    '                width: "100%", padding: 16, textAlign: "start", font: "inherit",',
    '                border: 0, borderInlineStart: "3px solid " +',
    '                  (selected?.id === run.id ? "var(--cr-color-success)" : "transparent"),',
    '                color: "var(--cr-color-text)", background: selected?.id === run.id',
    '                  ? "var(--cr-color-success-bg)" : "transparent" }}>',
    '              <span style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>',
    '                <strong>Coordinator</strong><Badge tone={runTone(run.status)} dot>{run.status}</Badge>',
    '              </span>',
    '              <span>{run.title}</span><strong>{run.provider}</strong>',
    '              <span><Clock3 size={13} aria-hidden="true" /> {run.time}</span>',
    '            </button>',
    '          </li>)}',
    '        </ul> : <EmptyState icon={Search} title="No matching runs"',
    '          description="Search by task title, run ID, provider, or status."',
    '          action={<Button variant="secondary" size="sm" onClick={() => setQuery("")}>',
    '            Clear search',
    '          </Button>} />}',
    '      </Sidebar>',
    '    </div>',
    '    <section aria-label="Selected run" style={{ flex: "1 1 280px", minWidth: 0, padding: 24 }}>',
    '      {selected ? <>',
    '        <p>Selected run <Badge>Local example</Badge></p>',
    '        <h3>Coordinator</h3><Badge tone={runTone(selected.status)} dot>{selected.status}</Badge>',
    '        <p>{selected.title}</p>',
    '        <dl>',
    '          <dt>Run</dt><dd><code>{selected.id}</code></dd>',
    '          <dt>Provider</dt><dd>{selected.provider}</dd>',
    '          <dt>Recorded</dt><dd>{selected.time}</dd>',
    '          <dt>Tokens</dt><dd>{selected.tokens.toLocaleString()}</dd>',
    '        </dl>',
    '        <p><Sparkles size={19} aria-hidden="true" /> Select a run to view its ID, provider, timestamp, and token count. This example owns filtering and selection state.</p>',
    '      </> : <p>Change or clear the search to select a run.</p>}',
    '    </section>',
    '  </div>;',
    '}',
  ].join('\n');
  const flushCode = [
    'import { useId, useState } from "react";',
    'import { Check, FolderOpen, LayoutDashboard, Plus, Search, Sparkles } from "lucide-react";',
    'import { Badge, BrandMark, Button, Checkbox, EmptyState, Progress, Select, Sidebar } from "@chartreuse/ui";',
    'import "@chartreuse/ui/styles.css";',
    '',
    'interface Task { id: string; title: string; project: string; checks: boolean[] }',
    'const initialTasks: Task[] = ' + JSON.stringify(firstTasks, null, 2) + ';',
    'const checkLabels = ["Inspect task requirements", "Define acceptance criteria",',
    '  "Implement the change", "Review test results", "Record review decisions"];',
    '',
    searchBoxCode,
    '',
    'function WorkspaceSidebar() {',
    '  const [tasks, setTasks] = useState(initialTasks);',
    '  const [project, setProject] = useState("all");',
    '  const [query, setQuery] = useState("");',
    '  const [selectedId, setSelectedId] = useState(initialTasks[1].id);',
    '  const [announcement, setAnnouncement] = useState("");',
    '  const filtered = tasks.filter(task => (project === "all" || task.project === project)',
    '    && (task.title + " " + task.id).toLowerCase().includes(query.toLowerCase()));',
    '  const selected = filtered.find(task => task.id === selectedId) || filtered[0];',
    '  const completed = selected?.checks.filter(Boolean).length || 0;',
    '  const showAll = () => { setProject("all"); setQuery(""); };',
    '  const createTask = () => {',
    '    const task: Task = { id: "TASK-" + (tasks.length + 1),',
    '      title: "New task " + (tasks.length + 1),',
    '      project: project === "all" ? "component-library" : project,',
    '      checks: [false, false, false] };',
    '    setTasks(previous => [task, ...previous]); setSelectedId(task.id); setQuery("");',
    '    setAnnouncement("Task added to the local example.");',
    '  };',
    '  return <div>',
    '    <header style={{ display: "flex", alignItems: "center", gap: 12, padding: 24,',
    '      color: "var(--cr-paper)", background: "var(--cr-evergreen)" }}>',
    '      <BrandMark /><div><h3>Sample workspace</h3>',
    '        <p>Tasks, checklists, and agent run history.</p></div>',
    '    </header>',
    '    <div style={{ display: "flex", flexWrap: "wrap" }}>',
    '      <div style={{ height: 680, flex: "0 1 280px", maxWidth: "100%", minWidth: 0 }}>',
    '        <Sidebar variant="flush" width={280} aria-label="Workspace tasks"',
    '          contentLabel="Main tasks" header={<div style={{ display: "grid", gap: 20 }}>',
    '            <Button icon={Plus} onClick={createTask}>New main task</Button>',
    '            <Select label="Workspace project" value={project}',
    '              onChange={event => setProject(event.target.value)}>',
    '              <option value="all">All projects</option>',
    '              <option value="sample-app">sample-app</option>',
    '              <option value="component-library">component-library</option>',
    '              <option value="frontend-client">frontend-client</option>',
    '            </Select>',
    '            <Button variant="ghost" icon={LayoutDashboard} onClick={showAll}>',
    '              All tasks <Badge>{tasks.length}</Badge>',
    '            </Button>',
    '            <div style={{ display: "grid", gap: 12 }}>',
    '              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>',
    '                <h3>Main tasks</h3><span>{filtered.length}</span>',
    '              </div>',
    '              <SearchBox label="Find a task" value={query} onChange={setQuery} />',
    '            </div>',
    '          </div>} footer={<p><Sparkles size={17} aria-hidden="true" />',
    '            Select a task to inspect it.<br />Update checks to track completion.',
    '          </p>}>',
    '          {filtered.length ? <div role="group" aria-label="Select a main task"',
    '            style={{ display: "grid", gap: 10, padding: 12 }}>',
    '            {filtered.map(task => {',
    '              const done = task.checks.filter(Boolean).length;',
    '              const active = selected?.id === task.id;',
    '              return <button key={task.id} type="button" aria-pressed={active}',
    '                onClick={() => setSelectedId(task.id)} style={{ display: "grid", gap: 12,',
    '                  minWidth: 0, width: "100%", padding: 14, borderRadius: 7,',
    '                  textAlign: "start", font: "inherit",',
    '                  border: "1px solid " + (active ? "var(--cr-color-primary)" : "transparent"),',
    '                  background: active ? "var(--cr-color-primary)" : "transparent",',
    '                  color: active ? "var(--cr-color-on-primary)" : "var(--cr-color-text)" }}>',
    '                <span style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>',
    '                  <code>{task.id}</code><span>{done === task.checks.length ? "Complete" : "Active"}</span>',
    '                </span>',
    '                <strong>{task.title}</strong>',
    '                <span style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>',
    '                  <span>{task.project}</span><span>{done}/{task.checks.length}</span>',
    '                </span>',
    '                <Progress value={done} max={task.checks.length}',
    '                  label={task.id + ": " + done + " of " + task.checks.length + " complete"} />',
    '              </button>;',
    '            })}',
    '          </div> : <EmptyState icon={Search} title="No matching tasks"',
    '            description="Try another project or task name."',
    '            action={<Button size="sm" variant="secondary" onClick={showAll}>Show all tasks</Button>} />}',
    '        </Sidebar>',
    '      </div>',
    '      <section aria-label="Selected task" style={{ flex: "1 1 280px", minWidth: 0, padding: 28 }}>',
    '        {selected ? <>',
    '          <p><FolderOpen size={15} aria-hidden="true" /> {selected.project} <Badge>Local example</Badge></p>',
    '          <h3>{selected.title}</h3>',
    '          <Badge tone={completed === selected.checks.length ? "success" : "info"} dot>',
    '            {completed === selected.checks.length ? "Complete" : "In progress"}',
    '          </Badge>',
    '          <p>Select a task and toggle checklist items. The progress value is',
    '            the number of completed checks.</p>',
    '          <div style={{ display: "grid", gap: 14, marginBlock: 26 }}>',
    '            {selected.checks.map((checked, index) => <Checkbox key={index}',
    '              label={checkLabels[index]} checked={checked} onChange={event => {',
    '                const next = event.currentTarget.checked;',
    '                setTasks(previous => previous.map(task => task.id === selected.id',
    '                  ? { ...task, checks: task.checks.map((value, i) => i === index ? next : value) }',
    '                  : task));',
    '              }} />)}',
    '          </div>',
    '          <Progress value={completed} max={selected.checks.length}',
    '            label={completed + " of " + selected.checks.length + " task checks complete"} />',
    '          <p><Check size={14} aria-hidden="true" /> {completed} of {selected.checks.length} complete</p>',
    '        </> : <p>No tasks match the current filters.</p>}',
    '        <p className="cr-sr-only" role="status">{announcement}</p>',
    '      </section>',
    '    </div>',
    '  </div>;',
    '}',
  ].join('\n');
  return <div className="sidebar-demo"><p className="sidebar-demo-intro">Sidebar renders an aside with header, scrollable body, and footer slots. The header and footer remain visible while the body scrolls.</p><ExampleGallery><Showcase title="Floating run history" description="Filter local run records and select a run to inspect its metadata." code={floatingCode}><RunHistoryExample /></Showcase><Showcase title="Flush task navigation" description="Filter tasks by project and title, create a task in local state, and toggle its checklist items." code={flushCode}><WorkspaceNavigationExample /></Showcase></ExampleGallery></div>;
}
