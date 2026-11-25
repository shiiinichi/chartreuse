import { useState } from 'react';
import { CommentThread, MessageComposer } from '../../system';
import type { ThreadComment } from '../../system';

const comment: ThreadComment = {
  id: '2', sender: 'Human', senderTone: 'success', label: 'Comment #2', reference: '#2', meta: ['edited'],
  time: { label: 'Nov 24, 4:02 PM', shortLabel: '4:02 PM' }, body: 'Run discovery on chat history loading before we plan anything.',
};
const replies: ThreadComment[] = [1, 2, 3].map(index => ({
  id: `2.${index}`, sender: 'Agent', senderTone: 'info', reference: `#${2 + index}`,
  time: { label: `Nov 24, 5:${20 + index * 10} PM`, shortLabel: `5:${20 + index * 10} PM` }, body: `Discovery step ${index} is done.`,
}));

export function CollapsedExample() {
  const [collapsed, setCollapsed] = useState(true);
  const [draft, setDraft] = useState('');
  return <CommentThread comment={comment} replies={replies} collapsed={collapsed} onCollapsedChange={setCollapsed}
    composer={<MessageComposer layout="inline" label="Reply to #2" placeholder="Reply…" sendSize="sm" hint={null}
      value={draft} onValueChange={setDraft} onSend={() => setDraft('')} />} />;
}
