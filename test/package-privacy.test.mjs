import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPackagePrivacy } from '../scripts/check-package-privacy.mjs';

function fixture({ repositoryVisibility = 'private', ownerType = 'User', visibility = repositoryVisibility, packageStatus = 200 } = {}) {
  const routes = [];
  return {
    routes,
    repository: 'example/chartreuse', token: 'test-token',
    request: async url => {
      const route = new URL(url).pathname;
      routes.push(route);
      if (route.startsWith('/repos/')) return Response.json({ visibility: repositoryVisibility, owner: { login: 'example', type: ownerType } });
      return Response.json({ visibility, html_url: 'https://github.com/example/chartreuse/packages' }, { status: packageStatus });
    },
  };
}

test('matching private or public packages pass in user and organization repositories', async () => {
  for (const repositoryVisibility of ['private', 'public']) {
    for (const ownerType of ['User', 'Organization']) {
      const options = fixture({ repositoryVisibility, ownerType });
      const result = await checkPackagePrivacy(options);
      assert.equal(result.repositoryPrivate, repositoryVisibility === 'private');
      assert.equal(result.repositoryVisibility, repositoryVisibility);
      assert.equal(result.packageVisibility, repositoryVisibility);
      assert.equal(options.routes[1], `/${ownerType === 'Organization' ? 'orgs' : 'users'}/example/packages/npm/chartreuse`);
    }
  }
});

test('a missing package is allowed only before a private first publication', async () => {
  assert.equal((await checkPackagePrivacy({ ...fixture({ packageStatus: 404 }), allowMissing: true })).packageVisibility, 'not-created');
  await assert.rejects(checkPackagePrivacy(fixture({ packageStatus: 404 })), /404/);
  await assert.rejects(checkPackagePrivacy({ ...fixture({ packageStatus: 403 }), allowMissing: true }), /403/);
  await assert.rejects(checkPackagePrivacy({ ...fixture({ repositoryVisibility: 'public', packageStatus: 404 }), allowMissing: true }), /404/);
});

test('mismatched or unsupported visibility prevents publication', async () => {
  for (const repositoryVisibility of ['private', 'public']) {
    const mismatch = repositoryVisibility === 'private' ? 'public' : 'private';
    for (const visibility of [mismatch, 'internal', null]) {
      await assert.rejects(checkPackagePrivacy(fixture({ repositoryVisibility, visibility })), /Package visibility must match/);
    }
  }
  for (const repositoryVisibility of ['internal', null]) {
    const options = fixture({ repositoryVisibility });
    await assert.rejects(checkPackagePrivacy(options), /Repository visibility must be private or public/);
    assert.equal(options.routes.length, 1);
  }
});

test('post-publication verification checks the visibility approved before publishing', async () => {
  const options = fixture({ repositoryVisibility: 'public' });
  await assert.rejects(checkPackagePrivacy({ ...options, expectedVisibility: 'private' }), /Repository visibility must still be private/);
  assert.equal(options.routes.length, 1);
  const result = await checkPackagePrivacy({ ...fixture({ repositoryVisibility: 'public' }), expectedVisibility: 'public' });
  assert.equal(result.packageVisibility, 'public');
});
