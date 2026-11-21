import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { Text } from './Text';
import './option-list.css';

export interface OptionListItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface OptionListGroup {
  label: string;
  start: number;
  end: number;
  disabled?: boolean;
}

interface OptionListProps {
  id: string;
  options: readonly OptionListItem[];
  groups?: readonly OptionListGroup[];
  active: number;
  value?: string;
  emptyMessage: string;
  onActivate: (index: number) => void;
  onSelect: (option: OptionListItem) => void;
  optionClassName?: string;
  emptyClassName?: string;
}

export function OptionList({ id, options, groups, active, value, emptyMessage, onActivate, onSelect, optionClassName, emptyClassName }: OptionListProps) {
  if (!options.length) return <div className={['cr-option-list-empty', emptyClassName].filter(Boolean).join(' ')} role="status">{emptyMessage}</div>;

  const className = ['cr-option-list-option', optionClassName].filter(Boolean).join(' ');
  const rows = options.map((option, index) => <div key={option.value} id={`${id}-${index}`} role="option"
    aria-selected={active === index} aria-disabled={option.disabled || undefined} className={className}
    onPointerMove={() => { if (!option.disabled) onActivate(index); }}
    onPointerDown={event => event.preventDefault()} onMouseDown={event => event.preventDefault()}
    onClick={() => { if (!option.disabled) onSelect(option); }}>
    <span><Text bold>{option.label}</Text>{option.description && <Text size="small">{option.description}</Text>}</span>
    {value === option.value && <Check size={14} aria-hidden="true" />}
  </div>);

  if (!groups?.length) return rows;

  const entries: ReactNode[] = [];
  let offset = 0;
  for (const { start, end, label, disabled } of groups) {
    entries.push(...rows.slice(offset, start), <div key={`group-${start}`} role="group" aria-label={label} aria-disabled={disabled || undefined}>
      <Text size="small" className="cr-option-list-group-label" aria-hidden="true">{label}</Text>
      {rows.slice(start, end)}
    </div>);
    offset = end;
  }
  entries.push(...rows.slice(offset));
  return entries;
}

export function isOptionNavigationKey(key: string): key is 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' {
  return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End';
}

export function nextOptionIndex(options: readonly OptionListItem[], active: number, key: 'ArrowDown' | 'ArrowUp' | 'Home' | 'End') {
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
  const position = enabled.indexOf(active);
  const edge = key === 'ArrowDown' || key === 'Home' ? 0 : enabled.length - 1;
  const step = key === 'ArrowDown' ? 1 : -1;
  const next = position < 0 || key === 'Home' || key === 'End'
    ? edge : (position + step + enabled.length) % enabled.length;
  return enabled[next] ?? -1;
}

export function findOptionByTyping(options: readonly OptionListItem[], active: number, key: string, timeStamp: number, search: { query: string; at: number }) {
  const character = key.toLocaleLowerCase();
  const text = timeStamp - search.at < 700 ? search.query + character : character;
  const query = [...text].every(letter => letter === character) ? character : text;
  search.query = text;
  search.at = timeStamp;
  const start = active + 1;
  const ordered = [...options.slice(start), ...options.slice(0, start)];
  const match = ordered.findIndex(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(query));
  return match < 0 ? -1 : (start + match) % options.length;
}

export function revealActiveOption(panel: HTMLDivElement | null, id: string) {
  const option = panel?.ownerDocument.getElementById(id);
  if (!panel || !option) return;

  const top = option.offsetTop;
  const bottom = top + option.offsetHeight;
  if (top < panel.scrollTop + 6) panel.scrollTop = Math.max(0, top - 6);
  else if (bottom > panel.scrollTop + panel.clientHeight - 6) panel.scrollTop = bottom - panel.clientHeight + 6;
}
