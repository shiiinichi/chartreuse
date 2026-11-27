import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Tree } from '@chartreuse/ui';

const h = React.createElement;
const nodes = [{ id: 'parent', label: 'Parent', children: [{ id: 'leaf', label: 'Leaf' }] }];

test('the default start position keeps an empty slot on leaves', () => {
  const markup = renderToStaticMarkup(h(Tree, { label: 'Calls', nodes, defaultExpandedIds: ['parent'] }));
  assert.match(markup, /data-toggle-position="start"/);
  assert.match(markup, /<div class="cr-tree-row"><span class="cr-tree-toggle" aria-hidden="true"><svg/);
  assert.match(markup, /<span class="cr-tree-toggle" data-empty="true" aria-hidden="true"><\/span>/);
});

test('alignLeaves={false} drops the empty leaf slot only', () => {
  const markup = renderToStaticMarkup(h(Tree, { label: 'Calls', nodes, defaultExpandedIds: ['parent'], alignLeaves: false }));
  assert.ok(!markup.includes('data-empty'));
  assert.equal(markup.match(/class="cr-tree-toggle"/g)?.length, 1);
  assert.match(markup, /<li [^>]*data-cr-tree-node="leaf"[^>]*><div class="cr-tree-row"><div class="cr-tree-content">/);
});

test('togglePosition="end" puts the chevron after the default label and none on leaves', () => {
  const markup = renderToStaticMarkup(h(Tree, { label: 'Calls', nodes, defaultExpandedIds: ['parent'], togglePosition: 'end' }));
  assert.match(markup, /<div class="cr-tree-label"><span>Parent<\/span><span class="cr-tree-toggle" data-position="end" aria-hidden="true"><svg/);
  assert.match(markup, /<li [^>]*data-cr-tree-node="leaf"[^>]*><div class="cr-tree-row"><div class="cr-tree-content"><div class="cr-tree-label"><span>Leaf<\/span><\/div>/);
  assert.match(markup, /aria-expanded="true"/);
});

test('renderNode places state.toggle, or the row appends the chevron when it is unused', () => {
  const placed = renderToStaticMarkup(h(Tree, { label: 'Calls', nodes, togglePosition: 'end',
    renderNode: (node, state) => h('p', { className: 'title' }, node.label, state.toggle) }));
  assert.match(placed, /<p class="title">Parent<span class="cr-tree-toggle" data-position="end" aria-hidden="true">/);
  assert.equal(placed.match(/cr-tree-toggle/g)?.length, 1);
  const unplaced = renderToStaticMarkup(h(Tree, { label: 'Calls', nodes, togglePosition: 'end', renderNode: node => h('p', null, node.label) }));
  assert.match(unplaced, /<p>Parent<\/p><\/div><span class="cr-tree-toggle" data-position="end" aria-hidden="true">/);
  const start = renderToStaticMarkup(h(Tree, { label: 'Calls', nodes, renderNode: (node, state) => h('p', null, node.label, String(state.toggle)) }));
  assert.match(start, /<p>Parentundefined<\/p>/, 'toggle is undefined at the start position');
});

test('flush marks the tree so its outer padding drops; the default keeps it', () => {
  assert.match(renderToStaticMarkup(h(Tree, { label: 'Calls', nodes, flush: true })), /data-toggle-position="start" data-flush="true"/);
  assert.ok(!renderToStaticMarkup(h(Tree, { label: 'Calls', nodes })).includes('data-flush'));
});
