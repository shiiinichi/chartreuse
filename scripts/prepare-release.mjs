import { appendFile, cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const registry = 'https://npm.pkg.github.com';
const identifier = '(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)';
const versionPattern = new RegExp(`^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-${identifier}(?:\\.${identifier})*)?(?:\\+[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?$`);

export function releaseMetadata(source, repository, tag, prerelease = false) {
  if (typeof repository !== 'string' || repository.trim() !== repository || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\/[a-z0-9_.-]+$/i.test(repository)) {
    throw new Error('GITHUB_REPOSITORY must identify the publishing owner/repository.');
  }
  if (typeof source.version !== 'string' || source.version.trim() !== source.version || !versionPattern.test(source.version) || tag !== `v${source.version}`) {
    throw new Error('The release tag must equal v<package.json version> and use a valid semantic version.');
  }

  const owner = repository.split('/')[0].toLowerCase();
  const manifest = {
    ...source,
    name: `@${owner}/chartreuse`,
    repository: { type: 'git', url: `git+https://github.com/${repository}.git` },
    publishConfig: { registry, access: 'restricted' },
  };
  for (const field of ['private', 'scripts', 'devDependencies', 'packageManager']) delete manifest[field];

  return {
    manifest,
    distTag: prerelease || source.version.split('+')[0].includes('-') ? 'next' : 'latest',
  };
}

function exportTargets(value) {
  if (typeof value === 'string') return [value];
  if (value && typeof value === 'object') return Object.values(value).flatMap(exportTargets);
  return [];
}

export async function prepareRelease({ root = process.cwd(), repository, tag, prerelease = false }) {
  const source = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const metadata = releaseMetadata(source, repository, tag, prerelease);
  const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
  if (lock.version !== source.version || lock.packages?.['']?.version !== source.version) {
    throw new Error('package-lock.json must use the same version as package.json.');
  }
  const targets = new Set([source.main, source.module, source.types, ...exportTargets(source.exports)].filter(Boolean));
  for (const target of targets) {
    if (typeof target !== 'string' || !target.startsWith('./dist/lib/') || target.split('/').includes('..')) {
      throw new Error(`Release entry must be inside dist/lib: ${target}`);
    }
    if (!(await stat(path.join(root, target))).isFile()) throw new Error(`Missing release entry: ${target}`);
  }

  const directory = path.join(root, 'dist/github-package');
  await rm(directory, { recursive: true, force: true });
  await mkdir(path.join(directory, 'dist'), { recursive: true });
  await cp(path.join(root, 'dist/lib'), path.join(directory, 'dist/lib'), { recursive: true });
  await cp(path.join(root, 'README.md'), path.join(directory, 'README.md'));
  await writeFile(path.join(directory, 'package.json'), `${JSON.stringify(metadata.manifest, null, 2)}\n`);
  return { ...metadata, directory };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await prepareRelease({
    repository: process.env.GITHUB_REPOSITORY,
    tag: process.env.RELEASE_TAG,
    prerelease: process.env.RELEASE_PRERELEASE === 'true',
  });
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `directory=${result.directory}\nversion=${result.manifest.version}\ndist-tag=${result.distTag}\n`);
  }
  console.log(JSON.stringify({ name: result.manifest.name, version: result.manifest.version, directory: result.directory, distTag: result.distTag }, null, 2));
}
