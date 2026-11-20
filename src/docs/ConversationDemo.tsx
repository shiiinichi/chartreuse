import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Check, MessageSquare, RotateCcw } from 'lucide-react';
import { Button, Switch } from '../system/components';
import { AgentActivity } from '../system/AgentActivity';
import type { AgentActivityEvent } from '../system/AgentActivity';
import { Conversation } from '../system/Conversation';
import type { ConversationMessage } from '../system/Conversation';
import { Drawer } from '../system/Drawer';
import { MessageComposer } from '../system/MessageComposer';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './conversation-demo.css';

const initialReply = 'The workspace review is complete. The **task summary** matches the checklist.\n\n- Record review decisions in the task summary.\n- Store the supporting notes in `review-notes.md`.\n- Include verification steps for the next reviewer.\n\nExpand the activity group above to inspect the review command and its recorded output.';
const technicalReply = [
  'The **task summary** matches the recorded checklist. See `review-notes.md` for verification details.[^review]',
  '',
  '| Check | Result | Supporting context |',
  '| --- | --- | --- |',
  '| Task summary | Passed | The recorded checklist matches the expected result. |',
  '| Notes | Ready | Verification steps and expected results are recorded. |',
  '',
  '```tsx',
  'const message = { role: "agent", body: "The review is complete." };',
  '```',
  '',
  '[^review]: This content comes from a local fixture. It does not read a repository or contact an external service.',
].join('\n');

const reviewEvents: AgentActivityEvent[] = [
  { id: 'coordinator', kind: 'agent', title: 'Coordinator finished the review', status: 'completed', durationMs: 12400 },
  { id: 'notes', kind: 'command', title: 'Checked the supporting notes', status: 'completed', durationMs: 320, command: 'cat ./review-notes.md', output: 'Task summary checked.\nThe expected result is recorded.', exitCode: 0 },
];
const localReply = 'This reply comes from a local fixture.\n\n- Define the **expected result** in the task.\n- Record verification steps in `notes.md`.\n\n`MessageComposer` submits the message; `Conversation` renders the transcript.';
const responseEvents: AgentActivityEvent[] = [{ id: 'sample-response', kind: 'agent', title: 'Prepared a local sample response', status: 'completed' }];
const drawerReply = 'This local reply is appended to the drawer transcript. Record the **expected result** and verification steps in the task.';

function sampleActivity() {
  return <AgentActivity events={reviewEvents} />;
}

function initialMessages(): ConversationMessage[] {
  return [
    { id: 'user-1', role: 'user', sender: 'You', timeLabel: '10:51 AM', dateTime: '2026-11-18T10:51:00+08:00', body: 'Review the workspace checklist and record the findings in review-notes.md.' },
    { id: 'agent-1', role: 'agent', sender: 'Codex', timeLabel: '10:52 AM', dateTime: '2026-11-18T10:52:00+08:00', body: initialReply, activity: sampleActivity() },
  ];
}

