import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '../system/components';
import { Slider } from '../system/Slider';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './slider-demo.css';

const fullWidthRow = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };

export function SliderDemo() {
  const [stroke, setStroke] = useState(1.5);
  const [duration, setDuration] = useState(15);
  const [saved, setSaved] = useState<string | null>(null);
  return <ExampleGallery className="slider-demo">
    <Showcase title="Controlled values with half-pixel steps" description="Update the SVG stroke with a controlled range value." code={`import { useState } from 'react';\nimport { Slider } from '@chartreuse/ui';\n\nfunction StrokeExample() {\n  const [stroke, setStroke] = useState(${stroke});\n  return <Slider label="Stroke" min={0.5} max={3} step={0.5}\n    value={stroke} onValueChange={setStroke}\n    formatValue={value => value + 'px'} />;\n}`}><section className="slider-demo-primary"><Slider label="Stroke" min={0.5} max={3} step={0.5} value={stroke} onValueChange={setStroke} formatValue={value => `${value}px`} hint="Use the arrow keys for half-pixel steps." /><div className="slider-demo-stroke" aria-hidden="true"><svg viewBox="0 0 140 48" fill="none"><path d="M10 24h120m-14-12 14 12-14 12" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" /></svg></div></section></Showcase>
    <Showcase title="Native form submission and reset" description="An uncontrolled slider submits its named value and resets to its default." code={`import { Slider, Button } from '@chartreuse/ui';\n\n<form onSubmit={event => {\n  event.preventDefault();\n  console.log(new FormData(event.currentTarget).get('confidence'));\n}}>\n  <Slider label="Review confidence" name="confidence"\n    min={0} max={100} step={5} defaultValue={65}\n    formatValue={value => value + '%'} />\n  <Button type="reset" variant="secondary">Reset</Button>\n  <Button type="submit">Save preference</Button>\n</form>`}><form className="slider-demo-form" aria-label="Slider preference example" onSubmit={event => { event.preventDefault(); setSaved(`${new FormData(event.currentTarget).get('confidence')}%`); }} onReset={() => setSaved(null)}>
      <Slider label="Review confidence" name="confidence" min={0} max={100} step={5} defaultValue={65} formatValue={value => `${value}%`} hint="This uncontrolled range participates in the form and resets to 65%." />
      <div className="slider-demo-actions"><Button type="reset" variant="secondary" size="sm" icon={RotateCcw}>Reset</Button><Button type="submit" size="sm" icon={Check}>Save preference</Button></div>
      <Text size="body" className="slider-demo-saved" role="status">{saved ? `Saved confidence: ${saved}.` : 'Save a preference to see its submitted value.'}</Text>
    </form></Showcase>
    <Showcase title="Value formatting, validation, and disabled state" description="Format value text, display an application validation message, and disable a managed preference." code={`import { useState } from 'react';\nimport { Slider } from '@chartreuse/ui';\n\nfunction StateExamples() {\n  const [duration, setDuration] = useState(${duration});\n  return <>\n    <Slider label="Session length" min={5} max={60} step={5}\n      value={duration} onValueChange={setDuration}\n      formatValue={value => value + ' minutes'}\n      error={duration < 20 ? 'Choose at least 20 minutes for this example.' : undefined} />\n    <Slider label="Managed preference" defaultValue={40} disabled\n      formatValue={value => value + '%'} />\n  </>;\n}`}><div className="slider-demo-states"><Slider label="Session length" min={5} max={60} step={5} value={duration} onValueChange={setDuration} formatValue={value => `${value} minutes`} error={duration < 20 ? 'Choose at least 20 minutes for this example.' : undefined} hint="Validation requires a session of at least 20 minutes." /><Slider label="Managed preference" defaultValue={40} formatValue={value => `${value}%`} disabled hint="This setting is managed by the workspace." /></div></Showcase>
    <Showcase title="Full-width slider" description="In a flex row, a field is only as wide as its control. Set fullWidth to fill the remaining space." code={"import { Button, Slider } from '@chartreuse/ui';\n\nconst rowStyle = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };\n\n<>\n  <div style={rowStyle}>\n    <Slider label=\"Volume (default width)\" name=\"volume\" defaultValue={40} />\n    <Button variant=\"secondary\">Mute</Button>\n  </div>\n  <div style={rowStyle}>\n    <Slider label=\"Volume (fullWidth)\" name=\"volume\" defaultValue={40} fullWidth />\n    <Button variant=\"secondary\">Mute</Button>\n  </div>\n</>"}>
      <div style={fullWidthRow}><Slider label="Volume (default width)" name="volume" defaultValue={40} /><Button variant="secondary">Mute</Button></div>
      <div style={fullWidthRow}><Slider label="Volume (fullWidth)" name="volume" defaultValue={40} fullWidth /><Button variant="secondary">Mute</Button></div>
    </Showcase>
  </ExampleGallery>;
}
