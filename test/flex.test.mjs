import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Flex } from '@chartreuse/ui';

const render = props => renderToStaticMarkup(React.createElement(Flex, props,
  React.createElement('button', { type: 'button' }, 'First action'),
  React.createElement('button', { type: 'button' }, 'Second action'),
));

test('Flex forwards native container attributes and keeps children in order without individual wrappers', () => {
  const markup = render({ id: 'actions', className: 'review-actions', role: 'group', 'aria-label': 'Review actions', dir: 'rtl', title: 'Review', style: { maxInlineSize: 520 } });
  assert.match(markup, /^<div id="actions"[^>]*class="cr-flex review-actions">/);
  for (const attribute of ['role="group"', 'aria-label="Review actions"', 'dir="rtl"', 'title="Review"', 'style="max-inline-size:520px"']) assert.ok(markup.includes(attribute), attribute);
  assert.equal([...markup.matchAll(/<div\b/g)].length, 2);
  assert.match(markup, /<button type="button">First action<\/button><button type="button">Second action<\/button><\/div><\/div>$/);
  assert.doesNotMatch(markup, /role="grid"|tabindex/);
});

test('Flex responsive recipes inherit upward while nested instances reset their own values', () => {
  const markup = render({ direction: { base: 'column', md: 'row' }, wrap: { sm: true }, align: { base: 'start', lg: 'center' }, justify: 'space-between', gap: { base: 2, md: 6 } });
  for (const [tier, direction, wrap, align, gap] of [
    ['base', 'column', 'nowrap', 'flex-start', 2],
    ['sm', 'column', 'wrap', 'flex-start', 2],
    ['md', 'row', 'wrap', 'flex-start', 6],
    ['lg', 'row', 'wrap', 'center', 6],
    ['xl', 'row', 'wrap', 'center', 6],
  ]) {
    for (const pair of [`direction-${tier}:${direction}`, `wrap-${tier}:${wrap}`, `align-${tier}:${align}`, `justify-${tier}:space-between`, `row-gap-${tier}:var(--cr-space-${gap}, ${gap * 4}px)`]) assert.ok(markup.includes(`--cr-flex-${pair}`), pair);
  }
  const nested = renderToStaticMarkup(React.createElement(Flex, { direction: 'column', wrap: true, gap: 8 }, React.createElement(Flex, null, 'Inner content')));
  assert.equal([...nested.matchAll(/--cr-flex-direction-base:row/g)].length, 1);
  assert.equal([...nested.matchAll(/--cr-flex-wrap-base:nowrap/g)].length, 1);
  assert.equal([...nested.matchAll(/--cr-flex-row-gap-base:var\(--cr-space-3, 12px\)/g)].length, 1);
});

test('Flex validates recipes and keeps provided axis gaps independent', () => {
  const markup = render({ direction: 'row-reverse', wrap: 'wrap', align: { base: 'end', md: 'invalid' }, justify: 'invalid', gap: { base: 4, md: 8 }, rowGap: { sm: 2, lg: 7 }, columnGap: 0 });
  assert.ok(markup.includes('--cr-flex-direction-base:row'));
  assert.ok(markup.includes('--cr-flex-wrap-base:nowrap'));
  assert.ok(markup.includes('--cr-flex-align-xl:flex-end'));
  assert.ok(markup.includes('--cr-flex-justify-base:flex-start'));
  for (const [tier, gap] of [['base', 4], ['sm', 2], ['md', 2], ['lg', 2], ['xl', 2]]) assert.ok(markup.includes(`--cr-flex-row-gap-${tier}:var(--cr-space-${gap}, ${gap * 4}px)`));
  assert.equal([...markup.matchAll(/--cr-flex-column-gap-\w+:0px/g)].length, 5);
  assert.doesNotMatch(markup, /\s(?:direction|wrap|align|justify|gap|rowGap|columnGap)=/);
});
