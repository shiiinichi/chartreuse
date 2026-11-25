import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Copy, Pencil, Sparkles, Trash2 } from 'lucide-react';
import { Button, CommentThread, Menu, MessageComposer, RunStatus, SplitButton } from '../../src/system';
import type { ThreadComment } from '../../src/system';
import '../../src/system/styles.css';

const log: string[] = [];
(window as unknown as { menuLog: string[] }).menuLog = log;

const actions = (id: string) => <Menu size="sm" label={`More actions for #${id}`} items={[
  { id: 'edit', label: 'Edit', icon: Pencil, onSelect: () => log.push(`edit ${id}`) },
  { id: 'copy', label: 'Copy link', icon: Copy, onSelect: () => log.push(`copy ${id}`) },
  { id: 'archive', label: 'Archive', disabled: true, onSelect: () => log.push(`archive ${id}`) },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => log.push(`delete ${id}`) },
]} />;

const longReply = ['**Changes suggested.** SPEC-1 matches the verified discovery and the corrections from #3 and #4.', '', '### What checks out', '',
  ...Array.from({ length: 12 }, (_, index) => `- Finding ${index + 1}: the numbers match the discovery report.`), '', '[Last link](https://example.com)'].join('\n');

const comment: ThreadComment = { id: '5', sender: 'Human', senderTone: 'success', label: 'Comment #5', reference: '#5',
  time: { label: 'Nov 25, 6:10 PM', shortLabel: '6:10 PM', title: '11/25/2026, 6:10:16 PM', dateTime: '2026-11-25T18:10:16' },
  actions: actions('5'), body: 'Check spec created by Codex.' };
const replies: ThreadComment[] = [3, 4, 6, 7].map(number => ({ id: String(number), sender: 'Agent', senderTone: 'info', label: `Reply #${number}`, reference: `#${number}`,
  time: { label: `Nov 25, 5:${30 + number} PM`, shortLabel: `5:${30 + number} PM` }, meta: ['Codex'], actions: actions(String(number)),
  body: number === 6 ? longReply : `Reply number ${number}.`, maxLines: 6, expandLabel: 'Show full reply' }));

const longAsk = 'Take the three open gaps from #8 and propose a default for each: page size for history, the cold-start target on the seeded board, and what the chat panel shows when the store fails to load.';
const askReplies: ThreadComment[] = [
  { id: '8', sender: 'Agent', senderTone: 'info', label: 'Your ask #7 and reply #8', reference: '#8', time: { label: 'Nov 25, 6:47 PM', shortLabel: '6:47 PM' }, actions: actions('8'),
    body: 'Two of its five gaps are already answered.',
    ask: { id: '7', anchorId: 'comment-7', label: 'Your ask #7', agent: 'Claude Code · opus · Medium', reference: '#7', time: { label: 'Nov 25, 6:46 PM', shortLabel: '6:46 PM' }, actions: actions('ask 7'), body: 'Check review from Claude.' } },
  { id: '10', sender: 'Agent', senderTone: 'info', label: 'Your ask #9 and pending reply', content: <RunStatus data-testid="running" label={<>Reading <code>docs/spec-1.md</code></>} title="Reading docs/spec-1.md" elapsed="0:18" onStop={() => log.push('stop 10')} />,
    ask: { id: '9', label: 'Your ask #9', agent: 'Codex · gpt-5.2 · High', reference: '#9', time: { label: 'Nov 25, 6:52 PM', shortLabel: '6:52 PM' }, body: longAsk } },
];

function Thread({ width, testId }: { width: number; testId: string }) {
  const [draft, setDraft] = useState('');
  return <div style={{ inlineSize: width }} data-testid={testId}>
    <CommentThread comment={comment} replies={replies} composer={<MessageComposer layout="inline" label="Reply to #5" placeholder="Reply…" hint="Type # for comments"
      value={draft} onValueChange={setDraft} onSend={() => setDraft('')} sendSize="sm"
      controls={<SplitButton variant="secondary" size="sm" icon={Sparkles} iconOnly="narrow" menuLabel="Agent for this request: Codex" content="Agent settings">Ask agent</SplitButton>} />} />
  </div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode>
  <main style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 24, alignItems: 'flex-start' }}>
    <Thread width={460} testId="wide" />
    <Thread width={320} testId="narrow" />
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ inlineSize: 460 }} data-testid="asks-wide"><CommentThread comment={{ ...comment, meta: ['asked Codex'] }} replies={askReplies} visibleReplies={5} /></div>
      <div style={{ inlineSize: 320 }} data-testid="asks-narrow"><CommentThread comment={comment} replies={askReplies} visibleReplies={5} /></div>
    </div>
    <div style={{ inlineSize: 320, display: 'grid', gap: 16 }}>
      <CommentThread data-testid="highlighted" highlighted comment={{ ...comment, id: '1', label: 'Comment #1', reference: '#1', actions: undefined }} />
      <CommentThread data-testid="deleting" footerTone="danger" comment={{ ...comment, id: '4', label: 'Comment #4', reference: '#4', actions: undefined }}
        footer={<><p data-testid="confirm-text" style={{ flex: '1 1 120px' }}><strong>Delete #4?</strong> Its 2 replies stay visible.</p><Button size="sm" variant="secondary">Keep</Button><Button size="sm" variant="danger">Delete</Button></>} />
      <button type="button" data-testid="outside">Outside</button>
    </div>
  </main>
</StrictMode>);
