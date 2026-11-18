import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, Grid, GridItem, Stat, StatGroup } from '@chartreuse/ui';

const render = (Component, props, ...children) => renderToStaticMarkup(React.createElement(Component, props, ...children));
const renderStat = props => render(Stat, { label: 'Example value', ...props });
const definition = markup => {
  const match = markup.match(/<dd\b[^>]*>([\s\S]*?)<\/dd>/);
  assert.ok(match, 'a statistic exposes a native definition value');
  return match[1];
};
const text = markup => markup.replace(/<[^>]*>/g, '').replace(/&(amp|lt|gt|quot|#x27|#39);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#x27': "'", '#39': "'" })[entity]);
const valueText = props => text(definition(renderStat(props)));
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const divsWithClass = (markup, className) => (markup.match(/<div\b[^>]*>/g) || []).filter(tag => attribute(tag, 'class')?.split(' ').includes(className));

test('Stat preserves numeric significance unless fixed decimal precision is requested', () => {
  for (const [props, expected] of [
    [{ value: 112893 }, '112,893'],
    [{ value: 123.1234567890123 }, '123.1234567890123'],
    [{ value: 1e-24 }, '0.000000000000000000000001'],
    [{ value: 0 }, '0'],
    [{ value: -0 }, '-0'],
    [{ value: -1234.5678, precision: 2 }, '-1,234.57'],
    [{ value: 1234.5678, precision: 0 }, '1,235'],
    [{ value: 12.5, precision: 4 }, '12.5000'],
    [{ value: 12.567, precision: 2.9 }, '12.57'],
    [{ value: 12.5, precision: -2 }, '13'],
    [{ value: .5, precision: 30 }, '0.50000000000000000000'],
    [{ value: .123456, precision: NaN }, '0.123456'],
  ]) assert.equal(valueText(props), expected, JSON.stringify(props));
});

test('Stat applies the requested locale, grouping, and separator overrides', () => {
  assert.equal(valueText({ value: 1234567.5, precision: 2, locale: 'de-DE' }), '1.234.567,50');
  assert.equal(valueText({ value: 1234567.5, precision: 2, locale: 'hi-IN' }), '12,34,567.50');
  assert.equal(valueText({ value: 1234567.5, precision: 2, locale: 'hi-IN', groupSeparator: '_', decimalSeparator: '·' }), '12_34_567·50');
  assert.equal(valueText({ value: 1234.5, useGrouping: false, groupSeparator: '_' }), '1234.5');
  assert.equal(valueText({ value: 1234.5, groupSeparator: '' }), '1234.5');
  for (const locale of ['bad_locale', 'zz-ZZ']) assert.equal(valueText({ value: 1234.5, precision: 2, locale }), '1,234.50', `${locale} falls back to en-US`);
});

test('Stat retains literal strings and treats units as presentation without rescaling', () => {
  assert.equal(valueText({ value: '003 / 012', precision: 2, locale: 'de-DE', decimalSeparator: '·' }), '003 / 012');
  assert.equal(valueText({ value: '9,007,199,254,740,993.00', precision: 0 }), '9,007,199,254,740,993.00');
  assert.equal(valueText({ value: .25, suffix: '%' }), '0.25%');
  assert.equal(valueText({ value: 12.5, precision: 2, prefix: '¥', suffix: ' CNY' }), '¥12.50 CNY');
  const literal = renderStat({ value: '<script>untrusted()</script>' });
  assert.equal(text(definition(literal)), '<script>untrusted()</script>');
  assert.ok(!literal.includes('<script>'), 'preformatted strings remain text');
});

test('Stat passes the original number or string to a custom formatter', () => {
  const received = [];
  const formatter = value => { received.push(value); return React.createElement('strong', null, `Raw: ${value}`); };
  assert.equal(valueText({ value: 1234.5678, formatter, precision: 0, locale: 'de-DE' }), 'Raw: 1234.5678');
  assert.equal(valueText({ value: '003', formatter, prefix: '#', suffix: ' items' }), '#Raw: 003 items');
  assert.deepEqual(received, [1234.5678, '003']);
});

test('Stat loading exposes busy state and readable context without stale values or formatter work', () => {
  let calls = 0;
  const markup = renderStat({
    value: 778899, prefix: 'OLDPREFIX', suffix: 'OLDSUFFIX', loading: true, loadingLabel: 'Reading the latest value',
    icon: React.createElement('svg', { 'data-icon': 'old-icon', viewBox: '0 0 24 24' }),
    formatter: () => { calls++; return 'STALE'; },
  });
  assert.equal(calls, 0);
  assert.match(markup, /<dl\b[^>]*aria-busy="true"/);
  assert.equal(text(definition(markup)), 'Reading the latest value');
  assert.doesNotMatch(markup, /778899|OLDPREFIX|OLDSUFFIX|old-icon|STALE/);
  assert.equal(valueText({ value: 9, loading: true }), 'Loading value');
});

test('Stat nonfinite values expose real unavailable text and bypass the formatter', () => {
  let calls = 0;
  for (const value of [NaN, Infinity, -Infinity]) {
    const markup = renderStat({ value, formatter: () => { calls++; return 'invalid'; } });
    assert.ok(text(definition(markup)).includes('Unavailable'), 'unavailable is actual readable text, not only a label on a generic element');
    assert.match(definition(markup), /<[^>]*aria-hidden="true"[^>]*>—<\//, 'the visual dash is decorative');
    assert.doesNotMatch(markup, /NaN|Infinity|invalid/);
  }
  assert.equal(calls, 0);
});

test('Stat keeps its native term/value relationship, description, action, and outer attributes', () => {
  const markup = renderStat({ label: 'Completed tasks', value: 27, description: 'Reviewed in this sample.', action: React.createElement('button', { type: 'button' }, 'Review tasks'), id: 'completed-tasks', 'data-source': 'sample', className: 'summary-value' });
  assert.match(markup, /<dl\b[^>]*>/);
  assert.equal(text(markup.match(/<dt\b[^>]*>([\s\S]*?)<\/dt>/)?.[1] || ''), 'Completed tasks');
  assert.equal(text(definition(markup)), '27');
  const descriptionId = attribute(markup.match(/<dd\b[^>]*>/)?.[0] || '', 'aria-describedby');
  assert.ok(descriptionId);
  assert.ok(markup.includes(`id="${descriptionId}">Reviewed in this sample.`), 'the value description references its visible supporting text');
  const root = markup.match(/^<div\b[^>]*>/)?.[0] || '';
  assert.equal(attribute(root, 'id'), 'completed-tasks');
  assert.equal(attribute(root, 'data-source'), 'sample');
  assert.ok(attribute(root, 'class')?.split(' ').includes('summary-value'));
  assert.match(markup, /<button\b[^>]*type="button"[^>]*>Review tasks<\/button>/);
});

test('StatGroup gives ordinary Stat and Card children one actual GridItem each', () => {
  const markup = render(StatGroup, { 'aria-label': 'Workspace totals' },
    React.createElement(Stat, { label: 'Workspaces', value: 8 }),
    null, false,
    React.createElement(Card, null, React.createElement(Stat, { label: 'Queued tasks', value: 24 })),
  );
  const root = divsWithClass(markup, 'cr-grid')[0];
  assert.ok(root, 'the collection uses the shared Grid surface');
  assert.equal(attribute(root, 'role'), 'group');
  assert.equal(attribute(root, 'aria-label'), 'Workspace totals');
  assert.ok(markup.indexOf('Workspaces') < markup.indexOf('Queued tasks'), 'reading order follows the caller');
  const expectedGrid = render(Grid, { columns: { base: 1, sm: 2, md: 3 }, gap: 6 });
  assert.equal(attribute(divsWithClass(markup, 'cr-grid-layout')[0], 'style'), attribute(divsWithClass(expectedGrid, 'cr-grid-layout')[0], 'style'), 'default layout follows the public Grid recipe');
  const items = divsWithClass(markup, 'cr-grid-item');
  assert.equal(items.length, 2, 'absent content does not allocate extra cells');
  const expectedItem = attribute(divsWithClass(render(GridItem, { span: 1 }), 'cr-grid-item')[0], 'style');
  for (const item of items) assert.equal(attribute(item, 'style'), expectedItem, 'ordinary children occupy one track');
});

test('StatGroup forwards Grid recipes and retains explicit GridItem spans without another wrapper', () => {
  const layout = { columns: { base: 1, md: 4 }, gap: { base: 3, md: 6 }, rowGap: 2, columnGap: 4, align: { base: 'start', md: 'baseline' }, justify: 'end' };
  const placement = { span: { base: 'full', md: 2 }, rowSpan: 2, align: 'center', justify: 'end', 'data-cell': 'wide' };
  const markup = render(StatGroup, { ...layout, id: 'task-totals', 'aria-label': 'Task totals' },
    React.createElement(GridItem, placement, React.createElement(Card, null, React.createElement(Stat, { label: 'Completed', value: 96 }))),
    React.createElement(Stat, { label: 'In review', value: 12 }),
  );
  assert.equal(attribute(divsWithClass(markup, 'cr-grid')[0], 'id'), 'task-totals');
  const expectedGrid = render(Grid, layout);
  assert.equal(attribute(divsWithClass(markup, 'cr-grid-layout')[0], 'style'), attribute(divsWithClass(expectedGrid, 'cr-grid-layout')[0], 'style'), 'responsive columns, axes, and alignment use the shared Grid behavior');
  const items = divsWithClass(markup, 'cr-grid-item');
  assert.equal(items.length, 2, 'a direct GridItem is not wrapped in another GridItem');
  const wide = items.find(item => attribute(item, 'data-cell') === 'wide');
  assert.ok(wide, 'native item attributes are preserved');
  const expectedItem = divsWithClass(render(GridItem, placement), 'cr-grid-item')[0];
  assert.equal(attribute(wide, 'style'), attribute(expectedItem, 'style'), 'the explicit span, row span, and alignment reach GridItem unchanged');
});
