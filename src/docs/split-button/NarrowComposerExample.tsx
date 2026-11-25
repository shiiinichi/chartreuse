import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { MessageComposer, SplitButton, Text } from '../../system';

export function NarrowComposerExample() {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');
  return <div style={{ display: 'grid', gap: 'var(--cr-space-3)', inlineSize: 300, maxInlineSize: '100%' }}>
    <MessageComposer layout="inline" label="Reply" placeholder="Reply…" sendSize="sm" hint={null}
      value={draft} onValueChange={setDraft} onSend={message => { setSent(message); setDraft(''); }}
      controls={<SplitButton size="sm" variant="secondary" icon={Sparkles} iconOnly="narrow" disabled={!draft.trim()}
        onClick={() => { setSent(`${draft} (asked the agent)`); setDraft(''); }}
        menuLabel="Agent for this request: Codex" content={<Text size="small">Harness, model, and thinking go here.</Text>}>
        Ask agent
      </SplitButton>} />
    <Text size="small" display="block" role="status">{sent && `Posted: ${sent}`}</Text>
  </div>;
}
