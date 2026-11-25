import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronUp, CornerDownRight } from 'lucide-react';
import { Badge, Button, Card } from './components';
import type { CardProps, Tone } from './components';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Text } from './Text';
import './comment-thread.css';

export interface CommentTime {
  /** Shown when the thread is 360px or wider, such as "Nov 25, 6:10 PM". */
  label: string;
  /** Shown when the thread is narrower, such as "6:10 PM". Defaults to label. */
  shortLabel?: string;
  /** Full date in the tooltip. Defaults to label. */
  title?: string;
  /** Machine-readable timestamp for the time element. */
  dateTime?: string;
}

export interface CommentAsk {
  /** Unique within the thread; set as data-comment-id. */
  id: string;
  /** DOM id, so links such as #7 can scroll to the ask. */
  anchorId?: string;
  /** Accessible name of the ask, such as "Your ask #7". */
  label: string;
  /** Bold lead-in. Defaults to 'You asked'. */
  intro?: ReactNode;
  /** Who was asked, such as "Claude Code · opus · Medium". Truncated, with the full text in its tooltip. */
  agent?: string;
  /** A short reference, such as "#7". */
  reference?: ReactNode;
  /** Shown after the reference when the thread is 360px or wider. */
  time?: CommentTime;
  /** A small Menu for the ask, such as Edit and Delete. */
  actions?: ReactNode;
  /** The ask's text, rendered as Markdown and clamped. */
  body: ReactNode;
  /** Lines shown before Show more. Defaults to 2. */
  maxLines?: number;
  expandLabel?: string;
  collapseLabel?: string;
}

export interface ThreadComment {
  /** Unique within the thread. */
  id: string;
  /** Sender name, shown as a Badge and used in the collapsed summary. */
  sender: string;
  /** Badge tone, such as 'success' for people and 'info' for agents. Defaults to 'neutral'. */
  senderTone?: Tone;
  /** Accessible name of the comment, such as "Comment #5". */
  label?: string;
  /** A short reference after the sender, such as "#5". */
  reference?: ReactNode;
  time?: CommentTime;
  /** Facts after the time, such as "edited" or a harness name. Strings are joined with " · ". */
  meta?: ReactNode | readonly string[];
  /** Controls at the end of the header row, such as a Menu. */
  actions?: ReactNode;
  /** Markdown or plain text, or your own content. With an ask and no body, only the ask and content show, for an agent that has not replied yet. */
  body?: ReactNode;
  /** How a string body renders. Defaults to 'markdown'. */
  format?: 'markdown' | 'text';
  /** Clamps a Markdown body to this many lines with a Show more toggle. */
  maxLines?: number;
  expandLabel?: string;
  collapseLabel?: string;
  /** Content after the body, such as an AgentActivity status or a retry button. */
  content?: ReactNode;
  /** The ask this reply answers, shown as a quiet line above it in the same item. */
  ask?: CommentAsk;
}

export interface CommentThreadProps extends Omit<CardProps, 'header' | 'children' | 'divided'> {
  comment: ThreadComment;
  replies?: readonly ThreadComment[];
  /** Replies shown before "Show N earlier replies". Defaults to 2. */
  visibleReplies?: number;
  /** A composer at the end of the thread, such as a MessageComposer with layout="inline". It stays at the end of the replies band, collapsed or not. */
  composer?: ReactNode;
  /** Controlled collapsed state of the replies. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible name of the replies region. Defaults to 'Replies'. */
  repliesLabel?: string;
  /** Text of the button that reveals hidden replies. */
  showEarlierLabel?: (hidden: number) => string;
  /** Text of the toggle while the replies show. Defaults to 'Collapse'. */
  collapseLabel?: string;
  /** Text of the same toggle while they are collapsed. Defaults to 'Expand'. */
  expandLabel?: string;
  /** Shown at the start of the replies bar while collapsed. Defaults to "3 replies · latest from Agent, 5:40 PM". */
  summary?: (count: number, latest: ThreadComment) => ReactNode;
}

