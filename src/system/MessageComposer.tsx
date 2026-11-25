import { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, FormEvent, ReactNode } from 'react';
import { AlertCircle, ArrowUp } from 'lucide-react';
import { Button } from './components';
import { Text } from './Text';
import type { ControlSize } from './control-size';
import './message-composer.css';

export interface MessageComposerProps extends Omit<ComponentPropsWithRef<'textarea'>, 'children' | 'value' | 'defaultValue' | 'onSubmit'> {
  label?: string;
  hint?: ReactNode;
  /** Controls at the start of the footer, such as a ButtonSelect. Kept apart from the hint so they are not read as its description. */
  controls?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend: (message: string) => void | Promise<void>;
  sendLabel?: string;
  /** Size of the send button. Defaults to md. */
  sendSize?: ControlSize;
  /**
   * 'inline' puts the field, controls, and send on one row with no footer: the field starts one
   * line tall and grows with the draft while the controls and send stay on its bottom line. The hint
   * stays available to assistive technology only. Defaults to 'stacked'.
   */
  layout?: 'stacked' | 'inline';
}

// The selection each composer had when it last lost focus. A quote goes there, or to the end of a
// composer that has never been focused.
const lastSelections = new WeakMap<HTMLTextAreaElement, readonly [number, number]>();

/** Formats text as a Markdown blockquote: every line gets `> `, and blank lines stay in the quote. */
export function formatQuote(text: string) {
  const body = text.replace(/\r\n?/g, '\n').replace(/^(?:[ \t]*\n)+/, '').trimEnd();
  return body ? body.split('\n').map(line => (line.trim() ? `> ${line}` : '>')).join('\n') : '';
}

/**
 * Inserts text into a MessageComposer textarea as a Markdown blockquote followed by a blank line.
 * It inserts at the cursor once the composer has been focused and appends otherwise, then focuses
 * the composer with the cursor after the quote. The edit goes through the browser's undo history,
 * so Command/Ctrl+Z removes it. Returns false when nothing was inserted.
 */
export function insertQuote(textarea: HTMLTextAreaElement | null | undefined, text: string) {
  const quote = formatQuote(text);
  if (!textarea || !quote || textarea.disabled || textarea.readOnly) return false;
  const original = textarea.value;
  const saved = textarea.ownerDocument.activeElement === textarea ? [textarea.selectionStart, textarea.selectionEnd] : lastSelections.get(textarea);
  const end = Math.min(saved?.[1] ?? original.length, original.length);
  const start = Math.min(saved?.[0] ?? original.length, end);
  const before = original.slice(0, start);
  const lead = !before || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  // The blank line ends the quote, so text typed after it is not a lazy continuation of the quote.
  const insertion = `${lead}${quote}\n\n`;
  textarea.focus();
  textarea.setSelectionRange(start, end);
  let inserted = false;
  try { inserted = textarea.ownerDocument.execCommand('insertText', false, insertion) && textarea.value !== original; }
  catch { inserted = false; }
  if (!inserted && textarea.value === original) {
    // Without execCommand the edit is not undoable, but the input event still reaches React.
    textarea.setRangeText(insertion, start, end, 'end');
    textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: insertion }));
  }
  const caret = start + insertion.length;
  textarea.setSelectionRange(caret, caret);
  return true;
}

