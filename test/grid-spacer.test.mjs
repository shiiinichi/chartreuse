import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Grid, GridItem, GridSpacer, TextField } from '@chartreuse/ui';

const renderSpacer = props => renderToStaticMarkup(React.createElement(GridSpacer, props));

test('GridSpacer is one empty, decorative, inert cell with a one-column default', () => {
  const markup = renderSpacer({});
  assert.match(markup, /^<div[^>]*><\/div>$/);
  assert.match(markup, /aria-hidden="true"/);
  assert.match(markup, /inert=""/);
  assert.ok(markup.includes('cr-grid-item cr-grid-spacer'));
  assert.ok(markup.includes('--cr-grid-item-span-base:1'));
  assert.doesNotMatch(markup, /tabindex|role=|aria-label/);
  const attemptedContent = renderSpacer({ children: React.createElement('button', null, 'Hidden action'), tabIndex: 0, dangerouslySetInnerHTML: { __html: '<input />' } });
  assert.doesNotMatch(attemptedContent, /button|Hidden action|input|tabindex/);
});

test('GridSpacer delegates responsive spans to the same GridItem placement contract', () => {
  const props = { span: { base: 'full', sm: 2, lg: 3 }, rowSpan: { base: 1, md: 2 } };
  const spacer = renderSpacer(props);
  const item = renderToStaticMarkup(React.createElement(GridItem, props));
  const placement = html => (html.match(/style="([^"]*)"/)?.[1] || '').split(';').filter(part => part.startsWith('--cr-grid-item-')).sort();
  assert.deepEqual(placement(spacer), placement(item));
});

test('GridSpacer visibility inherits through the parent container tiers', () => {
  const responsive = renderSpacer({ visible: { base: false, md: true, xl: false } });
  for (const [tier, display] of [['base', 'none'], ['sm', 'none'], ['md', 'block'], ['lg', 'block'], ['xl', 'none']]) {
    assert.ok(responsive.includes(`--cr-grid-spacer-display-${tier}:${display}`));
  }
  const hidden = renderSpacer({ visible: false });
  assert.equal([...hidden.matchAll(/--cr-grid-spacer-display-\w+:none/g)].length, 5);
});

test('a reserved cell retains input DOM order and forwards its documented native attributes', () => {
  const markup = renderToStaticMarkup(React.createElement(Grid, { columns: 3 },
    React.createElement(GridItem, { span: 1 }, React.createElement(TextField, { label: 'First input', name: 'first' })),
    React.createElement(GridSpacer, { id: 'reserved-slot', className: 'diagnostic-outline', style: { outline: '1px dashed currentColor' } }),
    React.createElement(GridItem, { span: 1 }, React.createElement(TextField, { label: 'Second input', name: 'second' })),
  ));
  assert.ok(markup.indexOf('name="first"') < markup.indexOf('id="reserved-slot"'));
  assert.ok(markup.indexOf('id="reserved-slot"') < markup.indexOf('name="second"'));
  assert.equal([...markup.matchAll(/<input\b/g)].length, 2);
  assert.ok(markup.includes('cr-grid-spacer diagnostic-outline'));
  assert.ok(markup.includes('outline:1px dashed currentColor'));
});
