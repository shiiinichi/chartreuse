import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { List } from '@chartreuse/ui';

const h = React.createElement;
const items = [{ id: 'one', title: 'First' }, { id: 'two', title: 'Second', description: 'More detail', trailing: 'Done' }];

test('List renders a bulleted ul with list semantics, markers, and optional slots', () => {
  const markup = renderToStaticMarkup(h(List, { items, 'aria-label': 'Items' }));
  assert.match(markup, /^<ul[^>]*role="list"[^>]*aria-label="Items"|^<ul[^>]*aria-label="Items"[^>]*role="list"/);
  assert.match(markup, /data-marker="auto"/);
  assert.match(markup, /data-size="md"/);
  assert.doesNotMatch(markup, /data-ordered|data-dividers/);
  assert.equal((markup.match(/<li /g) ?? []).length, 2);
  assert.equal((markup.match(/class="cr-list-marker" aria-hidden="true"/g) ?? []).length, 2);
  assert.equal((markup.match(/cr-list-description/g) ?? []).length, 1);
  assert.equal((markup.match(/cr-list-trailing/g) ?? []).length, 1);
});

test('List renders a numbered ol whose start drives both the native attribute and the counter', () => {
  const markup = renderToStaticMarkup(h(List, { items, ordered: true, start: 3, dividers: true, size: 'sm' }));
  assert.match(markup, /^<ol /);
  assert.match(markup, /start="3"/);
  assert.match(markup, /counter-reset:cr-list 2/);
  assert.match(markup, /data-ordered="true"/);
  assert.match(markup, /data-dividers="true"/);
  assert.match(markup, /data-size="sm"/);
  assert.doesNotMatch(renderToStaticMarkup(h(List, { items, start: 3 })), /start=|counter-reset/);
});

test('List icons replace markers, take the item tone, and still render with marker none', () => {
  const icon = props => h('svg', props);
  const markup = renderToStaticMarkup(h(List, { marker: 'none', items: [{ id: 'a', title: 'Icon', icon, tone: 'success' }, { id: 'b', title: 'Plain' }] }));
  assert.match(markup, /data-tone="success" data-media="icon"><span class="cr-list-marker" aria-hidden="true"><svg[^>]*aria-hidden="true"/);
  assert.equal((markup.match(/cr-list-marker/g) ?? []).length, 1, 'marker none hides plain markers only');
});

test('List leading content replaces the icon and marker in a decorative slot', () => {
  const icon = props => h('svg', props);
  const markup = renderToStaticMarkup(h(List, { ordered: true, items: [{ id: 'a', title: 'Sam Lee', icon, leading: h('span', { className: 'avatar' }, 'SL') }] }));
  assert.match(markup, /data-media="leading"><span class="cr-list-marker cr-list-leading" aria-hidden="true"><span class="avatar">SL<\/span><\/span>/);
  assert.doesNotMatch(markup, /<svg/);
});

test('List row variants stretch a native button over free content and mark the selection', () => {
  const content = h('div', null, h('strong', null, 'Run one'), h('span', null, 'Done'));
  const markup = renderToStaticMarkup(h(List, { 'aria-label': 'Runs', variant: 'outline', selectedId: 'one', onSelectionChange() {},
    items: [{ id: 'one', content }, { id: 'two', content: 'Run two', label: 'Second run' }] }));
  assert.match(markup, /<ul [^>]*role="list" class="cr-list" data-marker="none" data-size="md" data-variant="outline"/);
  const rows = [...markup.matchAll(/<li class="cr-list-item cr-list-row"([^>]*)>([\s\S]*?)<\/li>/g)];
  assert.equal(rows.length, 2);
  assert.match(rows[0][1], /data-content="true" data-interactive="true" data-selected="true"/);
  const labelledBy = rows[0][2].match(/<button type="button" aria-current="true" class="cr-list-row-action" aria-labelledby="([^"]+)"><\/button>/);
  assert.ok(labelledBy, 'the first row is an empty button named by its content');
  assert.ok(rows[0][2].includes(`<div id="${labelledBy[1]}" class="cr-list-row-content"><div><strong>Run one</strong>`));
  assert.ok(!rows[1][1].includes('data-selected'));
  assert.match(rows[1][2], /<button type="button" class="cr-list-row-action" aria-label="Second run"><\/button>/);
  assert.ok(!markup.includes('cr-list-marker'), 'row variants drop markers by default');
});

test('List rows can be links, with selected from the item', () => {
  const markup = renderToStaticMarkup(h(List, { variant: 'plain', items: [
    { id: 'a', href: '#a', selected: true, title: 'Thread A', description: 'Two replies' },
    { id: 'b', href: '#b', title: 'Thread B' },
  ] }));
  const links = [...markup.matchAll(/<a href="(#[ab])"([^>]*)><\/a>/g)];
  assert.deepEqual(links.map(([, href]) => href), ['#a', '#b']);
  assert.match(links[0][2], /^ aria-current="true" class="cr-list-row-action" aria-labelledby="([^"]+)-title" aria-describedby="\1-description"$/);
  assert.match(links[1][2], /^ class="cr-list-row-action" aria-labelledby="[^"]+-title"$/);
  assert.match(markup, /class="cr-list-title" id="[^"]+-title">Thread A</);
});

test('List and its rows take size props as inline sizes', () => {
  const markup = renderToStaticMarkup(h(List, { variant: 'outline', minWidth: 240, maxWidth: '40rem', maxHeight: 300,
    items: [{ id: 'a', title: 'A', minHeight: 64, maxHeight: '6rem', maxWidth: 320 }, { id: 'b', title: 'B' }] }));
  assert.match(markup, /<ul role="list" style="min-inline-size:240px;max-inline-size:40rem;max-block-size:300px"[^>]*data-max-height="true"/);
  assert.match(markup, /<li class="cr-list-item cr-list-row" style="max-inline-size:320px;min-block-size:64px;max-block-size:6rem"[^>]*data-max-height="true"/);
  assert.match(markup, /<li class="cr-list-item cr-list-row" data-tone="neutral"><div class="cr-list-content"><div class="cr-list-title">B</, 'a non-interactive row has no ids or action');
});

test('The default List keeps its title link and gains aria-current only when selected', () => {
  const markup = renderToStaticMarkup(h(List, { items: [{ id: 'a', title: 'A', onClick() {}, selected: true }, { id: 'b', title: 'B', href: '#b' }] }));
  assert.ok(!markup.includes('data-variant'));
  assert.match(markup, /<button type="button" class="cr-list-link" aria-current="true">A<\/button>/);
  assert.match(markup, /<a class="cr-list-link" href="#b">B<\/a>/);
  assert.match(markup, /data-marker="auto"/);
});

test('flush drops the outer padding only for row variants', () => {
  assert.match(renderToStaticMarkup(h(List, { variant: 'plain', flush: true, items })), /data-variant="plain" data-flush="true"/);
  assert.ok(!renderToStaticMarkup(h(List, { variant: 'plain', items })).includes('data-flush'));
  assert.ok(!renderToStaticMarkup(h(List, { flush: true, items })).includes('data-flush'), 'the default variant has no outer padding to drop');
});
