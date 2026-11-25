import { ExampleGallery, Showcase } from './shared';
import { CommentActionsExample } from './menu/CommentActionsExample';
import commentActionsSource from './menu/CommentActionsExample.tsx?raw';
import { TextTriggerExample } from './menu/TextTriggerExample';
import textTriggerSource from './menu/TextTriggerExample.tsx?raw';

const published = (source: string) => source.replace("from '../../system'", "from '@chartreuse/ui'").trim();

export function MenuDemo() {
  return <ExampleGallery>
    <Showcase title="Comment actions" description="An icon-only ⋯ trigger at the end of a row, with a disabled item, a separator, and a danger Delete." code={published(commentActionsSource)}>
      <CommentActionsExample />
    </Showcase>
    <Showcase title="Text trigger" description="Children give the trigger visible text; align start lines the menu up with its start edge." code={published(textTriggerSource)}>
      <TextTriggerExample />
    </Showcase>
  </ExampleGallery>;
}
