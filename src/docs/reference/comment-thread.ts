import type { ComponentReference } from './types';

export const commentThreadReference: ComponentReference = {
  name: 'CommentThread',
  slug: 'comment-thread',
  summary: 'A comment in a Card with its replies in a tinted band below, a collapse toggle that stays in place, and a composer at the end.',
  importCode: "import { useState } from 'react';\nimport { Copy, Pencil, Sparkles, Trash2 } from 'lucide-react';\nimport { CommentThread, Menu, MessageComposer, SplitButton } from '@chartreuse/ui';\nimport type { ThreadComment } from '@chartreuse/ui';",
  usageCode: `const actions = (number: number) => <Menu size="sm" label={\`More actions for #\${number}\`} items={[
  { id: 'edit', label: 'Edit', icon: Pencil, onSelect: () => {} },
  { id: 'copy', label: 'Copy link', icon: Copy, onSelect: () => {} },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => {} },
]} />;

const comment: ThreadComment = {
  id: '5', sender: 'Human', senderTone: 'success', label: 'Comment #5', reference: '#5',
  time: { label: 'Nov 25, 6:10 PM', shortLabel: '6:10 PM', title: 'November 25, 2026 at 6:10:16 PM', dateTime: '2026-11-25T18:10:16' },
  actions: actions(5), body: 'Check the spec created by Codex.',
};

const replies: ThreadComment[] = [{
  id: '6', sender: 'Agent', senderTone: 'info', label: 'Reply #6', reference: '#6', meta: ['Codex'],
  time: { label: 'Nov 25, 6:12 PM', shortLabel: '6:12 PM' }, actions: actions(6),
  body: '**Changes suggested.** SPEC-1 matches the verified discovery.', maxLines: 10, expandLabel: 'Show full reply',
}];

export function CommentExample() {
  const [draft, setDraft] = useState('');
  return <CommentThread comment={comment} replies={replies} composer={
    <MessageComposer layout="inline" label="Reply to #5" placeholder="Reply…" sendSize="sm"
      value={draft} onValueChange={setDraft} onSend={() => setDraft('')}
      controls={<SplitButton variant="secondary" size="sm" icon={Sparkles} iconOnly="narrow"
        menuLabel="Agent for this request: Codex" content="Agent settings">Ask agent</SplitButton>} />
  } />;
}`,
  nativeElement: 'article (Card) containing a header region, a section of replies, and an optional footer',
  nativeProps: 'Card props such as className, style, id, and native events go to the article. aria-label defaults to comment.label.',
  props: [
    { name: 'comment', type: 'ThreadComment', required: true, description: "The main comment. A ThreadComment is { id, sender, senderTone?, label?, reference?, time?, meta?, actions?, body, format?, maxLines?, expandLabel?, collapseLabel?, content?, ask? }. body is optional when ask is set." },
    { name: 'replies', type: 'readonly ThreadComment[]', defaultValue: '[]', description: 'Replies in order, oldest first. Without replies there is no band.' },
    { name: 'visibleReplies', type: 'number', defaultValue: '2', description: 'How many of the latest replies show before "Show N earlier replies".' },
    { name: 'composer', type: 'ReactNode', description: 'A composer at the end of the thread, usually a MessageComposer with layout="inline". It sits at the end of the replies band, collapsed or not, or in the main comment when there are no replies.' },
    { name: 'collapsed', type: 'boolean', description: 'Controlled collapsed state of the replies band.' },
    { name: 'defaultCollapsed', type: 'boolean', defaultValue: 'false', description: 'Initial collapsed state when uncontrolled.' },
    { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Called when Collapse or the summary row is pressed.' },
    { name: 'repliesLabel', type: 'string', defaultValue: "'Replies'", description: 'Accessible name of the replies region, such as "Replies to #5".' },
    { name: 'showEarlierLabel', type: '(hidden: number) => string', defaultValue: '"Show N earlier replies"', description: 'Text of the button that reveals the hidden replies.' },
    { name: 'collapseLabel', type: 'string', defaultValue: "'Collapse'", description: 'Text of the replies toggle while the replies show.' },
    { name: 'expandLabel', type: 'string', defaultValue: "'Expand'", description: 'Text of the same toggle while the replies are collapsed.' },
    { name: 'summary', type: '(count: number, latest: ThreadComment) => ReactNode', defaultValue: '"3 replies · latest from Agent, 5:40 PM"', description: 'Shown at the start of the replies bar while collapsed, in place of "Show N earlier replies".' },
    { name: 'highlighted', type: 'boolean', defaultValue: 'false', description: 'Rings the card in the focus colour, such as a comment opened from a #reference.' },
    { name: 'footer', type: 'ReactNode', description: 'A last region, such as an inline delete confirmation.' },
    { name: 'footerTone', type: "'neutral' | 'danger'", defaultValue: "'neutral'", description: "Tints the footer; 'danger' suits a delete confirmation." },
  ],
  notes: [
    'Each header row holds the sender Badge, the reference (#5), the time and meta (joined with " · " and truncated with an ellipsis), and the actions slot at the end of the row for a Menu.',
    'Replies are marked by a 2px rule on their start edge rather than indented, so a reply keeps most of the width in a 320px pane. Only the latest visibleReplies show at first; "Show N earlier replies" reveals the rest and moves focus to the first one.',
    'Collapse hides the replies but keeps the bar: its toggle stays in the same place with focus, reads Expand, and updates aria-expanded, so the same click undoes it. The summary takes the start of the bar, and nothing above the bar moves.',
    'The thread is a size container. Below 360px it tightens its padding and shows time.shortLabel, keeping the full date in the tooltip. A MessageComposer footer is a size container too, so SplitButton iconOnly="narrow" goes icon-only there below 360px.',
    'A string body renders as Markdown (format="text" for plain text); maxLines clamps it with a Show more toggle that appears only when the body overflows. Pass any other ReactNode for your own content, and content for things after the body, such as an AgentActivity status or a retry button.',
    'A reply that answers an ask takes ask: { id, anchorId?, label, intro?, agent?, reference?, time?, actions?, body, maxLines?, expandLabel?, collapseLabel? }. The ask is a quiet line above the reply in the same item: a ↳ icon, the bold intro ("You asked" by default), the agent summary truncated with its full text in a tooltip, the reference and time, and an actions slot for a small Menu. Its body follows, indented and clamped to 2 lines with Show more. Below 360px the ask drops its time.',
    'The ask is a group named by ask.label, such as "Your ask #7", with ask.anchorId as its DOM id so #7 links still scroll to it; name the whole item with the reply\u2019s label, such as "Your ask #7 and reply #8". Before the agent replies, leave out body: the item shows the ask and then content, such as a running status with Stop. When the main comment is the ask, add "asked Codex" to its meta instead.',
    'The footer is a wrapping row with its text at the comment body size (13px / 1.6), so a delete confirmation and its buttons line up without extra styling.',
    'Use Conversation for a chat log of turns between a person and an agent; use CommentThread for comments with replies, actions, and a reply field on a card or document.',
  ],
};

export const commentThreadReferences: ComponentReference[] = [commentThreadReference];