const join = (meta: ThreadComment['meta']) => Array.isArray(meta) ? meta.filter(Boolean).join(' · ') : meta as ReactNode;
const plural = (count: number) => `${count} ${count === 1 ? 'reply' : 'replies'}`;

function defaultSummary(count: number, latest: ThreadComment) {
  const time = latest.time ? `, ${latest.time.shortLabel ?? latest.time.label}` : '';
  return <><span className="cr-comment-thread-summary-count">{plural(count)}</span><span className="cr-comment-thread-summary-latest">· latest from {latest.sender}{time}</span></>;
}

function CommentHeader({ comment }: { comment: ThreadComment }) {
  const meta = join(comment.meta);
  const hasMeta = meta !== undefined && meta !== null && meta !== false && meta !== '';
  const time = comment.time;
  return <header className="cr-comment-header">
    <Badge tone={comment.senderTone ?? 'neutral'} className="cr-comment-sender">{comment.sender}</Badge>
    {comment.reference !== undefined && comment.reference !== null && <span className="cr-comment-reference">{comment.reference}</span>}
    {(time || hasMeta) && <span className="cr-comment-meta">
      {time && <time dateTime={time.dateTime} title={time.title ?? time.label}>
        <span className="cr-comment-time-long">{time.label}</span>
        <span className="cr-comment-time-short">{time.shortLabel ?? time.label}</span>
      </time>}
      {time && hasMeta && ' · '}
      {hasMeta && meta}
    </span>}
    {comment.actions !== undefined && comment.actions !== null && <span className="cr-comment-actions">{comment.actions}</span>}
  </header>;
}

function CommentBody({ comment }: { comment: ThreadComment }) {
  const { body } = comment;
  if (body === undefined || body === null) return null;
  if (typeof body !== 'string') return <div className="cr-comment-body">{body}</div>;
  return <div className="cr-comment-body">{comment.format === 'text'
    ? <Text size="body" className="cr-comment-plain">{body}</Text>
    : <MarkdownRenderer maxLines={comment.maxLines} expandLabel={comment.expandLabel} collapseLabel={comment.collapseLabel}>{body}</MarkdownRenderer>}</div>;
}

function AskLine({ ask }: { ask: CommentAsk }) {
  const { body } = ask;
  return <div role="group" aria-label={ask.label} id={ask.anchorId} data-comment-id={ask.id} tabIndex={-1} className="cr-comment-ask">
    <div className="cr-comment-ask-line">
      <CornerDownRight size={14} aria-hidden="true" className="cr-comment-ask-icon" />
      <span className="cr-comment-ask-intro">{ask.intro ?? 'You asked'}</span>
      {ask.agent && <span className="cr-comment-ask-agent" title={ask.agent}>{ask.agent}</span>}
      {(ask.reference !== undefined || ask.time) && <span className="cr-comment-ask-meta">
        {ask.reference}
        {ask.time && <span className="cr-comment-ask-time">{ask.reference !== undefined && ' · '}<time dateTime={ask.time.dateTime} title={ask.time.title ?? ask.time.label}>{ask.time.shortLabel ?? ask.time.label}</time></span>}
      </span>}
      {ask.actions !== undefined && ask.actions !== null && <span className="cr-comment-ask-actions">{ask.actions}</span>}
    </div>
    <div className="cr-comment-ask-text">{typeof body === 'string'
      ? <MarkdownRenderer maxLines={ask.maxLines ?? 2} expandLabel={ask.expandLabel} collapseLabel={ask.collapseLabel}>{body}</MarkdownRenderer>
      : body}</div>
  </div>;
}

function CommentContent({ comment }: { comment: ThreadComment }) {
  const hasBody = comment.body !== undefined && comment.body !== null;
  const answered = !comment.ask || hasBody;
  return <>
    {comment.ask && <AskLine ask={comment.ask} />}
    {answered && <CommentHeader comment={comment} />}
    {hasBody && <CommentBody comment={comment} />}
    {comment.content !== undefined && comment.content !== null && <div className="cr-comment-content">{comment.content}</div>}
  </>;
}

