import { useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Check, FileText, History, MessageSquare, RotateCcw } from 'lucide-react';
import {
  ActivityItem, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox,
  Conversation, MarkdownRenderer, MessageComposer, Progress, Select, Tabs, WorkspaceContent, Text,
} from '../../system';
import type { ConversationMessage, Tone } from '../../system';
import './record-detail-pattern.css';

type ReviewStatus = 'in-review' | 'changes-requested' | 'approved';
type ReviewOwner = 'Sam Lee' | 'Alex Morgan' | 'Jordan Patel';
type CheckId = 'configuration' | 'smoke-test' | 'rollback';

interface ReviewState {
  status: ReviewStatus;
  owner: ReviewOwner;
  checks: Record<CheckId, boolean>;
}

interface ReviewActivity {
  id: string;
  title: string;
  detail: string;
  actor: string;
  time: string;
}

const statusLabels: Record<ReviewStatus, string> = {
  'in-review': 'In review',
  'changes-requested': 'Changes requested',
  approved: 'Approved',
};

const statusTones: Record<ReviewStatus, Tone> = {
  'in-review': 'info',
  'changes-requested': 'warning',
  approved: 'success',
};

const reviewChecks: { id: CheckId; label: string; hint: string }[] = [
  { id: 'configuration', label: 'Verify the configuration diff', hint: 'Confirm that only the cache TTL changes.' },
  { id: 'smoke-test', label: 'Record the staging smoke test', hint: 'Check a fresh response and a cached response.' },
  { id: 'rollback', label: 'Confirm the rollback command', hint: 'Keep the previous configuration revision available.' },
];

const reviewNotes = `## Configuration change

Reduce the response cache TTL from **300 seconds to 60 seconds** for the staging API worker. This lets the next smoke test observe configuration changes without a five-minute wait.

\`\`\`yaml
service: api-worker
environment: staging
cache:
  response_ttl_seconds: 60
\`\`\`

### Verification

1. Apply the configuration to staging.
2. Request the same resource twice and confirm a cache hit.
3. Wait 60 seconds, then confirm the response is refreshed.

### Rollback

Restore configuration revision \`c71a2e8\` if the error rate changes. Production keeps its current TTL.`;

function initialReview(): ReviewState {
  return {
    status: 'in-review',
    owner: 'Alex Morgan',
    checks: { configuration: true, 'smoke-test': true, rollback: false },
  };
}

function initialActivity(): ReviewActivity[] {
  return [
    { id: 'opened', title: 'Review opened', detail: 'Sam Lee submitted configuration revision e92b164 for review.', actor: 'Sam Lee', time: '09:12' },
    { id: 'smoke-test', title: 'Smoke test recorded', detail: 'Fresh and cached responses returned successfully in staging.', actor: 'Alex Morgan', time: '09:28' },
  ];
}

function initialComments(): ConversationMessage[] {
  return [
    { id: 'comment-1', role: 'user', sender: 'Sam Lee', timeLabel: '09:14', body: 'The TTL change is limited to staging. Production remains at 300 seconds.', format: 'text' },
    { id: 'comment-2', role: 'user', sender: 'Alex Morgan', timeLabel: '09:30', body: 'The smoke test passed. Please confirm the rollback command before approving.', format: 'text' },
  ];
}

