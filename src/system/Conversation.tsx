import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';
import { LoaderCircle, TextQuote } from 'lucide-react';
import { Button } from './components';
import { MarkdownRenderer } from './MarkdownRenderer';
import { selectionText } from './selection-markdown';
import { Text } from './Text';
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
  /**
   * Shows a Quote button beside text selected within one message body. It receives the selection
   * as Markdown (plain text for text-format messages) and the message; pass both to insertQuote.
   */
  onQuote?: (text: string, message: ConversationMessage) => void;
  /** Visible text and accessible name of the Quote button. */
  quoteLabel?: string;
}

interface QuoteTarget {
  messageId: string;
  text: string;
  /** Selection edge in the conversation's coordinates. */
  x: number;
  y: number;
  above: boolean;
}

const quoteGap = 6;

function messageBody(node: Node | null, root: HTMLElement) {
  const element = node && (node.nodeType === 1 ? node as Element : node.parentElement);
  const body = element?.closest<HTMLElement>('.cr-conversation-body');
  return body && body.closest('.cr-conversation') === root ? body : null;
}

/** The selection, clipped to the one message body it covers, or null. */
function readQuoteTarget(root: HTMLElement): QuoteTarget | null {
  const selection = root.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const body = messageBody(range.startContainer, root) ?? messageBody(range.endContainer, root);
  const messageId = body?.dataset.messageId;
  if (!body || messageId === undefined) return null;
  // A triple click can end the range at the start of the next turn. Clip it to this body and
  // accept it only when the clipped part holds all of the selected text.
  const clipped = range.cloneRange();
  if (!body.contains(range.startContainer)) clipped.setStart(body, 0);
  if (!body.contains(range.endContainer)) clipped.setEnd(body, body.childNodes.length);
  const selected = clipped.toString();
  if (!selected.trim() || selected.trim() !== range.toString().trim()) return null;
  const text = selectionText(clipped, body).trim();
  if (!text) return null;
  const rects = Array.from(clipped.getClientRects()).filter(rect => rect.width > 0 || rect.height > 0);
  const backward = selection.focusNode === range.startContainer && selection.focusOffset === range.startOffset;
  const edge = (backward ? rects[0] : rects.at(-1)) ?? clipped.getBoundingClientRect();
  const origin = root.getBoundingClientRect();
  return {
    messageId,
    text,
    x: (backward ? edge.left : edge.right) - origin.left + root.scrollLeft,
    y: (backward ? edge.top : edge.bottom) - origin.top + root.scrollTop,
    above: backward,
  };
}

function sameTarget(a: QuoteTarget | null, b: QuoteTarget | null) {
  return a === b || Boolean(a && b && a.messageId === b.messageId && a.text === b.text && a.x === b.x && a.y === b.y && a.above === b.above);
}

function QuoteButton({ target, label, root, onQuote, onEscape, onBlur }: { target: QuoteTarget; label: string; root: HTMLElement | null; onQuote: () => void; onEscape: () => void; onBlur: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const button = ref.current;
    if (!button || !root) return;
    // Align the button's end with the selection edge, kept inside the conversation.
    const width = button.offsetWidth;
    const left = target.above ? target.x : target.x - width;
    button.style.left = `${Math.max(0, Math.min(left, root.clientWidth - width))}px`;
    button.style.top = `${Math.max(0, target.above ? target.y - button.offsetHeight - quoteGap : target.y + quoteGap)}px`;
  }, [target, root]);
  return <Button ref={ref} variant="secondary" size="sm" icon={TextQuote} className="cr-conversation-quote"
    // Keep the selection when the button is pressed with a pointer.
    onMouseDown={event => event.preventDefault()}
    onClick={onQuote}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); onEscape(); } }}
    onBlur={onBlur}>{label}</Button>;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    const cleanup = ref(value);
    return typeof cleanup === 'function' ? cleanup : undefined;
  }
  if (ref) (ref as { current: T | null }).current = value;
  return undefined;
}

const defaultSenders: Record<ConversationRole, string> = { user: 'You', agent: 'Agent', system: 'System' };

