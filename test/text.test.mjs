import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';
import postcss from 'postcss';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { MarkdownRenderer, Text } from '@chartreuse/ui';
import { typography } from '@chartreuse/ui/tokens';

test('Text chooses the native heading level from size and forwards DOM attributes', () => {
  const heading = renderToStaticMarkup(h(Text, {
    size: 'heading-3', id: 'review', className: 'review-title', 'data-review': 'pending',
  }, 'Release review'));
  assert.equal(heading, '<h3 id="review" data-review="pending" class="cr-text review-title" data-size="heading-3">Release review</h3>');
  assert.match(renderToStaticMarkup(h(Text, { size: 'display' }, 'Review')), /^<h1 /);
  for (let level = 1; level <= 3; level++) {
    assert.ok(renderToStaticMarkup(h(Text, { size: `heading-${level}` }, 'Review')).startsWith(`<h${level} `));
  }
});

test('Text supports inline formatting together and a block without a wrapper', () => {
  const formatted = h(Text, { bold: true, italic: true, strikethrough: true, display: 'inline' }, 'Thursday');
  const paragraph = renderToStaticMarkup(h(Text, { size: 'body' }, 'Moved from ', formatted, ' to Friday.'));
  assert.equal(paragraph, '<p class="cr-text" data-size="body">Moved from <strong class="cr-text" data-display="inline" data-bold="true" data-italic="true" data-strikethrough="true">Thursday</strong> to Friday.</p>');
  assert.equal(renderToStaticMarkup(h(Text, { display: 'block', size: 'label', bold: false }, 'Updated')), '<div class="cr-text" data-size="label" data-display="block">Updated</div>');
  assert.equal(renderToStaticMarkup(h(Text, { display: 'block', size: 'body' }, h(Text, { size: 'heading-3' }, 'Review'))),
    '<div class="cr-text" data-size="body" data-display="block"><h3 class="cr-text" data-size="heading-3">Review</h3></div>');
  assert.equal(renderToStaticMarkup(h(Text, { display: 'inline', size: 'heading-2' }, 'Updated')), '<span class="cr-text" data-size="heading-2" data-display="inline">Updated</span>');
  assert.equal(renderToStaticMarkup(h(Text, { display: 'inline', size: 'body' }, 'Updated')), '<span class="cr-text" data-size="body" data-display="inline">Updated</span>');
});

test('every Text size matches the documented scale', async () => {
  const css = postcss.parse(await readFile(new URL('../src/system/text.css', import.meta.url), 'utf8'));
  const sizes = new Map();
  css.walkRules(rule => {
    const size = /^:where\(\.cr-text\[data-size='([\w-]+)'\]\)$/.exec(rule.selector)?.[1];
    if (!size) return;
    const declarations = new Map();
    rule.walkDecls(declaration => { declarations.set(declaration.prop, declaration.value); });
    sizes.set(size, declarations);
  });
  assert.deepEqual([...sizes.keys()].sort(), typography.map(type => type.id).sort());
  for (const { id, size, weight, lineHeight } of typography) {
    assert.match(sizes.get(id).get('font-size'), /rem$/);
    assert.equal(Number.parseFloat(sizes.get(id).get('font-size')), size / 16);
    assert.equal(sizes.get(id).get('font-weight'), String(weight));
    assert.equal(sizes.get(id).get('line-height'), String(lineHeight));
  }
});

test('Markdown text retains all native heading levels, formatting, and footnote links', () => {
  const source = [
    '# Review',
    '## Status',
    '### Checks',
    '#### Evidence',
    '##### Notes',
    '###### Appendix',
    '**Ready**, *pending*, ~~removed~~.[^source]',
    '[^source]: Review notes.',
  ].join('\n\n');
  const markup = renderToStaticMarkup(h(MarkdownRenderer, null, source));
  assert.match(markup, /<h1 class="cr-text" data-size="heading-1">Review<\/h1>/);
  assert.match(markup, /<h2 class="cr-text" data-size="heading-2">Status<\/h2>/);
  assert.match(markup, /<h3 class="cr-text" data-size="heading-3">Checks<\/h3>/);
  assert.match(markup, /<h4\b[^>]*>Evidence<\/h4>/);
  assert.match(markup, /<h5\b[^>]*>Notes<\/h5>/);
  assert.match(markup, /<h6\b[^>]*>Appendix<\/h6>/);
  assert.match(markup, /<p class="cr-text" data-size="body"><strong class="cr-text" data-bold="true">Ready<\/strong>, <em class="cr-text" data-italic="true">pending<\/em>, <del class="cr-text" data-strikethrough="true">removed<\/del>\./);
  const footnoteLabel = markup.match(/aria-describedby="([^"]+-footnotes)"/)?.[1];
  assert.ok(footnoteLabel);
  assert.ok(markup.includes(`<h2 id="${footnoteLabel}" class="cr-text cr-sr-only" data-size="heading-2">`));
});

test('library and documentation JSX use Text for headings and formatted text', async () => {
  const src = new URL('../src/', import.meta.url);
  const files = (await readdir(src, { recursive: true })).filter(file => file.endsWith('.tsx'));
  const nativeTypography = /^(?:h[1-6]|p|strong|b|em|i|s|del|small)$/;
  const violations = [];
  for (const file of files) {
    const source = ts.createSourceFile(file, await readFile(new URL(file, src), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && nativeTypography.test(node.tagName.getText(source))) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
        violations.push(`${file}:${line + 1} <${node.tagName.getText(source)}>`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.deepEqual(violations, []);
});
