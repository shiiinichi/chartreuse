import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
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
