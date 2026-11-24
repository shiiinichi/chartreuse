import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { MessageComposer, SplitButton, Text } from '../../system';

const agents = [
  { value: 'claude', label: 'Claude' },
  { value: 'codex', label: 'Codex' },
];

export function ComposerExample() {
  const [draft, setDraft] = useState('');
  const [agent, setAgent] = useState('claude');
  const [sent, setSent] = useState('');
  const name = agents.find(option => option.value === agent)?.label;

  return <div style={{ display: 'grid', gap: 'var(--cr-space-3)' }}>
    <MessageComposer label="Comment" sendLabel="Post comment" sendSize="sm" rows={3} hint={null}
      value={draft} onValueChange={setDraft} onSend={message => setSent(message)}
      controls={<SplitButton size="sm" variant="secondary" icon={Sparkles} disabled={!draft.trim()}
        onClick={() => { setSent(`${draft} (asked ${name})`); setDraft(''); }}
        menuLabel={`Agent: ${name}`} options={agents} value={agent} onValueChange={setAgent} checkmark>
        Ask agent
      </SplitButton>} />
    <Text size="small" display="block" role="status">{sent && `Posted: ${sent}`}</Text>
  </div>;
}
