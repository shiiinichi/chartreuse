import { useId, useState } from 'react';
import { Archive, Check, GitBranch, Link2, ListChecks, MessageSquare, Paperclip, Send } from 'lucide-react';
import { Alert, Avatar, Badge, Button, Checkbox, Dialog, Divider, Progress, Select, TextArea, useToast } from '../system';

const checklist = [
  'Render task details and comments in separate body panes.',
  'Document the task scope and acceptance criteria.',
  'Expose related task references.',
  'Update checklist completion in local state.',
  'List supporting reports and files.',
  'Validate the completed implementation.',
];
const initialComments = [
  { id: 1, name: 'Alex Morgan', kind: 'Human', time: '12 min ago', text: 'Task details must remain visible while a comment is composed in the adjacent pane.' },
  { id: 2, name: 'Research agent', kind: 'Agent', time: '8 min ago', text: 'The related task reference and implementation notes are available for review.' },
  { id: 3, name: 'Sam Lee', kind: 'Human', time: '3 min ago', text: 'The first two checklist items are complete. The remaining items require implementation and validation.' },
];

export interface SplitContentExampleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resizableSplit?: boolean;
  sideContentMaxWidth?: number;
  maxWidth?: number;
}

export function SplitContentExample({ open, onOpenChange, resizableSplit = false, sideContentMaxWidth = 640, maxWidth = 1600 }: SplitContentExampleProps) {
  const [comments, setComments] = useState(initialComments);
  const [order, setOrder] = useState('newest');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [checks, setChecks] = useState(checklist.map((_, i) => i < 2));
  const notify = useToast();
  const commentHeading = useId();
  const completed = checks.filter(Boolean).length;
  const sorted = [...comments].sort((a, b) => order === 'newest' ? b.id - a.id : a.id - b.id);

  const conversation = <>
    <header className="split-comments-header"><h3 id={commentHeading}><MessageSquare size={17} aria-hidden="true" />Comments<Badge>{comments.length}</Badge></h3><Select hideLabel label="Comment order" name="commentOrder" value={order} onChange={e => setOrder(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></Select></header>
    <div className="split-comments-feed" role="region" aria-labelledby={commentHeading} tabIndex={0}>
      {sorted.map(comment => <article className="split-comment" key={comment.id}><div className="split-comment-meta"><Avatar name={comment.name} size="sm" color={comment.kind === 'Agent' ? 'blue' : 'green'} /><div><strong>{comment.name}</strong><span>{comment.time}</span></div><Badge tone={comment.kind === 'Agent' ? 'info' : 'neutral'}>{comment.kind}</Badge></div><p>{comment.text}</p></article>)}
    </div>
    <form className="split-comment-composer" aria-label="Add a comment" onSubmit={event => {
      event.preventDefault();
      if (!draft.trim()) { setError('Enter a non-whitespace comment before posting.'); return; }
      setComments(previous => [...previous, { id: Math.max(0, ...previous.map(comment => comment.id)) + 1, name: 'You', kind: 'Human', time: 'Just now', text: draft.trim() }]);
      setDraft(''); setError(''); setAnnouncement(`Comment posted. ${comments.length + 1} comments on this card.`); event.currentTarget.reset(); notify('Comment stored in local example state');
    }}><TextArea label="New comment" name="comment" placeholder="Enter a review comment…" rows={3} value={draft} error={error} onChange={e => { setDraft(e.target.value); setError(''); }} required /><span className="sr-only" role="status">{announcement}</span><span className="sr-only" role="alert">{error}</span><div className="split-composer-actions"><span>Posting appends a comment to local state.</span><Button type="submit" size="sm" icon={Send}>Post comment</Button></div></form>
  </>;

  return <Dialog open={open} onOpenChange={onOpenChange} size="xl" maxWidth={maxWidth} resizableSplit={resizableSplit} sideContentMaxWidth={sideContentMaxWidth} title="Card details" description="TASK-024 · Implement the workspace task board" contentLabel="Details" sideContentLabel="Comments" sideContent={conversation} footer={<><Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button><Button icon={Check} onClick={() => { notify('Review action completed in local example'); onOpenChange(false); }}>Mark reviewed</Button></>}>
    <div className="split-card-details">
      <div className="demo-row"><Badge tone="info" dot>In progress</Badge><Badge tone="warning">High priority</Badge><span className="modal-detail-branch"><GitBranch size={13} aria-hidden="true" />feat/workspace</span></div>
      <section><span className="eyebrow">TASK SCOPE</span><h3>Implement the workspace task board</h3><p>Add status lanes, task search, and task detail dialogs.</p><p>Each pane scrolls independently. The dialog footer spans both panes and remains outside their scrolling content.</p></section>
      <Divider />
      <section><h4><Link2 size={16} aria-hidden="true" />Related cards</h4><p>A related task reference is rendered as a button.</p><button className="split-related-card" type="button" onClick={() => notify('Related card: Define workspace view contracts', 'info')}><span className="eyebrow">TASK-027</span><strong>Define workspace view contracts</strong><Badge tone="success" icon={Check}>Done</Badge></button></section>
      <Divider />
      <section><div className="modal-checklist-heading"><h4><ListChecks size={16} aria-hidden="true" />Checklist</h4><Badge tone="success">{completed}/{checklist.length}</Badge></div><Progress value={completed} max={checklist.length} label={`${completed} of ${checklist.length} checklist items complete`} /><div className="modal-detail-checklist">{checklist.map((label, index) => <Checkbox key={label} label={label} checked={checks[index]} onChange={e => setChecks(previous => previous.map((checked, i) => i === index ? e.target.checked : checked))} />)}</div></section>
      <Divider />
      <section><h4><Paperclip size={16} aria-hidden="true" />Reports & files</h4><p>Supporting file metadata is displayed without a download action.</p><div className="split-file-note"><Paperclip size={17} aria-hidden="true" /><div><strong>Workspace review notes</strong><span>Implementation decisions and validation requirements.</span></div><Badge>Markdown</Badge></div></section>
      <Divider />
      <section><h4><Archive size={16} aria-hidden="true" />Implementation notes</h4><p>Record state ownership, pane overflow constraints, resize limits, and keyboard behavior before marking the task reviewed.</p></section>
      <Alert tone="success" title="Split body and shared footer">Details and comments occupy the dialog body. Footer actions apply to the full dialog.</Alert>
    </div>
  </Dialog>;
}
