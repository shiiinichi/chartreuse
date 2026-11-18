import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Progress } from '@chartreuse/ui';

test('Progress retains its bare-bar appearance and accessible label by default', () => {
  const markup = renderToStaticMarkup(React.createElement(Progress, { value: 3, max: 5, label: '3 of 5 tasks complete' }));
  assert.match(markup, /^<progress\b/);
  assert.ok(markup.includes('value="3"') && markup.includes('max="5"'));
  assert.ok(markup.includes('aria-label="3 of 5 tasks complete"'));
  assert.ok(!markup.includes('cr-progress-group') && !markup.includes('<label'));
});

test('Progress links optional visible text and supporting content to its native bar', () => {
  const markup = renderToStaticMarkup(React.createElement(Progress, {
    id: 'reported-context', value: 31797, max: 828400, label: 'Last reported context', showLabel: true,
    valueText: '31,797 / 828,400 tokens', description: '4% of the reported model window.',
    'aria-describedby': 'provider-note',
  }));
  assert.ok(markup.includes('<label class="cr-progress-label" for="reported-context">Last reported context</label>'));
  assert.ok(markup.includes('aria-valuetext="31,797 / 828,400 tokens"'));
  const description = markup.match(/<div class="cr-progress-description" id="([^"]+)">/);
  assert.ok(description);
  assert.ok(markup.includes(`aria-describedby="provider-note ${description[1]}"`));
  assert.ok(markup.includes('id="reported-context"'));
});

test('Progress forwards native attributes and supports explicit accessible value wording', () => {
  const markup = renderToStaticMarkup(React.createElement(Progress, {
    value: 31797, max: 828400, label: 'Reported context', valueText: '31,797 / 828,400 tokens',
    'aria-valuetext': '31,797 of 828,400 tokens', 'data-source': 'provider', title: 'Context snapshot',
    className: 'context-bar', style: { width: '60%' },
  }, 'Fallback progress text'));
  const bar = markup.match(/<progress\b[^>]*>/)?.[0];
  assert.ok(bar);
  for (const attribute of ['aria-valuetext="31,797 of 828,400 tokens"', 'data-source="provider"', 'title="Context snapshot"', 'class="cr-progress context-bar"', 'style="width:60%"']) assert.ok(bar.includes(attribute), attribute);
  assert.ok(markup.includes('Fallback progress text</progress>'));
  assert.ok(!markup.includes('<label'), 'a formatted value alone does not expose the accessible label visually');
});
