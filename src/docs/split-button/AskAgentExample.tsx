import { useId, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button, Flex, Select, SplitButton, Text } from '../../system';

const models = { claude: ['Opus', 'Sonnet', 'Haiku'], codex: ['GPT-5', 'GPT-5 mini'] } as const;
type Harness = keyof typeof models;

export function AskAgentExample() {
  const hintId = useId();
  const [harness, setHarness] = useState<Harness>('claude');
  const [model, setModel] = useState<string>('Opus');
  const [effort, setEffort] = useState('High');
  const [status, setStatus] = useState('');
  const summary = `${harness === 'claude' ? 'Claude' : 'Codex'} · ${model} · ${effort}`;

  return <Flex direction="column" gap={3}>
    <Flex wrap gap={2} align="center">
      <Button variant="secondary" onClick={() => setStatus('Reply posted.')}>Post reply</Button>
      <SplitButton variant="secondary" icon={Sparkles} title={`Post and ask ${summary}`}
        onClick={() => setStatus(`Reply posted. Asked ${summary}.`)}
        menuLabel={`Agent for this request: ${summary}`}
        content={<Flex direction="column" gap={3} role="group" aria-label="Agent for this request"
          style={{ inlineSize: 'min(18rem, calc(100dvw - 3rem))' }}>
          <Select label="Harness" size="sm" value={harness} aria-describedby={hintId} onChange={event => {
            const next = event.currentTarget.value as Harness;
            setHarness(next);
            setModel(models[next][0]);
          }}>
            <option value="claude">Claude</option>
            <option value="codex">Codex</option>
          </Select>
          <Select label="Model" size="sm" value={model} onChange={event => setModel(event.currentTarget.value)}>
            {models[harness].map(name => <option key={name} value={name}>{name}</option>)}
          </Select>
          <Select label="Thinking" size="sm" value={effort} onChange={event => setEffort(event.currentTarget.value)}>
            {['Low', 'Medium', 'High'].map(level => <option key={level} value={level}>{level}</option>)}
          </Select>
          <Text size="small" display="block" id={hintId}>The agent replies in this thread.</Text>
        </Flex>}>
        Ask agent
      </SplitButton>
    </Flex>
    <Text size="small" display="block" role="status">{status}</Text>
  </Flex>;
}
