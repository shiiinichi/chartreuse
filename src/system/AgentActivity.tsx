import { useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Check, ChevronRight, CircleAlert, Clock3, FilePenLine, Globe, LoaderCircle, MessageSquare, Network, Terminal, Wrench } from 'lucide-react';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import './agent-activity.css';

export type AgentActivityKind = 'agent' | 'command' | 'tool' | 'file' | 'search' | 'message';
export type AgentActivityStatus = 'queued' | 'running' | 'completed' | 'failed' | 'interrupted' | 'info';

export interface AgentActivityEvent {
  /** Stable within a run; keep the same ID when streamed output or status changes. */
  id: string;
  title: string;
  kind?: AgentActivityKind;
  status?: AgentActivityStatus;
  description?: string;
  command?: string;
  input?: string;
  /** Undefined means unrecorded; an empty string means recorded with no output. */
  output?: string;
  outputTruncated?: boolean;
  durationMs?: number;
  exitCode?: number;
  icon?: IconSource;
  /** Initial state of this event's details, independent of the group. */
  defaultOpen?: boolean;
}

type AgentActivityBase = Omit<ComponentPropsWithRef<'details'>, 'children' | 'title' | 'open' | 'onToggle' | 'name'> & {
  events: readonly AgentActivityEvent[];
  /** Custom group label; defaults to Working, Waiting, Worked, or Activity. */
  label?: string;
  /** Use 'hover' to highlight the group header on hover. Defaults to 'none'. */
  headerHighlight?: 'none' | 'hover';
  /** Recent rows shown on mount. Newly arriving rows are not moved while reading. */
  initialVisibleCount?: number;
  /** Enable for the active log only when its host does not announce progress. */
  announce?: boolean;
  emptyMessage?: string;
};

export type AgentActivityProps = AgentActivityBase & (
  | { open: boolean; onOpenChange: (open: boolean) => void; defaultOpen?: never }
  | { open?: undefined; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }
);

const kindIcons: Record<AgentActivityKind, IconSource> = {
  agent: Network, command: Terminal, tool: Wrench, file: FilePenLine, search: Globe, message: MessageSquare,
};
const statusLabels: Record<AgentActivityStatus, string> = {
  queued: 'Queued', running: 'Running', completed: 'Completed', failed: 'Failed', interrupted: 'Interrupted', info: 'Update',
};

function statusOf(event: AgentActivityEvent): AgentActivityStatus {
  return typeof event.exitCode === 'number' && event.exitCode !== 0 ? 'failed' : event.status ?? 'info';
}

function durationText(milliseconds: number | undefined) {
  if (milliseconds === undefined || !Number.isFinite(milliseconds) || milliseconds < 0) return null;
  if (milliseconds < 1000) return `${Math.round(milliseconds)} ms`;
  if (milliseconds < 60000) return `${Number((milliseconds / 1000).toFixed(1))} s`;
  return `${Math.floor(milliseconds / 60000)} m ${Math.floor(milliseconds % 60000 / 1000)} s`;
}

function plainText(value: string) {
  // OSC payloads end at the first BEL or ST, so linked text between two
  // OSC 8 sequences remains visible instead of being consumed as metadata.
  return value.replace(/\u001b\][\s\S]*?(?:\u0007|\u001b\\)|\u001b\[[0-?]*[ -/]*[@-~]/g, '').replace(/\r(?!\n)/g, '\n');
}

function ActivityState({ status }: { status: AgentActivityStatus }) {
  const Icon = status === 'running' ? LoaderCircle : status === 'queued' ? Clock3 : status === 'failed' || status === 'interrupted' ? CircleAlert : status === 'completed' ? Check : null;
  return <span className="cr-agent-activity-state" data-status={status}>{Icon && <Icon size={13} aria-hidden="true" className={status === 'running' ? 'cr-agent-activity-spin' : undefined} />}<span>{statusLabels[status]}</span></span>;
}