/** A comment in a Card with its replies in a tinted band below, a collapsed summary, and a composer. */
export function CommentThread({ comment, replies = [], visibleReplies = 2, composer, collapsed: controlledCollapsed, defaultCollapsed = false,
  onCollapsedChange, repliesLabel = 'Replies', showEarlierLabel = hidden => `Show ${hidden} earlier ${hidden === 1 ? 'reply' : 'replies'}`,
  collapseLabel = 'Collapse', expandLabel = 'Expand', summary = defaultSummary, footer, className, 'aria-label': ariaLabel, ...props }: CommentThreadProps) {
  const id = useId();
  const [ownCollapsed, setOwnCollapsed] = useState(defaultCollapsed);
  const [showAll, setShowAll] = useState(false);
  const collapsed = controlledCollapsed ?? ownCollapsed;
  const band = useRef<HTMLElement>(null);
  const focusAfter = useRef<'first-reply' | null>(null);
  const hasComposer = composer !== undefined && composer !== null && composer !== false;
  const hasReplies = replies.length > 0;
  const limit = Math.max(0, Math.floor(visibleReplies));
  const hidden = showAll ? 0 : Math.max(0, replies.length - limit);
  const shown = replies.slice(hidden);
  const firstNew = useRef<string | null>(null);

  useEffect(() => {
    const target = focusAfter.current;
    focusAfter.current = null;
    const region = band.current;
    if (target && region && firstNew.current) region.querySelector<HTMLElement>(`[data-comment-id="${CSS.escape(firstNew.current)}"]`)?.focus();
  });

  // The toggle stays in place and keeps focus: only the replies below the bar hide.
  const setCollapsed = (next: boolean) => {
    if (controlledCollapsed === undefined) setOwnCollapsed(next);
    onCollapsedChange?.(next);
  };

  const latest = replies.at(-1);

  return <Card {...props} className={['cr-comment-thread', className].filter(Boolean).join(' ')} aria-label={ariaLabel ?? comment.label}>
    <div className="cr-card-region cr-comment-thread-main" data-comment-id={comment.id}>
      <CommentContent comment={comment} />
      {hasComposer && !hasReplies && <div className="cr-comment-thread-composer">{composer}</div>}
    </div>
    {hasReplies && <section ref={band} className="cr-card-region cr-comment-thread-replies" aria-label={repliesLabel} data-collapsed={collapsed || undefined}>
      <div className="cr-comment-thread-bar">
        {collapsed && latest ? <span className="cr-comment-thread-summary">{summary(replies.length, latest)}</span>
          : hidden > 0 && <Button variant="link" size="sm" icon={ChevronUp} className="cr-comment-thread-earlier" onClick={() => {
            firstNew.current = replies[0]?.id ?? null;
            focusAfter.current = 'first-reply';
            setShowAll(true);
          }}>{showEarlierLabel(hidden)}</Button>}
        <Button variant="link" size="sm" className="cr-comment-thread-collapse" aria-expanded={!collapsed} aria-controls={`${id}-replies`}
          onClick={() => setCollapsed(!collapsed)}>{collapsed ? expandLabel : collapseLabel}</Button>
      </div>
      <ol id={`${id}-replies`} className="cr-comment-thread-list" role="list" hidden={collapsed}>
        {shown.map(reply => <li key={reply.id}>
          <article className="cr-comment-reply" data-comment-id={reply.id} tabIndex={-1} aria-label={reply.label}><CommentContent comment={reply} /></article>
        </li>)}
      </ol>
      {hasComposer && <div className="cr-comment-thread-composer">{composer}</div>}
    </section>}
    {footer !== undefined && footer !== null && footer !== false && <footer className="cr-card-region cr-comment-thread-footer">{footer}</footer>}
  </Card>;
}