/** A labeled multiline field with a send action. */
export function MessageComposer({
  label = 'Message',
  hint = 'Enter adds a new line. Command/Ctrl+Enter sends.',
  controls,
  placeholder = 'Enter a message',
  value,
  defaultValue = '',
  onValueChange,
  onSend,
  disabled = false,
  sendLabel = 'Send message',
  sendSize = 'md',
  layout = 'stacked',
  rows = 4,
  className,
  id: suppliedId,
  name = 'message',
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onBlur,
  ref,
  ...textareaProps
}: MessageComposerProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const [draft, setDraft] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const sendingRef = useRef(false);
  const composingRef = useRef(false);
  const mountedRef = useRef(true);
  const sentCountRef = useRef(0);
  const text = value ?? draft;
  const inline = layout === 'inline';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => textareaRef.current!, []);
  // Once the draft no longer fits beside the controls, it takes the full width and the controls and
  // send move to the bottom line below it.
  const [wrapped, setWrapped] = useState(false);
  useLayoutEffect(() => {
    const field = textareaRef.current;
    const form = field?.form;
    const view = field?.ownerDocument.defaultView;
    if (!inline || !field || !form || !view) { setWrapped(false); return; }
    const canvas = field.ownerDocument.createElement('canvas').getContext('2d');
    const check = () => {
      const formStyle = view.getComputedStyle(form);
      const gap = parseFloat(formStyle.columnGap) || 0;
      const inner = form.clientWidth - parseFloat(formStyle.paddingInlineStart) - parseFloat(formStyle.paddingInlineEnd);
      const actions = Array.from(form.children).filter(child => child.matches('.cr-message-composer-controls, .cr-message-composer-send'))
        .reduce((total, child) => total + (child as HTMLElement).offsetWidth + gap, 0);
      const value = field.value;
      if (canvas) canvas.font = view.getComputedStyle(field).font;
      const width = canvas ? canvas.measureText(value).width : 0;
      setWrapped(value.includes('\n') || width > inner - actions - 4);
    };
    check();
    const observer = new view.ResizeObserver(check);
    observer.observe(form);
    return () => observer.disconnect();
  }, [inline, text]);
  // The inline field grows with its draft, up to its max-block-size.
  useLayoutEffect(() => {
    const field = textareaRef.current;
    if (!inline || !field) return;
    field.style.blockSize = 'auto';
    field.style.blockSize = `${field.scrollHeight + field.offsetHeight - field.clientHeight}px`;
  }, [inline, text, wrapped]);
  const hasHint = hint !== undefined && hint !== null && hint !== false;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const changeValue = (next: string) => {
    if (value === undefined) setDraft(next);
    onValueChange?.(next);
  };

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const textarea = form.querySelector('textarea');
    const submittedDraft = textarea?.value ?? text;
    const message = submittedDraft.trim();
    if (disabled || sendingRef.current || !message) return;

    // Keep focus inside the composer before the pending state disables Send.
    if (textarea && form.contains(form.ownerDocument.activeElement)) textarea.focus({ preventScroll: true });
    sendingRef.current = true;
    setPending(true);
    setError('');
    try {
      await onSend(message);
      if (!mountedRef.current) return;
      // A new draft written while the previous message is in flight is retained.
      if (textarea?.value === submittedDraft) {
        form.reset();
        changeValue('');
      }
      sentCountRef.current += 1;
      setAnnouncement(`Message sent. ${sentCountRef.current} ${sentCountRef.current === 1 ? 'message' : 'messages'} sent in this conversation.`);
    } catch (cause) {
      if (mountedRef.current) {
        setError(cause instanceof Error && cause.message ? cause.message : 'Message could not be sent. The draft has been retained.');
      }
    } finally {
      sendingRef.current = false;
      if (mountedRef.current) setPending(false);
    }
  };

  return <form className={['cr-message-composer', className].filter(Boolean).join(' ')} aria-label={`${label} composer`} aria-busy={pending || undefined} data-disabled={disabled || undefined} data-error={Boolean(error) || undefined}
    data-layout={inline ? 'inline' : undefined} data-wrapped={inline && wrapped || undefined} onSubmit={send}>
    <label className="cr-sr-only" htmlFor={id}>{label}</label>
    <textarea {...textareaProps} ref={textareaRef} id={id} name={name} rows={inline ? 1 : rows} placeholder={placeholder} value={text} disabled={disabled} className="cr-message-composer-input"
      aria-invalid={error ? true : textareaProps['aria-invalid']}
      aria-describedby={[textareaProps['aria-describedby'], hasHint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
      onChange={event => {
        const next = event.currentTarget.value;
        onChange?.(event);
        changeValue(next);
        if (error) setError('');
      }}
      onBlur={event => { lastSelections.set(event.currentTarget, [event.currentTarget.selectionStart, event.currentTarget.selectionEnd]); onBlur?.(event); }}
      onCompositionStart={event => { composingRef.current = true; onCompositionStart?.(event); }}
      onCompositionEnd={event => { composingRef.current = false; onCompositionEnd?.(event); }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.nativeEvent.isComposing || composingRef.current || event.nativeEvent.keyCode === 229) return;
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.altKey) {
          event.preventDefault();
          if (!disabled && !sendingRef.current && event.currentTarget.value.trim()) event.currentTarget.form?.requestSubmit();
        }
      }} />
    {inline ? <>
      {controls !== undefined && controls !== null && controls !== false && <div className="cr-message-composer-controls">{controls}</div>}
      <Button type="submit" size={sendSize} icon={ArrowUp} loading={pending} disabled={disabled || !text.trim()} className="cr-message-composer-send" aria-label={pending ? 'Sending message' : sendLabel} title={sendLabel} />
      <div className="cr-sr-only" id={hasHint ? `${id}-hint` : undefined}>{pending ? 'Sending message…' : hint}</div>
      <div className="cr-message-composer-error-region" id={`${id}-error`} role="alert" aria-atomic="true">{error && <Text size="body" className="cr-message-composer-error"><AlertCircle size={14} aria-hidden="true" /><span>{error}</span></Text>}</div>
    </> : <div className="cr-message-composer-footer">{controls !== undefined && controls !== null && controls !== false && <div className="cr-message-composer-controls">{controls}</div>}<div className="cr-message-composer-hint" id={hasHint ? `${id}-hint` : undefined}>{pending ? <span className={hasHint ? undefined : 'cr-sr-only'}>Sending message…</span> : hint}</div><div className="cr-message-composer-actions"><div className="cr-message-composer-error-region" id={`${id}-error`} role="alert" aria-atomic="true">{error && <Text size="body" className="cr-message-composer-error"><AlertCircle size={14} aria-hidden="true" /><span>{error}</span></Text>}</div><Button type="submit" size={sendSize} icon={ArrowUp} loading={pending} disabled={disabled || !text.trim()} className="cr-message-composer-send" aria-label={pending ? 'Sending message' : sendLabel} title={sendLabel} /></div></div>}
    <span className="cr-sr-only" role="status" aria-atomic="true">{announcement}</span>
  </form>;
}
