import { useState } from 'react';
import { Button } from '../system/components';
import { NumberInput } from '../system/NumberInput';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './number-input-demo.css';

const fullWidthRow = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };

export function NumberInputDemo() {
  const [attempts, setAttempts] = useState<number | null>(3);
  const [amount, setAmount] = useState<number | null>(1.5);
  const [result, setResult] = useState('');
  return <ExampleGallery className="number-input-demo">
    <Showcase title="Number input sizes" description="Use the same size on a number input and button. The default is md."
      code={`import { Button, NumberInput } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

export function NumberInputSizes() {
  return <div style={{ display: 'grid', gap: 'var(--cr-space-4)' }}>
    {(['sm', 'md', 'lg'] as const).map(size => (
      <form key={size} onSubmit={event => event.preventDefault()} style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 'var(--cr-space-3)',
      }}>
        <div style={{ flex: '1 1 11rem', minInlineSize: 0 }}>
          <NumberInput size={size} label={'Quantity (' + size + ')'} name="quantity" defaultValue={3} min={0} />
        </div>
        <Button size={size} type="reset" variant="secondary" style={{ flex: '0 0 5.5rem' }}>Reset</Button>
      </form>
    ))}
  </div>;
}`}>
      <div style={{ display: 'grid', gap: 'var(--cr-space-4)', inlineSize: 'min(100%, 520px)' }}>
        {(['sm', 'md', 'lg'] as const).map(size => (
          <form key={size} onSubmit={event => event.preventDefault()} style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 'var(--cr-space-3)',
          }}>
            <div style={{ flex: '1 1 11rem', minInlineSize: 0 }}>
              <NumberInput size={size} label={`Quantity (${size})`} name="quantity" defaultValue={3} min={0} />
            </div>
            <Button size={size} type="reset" variant="secondary" style={{ flex: '0 0 5.5rem' }}>Reset</Button>
          </form>
        ))}
      </div>
    </Showcase>
    <Showcase title="Step controls on focus and hover" description="Focus reveals the step controls. Hover expands the targeted step button within the input." code={`import { useState } from 'react';\nimport { NumberInput } from '@chartreuse/ui';\n\nfunction AttemptsExample() {\n  const [attempts, setAttempts] = useState<number | null>(3);\n  return <NumberInput label="Retry attempts" name="attempts"\n    min={0} max={10} value={attempts} onValueChange={setAttempts}\n    hint="Enter a value from 0 to 10." />;\n}`}><div className="number-input-demo-field"><NumberInput label="Retry attempts" name="attempts" min={0} max={10} value={attempts} onValueChange={setAttempts} hint="Enter a value from 0 to 10." /><Text size="body">Current value: <Text bold>{attempts === null ? 'Empty' : attempts}</Text></Text></div></Showcase>
    <Showcase title="Decimal steps and native form values" description="Use quarter-step increments and submit or reset the native named inputs." code={`import { NumberInput, Button } from '@chartreuse/ui';\n\n<form onSubmit={event => {\n  event.preventDefault();\n  console.log(Object.fromEntries(new FormData(event.currentTarget)));\n}}>\n  <NumberInput label="Interval" name="interval" min={0} max={5}\n    step={0.25} defaultValue={1.5} required />\n  <NumberInput label="Optional limit" name="limit" min={1}\n    placeholder="No limit" />\n  <Button type="submit">Read form values</Button>\n  <Button type="reset" variant="secondary">Reset</Button>\n</form>`}><form className="number-input-demo-form" aria-label="Number input example" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setResult(`Interval: ${data.get('interval') || 'empty'} · Limit: ${data.get('limit') || 'empty'}`); }} onReset={() => setResult('')}><div className="number-input-demo-fields"><NumberInput label="Interval" name="interval" min={0} max={5} step={0.25} defaultValue={1.5} required hint="Quarter steps from 0 to 5." /><NumberInput label="Optional limit" name="limit" min={1} placeholder="No limit" hint="An empty optional field stays empty." /></div><div className="number-input-demo-actions"><Button type="submit" size="sm">Read form values</Button><Button type="reset" size="sm" variant="secondary">Reset</Button></div><Text size="body" className="number-input-demo-result" role="status" aria-atomic="true">{result || 'The form reads the values of the native number inputs.'}</Text></form></Showcase>
    <Showcase title="Read-only, disabled, and unrestricted decimal inputs" description="Compare read-only and disabled inputs with an unrestricted decimal input." code={`import { useState } from 'react';\nimport { NumberInput } from '@chartreuse/ui';\n\nfunction AvailabilityExamples() {\n  const [amount, setAmount] = useState<number | null>(${amount === null ? 'null' : amount});\n  return <>\n    <NumberInput label="Read-only amount" value={3} readOnly />\n    <NumberInput label="Disabled amount" defaultValue={3} disabled />\n    <NumberInput label="Any decimal" step="any" value={amount}\n      onValueChange={setAmount}\n      hint="Step controls are hidden when step is any." />\n  </>;\n}`}><div className="number-input-demo-fields"><NumberInput label="Read-only amount" value={3} readOnly /><NumberInput label="Disabled amount" defaultValue={3} disabled /><NumberInput label="Any decimal" step="any" value={amount} onValueChange={setAmount} hint="Step controls are hidden when step is any." /></div></Showcase>
    <Showcase title="Full-width number input" description="In a flex row, a field is only as wide as its control. Set fullWidth to fill the remaining space." code={"import { Button, NumberInput } from '@chartreuse/ui';\n\nconst rowStyle = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };\n\n<>\n  <div style={rowStyle}>\n    <NumberInput label=\"Seats (default width)\" name=\"seats\" defaultValue={5} min={1} />\n    <Button variant=\"secondary\">Update</Button>\n  </div>\n  <div style={rowStyle}>\n    <NumberInput label=\"Seats (fullWidth)\" name=\"seats\" defaultValue={5} min={1} fullWidth />\n    <Button variant=\"secondary\">Update</Button>\n  </div>\n</>"}>
      <div style={fullWidthRow}><NumberInput label="Seats (default width)" name="seats" defaultValue={5} min={1} /><Button variant="secondary">Update</Button></div>
      <div style={fullWidthRow}><NumberInput label="Seats (fullWidth)" name="seats" defaultValue={5} min={1} fullWidth /><Button variant="secondary">Update</Button></div>
    </Showcase>
  </ExampleGallery>;
}
