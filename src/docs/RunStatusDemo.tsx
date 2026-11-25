import { ExampleGallery, Showcase } from './shared';
import { RunStatusExample } from './run-status/RunStatusExample';
import runStatusSource from './run-status/RunStatusExample.tsx?raw';

const published = (source: string) => source.replace("from '../../system'", "from '@chartreuse/ui'").trim();

export function RunStatusDemo() {
  return <ExampleGallery>
    <Showcase title="Agent reply in progress" description="The step changes every few seconds and is announced; the timer is not. At 280px, Stop shows only its icon." span="full" code={published(runStatusSource)}>
      <RunStatusExample />
    </Showcase>
  </ExampleGallery>;
}
