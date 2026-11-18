import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPackagePrivacy } from '../scripts/check-package-privacy.mjs';

function fixture({ privateRepo = true, ownerType = 'User', visibility = 'private', packageStatus = 200 } = {}) {
  const routes = [];
  return {
    routes,
    repository: 'example/chartreuse', token: 'test-token',
    request: async url => {
      const route = new URL(url).pathname;
      routes.push(route);
      if (route.startsWith('/repos/')) return Response.json({ private: privateRepo, owner: { login: 'example', type: ownerType } });
      return Response.json({ visibility, html_url: 'https://github.com/example/chartreuse/packages' }, { status: packageStatus });
    },
  };
}

test('private user and organization packages pass the release privacy check', async () => {
  for (const ownerType of ['User', 'Organization']) {
    const options = fixture({ ownerType });
    const result = await checkPackagePrivacy(options);
    assert.equal(result.repositoryPrivate, true);
    assert.equal(result.packageVisibility, 'private');
    assert.equal(options.routes[1], `/${ownerType === 'Organization' ? 'orgs' : 'users'}/example/packages/npm/chartreuse`);
  }
});

test('a missing package is allowed only before its first publication', async () => {
  assert.equal((await checkPackagePrivacy({ ...fixture({ packageStatus: 404 }), allowMissing: true })).packageVisibility, 'not-created');
  await assert.rejects(checkPackagePrivacy(fixture({ packageStatus: 404 })), /404/);
  await assert.rejects(checkPackagePrivacy({ ...fixture({ packageStatus: 403 }), allowMissing: true }), /403/);
});

test('public repositories and non-private packages prevent publication', async () => {
  const publicRepo = fixture({ privateRepo: false });
  await assert.rejects(checkPackagePrivacy(publicRepo), /private repository/);
  assert.equal(publicRepo.routes.length, 1);
  for (const visibility of ['public', 'internal', undefined]) {
    const options = fixture();
    options.request = async url => new URL(url).pathname.startsWith('/repos/')
      ? Response.json({ private: true, owner: { login: 'example', type: 'User' } })
      : Response.json({ visibility });
    await assert.rejects(checkPackagePrivacy(options), /visibility must be private/);
  }
});
