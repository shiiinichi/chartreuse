import { useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, MouseEvent } from 'react';
import { Check, ChevronRight, ChevronUp, CircleAlert, Clock3, FilePenLine, Globe, LoaderCircle, MessageSquare, Network, Terminal, Wrench } from 'lucide-react';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import { Text } from './Text';
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

type AgentActivityBase = {
  events: readonly AgentActivityEvent[];
  /** Use 'single' to keep each event row on one line at every width: the title ends in an ellipsis and the duration, status and chevron stay beside it. Defaults to 'multiple', which stacks the status under the title in containers 440px or narrower. */
  titleLines?: 'single' | 'multiple';
  /** Custom group heading. Also names the list group for assistive technology. */
  label?: string;
  /** Use 'hover' to highlight the default variant's header. Defaults to 'none'. */
  headerHighlight?: 'none' | 'hover';
  /** Recent rows shown on mount in the default variant. Newly arriving rows stay in place. */
  initialVisibleCount?: number;
  /** Enable for the active log only when its host does not announce progress. */
  announce?: boolean;
  emptyMessage?: string;
};

type AgentActivityRootProps =
  | (Omit<ComponentPropsWithRef<'details'>, 'children' | 'title' | 'open' | 'onToggle' | 'name'> & { variant?: 'default' })
  | (Omit<ComponentPropsWithRef<'div'>, 'children' | 'title' | 'onToggle'> & { variant: 'list' });

export type AgentActivityProps = AgentActivityBase & AgentActivityRootProps & (
  | { open: boolean; onOpenChange: (open: boolean) => void; defaultOpen?: never }
  | { open?: undefined; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }
);

const kindIcons: Record<AgentActivityKind, IconSource> = {
  agent: Network, command: Terminal, tool: Wrench, file: FilePenLine, search: Globe, message: MessageSquare,
};
const statusLabels: Record<AgentActivityStatus, string> = {
  queued: 'Queued', running: 'Running', completed: 'Completed', failed: 'Failed', interrupted: 'Interrupted', info: 'Update',
};
const defaultVisibleCount = 6;

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

function ActivityRow({ event, singleLineTitle }: { event: AgentActivityEvent; singleLineTitle: boolean }) {
  const [open, setOpen] = useState(event.defaultOpen ?? false);
  const kind = event.kind ?? 'tool';
  const status = statusOf(event);
  const duration = durationText(event.durationMs);
  const output = plainText(event.output ?? '');
  const hasOutput = output.trim() !== '';
  const fullTitle = event.title.trim();
  const detailText = event.description?.trim() || (hasOutput ? '' : fullTitle);
  const hasLogFields = event.command !== undefined || event.input !== undefined || hasOutput;
  const expandable = Boolean(detailText) || hasLogFields || event.outputTruncated || event.exitCode !== undefined;
  const waitingForOutput = event.output === undefined && (kind === 'command' || kind === 'tool') && (status === 'running' || status === 'queued');
  const content = <>
    <span className="cr-agent-activity-kind">{renderIcon(event.icon ?? kindIcons[kind], { size: 16 })}</span>
    <span className="cr-agent-activity-title" data-single-line={singleLineTitle || undefined}>{event.title}</span>
    <span className="cr-agent-activity-row-meta">{duration && <span className="cr-agent-activity-duration">{duration}</span>}<ActivityState status={status} /></span>
    {expandable && <ChevronRight className="cr-agent-activity-chevron" size={13} aria-hidden="true" />}
  </>;
  return <li className="cr-agent-activity-item" data-status={status}>
    {expandable ? <details className="cr-agent-activity-event" open={open} onToggle={event => {
      if (event.target === event.currentTarget) setOpen(event.currentTarget.open);
    }}><summary className="cr-agent-activity-row" data-single-line={singleLineTitle || undefined}>{content}</summary><div className="cr-agent-activity-detail">
      {singleLineTitle && fullTitle && fullTitle !== detailText && <Text size="body" className="cr-agent-activity-detail-title">{fullTitle}</Text>}
      {detailText && <Text size="body" className="cr-agent-activity-description">{detailText}</Text>}
      {hasLogFields && <dl>
        {event.command !== undefined && <><dt>Command</dt><dd><pre tabIndex={0} role="region" aria-label={`${event.title} command`}><code>{plainText(event.command)}</code></pre></dd></>}
        {event.input !== undefined && <><dt>Input</dt><dd><pre tabIndex={0} role="region" aria-label={`${event.title} input`}><code>{plainText(event.input)}</code></pre></dd></>}
        {hasOutput && <><dt>Output</dt><dd><pre tabIndex={0} role="region" aria-label={`${event.title} output`}><code>{output}</code></pre></dd></>}
      </dl>}
      {waitingForOutput && <Text size="body" className="cr-agent-activity-note">Waiting for output…</Text>}
      {event.outputTruncated && <Text size="body" className="cr-agent-activity-note">Some output was omitted from the recorded preview.</Text>}
      {event.exitCode !== undefined && <Text size="body" className="cr-agent-activity-exit">Exit code <code>{event.exitCode}</code></Text>}
    </div></details> : <div className="cr-agent-activity-row" data-single-line={singleLineTitle || undefined}>{content}</div>}
  </li>;
}

