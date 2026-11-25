import { ExampleGallery, Showcase } from './shared';
import { AskAgentExample } from './split-button/AskAgentExample';
import askAgentSource from './split-button/AskAgentExample.tsx?raw';
import { BreadcrumbExample } from './split-button/BreadcrumbExample';
import breadcrumbSource from './split-button/BreadcrumbExample.tsx?raw';
import { ComposerExample } from './split-button/ComposerExample';
import composerSource from './split-button/ComposerExample.tsx?raw';
import { MergeExample } from './split-button/MergeExample';
import { NarrowComposerExample } from './split-button/NarrowComposerExample';
import narrowComposerSource from './split-button/NarrowComposerExample.tsx?raw';
import mergeSource from './split-button/MergeExample.tsx?raw';
import { SplitButtonSizes } from './split-button/SplitButtonSizes';
import sizesSource from './split-button/SplitButtonSizes.tsx?raw';
import { SplitButtonVariants } from './split-button/SplitButtonVariants';
import variantsSource from './split-button/SplitButtonVariants.tsx?raw';

const published = (source: string) => source.replace("from '../../system'", "from '@chartreuse/ui'").trim();

export function SplitButtonDemo() {
  return <ExampleGallery>
    <Showcase title="Choose how to merge" description="Built-in options pick the action the main segment runs." code={published(mergeSource)}>
      <MergeExample />
    </Showcase>
    <Showcase title="Ask an agent" description="Custom content holds native fields. The md SplitButton matches the md Post reply button beside it." code={published(askAgentSource)}>
      <AskAgentExample />
    </Showcase>
    <Showcase title="Composer controls" description="An sm SplitButton in the MessageComposer footer sits at the height of the sm send button." code={published(composerSource)}>
      <ComposerExample />
    </Showcase>
    <Showcase title="Icon-only in a narrow composer" description="An inline MessageComposer keeps the field, controls, and send on one row. At 300px, iconOnly narrow keeps only the Ask agent icon, named by its text." code={published(narrowComposerSource)}>
      <NarrowComposerExample />
    </Showcase>
    <Showcase title="Breadcrumb without a divider" description="Ghost, sm SplitButtons with divider={false}: the ID opens its page and the chevron switches to another one." code={published(breadcrumbSource)}>
      <BreadcrumbExample />
    </Showcase>
    <Showcase title="Sizes" description="Each size matches the Button beside it." code={published(sizesSource)}>
      <SplitButtonSizes />
    </Showcase>
    <Showcase title="Variants and disabled segments" description="Each row shows the variant at rest, with the action disabled, and with the menu disabled." span="full" code={published(variantsSource)}>
      <SplitButtonVariants />
    </Showcase>
  </ExampleGallery>;
}
