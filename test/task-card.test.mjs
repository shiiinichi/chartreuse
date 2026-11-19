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

test('TaskCard can show metadata counts inline with their full labels in tooltips', () => {
  const markup = renderCard({ hideMetadataLabels: true, completed: 4, total: 4, dependencies: { completed: 1, total: 1 }, relatedCount: 1, commentCount: 2, attachmentCount: 1, onClick() {} });
  const list = markup.match(/<ul class="cr-task-metadata" id="([^"]+)">([\s\S]*?)<\/ul>/);
  assert.ok(list);
  assert.ok(markup.includes(`aria-describedby="${list[1]}"`), 'the card action still references the list');
  assert.ok(markup.indexOf('</button>') < markup.indexOf('<ul'), 'the tooltip triggers sit outside the card action');

  const rows = [...list[2].matchAll(/<li data-info="([^"]+)">([\s\S]*?)<\/li>/g)];
  const counts = ['4/4', '1/1', '1', '2', '1'];
  const labels = ['4/4 checklist', '1/1 deps', '1 related', '2 comments', '1 file'];
  const descriptions = ['4 of 4 checklist items complete.', '1 of 1 dependency complete.', '1 related card.', '2 comments.', '1 attached file.'];
  assert.deepEqual(rows.map(([, key]) => key), ['checklist', 'dependencies', 'related', 'comments', 'attachments']);
  for (const [index, [, , item]] of rows.entries()) {
    const trigger = item.match(/tabindex="0" aria-describedby="([^"]+)"/);
    assert.ok(trigger, 'the indicator can receive focus and references a tooltip');
    assert.match(item, /<svg[^>]+aria-hidden="true"/);
    assert.ok(item.includes(`id="${trigger[1]}" role="tooltip"`));
    assert.match(item, /role="tooltip"[^>]* hidden=""/);
    assert.ok(item.includes(`<div class="cr-tooltip-content">${labels[index]}</div>`));
    assert.ok(item.includes(`<span class="cr-sr-only">${descriptions[index]}</span>`));
    const inlineText = [...item.matchAll(/<span aria-hidden="true">([^<]+)<\/span>/g)].map(([, value]) => value);
    assert.deepEqual(inlineText, [counts[index]], 'the inline text contains only the count or ratio');
  }
});

test('TaskCard distinguishes explicit zero information from omitted information', () => {
  const counts = { dependencies: { completed: 0, total: 0 }, relatedCount: 0, commentCount: 0, attachmentCount: 0 };
  for (const hideMetadataLabels of [false, true]) {
    const markup = renderCard({ ...counts, hideMetadataLabels });
    assert.equal([...markup.matchAll(/data-info=/g)].length, 4);
    for (const label of ['0 deps', '0 related', '0 comments', '0 files']) assert.ok(markup.includes(label));
    assert.ok(!markup.includes('data-info="checklist"'), 'zero checklist total retains its existing hidden behavior');
    assert.ok(!markup.includes('0/0'), 'empty dependencies use a useful zero label');
    if (hideMetadataLabels) assert.equal((markup.match(/<span aria-hidden="true">0<\/span>/g) ?? []).length, 4);
  }
});
