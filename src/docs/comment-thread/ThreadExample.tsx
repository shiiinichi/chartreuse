import { useEffect, useState } from 'react';
import { Copy, Pencil, Sparkles, Trash2 } from 'lucide-react';
import { CommentThread, Menu, MessageComposer, RunStatus, SplitButton, Text } from '../../system';
import type { ThreadComment } from '../../system';

const agents = [{ value: 'codex', label: 'Codex' }, { value: 'claude', label: 'Claude Code' }];

export function ThreadExample() {
  const [draft, setDraft] = useState('');
  const [agent, setAgent] = useState('codex');
  const [status, setStatus] = useState('');
  const [stopped, setStopped] = useState(false);
  const [elapsed, setElapsed] = useState(18);
  useEffect(() => {
    if (stopped) return;
    const timer = window.setInterval(() => setElapsed(seconds => (seconds + 1) % 60), 1000);
    return () => window.clearInterval(timer);
  }, [stopped]);
  const actions = (number: number) => <Menu size="sm" label={`More actions for #${number}`} items={[
    { id: 'edit', label: 'Edit', icon: Pencil, onSelect: () => setStatus(`Editing #${number}`) },
    { id: 'copy', label: 'Copy link', icon: Copy, onSelect: () => setStatus(`Copied a link to #${number}`) },
    { type: 'separator' },
    { id: 'delete', label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => setStatus(`Asked to delete #${number}`) },
  ]} />;
  const reply = (number: number, body: string, extra?: Partial<ThreadComment>): ThreadComment => ({
    id: String(number), sender: 'Agent', senderTone: 'info', label: `Reply #${number}`, reference: `#${number}`, meta: ['Codex'],
    time: { label: `Nov 25, 5:${40 + number} PM`, shortLabel: `5:${40 + number} PM` }, actions: actions(number), body, ...extra,
  });
  const comment: ThreadComment = {
    id: '5', sender: 'Human', senderTone: 'success', label: 'Comment #5', reference: '#5', meta: ['asked Codex'],
    time: { label: 'Nov 25, 6:10 PM', shortLabel: '6:10 PM', title: 'November 25, 2026 at 6:10:16 PM', dateTime: '2026-11-25T18:10:16' },
    actions: actions(5), body: 'Check the spec created by Codex.',
  };
  const replies = [
    reply(1, 'Reading the spec now.'),
    reply(2, 'Found the discovery report it cites.'),
    reply(3, [
      '**Changes suggested.** SPEC-1 matches the verified discovery and the corrections from #3 and #4. Five gaps would leave an implementer guessing.',
      '', '### What checks out', '', '- The findings paragraph matches the discovery report.', '- REQ-2 matches `Boards.thread_preview`.',
      '', '### Gaps', '', '1. No error state for a failed load.', '2. No limit on the preview length.', '3. No owner for the migration.',
      '4. The p95 target has no measurement method.', '5. The rollout has no flag.',
    ].join('\n'), { maxLines: 6, expandLabel: 'Show full reply' }),
    reply(5, 'Two of the five gaps are already answered in #3; the other three still need a decision.', {
      label: 'Your ask #4 and reply #5', meta: ['Claude Code'],
      ask: { id: '4', anchorId: 'thread-example-4', label: 'Your ask #4', agent: 'Claude Code · opus · Medium', reference: '#4',
        time: { label: 'Nov 25, 5:44 PM', shortLabel: '5:44 PM' }, actions: actions(4), body: 'Check the review from Codex against #3.' },
    }),
    reply(7, '', {
      label: 'Your ask #6 and pending reply', body: undefined,
      content: stopped ? <Text size="small" display="block">Stopped.</Text> : <RunStatus label={<>Reading <code>docs/spec-1.md</code></>} title="Reading docs/spec-1.md"
        elapsed={`0:${String(elapsed).padStart(2, '0')}`} onStop={() => { setStopped(true); setStatus('Stopped the agent reply to #6'); }} />,
      ask: { id: '6', label: 'Your ask #6', agent: 'Codex · gpt-5.2 · High', reference: '#6', time: { label: 'Nov 25, 5:52 PM', shortLabel: '5:52 PM' },
        body: 'Take the three open gaps and propose a default for each: page size for history, the cold-start target on the seeded board, and what the chat panel shows when the store fails to load.' },
    }),
  ];
  const name = agents.find(option => option.value === agent)?.label;

  return <div style={{ display: 'grid', gap: 'var(--cr-space-3)' }}>
    <CommentThread comment={comment} replies={replies} repliesLabel="Replies to #5" composer={
      <MessageComposer layout="inline" label="Reply to #5" placeholder="Reply…" sendSize="sm" hint="Type # for comments"
        value={draft} onValueChange={setDraft} onSend={message => { setStatus(`Posted: ${message}`); setDraft(''); }}
        controls={<SplitButton variant="secondary" size="sm" icon={Sparkles} iconOnly="narrow" disabled={!draft.trim()}
          onClick={() => { setStatus(`Posted and asked ${name}: ${draft}`); setDraft(''); }}
          menuLabel={`Agent for this request: ${name}`} options={agents} value={agent} onValueChange={setAgent} checkmark>Ask agent</SplitButton>} />
    } />
    <Text size="small" display="block" role="status">{status}</Text>
  </div>;
}