function ConversationTurn({ message, quote }: { message: ConversationMessage; quote?: ReactNode }) {
  const id = useId();
  const sender = message.sender ?? defaultSenders[message.role];
  const format = message.format ?? (message.role === 'agent' ? 'markdown' : 'text');
  const time = message.timeLabel ?? message.dateTime;
  return <li className="cr-conversation-turn">
    <article className="cr-conversation-message" data-role={message.role} aria-labelledby={`${id}-sender`}>
      <header className="cr-conversation-message-header"><Text bold id={`${id}-sender`}>{sender}</Text>{time && (message.dateTime ? <time dateTime={message.dateTime}>{time}</time> : <span className="cr-conversation-time">{time}</span>)}</header>
      {message.activity !== undefined && message.activity !== null && <div className="cr-conversation-activity">{message.activity}</div>}
      <div className="cr-conversation-body" data-format={format} data-message-id={message.id}>{format === 'markdown' ? <MarkdownRenderer>{message.body}</MarkdownRenderer> : <Text size="body" className="cr-conversation-plain">{message.body}</Text>}</div>
      {quote}
    </article>
  </li>;
}

/** Chronological turns with Markdown agent bodies and optional work between turns. */
export function Conversation({ messages, label = 'Conversation', emptyMessage = 'No messages.', pending = false, pendingLabel = 'Agent is working…', announce = false, onQuote, quoteLabel = 'Quote', className, ref, ...props }: ConversationProps) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [quote, setQuote] = useState<QuoteTarget | null>(null);
  const quotable = Boolean(onQuote);
  const setRef = useCallback((element: HTMLDivElement | null) => {
    setRoot(element);
    return assignRef(ref, element);
  }, [ref]);

  const refresh = useCallback(() => {
    if (!root || !quotable) return;
    // Keep a focused button while its selection collapses, as keyboard focus can do.
    const active = root.ownerDocument.activeElement;
    if (active?.classList.contains('cr-conversation-quote') && root.contains(active)) return;
    const next = readQuoteTarget(root);
    setQuote(current => sameTarget(current, next) ? current : next);
  }, [root, quotable]);

  useEffect(() => {
    if (!root || !quotable) { setQuote(null); return; }
    const doc = root.ownerDocument;
    const view = doc.defaultView;
    let frame = 0;
    const schedule = () => {
      if (!view) return refresh();
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(refresh);
    };
    doc.addEventListener('selectionchange', schedule);
    view?.addEventListener('resize', schedule);
    return () => {
      view?.cancelAnimationFrame(frame);
      doc.removeEventListener('selectionchange', schedule);
      view?.removeEventListener('resize', schedule);
    };
  }, [root, quotable, refresh]);

  // A message that streams or reflows moves the selection without a selectionchange event.
  useLayoutEffect(() => { if (quote) refresh(); }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  const quoteMessage = quote && messages.find(message => message.id === quote.messageId);
  const quoteButton = quote && quoteMessage && onQuote && <QuoteButton target={quote} label={quoteLabel} root={root}
    onQuote={() => {
      root?.ownerDocument.getSelection()?.removeAllRanges();
      setQuote(null);
      onQuote(quote.text, quoteMessage);
    }}
    onEscape={() => {
      root?.ownerDocument.getSelection()?.removeAllRanges();
      setQuote(null);
    }}
    // Once focus leaves the button, it follows the selection again.
    onBlur={() => queueMicrotask(refresh)} />;
  const last = messages.at(-1);
  const sender = last ? last.sender ?? defaultSenders[last.role] : '';
  const announcement = [messages.length ? `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}. Last message from ${sender}.` : 'No messages.', pending && pendingLabel].filter(Boolean).join(' ');
  return <>
    <div {...props} ref={setRef} className={['cr-conversation', className].filter(Boolean).join(' ')} data-quotable={quotable || undefined} role="log" aria-label={label} aria-live="off">
      {messages.length > 0 ? <ol className="cr-conversation-list" role="list">{messages.map(message => <ConversationTurn key={message.id} message={message} quote={quoteMessage === message ? quoteButton : undefined} />)}</ol> : !pending && <Text size="body" className="cr-conversation-empty">{emptyMessage}</Text>}
      {pending && <Text size="body" className="cr-conversation-pending"><LoaderCircle size={15} aria-hidden="true" /><span>{pendingLabel}</span></Text>}
    </div>
    {announce && <span className="cr-conversation-announcement" role="status" aria-atomic="true">{announcement}</span>}
  </>;
}
