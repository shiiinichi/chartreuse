import { useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { AlertCircle, FileText, Folder, X } from 'lucide-react';
import { IconButton } from './components';
import { Text } from './Text';
import './file-picker.css';

export interface FilePickerProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'value' | 'defaultValue' | 'children'> {
  label: string;
  mode?: 'file' | 'folder';
  hint?: ReactNode;
  error?: string;
  onFilesChange?: (files: File[]) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const unit = Math.min(3, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** unit).toFixed(unit === 1 ? 0 : 1)} ${['B', 'KB', 'MB', 'GB'][unit]}`;
}

/** A native file input with an optional directory chooser and local metadata. */
export function FilePicker({ label, mode = 'file', hint, error, onFilesChange, multiple = false, accept, disabled = false, required, name, className, id: suppliedId, ref, onChange, ...inputProps }: FilePickerProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const onFilesChangeRef = useRef(onFilesChange);
  const [files, setFiles] = useState<File[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [directorySupported, setDirectorySupported] = useState<boolean | null>(null);
  const selectionMode = `${mode}:${mode === 'folder' || multiple}`;
  const previousModeRef = useRef(selectionMode);
  const isDirectory = mode === 'folder' && directorySupported !== false;
  const directoryAttributes = isDirectory ? { webkitdirectory: '' } : {};
  const hasHint = hint !== undefined && hint !== null && hint !== false;
  const folderFallback = mode === 'folder' && directorySupported === false;

  useImperativeHandle(ref, () => inputRef.current!, []);
  useEffect(() => { onFilesChangeRef.current = onFilesChange; }, [onFilesChange]);
  useEffect(() => { setDirectorySupported('webkitdirectory' in HTMLInputElement.prototype); }, []);

  const clearSelection = useCallback((focusInput = false) => {
    const input = inputRef.current;
    if (input) {
      input.value = '';
      if (focusInput) input.focus({ preventScroll: true });
    }
    setFiles([]);
    setAnnouncement('Selection cleared.');
    onFilesChangeRef.current?.([]);
  }, []);

  useEffect(() => {
    if (previousModeRef.current !== selectionMode) {
      previousModeRef.current = selectionMode;
      clearSelection();
    }
  }, [selectionMode, clearSelection]);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    let active = true;
    const reset = (event: Event) => {
      // The reset event precedes the native reset and can still be canceled.
      window.setTimeout(() => { if (active && !event.defaultPrevented) clearSelection(); }, 0);
    };
    form.addEventListener('reset', reset);
    return () => { active = false; form.removeEventListener('reset', reset); };
  }, [inputProps.form, clearSelection]);

  const selection = useMemo(() => {
    const roots = new Set<string>();
    let bytes = 0;
    for (const file of files) {
      bytes += file.size;
      const relativePath = file.webkitRelativePath || '';
      if (relativePath.includes('/')) roots.add(relativePath.split('/')[0]);
    }
    const folder = roots.size === 1 ? [...roots][0] : roots.size > 1 ? `${roots.size} folders` : '';
    const title = mode === 'folder' && folder ? folder : files.length === 1 ? files[0].name : `${files.length} files selected`;
    return { title, count: `${files.length} ${files.length === 1 ? 'file' : 'files'}`, size: formatSize(bytes), paths: files.slice(0, 3).map(file => file.webkitRelativePath || file.name) };
  }, [files, mode]);
  const Icon = mode === 'folder' ? Folder : FileText;

  return <div className={['cr-file-picker', className].filter(Boolean).join(' ')} data-disabled={disabled || undefined} data-error={Boolean(error) || undefined} data-mode={mode}>
    <label htmlFor={id}>{label}{required && <span className="cr-required"> *</span>}</label>
    <div className="cr-file-picker-control"><input {...inputProps} {...directoryAttributes} ref={inputRef} id={id} type="file" name={name} disabled={disabled} required={required} multiple={mode === 'folder' || multiple} accept={mode === 'file' ? accept : undefined} className="cr-file-picker-input" aria-invalid={error ? true : inputProps['aria-invalid']} aria-describedby={[inputProps['aria-describedby'], hasHint && !error && `${id}-hint`, folderFallback && `${id}-fallback`, error && `${id}-error`].filter(Boolean).join(' ') || undefined} onChange={event => {
      const selected = Array.from(event.currentTarget.files || []);
      setFiles(selected);
      setAnnouncement(selected.length ? `${selected.length} ${selected.length === 1 ? 'file selected' : 'files selected'}.` : 'Selection cleared.');
      onChange?.(event);
      onFilesChange?.(selected);
    }} />{files.length > 0 && <IconButton className="cr-file-picker-clear" icon={X} size="sm" label={`Clear ${label.toLowerCase()} selection`} disabled={disabled} onClick={() => clearSelection(true)} />}</div>
    {hasHint && !error && <Text size="small" id={`${id}-hint`}>{hint}</Text>}
    {folderFallback && <Text size="small" className="cr-file-picker-fallback" id={`${id}-fallback`}>Folder selection is not supported in this browser. Select files instead.</Text>}
    {files.length > 0 && <div className="cr-file-picker-selection"><div><Icon size={16} aria-hidden="true" /><Text bold>{selection.title}</Text><span>{selection.count} · {selection.size}</span></div><ul>{selection.paths.map((path, index) => <li key={`${path}-${index}`}><code>{path}</code></li>)}{files.length > 3 && <li className="cr-file-picker-more">{files.length - 3} more {files.length - 3 === 1 ? 'file' : 'files'}</li>}</ul></div>}
    <div id={`${id}-error`} className={error ? undefined : 'cr-sr-only'} role="alert" aria-atomic="true">{error && <Text size="small" className="cr-file-picker-error"><AlertCircle size={13} aria-hidden="true" /><span>{error}</span></Text>}</div>
    <span className="cr-sr-only" role="status" aria-atomic="true">{announcement}</span>
  </div>;
}
