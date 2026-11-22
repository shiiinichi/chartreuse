import { Showcase } from './shared';
import { samplePatternDefinitions } from './pattern-definitions';
import type { SamplePatternId } from './pattern-definitions';
import { PatternPreview } from './PatternPreview';
import { samplePatternCode } from './sample-pattern-sources';
import { SettingsPattern } from './patterns/SettingsPattern';
import { RecordSearchPattern } from './patterns/RecordSearchPattern';
import { RecordDetailPattern } from './patterns/RecordDetailPattern';
import { MetricsPattern } from './patterns/MetricsPattern';
import { Text } from '../system';

const patterns = {
  'settings-editor': SettingsPattern,
  'record-search': RecordSearchPattern,
  'record-detail': RecordDetailPattern,
  'metrics-dashboard': MetricsPattern,
};

export function SamplePatternPage({ name }: { name: SamplePatternId }) {
  const definition = samplePatternDefinitions.find(pattern => pattern.id === name)!;
  const Component = patterns[name];
  const code = samplePatternCode(name);
  return <>
    <Showcase title={`${definition.label} composition`} description="The preview runs the source shown in Code. Data and mutations remain in component state." code={code}>
      <PatternPreview page={name}><Component /></PatternPreview>
    </Showcase>
    <section className="component-notes"><Text size="heading-2">Implementation notes</Text><ul>{definition.notes.map(note => <li key={note}>{note}</li>)}</ul></section>
  </>;
}
