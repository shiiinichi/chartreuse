import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import * as system from '@chartreuse/ui';
import { colors, tokens, spacing } from '@chartreuse/ui/tokens';

test('the built package exposes the documented public components and notification hook', () => {
  const expected = ['Button', 'IconButton', 'BrandMark', 'Badge', 'TextField', 'TextArea', 'Select', 'Checkbox', 'Switch', 'Avatar', 'AvatarGroup', 'Progress', 'Tabs', 'Card', 'Alert', 'Divider', 'Skeleton', 'Spinner', 'Dialog', 'ToastProvider', 'Breadcrumbs', 'TaskCard', 'AgentCard', 'EmptyState', 'Autocomplete', 'MessageComposer', 'Drawer', 'MarkdownRenderer', 'Disclosure', 'Fieldset', 'Form', 'FormLayout', 'Tooltip', 'FilePicker', 'PagePanel', 'CalloutBanner', 'PathSelector', 'Grid', 'GridItem', 'GridSpacer', 'Masonry', 'MasonryItem', 'MasonrySpacer', 'Flex', 'Blockquote', 'ActivityItem', 'Tree', 'AgentActivity', 'SegmentedControl', 'Slider', 'Navbar', 'NavbarItem', 'Sidebar', 'WorkspaceContent', 'WorkspaceLayout', 'Conversation', 'Swimlane', 'NumberInput', 'Stat', 'StatGroup', 'Timeline', 'Steps'];
  // BrandMark and ToastProvider are counted as reusable components, alongside the
  // component-specific APIs. Validate the public boundary, not private helpers.
  for (const name of expected) assert.equal(typeof system[name], 'function', `${name} is importable`);
  const actual = Object.entries(system).filter(([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function').map(([name]) => name).sort();
  assert.deepEqual(actual, [...expected].sort());
  assert.equal(typeof system.useToast, 'function');
  assert.equal(tokens.version, '1.0.0');
});

async function readReferenceModule(filename) {
  const source = await readFile(new URL(`../src/docs/reference/${filename}.ts`, import.meta.url), 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputText).toString('base64')}`);
}

test('every public component has exactly one alphabetical page, API reference, and live preview', async () => {
  const [core, extended, grid, content, tree, activity, segmented, slider, navbar, sidebar, workspaceContent, conversation, swimlane, number, stats, timeline, steps, masonry, flex, form, tooltip, navigation] = await Promise.all(['core', 'extended', 'grid', 'content', 'tree', 'agent-activity', 'segmented-control', 'slider', 'navbar', 'sidebar', 'workspace-content', 'conversation', 'swimlane', 'number-input', 'stats', 'timeline', 'steps', 'masonry', 'flex', 'form', 'tooltip', 'navigation'].map(readReferenceModule));
  const references = [...core.coreReferences, ...extended.extendedReferences, ...grid.gridReferences, ...content.contentReferences, ...tree.treeReferences, ...activity.agentActivityReferences, ...segmented.segmentedControlReferences, ...slider.sliderReferences, ...navbar.navbarReferences, ...sidebar.sidebarReferences, ...workspaceContent.workspaceContentReferences, ...conversation.conversationReferences, ...swimlane.swimlaneReferences, ...number.numberInputReferences, ...stats.statsReferences, ...timeline.timelineReferences, ...steps.stepsReferences, ...masonry.masonryReferences, ...flex.flexReferences, ...form.formReferences, ...tooltip.tooltipReferences];
  const actual = Object.entries(system).filter(([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function').map(([name]) => name).sort((a, b) => a.localeCompare(b));
  assert.deepEqual(references.map(reference => reference.name).sort((a, b) => a.localeCompare(b)), actual);
  assert.equal(new Set(references.map(reference => reference.slug)).size, actual.length, 'each reference has a unique route slug');
  const entries = navigation.createComponentNavigation(references);
  assert.deepEqual(entries.map(entry => entry.label), actual, 'sidebar entries are alphabetical and one-to-one');
  assert.equal(new Set(entries.map(entry => entry.id)).size, actual.length);
  for (const reference of references) {
    assert.match(reference.slug, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
    for (const field of ['summary', 'importCode', 'usageCode']) assert.ok(reference[field]?.trim(), `${reference.name} has ${field}`);
    assert.ok(reference.notes?.length, `${reference.name} has consolidated guidance`);
    assert.equal(new Set(reference.notes.map(note => note.trim())).size, reference.notes.length, `${reference.name} guidance has no duplicate notes`);
    assert.equal(new Set(reference.props.map(prop => prop.name)).size, reference.props.length, `${reference.name} property rows are unique`);
    for (const property of reference.props) {
      assert.ok(property.name.trim() && property.description.trim() && property.type.trim(), `${reference.name}.${property.name} has a complete API row`);
    }
  }
  const source = await readFile(new URL('../src/docs/ComponentPlayground.tsx', import.meta.url), 'utf8');
  const file = ts.createSourceFile('ComponentPlayground.tsx', source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const examples = [];
  function visit(node) {
    if (ts.isSwitchStatement(node) && node.expression.getText(file) === 'name') {
      for (const clause of node.caseBlock.clauses) if (ts.isCaseClause(clause) && ts.isStringLiteral(clause.expression)) examples.push(clause.expression.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  assert.deepEqual(examples.sort((a, b) => a.localeCompare(b)), actual, 'every public component has a targeted preview');
});

test('Navbar preserves native navigation and slot content across widths and variants', () => {
  const h = React.createElement;
  const props = {
    brand: h('a', { href: '/' }, 'Workspace'),
    actions: h('button', { type: 'button' }, 'Search'),
    className: 'workspace-nav',
  };
  const items = [
    h(system.Flex, { align: 'center', wrap: true, gap: 2 },
      h(system.NavbarItem, { href: '/projects', 'aria-current': 'page', className: 'project-link' }, 'Projects'),
      h(system.NavbarItem, { id: 'search-item' }, h('input', { type: 'search', 'aria-label': 'Find a project' })),
    ),
    h('a', { href: '/activity' }, 'Activity'),
  ];
  const comfortable = renderToStaticMarkup(h(system.Navbar, props, ...items));
  const full = renderToStaticMarkup(h(system.Navbar, { ...props, width: 'full', 'aria-label': 'Workspace pages' }, ...items));
  const fullDarkGreen = renderToStaticMarkup(h(system.Navbar, { ...props, width: 'full', variant: 'dark-green', 'aria-label': 'Workspace pages' }, ...items));

  assert.match(comfortable, /^<nav aria-label="Primary" class="cr-navbar workspace-nav" data-width="comfortable" data-variant="default">/);
  assert.match(comfortable, /<a href="\/">Workspace<\/a>.*<a href="\/activity">Activity<\/a>.*<button type="button">Search<\/button>/);
  assert.match(comfortable, /class="cr-flex-layout"[^>]*><a href="\/projects" aria-current="page" class="cr-navbar-item project-link">Projects<\/a>/);
  assert.match(comfortable, /<div id="search-item" class="cr-navbar-item"><input type="search" aria-label="Find a project"\/><\/div>/);
  assert.equal(full, comfortable.replace('aria-label="Primary"', 'aria-label="Workspace pages"').replace('data-width="comfortable"', 'data-width="full"'));
  assert.equal(fullDarkGreen, full.replace('data-variant="default"', 'data-variant="dark-green"'));
});

test('WorkspaceContent supports a main landmark and an embedded section', () => {
  const h = React.createElement;
  const props = { id: 'project-content', className: 'project-body', 'aria-labelledby': 'project-title' };
  const children = h('h2', { id: 'project-title' }, 'Project overview');
  const comfortable = renderToStaticMarkup(h(system.WorkspaceContent, props, children));
  const full = renderToStaticMarkup(h(system.WorkspaceContent, { ...props, as: 'section', width: 'full' }, children));

  assert.match(comfortable, /^<main id="project-content" aria-labelledby="project-title" class="cr-workspace-content project-body" data-width="comfortable">/);
  assert.match(comfortable, /<div class="cr-workspace-content-inner"><h2 id="project-title">Project overview<\/h2><\/div><\/main>$/);
  assert.equal(full, comfortable.replace('<main ', '<section ').replace('data-width="comfortable"', 'data-width="full"').replace('</main>', '</section>'));
});

test('WorkspaceLayout keeps Sidebar and WorkspaceContent as native siblings', () => {
  const h = React.createElement;
  const content = h(system.WorkspaceContent, { width: 'full' }, 'Project overview');
  const sidebar = h(system.Sidebar, { 'aria-label': 'Projects' }, 'Project links');
  const composed = renderToStaticMarkup(h(system.WorkspaceLayout, { id: 'workspace', className: 'project-layout', style: { gap: 12 } }, sidebar, content));
  const contentOnly = renderToStaticMarkup(h(system.WorkspaceLayout, null, content));

  assert.match(composed, /^<div id="workspace" style="gap:12px" class="cr-workspace-layout project-layout"><aside /);
  assert.match(composed, /<\/aside><main class="cr-workspace-content" data-width="full">/);
  assert.match(contentOnly, /^<div class="cr-workspace-layout"><main class="cr-workspace-content" data-width="full">/);
});

test('every exported primitive color and space exists in the distributed CSS', async () => {
  const css = await readFile(new URL('../dist/lib/chartreuse.css', import.meta.url), 'utf8');
  for (const color of Object.values(colors)) {
    assert.ok(css.includes(color.token + ':'), `${color.token} is present`);
  }
  for (const space of spacing) assert.ok(css.includes(`--cr-space-${space.name}:`));
  assert.ok(css.includes('--cr-color-text:'), 'semantic tokens are distributed');
  assert.ok(css.includes('light-dark('), 'both schemes are distributed');
});

test('composed field instances retain unique label, hint, and error relationships', () => {
  const markup = renderToStaticMarkup(React.createElement('form', null,
    React.createElement(system.TextField, { label: 'Task name', name: 'title', hint: 'Make it specific.', required: true }),
    React.createElement(system.TextField, { label: 'Branch', name: 'branch', error: 'Use a valid branch name.' }),
    React.createElement(system.Select, { label: 'Priority', name: 'priority', required: true }, React.createElement('option', null, 'Medium')),
    React.createElement(system.TextArea, { label: 'Notes', name: 'notes', hint: 'Add context.' }),
    React.createElement(system.Autocomplete, { label: 'Workspace', name: 'workspace', options: [{ value: 'workspace-id', label: 'Sample application' }], defaultValue: 'workspace-id', required: true }),
    React.createElement(system.Fieldset, { legend: 'Supporting context', name: 'context', description: 'Keep related files with the task.', hint: 'Choose only the files you need.' }, React.createElement(system.FilePicker, { label: 'Attachments', name: 'attachments', multiple: true, hint: 'Add the review notes.' })),
  ));
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'all control and description IDs are unique');
  for (const match of markup.matchAll(/\b(?:for|aria-describedby|aria-controls)="([^"]+)"/g)) {
    for (const id of match[1].split(' ')) assert.ok(ids.includes(id), `reference ${id} has a target`);
  }
  assert.ok(markup.includes('aria-invalid="true"'));
  assert.ok(markup.includes('required=""'));
  assert.match(markup, /type="hidden"[^>]*name="workspace"[^>]*value="workspace-id"/, 'the form submits the selected ID rather than its display label');
  assert.match(markup, /<fieldset[^>]*>\s*<legend/, 'a native legend is the first child of its fieldset');
  assert.match(markup, /<input(?=[^>]*type="file")(?=[^>]*name="attachments")[^>]*>/, 'file selection retains the native named file input');
});

test('the public React 19 entry can render a composed workspace without a browser', () => {
  const workspace = React.createElement(system.ToastProvider, null,
    React.createElement(system.Card, null,
      React.createElement(system.Tabs, { label: 'Workspace views', items: [
        { value: 'board', label: 'Board', content: React.createElement(system.TaskCard, { taskId: 'A-1', title: '<script>unsafe()</script>', status: 'done', assignees: ['Alex Morgan'] }) },
        { value: 'activity', label: 'Activity', content: 'An update.' },
      ] }),
      React.createElement(system.MarkdownRenderer, null, '## Notes\n\n<script>unsafe()</script>\n\n[Unsafe link](javascript:unsafe())'),
      React.createElement(system.Disclosure, { title: 'Review notes', name: 'review-help', defaultOpen: true }, React.createElement('p', null, 'Keep useful context with the work.')),
    ),
  );
  const markup = renderToStaticMarkup(workspace);
  assert.ok(markup.includes('role="tablist"'));
  assert.ok(markup.includes('role="tabpanel"'));
  assert.ok(markup.includes('hidden=""'), 'inactive content starts hidden');
  assert.ok(markup.includes('&lt;script&gt;unsafe()&lt;/script&gt;'), 'task content stays plain text');
  assert.ok(!markup.includes('<script>'));
  assert.ok(!markup.includes('href="javascript:'), 'Markdown links reject executable URL schemes');
  assert.match(markup, /<details[^>]*name="review-help"[^>]*open=""/, 'disclosures preserve the native open and group attributes');
  assert.ok(markup.includes('<summary'), 'the disclosure uses a native summary trigger');
});

test('Tabs applies the requested size in both variants and defaults to md', () => {
  const items = [{ value: 'board', label: 'Board', content: 'Tasks' }];
  for (const variant of ['line', 'pill']) {
    for (const size of [undefined, 'sm', 'md', 'lg']) {
      const markup = renderToStaticMarkup(React.createElement(system.Tabs, { label: 'Workspace views', items, variant, size }));
      assert.match(markup, new RegExp(`class="cr-tabs"[^>]* data-size="${size ?? 'md'}"`));
    }
  }
});

test('a button inside a form is non-submitting unless explicitly requested', () => {
  const markup = renderToStaticMarkup(React.createElement('form', null,
    React.createElement(system.Button, null, 'Cancel'),
    React.createElement(system.Button, { type: 'submit' }, 'Create task'),
    React.createElement(system.Button, { loading: true }, 'Saving…'),
  ));
  assert.match(markup, /type="button"[^>]*>Cancel/);
  assert.match(markup, /type="submit"[^>]*>Create task/);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /aria-busy="true"/);
});

test('agent activity preserves output text and does not infer successful completion', () => {
  const markup = renderToStaticMarkup(React.createElement(system.AgentActivity, { events: [
    { id: 'link', title: 'Read linked output', kind: 'command', status: 'completed', output: '\u001b]8;;https://example.com\u001b\\link text\u001b]8;;\u001b\\', defaultOpen: true },
    { id: 'failure', title: 'Check a result', status: 'completed', exitCode: 1, output: '<script>unsafe()</script>' },
    { id: 'missing', title: 'Unrecorded completion' },
    { id: 'stopped', title: 'Stopped step', status: 'interrupted' },
  ] }));
  assert.ok(markup.includes('link text'), 'removing terminal link escapes retains visible link text');
  assert.ok(!markup.includes('\u001b'), 'terminal decoration is not exposed');
  assert.match(markup, /data-status="failed"/, 'nonzero exit status overrides a reported completed state');
  assert.match(markup, /data-status="info"/, 'an absent status remains an informational event');
  assert.match(markup, /data-status="interrupted"/, 'interrupted work remains distinct');
  assert.ok(markup.includes('&lt;script&gt;unsafe()&lt;/script&gt;'));
  assert.ok(!markup.includes('<script>'), 'activity output is text');
});

test('agent activity uses its title as detail text when description and output are absent', () => {
  const title = 'Review finished';
  const cases = [
    [{}, title],
    [{ output: '' }, title],
    [{ output: '\u001b[0m\n' }, title],
    [{ description: 'Checked the supporting files', output: '' }, 'Checked the supporting files'],
  ];

  for (const [fields, detailText] of cases) {
    const markup = renderToStaticMarkup(React.createElement(system.AgentActivity, {
      events: [{ id: 'review', title, ...fields }],
    }));
    assert.match(markup, /<summary class="cr-agent-activity-row">/);
    assert.ok(markup.includes(`<p class="cr-agent-activity-description">${detailText}</p>`));
    assert.doesNotMatch(markup, /<dt>Output<\/dt>/);
  }
});

test('conversation defaults to safe agent Markdown and plain user text', () => {
  const markup = renderToStaticMarkup(React.createElement(system.Conversation, { messages: [
    { id: 'user', role: 'user', body: '**Keep this literal**' },
    { id: 'agent', role: 'agent', body: '**Important**\n\n<script>unsafe()</script>\n\n[Bad link](javascript:unsafe())' },
  ] }));
  assert.ok(markup.includes('**Keep this literal**'), 'user messages retain plain-text formatting');
  assert.ok(markup.includes('<strong>Important</strong>'), 'agent bodies render Markdown');
  assert.ok(!markup.includes('<script>'));
  assert.ok(!markup.includes('href="javascript:'), 'message links retain the Markdown renderer URL policy');
});

test('distributed tokens preserve the documented brand palette', () => {
  assert.deepEqual({ evergreen: tokens.colors.evergreen, chartreuse: tokens.colors.chartreuse, paper: tokens.colors.paper, canvas: tokens.colors.canvas, muted: tokens.colors.muted, border: tokens.colors.border }, {
    evergreen: '#024340', chartreuse: '#DBFFAD', paper: '#FFFDF6', canvas: '#F2F0E6', muted: '#52645F', border: '#CECCC3',
  });
  assert.ok(spacing.every(space => space.value % 4 === 0));
});
