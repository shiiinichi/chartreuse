import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AtSign, Check, MessageSquare, RotateCcw } from 'lucide-react';
import { Badge, Button, Dialog, IconButton, Switch, TaskCard, useToast } from '../system/components';
import { Tooltip } from '../system/Tooltip';
import { Showcase } from './shared';
import { Text } from '../system';
import './TaskCardDemo.css';

const initialInfo = { dependencyCompleted: 1, dependencyTotal: 1, related: 1, comments: 2, attachments: 1 };

export function TaskCardDemo() {
  const [open, setOpen] = useState(false);
  const [extras, setExtras] = useState(true);
  const [hideMetadataLabels, setHideMetadataLabels] = useState(false);
  const [progressIcon, setProgressIcon] = useState(false);
  const [cardAction, setCardAction] = useState(false);
  const [compact, setCompact] = useState(false);
  const [width, setWidth] = useState(340);
  const [info, setInfo] = useState(initialInfo);
  const notify = useToast();
  const title = 'Expose the requested team in directory search';
  const reset = () => {
    setInfo(initialInfo);
    setExtras(true);
    setHideMetadataLabels(false);
    setProgressIcon(false);
    setCardAction(false);
    setCompact(false);
    setWidth(340);
  };

  return <Showcase title="Task card metadata" description="Resize the card and try hiding metadata labels." code={`import { TaskCard } from '@chartreuse/ui';\n\n<div style={{ width: ${width}, maxWidth: '100%' }}>\n  <TaskCard taskId="TASK-024"\n    title=${JSON.stringify(title)}\n    description="Include the requested team in directory search results."\n    status="done" priority="high" completed={4} total={4}${compact ? '\n    density="compact"' : ''}${hideMetadataLabels ? '\n    hideMetadataLabels' : ''}${progressIcon ? '\n    progressDisplay="icon"' : ''}${extras ? `\n    dependencies={{ completed: ${info.dependencyCompleted}, total: ${info.dependencyTotal} }}\n    relatedCount={${info.related}} commentCount={${info.comments}}\n    attachmentCount={${info.attachments}}` : ''}\n    assignees={['Alex Morgan', 'Sam Lee']}\n    onClick={() => console.log('Open task TASK-024')}${cardAction ? `\n    actions={<Tooltip content="Add to chat context">\n      <IconButton variant="ghost" size="sm" icon={AtSign}\n        label="Add to chat context" onClick={() => console.log('Add TASK-024')} />\n    </Tooltip>}` : ''} />\n</div>`}><div className="task-card-demo">
    <div className="task-card-demo-controls">
      <Switch label="Show optional metadata" checked={extras} onChange={event => setExtras(event.target.checked)} />
      <Switch label="Hide metadata labels" checked={hideMetadataLabels} onChange={event => setHideMetadataLabels(event.target.checked)} />
      <Switch label="Show checklist as an icon" checked={progressIcon} onChange={event => setProgressIcon(event.target.checked)} />
      <Switch label="Show a card action" checked={cardAction} onChange={event => setCardAction(event.target.checked)} />
      <Switch label="Compact density" checked={compact} onChange={event => setCompact(event.target.checked)} />
      <label className="reference-range task-card-demo-width">Preferred card width: {width}px<input type="range" min="220" max="440" step="20" value={width} onChange={event => setWidth(Number(event.target.value))} /></label>
    </div>
    <div className="task-card-demo-preview" style={{ '--task-card-demo-width': `${width}px` } as CSSProperties}>
      <TaskCard taskId="TASK-024" title={title} description="Include the requested team in directory search results."
        status="done" priority="high" completed={4} total={4} hideMetadataLabels={hideMetadataLabels}
        density={compact ? 'compact' : 'default'} progressDisplay={progressIcon ? 'icon' : undefined}
        dependencies={extras ? { completed: info.dependencyCompleted, total: info.dependencyTotal } : undefined}
        relatedCount={extras ? info.related : undefined} commentCount={extras ? info.comments : undefined}
        attachmentCount={extras ? info.attachments : undefined} assignees={['Alex Morgan', 'Sam Lee']}
        onClick={() => setOpen(true)}
        actions={cardAction ? <Tooltip content="Add to chat context"><IconButton variant="ghost" size="sm" icon={AtSign} label="Add to chat context" onClick={() => notify('TASK-024 added to chat context')} /></Tooltip> : undefined} />
    </div>
    <div className="task-card-demo-actions"><Button variant="secondary" size="sm" icon={MessageSquare} disabled={!extras} onClick={() => { setInfo(previous => ({ ...previous, comments: previous.comments + 1 })); notify('Example comment count increased'); }}>Add example comment</Button><Button variant="secondary" size="sm" disabled={!extras} onClick={() => setInfo({ dependencyCompleted: 0, dependencyTotal: 0, related: 0, comments: 0, attachments: 0 })}>Show zero counts</Button><Button variant="ghost" size="sm" icon={RotateCcw} onClick={reset}>Reset example</Button></div>
    <Text size="body" className="task-card-demo-caption">{hideMetadataLabels || compact || progressIcon
      ? 'Hover over or focus an indicator to read its full label.'
      : 'Each metadata icon stays with its label as the card narrows. Optional counts appear when supplied, including zero.'}</Text>
    <Dialog open={open} onOpenChange={setOpen} title={title} description="TASK-024 · Example task" footer={<Button icon={Check} onClick={() => setOpen(false)}>Done</Button>}><div className="task-card-demo-details"><div className="demo-row"><Badge tone="success" dot>Done</Badge><Badge tone="warning">High priority</Badge></div><Text size="body">Include the requested team in directory search results.</Text><dl><div><dt>Checklist</dt><dd>4 of 4 items complete</dd></div>{extras && <><div><dt>Dependencies</dt><dd>{info.dependencyCompleted} of {info.dependencyTotal} complete</dd></div><div><dt>Related cards</dt><dd>{info.related}</dd></div><div><dt>Comments</dt><dd>{info.comments}</dd></div><div><dt>Attached files</dt><dd>{info.attachments}</dd></div></>}</dl></div></Dialog>
  </div></Showcase>;
}
