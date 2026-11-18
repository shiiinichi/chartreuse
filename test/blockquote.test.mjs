import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Blockquote } from '@chartreuse/ui';

test('Blockquote defaults to a plain neutral quotation with a separate source caption', () => {
  const markup = renderToStaticMarkup(React.createElement(Blockquote, {
    cite: 'https://example.com/review',
    attribution: React.createElement('cite', null, 'Workspace review'),
  }, React.createElement('p', null, 'Keep the <useful> context.')));
  assert.match(markup, /^<figure class="cr-blockquote" data-variant="plain" data-tone="neutral">/);
  assert.ok(markup.includes('<blockquote class="cr-blockquote-content" cite="https://example.com/review"><p>Keep the &lt;useful&gt; context.</p></blockquote>'));
  assert.ok(markup.endsWith('<figcaption class="cr-blockquote-attribution"><cite>Workspace review</cite></figcaption></figure>'));
  assert.ok(!markup.includes('role=') && !markup.includes('aria-live='));
});

test('Blockquote supports both visual variants and every shared tone without changing quote semantics', () => {
  for (const variant of ['plain', 'filled']) {
    for (const tone of ['neutral', 'info', 'success', 'warning', 'danger']) {
      const markup = renderToStaticMarkup(React.createElement(Blockquote, { variant, tone }, 'Quoted words.'));
      assert.ok(markup.startsWith(`<figure class="cr-blockquote" data-variant="${variant}" data-tone="${tone}">`));
      assert.ok(markup.endsWith('<blockquote class="cr-blockquote-content">Quoted words.</blockquote></figure>'));
      assert.ok(!markup.includes('figcaption'));
      assert.ok(!/\s(?:variant|tone)=/.test(markup), 'visual props do not become native attributes');
    }
  }
});

test('Blockquote forwards native figure attributes while keeping cite on the quoted content', () => {
  const markup = renderToStaticMarkup(React.createElement(Blockquote, {
    variant: 'filled', tone: 'warning', cite: 'https://example.com/notes',
    attribution: false, id: 'review-quote', className: 'review-note', dir: 'rtl',
    title: 'Quoted review note', 'aria-label': 'Review quotation', 'data-context': 'review',
    style: { maxInlineSize: 480 },
  }, 'A clear next step.'));
  const figure = markup.match(/^<figure\b[^>]*>/)?.[0];
  assert.ok(figure);
  for (const attribute of ['id="review-quote"', 'class="cr-blockquote review-note"', 'dir="rtl"', 'title="Quoted review note"', 'aria-label="Review quotation"', 'data-context="review"', 'style="max-inline-size:480px"']) assert.ok(figure.includes(attribute), attribute);
  assert.ok(!figure.includes('cite=') && !figure.includes('attribution='));
  assert.ok(markup.includes('<blockquote class="cr-blockquote-content" cite="https://example.com/notes">'));
  assert.ok(!markup.includes('figcaption'));
});
