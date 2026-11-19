import { appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export async function checkPackagePrivacy({ repository, token, allowMissing = false, expectedVisibility, request = fetch }) {
  if (!repository || !token) throw new Error('GITHUB_REPOSITORY and GH_TOKEN are required to verify package visibility.');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const get = route => request(`https://api.github.com${route}`, { headers });
  const repoResponse = await get(`/repos/${repository}`);
  if (!repoResponse.ok) throw new Error(`Cannot verify repository visibility. GitHub API returned ${repoResponse.status}.`);
  const repo = await repoResponse.json();
  const repositoryVisibility = repo.visibility;
  if (repositoryVisibility !== 'private' && repositoryVisibility !== 'public') {
    throw new Error(`Repository visibility must be private or public. Received ${repositoryVisibility}.`);
  }
  if (expectedVisibility !== undefined && repositoryVisibility !== expectedVisibility) {
    throw new Error(`Repository visibility must still be ${expectedVisibility}. Received ${repositoryVisibility}.`);
  }

  const result = { repository, repositoryPrivate: repositoryVisibility === 'private', repositoryVisibility };
  const namespace = repo.owner.type === 'Organization' ? 'orgs' : 'users';
  const packageResponse = await get(`/${namespace}/${encodeURIComponent(repo.owner.login)}/packages/npm/chartreuse`);
  if (packageResponse.status === 404 && allowMissing && result.repositoryPrivate) {
    return { ...result, packageVisibility: 'not-created' };
  }
  if (!packageResponse.ok) throw new Error(`Cannot verify package visibility. GitHub API returned ${packageResponse.status}.`);
  const pkg = await packageResponse.json();
  if (pkg.visibility !== repositoryVisibility) {
    throw new Error(`Package visibility must match the ${repositoryVisibility} repository. Received ${pkg.visibility}.`);
  }
  return { ...result, packageVisibility: pkg.visibility, packageUrl: pkg.html_url };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await checkPackagePrivacy({
    repository: process.env.GITHUB_REPOSITORY,
    token: process.env.GH_TOKEN,
    allowMissing: process.argv.includes('--allow-missing'),
    expectedVisibility: process.env.CHARTREUSE_PACKAGE_VISIBILITY,
  });
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `visibility=${result.repositoryVisibility}\n`);
  }
  console.log(JSON.stringify(result, null, 2));
}
