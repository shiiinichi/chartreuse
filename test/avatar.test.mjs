import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar, AvatarGroup } from '@chartreuse/ui';

test('Avatar keeps its standalone accessible image and existing group structure by default', () => {
  const markup = renderToStaticMarkup(React.createElement(Avatar, { name: 'Alex Morgan' }));
  assert.match(markup, /^<span[^>]*role="img"/);
  assert.ok(markup.includes('aria-label="Alex Morgan"') && markup.includes('title="Alex Morgan"'));
  assert.ok(markup.includes('class="cr-avatar"') && markup.endsWith('>AM</span>'));
  assert.ok(!markup.includes('cr-avatar-person') && !markup.includes('showName'));
  const group = renderToStaticMarkup(React.createElement(AvatarGroup, { names: ['Alex Morgan', 'Sam Lee'] }));
  assert.equal([...group.matchAll(/class="cr-avatar"/g)].length, 2);
  assert.ok(!group.includes('cr-avatar-person'));
});

test('Avatar showName exposes one visible name with a decorative initials glyph', () => {
  const markup = renderToStaticMarkup(React.createElement(Avatar, { name: 'Alex Morgan', showName: true }));
  assert.match(markup, /^<span class="cr-avatar-person">/);
  assert.match(markup, /<span[^>]*class="cr-avatar"[^>]*aria-hidden="true">AM<\/span>/);
  assert.ok(markup.includes('<span class="cr-avatar-name">Alex Morgan</span>'));
  assert.equal([...markup.matchAll(/Alex Morgan/g)].length, 1);
  assert.ok(!markup.includes('role="img"') && !markup.includes('aria-label=') && !markup.includes('title='));
});

test('Avatar showName forwards native attributes to the wrapper while retaining glyph options', () => {
  const markup = renderToStaticMarkup(React.createElement(Avatar, {
    name: 'Sam Lee', showName: true, size: 'lg', color: 'purple',
    id: 'task-owner', className: 'owner-row', 'data-context': 'review', dir: 'rtl',
    title: 'Task owner', style: { color: 'rebeccapurple' },
  }));
  const wrapper = markup.match(/^<span[^>]*>/)?.[0];
  assert.ok(wrapper);
  for (const attribute of ['id="task-owner"', 'class="cr-avatar-person owner-row"', 'data-context="review"', 'dir="rtl"', 'title="Task owner"', 'style="color:rebeccapurple"']) assert.ok(wrapper.includes(attribute), attribute);
  assert.match(markup, /<span class="cr-avatar" data-size="lg" data-color="purple" aria-hidden="true">SL<\/span>/);
  assert.equal([...markup.matchAll(/id="task-owner"/g)].length, 1);
});
