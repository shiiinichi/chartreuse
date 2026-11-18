import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { IconButton, Tooltip } from '@chartreuse/ui';

const geometrySource = await readFile(new URL('../src/system/tooltip-position.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(geometrySource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { tooltipPosition, normalizeTooltipPlacement } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('Tooltip geometry supports all twelve placements and logical horizontal alignment', () => {
  const anchor = { left: 300, top: 200, width: 60, height: 40 };
  const popup = { width: 100, height: 60 };
  const viewport = { left: 0, top: 0, width: 800, height: 600 };
  for (const side of ['top', 'bottom', 'left', 'right']) {
    for (const suffix of ['', '-start', '-end']) {
      const placement = side + suffix;
      const result = tooltipPosition(anchor, popup, viewport, placement);
      assert.equal(result.side, side);
      assert.equal(result.placement, placement);
      if (side === 'top') assert.equal(result.top, 132);
      if (side === 'bottom') assert.equal(result.top, 248);
      if (side === 'left') assert.equal(result.left, 192);
      if (side === 'right') assert.equal(result.left, 368);
    }
  }
  assert.equal(tooltipPosition(anchor, popup, viewport, 'top-start').left, 300);
  assert.equal(tooltipPosition(anchor, popup, viewport, 'top-start', true).left, 260);
  assert.equal(tooltipPosition(anchor, popup, viewport, 'bottom-end', true).left, 300);
  assert.equal(tooltipPosition(anchor, popup, viewport, 'left-start', true).top, 200);
});

test('Tooltip flips toward available space and shifts its bubble and arrow within viewport edges', () => {
  const viewport = { left: 0, top: 0, width: 320, height: 240 };
  const top = tooltipPosition({ left: 100, top: 4, width: 80, height: 32 }, { width: 120, height: 40 }, viewport, 'top');
  assert.equal(top.side, 'bottom');
  assert.equal(top.top, 44);
  const left = tooltipPosition({ left: 2, top: 100, width: 32, height: 32 }, { width: 100, height: 40 }, viewport, 'left');
  assert.equal(left.side, 'right');
  assert.equal(left.left, 42);
  const shifted = tooltipPosition({ left: 0, top: 100, width: 20, height: 20 }, { width: 120, height: 40 }, viewport, 'bottom');
  assert.equal(shifted.left, 8);
  assert.equal(shifted.arrowX, 10);
  const panned = tooltipPosition({ left: 100, top: 40, width: 80, height: 32 }, { width: 120, height: 40 }, { left: 20, top: 60, width: 260, height: 200 }, 'top');
  assert.equal(panned.side, 'bottom');
  assert.ok(panned.top >= 68);
  for (const value of ['top-wrong', 'bottom-start-extra', 'top-', 'bottom-start-', undefined, 10]) assert.equal(normalizeTooltipPlacement(value), 'top');
});

test('Tooltip changes axes before covering its trigger when neither requested-axis side fits', () => {
  const cases = [
    {
      anchor: { left: 140, top: 300, width: 40, height: 40 }, popup: { width: 270, height: 37 },
      viewport: { left: 0, top: 0, width: 320, height: 740 }, placement: 'right-start', expected: 'bottom-start',
    },
    {
      anchor: { left: 140, top: 60, width: 40, height: 40 }, popup: { width: 80, height: 100 },
      viewport: { left: 0, top: 0, width: 320, height: 160 }, placement: 'top-end', expected: 'left-end',
    },
  ];
  for (const { anchor, popup, viewport, placement, expected } of cases) {
    const result = tooltipPosition(anchor, popup, viewport, placement);
    assert.equal(result.placement, expected, 'the alignment suffix survives the axis fallback');
    const horizontalOverlap = Math.min(result.left + popup.width, anchor.left + anchor.width) > Math.max(result.left, anchor.left);
    const verticalOverlap = Math.min(result.top + popup.height, anchor.top + anchor.height) > Math.max(result.top, anchor.top);
    assert.equal(horizontalOverlap && verticalOverlap, false, 'the bubble does not obscure the trigger');
    assert.ok(result.left >= 8 && result.top >= 8);
    assert.ok(result.left + popup.width <= viewport.width - 8 && result.top + popup.height <= viewport.height - 8);
  }
});

test('Tooltip keeps a resolvable native description without adding a focus stop or expansion state', () => {
  const markup = renderToStaticMarkup(React.createElement(Tooltip, { content: 'Keep <context> close.', id: 'context-tip' },
    React.createElement('button', { type: 'button', 'aria-describedby': 'existing-help', title: 'Native duplicate' }, 'Review')));
  assert.ok(markup.includes('<button type="button" aria-describedby="existing-help context-tip" title="">Review</button>'));
  assert.match(markup, /<div[^>]*id="context-tip"[^>]*role="tooltip"[^>]*hidden=""/);
  assert.ok(markup.includes('Keep &lt;context&gt; close.'));
  assert.ok(!markup.includes('tabindex=') && !markup.includes('aria-expanded=') && !markup.includes('aria-live='));
});

test('Tooltip preserves child handlers and caller labels while suppressing native title duplication', () => {
  const click = () => {}, focus = () => {}, pointer = () => {};
  let received;
  function CustomTrigger(props) { received = props; return React.createElement('button', props, 'Details'); }
  renderToStaticMarkup(React.createElement(Tooltip, { content: 'Supporting description.', id: 'details-tip' },
    React.createElement(CustomTrigger, { onClick: click, onFocus: focus, onPointerEnter: pointer, 'aria-label': 'Show details', 'aria-describedby': 'existing-help' })));
  assert.equal(received.onClick, click);
  assert.equal(received.onFocus, focus);
  assert.equal(received.onPointerEnter, pointer);
  assert.equal(received['aria-label'], 'Show details');
  assert.equal(received['aria-describedby'], 'existing-help details-tip');
  assert.equal(received.title, '');
  const iconMarkup = renderToStaticMarkup(React.createElement(Tooltip, { content: 'Keep this task nearby.' },
    React.createElement(IconButton, { label: 'Pin task', icon: React.createElement('svg', { 'aria-hidden': true }) })));
  assert.match(iconMarkup, /<button[^>]*aria-label="Pin task"[^>]*title=""/);
});

test('Tooltip instances use unique IDs and disabled or empty content preserves unrelated descriptions', () => {
  const markup = renderToStaticMarkup(React.createElement('div', null,
    React.createElement(Tooltip, { content: 'First hint.' }, React.createElement('button', null, 'First')),
    React.createElement(Tooltip, { content: 'Second hint.' }, React.createElement('a', { href: '#next' }, 'Next')),
  ));
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 2);
  assert.equal(new Set(ids).size, 2);
  for (const match of markup.matchAll(/aria-describedby="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
  for (const options of [{ disabled: true, content: 'Unavailable.' }, { content: '' }, { content: null }]) {
    const disabled = renderToStaticMarkup(React.createElement(Tooltip, { id: 'unused-tip', ...options }, React.createElement('button', { 'aria-describedby': 'existing-help' }, 'Action')));
    assert.ok(disabled.includes('aria-describedby="existing-help"'));
    assert.ok(!disabled.includes('aria-describedby="existing-help unused-tip"'));
  }
});
