import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import * as system from '@chartreuse/ui';
import { colors, tokens, spacing } from '@chartreuse/ui/tokens';

test('the built package exposes the documented public components and notification hook', () => {
  const expected = ['Button', 'ButtonSelect', 'IconButton', 'BrandMark', 'Badge', 'Text', 'TextField', 'TextArea', 'Select', 'Checkbox', 'Switch', 'Avatar', 'AvatarGroup', 'Progress', 'Tabs', 'Card', 'Alert', 'Divider', 'Skeleton', 'Spinner', 'Dialog', 'ToastProvider', 'Breadcrumbs', 'TaskCard', 'AgentCard', 'EmptyState', 'Autocomplete', 'MessageComposer', 'Drawer', 'MarkdownRenderer', 'Disclosure', 'Fieldset', 'Form', 'FormLayout', 'Tooltip', 'FilePicker', 'PagePanel', 'CalloutBanner', 'PathSelector', 'Grid', 'GridItem', 'GridSpacer', 'Masonry', 'MasonryItem', 'MasonrySpacer', 'Flex', 'Blockquote', 'List', 'ActivityItem', 'Tree', 'AgentActivity', 'SegmentedControl', 'Slider', 'Navbar', 'NavbarItem', 'NavbarItemGroup', 'Sidebar', 'WorkspaceContent', 'WorkspaceLayout', 'Conversation', 'Swimlane', 'SwimlaneGroup', 'ToggleChip', 'ChipGroup', 'SegmentedProgress', 'NumberInput', 'Stat', 'StatGroup', 'Timeline', 'Steps', 'Table', 'Pagination'];
  // BrandMark and ToastProvider are counted as reusable components, alongside the
  // component-specific APIs. Validate the public boundary, not private helpers.
  for (const name of expected) assert.equal(typeof system[name], 'function', `${name} is importable`);
  const actual = Object.entries(system).filter(([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function').map(([name]) => name).sort();
  assert.deepEqual(actual, [...expected].sort());
  assert.equal(typeof system.useToast, 'function');
  assert.equal(tokens.version, '1.0.0');
});

test('Button icon slots render decorative SVGs without a tabindex', () => {
  const h = React.createElement;
  const markup = renderToStaticMarkup(h(system.Button, {
    icon: props => h('svg', props),
    iconRight: h('svg', { tabIndex: 0 }),
  }, 'Continue'));
  const icons = markup.match(/<svg\b[^>]*>/g) ?? [];

  assert.equal(icons.length, 2);
  for (const icon of icons) {
    assert.match(icon, /aria-hidden="true"/);
    assert.match(icon, /focusable="false"/);
    assert.doesNotMatch(icon, /\btabindex=/i);
  }
});

test('Button link variant stays a native button and its CSS removes control spacing', async () => {
  const h = React.createElement;
  const markup = renderToStaticMarkup(h(system.Button, { variant: 'link', icon: props => h('svg', props), 'aria-pressed': true }, 'Undo'));
  assert.match(markup, /^<button aria-pressed="true" type="button" class="cr-button" data-variant="link" data-size="md">/);
  assert.match(markup, /<svg[^>]*aria-hidden="true"[^>]*><\/svg>Undo<\/button>$/);
  assert.match(renderToStaticMarkup(h(system.Button, { variant: 'link', type: 'submit', disabled: true }, 'Send')), /<button type="submit" disabled="" class="cr-button" data-variant="link"/);

  const css = await readFile(new URL('../src/system/styles.css', import.meta.url), 'utf8');
  const rule = selector => css.match(new RegExp(`^\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`, 'm'))?.[1] ?? '';
  const base = rule(".cr-button[data-variant='link']");
  for (const declaration of ['padding: 0', 'min-block-size: 0', 'min-inline-size: 0', 'border: 0', 'font: inherit', '--button-bg: transparent', '--button-fg: var(--cr-color-success)', 'text-decoration: none'])
    assert.ok(base.includes(declaration), declaration);
  assert.match(rule(".cr-button[data-variant='link']:hover:not(:disabled)"), /^ background: transparent; box-shadow: none; $/);
  assert.match(rule(".cr-button[data-variant='link']:focus-visible"), /outline: 2px solid var\(--cr-color-focus\)/);
  // The link rules must follow the size rules, which set padding and height at equal specificity.
  assert.ok(css.indexOf(".cr-button[data-variant='link'] {") > css.indexOf(".cr-button[data-size='lg'] {"));
  assert.match(css, /@media \(forced-colors: active\) \{\s*\.cr-button\[data-variant='link'\] \{ color: LinkText; \}/);
});

test('ButtonSelect preserves Button styling and connects the trigger to arbitrary controls', () => {
  const h = React.createElement;
  const buttonProps = { variant: 'accent', size: 'lg', className: 'column-toggle', style: { '--button-bg': 'rebeccapurple' }, iconRight: h('svg'), name: 'intent', value: 'columns' };
  const buttonMarkup = renderToStaticMarkup(h(system.Button, buttonProps, 'Columns'));
  const markup = renderToStaticMarkup(h(system.ButtonSelect, {
    ...buttonProps,
    panelClassName: 'column-picker',
    checkmark: true,
    options: [{ value: 'grid', label: 'Grid view' }],
    content: ({ close }) => h('div', { role: 'group', 'aria-label': 'Visible columns' },
      h(system.Checkbox, { label: 'Owner', defaultChecked: true }),
      h(system.Button, { onClick: close }, 'Done')),
  }, 'Columns'));

  const panelId = markup.match(/popovertarget="([^"]+)"/i)?.[1];
  assert.ok(panelId);
  assert.ok(markup.includes(`aria-controls="${panelId}" aria-expanded="false"`));
  assert.ok(markup.includes(`id="${panelId}" popover="auto" class="cr-button-select-panel column-picker"`));
  assert.match(markup, /class="cr-button cr-button-select-trigger column-toggle"/);
  assert.match(markup, /<span class="cr-button-select-label">Columns<\/span><svg/);
  assert.equal(markup.slice(0, markup.indexOf('</button>') + '</button>'.length)
    .replace(' cr-button-select-trigger', '')
    .replace('<span class="cr-button-select-label">Columns</span>', 'Columns')
    .replace(/ popovertarget="[^"]+" aria-controls="[^"]+" aria-expanded="false"/i, ''), buttonMarkup);
  assert.match(markup, /role="group" aria-label="Visible columns"/);
  assert.match(markup, /type="checkbox"/);
  assert.doesNotMatch(markup, /Grid view|role="listbox"/);
});

test('ButtonSelect options render the shared listbox and selected label', () => {
  const markup = renderToStaticMarkup(React.createElement(system.ButtonSelect, {
    'aria-label': 'View layout',
    defaultValue: 'grid',
    options: [
      { value: 'grid', label: 'Grid', description: 'Cards in columns' },
      { value: 'board', label: 'Board', disabled: true },
    ],
  }));

  const trigger = markup.match(/<button\b[^>]*>/)?.[0] ?? '';
  const panelId = trigger.match(/popovertarget="([^"]+)"/i)?.[1];
  assert.ok(panelId);
  assert.ok(trigger.includes(`aria-controls="${panelId}"`));
  assert.match(trigger, /role="combobox"/);
  assert.match(markup, /<span class="cr-button-select-label">Grid<\/span>/);
  assert.match(markup, /role="listbox" aria-label="View layout"/);
  assert.match(markup, /class="[^"]*\bcr-option-list-popup\b/);
  assert.match(markup, /Cards in columns/);
  const options = markup.match(/<div\b[^>]*\brole="option"[^>]*>/g) ?? [];
  assert.equal(options.length, 2);
  assert.match(options[0], /aria-selected="false"/);
  assert.match(options[1], /aria-disabled="true"/);
  assert.doesNotMatch(markup, /\bcr-option-list-checkmark\b/);
});

test('built-in pickers can show the standard checkmark or a custom selection icon', () => {
  const h = React.createElement;
  const options = [
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board' },
  ];
  const customIcon = h('svg', { className: 'custom-selection-icon', 'aria-hidden': false, tabIndex: 0 });
  const pickers = [
    [system.Autocomplete, { label: 'View layout' }],
    [system.ButtonSelect, { 'aria-label': 'View layout' }],
  ];
  for (const [Component, props] of pickers) {
    const render = checkmark => renderToStaticMarkup(h(Component, {
      ...props, defaultValue: 'grid', options, checkmark,
    }));
    assert.doesNotMatch(render(undefined), /\bcr-option-list-checkmark\b/);
    assert.doesNotMatch(render(false), /\bcr-option-list-checkmark\b/);
    assert.match(render(true), /\blucide-check\b/);
    const rows = render(customIcon).match(/<div\b[^>]*\brole="option"[^>]*>.*?<\/div>/g) ?? [];
    assert.equal(rows.length, 2);
    const icon = rows[0].match(/<svg\b[^>]*>/)?.[0] ?? '';
    assert.match(icon, /\bclass="custom-selection-icon cr-option-list-checkmark"/);
    assert.match(icon, /aria-hidden="true"/);
    assert.match(icon, /focusable="false"/);
    assert.doesNotMatch(icon, /\btabindex=/i);
    assert.doesNotMatch(rows[1], /<svg\b/);
  }
});

async function readReferenceModule(filename) {
  const source = await readFile(new URL(`../src/docs/reference/${filename}.ts`, import.meta.url), 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputText).toString('base64')}`);
}

test('every public component has exactly one alphabetical page, API reference, and live preview', async () => {
  const [core, extended, grid, content, tree, activity, segmented, slider, navbar, sidebar, workspaceContent, conversation, swimlane, number, stats, timeline, steps, masonry, flex, form, tooltip, navigation, table, pagination, chips] = await Promise.all(['core', 'extended', 'grid', 'content', 'tree', 'agent-activity', 'segmented-control', 'slider', 'navbar', 'sidebar', 'workspace-content', 'conversation', 'swimlane', 'number-input', 'stats', 'timeline', 'steps', 'masonry', 'flex', 'form', 'tooltip', 'navigation', 'table', 'pagination', 'chips'].map(readReferenceModule));
  const references = [...core.coreReferences, ...extended.extendedReferences, ...grid.gridReferences, ...content.contentReferences, ...tree.treeReferences, ...activity.agentActivityReferences, ...segmented.segmentedControlReferences, ...slider.sliderReferences, ...navbar.navbarReferences, ...sidebar.sidebarReferences, ...workspaceContent.workspaceContentReferences, ...conversation.conversationReferences, ...swimlane.swimlaneReferences, ...number.numberInputReferences, ...stats.statsReferences, ...timeline.timelineReferences, ...steps.stepsReferences, ...masonry.masonryReferences, ...flex.flexReferences, ...form.formReferences, ...tooltip.tooltipReferences, ...table.tableReferences, ...pagination.paginationReferences, ...chips.chipReferences];
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

test('Navbar preserves native navigation and slot content across sizes, widths, and variants', () => {
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
  const largeFullDarkGreen = renderToStaticMarkup(h(system.Navbar, { ...props, size: 'lg', width: 'full', variant: 'dark-green', 'aria-label': 'Workspace pages' }, ...items));

  assert.match(comfortable, /^<nav aria-label="Primary" class="cr-navbar workspace-nav" data-width="comfortable" data-variant="default" data-size="md">/);
  assert.match(comfortable, /<a href="\/">Workspace<\/a>.*<a href="\/activity">Activity<\/a>.*<button type="button">Search<\/button>/);
  assert.match(comfortable, /class="cr-flex-layout"[^>]*><a href="\/projects" aria-current="page" class="cr-navbar-item project-link">Projects<\/a>/);
  assert.match(comfortable, /<div id="search-item" class="cr-navbar-item"><input type="search" aria-label="Find a project"\/><\/div>/);
  assert.equal(full, comfortable.replace('aria-label="Primary"', 'aria-label="Workspace pages"').replace('data-width="comfortable"', 'data-width="full"'));
  assert.equal(largeFullDarkGreen, full.replace('data-variant="default"', 'data-variant="dark-green"').replace('data-size="md"', 'data-size="lg"'));
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

test('Breadcrumbs defaults to decorative chevrons and accepts custom separators', () => {
  const items = [
    { label: 'Workspace', href: '/workspace' },
    { label: 'Tasks', href: '/tasks' },
    { label: 'Review', href: '/tasks/review' },
  ];
  const render = props => renderToStaticMarkup(React.createElement(system.Breadcrumbs, { items, ...props }));

  const defaults = render();
  assert.equal(defaults.match(/aria-hidden="true"><svg[^>]+cr-breadcrumbs-chevron/g)?.length, 2);
  assert.match(defaults, /<li><span aria-current="page">Review<\/span><\/li><\/ol><\/nav>$/);
  assert.equal(render({ separator: '/' }).match(/aria-hidden="true">\/<\/span>/g)?.length, 2);
  assert.equal(render({ separator: React.createElement('b', null, '·') }).match(/aria-hidden="true"><b>·<\/b><\/span>/g)?.length, 2);
  assert.doesNotMatch(render({ separator: null }), /<svg/);
  assert.doesNotMatch(render({ items: items.slice(-1) }), /cr-breadcrumbs-separator/);
});

test('EmptyState defaults to centered content and supports alignment in both variants', () => {
  const render = props => renderToStaticMarkup(React.createElement(system.EmptyState, {
    title: 'No tasks yet',
    description: 'Create your first task.',
    action: React.createElement('button', { type: 'button' }, 'Create task'),
    ...props,
  }));

  const defaults = render();
  assert.match(defaults, /data-variant="default" data-align="center"/);
  assert.match(defaults, /<svg[^>]*width="26"/);

  for (const variant of ['default', 'dashed']) {
    for (const align of ['start', 'center', 'end']) {
      const markup = render({ variant, align });
      assert.match(markup, new RegExp(`data-variant="${variant}" data-align="${align}"`));
      assert.match(markup, /<svg[^>]*aria-hidden="true"/);
      assert.match(markup, /<h3 class="cr-text" data-size="heading-3">No tasks yet<\/h3><p class="cr-text" data-size="body">Create your first task\.<\/p><button type="button">Create task<\/button>/);
    }
  }
});

test('Tabs applies the requested variant and size and defaults to line and md', () => {
  const items = [{ value: 'board', label: 'Board', content: 'Tasks' }];
  for (const variant of [undefined, 'line', 'pill', 'highlight']) {
    for (const size of [undefined, 'sm', 'md', 'lg']) {
      const markup = renderToStaticMarkup(React.createElement(system.Tabs, { label: 'Workspace views', items, variant, size }));
      assert.match(markup, new RegExp(`class="cr-tabs" data-variant="${variant ?? 'line'}" data-size="${size ?? 'md'}"`));
    }
  }
});

test('Card opts into dividers while forwarding native props and preserving section markup', () => {
  const h = React.createElement;
  const props = { id: 'settings', className: 'settings-card', 'aria-label': 'Workspace settings' };
  const sections = [h('section', { key: 'repo' }, 'Repository'), h('section', { key: 'schedule' }, 'Schedule')];
  const plain = renderToStaticMarkup(h(system.Card, props, sections));
  const divided = renderToStaticMarkup(h(system.Card, { ...props, divided: true }, sections));

  assert.equal(plain, '<article id="settings" aria-label="Workspace settings" class="cr-card settings-card"><section>Repository</section><section>Schedule</section></article>');
  assert.equal(divided, plain.replace('class="cr-card settings-card"', 'class="cr-card settings-card" data-divided="true"'));
  assert.equal(renderToStaticMarkup(h(system.Card, { dangerouslySetInnerHTML: { __html: '<strong>Settings</strong>' } })), '<article class="cr-card"><strong>Settings</strong></article>');
});

test('Card renders optional header and footer regions around plain or divided content', () => {
  const h = React.createElement;
  const header = h('h2', null, 'Settings');
  const footer = h('button', { type: 'button' }, 'Save');
  const children = h('section', null, 'Repository');
  const render = (props, body) => renderToStaticMarkup(h(system.Card, props, body));
  const headerMarkup = '<header class="cr-card-region"><h2>Settings</h2></header>';
  const bodyMarkup = '<section>Repository</section>';
  const footerMarkup = '<footer class="cr-card-region"><button type="button">Save</button></footer>';

  assert.equal(render({ header, footer }, children), `<article class="cr-card">${headerMarkup}<div class="cr-card-region">${bodyMarkup}</div>${footerMarkup}</article>`);
  assert.equal(render({ header, footer, divided: true }, children), `<article class="cr-card" data-divided="true">${headerMarkup}${bodyMarkup}${footerMarkup}</article>`);
  assert.equal(render({ header }), `<article class="cr-card">${headerMarkup}</article>`);
  assert.equal(render({ header: false, footer: 0 }), '<article class="cr-card"><footer class="cr-card-region">0</footer></article>');
  assert.equal(render({ header: undefined, footer: null }, children), `<article class="cr-card"><div class="cr-card-region">${bodyMarkup}</div></article>`);
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
    assert.ok(markup.includes(`<p class="cr-text cr-agent-activity-description" data-size="body">${detailText}</p>`));
    assert.doesNotMatch(markup, /<dt>Output<\/dt>/);
  }
});

test('agent activity lists above six events start open and expose a heading toggle and footer links', () => {
  const events = Array.from({ length: 7 }, (_, index) => ({
    id: `step-${index}`,
    title: `Review step ${index}`,
    status: index === 5 ? 'running' : 'completed',
    durationMs: 360,
  }));
  for (const listEvents of [events.slice(0, 6), events]) {
    const markup = renderToStaticMarkup(React.createElement(system.AgentActivity, {
      variant: 'list', events: listEvents, label: 'Review activity', initialVisibleCount: 2, defaultOpen: false,
    }));

    assert.match(markup, /^<div role="group" aria-label="Review activity" class="cr-agent-activity" data-variant="list">/);
    assert.match(markup, /class="cr-agent-activity-summary"[^>]*><span class="cr-agent-activity-heading">Review activity<\/span>/);
    assert.ok(markup.includes(`<span class="cr-agent-activity-count">${listEvents.length} activities`));
    assert.ok(markup.includes('<span class="cr-agent-activity-group-status"><span data-status="running">1 running</span></span>'));
    assert.match(markup, /<details class="cr-agent-activity-list-disclosure" open=""><summary /);
    if (listEvents.length > 6) {
      const header = markup.match(/<button id="([^"]+)" type="button" class="cr-agent-activity-summary" aria-expanded="true" aria-controls="([^"]+)">/);
      assert.ok(header, 'the heading controls the open list');
      assert.ok(markup.includes(`</summary><div class="cr-agent-activity-content" id="${header[2]}"><ol`));
      const footer = markup.match(/<\/ol><\/div><div class="cr-agent-activity-list-footer"><a href="#([^"]+)">.*?Collapse activity<\/a><span aria-hidden="true">•<\/span><a href="#([^"]+)">Scroll to header<\/a><\/div>/);
      assert.ok(footer, 'the footer links follow the connector');
      assert.deepEqual(footer.slice(1), [header[1], header[1]]);
    } else {
      assert.match(markup, /<summary hidden=""><\/summary><div class="cr-agent-activity-content"><ol/);
      assert.doesNotMatch(markup, /<button\b|cr-agent-activity-group-chevron|cr-agent-activity-list-footer/);
    }
    assert.doesNotMatch(markup, /cr-agent-activity-earlier\b/);
    const titles = [...markup.matchAll(/class="cr-agent-activity-title">([^<]+)</g)].map(([, title]) => title);
    assert.deepEqual(titles, listEvents.map(event => event.title));
    assert.equal([...markup.matchAll(/<summary class="cr-agent-activity-row">/g)].length, listEvents.length);
    assert.match(markup, /360 ms/);
    assert.match(markup, /data-status="running"/);
  }
});

test('agent activity single-line titles are available in full in both variants', () => {
  const events = [
    { id: 'review', title: 'Checked the supporting files', description: 'The totals agree.' },
    { id: 'command', title: 'Read the command output', output: 'Done' },
    { id: 'finish', title: 'Finished the review' },
  ];
  for (const variant of ['default', 'list']) {
    const markup = renderToStaticMarkup(React.createElement(system.AgentActivity, {
      events, variant, titleLines: 'single', initialVisibleCount: 2,
    }));

    assert.equal([...markup.matchAll(/data-single-line="true"/g)].length, events.length);
    const detailTitles = [...markup.matchAll(/class="cr-text cr-agent-activity-detail-title"[^>]*>([^<]+)</g)].map(([, title]) => title);
    assert.deepEqual(detailTitles, [events[0].title, events[1].title]);
    assert.ok(markup.includes('<p class="cr-text cr-agent-activity-description" data-size="body">The totals agree.</p>'));
    assert.ok(markup.includes(`<p class="cr-text cr-agent-activity-description" data-size="body">${events[2].title}</p>`));
  }

  const multiple = renderToStaticMarkup(React.createElement(system.AgentActivity, { events, titleLines: 'multiple' }));
  assert.doesNotMatch(multiple, /data-single-line|cr-agent-activity-detail-title/);
});

test('conversation defaults to safe agent Markdown and plain user text', () => {
  const markup = renderToStaticMarkup(React.createElement(system.Conversation, { messages: [
    { id: 'user', role: 'user', body: '**Keep this literal**' },
    { id: 'agent', role: 'agent', body: '**Important**\n\n<script>unsafe()</script>\n\n[Bad link](javascript:unsafe())' },
  ] }));
  assert.ok(markup.includes('**Keep this literal**'), 'user messages retain plain-text formatting');
  assert.ok(markup.includes('<strong class="cr-text" data-bold="true">Important</strong>'), 'agent bodies render Markdown');
  assert.ok(!markup.includes('<script>'));
  assert.ok(!markup.includes('href="javascript:'), 'message links retain the Markdown renderer URL policy');
});

test('distributed tokens preserve the documented brand palette', () => {
  assert.deepEqual({ evergreen: tokens.colors.evergreen, chartreuse: tokens.colors.chartreuse, paper: tokens.colors.paper, canvas: tokens.colors.canvas, muted: tokens.colors.muted, border: tokens.colors.border }, {
    evergreen: '#024340', chartreuse: '#DBFFAD', paper: '#FFFDF6', canvas: '#F2F0E6', muted: '#52645F', border: '#CECCC3',
  });
  assert.equal(tokens.colors.evergreenLight, '#096864');
  assert.equal(colors.evergreenLight.token, '--cr-evergreen-light');
  assert.ok(spacing.every(space => space.value % 4 === 0));
});

test('large icon buttons stay square instead of taking the text button padding', async () => {
  const markup = renderToStaticMarkup(React.createElement(system.IconButton, { icon: () => null, label: 'Toggle sidebar', size: 'lg' }));
  assert.match(markup, /class="cr-button cr-icon-button[^"]*"[^>]*data-size="lg"|data-size="lg"[^>]*class="cr-button cr-icon-button/);
  const css = await readFile(new URL('../dist/lib/chartreuse.css', import.meta.url), 'utf8');
  assert.match(css, /\.cr-icon-button\[data-size=['"]?lg['"]?\]\{min-inline-size:46px;padding:\.75rem\}/);
});

test('option descriptions render on their own line under the label', () => {
  const h = React.createElement;
  const markup = renderToStaticMarkup(h(system.ButtonSelect, {
    'aria-label': 'Task group', checkmark: true, value: 'dev-001',
    options: [{ value: 'dev-001', label: 'DEV-001 · Audit', description: '1 task board · 6 of 14 complete' }, { value: 'dev-002', label: 'DEV-002' }],
  }));
  const options = [...markup.matchAll(/<div\b[^>]*role="option"[^>]*>.*?<\/div>/g)].map(([option]) => option);
  assert.equal(options.length, 2);
  assert.match(options[0], /^<div\b(?=[^>]* data-description="")[^>]*><span class="cr-option-list-text"><strong[^>]*>DEV-001 · Audit<\/strong><small[^>]*>1 task board · 6 of 14 complete<\/small><\/span><svg\b/);
  assert.doesNotMatch(options[1], /data-description/);
  const css = readFileSync(new URL('../src/system/option-list.css', import.meta.url), 'utf8');
  assert.match(css, /\.cr-option-list-option\[data-description\] > \.cr-option-list-text \{ display: flex; flex-direction: column; \}/);
  assert.match(css, /\.cr-option-list-option > span, \.cr-option-list-text > \*, \.cr-option-list-empty \{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; \}/);
});
