import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Navbar, NavbarItem } from '@chartreuse/ui';

const h = React.createElement;

test('workspace Navbar flanks its navigation and content with independently controlled sidebars', () => {
  const markup = renderToStaticMarkup(h(Navbar, {
    variant: 'workspace',
    surface: 'evergreen',
    id: 'project-navbar',
    'aria-label': 'Project navigation',
    workspaceProps: { id: 'project-workspace', style: { blockSize: 480 } },
    workspaceContent: h('main', null, 'Project overview'),
    brand: h('a', { href: '/' }, 'Studio'),
    actions: h('a', { href: '/account' }, 'Account'),
    leftSidebar: {
      label: 'Projects', id: 'project-directory', defaultOpen: true, storageKey: 'test:projects',
      toggleIcon: h('svg', { 'data-custom-toggle': 'projects', tabIndex: 0 }),
      openToggleIcon: h('svg', { 'data-custom-toggle': 'projects-open', tabIndex: 0 }),
      header: h('h2', null, 'Project directory'), children: 'Project links', footer: 'Add a project',
    },
    rightSidebar: { label: 'Activity', children: 'Recent updates', toggleIcon: h('svg', { 'data-custom-toggle': 'activity' }), openToggleIcon: h('svg', { 'data-custom-toggle': 'activity-open' }) },
  }, h(NavbarItem, { href: '/overview', 'aria-current': 'page' }, 'Overview')));

  assert.match(markup, /^<div\b(?=[^>]* id="project-workspace")(?=[^>]* style="block-size:480px")/);
  const nav = markup.match(/<nav\b[^>]*>.*?<\/nav>/)?.[0];
  assert.ok(nav);
  assert.match(nav, /^<nav\b(?=[^>]* id="project-navbar")(?=[^>]* aria-label="Project navigation")(?=[^>]* data-variant="workspace")(?=[^>]* data-surface="evergreen")/);
  assert.match(nav, /aria-label="Projects".*>Studio<.*aria-current="page"[^>]*>Overview<.*>Account<.*aria-label="Activity"/);
  assert.doesNotMatch(nav, /<(aside|main)\b/, 'workspace regions live outside the navigation landmark');
  const toggles = [...nav.matchAll(/<button\b[^>]*>.*?<\/button>/g)].map(([button]) => button);
  assert.equal(toggles.length, 2);
  assert.match(toggles[0], /^<button\b(?=[^>]* type="button")(?=[^>]* aria-controls="project-directory")(?=[^>]* aria-expanded="true")/);
  const customIcon = toggles[0].match(/<svg\b[^>]*>/)?.[0];
  assert.ok(customIcon);
  assert.match(customIcon, /data-custom-toggle="projects-open"/, 'an open sidebar shows its open toggle icon');
  assert.match(customIcon, /aria-hidden="true"/);
  assert.doesNotMatch(customIcon, /tabindex=/i);
  assert.match(toggles[1], /aria-expanded="false"/);
  assert.match(toggles[1], /data-custom-toggle="activity"/, 'a closed sidebar shows toggleIcon');
  const activityId = toggles[1].match(/aria-controls="([^"]+)"/)?.[1];
  assert.ok(activityId);
  assert.notEqual(activityId, 'project-directory');

  const asides = [...markup.matchAll(/<aside\b[^>]*>.*?<\/aside>/g)].map(([aside]) => aside);
  assert.equal(asides.length, 2);
  assert.doesNotMatch(asides.join(''), /data-surface=/);
  assert.match(asides[0], /^<aside\b(?=[^>]* id="project-directory")(?=[^>]* aria-label="Projects")(?![^>]* hidden(?:[\s=>]))/);
  assert.match(asides[0], /<header\b.*>Project directory<.*Project links.*<footer\b[^>]*>Add a project<\/footer>/);
  assert.doesNotMatch(markup, /aria-pressed=|"Pin /, 'sidebars have no pin control');
  assert.match(asides[1], /^<aside\b(?=[^>]* aria-label="Activity")(?=[^>]* hidden="")/);
  assert.ok(asides[1].includes(` id="${activityId}"`));
  assert.match(asides[1], /Recent updates/);
  assert.match(markup, /^<div\b[^>]*><aside\b.*?<\/aside><div\b[^>]*><nav\b.*?<\/nav>.*?<main>Project overview<\/main>.*?<\/div><aside\b.*?<\/aside><\/div>$/);
});

test('workspace Navbar supports one sidebar with controlled state and distinct generated IDs', () => {
  const workspace = h(Navbar, {
    variant: 'workspace',
    rightSidebar: {
      label: 'Inspector', children: 'Details',
      open: true, defaultOpen: false, onOpenChange: () => {},
    },
  });
  const markup = renderToStaticMarkup(h(React.Fragment, null, workspace, workspace));
  const toggles = [...markup.matchAll(/<button\b(?=[^>]* aria-label="Inspector")[^>]*>/g)].map(([button]) => button);
  const panels = [...markup.matchAll(/<aside\b[^>]*>/g)].map(([aside]) => aside);
  assert.equal(toggles.length, 2);
  assert.equal(panels.length, 2);
  const ids = toggles.map(toggle => {
    assert.match(toggle, /aria-expanded="true"/);
    const id = toggle.match(/aria-controls="([^"]+)"/)?.[1];
    assert.ok(id);
    return id;
  });
  assert.equal(new Set(ids).size, 2);
  for (const [index, panel] of panels.entries()) {
    assert.ok(panel.includes(` id="${ids[index]}"`));
    assert.doesNotMatch(panel, / hidden(?:[\s=>])/);
  }
});

test('workspace-only props stay out of the existing Navbar variants', () => {
  for (const variant of ['default', 'dark-green']) {
    const children = h(NavbarItem, { href: '/work' }, 'Work');
    const baseline = renderToStaticMarkup(h(Navbar, { variant }, children));
    const withWorkspaceProps = renderToStaticMarkup(h(Navbar, {
      variant,
      workspaceProps: { id: 'workspace' },
      workspaceContent: h('main', null, 'Overview'),
      leftSidebar: { label: 'Projects', children: 'Project links' },
      rightSidebar: { label: 'Activity', children: 'Recent updates' },
    }, children));
    assert.equal(withWorkspaceProps, baseline);
  }
});

test('the CLI describes the workspace Navbar variant and its layout props', () => {
  const entry = fileURLToPath(new URL('../dist/lib/chartreuse-cli.mjs', import.meta.url));
  const response = JSON.parse(execFileSync(process.execPath, [entry, 'info', 'Navbar', '--format=json'], { encoding: 'utf8' }));
  const props = new Map(response.data.component.props.map(prop => [prop.name, prop.type]));
  assert.match(props.get('variant') ?? '', /\bworkspace\b/);
  assert.match(props.get('surface') ?? '', /'white' \| 'evergreen'/);
  for (const name of ['workspaceProps', 'workspaceContent', 'leftSidebar', 'rightSidebar']) {
    assert.ok(props.has(name), `Navbar documents ${name}`);
  }
});
