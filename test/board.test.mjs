import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import {
  Badge, Button, ChipGroup, List, SegmentedProgress, Swimlane, SwimlaneGroup, Table, TaskCard, ToggleChip, categoryColors,
} from '@chartreuse/ui';

const h = React.createElement;
const render = (component, props, ...children) => renderToStaticMarkup(h(component, props, ...children));
const toggleName = (markup) => markup.match(/<button[^>]*class="cr-swimlane-toggle"[^>]*>[\s\S]*?<span class="cr-sr-only">([^<]*)<\/span>/)[1];
const css = await readFile(new URL('../dist/lib/chartreuse.css', import.meta.url), 'utf8');

test('the category palette exposes eight named colors with tokens and accent rules', () => {
  assert.deepEqual(categoryColors.map(color => color.id), ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6', 'cat-7', 'cat-8']);
  for (const { id } of categoryColors) {
    assert.match(css, new RegExp(`--cr-color-${id}:\\s*light-dark\\(`), `${id} foreground token`);
    assert.match(css, new RegExp(`--cr-color-${id}-bg:\\s*light-dark\\(`), `${id} background token`);
    assert.ok(css.includes(`[data-accent=${id}]`) || css.includes(`[data-accent='${id}']`) || css.includes(`[data-accent="${id}"]`), `${id} accent rule`);
  }
});

test('Swimlane renders exactly as before when no new props are set', () => {
  const markup = render(Swimlane, { title: 'In review', count: 2, tone: 'warning' }, h('p', null, 'Card'));
  for (const attribute of ['data-accent', 'data-collapsible', 'data-collapsed', 'data-header-style', 'data-variant', 'data-density', 'aria-expanded', 'hidden=""']) {
    assert.ok(!markup.match(/^<section[^>]*>/)[0].includes(attribute) && !markup.includes(`${attribute === 'hidden=""' ? attribute : 'aria-expanded'}`), `no ${attribute}`);
  }
  assert.ok(markup.includes('cr-swimlane-tag'), 'keeps the status tag');
  assert.ok(!markup.includes('cr-swimlane-body" id='), 'body has no id');
});

test('a collapsible Swimlane names its collapse and expand buttons and keeps the action', () => {
  const action = h('button', { type: 'button', className: 'add' }, 'Add');
  const open = render(Swimlane, { title: 'QA', count: 3, accent: 'cat-4', collapsible: true, action }, h('p', null, 'Card'));
  assert.match(open, /aria-label="Collapse QA"/);
  assert.match(open, /aria-expanded="true"/);
  const bodyId = open.match(/class="cr-swimlane-body" id="([^"]+)"/)?.[1];
  assert.ok(bodyId, 'the body has an id');
  assert.ok(open.includes(`aria-controls="${bodyId}"`));
  assert.match(open, /data-accent="cat-4"/);

  const closed = render(Swimlane, { title: 'QA', count: 1, defaultCollapsed: true, action }, h('p', null, 'Card'));
  assert.match(closed, /data-collapsed="true"/);
  assert.equal(toggleName(closed), 'Expand QA, 1 item');
  assert.match(closed, /aria-expanded="false"/);
  assert.match(closed, /class="cr-swimlane-body"[^>]*hidden=""/);
  assert.ok(closed.indexOf('class="add"') < closed.indexOf('cr-swimlane-toggle'), 'the action stays above the rail toggle');
  assert.ok(!closed.includes('<header'), 'the collapsed lane has no header');
});

test('Swimlane itemLabel overrides the noun, and plurals follow the count', () => {
  assert.equal(toggleName(render(Swimlane, { title: 'Done', count: 0, defaultCollapsed: true })), 'Expand Done, 0 items');
  assert.equal(toggleName(render(Swimlane, { title: 'Done', count: 5, defaultCollapsed: true, itemLabel: { one: 'task', other: 'tasks' } })), 'Expand Done, 5 tasks');
  assert.equal(toggleName(render(Swimlane, { title: 'Done', count: 1, collapsed: true, itemLabel: { one: 'task', other: 'tasks' } })), 'Expand Done, 1 task');
});

test('Swimlane header styles, variants, and density map to data attributes', () => {
  const markup = render(Swimlane, { title: 'To do', count: 0, accent: 'cat-2', headerStyle: 'dot', variant: 'flush', density: 'compact' });
  assert.match(markup, /data-header-style="dot"/);
  assert.match(markup, /data-variant="flush"/);
  assert.match(markup, /data-density="compact"/);
  assert.ok(markup.includes('cr-swimlane-dot'));
  assert.ok(!markup.includes('cr-swimlane-tag'), 'the dot style replaces the tag');
});

