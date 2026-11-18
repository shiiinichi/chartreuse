import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Check, MessageSquare, RotateCcw } from 'lucide-react';
import { Badge, Button, Dialog, Switch, TaskCard, useToast } from '../system/components';
import { Showcase } from './shared';
import './TaskCardDemo.css';

const initialInfo = { dependencyCompleted: 1, dependencyTotal: 1, related: 1, comments: 2, attachments: 1 };

export function TaskCardDemo() {
  const [open, setOpen] = useState(false);
  const [extras, setExtras] = useState(true);
  const [width, setWidth] = useState(340);
  const [info, setInfo] = useState(initialInfo);
  const notify = useToast();
  const title = 'Expose the requested team in directory search';
  const reset = () => { setInfo(initialInfo); setExtras(true); setWidth(340); };

  return <Showcase title="Task card metadata" description="Resize the card, toggle optional metadata, and inspect the generated source." code={`import { TaskCard } from '@chartreuse/ui';\n\n<div style={{ width: ${width}, maxWidth: '100%' }}>\n  <TaskCard taskId="TASK-024"\n    title=${JSON.stringify(title)}\n    description="Include the requested team in directory search results."\n    status="done" priority="high" completed={4} total={4}${extras ? `\n    dependencies={{ completed: ${info.dependencyCompleted}, total: ${info.dependencyTotal} }}\n    relatedCount={${info.related}} commentCount={${info.comments}}\n    attachmentCount={${info.attachments}}` : ''}\n    assignees={['Alex Morgan', 'Sam Lee']}\n    onClick={() => console.log('Open task TASK-024')} />\n</div>`}><div className="task-card-demo">
    <div className="task-card-demo-controls"><Switch label="Show optional metadata" checked={extras} onChange={event => setExtras(event.target.checked)} /><label className="reference-range task-card-demo-width">Preferred card width: {width}px<input type="range" min="220" max="440" step="20" value={width} onChange={event => setWidth(Number(event.target.value))} /></label></div>
    <div className="task-card-demo-preview" style={{ '--task-card-demo-width': `${width}px` } as CSSProperties}><TaskCard taskId="TASK-024" title={title} description="Include the requested team in directory search results." status="done" priority="high" completed={4} total={4} dependencies={extras ? { completed: info.dependencyCompleted, total: info.dependencyTotal } : undefined} relatedCount={extras ? info.related : undefined} commentCount={extras ? info.comments : undefined} attachmentCount={extras ? info.attachments : undefined} assignees={['Alex Morgan', 'Sam Lee']} onClick={() => setOpen(true)} /></div>
    <div className="task-card-demo-actions"><Button variant="secondary" size="sm" icon={MessageSquare} disabled={!extras} onClick={() => { setInfo(previous => ({ ...previous, comments: previous.comments + 1 })); notify('Example comment count increased'); }}>Add example comment</Button><Button variant="secondary" size="sm" disabled={!extras} onClick={() => setInfo({ dependencyCompleted: 0, dependencyTotal: 0, related: 0, comments: 0, attachments: 0 })}>Show zero counts</Button><Button variant="ghost" size="sm" icon={RotateCcw} onClick={reset}>Reset example</Button></div>
    <p className="task-card-demo-caption">Each metadata count keeps its icon and label together and wraps when the card narrows. Omitted counts are hidden; explicit zero values remain visible.</p>
    <Dialog open={open} onOpenChange={setOpen} title={title} description="TASK-024 · Example task" footer={<Button icon={Check} onClick={() => setOpen(false)}>Done</Button>}><div className="task-card-demo-details"><div className="demo-row"><Badge tone="success" dot>Done</Badge><Badge tone="warning">High priority</Badge></div><p>Include the requested team in directory search results.</p><dl><div><dt>Checklist</dt><dd>4 of 4 items complete</dd></div>{extras && <><div><dt>Dependencies</dt><dd>{info.dependencyCompleted} of {info.dependencyTotal} complete</dd></div><div><dt>Related cards</dt><dd>{info.related}</dd></div><div><dt>Comments</dt><dd>{info.comments}</dd></div><div><dt>Attached files</dt><dd>{info.attachments}</dd></div></>}</dl></div></Dialog>
  </div></Showcase>;
}
