import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { Navbar, NavbarItem, NavbarItemGroup } from '@chartreuse/ui';

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

test('NavbarItemGroup keeps segmented page switcher items as native links with the current page marked', () => {
  const icon = props => h('svg', { ...props, 'data-icon': 'board' });
  const markup = renderToStaticMarkup(h(Navbar, { surface: 'evergreen', 'aria-label': 'Dashboard' },
    h(NavbarItemGroup, { variant: 'segmented', 'aria-label': 'Pages', className: 'pages' },
      h(NavbarItem, { href: '/board', icon, 'aria-current': 'page' }, 'Board'),
      h(NavbarItem, { href: '/agents', icon, target: '_blank' }, 'Agents'))));
  const group = markup.match(/<div\b[^>]*class="cr-navbar-item-group pages"[^>]*>/)?.[0];
  assert.ok(group);
  assert.match(group, /^<div\b(?=[^>]* role="group")(?=[^>]* aria-label="Pages")(?=[^>]* data-variant="segmented")(?![^>]* data-icon-only)/);
  const links = [...markup.matchAll(/<a\b[^>]*>.*?<\/a>/g)].map(([link]) => link);
  assert.equal(links.length, 2);
  assert.match(links[0], /^<a\b(?=[^>]* href="\/board")(?=[^>]* aria-current="page")(?=[^>]* class="cr-navbar-item")(?=[^>]* data-icon="")(?![^>]* title=)/);
  assert.match(links[0], /<svg\b(?=[^>]* aria-hidden="true")[^>]*><\/svg><span class="cr-navbar-item-label">Board<\/span><\/a>$/);
  assert.match(links[1], /^<a\b(?=[^>]* target="_blank")(?![^>]* aria-current)/);
  assert.doesNotMatch(markup, /type="radio"|role="radio"|tabindex/, 'items are links in normal tab order, not a radio group');
});

test('iconOnly NavbarItemGroup keeps each label as the accessible name and title', () => {
  const icon = props => h('svg', props);
  const markup = renderToStaticMarkup(h(NavbarItemGroup, { variant: 'segmented', iconOnly: true },
    h(NavbarItem, { href: '/board', icon }, 'Board'),
    h(NavbarItem, { href: '/agents', icon, title: 'Agent runs' }, 'Agents'),
    h(NavbarItem, { href: '/help' }, 'Help')));
  assert.match(markup, /^<div\b(?=[^>]* data-icon-only="true")(?![^>]* role=)/, 'an unnamed group needs no role');
  assert.match(markup, /<a\b(?=[^>]* href="\/board")(?=[^>]* title="Board")[^>]*><svg\b[^>]*><\/svg><span class="cr-navbar-item-label">Board<\/span>/);
  assert.match(markup, /<a\b(?=[^>]* href="\/agents")(?=[^>]* title="Agent runs")/, 'a supplied title wins');
  assert.match(markup, /<a\b(?=[^>]* href="\/help")(?![^>]* title=)(?![^>]* data-icon)[^>]*>Help<\/a>/, 'an item without an icon keeps its visible label');
});

test('NavbarItem without an icon renders the same markup as before', () => {
  assert.equal(renderToStaticMarkup(h(NavbarItem, { href: '/work', 'aria-current': 'page' }, 'Work')), '<a href="/work" aria-current="page" class="cr-navbar-item">Work</a>');
  assert.equal(renderToStaticMarkup(h(NavbarItem, null, 'Status')), '<div class="cr-navbar-item">Status</div>');
});

test('segmented NavbarItemGroup CSS nests its radii, styles both surfaces, and shows focus', () => {
  const css = readFileSync(new URL('../src/system/navbar.css', import.meta.url), 'utf8');
  const block = selector => {
    const start = css.indexOf(`${selector} {`);
    assert.ok(start >= 0, selector);
    return css.slice(start, css.indexOf('}', start));
  };
  const group = ".cr-navbar-item-group[data-variant='segmented']";
  const item = `${group} > :is(.cr-navbar-item:where(a), :where(a))`;
  assert.match(block(group), /--cr-navbar-segment-radius: calc\(var\(--cr-radius-md\) \+ 4px\);[^}]*--cr-navbar-segment-current-shadow: var\(--cr-shadow-sm\);[^}]*border-radius: var\(--cr-navbar-segment-radius\);/s);
  assert.match(block(item), /border-radius: var\(--cr-radius-md\);/);
  assert.match(block(item), /min-block-size: calc\(var\(--_cr-navbar-item-height, 2\.5rem\) - 2 \* var\(--_cr-navbar-segment-inset\)\);/);
  const evergreen = block(`:where(.cr-navbar:is([data-surface='evergreen'], [data-variant='dark-green']:not([data-surface]))) ${group}`);
  assert.match(evergreen, /--cr-navbar-segment-track-bg: color-mix\(in srgb, var\(--cr-paper\) 8%, transparent\);/);
  assert.match(evergreen, /--cr-navbar-segment-current-bg: var\(--cr-evergreen-light\);/);
  assert.match(evergreen, /--cr-navbar-segment-current-fg: var\(--cr-paper\);/);
  assert.match(block(`${item}[aria-current='page']`), /background: var\(--cr-navbar-segment-current-bg\);/);
  assert.match(block(`${item}:focus-visible`), /outline: 2px solid var\(--cr-color-focus\);/);
});
