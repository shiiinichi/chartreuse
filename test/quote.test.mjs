import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Conversation, formatQuote, insertQuote } from '@chartreuse/ui';

test('formatQuote prefixes every line and keeps blank lines inside the quote', () => {
  assert.equal(formatQuote('First line\r\nSecond line'), '> First line\n> Second line');
  assert.equal(formatQuote('\n\n  Indented\n\nAfter a gap\n\n'), '>   Indented\n>\n> After a gap');
  assert.equal(formatQuote('```ts\nconst a = 1;\n```'), '> ```ts\n> const a = 1;\n> ```');
  assert.equal(formatQuote(' \n\t'), '');
});

test('insertQuote does nothing without a composer or text', () => {
  assert.equal(insertQuote(null, 'Quoted'), false);
  assert.equal(insertQuote(undefined, 'Quoted'), false);
});

test('Conversation only positions for quoting when onQuote is supplied', () => {
  const messages = [{ id: 'reply', role: 'agent', body: 'Reply' }];
  assert.doesNotMatch(renderToStaticMarkup(React.createElement(Conversation, { messages })), /data-quotable/);
  const quotable = renderToStaticMarkup(React.createElement(Conversation, { messages, onQuote: () => {} }));
  assert.match(quotable, /class="cr-conversation" data-quotable="true" role="log"/);
  assert.match(quotable, /class="cr-conversation-body" data-format="markdown" data-message-id="reply"/);
  assert.doesNotMatch(quotable, /cr-conversation-quote/, 'the button waits for a selection');
});
