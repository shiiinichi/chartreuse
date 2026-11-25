import { ExampleGallery, Showcase } from './shared';
import { CollapsedExample } from './comment-thread/CollapsedExample';
import collapsedSource from './comment-thread/CollapsedExample.tsx?raw';
import { StatesExample } from './comment-thread/StatesExample';
import statesSource from './comment-thread/StatesExample.tsx?raw';
import { ThreadExample } from './comment-thread/ThreadExample';
import threadSource from './comment-thread/ThreadExample.tsx?raw';

const published = (source: string) => source.replace("from '../../system'", "from '@chartreuse/ui'").trim();

export function CommentThreadDemo() {
  return <ExampleGallery>
    <Showcase title="Thread with replies" description="The latest two replies show in the band; a long reply is clamped. Replies to an ask carry it as a quiet line above them. The inline composer keeps the field, Ask agent, and send on one row." code={published(threadSource)}>
      <ThreadExample />
    </Showcase>
    <Showcase title="At a 320px pane" description="The same thread in a narrow pane: tighter padding, the short time, and an icon-only Ask agent segment." code={published(threadSource)}>
      <div style={{ inlineSize: 320, maxInlineSize: '100%' }}><ThreadExample /></div>
    </Showcase>
    <Showcase title="Collapsed replies" description="Collapse hides the replies; the toggle stays in place as Expand and the summary takes the bar. The composer stays put." code={published(collapsedSource)}>
      <CollapsedExample />
    </Showcase>
    <Showcase title="Linked and confirming delete" description="highlighted rings a comment opened from a #reference; footerTone danger tints an inline delete confirmation." code={published(statesSource)}>
      <StatesExample />
    </Showcase>
  </ExampleGallery>;
}
