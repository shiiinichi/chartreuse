import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as system from '@chartreuse/ui';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const entry = fileURLToPath(new URL(`../${manifest.bin.chartreuse}`, import.meta.url));

function run(...args) {
  const result = spawnSync(process.execPath, [entry, ...args], { encoding: 'utf8' });
  assert.ifError(result.error);
  return result;
}

function query(command, ...args) {
  const result = run(command, ...args, '--format=json');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  const response = JSON.parse(result.stdout);
  assert.equal(response.command, command);
  assert.equal(response.schemaVersion, 1);
  assert.equal(response.chartreuseVersion, manifest.version);
  return response.data;
}

test('the npm executable publishes the complete public component catalog for its version', () => {
  assert.match(readFileSync(entry, 'utf8'), /^#!\/usr\/bin\/env node\n/);
  assert.equal(run('--version').stdout.trim(), manifest.version);
  const { components } = query('list');
  const expected = Object.entries(system).filter(([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function').map(([name]) => name);
  assert.deepEqual(components.map(entry => entry.name).sort(), expected.sort());
  assert.equal(new Set(components.map(entry => entry.id)).size, components.length);
});

test('an agent can discover a component and retrieve its real props, notes, and example', () => {
  const { results } = query('search', 'folder path');
  assert.deepEqual(results.slice(0, 2).map(entry => entry.name), ['PathSelector', 'FilePicker']);
  assert.deepEqual(query('search', 'zxqvzzxq').results, []);
  const { component } = query('info', 'PATH-SELECTOR');
  assert.equal(component.docsPath, '#components/path-selector');
  assert.equal(component.props.find(prop => prop.name === 'label').required, true);
  assert.ok(component.props.some(prop => prop.name === 'onBrowse'));
  assert.ok(component.notes.length);
  assert.equal(query('info', 'Button').component.props.find(prop => prop.name === 'type').defaultValue, "'button'");
  const textSize = query('info', 'Text').component.props.find(prop => prop.name === 'size');
  assert.equal(textSize.type, system.typography.map(({ id }) => `'${id}'`).join(' | '));
  const { code, language } = query('demo', 'PathSelector');
  assert.equal(language, 'tsx');
  assert.match(code, /import \{ PathSelector \} from '@chartreuse\/ui'/);
  assert.match(code, /onBrowse=\{browsePathFromHost\}/);
  assert.equal(run('demo', 'PathSelector').stdout.trim(), code.trim());
});

test('design guidance includes layout, application patterns, and the published token scopes', () => {
  const { guides } = query('guide');
  assert.ok(guides.some(guide => guide.id === 'settings-editor'));
  const { guide } = query('guide', 'layout');
  for (const name of ['Grid', 'Flex', 'Masonry']) assert.ok(guide.notes.some(note => note.includes(name)));
  assert.ok(query('guide', 'Settings editor').guide.notes.some(note => /validation/i.test(note)));
  assert.ok(query('token').globalTokens.some(entry => entry.name === '--cr-color-text' && entry.themes.dark));
  const { runtimeVariables, globalTokens, componentTokens } = query('token', 'Grid');
  assert.ok(runtimeVariables.length);
  for (const entry of runtimeVariables) assert.ok(!componentTokens.some(token => token.name === entry.name));
  assert.ok(globalTokens.some(entry => entry.name === '--cr-space-4'));
});

test('the setup guide tells an agent how to install, style, and wrap the library', () => {
  const { guides } = query('guide');
  assert.equal(guides[0].id, 'setup');
  const { guide } = query('guide', 'setup');
  assert.equal(guide.docsPath, '#getting-started');
  for (const pattern of [/@chartreuse\/ui\/styles\.css/, /ToastProvider/, /--cr-font-sans/, /color-scheme/, /'use client'/]) {
    assert.ok(guide.notes.some(note => pattern.test(note)), pattern.source);
  }
  // The login and install commands name the release script's registry and one package scope.
  const registry = readFileSync(new URL('../scripts/prepare-release.mjs', import.meta.url), 'utf8').match(/const registry = '([^']+)'/)[1];
  const login = guide.notes.join(' ').match(/npm login --scope=(@[\w-]+) --registry=(\S+)/);
  assert.ok(login, 'npm login command');
  assert.equal(login[2], registry);
  assert.ok(guide.notes.some(note => note.includes(`@chartreuse/ui@npm:${login[1]}/chartreuse`)));
  const layers = readFileSync(new URL('../src/system/styles.css', import.meta.url), 'utf8').match(/^@layer ([^;{]+);/m)[1].split(',').map(name => name.trim());
  assert.ok(layers.length);
  const layerNote = guide.notes.find(note => note.includes('cascade layers'));
  for (const layer of layers) assert.ok(layerNote.includes(layer), layer);
  assert.ok(layerNote.includes(`@layer ${layers.join(', ')};`));
  const css = readFileSync(new URL('../dist/lib/chartreuse.css', import.meta.url), 'utf8');
  for (const scheme of ['light', 'dark']) assert.match(css, new RegExp(`meta\\[name=['"]?color-scheme['"]?\\]\\[content=['"]?${scheme}['"]?\\]`), scheme);
  assert.deepEqual([...new Set(css.match(/@layer [\w-]+/g).map(rule => rule.slice(7)))], layers);
  assert.doesNotMatch(css, /@font-face/);
  assert.equal(guide.language, 'tsx');
  assert.match(guide.code, /import '@chartreuse\/ui\/styles\.css';/);
  assert.match(guide.code, /<ToastProvider>/);
  const layout = query('guide', 'layout').guide;
  assert.equal(layout.code, undefined);
  assert.equal(layout.language, undefined);
  const text = run('guide', 'setup').stdout;
  assert.ok(text.startsWith('Setup\n'));
  assert.ok(text.trim().endsWith(guide.code.trim()));
  for (const term of ['theme', 'dark mode']) assert.equal(query('search', term).results[0]?.id, 'setup', term);
  for (const term of ['setup', 'install', 'styles']) {
    assert.ok(query('search', term).results.some(entry => entry.kind === 'guide' && entry.id === 'setup'), term);
  }
});

test('the CLI discovers Table and Pagination and describes their composition', () => {
  for (const [name, props] of [
    ['Table', ['columns', 'getRowKey', 'rows', 'groups', 'pagination']],
    ['Pagination', ['page', 'pageCount', 'onPageChange']],
  ]) {
    const slug = name.toLowerCase();
    assert.ok(query('search', slug).results.some(entry => entry.name === name));
    const { component } = query('info', name);
    assert.equal(component.docsPath, `#components/${slug}`);
    for (const prop of props) assert.ok(component.props.some(entry => entry.name === prop), `${name}.${prop}`);
  }
});

function failure(...args) {
  const result = run(...args, '--format=json');
  assert.equal(result.stdout, '');
  return { status: result.status, ...JSON.parse(result.stderr).error };
}

test('search matches whole words, expands synonyms, and indexes design tokens', () => {
  const ids = term => query('search', term).results.map(entry => entry.id);
  const darkMode = ids('dark mode');
  assert.equal(darkMode[0], 'setup');
  for (const id of ['drawer', 'file-picker', 'path-selector', 'form', 'navbar']) assert.ok(!darkMode.includes(id), id);
  assert.ok(ids('tab').includes('tabs'));
  assert.ok(!ids('tab').includes('table'), 'whole words only');
  assert.equal(ids('error message')[0], 'alert');
  assert.equal(ids('modal')[0], 'dialog');
  assert.deepEqual(ids('dropdown').slice(0, 3), ['select', 'button-select', 'autocomplete']);
  assert.equal(ids('select input')[0], 'select');
  assert.equal(ids('radio button')[0], 'segmented-control');
  assert.notEqual(ids('sidebar navigation')[0], 'tabs');
  assert.notEqual(ids('date picker')[0], 'file-picker');
  assert.equal(ids('button')[0], 'button');

  const [primary] = query('search', 'primary color').results;
  assert.deepEqual(Object.keys(primary).sort(), ['docsPath', 'id', 'kind', 'name', 'summary', 'value']);
  assert.equal(primary.kind, 'token');
  assert.equal(primary.id, '--cr-color-primary');
  assert.equal(primary.name, primary.id);
  assert.equal(typeof primary.summary, 'string');
  assert.match(primary.value, /^light-dark\(/);
  assert.equal(JSON.parse(run('search', '--format=json', '--', '--cr-color-primary').stdout).data.results[0].id, '--cr-color-primary');
  assert.equal(ids('space 4')[0], '--cr-space-4');
  assert.match(run('search', 'primary color').stdout, /^--cr-color-primary \(token\) = light-dark\(/);

  // Tokens leave room for matching components and guides.
  const color = query('search', 'color').results;
  assert.equal(color[0].id, 'color');
  assert.ok(color[1].kind === 'token' && color.some(entry => entry.kind === 'component'));
  for (const term of ['gap', 'spacing']) {
    const results = ids(term);
    assert.ok(results.length <= 10);
    for (const id of ['grid', 'flex', 'layout', '--cr-space-4']) assert.ok(results.includes(id), `${term}: ${id}`);
  }
  const font = ids('font');
  assert.ok(font.includes('typography') && font.includes('--cr-font-sans'));
  assert.ok(!font.some(id => id.startsWith('--cr-space-')));
  assert.deepEqual(ids('dark mode'), ids('dark mode'));
});

test('search applies a relevance floor and literal words outrank synonyms', () => {
  const ids = term => query('search', term).results.map(entry => entry.id);
  // Prefix-only hits ("chart" in "Chartreuse") and notes-only hits beside stronger results are dropped.
  assert.deepEqual(ids('chart'), []);
  assert.deepEqual(ids('settings page'), ids('settings page').filter(id => id !== 'page-panel'));
  assert.equal(ids('settings page')[0], 'settings-editor');
  for (const term of ['the and of', '!!!', '--- ...']) {
    const result = run('search', '--format=json', '--', term);
    assert.equal(result.status, 0, term);
    assert.deepEqual(JSON.parse(result.stdout).data.results, [], term);
  }
  // "gap" is literal in Grid's summary; its alternate "space" matches token names one tier lower.
  const gap = ids('gap');
  assert.ok(gap.filter(id => id.startsWith('--cr-')).length <= 5);
  assert.ok(!ids('spacing').includes('grid-spacer'), 'alternates do not prefix-match');
  assert.deepEqual(ids('border radius').slice(0, 2), ['shape', '--cr-radius-sm']);
});

test('component lookups resolve aliases and suggest close names', () => {
  const modal = query('info', 'Modal');
  assert.equal(modal.component.name, 'Dialog');
  assert.equal(modal.resolvedFrom, 'Modal');
  assert.equal(query('info', 'Dialog').resolvedFrom, undefined);
  assert.equal(query('info', 'modals').component.name, 'Dialog');
  assert.equal(query('info', 'tooltips').component.name, 'Tooltip');
  assert.equal(query('info', 'stats').component.name, 'Stat');
  assert.equal(query('demo', 'toggle').component.name, 'Switch');
  assert.equal(query('token', 'modal').component.name, 'Dialog');
  assert.equal(query('guide', 'record detail').guide.id, 'record-detail');
  for (const [args, expected, message] of [
    [['info', 'navigation'], ['Navbar', 'Sidebar', 'Breadcrumbs', 'Tabs'], /matches several components/],
    [['info', 'dropdown'], ['Select', 'ButtonSelect', 'Autocomplete'], /matches several components/],
    [['info', 'banner'], ['CalloutBanner', 'Alert'], /matches several components/],
    [['info', 'error'], ['Alert'], /Unknown component/],
    [['info', 'buton'], ['Button'], /Unknown component/],
    [['info', 'btn'], ['Button'], /Unknown component/],
    [['info', 'datepicker'], ['TextField'], /Unknown component/],
  ]) {
    const error = failure(...args);
    assert.equal(error.status, 1);
    assert.equal(error.code, 'COMPONENT_NOT_FOUND');
    assert.match(error.message, message);
    assert.deepEqual(error.suggestions.slice(0, expected.length), expected, args.join(' '));
    assert.match(error.hint, new RegExp(`Did you mean ${expected[0]}`));
  }
  for (const [topic, expected] of [['layot', 'layout'], ['settings', 'settings-editor'], ['install', 'setup'], ['theme', 'setup']]) {
    const error = failure('guide', topic);
    assert.equal(error.code, 'GUIDE_NOT_FOUND');
    assert.equal(error.suggestions[0], expected, topic);
  }
  assert.match(run('info', 'buton').stderr, /Did you mean Button\?/);
  assert.deepEqual(failure('info', 'constructor').suggestions, []);
  assert.equal(failure('demo').suggestions, undefined);
});

test('the docs site and the CLI share one dependency-free alias module', () => {
  const catalog = readFileSync(new URL('../src/docs/catalog.ts', import.meta.url), 'utf8');
  assert.match(catalog, /from '\.\/component-aliases'/);
  const moduleUrl = new URL('../src/docs/component-aliases.ts', import.meta.url).href;
  const result = spawnSync(process.execPath, [
    '--experimental-strip-types', '--no-warnings', '--input-type=module',
    '-e', `const m = await import(${JSON.stringify(moduleUrl)}); console.log(JSON.stringify(m));`,
  ], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const { componentPageAliases, componentSynonyms, searchSynonyms } = JSON.parse(result.stdout);
  assert.deepEqual(componentPageAliases, {
    buttons: 'components/button', badges: 'components/badge', cards: 'components/card',
    fieldsets: 'components/fieldset', markdown: 'components/markdown-renderer', disclosures: 'components/disclosure',
    navigation: 'components/tabs', modals: 'components/dialog', drawers: 'components/drawer',
    feedback: 'components/alert', 'page-panels': 'components/page-panel',
  });
  const names = new Set(query('list').components.map(entry => entry.name));
  for (const targets of [...Object.values(componentSynonyms), ...Object.values(searchSynonyms)]) {
    for (const name of targets) assert.ok(names.has(name), name);
  }
});

test('query failures report structured errors with empty stdout', () => {
  for (const [args, status, code] of [
    [['info', 'Unknown'], 1, 'COMPONENT_NOT_FOUND'],
    [['guide', 'Unknown'], 1, 'GUIDE_NOT_FOUND'],
    [['demo'], 2, 'INVALID_ARGUMENTS'],
    [['list', '--unknown'], 2, 'INVALID_ARGUMENTS'],
    [['constructor'], 2, 'UNKNOWN_COMMAND'],
  ]) {
    const result = run(...args, '--format', 'json');
    assert.equal(result.status, status);
    assert.equal(result.stdout, '');
    const { error } = JSON.parse(result.stderr);
    assert.equal(error.code, code);
    assert.ok(error.hint);
  }
});

const foundationIds = ['color', 'spacing', 'shape', 'icons', 'accessibility', 'writing'];
const patternIds = ['settings-editor', 'record-search', 'record-detail', 'metrics-dashboard'];

test('foundation guides are listed, have notes, and name only real CSS tokens', () => {
  const listed = query('guide').guides.map(entry => entry.id);
  for (const id of [...foundationIds, ...patternIds, 'setup', 'layout', 'typography']) assert.ok(listed.includes(id), id);
  const tokenNames = query('token').globalTokens.map(entry => entry.name);
  for (const id of listed) {
    const { guide } = query('guide', id);
    assert.ok(guide.notes.length, id);
    for (const name of guide.notes.join(' ').match(/--cr-[a-z0-9-]*[a-z0-9*]/g) ?? []) {
      if (name.endsWith('*')) assert.ok(tokenNames.some(token => token.startsWith(name.slice(0, -1))), `${id}: ${name}`);
      else assert.ok(tokenNames.includes(name), `${id}: ${name}`);
    }
  }
  // Guides without a documentation page report docsPath null; the listing agrees.
  for (const id of ['accessibility', 'writing']) {
    assert.equal(query('guide', id).guide.docsPath, null, id);
    assert.equal(query('guide').guides.find(entry => entry.id === id).docsPath, null, id);
  }
  assert.equal(query('guide', 'color').guide.docsPath, '#colors');
});

const systemCss = () => {
  const directory = new URL('../src/system/', import.meta.url);
  return readdirSync(directory).filter(name => name.endsWith('.css')).map(name => readFileSync(new URL(name, directory), 'utf8')).join('\n');
};
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('foundation guide claims match the library CSS', () => {
  const styles = readFileSync(new URL('../src/system/styles.css', import.meta.url), 'utf8');
  const css = systemCss();
  const notes = id => query('guide', id).guide.notes.join(' ');

  // Focus: outlines are removed with no :focus-visible replacement. When the library adds one,
  // this fails so the accessibility guide and its workaround are revised.
  assert.match(styles, /\[class\^='cr-'\], \[class\*=' cr-'\][^{]*\):focus \{ outline: none; \}/);
  assert.doesNotMatch(css, /:focus-visible/);
  const accessibility = query('guide', 'accessibility').guide;
  assert.match(accessibility.notes.join(' '), /no :focus-visible rule/);
  assert.equal(accessibility.language, 'css');
  for (const selector of ['.cr-switch-track', '.cr-segmented-input', '.cr-segmented-label', '.cr-tab-list', '.cr-tree-item', '.cr-tree-row', '.cr-message-composer-input', '.cr-breadcrumbs']) {
    assert.ok(accessibility.code.includes(selector) && css.includes(selector), selector);
  }

  // Control heights: md in the shared rule, sm and lg in size rules.
  const heights = { md: styles.match(/\.cr-button, \.cr-input, \.cr-tab-list > button \{ min-block-size: (\d+)px;/)[1] };
  for (const size of ['sm', 'lg']) heights[size] = styles.match(new RegExp(`\\.cr-button\\[data-size='${size}'\\],[^{]+\\{ min-block-size: (\\d+)px;`))[1];
  assert.ok(notes('spacing').includes(`${heights.sm}, ${heights.md}, and ${heights.lg}px`), JSON.stringify(heights));

  // Coarse pointers: md controls reach 44px; sm buttons keep their more specific size rule;
  // SegmentedControl and Pagination raise their sm controls explicitly.
  const coarse = styles.match(/@media \(pointer: coarse\) \{([^@]*?)\n  \}/)[1];
  assert.match(coarse, /\.cr-button, \.cr-input, \.cr-tab-list > button \{ min-block-size: 44px; \}/);
  assert.match(coarse, /\.cr-icon-button \{ min-inline-size: 44px; \}/);
  assert.match(coarse, /\.cr-checkbox, \.cr-switch \{ min-block-size: 44px; \}/);
  assert.doesNotMatch(coarse, /data-size='sm'/);
  assert.match(css, /pointer: coarse\) \{ \.cr-segmented-label, \.cr-segmented-control\[data-size='sm'\] \.cr-segmented-label \{ min-block-size: 44px;/);
  assert.match(css, /pointer: coarse\) \{\s+\.cr-pagination-controls > \.cr-button\[data-size='sm'\] \{\s+min-inline-size: 44px;\s+min-block-size: 44px;/);
  for (const id of ['spacing', 'accessibility']) assert.match(notes(id), /stay at 32px/, id);

  // Radius and shadow notes name components whose rules use that token.
  const uses = { 'radius-sm': ['.cr-badge', '.cr-segmented-label'], 'radius-md': ['.cr-button', '.cr-input', '.cr-alert'],
    'radius-lg': ['.cr-card', '.cr-toast', '.cr-fieldset', '.cr-disclosure'], 'radius-xl': ['.cr-dialog', '.cr-page-panel'],
    'radius-full': ['.cr-switch-track', '.cr-progress'], 'shadow-sm': ['.cr-card'], 'shadow-md': ['.cr-tooltip'],
    'shadow-lg': ['.cr-dialog', '.cr-toast', ".cr-drawer[data-mode='modal']"] };
  for (const [token, selectors] of Object.entries(uses)) {
    assert.ok(notes('shape').includes(`--cr-${token}`), token);
    for (const selector of selectors) assert.match(css, new RegExp(`(^|\\n)\\s*${escape(selector)} \\{[^}]*var\\(--cr-${token}\\)`), `${selector} uses ${token}`);
  }

  // The stylesheet leaves body to the application, as the color and setup guides say.
  assert.doesNotMatch(readFileSync(new URL('../dist/lib/chartreuse.css', import.meta.url), 'utf8'), /(^|[},\s])body\s*[{,]/);
  for (const id of ['color', 'setup']) assert.match(notes(id), /does not style body/, id);
});

test('guide --code adds the full pattern source only when requested', () => {
  for (const id of patternIds) {
    const plain = query('guide', id).guide;
    assert.equal(plain.code, undefined, id);
    assert.equal(plain.language, undefined, id);
    assert.equal(plain.hasCode, true, id);
    assert.match(run('guide', id).stdout, /Add --code for the full source\.\n$/);
    const { guide } = query('guide', id, '--code');
    assert.deepEqual(guide.notes, plain.notes);
    assert.equal(guide.language, 'tsx');
    assert.match(guide.code, /from '@chartreuse\/ui';/);
    assert.match(guide.code, /import '@chartreuse\/ui\/styles\.css';/);
    assert.doesNotMatch(guide.code, /from '\.\.?\//, `${id} keeps no relative imports`);
    // The CLI prints only the pattern and its CSS, not the docs-site preview shell.
    assert.doesNotMatch(guide.code, /PatternPreview|@layer docs-content|docs-main/);
    assert.match(guide.code, /^export function \w+Pattern\(/m);
    assert.match(guide.code, /\/\* Add these rules to your stylesheet\./);
    assert.equal(guide.hasCode, undefined);
    const text = run('guide', id, '--code').stdout;
    assert.ok(text.trim().endsWith(guide.code.trim()), id);
    assert.ok(run('guide', id).stdout.length < 1000, `${id} default text stays small`);
  }
  // Guides without source reject --code; setup and accessibility always carry their short snippets.
  for (const id of ['layout', 'typography', 'color', 'spacing', 'shape', 'icons', 'writing']) {
    const error = failure('guide', id, '--code');
    assert.equal(error.status, 2, id);
    assert.equal(error.code, 'INVALID_ARGUMENTS', id);
    assert.equal(query('guide', id).guide.code, undefined, id);
    assert.equal(query('guide', id).guide.hasCode, undefined, id);
  }
  assert.equal(failure('guide', '--code').code, 'INVALID_ARGUMENTS');
  for (const id of ['setup', 'accessibility']) assert.equal(query('guide', id).guide.code, query('guide', id, '--code').guide.code, id);
  const misuse = failure('info', 'Button', '--code');
  assert.equal(misuse.status, 2);
  assert.equal(misuse.code, 'INVALID_ARGUMENTS');
  assert.match(run('--help').stdout, /guide \[topic\] \[--code\]/);
  assert.ok(JSON.parse(run('--help', '--format=json').stdout).data.commands.some(entry => entry.usage === 'guide [topic] [--code]'));
});

test('search ranks the foundation guides for their topics', () => {
  const ids = term => query('search', term).results.map(entry => entry.id);
  for (const [terms, id, within] of [
    [['gap', 'spacing', 'padding', 'margin'], 'spacing', 1],
    [['radius', 'border radius', 'shadow', 'elevation'], 'shape', 1],
    [['color'], 'color', 1],
    [['theme', 'dark mode'], 'color', 2],
    [['icon', 'icons', 'svg'], 'icons', 1],
    [['a11y', 'accessibility', 'screen reader', 'focus', 'keyboard'], 'accessibility', 1],
    [['copy', 'capitalization', 'microcopy'], 'writing', 1],
    [['tone'], 'writing', 3],
  ]) {
    for (const term of terms) assert.ok(ids(term).slice(0, within).includes(id), `${term}: ${ids(term).join(' ')}`);
  }
  for (const term of ['theme', 'dark mode']) assert.equal(ids(term)[0], 'setup', term);
  // Grid and Flex stay in the top half for spacing words.
  for (const term of ['gap', 'spacing']) for (const id of ['grid', 'flex']) assert.ok(ids(term).slice(0, 5).includes(id), `${term}: ${id}`);
  // Component queries keep their leaders.
  for (const [term, id] of [['button', 'button'], ['modal', 'dialog'], ['dropdown', 'select'], ['table', 'table'], ['select input', 'select'],
    ['sidebar navigation', 'sidebar'], ['toast', 'toast-provider'], ['card', 'card'], ['tabs', 'tabs'], ['form', 'form']]) assert.equal(ids(term)[0], id, term);
});

function importDocsModule(name) {
  const moduleUrl = new URL(`../src/docs/${name}.ts`, import.meta.url).href;
  const result = spawnSync(process.execPath, [
    '--experimental-strip-types', '--no-warnings', '--input-type=module',
    '-e', `const m = await import(${JSON.stringify(moduleUrl)}); console.log(JSON.stringify(m));`,
  ], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('list groups every component exactly once, from a dependency-free module', () => {
  const { componentGroups } = importDocsModule('component-groups');
  const { components, groups } = query('list');
  const names = components.map(entry => entry.name).sort();
  const grouped = componentGroups.flatMap(group => group.components);
  assert.deepEqual([...grouped].sort(), names, 'every component appears in exactly one group');
  assert.equal(new Set(grouped).size, grouped.length);
  assert.deepEqual(groups, componentGroups.map(({ name, components: members }) => ({ name, components: members })));
  for (const entry of components) {
    assert.equal(entry.group, componentGroups.find(group => group.components.includes(entry.name)).name, entry.name);
  }
  assert.equal(query('info', 'Dialog').component.group, 'Overlays');
  assert.equal(query('search', 'button').results[0].group, 'Actions');
  const text = run('list').stdout;
  assert.ok(text.startsWith('Actions\n  Button — '));
  for (const { name } of componentGroups) assert.match(text, new RegExp(`(^|\n\n)${name}\n  `), name);
});

test('the choosing guide and info seeAlso share one decision table', () => {
  const { componentChoices } = importDocsModule('component-choices');
  const names = new Set(query('list').components.map(entry => entry.name));
  const infoCache = new Map();
  const info = name => {
    if (!infoCache.has(name)) infoCache.set(name, query('info', name).component);
    return infoCache.get(name);
  };
  const { guide } = query('guide', 'choosing');
  assert.equal(guide.name, 'Choosing a component');
  assert.equal(guide.docsPath, null);
  assert.deepEqual(guide.choices, componentChoices);
  assert.equal(guide.notes.length, componentChoices.length);
  for (const set of [['Dialog', 'Drawer', 'Sidebar', 'Navbar'], ['Select', 'Autocomplete', 'ButtonSelect', 'SegmentedControl'], ['PathSelector', 'FilePicker'],
    ['Alert', 'CalloutBanner', 'ToastProvider', 'EmptyState'], ['Grid', 'Flex', 'Masonry'], ['Progress', 'Spinner', 'Skeleton'], ['Switch', 'Checkbox'],
    ['Tabs', 'SegmentedControl', 'Navbar'], ['Card', 'TaskCard', 'AgentCard'], ['Stat', 'StatGroup'], ['Timeline', 'Steps', 'ActivityItem'],
    ['TextField', 'TextArea', 'NumberInput', 'Slider'], ['Navbar', 'NavbarItem', 'Breadcrumbs', 'Pagination', 'Tabs'], ['Form', 'FormLayout', 'Fieldset', 'Grid'],
    ['Tooltip', 'Disclosure', 'ButtonSelect'], ['Timeline', 'ActivityItem', 'Conversation', 'AgentActivity'], ['Text', 'Blockquote', 'MarkdownRenderer'],
    ['Card', 'PagePanel', 'CalloutBanner']]) {
    assert.ok(componentChoices.some(choice => set.every(name => choice.options.some(option => option.name === name))), set.join(' vs '));
  }
  for (const { label, options } of componentChoices) {
    assert.ok(guide.notes.includes(`${label}: ${options.map(option => option.reason).join(' ')}`), label);
    for (const { name, reason } of options) {
      assert.ok(names.has(name), name);
      assert.ok(reason.startsWith(`Use ${name} `), reason);
      assert.ok(label.includes(name), `${label} names ${name}`);
    }
  }
  assert.match(guide.notes[0], /Navbar variant="workspace" with leftSidebar or rightSidebar/);
  for (const prop of ['variant', 'leftSidebar', 'rightSidebar']) assert.ok(info('Navbar').props.some(entry => entry.name === prop), prop);
  // seeAlso names real components, and every pair in a set refers to each other with the shared set's reason.
  for (const name of new Set(componentChoices.flatMap(choice => choice.options.map(option => option.name)))) {
    const { seeAlso } = info(name);
    assert.ok(seeAlso.length, name);
    assert.equal(new Set(seeAlso.map(entry => entry.name)).size, seeAlso.length, name);
    for (const entry of seeAlso) {
      assert.ok(names.has(entry.name), `${name} → ${entry.name}`);
      assert.notEqual(entry.name, name);
      assert.ok(info(entry.name).seeAlso.some(back => back.name === name), `${entry.name} → ${name}`);
      const shared = componentChoices.find(choice => [name, entry.name].every(member => choice.options.some(option => option.name === member)));
      assert.equal(entry.reason, shared.options.find(option => option.name === entry.name).reason);
    }
  }
  assert.deepEqual(info('Button').seeAlso, []);
  assert.deepEqual(info('Drawer').seeAlso.map(entry => entry.name), ['Dialog', 'Sidebar', 'Navbar']);
  assert.match(run('info', 'Drawer').stdout, /\nSee also\n- Use Dialog for [^\n]+\n- Use Sidebar for /);
  assert.doesNotMatch(run('info', 'Button').stdout, /See also/);
  for (const term of ['which component', 'vs', 'difference between dialog and drawer', 'choose', 'dialog vs drawer', 'choosing']) {
    assert.equal(query('search', term).results[0]?.id, 'choosing', term);
  }
  assert.equal(failure('guide', 'choosing', '--code').code, 'INVALID_ARGUMENTS');
});

test('token output ranks props, tokens, hooks, then classes for customization', () => {
  const tokenNames = query('token').globalTokens.map(entry => entry.name);
  const global = query('token').customization;
  const order = [/variant, tone, size, and surface/, /--cr-color-\* and --cr-radius-\*.*light-dark\(/, /hooks/, /unlayered CSS against cr- classes/];
  order.forEach((pattern, index) => assert.match(global[index], pattern));
  assert.match(global[1], /--cr-space-\* rarely/);
  assert.match(global[1], /CalloutBanner declares its own semantic/);
  assert.match(global[2], /\.my-feature \.cr-button/);
  const joined = global.join(' ');
  for (const pattern of [/Override brand primitives such as --cr-evergreen only on :root/, /Tooltip renders into the enclosing native dialog or document\.body/, /Toasts render where ToastProvider sits/]) {
    assert.match(joined, pattern);
  }
  for (const name of joined.match(/--cr-[a-z0-9-]*[a-z0-9]\b(?!-?\*)/g) ?? []) assert.ok(tokenNames.includes(name), name);
  // The color guide shares the wrapper example.
  const colorNotes = query('guide', 'color').guide.notes.join(' ');
  assert.ok(colorNotes.includes(global[1].match(/\.my-feature \{[^}]+\}/)[0]));
  assert.match(run('token').stdout, /\nCustomizing\n1\. Start with props/);

  const notes = name => query('token', name).customization;
  assert.match(notes('Button')[0], /^Start with Button's variant and size props/);
  assert.match(notes('Button')[2], /^Then set --button-bg and --button-fg on the selector shown for each, for example \.my-feature \.cr-button, not on a wrapper or :root/);
  assert.match(notes('Navbar')[0], /variant, size, and surface props/);
  assert.match(notes('Avatar')[0], /size and color props/);
  assert.match(notes('Stat')[2], /^Then override --cr-stat-label-color, [^.]+ on a wrapper or on the selector shown: they are read with a fallback/);
  assert.match(notes('CalloutBanner')[1], /CalloutBanner declares its own semantic/);
  assert.doesNotMatch(notes('Button')[1], /CalloutBanner/);
  assert.match(run('token', 'Button').stdout, /- --button-bg = [^\n]+ Selector: \.cr-button\n/);
  assert.match(run('token', 'Stat').stdout, /- --cr-stat-label-color = [^\n]+ Selector: \.cr-stat-label \(read with a fallback, so a wrapper override also works\)\n/);
  const tooltip = notes('Tooltip');
  assert.match(tooltip[0], /Tooltip has no appearance props/);
  assert.match(tooltip[2], /Tooltip has no component styling hooks/);
  // Floating-content scope notes appear only for the components that render it.
  const scoped = { Tooltip: /Tooltip renders into/, TaskCard: /Tooltip renders into/, ToastProvider: /Toasts render where ToastProvider sits/ };
  for (const [name, pattern] of Object.entries(scoped)) assert.match(notes(name).join(' '), pattern, name);
  for (const name of ['Button', 'Dialog', 'Stat']) assert.doesNotMatch(notes(name).join(' '), /Tooltip renders|Toasts render/, name);
  assert.match(notes('Button').join(' '), /brand primitives/);
  assert.doesNotMatch(notes('Stat').join(' '), /brand primitives/);
});

test('customization scope claims match the library CSS and source', () => {
  const css = systemCss();
  const components = query('list').components.map(entry => entry.name);
  const declared = name => new RegExp(`${escape(name)}\\s*:`).test(css);
  for (const name of components) {
    const result = run('token', name, '--format=json');
    if (result.status !== 0) continue;
    for (const entry of JSON.parse(result.stdout).data.componentTokens) {
      if (entry.fallback) {
        assert.ok(!declared(entry.name), `${name}: ${entry.name} is never declared`);
        assert.match(css, new RegExp(`var\\(${escape(entry.name)},`), `${name}: ${entry.name} is read with a fallback`);
      } else {
        assert.ok(declared(entry.name), `${name}: ${entry.name} is declared`);
      }
      // Only CalloutBanner redeclares semantic color tokens below :root.
      if (entry.name.startsWith('--cr-color-')) assert.equal(name, 'CalloutBanner', entry.name);
    }
  }
  const outsideRoot = css.replace(/:root[^{]*\{[^}]*\}/g, '');
  const redeclaring = [...outsideRoot.matchAll(/([^{}]+)\{[^}]*--cr-color-[a-z-]+\s*:/g)].map(match => match[1].trim()).filter(selector => !selector.startsWith('@'));
  assert.ok(redeclaring.length && redeclaring.every(selector => selector.includes('.cr-callout-banner')), redeclaring.join(', '));
  // Button declares its hooks on the base rule, and the rules named as reading primitives do so.
  assert.match(css, /\.cr-button \{ --button-bg: var\(--cr-color-primary\); --button-fg: var\(--cr-color-on-primary\);/);
  assert.match(css, /\.cr-button\[data-variant='accent'\] \{[^}]*var\(--cr-chartreuse\)/);
  assert.match(css, /\.cr-callout-banner \{[^}]*background: var\(--cr-evergreen\)/);
  assert.match(readFileSync(new URL('../src/system/navbar.css', import.meta.url), 'utf8'), /background: var\(--cr-evergreen\)/);
  // Tooltip portals to the enclosing dialog or body; TaskCard is the only component that renders it; toasts render beside the provider's children.
  const tooltipSource = readFileSync(new URL('../src/system/Tooltip.tsx', import.meta.url), 'utf8');
  assert.match(tooltipSource, /closest\('dialog'\) \|\| document\.body/);
  assert.match(tooltipSource, /createPortal\(/);
  const source = readFileSync(new URL('../src/system/components.tsx', import.meta.url), 'utf8');
  const renderers = new Set();
  let current;
  for (const line of source.split('\n')) {
    current = line.match(/^export function (\w+)/)?.[1] ?? current;
    if (line.includes('<Tooltip')) renderers.add(current);
  }
  assert.deepEqual([...renderers], ['TaskCard']);
  assert.match(source, /<ToastContext value=\{notify\}>\{children\}<div className="cr-toast-region">/);
  assert.doesNotMatch(source, /createPortal/);
});

test('info includes the demo example and points to demo in text', () => {
  for (const name of ['PathSelector', 'Button', 'Dialog']) {
    const { component } = query('info', name);
    const demo = query('demo', name);
    assert.deepEqual(component.example, { language: demo.language, code: demo.code }, name);
    assert.equal(component.usage, undefined);
    const text = run('info', name).stdout;
    assert.ok(text.endsWith(`\n\nRun chartreuse demo ${name} for the example.\n`), name);
    assert.ok(!text.includes(demo.code), `${name} text omits the example`);
  }
});

test('a source checkout warns on stderr when the CLI build is older than its sources', () => {
  const root = mkdtempSync(join(tmpdir(), 'chartreuse-cli-'));
  try {
    const message = 'Warning: the CLI build is older than its sources; run npm run build:lib.';
    const warnings = [{ code: 'STALE_BUILD', message }];
    const expected = run('list', '--format=json').stdout;
    const past = new Date(Date.now() - 60_000);
    const future = new Date(Date.now() + 60_000);
    // Lays out a checkout at base: the built CLI in dist/lib and older sources beside it.
    const checkout = (base, { sources = true } = {}) => {
      const built = join(base, 'dist/lib/chartreuse-cli.mjs');
      mkdirSync(join(base, 'dist/lib'), { recursive: true });
      copyFileSync(entry, built);
      const files = ['package.json', 'src/cli/chartreuse-cli.mjs', 'src/docs/catalog.ts', 'src/docs/reference/core.ts', 'src/docs/patterns/settings.css', 'src/docs/PatternPreview.tsx', 'src/system/styles.css'];
      if (sources) {
        for (const file of files) {
          mkdirSync(join(base, file, '..'), { recursive: true });
          writeFileSync(join(base, file), '');
          utimesSync(join(base, file), past, past);
        }
      }
      return { files, exec: (...args) => spawnSync(process.execPath, [built, ...args], { encoding: 'utf8' }) };
    };

    // A CLI with no src beside it, as in an installed package: no warning.
    assert.equal(checkout(join(root, 'bare'), { sources: false }).exec('list', '--format=json').stderr, '');

    const { exec } = checkout(join(root, 'repo'));
    const touch = (file, time) => utimesSync(join(root, 'repo', file), time, time);
    assert.equal(exec('list', '--format=json').stderr, '', 'sources older than the build');
    // src/system is not a CLI input.
    touch('src/system/styles.css', future);
    assert.equal(exec('list').stderr, '');
    for (const file of ['package.json', 'src/cli/chartreuse-cli.mjs', 'src/docs/catalog.ts', 'src/docs/reference/core.ts', 'src/docs/patterns/settings.css', 'src/docs/PatternPreview.tsx']) {
      touch(file, future);
      const text = exec('list');
      assert.equal(text.status, 0);
      assert.equal(text.stderr, `${message}\n`, file);
      touch(file, past);
    }
    touch('src/docs/patterns/settings.css', future);
    // stdout and the JSON data are unchanged; in JSON mode stderr is always JSON.
    const json = exec('list', '--format=json');
    assert.equal(json.stdout, expected);
    assert.deepEqual(JSON.parse(json.stderr), { schemaVersion: 1, chartreuseVersion: manifest.version, warnings });
    assert.equal(json.stderr.trim().split('\n').length, 1);
    const textFailure = exec('info', 'Unknown');
    assert.equal(textFailure.status, 1);
    assert.ok(textFailure.stderr.endsWith(`${message}\n`));
    const jsonFailure = exec('info', 'Unknown', '--format=json');
    assert.equal(jsonFailure.status, 1);
    assert.equal(jsonFailure.stdout, '');
    const document = JSON.parse(jsonFailure.stderr);
    assert.equal(document.error.code, 'COMPONENT_NOT_FOUND');
    assert.deepEqual(document.warnings, warnings);

    // Inside node_modules the CLI never warns, even with src/cli and src/docs beside it.
    const installed = checkout(join(root, 'app/node_modules/@chartreuse/ui'));
    for (const file of installed.files) utimesSync(join(root, 'app/node_modules/@chartreuse/ui', file), future, future);
    assert.equal(installed.exec('list').stderr, '');
    assert.equal(installed.exec('info', 'Unknown', '--format=json').stderr.includes('warnings'), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
