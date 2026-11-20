import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Pagination, Table } from '@chartreuse/ui';

const h = React.createElement;
const columns = [
  { id: 'task', header: 'Task', rowHeader: true, render: task => h('button', { type: 'button' }, task.title) },
  { id: 'remaining', header: 'Checks left', align: 'end', render: task => task.remaining },
];

const renderTable = props => renderToStaticMarkup(h(Table, {
  label: 'Release tasks',
  columns,
  getRowKey: task => task.id,
  ...props,
}));

const renderPagination = props => renderToStaticMarkup(h(Pagination, {
  onPageChange: () => {},
  ...props,
}));

function buttonNamed(markup, label) {
  const buttons = [...markup.matchAll(/<button\b[^>]*>/g)].map(([button]) => button);
  const button = buttons.find(tag => tag.includes(`aria-label="${label}"`));
  assert.ok(button, `Expected a button named ${label}`);
  return button;
}

test('Table renders named native columns, data rows, and status row groups', () => {
  const markup = renderTable({
    groups: [
      { id: 'review', heading: h('span', null, 'In review ', h('span', null, '1')), rows: [{ id: 'docs', title: 'Review install guide', remaining: 2 }] },
      { id: 'done', heading: h('span', null, 'Done ', h('span', null, '0')), rows: [], emptyContent: 'No completed tasks.' },
    ],
  });

  assert.match(markup, /<table\b[^>]*><caption\b[^>]*>Release tasks<\/caption>/);
  assert.match(markup, /<thead\b[^>]*><tr\b[^>]*><th\b[^>]*scope="col"[^>]*>Task<\/th><th\b[^>]*scope="col"[^>]*>Checks left<\/th><\/tr><\/thead>/);
  const bodies = [...markup.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/g)].map(match => match[1]);
  assert.equal(bodies.length, 2);
  assert.match(bodies[0], /<th\b[^>]*scope="rowgroup"[^>]*><span>In review <span>1<\/span><\/span><\/th>/);
  assert.match(bodies[0], /<th\b[^>]*scope="row"[^>]*><button type="button">Review install guide<\/button><\/th><td\b[^>]*>2<\/td>/);
  assert.match(bodies[1], /<th\b[^>]*scope="rowgroup"[^>]*><span>Done <span>0<\/span><\/span><\/th>/);
  assert.match(bodies[1], /<td\b[^>]*colspan="2"[^>]*>No completed tasks\.<\/td>/i);
});

test('Table accepts native attributes and renders caller-provided page rows before the pager', () => {
  const markup = renderTable({
    id: 'release-tasks',
    className: 'release-table',
    rows: [{ id: 'tokens', title: 'Check theme tokens', remaining: 0 }],
    pagination: { page: 2, pageCount: 3, onPageChange: () => {}, 'aria-label': 'Release task pages' },
  });

  assert.match(markup, /<table\b[^>]*id="release-tasks"/);
  assert.match(markup, /<table\b[^>]*class="[^"]*\brelease-table\b[^"]*"/);
  assert.match(markup, /<tbody\b[^>]*>.*Check theme tokens.*<td\b[^>]*>0<\/td>.*<\/tbody>/);
  assert.match(markup, /<\/table>.*<nav\b[^>]*aria-label="Release task pages"/);
  assert.match(buttonNamed(markup, 'Page 2'), /aria-current="page"/);
});

test('Table handles an empty result and keeps pagination optional', () => {
  const markup = renderTable({ rows: [], emptyContent: 'No matching tasks.' });

  assert.match(markup, /<tbody\b[^>]*><tr\b[^>]*><td\b[^>]*colspan="2"[^>]*>No matching tasks\.<\/td>/i);
  assert.doesNotMatch(markup, /<nav\b/);
});

test('Pagination names its controls and marks both ends of the available pages', () => {
  assert.equal(renderPagination({ page: 1, pageCount: 0 }), '');
  assert.equal(renderPagination({ page: 1, pageCount: 1 }), '');

  const first = renderPagination({ page: 1, pageCount: 3 });
  assert.match(first, /<nav\b[^>]*aria-label="Pagination"/);
  assert.match(buttonNamed(first, 'Previous page'), /aria-disabled="true"/);
  assert.doesNotMatch(buttonNamed(first, 'Next page'), /aria-disabled="true"/);
  assert.match(buttonNamed(first, 'Page 1'), /aria-current="page"/);

  const last = renderPagination({ page: 3, pageCount: 3 });
  assert.doesNotMatch(buttonNamed(last, 'Previous page'), /aria-disabled="true"/);
  assert.match(buttonNamed(last, 'Next page'), /aria-disabled="true"/);
  assert.match(buttonNamed(last, 'Page 3'), /aria-current="page"/);
});

test('Pagination presents a bounded set of numbered controls for large page counts', () => {
  const markup = renderPagination({ page: 540, pageCount: 1000, 'aria-label': 'Build history pages' });

  assert.match(markup, /<nav\b[^>]*aria-label="Build history pages"/);
  assert.match(buttonNamed(markup, 'Page 540'), /aria-current="page"/);
  assert.equal([...markup.matchAll(/aria-current="page"/g)].length, 1);
  buttonNamed(markup, 'Page 1');
  buttonNamed(markup, 'Page 1000');
  assert.ok([...markup.matchAll(/aria-label="Page \d+"/g)].length <= 9);
});
