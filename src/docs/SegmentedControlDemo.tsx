import { useId, useState } from 'react';
import { Grid2X2, List, Table2 } from 'lucide-react';
import { Button, Switch } from '../system/components';
import { SegmentedControl } from '../system/SegmentedControl';
import { ExampleGallery, Showcase } from './shared';
import './segmented-control-demo.css';

export function SegmentedControlDemo() {
  const id = useId();
  const [value, setValue] = useState('20');
  const [disabled, setDisabled] = useState(false);
  const [result, setResult] = useState('');
  return <ExampleGallery className="segmented-control-demo">
    <Showcase title="Controlled size selection" description="Keep the selected option in React state and toggle the native disabled state." code={`import { useId, useState } from 'react';
import { Grid2X2 } from 'lucide-react';
import { SegmentedControl, Switch } from '@chartreuse/ui';

export function SizeExample() {
  const id = useId();
  const [size, setSize] = useState(${JSON.stringify(value)});
  const [disabled, setDisabled] = useState(${disabled});
  return <div className="segmented-control-demo-example">
    <SegmentedControl label="Size" name={id + '-icon-size'}
      options={[
        { value: '16', label: '16' },
        { value: '20', label: '20' },
        { value: '24', label: '24' },
      ]}
      value={size} onValueChange={setSize}
      disabled={disabled} hint="Choose an icon size in pixels." />
    <div className="segmented-control-demo-selected">
      <Grid2X2 size={Number(size)} aria-hidden="true" />
      <span>Preview at {size}px</span>
    </div>
    <Switch label="Disable size selection" checked={disabled}
      onChange={event => setDisabled(event.currentTarget.checked)} />
  </div>;
}

/* Example CSS:
.segmented-control-demo-example {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px 28px;
}
.segmented-control-demo-selected {
  display: flex;
  align-items: center;
  gap: 10px;
  min-block-size: 40px;
  color: var(--cr-color-muted);
  font-size: 13px;
}
.segmented-control-demo-selected > svg { color: var(--cr-color-text); }
*/`}><div className="segmented-control-demo-example"><SegmentedControl label="Size" name={`${id}-icon-size`} options={[{ value: '16', label: '16' }, { value: '20', label: '20' }, { value: '24', label: '24' }]} value={value} onValueChange={setValue} disabled={disabled} hint="Choose an icon size in pixels." /><div className="segmented-control-demo-selected"><Grid2X2 size={Number(value)} aria-hidden="true" /><span>Preview at {value}px</span></div><Switch label="Disable size selection" checked={disabled} onChange={event => setDisabled(event.currentTarget.checked)} /></div></Showcase>
    <Showcase title="Native radio submission and reset" description="Full-width options include a disabled choice and support native form submission and reset." code={`import { Grid2X2, List, Table2 } from 'lucide-react';\nimport { SegmentedControl, Button } from '@chartreuse/ui';\n\n<form onSubmit={event => {\n  event.preventDefault();\n  console.log(new FormData(event.currentTarget).get('layout'));\n}}>\n  <SegmentedControl label="Workspace layout" name="layout"\n    defaultValue="board" fullWidth options={[\n      { value: 'board', label: 'Board', icon: Grid2X2 },\n      { value: 'list', label: 'List', icon: List },\n      { value: 'table', label: 'Table', icon: Table2, disabled: true },\n    ]} />\n  <Button type="submit">Read form value</Button>\n  <Button type="reset" variant="secondary">Reset</Button>\n</form>`}><form className="segmented-control-demo-form" aria-label="Workspace layout example" onSubmit={event => { event.preventDefault(); setResult(String(new FormData(event.currentTarget).get('layout') || 'No selection')); }} onReset={() => setResult('')}>
      <SegmentedControl label="Workspace layout" name="layout" options={[{ value: 'board', label: 'Board', icon: Grid2X2 }, { value: 'list', label: 'List', icon: List }, { value: 'table', label: 'Table', icon: Table2, disabled: true }]} defaultValue="board" fullWidth hint="Native radio navigation skips the disabled view." />
      <div className="segmented-control-demo-actions"><Button type="submit" size="sm">Read form value</Button><Button type="reset" size="sm" variant="secondary">Reset</Button></div><p className="segmented-control-demo-status" role="status" aria-atomic="true">{result ? <>Submitted layout: <strong>{result}</strong></> : 'Change the view, then read the selected form value.'}</p>
    </form></Showcase>
  </ExampleGallery>;
}
