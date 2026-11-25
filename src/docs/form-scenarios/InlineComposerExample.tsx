import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CommentThread, MessageComposer, SplitButton } from '../../system';
import type { ThreadComment } from '../../system';

const agents = [{ value: 'codex', label: 'Codex' }, { value: 'claude', label: 'Claude Code' }];
const comment: ThreadComment = {
  id: '4', sender: 'Agent', senderTone: 'info', label: 'Comment #4', reference: '#4',
  time: { label: 'Nov 25, 5:52 PM', shortLabel: '5:52 PM' },
  body: 'Corrected the p95 figure in the discovery report: 715 ms on the seeded board, not 1.1 s.',
};

export function InlineReplyThread() {
  const [draft, setDraft] = useState('');
  const [agent, setAgent] = useState('codex');
  const [replies, setReplies] = useState<ThreadComment[]>([]);
  const post = (body: string, asked?: string) => setReplies(previous => [...previous, {
    id: String(previous.length + 5), sender: 'Human', senderTone: 'success', reference: `#${previous.length + 5}`,
    time: { label: 'Just now' }, meta: asked ? [`asked ${asked}`] : undefined, body,
  }]);
  const name = agents.find(option => option.value === agent)?.label;

  return <CommentThread comment={comment} replies={replies} composer={
    <MessageComposer layout="inline" label="Reply to #4" placeholder="Reply…" sendLabel="Post reply" sendSize="sm"
      value={draft} onValueChange={setDraft} onSend={message => { post(message); setDraft(''); }}
      controls={<SplitButton variant="secondary" size="sm" icon={Sparkles} iconOnly="narrow" disabled={!draft.trim()}
        onClick={() => { post(draft.trim(), name); setDraft(''); }}
        menuLabel={`Agent for this request: ${name}`} options={agents} value={agent} onValueChange={setAgent} checkmark>
        Ask agent
      </SplitButton>} />
  } />;
}
