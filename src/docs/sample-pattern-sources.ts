// Consumer-ready source for the sample patterns, shared by the docs site and the agent CLI.
// Only ?raw imports, so the CLI bundle carries strings and no browser modules.
import type { SamplePatternId } from './pattern-definitions';
import { withExampleStyles, withPatternPreview } from './pattern-preview-code';
import settingsSource from './patterns/SettingsPattern.tsx?raw';
import settingsCss from './patterns/settings-pattern.css?raw';
import searchSource from './patterns/RecordSearchPattern.tsx?raw';
import searchCss from './patterns/record-search-pattern.css?raw';
import detailSource from './patterns/RecordDetailPattern.tsx?raw';
import detailCss from './patterns/record-detail-pattern.css?raw';
import metricsSource from './patterns/MetricsPattern.tsx?raw';
import metricsCss from './patterns/metrics-pattern.css?raw';

const sources: Record<SamplePatternId, { componentName: string; source: string; css: string }> = {
  'settings-editor': { componentName: 'SettingsPattern', source: settingsSource, css: settingsCss },
  'record-search': { componentName: 'RecordSearchPattern', source: searchSource, css: searchCss },
  'record-detail': { componentName: 'RecordDetailPattern', source: detailSource, css: detailCss },
  'metrics-dashboard': { componentName: 'MetricsPattern', source: metricsSource, css: metricsCss },
};

function packageModule(page: SamplePatternId) {
  const { source } = sources[page];
  const module = source
    .replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '')
    .replace(/from\s+(['"])\.\.\/\.\.\/system(?:\/[^'"]+)?\1/g, "from '@chartreuse/ui'");
  return `import '@chartreuse/ui/styles.css';\n${module.trim()}`;
}

/** Docs-site example: the pattern module, its PatternPreview wrapper, and both stylesheets as a trailing comment. */
export function samplePatternCode(page: SamplePatternId) {
  const { componentName, css } = sources[page];
  return withPatternPreview(`${packageModule(page)}

export function PatternExample() {
  return (
    <PatternPreview page="${page}">
      <${componentName} />
    </PatternPreview>
  );
}`, css);
}

/**
 * Agent CLI example: only the pattern module and its own stylesheet, without the docs-site preview shell
 * or its docs-content cascade layer. Rules scoped to .pattern-preview only apply inside that shell.
 */
export function samplePatternModuleCode(page: SamplePatternId) {
  const css = sources[page].css.replace(/^@layer docs-content \{\r?\n([\s\S]*)\r?\n\}\s*$/, (_, body: string) => body.replace(/^ {2}/gm, ''));
  return withExampleStyles(packageModule(page), css);
}