/** Keep demo footnotes inside this preview instead of the documentation hash router. */
function followConversationFragment(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || !event.currentTarget.contains(link) || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
  const fragment = link.getAttribute('href')?.slice(1);
  if (!fragment) return;
  let id: string;
  try { id = decodeURIComponent(fragment); } catch { return; }
  const target = event.currentTarget.ownerDocument.getElementById(id);
  if (!(target instanceof HTMLElement) || !event.currentTarget.contains(target)) return;
  event.preventDefault();
  target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  if (!target.hasAttribute('tabindex') && !target.matches('a[href], button, input, select, textarea, summary, [contenteditable="true"]')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}

const fixtureSource = `const reviewEvents: AgentActivityEvent[] = ${JSON.stringify(reviewEvents, null, 2)};

const initialMessageData: ConversationMessage[] = ${JSON.stringify(initialMessages().map(message => ({ ...message, activity: undefined })), null, 2)};

function createInitialMessages(): ConversationMessage[] {
  return initialMessageData.map(message => message.id === 'agent-1'
    ? { ...message, activity: <AgentActivity events={reviewEvents} /> }
    : message);
}`;

const fragmentSource = `// Keep Markdown footnote links within this transcript instead of changing a host router.
function followConversationFragment(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || !event.currentTarget.contains(link) ||
      (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
  const fragment = link.getAttribute('href')?.slice(1);
  if (!fragment) return;
  let id: string;
  try { id = decodeURIComponent(fragment); } catch { return; }
  const target = event.currentTarget.ownerDocument.getElementById(id);
  if (!(target instanceof HTMLElement) || !event.currentTarget.contains(target)) return;
  event.preventDefault();
  target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  if (!target.hasAttribute('tabindex') && !target.matches(
    'a[href], button, input, select, textarea, summary, [contenteditable="true"]'
  )) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}`;

function conversationSource(technical: boolean) {
  return `import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { AgentActivity, Button, Conversation, MessageComposer, Switch, Text } from '@chartreuse/ui';
import type { AgentActivityEvent, ConversationMessage } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

${fixtureSource}

const technicalReply = ${JSON.stringify(technicalReply)};
const localReply = ${JSON.stringify(localReply)};
const responseEvents: AgentActivityEvent[] = ${JSON.stringify(responseEvents, null, 2)};

${fragmentSource}

export function TaskConversationExample() {
  const [messages, setMessages] = useState(createInitialMessages);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [technical, setTechnical] = useState(${technical});
  const nextId = useRef(1);
  const finishSend = useRef<(() => void) | null>(null);
  useEffect(() => () => { finishSend.current?.(); }, []);

  const sendMessage = (body: string) => {
    const id = nextId.current++;
    setMessages(previous => [...previous, {
      id: 'user-' + (id + 1), role: 'user', body, timeLabel: 'Just now',
    }]);
    setPending(true);
    return new Promise<void>(resolve => { finishSend.current = resolve; });
  };
  const completeReply = () => {
    if (!finishSend.current) return;
    const id = nextId.current++;
    setMessages(previous => [...previous, {
      id: 'agent-' + (id + 1), role: 'agent', sender: 'Codex',
      body: localReply, timeLabel: 'Just now',
      activity: <AgentActivity events={responseEvents} defaultOpen={false} />,
    }]);
    setPending(false);
    finishSend.current();
    finishSend.current = null;
  };
  const reset = () => {
    finishSend.current?.();
    finishSend.current = null;
    setMessages(createInitialMessages());
    setDraft(''); setPending(false); setTechnical(false);
  };

  return <div onClick={followConversationFragment} style={{ maxWidth: 760 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12, paddingBottom: 20, marginBottom: 20,
      borderBottom: '1px solid var(--cr-color-border)' }}>
      <Switch label="Show code, table, and footnote example" checked={technical}
        onChange={event => setTechnical(event.target.checked)} />
      <Button variant="ghost" size="sm" icon={RotateCcw} onClick={reset}>
        Reset conversation
      </Button>
    </div>
    <Conversation label="Task conversation example" announce
      messages={messages.map(message => message.id === 'agent-1' && technical
        ? { ...message, body: technicalReply } : message)}
      pending={pending} pendingLabel="Codex is preparing a local sample reply…" />
    <div style={{ marginTop: 32, paddingTop: 24,
      borderTop: '1px solid var(--cr-color-border)' }}>
      <MessageComposer label="Message in the conversation example" rows={3}
        value={draft} onValueChange={setDraft} onSend={sendMessage}
        hint="Messages stay in this local example."
        placeholder="Add a note to this conversation…" />
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',
        gap: 12, marginTop: 12 }}>
        <Button variant="secondary" size="sm" icon={Check}
          disabled={!pending} onClick={completeReply}>Complete sample reply</Button>
        <Text size="body" style={{ flex: '1 1 220px', margin: 0, fontSize: 12, lineHeight: 1.75,
          color: 'var(--cr-color-muted)' }}>
          Send a message, then complete the sample reply. No provider or backend is contacted.
        </Text>
      </div>
    </div>
  </div>;
}`;
}

function emptyConversationSource(pending: boolean) {
  return `import { useState } from 'react';
import { Conversation, Switch } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

export function EmptyConversationExample() {
  const [pending, setPending] = useState(${pending});
  return <div style={{ maxWidth: 760 }}>
    <div style={{ paddingBottom: 20, marginBottom: 20,
      borderBottom: '1px solid var(--cr-color-border)' }}>
      <Switch label="Show pending response" checked={pending}
        onChange={event => setPending(event.target.checked)} />
    </div>
    <Conversation messages={[]} pending={pending} label="Empty conversation example"
      emptyMessage="No messages in this conversation." />
  </div>;
}`;
}

const drawerSource = `import { useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { AgentActivity, Button, Conversation, Drawer, MessageComposer, Text } from '@chartreuse/ui';
import type { AgentActivityEvent, ConversationMessage } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

${fixtureSource}

export function ConversationDrawerExample() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(createInitialMessages);
  const nextId = useRef(1);
  const sendMessage = (body: string) => {
    const id = nextId.current++;
    setMessages(previous => [...previous,
      { id: 'drawer-user-' + id, role: 'user', body, timeLabel: 'Just now' },
      { id: 'drawer-agent-' + id, role: 'agent', sender: 'Codex',
        body: ${JSON.stringify(drawerReply)}, timeLabel: 'Just now' },
    ]);
  };
  return <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
    <Text size="body" style={{ margin: 0, color: 'var(--cr-color-muted)', fontSize: 12, lineHeight: 1.75 }}>
      The transcript has no fixed height or scroll rules. Its host can place the composer
      in a persistent drawer footer.
    </Text>
    <Button variant="secondary" icon={MessageSquare} onClick={() => setOpen(true)}>
      Open conversation drawer
    </Button>
    <Drawer open={open} onOpenChange={setOpen} mode="modal" width={480} maxWidth={640}
      title="Orchestrator" description="Task conversation with a persistent message composer."
      footer={<MessageComposer label="Message in the conversation drawer" rows={2}
        hint="Messages stay in this local example." onSend={sendMessage} />}>
      <Conversation messages={messages} label="Orchestrator conversation in drawer" />
    </Drawer>
  </div>;
}`;

function ConversationDrawerExample() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const nextId = useRef(1);
  return <div className="conversation-drawer-demo"><Text size="body">The transcript has no fixed height or scroll rules. Its host can place the composer in a persistent drawer footer.</Text><Button variant="secondary" icon={MessageSquare} onClick={() => setOpen(true)}>Open conversation drawer</Button>
    <Drawer open={open} onOpenChange={setOpen} mode="modal" width={480} maxWidth={640} title="Orchestrator" description="Task conversation with a persistent message composer." footer={<MessageComposer label="Message in the conversation drawer" hint="Messages stay in this local example." rows={2} onSend={body => {
      const id = nextId.current++;
      setMessages(previous => [...previous, { id: `drawer-user-${id}`, role: 'user', body, timeLabel: 'Just now' }, { id: `drawer-agent-${id}`, role: 'agent', sender: 'Codex', body: drawerReply, timeLabel: 'Just now' }]);
    }} />}><Conversation messages={messages} label="Orchestrator conversation in drawer" /></Drawer>
  </div>;
}

