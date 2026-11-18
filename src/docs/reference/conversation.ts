import type { ComponentReference } from './types';

export const conversationReferences: ComponentReference[] = [{
  name: 'Conversation',
  slug: 'conversation',
  summary: 'A chronological transcript with sender and time labels, Markdown agent messages, and optional activity before each turn.',
  importCode: "import { AgentActivity, Conversation, MessageComposer } from '@chartreuse/ui';\nimport type { ConversationMessage } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `const messages: ConversationMessage[] = [
  { id: 'request', role: 'user', sender: 'You',
    body: 'Can you review the workspace?', timeLabel: '10:51 AM',
    dateTime: '2026-11-18T10:51:00+08:00' },
  { id: 'reply', role: 'agent', sender: 'Codex',
    body: 'The **workspace review** is complete.\\n\\n- Record findings on the task.',
    activity: <AgentActivity events={events} />,
    timeLabel: '10:52 AM', dateTime: '2026-11-18T10:52:00+08:00' },
];

<Conversation messages={messages} label="Task conversation" pending={pending} />
<MessageComposer value={draft} onValueChange={setDraft} onSend={sendMessage} />`,
  props: [
    { name: 'messages', type: 'readonly ConversationMessage[]', required: true, description: 'Chronological turns, oldest first. Each requires a unique stable id, role, and string body.' },
    { name: 'label', type: 'string', defaultValue: '"Conversation"', description: 'Accessible name for the transcript log.' },
    { name: 'emptyMessage', type: 'string', defaultValue: '"No messages."', description: 'Text shown when there are no messages and no pending response.' },
    { name: 'pending', type: 'boolean', defaultValue: 'false', description: 'Shows a pending-response indicator after the existing turns without moving focus or scrolling.' },
    { name: 'pendingLabel', type: 'string', defaultValue: '"Agent is working…"', description: 'Visible pending-response text. Use the actual sender name when known.' },
    { name: 'announce', type: 'boolean', defaultValue: 'false', description: 'Opt-in polite announcements of message count, last sender, and pending state. Streaming body changes are not reread.' },
    { name: 'className', type: 'string', description: 'Additional classes on the transcript log wrapper.' },
    { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native React 19 ref to the transcript log wrapper.' },
  ],
  nativeElement: 'div[role="log"] containing an ordered list of message articles',
  nativeProps: 'Inherits native div props/ref except children, role, aria-live, and aria-label. The transcript is explicitly aria-live="off"; announce uses a separate concise polite status region. Native events and classes target the log wrapper.',
  notes: [
    'ConversationMessage is { id, role, body, sender?, timeLabel?, dateTime?, format?, activity? }. Roles are user, agent, and system. Default sender labels are You, Agent, and System. Keep IDs stable while a message streams.',
    'Agent bodies use MarkdownRenderer by default; user and system bodies remain plain text with preserved line breaks. Set format to text or markdown explicitly when a turn needs a different treatment.',
    'MarkdownRenderer skips raw HTML and applies react-markdown’s default URL filter. Code blocks and wide tables scroll within their containers. Message bodies are strings.',
    'The activity slot appears immediately before its turn. Compose AgentActivity there and keep recorded work in chronological order; do not invent activity or hidden agent reasoning.',
    'Supply timeLabel for human-readable time and dateTime for an optional native time value. The component does not parse dates, infer a timezone, or generate changing relative labels.',
    'Conversation displays the transcript; MessageComposer, Drawer, and application state own sending, hosting, and scrolling. New messages never force focus or scroll. Only enable announcements for the active transcript when its host does not already announce new turns.',
    'Markdown fragment links retain native navigation. An application using hashes for routing should handle same-document Markdown links within its preview; the documentation example does so without changing its route.',
  ],
}];
