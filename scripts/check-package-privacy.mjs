import { pathToFileURL } from 'node:url';

export async function checkPackagePrivacy({ repository, token, allowMissing = false, request = fetch }) {
  if (!repository || !token) throw new Error('GITHUB_REPOSITORY and GH_TOKEN are required to verify package privacy.');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const get = route => request(`https://api.github.com${route}`, { headers });
  const repoResponse = await get(`/repos/${repository}`);
  if (!repoResponse.ok) throw new Error(`Cannot verify repository privacy: GitHub API returned ${repoResponse.status}.`);
  const repo = await repoResponse.json();
  if (repo.private !== true) throw new Error('Package publishing requires a private repository.');

  const namespace = repo.owner.type === 'Organization' ? 'orgs' : 'users';
  const packageResponse = await get(`/${namespace}/${encodeURIComponent(repo.owner.login)}/packages/npm/chartreuse`);
  if (packageResponse.status === 404 && allowMissing) return { repository, repositoryPrivate: true, packageVisibility: 'not-created' };
  if (!packageResponse.ok) throw new Error(`Cannot verify package privacy: GitHub API returned ${packageResponse.status}.`);
  const pkg = await packageResponse.json();
  if (pkg.visibility !== 'private') throw new Error(`Package visibility must be private; received ${pkg.visibility}.`);
  return { repository, repositoryPrivate: true, packageVisibility: pkg.visibility, packageUrl: pkg.html_url };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(await checkPackagePrivacy({
    repository: process.env.GITHUB_REPOSITORY,
    token: process.env.GH_TOKEN,
    allowMissing: process.argv.includes('--allow-missing'),
  }), null, 2));
}