function ActivityList({ events, singleLineTitle, start }: { events: readonly AgentActivityEvent[]; singleLineTitle: boolean; start?: number }) {
  return <ol className="cr-agent-activity-list" role="list" start={start}>
    {events.map(event => <ActivityRow event={event} singleLineTitle={singleLineTitle} key={event.id} />)}
  </ol>;
}

/** A chronological group of user-visible agent/tool events with on-demand details. */
export function AgentActivity({
  events,
  titleLines = 'multiple',
  label,
  headerHighlight = 'none',
  initialVisibleCount = defaultVisibleCount,
  announce = false,
  emptyMessage = 'No activity recorded.',
  open,
  defaultOpen = true,
  onOpenChange,
  className,
  ...props
}: AgentActivityProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [listOpen, setListOpen] = useState(true);
  const listHeadingButton = useRef<HTMLButtonElement>(null);
  const listDisclosure = useRef<HTMLDetailsElement>(null);
  const listContentId = useId();
  const [historyBoundary] = useState(() => {
    const limit = Number.isFinite(initialVisibleCount) ? Math.max(1, Math.floor(initialVisibleCount)) : defaultVisibleCount;
    return Math.max(0, events.length - limit);
  });
  const statusCounts: Record<AgentActivityStatus, number> = { queued: 0, running: 0, completed: 0, failed: 0, interrupted: 0, info: 0 };
  for (const event of events) {
    statusCounts[statusOf(event)] += 1;
  }
  const { running, queued, failed, interrupted } = statusCounts;
  const heading = label ?? (running ? 'Working' : queued ? 'Waiting' : events.length ? 'Worked' : 'Activity');
  const activityCount = `${events.length} ${events.length === 1 ? 'activity' : 'activities'}`;
  const counts = [activityCount, running && `${running} running`, queued && `${queued} queued`, failed && `${failed} failed`, interrupted && `${interrupted} interrupted`].filter(Boolean).join(' · ');
  const announcement = announce && <span className="cr-agent-activity-announcement" role="status" aria-atomic="true">{heading}. {counts}.</span>;
  const rootClassName = ['cr-agent-activity', className].filter(Boolean).join(' ');
  const empty = <Text size="body" className="cr-agent-activity-empty">{emptyMessage}</Text>;
  const singleLineTitle = titleLines === 'single';
  const canCollapseList = events.length > defaultVisibleCount;
  const groupHeader = <>
    <span className="cr-agent-activity-heading">{heading}</span>
    <span className="cr-agent-activity-count">
      {activityCount}
      {(props.variant !== 'list' || canCollapseList) && <ChevronRight className="cr-agent-activity-group-chevron" size={15} aria-hidden="true" />}
    </span>
    <span className="cr-agent-activity-group-status">
      {running > 0 && <span data-status="running">{running} running</span>}
      {queued > 0 && <span data-status="queued">{queued} queued</span>}
      {failed > 0 && <span data-status="failed">{failed} failed</span>}
      {interrupted > 0 && <span data-status="interrupted">{interrupted} interrupted</span>}
    </span>
  </>;

  if (props.variant === 'list') {
    const { variant, ...listProps } = props;
    const listHeadingId = `${listContentId}-header`;
    const headingLink = `#${listHeadingId}`;
    const moveToListHeading = (event: MouseEvent<HTMLAnchorElement>, collapse = false) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const headingButton = listHeadingButton.current;
      if (!headingButton) return;

      event.preventDefault();
      if (collapse && listDisclosure.current) listDisclosure.current.open = false;
      headingButton.focus({ preventScroll: true });
      headingButton.scrollIntoView({ behavior: 'instant', block: collapse ? 'nearest' : 'start', inline: 'nearest' });
    };

    return <>
      <div role="group" aria-label={label ?? 'Agent activity'} {...listProps} className={rootClassName} data-variant={variant}>
        {events.length > 0 ? <>
          {canCollapseList ? <button
            ref={listHeadingButton}
            id={listHeadingId}
            type="button"
            className="cr-agent-activity-summary"
            aria-expanded={listOpen}
            aria-controls={listContentId}
            onClick={() => {
              const disclosure = listDisclosure.current;
              if (disclosure) disclosure.open = !disclosure.open;
            }}
          >{groupHeader}</button> : <div className="cr-agent-activity-summary">{groupHeader}</div>}
          <details ref={listDisclosure} className="cr-agent-activity-list-disclosure" open={!canCollapseList || listOpen} onToggle={event => {
            if (canCollapseList && event.target === event.currentTarget) setListOpen(event.currentTarget.open);
          }}>
            <summary hidden />
            <div className="cr-agent-activity-content" id={canCollapseList ? listContentId : undefined}>
              <ActivityList events={events} singleLineTitle={singleLineTitle} />
            </div>
            {canCollapseList && <div className="cr-agent-activity-list-footer">
              <a href={headingLink} onClick={event => moveToListHeading(event, true)}>
                <ChevronUp size={16} aria-hidden="true" />
                Collapse activity
              </a>
              <span aria-hidden="true">•</span>
              <a href={headingLink} onClick={moveToListHeading}>Scroll to header</a>
            </div>}
          </details>
        </> : empty}
      </div>
      {announcement}
    </>;
  }

  const { variant = 'default', ...detailsProps } = props;
  const expanded = open ?? internalOpen;
  const split = Math.min(historyBoundary, events.length);
  const earlier = events.slice(0, split);
  const recent = events.slice(split);
  return <>
    <details {...detailsProps} className={rootClassName} open={expanded} data-variant={variant} data-header-highlight={headerHighlight} onToggle={event => {
      if (event.target !== event.currentTarget) return;
      const next = event.currentTarget.open;
      if (open !== undefined) {
        if (next !== open) { event.currentTarget.open = open; onOpenChange?.(next); }
      } else if (next !== internalOpen) { setInternalOpen(next); onOpenChange?.(next); }
    }}>
      <summary className="cr-agent-activity-summary" onClick={event => {
        if (open === undefined) return;
        event.preventDefault(); onOpenChange?.(!open);
      }}>{groupHeader}</summary>
      <div className="cr-agent-activity-content">
        {events.length === 0 && empty}
        {earlier.length > 0 && <details className="cr-agent-activity-earlier">
          <summary>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{earlier.length} earlier {earlier.length === 1 ? 'activity' : 'activities'}</span>
            {earlier.some(event => ['failed', 'interrupted'].includes(statusOf(event))) && <span className="cr-agent-activity-earlier-issue">Includes issues</span>}
          </summary>
          <ActivityList events={earlier} singleLineTitle={singleLineTitle} />
        </details>}
        {recent.length > 0 && <ActivityList events={recent} singleLineTitle={singleLineTitle} start={split + 1} />}
      </div>
    </details>
    {announcement}
  </>;
}
