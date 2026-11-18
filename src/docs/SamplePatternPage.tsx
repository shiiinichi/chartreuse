import { Showcase } from './shared';
import { samplePatternDefinitions } from './pattern-definitions';
import type { SamplePatternId } from './pattern-definitions';
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

/** Display the rendered module, changing only package import paths for consumers. */
function patternSource(source: string, css: string) {
  const module = source
    .replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '')
    .replace(/from\s+(['"])\.\.\/\.\.\/system(?:\/[^'"]+)?\1/g, "from '@chartreuse/ui'");
  return `import '@chartreuse/ui/styles.css';\n${module.trim()}\n\n/* Pattern stylesheet:\n${css.replace(/\*\//g, '* /').trim()}\n*/`;
}

const patterns = {
  'settings-editor': { Component: SettingsPattern, code: patternSource(settingsSource, settingsCss) },
  'record-search': { Component: RecordSearchPattern, code: patternSource(searchSource, searchCss) },
  'record-detail': { Component: RecordDetailPattern, code: patternSource(detailSource, detailCss) },
  'metrics-dashboard': { Component: MetricsPattern, code: patternSource(metricsSource, metricsCss) },
};

export function SamplePatternPage({ name }: { name: SamplePatternId }) {
  const definition = samplePatternDefinitions.find(pattern => pattern.id === name)!;
  const { Component, code } = patterns[name];
  return <>
    <Showcase title={`${definition.label} composition`} description="The preview runs the source shown in Code. Data and mutations remain in component state." code={code}><Component /></Showcase>
    <section className="component-notes"><h2>Implementation notes</h2><ul>{definition.notes.map(note => <li key={note}>{note}</li>)}</ul></section>
  </>;
}
