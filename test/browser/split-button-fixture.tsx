import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Play, Sparkles } from 'lucide-react';
import { Button, MessageComposer, Select, SplitButton } from '../../src/system';

const variants = ['primary', 'secondary', 'accent', 'ghost', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const runs = [{ value: 'tests', label: 'Run tests' }, { value: 'lint', label: 'Run lint' }];
const row = { display: 'flex', alignItems: 'center', gap: 12 } as const;

function Fixture() {
  const [run, setRun] = useState('tests');
  const [clicks, setClicks] = useState(0);
  const [model, setModel] = useState('opus');
  return (
    <main style={{ display: 'grid', gap: 24, padding: 24, justifyItems: 'start' }}>
      <h1>Split button fixture</h1>
      {variants.map(variant => (
        <div key={variant} style={row} data-testid={`variant-${variant}`}>
          <SplitButton variant={variant} icon={Play} menuLabel={`${variant} options`} options={runs}>Run</SplitButton>
          <SplitButton variant={variant} icon={Play} menuLabel={`${variant} options, action disabled`} options={runs} disabled>Run</SplitButton>
          <SplitButton variant={variant} icon={Play} menuLabel={`${variant} options, menu disabled`} options={runs} menuDisabled>Run</SplitButton>
        </div>
      ))}
      {sizes.map(size => (
        <div key={size} style={row} data-testid={`size-${size}`}>
          <Button variant="secondary" size={size}>Cancel</Button>
          <SplitButton size={size} variant="secondary" menuLabel={`${size} options`} options={runs}>Send</SplitButton>
        </div>
      ))}
      <div style={row} data-testid="built-in">
        <SplitButton menuLabel="Run target" options={runs} value={run} onValueChange={setRun} onClick={() => setClicks(clicks + 1)}>
          {runs.find(option => option.value === run)?.label}
        </SplitButton>
        <output data-testid="built-in-state">{run}:{clicks}</output>
      </div>
      <div style={{ ...row, marginInlineStart: 200 }} data-testid="custom">
        <Button variant="secondary">Post reply</Button>
        <SplitButton variant="secondary" icon={Sparkles} menuLabel={`Agent for this request: ${model}`}
          content={({ close }) => <div style={{ display: 'grid', gap: 8, inlineSize: 240 }}>
            <Select label="Model" size="sm" value={model} onChange={event => setModel(event.currentTarget.value)}>
              <option value="opus">Opus</option>
              <option value="sonnet">Sonnet</option>
            </Select>
            <Button size="sm" onClick={close}>Done</Button>
          </div>}>
          Ask agent
        </SplitButton>
      </div>
      <div style={{ inlineSize: 520 }} data-testid="composer">
        <MessageComposer label="Comment" sendLabel="Post comment" sendSize="sm" hint={null} onSend={() => {}}
          controls={<SplitButton size="sm" variant="secondary" icon={Sparkles} menuLabel="Agent: Claude" options={runs}>Ask agent</SplitButton>} />
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
