import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { Masonry, MasonryItem, MasonrySpacer } from '@chartreuse/ui';

const geometrySource = await readFile(new URL('../src/system/masonry-layout.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(geometrySource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { masonryGeometry } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('masonry fills the shortest available column and maintains source item order', () => {
  const result = masonryGeometry([{ height: 120 }, { height: 40 }, { height: 80 }, { height: 50 }, { height: 20 }], { width: 620, columns: 3, rowGap: 10, columnGap: 10 });
  assert.deepEqual(result.placements.map(item => [item.column, item.blockStart]), [[0, 0], [1, 0], [2, 0], [1, 50], [2, 90]]);
  assert.deepEqual(result.placements.map(item => item.inlineSize), [200, 200, 200, 200, 200]);
  assert.equal(result.blockSize, 120);
});

test('adjacent spans use a contiguous opening and full-width items form a barrier', () => {
  const result = masonryGeometry([{ height: 100 }, { height: 30 }, { height: 20 }, { height: 40, span: 2 }, { height: 50, span: 'full' }, { height: 10 }], { width: 620, columns: 3, rowGap: 10, columnGap: 10 });
  assert.deepEqual(result.placements[3], { column: 1, span: 2, inlineStart: 210, blockStart: 40, inlineSize: 410, blockSize: 40 });
  assert.equal(result.placements[4].blockStart, 110);
  assert.equal(result.placements[4].inlineSize, 620);
  assert.equal(result.placements[5].blockStart, 170);
  assert.equal(result.blockSize, 180);
});

test('reserved spacer height participates in packing and removal closes that gap', () => {
  const options = { width: 410, columns: 2, rowGap: 10, columnGap: 10 };
  const reserved = masonryGeometry([{ height: 50 }, { height: 100 }, { height: 80 }, { height: 20 }], options);
  const removed = masonryGeometry([{ height: 50 }, { height: 80 }, { height: 20 }], options);
  assert.deepEqual(reserved.placements[2], { column: 0, span: 1, inlineStart: 0, blockStart: 60, inlineSize: 200, blockSize: 80 });
  assert.equal(removed.placements[1].blockStart, 0);
  assert.equal(reserved.blockSize, 140);
  assert.equal(removed.blockSize, 80);
});

test('narrow explicit columns bound their gaps and span to the actual track count', () => {
  const result = masonryGeometry([{ height: 10, span: 99 }, { height: 20, span: -3 }], { width: 240, columns: 24, rowGap: 16, columnGap: 64 });
  assert.equal(result.columnWidth, 4);
  assert.equal(result.placements[0].inlineSize, 240);
  assert.equal(result.placements[0].span, 24);
  assert.equal(result.placements[1].span, 1);
  assert.equal(masonryGeometry([], { ...{ width: 240, columns: 3, rowGap: 16, columnGap: 16 } }).blockSize, 0);
});

test('Masonry server rendering preserves child order, native attributes, and a usable fallback', () => {
  const markup = renderToStaticMarkup(React.createElement(Masonry, { id: 'gallery', 'aria-label': 'Example collection', columns: { base: 1, md: 3 }, gap: 6 },
    React.createElement(MasonryItem, { span: 1 }, React.createElement('button', null, 'First')),
    React.createElement(MasonryItem, { span: 'full' }, 'Second'),
  ));
  assert.match(markup, /^<div[^>]*id="gallery"[^>]*aria-label="Example collection"[^>]*class="cr-masonry">/);
  assert.ok(markup.indexOf('First') < markup.indexOf('Second'));
  assert.ok(markup.includes('--cr-masonry-columns-base:1') && markup.includes('--cr-masonry-columns-md:3'));
  assert.ok(markup.includes('--cr-masonry-row-gap-base:var(--cr-space-6, 24px)'));
  assert.ok(!markup.includes('data-masonry-ready'));
  assert.ok(!markup.includes('role="grid"'));
});

test('MasonrySpacer is invisible decoration with responsive size, visibility, and no interactive props', () => {
  const markup = renderToStaticMarkup(React.createElement(MasonrySpacer, {
    id: 'reserved', height: { base: 0, sm: 120 }, visible: { base: false, sm: true }, span: { base: 1, md: 2 },
    className: 'illustration', style: { outline: '1px dashed currentColor' },
    children: React.createElement('button', null, 'Unexpected'), tabIndex: 0, role: 'button',
  }));
  assert.match(markup, /^<div[^>]*><\/div>$/);
  assert.ok(markup.includes('aria-hidden="true"') && markup.includes('inert=""'));
  assert.ok(markup.includes('cr-masonry-item cr-masonry-spacer illustration'));
  assert.ok(markup.includes('--cr-masonry-spacer-height-base:0px') && markup.includes('--cr-masonry-spacer-height-sm:120px'));
  assert.ok(markup.includes('--cr-masonry-spacer-display-base:none') && markup.includes('--cr-masonry-spacer-display-xl:block'));
  assert.ok(markup.includes('--cr-masonry-item-span-md:2'));
  assert.doesNotMatch(markup, /<button|Unexpected|tabindex|role=/);
});
