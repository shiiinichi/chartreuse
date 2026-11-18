import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { prepareRelease, releaseMetadata } from '../scripts/prepare-release.mjs';

const source = {
  name: '@chartreuse/ui', version: '1.0.0', private: true, type: 'module',
  main: './dist/lib/chartreuse.js', types: './dist/lib/index.d.ts',
  exports: { '.': { types: './dist/lib/index.d.ts', import: './dist/lib/chartreuse.js' }, './styles.css': './dist/lib/chartreuse.css' },
  files: ['dist/lib'], scripts: { dev: 'vite' }, devDependencies: { vite: '8.3.5' },
  dependencies: { 'lucide-react': '1.61.0' }, peerDependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
};

test('release metadata scopes the package to its GitHub owner and preserves its consumer contract', () => {
  const { manifest, distTag } = releaseMetadata(source, 'Example-Team/component-library', 'v1.0.0');
  assert.equal(manifest.name, '@example-team/chartreuse');
  assert.equal(manifest.repository.url, 'git+https://github.com/Example-Team/component-library.git');
  assert.equal(manifest.publishConfig.registry, 'https://npm.pkg.github.com');
  assert.deepEqual(manifest.exports, source.exports);
  assert.deepEqual(manifest.peerDependencies, source.peerDependencies);
  assert.deepEqual(manifest.dependencies, source.dependencies);
  for (const field of ['private', 'scripts', 'devDependencies', 'packageManager']) assert.ok(!(field in manifest));
  assert.equal(distTag, 'latest');
  assert.equal(source.private, true, 'preparation does not mutate the source manifest');
});

test('release preparation rejects mismatched tags, invalid versions, and missing repository identity', () => {
  for (const tag of ['main', '1.0.0', 'v1.0.1', 'v1.0.0\n']) {
    assert.throws(() => releaseMetadata(source, 'example/library', tag), /release tag/);
  }
  for (const version of ['01.0.0', '1.0', '1.0.0-beta.01']) {
    assert.throws(() => releaseMetadata({ ...source, version }, 'example/library', `v${version}`), /release tag/);
  }
  for (const repository of [undefined, '', 'example', 'example/library/other', '../library', 'example/library\n']) {
    assert.throws(() => releaseMetadata(source, repository, 'v1.0.0'), /GITHUB_REPOSITORY/);
  }
});

test('prereleases use next and never replace the latest distribution tag', () => {
  for (const version of ['1.1.0-beta.1', '1.1.0-rc.2+build.4']) {
    assert.equal(releaseMetadata({ ...source, version }, 'example/library', `v${version}`).distTag, 'next');
  }
  assert.equal(releaseMetadata(source, 'example/library', 'v1.0.0', true).distTag, 'next');
  assert.equal(releaseMetadata({ ...source, version: '1.0.0+build.4' }, 'example/library', 'v1.0.0+build.4').distTag, 'latest');
});

test('the staged package includes built exports and README without docs, source, or development scripts', async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'chartreuse-release-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'dist/lib'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), JSON.stringify(source));
  await writeFile(path.join(root, 'package-lock.json'), JSON.stringify({ version: source.version, packages: { '': { version: source.version } } }));
  await writeFile(path.join(root, 'README.md'), '# Package documentation');
  for (const name of ['chartreuse.js', 'index.d.ts', 'chartreuse.css']) await writeFile(path.join(root, 'dist/lib', name), name);
  const release = await prepareRelease({ root, repository: 'example/library', tag: 'v1.0.0' });
  const manifest = JSON.parse(await readFile(path.join(release.directory, 'package.json'), 'utf8'));
  assert.equal(manifest.name, '@example/chartreuse');
  assert.equal(await readFile(path.join(release.directory, 'README.md'), 'utf8'), '# Package documentation');
  for (const name of ['chartreuse.js', 'index.d.ts', 'chartreuse.css']) {
    assert.equal(await readFile(path.join(release.directory, 'dist/lib', name), 'utf8'), name);
  }
  assert.deepEqual(JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')), source);
  await rm(path.join(root, 'dist/lib/chartreuse.css'));
  await assert.rejects(prepareRelease({ root, repository: 'example/library', tag: 'v1.0.0' }), /ENOENT/);
  await writeFile(path.join(root, 'package-lock.json'), JSON.stringify({ version: '0.9.0' }));
  await assert.rejects(prepareRelease({ root, repository: 'example/library', tag: 'v1.0.0' }), /package-lock.json/);
});

test('React is a peer dependency so the published library uses the consuming application runtime', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  for (const name of ['react', 'react-dom']) {
    assert.ok(manifest.peerDependencies[name]);
    assert.ok(manifest.devDependencies[name]);
    assert.ok(!(name in manifest.dependencies));
  }
});
