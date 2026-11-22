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

const BotIcon = props => React.createElement('svg', { ...props, 'data-icon': 'bot' });

test('Avatar icon replaces the initials with a decorative, size-matched icon and keeps the accessible name', () => {
  const sizes = { sm: '14', md: '16', lg: '22' };
  for (const [size, px] of Object.entries(sizes)) {
    const markup = renderToStaticMarkup(React.createElement(Avatar, { name: 'Review Agent', icon: BotIcon, size }));
    assert.match(markup, /^<span[^>]*role="img"[^>]*aria-label="Review Agent"/);
    assert.ok(markup.includes(`width="${px}"`) && markup.includes(`height="${px}"`), size);
    assert.ok(markup.includes('aria-hidden="true"') && markup.includes('data-icon="bot"'));
    assert.ok(!markup.includes('>RA<'), 'initials are replaced');
  }
  const inline = renderToStaticMarkup(React.createElement(Avatar, { name: 'Design team', icon: React.createElement('svg', { viewBox: '0 0 24 24' }) }));
  assert.match(inline, /<svg[^>]*width="16"/);
  const named = renderToStaticMarkup(React.createElement(Avatar, { name: 'Review Agent', icon: BotIcon, showName: true }));
  assert.match(named, /<span class="cr-avatar"[^>]*aria-hidden="true"><svg/);
  assert.ok(named.includes('<span class="cr-avatar-name">Review Agent</span>'));
  const fallback = renderToStaticMarkup(React.createElement(Avatar, { name: 'Alex Morgan', icon: React.createElement('div') }));
  assert.ok(fallback.endsWith('>AM</span>'), 'a non-SVG element falls back to initials');
});

test('AvatarGroup items can show icons while the overflow count stays the same', () => {
  const group = renderToStaticMarkup(React.createElement(AvatarGroup, { items: [{ name: 'Review agent', icon: BotIcon }, { name: 'Alex Morgan' }, { name: 'Sam Lee' }, { name: 'Jamie Park' }], max: 2 }));
  assert.ok(group.includes('aria-label="Review agent"') && group.includes('data-icon="bot"') && group.includes('width="14"'));
  assert.ok(group.includes('>AM</span>') && !group.includes('Sam Lee'));
  assert.match(group, /<span class="cr-avatar cr-avatar-more" role="img" aria-label="2 more people">\+2<\/span>/);
  const byNames = renderToStaticMarkup(React.createElement(AvatarGroup, { names: ['Review agent', 'Alex Morgan', 'Sam Lee', 'Jamie Park'], max: 2 }));
  assert.ok(byNames.includes('>Ra</span>') && !byNames.includes('<svg'));
  assert.ok(byNames.includes('aria-label="2 more people">+2</span>'));
});