test('SwimlaneGroup laneWidth fixes expanded lane widths only when set', async () => {
  const plain = render(SwimlaneGroup, { label: 'Board' });
  assert.doesNotMatch(plain, /data-lane-width|--cr-swimlane-lane-width|style=/);
  assert.match(render(SwimlaneGroup, { label: 'Board', laneWidth: 280 }), /data-lane-width="fixed" style="--cr-swimlane-lane-width:280px"/);
  assert.match(render(SwimlaneGroup, { label: 'Board', laneWidth: '18rem', style: { padding: 4 } }), /style="padding:4px;--cr-swimlane-lane-width:18rem"/);
  for (const laneWidth of [0, -10, Number.NaN, '  ']) assert.doesNotMatch(render(SwimlaneGroup, { label: 'Board', laneWidth }), /data-lane-width/);
  const css = await readFile(new URL('../dist/lib/chartreuse.css', import.meta.url), 'utf8');
  assert.match(css, /\.cr-swimlane-group\[data-lane-width=['"]?fixed['"]?\][^{]*\.cr-swimlane:not\(\[data-collapsed=['"]?true['"]?\]\)\{flex:0 0 var\(--cr-swimlane-lane-width\)/);
});

test('SwimlaneGroup is a labeled region around a scrolling row', () => {
  const markup = render(SwimlaneGroup, { label: 'Board' }, h(Swimlane, { title: 'A', count: 0 }));
  assert.match(markup, /^<div[^>]*role="region"[^>]*aria-label="Board"[^>]*data-variant="surface"/);
  assert.ok(markup.includes('cr-swimlane-group-scroll'));
  assert.match(render(SwimlaneGroup, { label: 'Board', variant: 'separate' }), /data-variant="separate"/);
});

test('ToggleChip is a native toggle button with a count and an optional dot', () => {
  const pressed = render(ToggleChip, { pressed: true, dot: true, accent: 'cat-3', count: 4 }, 'In progress');
  assert.match(pressed, /^<button type="button"/);
  assert.match(pressed, /aria-pressed="true"/);
  assert.match(pressed, /data-accent="cat-3"/);
  assert.ok(pressed.includes('>4<'));
  const plain = render(ToggleChip, null, 'Action');
  assert.ok(!plain.includes('aria-pressed'), 'an action chip has no pressed state');
  assert.match(render(ToggleChip, { count: 0 }, 'Empty'), /data-empty="true"/);
  assert.ok(render(ToggleChip, { variant: 'dashed', addIcon: true }, 'Add').includes('cr-toggle-chip-add'));
  assert.ok(!render(ToggleChip, { addIcon: true }, 'Add').includes('cr-toggle-chip-add'), 'only dashed draws the add icon');
  assert.match(render(ChipGroup, { label: 'Filters' }), /role="group" aria-label="Filters"/);
});

test('SegmentedProgress is one image whose name lists every segment', () => {
  const markup = render(SegmentedProgress, { label: 'Cards by stage', segments: [
    { id: 'a', label: 'To do', value: 2, accent: 'cat-2' },
    { id: 'b', label: 'Done', value: 0 },
  ], legend: true });
  assert.match(markup, /role="img" aria-label="Cards by stage: To do 2, Done 0"/);
  assert.equal([...markup.matchAll(/cr-segmented-progress-segment/g)].length, 1, 'zero values take no space');
  assert.ok(markup.includes('<ul'), 'a static legend is a list');
  const interactive = render(SegmentedProgress, { label: 'Stages', segments: [{ id: 'a', label: 'A', value: 1 }], legend: 'interactive', selectedSegments: ['a'], onSegmentSelect() {} });
  assert.match(interactive, /role="group" aria-label="Stages legend"/);
  assert.match(interactive, /aria-pressed="true"/);
  assert.match(render(SegmentedProgress, { label: 'Of max', segments: [{ id: 'a', label: 'A', value: 1 }], max: 4 }), /aria-label="Of max: A 1, of 4"/);
});

test('Table group headings add a dot, count, action, and an accessible collapse toggle', () => {
  const columns = [{ id: 'name', header: 'Name', rowHeader: true, render: row => row.name }];
  const plain = render(Table, { label: 'Plain', columns, getRowKey: row => row.id, groups: [{ id: 'g', heading: 'Group', rows: [{ id: 1, name: 'One' }] }] });
  assert.ok(plain.includes('<th scope="rowgroup" colSpan="1">Group</th>') || plain.includes('<th scope="rowgroup" colspan="1">Group</th>'), 'plain groups render as before');
  assert.ok(!plain.includes('data-group-toggles'));

  const markup = render(Table, { label: 'Tasks', columns, getRowKey: row => row.id, density: 'comfortable', groups: [
    { id: 'g', heading: 'Done', rows: [{ id: 1, name: 'One' }], count: 1, accent: 'cat-6', defaultCollapsed: true, collapsedSummary: '1 hidden', action: h('button', { type: 'button' }, 'Add') },
  ] });
  assert.match(markup, /data-density="comfortable"/);
  assert.match(markup, /data-group-toggles="true"/);
  assert.match(markup, /class="cr-table-group-toggle" aria-expanded="false" aria-controls="[^"]+" aria-labelledby="[^"]+"/);
  assert.match(markup, /class="cr-table-group-dot" data-accent="cat-6" aria-hidden="true"/);
  assert.match(markup, /<span class="cr-sr-only">, <\/span>1/);
  assert.match(markup, /<tr id="[^"]+-0" hidden=""/);
  assert.match(markup, /data-summary="true"(?! hidden)/);
});

test('Table rows can link, and truncated cells carry their full text', () => {
  const columns = [
    { id: 'title', header: 'Title', truncate: true, width: 200, render: row => row.title },
    { id: 'id', header: 'ID', rowHeader: true, render: row => row.id },
  ];
  const markup = render(Table, { label: 'Links', columns, rows: [{ id: 'T-1', title: 'A long title' }], getRowKey: row => row.id, getRowHref: row => `#${row.id}` });
  assert.match(markup, /<th scope="col" style="inline-size:200px">Title<\/th>/);
  assert.match(markup, /<tr data-interactive="true">/);
  assert.match(markup, /<a class="cr-table-row-link" href="#T-1">T-1<\/a>/, 'the row header column holds the link');
  assert.match(markup, /<span class="cr-table-truncate" title="A long title">A long title<\/span>/);
  const buttons = render(Table, { label: 'Buttons', columns, rows: [{ id: 'T-1', title: 'x' }], getRowKey: row => row.id, onRowClick() {} });
  assert.match(buttons, /<button type="button" class="cr-table-row-link">T-1<\/button>/);
  assert.doesNotMatch(css, /\.cr-table-row-link:hover/, 'the row has its own hover state, so the row link does not underline');
  assert.match(css, /th\[scope=['"]?rowgroup['"]?\]\{padding:11px 20px\}/, 'comfortable group headings use symmetric padding');
});

test('TaskCard keeps its legacy output and adds links, selection, completion, and compact density', () => {
  const legacy = render(TaskCard, { taskId: 'T-1', title: 'Task', status: 'review' });
  for (const attribute of ['data-density', 'data-selected', 'data-completed', 'data-href', 'aria-current', 'data-clamp', 'title=']) assert.ok(!legacy.includes(attribute), `no ${attribute}`);
  assert.ok(legacy.includes('In review'));

  const custom = render(TaskCard, { taskId: 'T-1', title: 'Task', status: 'qa', statusLabel: 'QA', statusAccent: 'cat-4' });
  assert.match(custom, /data-accent="cat-4"[^>]*>.*QA/);
  assert.ok(!render(TaskCard, { taskId: 'T-1', title: 'Task', hideStatus: true }).includes('cr-task-footer'));

  const link = render(TaskCard, { taskId: 'T-1', title: 'Task', href: '/tasks/1', selected: true, completedState: true });
  assert.match(link, /<a href="\/tasks\/1" class="cr-task-button"[^>]*aria-current="true"/);
  assert.ok(link.includes('Completed.'));
  assert.ok(link.includes('cr-task-completed-icon'));

  const compact = render(TaskCard, { taskId: 'T-1', title: 'Task', description: 'Hidden', priority: 'medium', density: 'compact', completed: 1, total: 2, commentCount: 3 });
  assert.match(compact, /data-density="compact"/);
  assert.ok(!compact.includes('Hidden'), 'compact hides the description');
  assert.ok(!compact.includes('Medium'), 'compact shows only high priority');
  assert.ok(compact.includes('data-display="bar"'), 'compact draws the checklist as a bar');
  assert.ok(compact.includes('title="3 comments."'));
  assert.match(render(TaskCard, { taskId: 'T-1', title: 'Task', priority: 'high', density: 'compact' }), /cr-task-priority" data-tone="warning"/);
  assert.match(render(TaskCard, { taskId: 'T-1', title: 'Task', description: 'Long', descriptionLines: 2 }), /data-clamp="true"/);
});

test('List items can be links or buttons, and plain items render as before', () => {
  const markup = render(List, { items: [
    { id: 'a', title: 'Link', href: '#a' },
    { id: 'b', title: 'Button', onClick() {} },
    { id: 'c', title: 'Plain' },
  ] });
  assert.match(markup, /data-interactive="true"[^>]*>[\s\S]*?<a class="cr-list-link" href="#a">Link<\/a>/);
  assert.match(markup, /<button type="button" class="cr-list-link">Button<\/button>/);
  const plain = markup.split('Plain')[0].split('<li').pop();
  assert.ok(!plain.includes('data-interactive'));
});

test('Button dashed and Badge accent are opt-in', () => {
  assert.match(render(Button, { variant: 'dashed' }, 'Add'), /cr-button-dashed|data-variant="dashed"/);
  assert.match(render(Badge, { accent: 'cat-5' }, 'Tag'), /data-accent="cat-5"/);
  assert.ok(!render(Badge, null, 'Tag').includes('data-accent'));
});
