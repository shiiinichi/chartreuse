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