/** A configuration review whose record, checklist, comments, and activity stay local. */
export function RecordDetailPattern() {
  const id = useId();
  const [saved, setSaved] = useState(initialReview);
  const [draft, setDraft] = useState(initialReview);
  const [activity, setActivity] = useState(initialActivity);
  const [comments, setComments] = useState(initialComments);
  const [comment, setComment] = useState('');
  const [tab, setTab] = useState('notes');
  const [approvalError, setApprovalError] = useState('');
  const [feedback, setFeedback] = useState('');
  const nextId = useRef(1);
  const statusControl = useRef<HTMLSelectElement>(null);
  const checkedCount = reviewChecks.filter(check => draft.checks[check.id]).length;
  const dirty = draft.status !== saved.status || draft.owner !== saved.owner
    || reviewChecks.some(check => draft.checks[check.id] !== saved.checks[check.id]);

  const saveReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.status === 'approved' && checkedCount !== reviewChecks.length) {
      setApprovalError('Complete every review check before approving this record.');
      setFeedback('Review was not saved. Complete every review check before approving.');
      statusControl.current?.focus();
      return;
    }
    if (!dirty) {
      setFeedback('No review changes to save.');
      return;
    }
    const changes: string[] = [];
    if (draft.status !== saved.status) changes.push(`Status changed from ${statusLabels[saved.status]} to ${statusLabels[draft.status]}.`);
    if (draft.owner !== saved.owner) changes.push(`Review owner changed to ${draft.owner}.`);
    reviewChecks.forEach(check => {
      if (draft.checks[check.id] !== saved.checks[check.id]) {
        changes.push(`${check.label}: ${draft.checks[check.id] ? 'complete' : 'reopened'}.`);
      }
    });
    setSaved({ ...draft, checks: { ...draft.checks } });
    const entryId = nextId.current++;
    setActivity(previous => [...previous, {
      id: `review-${entryId}`, title: 'Review updated',
      detail: changes.join(' '), actor: 'Sam Lee', time: 'Just now',
    }]);
    setApprovalError('');
    setFeedback('Review saved. The record and activity log have been updated.');
  };

  const addComment = (body: string) => {
    const entryId = nextId.current++;
    setComments(previous => [...previous, {
      id: `comment-local-${entryId}`, role: 'user', sender: 'Sam Lee',
      timeLabel: 'Just now', body, format: 'text',
    }]);
    setActivity(previous => [...previous, {
      id: `comment-activity-${entryId}`, title: 'Comment added',
      detail: 'Sam Lee added a comment to the review discussion.', actor: 'Sam Lee', time: 'Just now',
    }]);
  };

  const reset = () => {
    setSaved(initialReview());
    setDraft(initialReview());
    setActivity(initialActivity());
    setComments(initialComments());
    setComment('');
    setTab('notes');
    setApprovalError('');
    setFeedback('Record reset. The original review, comments, and activity are restored.');
    nextId.current = 1;
  };

  const review = <section className="record-detail-pattern" aria-labelledby={`${id}-title`}>
    <div className="record-detail-pattern-navigation">
      <Breadcrumbs items={[{ label: 'Configuration reviews' }, { label: 'CFG-184' }]} />
      <Button variant="ghost" size="sm" icon={RotateCcw} onClick={reset}>Reset record</Button>
    </div>

    <header className="record-detail-pattern-header">
      <div>
        <Text size="body" className="record-detail-pattern-identifier">CFG-184</Text>
        <Text size="heading-2" id={`${id}-title`}>Reduce the staging response cache TTL</Text>
        <Text size="body">Review the configuration change and record the checks required for approval.</Text>
      </div>
      <Badge tone={statusTones[saved.status]} dot>{statusLabels[saved.status]}</Badge>
    </header>

    <div className="record-detail-pattern-layout">
      <div className="record-detail-pattern-main">
        <Card className="record-detail-pattern-card" aria-labelledby={`${id}-record-heading`}>
          <Text size="heading-3" id={`${id}-record-heading`}>Record details</Text>
          <dl className="record-detail-pattern-metadata">
            <div><dt>Service</dt><dd><code>api-worker</code></dd></div>
            <div><dt>Environment</dt><dd><Badge>Staging</Badge></dd></div>
            <div><dt>Review owner</dt><dd><Avatar name={saved.owner} size="sm" showName /></dd></div>
            <div><dt>Revision</dt><dd><code>e92b164</code></dd></div>
            <div><dt>Submitted by</dt><dd>Sam Lee</dd></div>
            <div><dt>Submitted</dt><dd><time dateTime="2026-11-18T09:12:00+08:00">18 Nov, 09:12</time></dd></div>
          </dl>
        </Card>

        <Card className="record-detail-pattern-card record-detail-pattern-content" aria-label="Review notes and discussion">
          <Tabs label="Record content" value={tab} onValueChange={setTab} items={[
            {
              value: 'notes', label: 'Review notes', icon: FileText,
              content: <MarkdownRenderer>{reviewNotes}</MarkdownRenderer>,
            },
            {
              value: 'discussion', label: 'Discussion', icon: MessageSquare, count: comments.length,
              content: <div className="record-detail-pattern-discussion">
                <Conversation messages={comments} label="Configuration review comments" />
                <div className="record-detail-pattern-composer">
                  <label id={`${id}-comment-label`} htmlFor={`${id}-comment`} className="record-detail-pattern-comment-label">Add a review comment</label>
                  <MessageComposer id={`${id}-comment`} name="review-comment" label="Add a review comment"
                    aria-labelledby={`${id}-comment-label`}
                    value={comment} onValueChange={setComment} onSend={addComment} rows={3}
                    placeholder="Record a finding or a follow-up check…" sendLabel="Add comment"
                    hint="Comments stay in this example. Command/Ctrl+Enter adds your comment." />
                </div>
              </div>,
            },
          ]} />
        </Card>
      </div>

      <aside className="record-detail-pattern-side" aria-label="Review controls and activity">
        <Card className="record-detail-pattern-card" aria-labelledby={`${id}-review-heading`}>
          <div className="record-detail-pattern-card-heading">
            <Text size="heading-3" id={`${id}-review-heading`}>Review state</Text>
            <Badge tone={dirty ? 'warning' : 'neutral'}>{dirty ? 'Unsaved changes' : 'Saved'}</Badge>
          </div>
          <form onSubmit={saveReview} aria-labelledby={`${id}-review-heading`} className="record-detail-pattern-review-form">
            <Select ref={statusControl} name="review-status" label="Status" value={draft.status}
              error={approvalError || undefined} hint="Approval requires all three review checks."
              onChange={event => {
                const status = event.currentTarget.value as ReviewStatus;
                setDraft(previous => ({ ...previous, status }));
                setApprovalError('');
                setFeedback('');
              }}>
              <option value="in-review">In review</option>
              <option value="changes-requested">Changes requested</option>
              <option value="approved">Approved</option>
            </Select>
            <Select name="review-owner" label="Review owner" value={draft.owner}
              hint="The owner appears in the saved record details."
              onChange={event => {
                const owner = event.currentTarget.value as ReviewOwner;
                setDraft(previous => ({ ...previous, owner }));
                setFeedback('');
              }}>
              <option>Alex Morgan</option><option>Sam Lee</option><option>Jordan Patel</option>
            </Select>
            <fieldset className="record-detail-pattern-checks">
              <legend>Review checks</legend>
              <div className="record-detail-pattern-check-list">
                {reviewChecks.map(check => <Checkbox key={check.id} name={check.id} label={check.label}
                  hint={check.hint} checked={draft.checks[check.id]}
                  onChange={event => {
                    const checked = event.currentTarget.checked;
                    setDraft(previous => ({ ...previous, checks: { ...previous.checks, [check.id]: checked } }));
                    setApprovalError('');
                    setFeedback('');
                  }} />)}
              </div>
            </fieldset>
            <Progress value={checkedCount} max={reviewChecks.length} label="Review checks complete" showLabel
              valueText={`${checkedCount} of ${reviewChecks.length}`} />
            <div className="record-detail-pattern-save">
              <Button type="submit" icon={Check}>Save review</Button>
              <Text size="body">Save applies the status, owner, and checklist to this local record.</Text>
              <Text size="body" className="record-detail-pattern-feedback" role="status" aria-atomic="true">{feedback}</Text>
            </div>
          </form>
        </Card>

        <Card className="record-detail-pattern-card" aria-labelledby={`${id}-activity-heading`}>
          <div className="record-detail-pattern-card-heading">
            <Text size="heading-3" id={`${id}-activity-heading`}><History size={16} aria-hidden="true" />Activity</Text>
            <Badge>{activity.length}</Badge>
          </div>
          <ol className="record-detail-pattern-activity" reversed>
            {[...activity].reverse().map(entry => <li key={entry.id}>
              <ActivityItem title={entry.title} metadata={<span>{entry.actor} · {entry.time}</span>}>
                <Text size="body">{entry.detail}</Text>
              </ActivityItem>
            </li>)}
          </ol>
        </Card>
      </aside>
    </div>
  </section>;

  return <WorkspaceContent as="section" width="full" aria-label="Example workspace content">{review}</WorkspaceContent>;
}
