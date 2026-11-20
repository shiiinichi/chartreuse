import { useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { AlertCircle, FileText, Folder, FolderOpen, X } from 'lucide-react';
import { Button, IconButton } from './components';
import { Text } from './Text';
import './path-selector.css';

export interface PathSelectorProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'value' | 'defaultValue' | 'size' | 'children'> {
  label: string;
  mode?: 'file' | 'folder';
  value?: string;
  defaultValue?: string;
  onValueChange?: (path: string) => void;
  onBrowse?: (mode: 'file' | 'folder') => string | null | Promise<string | null>;
  hint?: string;
  error?: string;
}

/** A text input for paths with an optional browse action supplied by the host. */
export function PathSelector({ label, mode = 'folder', value, defaultValue = '', onValueChange, onBrowse, hint, error, disabled = false, required, placeholder, name, className, id: suppliedId, ref, onChange, ...inputProps }: PathSelectorProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const controlled = value !== undefined;
  const controlledRef = useRef(controlled);
  const changeRef = useRef(onValueChange);
  const resetValueRef = useRef(defaultValue);
  const modeRef = useRef(mode);
  const mountedRef = useRef(true);
  const browsingRef = useRef(false);
  const revisionRef = useRef(0);
  const [draft, setDraft] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [browseError, setBrowseError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const text = value ?? draft;
  const visibleError = error || browseError;
  const Icon = mode === 'folder' ? Folder : FileText;

  useImperativeHandle(ref, () => inputRef.current!, []);
  useEffect(() => { controlledRef.current = controlled; changeRef.current = onValueChange; resetValueRef.current = defaultValue; modeRef.current = mode; }, [controlled, onValueChange, defaultValue, mode]);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const changePath = useCallback((path: string) => {
    revisionRef.current += 1;
    if (!controlledRef.current) setDraft(path);
    changeRef.current?.(path);
  }, []);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    let active = true;
    const reset = (event: Event) => {
      window.setTimeout(() => {
        if (!active || event.defaultPrevented) return;
        changePath(resetValueRef.current);
        setBrowseError('');
        setAnnouncement('Path reset.');
      }, 0);
    };
    form.addEventListener('reset', reset);
    return () => { active = false; form.removeEventListener('reset', reset); };
  }, [inputProps.form, changePath]);

  const browse = async () => {
    if (!onBrowse || disabled || browsingRef.current) return;
    const input = inputRef.current;
    const initialPath = input?.value ?? text;
    const initialRevision = revisionRef.current;
    const initialMode = mode;
    if (input && input.parentElement?.contains(input.ownerDocument.activeElement)) input.focus({ preventScroll: true });
    browsingRef.current = true;
    setPending(true);
    setBrowseError('');
    try {
      const result = await onBrowse(mode);
      if (!mountedRef.current) return;
      if (result === null || result === undefined) {
        setAnnouncement('Path selection canceled.');
      } else if (revisionRef.current === initialRevision && input?.value === initialPath && modeRef.current === initialMode) {
        changePath(result);
        setAnnouncement('Path selected.');
      } else {
        setAnnouncement('Edited path retained.');
      }
    } catch (cause) {
      if (mountedRef.current) setBrowseError(cause instanceof Error && cause.message ? cause.message : 'Path selection failed. The current path is unchanged.');
    } finally {
      browsingRef.current = false;
      if (mountedRef.current) setPending(false);
    }
  };

  return <div className={['cr-path-selector', className].filter(Boolean).join(' ')} data-disabled={disabled || undefined} data-error={Boolean(visibleError) || undefined}>
    <label htmlFor={id}>{label}{required && <span className="cr-required"> *</span>}</label>
    <div className="cr-path-selector-control"><Icon className="cr-path-selector-icon" size={16} aria-hidden="true" /><input {...inputProps} ref={inputRef} id={id} type="text" name={name} disabled={disabled} required={required} value={text} placeholder={placeholder ?? (mode === 'folder' ? 'Enter a folder path' : 'Enter a file path')} className="cr-path-selector-input" autoComplete={inputProps.autoComplete ?? 'off'} autoCapitalize={inputProps.autoCapitalize ?? 'none'} autoCorrect={inputProps.autoCorrect ?? 'off'} spellCheck={inputProps.spellCheck ?? false} data-cr-autofocus={inputProps.autoFocus || undefined} aria-invalid={visibleError ? true : inputProps['aria-invalid']} aria-describedby={[inputProps['aria-describedby'], hint && !visibleError && `${id}-hint`, visibleError && `${id}-error`].filter(Boolean).join(' ') || undefined} onChange={event => {
      const path = event.currentTarget.value;
      onChange?.(event);
      changePath(path);
      if (browseError) setBrowseError('');
    }} />{text.length > 0 && <IconButton className="cr-path-selector-clear" size="sm" icon={X} label={`Clear ${label.toLowerCase()}`} disabled={disabled} onClick={() => { inputRef.current?.focus({ preventScroll: true }); changePath(''); setBrowseError(''); setAnnouncement('Path cleared.'); }} />}{onBrowse && <Button className="cr-path-selector-browse" variant="ghost" icon={FolderOpen} loading={pending} disabled={disabled} aria-label={`Browse for a ${mode} path${pending ? ', choosing' : ''}`} onClick={browse}>Browse</Button>}</div>
    {hint && !visibleError && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    <div id={`${id}-error`} className={visibleError ? undefined : 'cr-sr-only'} role="alert" aria-atomic="true">{visibleError && <Text size="small" className="cr-path-selector-error"><AlertCircle size={13} aria-hidden="true" /><span>{visibleError}</span></Text>}</div>
    <span className="cr-sr-only" role="status" aria-atomic="true">{announcement}</span>
  </div>;
}
