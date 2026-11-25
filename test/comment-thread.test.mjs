import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, CommentThread, Menu, MessageComposer, RunStatus, SplitButton } from '@chartreuse/ui';

const h = React.createElement;
const reply = number => ({ id: String(number), sender: 'Agent', senderTone: 'info', reference: `#${number}`, time: { label: `Nov 25, 5:4${number} PM`, shortLabel: `5:4${number} PM` }, body: `Reply ${number}` });
const comment = { id: '5', sender: 'Human', senderTone: 'success', label: 'Comment #5', reference: '#5', meta: ['edited', 'Codex'],
  time: { label: 'Nov 25, 6:10 PM', shortLabel: '6:10 PM', title: '11/25/2026, 6:10:16 PM', dateTime: '2026-11-25T18:10:16' }, body: 'Check **spec**.' };

test('a thread shows the latest replies in the band, with the earlier count and the composer last', () => {
  const markup = renderToStaticMarkup(h(CommentThread, { comment, replies: [1, 2, 3, 4, 5].map(reply), composer: h('form', { id: 'composer' }) }));
  assert.match(markup, /^<article aria-label="Comment #5" class="cr-card cr-comment-thread">/);
  assert.ok(markup.includes('<time dateTime="2026-11-25T18:10:16" title="11/25/2026, 6:10:16 PM"><span class="cr-comment-time-long">Nov 25, 6:10 PM</span><span class="cr-comment-time-short">6:10 PM</span></time> · edited · Codex'), 'time and meta');
  assert.ok(markup.includes('<strong'), 'Markdown body');
  assert.ok(markup.includes('Show 3 earlier replies'));
  assert.deepEqual([...markup.matchAll(/data-comment-id="(\d)"/g)].map(match => match[1]), ['5', '4', '5']);
  assert.ok(markup.indexOf('id="composer"') > markup.indexOf('cr-comment-thread-list'), 'composer after the replies');
});

test('collapsed replies keep the bar with a summary and an Expand toggle, and the composer stays in the band', () => {
  const markup = renderToStaticMarkup(h(CommentThread, { comment, replies: [1, 2, 3].map(reply), defaultCollapsed: true, composer: h('form', { id: 'composer' }) })).replace(/<!-- -->/g, '');
  assert.match(markup, /3 replies<\/span><span class="cr-comment-thread-summary-latest">· latest from Agent, 5:43 PM/);
  assert.match(markup, /aria-expanded="false" aria-controls="[^"]+-replies"[^>]*>Expand<\/button>/);
  assert.match(markup, /class="cr-comment-thread-list" role="list" hidden=""/);
  assert.ok(markup.indexOf('id="composer"') > markup.indexOf('cr-comment-thread-replies'), 'composer stays in the band');
});

test('Card rings when highlighted and tints a danger footer', () => {
  const markup = renderToStaticMarkup(h(Card, { highlighted: true, footerTone: 'danger', footer: 'Delete #4?' }, 'Body'));
  assert.match(markup, /data-highlighted="true" data-footer-tone="danger"/);
  assert.doesNotMatch(renderToStaticMarkup(h(Card, null, 'Body')), /data-highlighted|data-footer-tone/);
});

test('Menu renders a labelled menu button and menu items with a danger tone and separator', () => {
  const markup = renderToStaticMarkup(h(Menu, { label: 'More actions for #5', items: [
    { id: 'edit', label: 'Edit', onSelect() {} }, { type: 'separator' }, { id: 'delete', label: 'Delete', tone: 'danger', disabled: true, onSelect() {} },
  ] }));
  assert.match(markup, /aria-label="More actions for #5" title="More actions for #5" aria-haspopup="menu" aria-expanded="false"/);
  assert.match(markup, /role="menu" aria-label="More actions for #5" aria-orientation="vertical"/);
  assert.equal(markup.match(/role="menuitem" tabindex="-1"/g)?.length, 2);
  assert.match(markup, /role="separator"/);
  assert.match(markup, /data-tone="danger" aria-disabled="true"/);
});

test('an inline composer renders the field, controls, and send in one row without a footer', () => {
  const markup = renderToStaticMarkup(h(MessageComposer, { layout: 'inline', onSend() {}, controls: 'Controls', hint: 'Hint' }));
  assert.match(markup, /data-layout="inline"/);
  assert.match(markup, /rows="1"/);
  assert.doesNotMatch(markup, /cr-message-composer-footer/);
  assert.match(markup, /<div class="cr-sr-only" id="[^"]+-hint">Hint<\/div>/);
  assert.ok(markup.indexOf('cr-message-composer-controls') < markup.indexOf('cr-message-composer-send'));
});

test('a reply with an ask shows the ask group first, and a pending ask skips the reply header', () => {
  const ask = { id: '7', anchorId: 'comment-7', label: 'Your ask #7', agent: 'Claude Code · opus', reference: '#7', time: { label: 'Nov 25, 6:46 PM', shortLabel: '6:46 PM' }, body: 'Check review.' };
  const markup = renderToStaticMarkup(h(CommentThread, { comment, replies: [
    { ...reply(1), label: 'Your ask #7 and reply #8', ask },
    { id: '10', sender: 'Agent', ask: { ...ask, id: '9', anchorId: undefined, label: 'Your ask #9' }, content: h('div', { id: 'running' }) },
  ] }));
  assert.match(markup, /role="group" aria-label="Your ask #7" id="comment-7" data-comment-id="7" tabindex="-1" class="cr-comment-ask"/);
  assert.ok(markup.includes('<span class="cr-comment-ask-intro">You asked</span><span class="cr-comment-ask-agent" title="Claude Code · opus">'));
  const first = markup.slice(markup.indexOf('Your ask #7 and reply #8'));
  assert.ok(first.indexOf('cr-comment-ask') < first.indexOf('cr-comment-header'));
  const pending = markup.slice(markup.indexOf('aria-label="Your ask #9"'));
  assert.doesNotMatch(pending, /cr-comment-header/);
  assert.match(pending, /id="running"/);
});

test('an icon-only SplitButton keeps its text as the name and tooltip', () => {
  const markup = renderToStaticMarkup(h(SplitButton, { iconOnly: 'narrow', menuLabel: 'Agent', icon: props => h('svg', props) }, 'Ask agent'));
  assert.match(markup, /data-icon-only="narrow"/);
  assert.match(markup, /title="Ask agent"[^>]*>.*<span class="cr-split-button-text">Ask agent<\/span>/);
});

test('RunStatus announces only the step, never the elapsed time', () => {
  const markup = renderToStaticMarkup(h(RunStatus, { label: h(React.Fragment, null, 'Reading ', h('code', null, 'docs/spec-1.md')), title: 'Reading docs/spec-1.md', elapsed: '0:18', onStop() {} }));
  assert.match(markup, /<span class="cr-run-status-label" title="Reading docs\/spec-1.md">Reading <code>docs\/spec-1.md<\/code><\/span><span class="cr-run-status-elapsed">0:18<\/span>/);
  assert.match(markup, /<span class="cr-sr-only" role="status" aria-atomic="true">Reading docs\/spec-1.md<\/span>/);
  assert.equal(markup.match(/role="status"/g).length, 1);
  assert.match(markup, /aria-label="Stop agent reply" title="Stop agent reply"[^>]*>.*<span class="cr-run-status-stop-text">Stop<\/span>/);
  assert.doesNotMatch(renderToStaticMarkup(h(RunStatus, { label: 'Working' })), /cr-run-status-stop|cr-run-status-elapsed/);
});
