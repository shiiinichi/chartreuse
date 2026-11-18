import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { Steps, Timeline } from '@chartreuse/ui';

test('Timeline reverses the actual event order and pending position without mutating its input', () => {
  const events = [{ id: 'first', title: 'First event', date: 'Nov 17', dateTime: '2026-11-17', content: 'Context <script>untrusted()</script>' }, { id: 'second', title: 'Second event' }];
  const forward = renderToStaticMarkup(React.createElement(Timeline, { items: events, pending: 'Next update' }));
  const reverse = renderToStaticMarkup(React.createElement(Timeline, { items: events, pending: 'Next update', reverse: true }));
  assert.match(forward, /^<ol\b/);
  assert.ok(forward.includes('role="list"'));
  assert.ok(forward.indexOf('First event') < forward.indexOf('Second event'));
  assert.ok(forward.indexOf('Second event') < forward.indexOf('Next update'));
  assert.ok(reverse.indexOf('Next update') < reverse.indexOf('Second event'));
  assert.ok(reverse.indexOf('Second event') < reverse.indexOf('First event'));
  assert.deepEqual(events.map(item => item.id), ['first', 'second']);
  assert.match(forward, /datetime="2026-11-17"/i);
  assert.ok(forward.includes('&lt;script&gt;untrusted()&lt;/script&gt;'));
});

test('Steps keeps a static numbered guide neutral and derives process state only when requested', () => {
  const items = [{ id: 'prepare', title: 'Prepare' }, { id: 'build', title: 'Build' }, { id: 'review', title: 'Review' }];
  const guide = renderToStaticMarkup(React.createElement(Steps, { items }));
  assert.ok(guide.includes('>01</span>') && guide.includes('>02</span>') && guide.includes('>03</span>'));
  assert.ok(!guide.includes('aria-current'));
  const process = renderToStaticMarkup(React.createElement(Steps, { items, current: 'build' }));
  assert.equal([...process.matchAll(/aria-current="step"/g)].length, 1);
  assert.equal([...process.matchAll(/data-status="complete"/g)].length, 1);
  assert.equal([...process.matchAll(/data-status="upcoming"/g)].length, 1);
  assert.ok(process.includes('Completed.') && process.includes('Upcoming.'));
});

test('Sequence components retain rich React content, custom SVG markers, and native list attributes', () => {
  const icon = React.createElement('svg', { viewBox: '0 0 24 24', 'data-symbol': 'diamond' }, React.createElement('path', { d: 'M12 2 22 12 12 22 2 12Z' }));
  const content = React.createElement('div', null, React.createElement('p', null, 'A useful note.'), React.createElement('pre', null, React.createElement('code', null, 'npm run build')));
  const markup = renderToStaticMarkup(React.createElement(Steps, { items: [{ id: 'build', title: 'Build', icon, status: 'error', content }], current: 'build', 'aria-label': 'Release process', 'data-project': 'chartreuse' }));
  assert.ok(markup.includes('aria-label="Release process"') && markup.includes('data-project="chartreuse"'));
  assert.ok(markup.includes('data-symbol="diamond"') && markup.includes('aria-hidden="true"'));
  assert.ok(markup.includes('Needs attention.') && markup.includes('aria-current="step"'));
  assert.ok(markup.includes('<p>A useful note.</p>') && markup.includes('<pre><code>npm run build</code></pre>'));
  const horizontal = renderToStaticMarkup(React.createElement(Timeline, { items: [{ id: 'one', title: 'A milestone' }], orientation: 'horizontal' }));
  assert.ok(horizontal.includes('tabindex="0"'), 'the local horizontal scroller is keyboard reachable');
});

test('Sequence reference and fixed Showcase snippets parse as TSX', async () => {
  let parsed = 0;
  const checkSnippet = (name, snippet) => {
    const file = ts.createSourceFile(`${name}.tsx`, snippet, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.equal(file.parseDiagnostics.length, 0, `${name}: ${file.parseDiagnostics.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')).join('\n')}`);
    parsed += 1;
    const visitMarkdown = node => {
      if (ts.isStringLiteralLike(node)) {
        for (const match of node.text.matchAll(/```tsx\n([\s\S]*?)\n```/g)) checkSnippet(`${name} inner code fence`, match[1]);
      }
      ts.forEachChild(node, visitMarkdown);
    };
    visitMarkdown(file);
  };
  for (const relative of ['../src/docs/reference/timeline.ts', '../src/docs/reference/steps.ts']) {
    const source = ts.createSourceFile(relative, await readFile(new URL(relative, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    let imports = ''; let usage = '';
    const visit = node => {
      if (ts.isPropertyAssignment(node) && ts.isStringLiteralLike(node.initializer)) {
        if (node.name.getText(source) === 'importCode') imports = node.initializer.text;
        if (node.name.getText(source) === 'usageCode') usage = node.initializer.text;
      }
      ts.forEachChild(node, visit);
    };
    visit(source); assert.ok(imports && usage); checkSnippet(relative, `${imports}\n${usage}`);
  }
  for (const relative of ['../src/docs/TimelineDemo.tsx', '../src/docs/StepsDemo.tsx']) {
    const source = ts.createSourceFile(relative, await readFile(new URL(relative, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = node => {
      if (ts.isJsxAttribute(node) && node.name.getText(source) === 'code' && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression && ts.isStringLiteralLike(node.initializer.expression)) checkSnippet(relative, node.initializer.expression.text);
      if (ts.isStringLiteralLike(node)) {
        for (const match of node.text.matchAll(/```tsx\n([\s\S]*?)\n```/g)) checkSnippet(`${relative} live code fence`, match[1]);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  assert.ok(parsed >= 5, 'both references and the rich-body fixed snippets were checked');
});
