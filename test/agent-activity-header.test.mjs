import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AgentActivity, countAgentActivity } from '@chartreuse/ui';

const events = Array.from({ length: 8 }, (_, index) => ({ id: `e${index}`, title: `Event ${index}`, status: index === 0 ? 'running' : 'completed', output: 'done' }));

test('a headerless list renders every row without the summary, disclosure, or footer', () => {
  const markup = renderToStaticMarkup(React.createElement(AgentActivity, { variant: 'list', header: false, label: 'Tool activity', events, announce: true }));
  assert.match(markup, /^<div role="group" aria-label="Tool activity" class="cr-agent-activity" data-variant="list" data-header="false">/);
  for (const absent of ['cr-agent-activity-summary', 'cr-agent-activity-list-disclosure', 'cr-agent-activity-list-footer', 'Collapse activity', ' header=']) assert.ok(!markup.includes(absent), absent);
  assert.equal(markup.match(/class="cr-agent-activity-item"/g)?.length, 8);
  assert.ok(markup.includes('<details class="cr-agent-activity-event">'), 'rows keep their details');
  assert.ok(markup.includes('role="status" aria-atomic="true">Tool activity. 8 activities · 1 running.</span>'), 'announce still reports counts');
});

test('the list header stays by default and the empty message shows without a header', () => {
  assert.match(renderToStaticMarkup(React.createElement(AgentActivity, { variant: 'list', events })), /cr-agent-activity-summary/);
  assert.match(renderToStaticMarkup(React.createElement(AgentActivity, { variant: 'list', header: false, events: [] })), /No activity recorded\./);
});

test('countAgentActivity counts statuses the way rows show them', () => {
  assert.deepEqual(countAgentActivity([
    { id: 'a', title: 'A', status: 'running' },
    { id: 'b', title: 'B', status: 'completed', exitCode: 2 },
    { id: 'c', title: 'C' },
    { id: 'd', title: 'D', status: 'queued' },
    { id: 'e', title: 'E', status: 'interrupted' },
  ]), { total: 5, queued: 1, running: 1, completed: 0, failed: 1, interrupted: 1, info: 1 });
});