export function ConversationDemo() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [technical, setTechnical] = useState(false);
  const [emptyPending, setEmptyPending] = useState(false);
  const nextId = useRef(1);
  const finishSend = useRef<(() => void) | null>(null);
  useEffect(() => () => { finishSend.current?.(); }, []);
  const finishReply = () => {
    if (!finishSend.current) return;
    const id = nextId.current++;
    setMessages(previous => [...previous, { id: `agent-${id + 1}`, role: 'agent', sender: 'Codex', body: localReply, timeLabel: 'Just now', activity: <AgentActivity events={responseEvents} defaultOpen={false} /> }]);
    setPending(false);
    finishSend.current();
    finishSend.current = null;
  };
  return <ExampleGallery className="conversation-demo" onClick={followConversationFragment}>
    <Showcase title="Messages with Markdown and activity groups" description="User messages render as plain text. Agent messages render Markdown, with optional activity groups before each reply." code={conversationSource(technical)}>
      <div className="conversation-demo-panel"><div className="conversation-demo-options"><Switch label="Show code, table, and footnote example" checked={technical} onChange={event => setTechnical(event.target.checked)} /><Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => { finishSend.current?.(); finishSend.current = null; setMessages(initialMessages()); setDraft(''); setPending(false); setTechnical(false); }}>Reset conversation</Button></div>
        <Conversation messages={messages.map(message => message.id === 'agent-1' && technical ? { ...message, body: technicalReply } : message)} label="Task conversation example" pending={pending} pendingLabel="Codex is preparing a local sample reply…" announce />
        <div className="conversation-demo-composer"><MessageComposer label="Message in the conversation example" value={draft} onValueChange={setDraft} hint="Messages stay in this local example." placeholder="Add a note to this conversation…" rows={3} onSend={body => {
          const id = nextId.current++;
          setMessages(previous => [...previous, { id: `user-${id + 1}`, role: 'user', body, timeLabel: 'Just now' }]);
          setPending(true);
          return new Promise<void>(resolve => { finishSend.current = resolve; });
        }} /><div className="conversation-demo-reply-control"><Button variant="secondary" size="sm" icon={Check} disabled={!pending} onClick={finishReply}>Complete sample reply</Button><Text size="body">Send a message, then complete the sample reply. No provider or backend is contacted.</Text></div></div>
      </div>
    </Showcase>
    <Showcase title="Empty and pending states" description="An empty conversation shows its empty message. A pending response replaces that message with a status indicator." code={emptyConversationSource(emptyPending)}><div className="conversation-demo-panel"><div className="conversation-demo-options"><Switch label="Show pending response" checked={emptyPending} onChange={event => setEmptyPending(event.target.checked)} /></div><Conversation messages={[]} pending={emptyPending} label="Empty conversation example" emptyMessage="No messages in this conversation." /></div></Showcase>
    <Showcase title="Transcript in a modal drawer" description="Conversation renders the messages. Drawer provides the scrolling body and a persistent footer for MessageComposer." code={drawerSource}><ConversationDrawerExample /></Showcase>
  </ExampleGallery>;
}