function ActivityRow({ event }: { event: AgentActivityEvent }) {
  const [open, setOpen] = useState(event.defaultOpen ?? false);
  const kind = event.kind ?? 'tool';
  const status = statusOf(event);
  const duration = durationText(event.durationMs);
  const output = plainText(event.output ?? '');
  const hasOutput = output.trim() !== '';
  const detailText = event.description?.trim() || (hasOutput ? '' : event.title.trim());
  const hasLogFields = event.command !== undefined || event.input !== undefined || hasOutput;
  const expandable = Boolean(detailText) || hasLogFields || event.outputTruncated || event.exitCode !== undefined;
  const waitingForOutput = event.output === undefined && (kind === 'command' || kind === 'tool') && (status === 'running' || status === 'queued');
  const content = <>
    <span className="cr-agent-activity-kind">{renderIcon(event.icon ?? kindIcons[kind], { size: 16 })}</span>
    <span className="cr-agent-activity-title">{event.title}</span>
    <span className="cr-agent-activity-row-meta">{duration && <span className="cr-agent-activity-duration">{duration}</span>}<ActivityState status={status} /></span>
    {expandable && <ChevronRight className="cr-agent-activity-chevron" size={13} aria-hidden="true" />}
  </>;
  return <li className="cr-agent-activity-item" data-status={status}>
    {expandable ? <details className="cr-agent-activity-event" open={open} onToggle={event => {
      if (event.target === event.currentTarget) setOpen(event.currentTarget.open);
    }}><summary className="cr-agent-activity-row">{content}</summary><div className="cr-agent-activity-detail">
      {detailText && <p className="cr-agent-activity-description">{detailText}</p>}
      {hasLogFields && <dl>
        {event.command !== undefined && <><dt>Command</dt><dd><pre tabIndex={0} role="region" aria-label={`${event.title} command`}><code>{plainText(event.command)}</code></pre></dd></>}
        {event.input !== undefined && <><dt>Input</dt><dd><pre tabIndex={0} role="region" aria-label={`${event.title} input`}><code>{plainText(event.input)}</code></pre></dd></>}
        {hasOutput && <><dt>Output</dt><dd><pre tabIndex={0} role="region" aria-label={`${event.title} output`}><code>{output}</code></pre></dd></>}
      </dl>}
      {waitingForOutput && <p className="cr-agent-activity-note">Waiting for output…</p>}
      {event.outputTruncated && <p className="cr-agent-activity-note">Some output was omitted from the recorded preview.</p>}
      {event.exitCode !== undefined && <p className="cr-agent-activity-exit">Exit code <code>{event.exitCode}</code></p>}
    </div></details> : <div className="cr-agent-activity-row">{content}</div>}
  </li>;
}

/** A chronological group of user-visible agent/tool events with on-demand details. */
export function AgentActivity({ events, label, headerHighlight = 'none', initialVisibleCount = 6, announce = false, emptyMessage = 'No activity recorded.', open, defaultOpen = true, onOpenChange, className, ...props }: AgentActivityProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [historyBoundary] = useState(() => {
    const limit = Number.isFinite(initialVisibleCount) ? Math.max(1, Math.floor(initialVisibleCount)) : 6;
    return Math.max(0, events.length - limit);
  });
  const expanded = open ?? internalOpen;
  const split = Math.min(historyBoundary, events.length);
  const earlier = events.slice(0, split);
  const recent = events.slice(split);
  const statuses = events.map(statusOf);
  const running = statuses.filter(status => status === 'running').length;
  const queued = statuses.filter(status => status === 'queued').length;
  const failed = statuses.filter(status => status === 'failed').length;
  const interrupted = statuses.filter(status => status === 'interrupted').length;
  const heading = label ?? (running ? 'Working' : queued ? 'Waiting' : events.length ? 'Worked' : 'Activity');
  const counts = [`${events.length} ${events.length === 1 ? 'activity' : 'activities'}`, running && `${running} running`, queued && `${queued} queued`, failed && `${failed} failed`, interrupted && `${interrupted} interrupted`].filter(Boolean).join(' · ');
  return <>
    <details {...props} className={['cr-agent-activity', className].filter(Boolean).join(' ')} open={expanded} data-header-highlight={headerHighlight} onToggle={event => {
      if (event.target !== event.currentTarget) return;
      const next = event.currentTarget.open;
      if (open !== undefined) {
        if (next !== open) { event.currentTarget.open = open; onOpenChange?.(next); }
      } else if (next !== internalOpen) { setInternalOpen(next); onOpenChange?.(next); }
    }}>
      <summary className="cr-agent-activity-summary" onClick={event => {
        if (open === undefined) return;
        event.preventDefault(); onOpenChange?.(!open);
      }}>
        <span className="cr-agent-activity-heading">{heading}</span>
        <span className="cr-agent-activity-count">
          {events.length} {events.length === 1 ? 'activity' : 'activities'}
          <ChevronRight className="cr-agent-activity-group-chevron" size={15} aria-hidden="true" />
        </span>
        <span className="cr-agent-activity-group-status">
          {running > 0 && <span data-status="running">{running} running</span>}
          {queued > 0 && <span data-status="queued">{queued} queued</span>}
          {failed > 0 && <span data-status="failed">{failed} failed</span>}
          {interrupted > 0 && <span data-status="interrupted">{interrupted} interrupted</span>}
        </span>
      </summary>
      <div className="cr-agent-activity-content">
        {events.length === 0 && <p className="cr-agent-activity-empty">{emptyMessage}</p>}
        {earlier.length > 0 && <details className="cr-agent-activity-earlier"><summary><ChevronRight size={13} aria-hidden="true" /><span>{earlier.length} earlier {earlier.length === 1 ? 'activity' : 'activities'}</span>{earlier.some(event => ['failed', 'interrupted'].includes(statusOf(event))) && <span className="cr-agent-activity-earlier-issue">Includes issues</span>}</summary><ol className="cr-agent-activity-list" role="list">{earlier.map(event => <ActivityRow event={event} key={event.id} />)}</ol></details>}
        {recent.length > 0 && <ol className="cr-agent-activity-list" role="list" start={split + 1}>{recent.map(event => <ActivityRow event={event} key={event.id} />)}</ol>}
      </div>
    </details>
    {announce && <span className="cr-agent-activity-announcement" role="status" aria-atomic="true">{heading}. {counts}.</span>}
  </>;
}
