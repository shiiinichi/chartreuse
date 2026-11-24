import { useEffect, useId, useRef, useState } from 'react';
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
  rows = 4,
  className,
  id: suppliedId,
  name = 'message',
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
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

  return <form className={['cr-message-composer', className].filter(Boolean).join(' ')} aria-label={`${label} composer`} aria-busy={pending || undefined} data-disabled={disabled || undefined} data-error={Boolean(error) || undefined} onSubmit={send}>
    <label className="cr-sr-only" htmlFor={id}>{label}</label>
    <textarea {...textareaProps} id={id} name={name} rows={rows} placeholder={placeholder} value={text} disabled={disabled} className="cr-message-composer-input"
      aria-invalid={error ? true : textareaProps['aria-invalid']}
      aria-describedby={[textareaProps['aria-describedby'], hasHint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
      onChange={event => {
        const next = event.currentTarget.value;
        onChange?.(event);
        changeValue(next);
        if (error) setError('');
      }}
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
    <div className="cr-message-composer-footer">{controls !== undefined && controls !== null && controls !== false && <div className="cr-message-composer-controls">{controls}</div>}<div className="cr-message-composer-hint" id={hasHint ? `${id}-hint` : undefined}>{pending ? <span className={hasHint ? undefined : 'cr-sr-only'}>Sending message…</span> : hint}</div><div className="cr-message-composer-actions"><div className="cr-message-composer-error-region" id={`${id}-error`} role="alert" aria-atomic="true">{error && <Text size="body" className="cr-message-composer-error"><AlertCircle size={14} aria-hidden="true" /><span>{error}</span></Text>}</div><Button type="submit" size={sendSize} icon={ArrowUp} loading={pending} disabled={disabled || !text.trim()} className="cr-message-composer-send" aria-label={pending ? 'Sending message' : sendLabel} title={sendLabel} /></div></div>
    <span className="cr-sr-only" role="status" aria-atomic="true">{announcement}</span>
  </form>;
}
