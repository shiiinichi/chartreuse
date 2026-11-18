import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import './conversation.css';

export type ConversationRole = 'user' | 'agent' | 'system';
export type ConversationFormat = 'text' | 'markdown';

export interface ConversationMessage {
  /** Unique within this conversation; retain the ID while a body streams. */
  id: string;
  role: ConversationRole;
  body: string;
  sender?: string;
  /** Human-readable time supplied by the host to avoid locale/hydration drift. */
  timeLabel?: string;
  /** Optional machine-readable timestamp for the native time element. */
  dateTime?: string;
  /** Agent messages default to Markdown; user and system messages to text. */
  format?: ConversationFormat;
  /** Work shown between the message header and body, such as an AgentActivity group. */
  activity?: ReactNode;
}

export interface ConversationProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'role' | 'aria-live' | 'aria-label'> {
  messages: readonly ConversationMessage[];
  label?: string;
  emptyMessage?: string;
  pending?: boolean;
  pendingLabel?: string;
  /** Announce concise turn counts rather than streaming message bodies. */
  announce?: boolean;
}

const defaultSenders: Record<ConversationRole, string> = { user: 'You', agent: 'Agent', system: 'System' };

function ConversationTurn({ message }: { message: ConversationMessage }) {
  const id = useId();
  const sender = message.sender ?? defaultSenders[message.role];
  const format = message.format ?? (message.role === 'agent' ? 'markdown' : 'text');
  const time = message.timeLabel ?? message.dateTime;
  return <li className="cr-conversation-turn">
    <article className="cr-conversation-message" data-role={message.role} aria-labelledby={`${id}-sender`}>
      <header className="cr-conversation-message-header"><strong id={`${id}-sender`}>{sender}</strong>{time && (message.dateTime ? <time dateTime={message.dateTime}>{time}</time> : <span className="cr-conversation-time">{time}</span>)}</header>
      {message.activity !== undefined && message.activity !== null && <div className="cr-conversation-activity">{message.activity}</div>}
      <div className="cr-conversation-body" data-format={format}>{format === 'markdown' ? <MarkdownRenderer>{message.body}</MarkdownRenderer> : <p className="cr-conversation-plain">{message.body}</p>}</div>
    </article>
  </li>;
}

/** Chronological turns with Markdown agent bodies and optional work between turns. */
export function Conversation({ messages, label = 'Conversation', emptyMessage = 'No messages.', pending = false, pendingLabel = 'Agent is working…', announce = false, className, ...props }: ConversationProps) {
  const last = messages.at(-1);
  const sender = last ? last.sender ?? defaultSenders[last.role] : '';
  const announcement = [messages.length ? `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}. Last message from ${sender}.` : 'No messages.', pending && pendingLabel].filter(Boolean).join(' ');
  return <>
    <div {...props} className={['cr-conversation', className].filter(Boolean).join(' ')} role="log" aria-label={label} aria-live="off">
      {messages.length > 0 ? <ol className="cr-conversation-list" role="list">{messages.map(message => <ConversationTurn key={message.id} message={message} />)}</ol> : !pending && <p className="cr-conversation-empty">{emptyMessage}</p>}
      {pending && <p className="cr-conversation-pending"><LoaderCircle size={15} aria-hidden="true" /><span>{pendingLabel}</span></p>}
    </div>
    {announce && <span className="cr-conversation-announcement" role="status" aria-atomic="true">{announcement}</span>}
  </>;
}
