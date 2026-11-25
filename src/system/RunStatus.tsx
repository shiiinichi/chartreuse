import type { HTMLAttributes, ReactNode } from 'react';
import { CircleStop, LoaderCircle } from 'lucide-react';
import { Button } from './components';
import './run-status.css';

export interface RunStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'title'> {
  /** The current step, such as Reading <code>docs/spec-1.md</code>. Truncated with an ellipsis. */
  label: ReactNode;
  /** Full step text for the tooltip. Defaults to label when it is a string. */
  title?: string;
  /** Elapsed time, such as "0:18". Shown muted and never announced. */
  elapsed?: ReactNode;
  /** Text announced to screen readers when it changes. Defaults to title, or label when it is a string. Keep the timer out of it. */
  announcement?: string;
  /** Shows a Stop button. */
  onStop?: () => void;
  /** Visible text of the Stop button. Defaults to 'Stop'. */
  stopLabel?: string;
  /** Accessible name and tooltip of the Stop button, which goes icon-only below 360px. Defaults to 'Stop agent reply'. */
  stopAccessibleLabel?: string;
  stopDisabled?: boolean;
}

/** A live row for running work: a spinner, the current step, the elapsed time, and an optional Stop action. */
export function RunStatus({ label, title, elapsed, announcement, onStop, stopLabel = 'Stop', stopAccessibleLabel = 'Stop agent reply',
  stopDisabled = false, className, ...props }: RunStatusProps) {
  const full = title ?? (typeof label === 'string' ? label : undefined);
  const spoken = announcement ?? full;
  return <div {...props} className={['cr-run-status', className].filter(Boolean).join(' ')}>
    <div className="cr-run-status-row">
      <LoaderCircle className="cr-spin cr-run-status-spinner" size={14} aria-hidden="true" />
      <span className="cr-run-status-label" title={full}>{label}</span>
      {elapsed !== undefined && elapsed !== null && elapsed !== false && <span className="cr-run-status-elapsed">{elapsed}</span>}
      {onStop && <Button variant="secondary" size="sm" icon={CircleStop} className="cr-run-status-stop" disabled={stopDisabled}
        aria-label={stopAccessibleLabel} title={stopAccessibleLabel} onClick={onStop}><span className="cr-run-status-stop-text">{stopLabel}</span></Button>}
    </div>
    <span className="cr-sr-only" role="status" aria-atomic="true">{spoken}</span>
  </div>;
}
