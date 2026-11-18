import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { Disclosure } from '@chartreuse/ui';

test('Disclosure defaults to hover highlighting and retains a native summary with escaped content', () => {
  const markup = renderToStaticMarkup(React.createElement(Disclosure, {
    title: 'Review <script>unsafe()</script>',
  }, React.createElement('p', null, 'Supporting <context>.')));
  assert.match(markup, /^<details\b[^>]*data-header-highlight="hover"/);
  assert.match(markup, /<summary class="cr-disclosure-summary">/);
  assert.ok(markup.includes('aria-hidden="true"'), 'the chevron remains decorative');
  assert.ok(markup.includes('Review &lt;script&gt;unsafe()&lt;/script&gt;'));
  assert.ok(markup.includes('<div class="cr-disclosure-content"><p>Supporting &lt;context&gt;.</p></div>'));
  assert.ok(!markup.includes('role="button"') && !markup.includes('aria-expanded='), 'native summary owns expansion semantics');
  assert.ok(!markup.includes('headerHighlight') && !/^<details[^>]*\bopen(?:=|\s|>)/.test(markup));
});

test('Disclosure highlighting options are independent of controlled and uncontrolled open state', () => {
  for (const headerHighlight of ['hover', 'open', 'always']) {
    for (const expanded of [false, true]) {
      const uncontrolled = renderToStaticMarkup(React.createElement(Disclosure, {
        title: 'Supporting context', headerHighlight, defaultOpen: expanded,
        name: 'workspace-notes', id: 'notes', className: 'workspace-disclosure', dir: 'rtl',
      }, 'Useful context.'));
      const controlled = renderToStaticMarkup(React.createElement(Disclosure, {
        title: 'Supporting context', headerHighlight, open: expanded, onOpenChange: () => {},
      }, 'Useful context.'));
      for (const markup of [uncontrolled, controlled]) {
        const details = markup.match(/^<details\b[^>]*>/)?.[0];
        assert.ok(details.includes(`data-header-highlight="${headerHighlight}"`));
        assert.equal(/\bopen=""/.test(details), expanded);
        assert.ok(!markup.includes('headerHighlight') && !markup.includes('onOpenChange'));
      }
      assert.ok(uncontrolled.includes('name="workspace-notes"') && uncontrolled.includes('id="notes"') && uncontrolled.includes('dir="rtl"'));
      assert.ok(uncontrolled.includes('class="cr-disclosure workspace-disclosure"'));
      assert.ok(!controlled.includes('name='), 'controlled groups still leave exclusivity to their owner');
    }
  }
});

test('Disclosure header-highlight examples are public, copyable TSX', async () => {
  const source = ts.createSourceFile('DisclosurePage.tsx', await readFile(new URL('../src/docs/DisclosurePage.tsx', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const snippets = [];
  const visit = node => {
    if (ts.isJsxAttribute(node) && node.name.getText(source) === 'code' && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression && ts.isStringLiteralLike(node.initializer.expression)) snippets.push(node.initializer.expression.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.equal(snippets.length, 4, 'the two existing scenarios and two header options have source');
  for (const mode of ['open', 'always']) {
    const snippet = snippets.find(code => code.includes(`headerHighlight="${mode}"`));
    assert.ok(snippet?.includes("from '@chartreuse/ui'"));
    assert.ok(snippet.includes("import '@chartreuse/ui/styles.css'"));
    const file = ts.createSourceFile(`disclosure-${mode}.tsx`, snippet, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.equal(file.parseDiagnostics.length, 0, `${mode} snippet parses`);
  }
});
