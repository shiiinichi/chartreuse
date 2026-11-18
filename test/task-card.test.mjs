import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TaskCard } from '@chartreuse/ui';

const renderCard = props => renderToStaticMarkup(React.createElement(TaskCard, { taskId: 'TASK-024', title: 'Review a change request', ...props }));

test('TaskCard keeps legacy checklist props and omits absent extra information', () => {
  const plain = renderCard({});
  assert.ok(!plain.includes('cr-task-metadata'));

  const markup = renderCard({ completed: 2, total: 3, onClick() {} });
  assert.equal([...markup.matchAll(/data-info=/g)].length, 1);
  assert.ok(markup.includes('data-info="checklist"'));
  assert.ok(markup.includes('2/3 checklist'));
  assert.ok(markup.includes('2 of 3 checklist items complete.'));
  for (const stat of ['dependencies', 'related', 'comments', 'attachments']) assert.ok(!markup.includes(`data-info="${stat}"`));
});

test('TaskCard supplies one semantic metadata list with full accessible descriptions', () => {
  const markup = renderCard({ completed: 4, total: 4, dependencies: { completed: 1, total: 1 }, relatedCount: 1, commentCount: 2, attachmentCount: 1, onClick() {} });
  assert.equal([...markup.matchAll(/data-info=/g)].length, 5);
  const list = markup.match(/<ul class="cr-task-metadata" id="([^"]+)"/);
  assert.ok(list, 'metadata is a native list');
  assert.ok(markup.includes(`aria-describedby="${list[1]}"`), 'the content button references its metadata description');
  assert.ok(markup.indexOf('</button>') < markup.indexOf('<ul'), 'static metadata stays outside the content button');
  assert.ok(markup.indexOf('</ul>') < markup.indexOf('cr-task-footer'), 'the status footer stays below the metadata');
  for (const description of ['4 of 4 checklist items complete.', '1 of 1 dependency complete.', '1 related card.', '2 comments.', '1 attached file.']) assert.ok(markup.includes(description));
});

test('TaskCard distinguishes explicit zero information from omitted information', () => {
  const markup = renderCard({ dependencies: { completed: 0, total: 0 }, relatedCount: 0, commentCount: 0, attachmentCount: 0 });
  assert.equal([...markup.matchAll(/data-info=/g)].length, 4);
  for (const label of ['0 deps', '0 related', '0 comments', '0 files']) assert.ok(markup.includes(label));
  assert.ok(!markup.includes('data-info="checklist"'), 'zero checklist total retains its existing hidden behavior');
  assert.ok(!markup.includes('0/0'), 'empty dependencies use a useful zero label');
});
