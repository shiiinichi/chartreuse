import { useState } from 'react';
import { Switch, TextField } from '../system';
import './SplitOptions.css';

export interface SplitOptionsValue {
  resizableSplit: boolean;
  sideContentMaxWidth: number;
  maxWidth: number;
}

function WidthOption({ label, value, min, max, onCommit }: { label: string; value: number; min: number; max: number; onCommit: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value));

  function commit() {
    const parsed = Number(draft);
    const next = draft.trim() && Number.isFinite(parsed) ? Math.round(Math.min(max, Math.max(min, parsed))) : value;
    setDraft(String(next));
    onCommit(next);
  }

  return <TextField className="split-options-width" label={`${label} (px)`} type="number" inputMode="numeric" min={min} max={max} step={20} value={draft} onChange={event => setDraft(event.target.value)} onBlur={commit} onKeyDown={event => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }} />;
}

export function SplitOptions({ value, onChange }: { value: SplitOptionsValue; onChange: (value: SplitOptionsValue) => void }) {
  return <fieldset className="split-options"><legend className="cr-sr-only">Split layout options</legend>
    <div className="split-options-toggle"><Switch label="Resizable split" name="resizableSplit" checked={value.resizableSplit} onChange={event => onChange({ ...value, resizableSplit: event.target.checked })} /></div>
    <WidthOption label="sideContentMaxWidth" value={value.sideContentMaxWidth} min={260} max={1200} onCommit={sideContentMaxWidth => onChange({ ...value, sideContentMaxWidth })} />
    <WidthOption label="maxWidth" value={value.maxWidth} min={320} max={2400} onCommit={maxWidth => onChange({ ...value, maxWidth })} />
    <span className="split-options-note">Width values commit on blur or Enter. Open the dialog to inspect the split.</span>
  </fieldset>;
}
