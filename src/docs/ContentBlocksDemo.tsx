import { Quote } from 'lucide-react';
import { ActivityItem } from '../system/ActivityItem';
import { Blockquote } from '../system/Blockquote';
import { Badge } from '../system/components';
import { ExampleGallery, Showcase } from './shared';
import './content-blocks-demo.css';

const filledQuoteExamples = [
  { tone: 'info', title: 'Information tone', quote: 'Include the input, output, status, and duration when recording a tool event.' },
  { tone: 'success', title: 'Success tone', quote: 'The review is complete. All three specialist calls returned their findings.' },
  { tone: 'warning', title: 'Warning tone', quote: 'Keep unresolved findings open until the reviewer attaches supporting evidence.' },
  { tone: 'danger', title: 'Danger tone', quote: 'Stop the release until the blocking issue has been reviewed.' },
] as const;

export function BlockquoteDemo() {
  return <div className="content-blocks-demo">
    <p className="content-blocks-demo-intro">Blockquote renders quoted content with a left rule. The filled variant adds a background; attribution renders separately from the quotation.</p>
    <ExampleGallery >
    <Showcase title="Quotation with attribution" code={`import { Blockquote } from '@chartreuse/ui';\n\n<Blockquote attribution={<>Sam Lee · <cite>API review</cite></>}>\n  <p>Record the API change and its affected callers so the next\n    reviewer can verify the migration.</p>\n</Blockquote>`}><Blockquote attribution={<><span>Sam Lee</span><span aria-hidden="true"> · </span><cite>API review</cite></>}>
      <p>Record the API change and its affected callers so the next reviewer can verify the migration.</p>
    </Blockquote></Showcase>
    <Showcase title="Quotation without attribution" code={`import { Blockquote } from '@chartreuse/ui';\n\n<Blockquote>\n  <p>Review the API contract before updating its callers.</p>\n</Blockquote>`}><Blockquote><p>Review the API contract before updating its callers.</p></Blockquote></Showcase>
    <Showcase title="Filled quotation" description="The filled variant adds a background, a colored rule, and padding around the quotation and attribution." code={`import { Blockquote } from '@chartreuse/ui';\n\n<Blockquote variant="filled"\n  attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}>\n  <p>Record the API change and its affected callers so the next\n    reviewer can verify the migration.</p>\n</Blockquote>`}><Blockquote variant="filled" attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}><p>Record the API change and its affected callers so the next reviewer can verify the migration.</p></Blockquote></Showcase>
    {filledQuoteExamples.map(example => <Showcase key={example.tone} title={example.title} description={`The ${example.tone} tone colors the background and rule. The component retains blockquote and figcaption semantics.`} code={`import { Blockquote } from '@chartreuse/ui';\n\n<Blockquote variant="filled" tone="${example.tone}"\n  attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}>\n  <p>${example.quote}</p>\n</Blockquote>`}><Blockquote variant="filled" tone={example.tone} attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}><p>{example.quote}</p></Blockquote></Showcase>)}
    <Showcase title="Quotation with a decorative icon" description="Place a decorative icon inside the quotation with aria-hidden. Attribution remains outside the blockquote element." code={`import { Quote } from 'lucide-react';\nimport { Blockquote } from '@chartreuse/ui';\n\n<Blockquote variant="filled" tone="info"\n  attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}>\n  <div className="blockquote-icon-example">\n    <Quote size={24} aria-hidden="true" />\n    <p>Record the failing test and its output before assigning the follow-up review.</p>\n  </div>\n</Blockquote>\n\n/* Example layout:\n.blockquote-icon-example { display: flex; flex-direction: column; align-items: flex-start; gap: var(--cr-space-3); }\n.blockquote-icon-example > svg { flex: none; color: var(--cr-color-info); }\n.blockquote-icon-example > p { margin: 0; }\n*/`}><Blockquote variant="filled" tone="info" attribution={<>Sam Lee · <cite>Illustrative review notes</cite></>}><div className="blockquote-icon-example"><Quote size={24} aria-hidden="true" /><p>Record the failing test and its output before assigning the follow-up review.</p></div></Blockquote></Showcase>
    </ExampleGallery>
  </div>;
}

export function ActivityItemDemo() {
  return <div className="content-blocks-demo">
    <p className="content-blocks-demo-intro">ActivityItem groups an update with its identifier, title, metadata, body, and footer.</p>
    <ExampleGallery >
    <Showcase title="Update with metadata and changed fields" code={`import { ActivityItem, Badge } from '@chartreuse/ui';\n\n<ActivityItem identifier="TASK-001.6"\n  title="[P2] Expose the requested team in directory search"\n  metadata={<>\n    <strong>Added comment</strong><Badge>Agent</Badge>\n    <time dateTime="2026-11-17T08:50:05+08:00">\n      Nov 17, 2026, 8:50 AM\n    </time>\n  </>} footer="Changed: Comments">\n  <p>Recorded completion evidence and the live inspector session\n    while preserving the original finding, human prioritization,\n    and unrelated audit scope.</p>\n</ActivityItem>`}><ActivityItem identifier="TASK-001.6" title="[P2] Expose the requested team in directory search" metadata={<><strong>Added comment</strong><Badge>Agent</Badge><time dateTime="2026-11-17T08:50:05+08:00">Nov 17, 2026, 8:50 AM</time></>} footer="Changed: Comments">
      <p>Recorded completion evidence and the live inspector session while preserving the original finding, human prioritization, and unrelated audit scope.</p>
    </ActivityItem></Showcase>
    <Showcase title="Update without a title or footer" code={`import { ActivityItem, Badge } from '@chartreuse/ui';\n\n<ActivityItem aria-label="Checklist update" metadata={<>\n  <strong>Completed a checklist item</strong>\n  <Badge tone="success">Human</Badge>\n  <time dateTime="2026-11-17T09:10:00+08:00">\n    Nov 17, 2026, 9:10 AM\n  </time>\n</>}>\n  <p>Verified that the requested team appears in the workspace.</p>\n</ActivityItem>`}><ActivityItem aria-label="Checklist update" metadata={<><strong>Completed a checklist item</strong><Badge tone="success">Human</Badge><time dateTime="2026-11-17T09:10:00+08:00">Nov 17, 2026, 9:10 AM</time></>}><p>Verified that the requested team appears in the workspace.</p></ActivityItem></Showcase>
    </ExampleGallery>
  </div>;
}
