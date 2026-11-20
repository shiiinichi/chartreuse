import { Showcase } from './shared';
import { samplePatternDefinitions } from './pattern-definitions';
import type { SamplePatternId } from './pattern-definitions';
import { PatternPreview } from './PatternPreview';
import { withPatternPreview } from './pattern-example-sources';
import { SettingsPattern } from './patterns/SettingsPattern';
import settingsSource from './patterns/SettingsPattern.tsx?raw';
import settingsCss from './patterns/settings-pattern.css?raw';
import { RecordSearchPattern } from './patterns/RecordSearchPattern';
import searchSource from './patterns/RecordSearchPattern.tsx?raw';
import searchCss from './patterns/record-search-pattern.css?raw';
import { RecordDetailPattern } from './patterns/RecordDetailPattern';
import detailSource from './patterns/RecordDetailPattern.tsx?raw';
import detailCss from './patterns/record-detail-pattern.css?raw';
import { MetricsPattern } from './patterns/MetricsPattern';
import metricsSource from './patterns/MetricsPattern.tsx?raw';
import metricsCss from './patterns/metrics-pattern.css?raw';
import { Text } from '../system';

/** Display the rendered pattern and its navigation with package imports for consumers. */
function patternSource(source: string, css: string, page: SamplePatternId, componentName: string) {
  const module = source
    .replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '')
    .replace(/from\s+(['"])\.\.\/\.\.\/system(?:\/[^'"]+)?\1/g, "from '@chartreuse/ui'");
  return withPatternPreview(`import '@chartreuse/ui/styles.css';
${module.trim()}

export function PatternExample() {
  return (
    <PatternPreview page="${page}">
      <${componentName} />
    </PatternPreview>
  );
}`, css);
}

const patterns = {
  'settings-editor': { Component: SettingsPattern, componentName: 'SettingsPattern', source: settingsSource, css: settingsCss },
  'record-search': { Component: RecordSearchPattern, componentName: 'RecordSearchPattern', source: searchSource, css: searchCss },
  'record-detail': { Component: RecordDetailPattern, componentName: 'RecordDetailPattern', source: detailSource, css: detailCss },
  'metrics-dashboard': { Component: MetricsPattern, componentName: 'MetricsPattern', source: metricsSource, css: metricsCss },
};

export function SamplePatternPage({ name }: { name: SamplePatternId }) {
  const definition = samplePatternDefinitions.find(pattern => pattern.id === name)!;
  const { Component, componentName, source, css } = patterns[name];
  const code = patternSource(source, css, name, componentName);
  return <>
    <Showcase title={`${definition.label} composition`} description="The preview runs the source shown in Code. Data and mutations remain in component state." code={code}>
      <PatternPreview page={name}><Component /></PatternPreview>
    </Showcase>
    <section className="component-notes"><Text size="heading-2">Implementation notes</Text><ul>{definition.notes.map(note => <li key={note}>{note}</li>)}</ul></section>
  </>;
}
