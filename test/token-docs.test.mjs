import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postcss from 'postcss';
import ts from 'typescript';
import * as system from '@chartreuse/ui';

const workspace = fileURLToPath(new URL('../', import.meta.url));
const sourceCache = new Map();
const moduleCache = new Map();

/** Load the real data-only TS catalog, including its relative module graph. */
async function dataModuleURL(filename) {
  const absolute = path.resolve(workspace, filename);
  if (!moduleCache.has(absolute)) moduleCache.set(absolute, (async () => {
    const source = await readFile(absolute, 'utf8');
    let output = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    const module = ts.createSourceFile(absolute, output, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
    const edits = [];
    for (const statement of module.statements) {
      if (!(ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))) continue;
      const specifier = statement.moduleSpecifier;
      if (!specifier || !ts.isStringLiteral(specifier)) continue;
      assert.ok(specifier.text.startsWith('.'), `Token data must not import application/browser code: ${specifier.text}`);
      const dependency = path.resolve(path.dirname(absolute), `${specifier.text}.ts`);
      const url = await dataModuleURL(dependency);
      edits.push({ start: specifier.getStart(module), end: specifier.getEnd(), value: JSON.stringify(url) });
    }
    for (const edit of edits.reverse()) output = output.slice(0, edit.start) + edit.value + output.slice(edit.end);
    return `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`;
  })());
  return moduleCache.get(absolute);
}

const catalog = await import(await dataModuleURL('src/docs/tokens/index.ts'));
const { globalTokens, componentTokenDocs } = catalog;
const publicComponents = Object.entries(system)
  .filter(([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function')
  .map(([name]) => name).sort();

function variableReferences(value) {
  return [...value.matchAll(/\bvar\(\s*(--[\w-]+)/g)].map(match => match[1]);
}

// Ignore CSS whitespace/quote formatting while retaining tokens, separators,
// units, function structure, and the content of quoted font-family names.
function valueTokens(value) {
  return (value.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[(),/]|[^\s(),/]+/g) || []).map(token => {
    if (token.startsWith('"') || token.startsWith("'")) return `string:${token.slice(1, -1)}`;
    if (/^#[0-9a-f]+$/i.test(token)) return token.toLowerCase();
    const numeric = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/i.exec(token);
    return numeric ? `${Number(numeric[1])}${numeric[2].toLowerCase()}` : token;
  });
}

function normalizeSelector(selector) {
  return selector.trim().replace(/\s+/g, ' ').replace(/\s*([>+~])\s*/g, '$1');
}

async function sourceFile(filename) {
  const absolute = path.resolve(workspace, filename);
  const relative = path.relative(workspace, absolute);
  assert.ok(!relative.startsWith('..') && !path.isAbsolute(relative) && relative.split(path.sep)[0] === 'src', `Provenance must refer to authoring source: ${filename}`);
  if (!sourceCache.has(absolute)) sourceCache.set(absolute, (async () => {
    const text = await readFile(absolute, 'utf8');
    const css = filename.endsWith('.css') ? postcss.parse(text, { from: absolute }) : undefined;
    const ast = css ? undefined : ts.createSourceFile(absolute, text, ts.ScriptTarget.ES2022, true, filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    return { text, css, ast, filename: relative, absolute };
  })());
  return sourceCache.get(absolute);
}

function selectorRules(css, selector) {
  const requested = postcss.list.comma(selector).map(normalizeSelector);
  const matches = [];
  const found = new Set();
  css.walkRules(rule => {
    const actual = postcss.list.comma(rule.selector).map(normalizeSelector);
    for (const part of requested) if (actual.includes(part)) { found.add(part); matches.push(rule); }
  });
  assert.deepEqual([...found].sort(), [...new Set(requested)].sort(), `Every provenance selector must exist: ${selector}`);
  return [...new Set(matches)];
}

async function provenance(source) {
  assert.ok(source?.file?.trim(), 'A token source path is required');
  const file = await sourceFile(source.file);
  if (source.selector) {
    assert.ok(file.css, `Selector provenance requires a CSS source: ${source.file}`);
    return { file, rules: selectorRules(file.css, source.selector) };
  }
  return { file, rules: file.css ? [file.css] : [] };
}

function cssCustomNames(container) {
  const names = new Set();
  container.walkDecls(declaration => {
    if (declaration.prop.startsWith('--')) names.add(declaration.prop);
    for (const reference of variableReferences(declaration.value)) names.add(reference);
  });
  return names;
}

/** Include imported component CSS for generated names such as Grid's tiers. */
async function sourceCustomNames(file) {
  if (file.css) return cssCustomNames(file.css);
  const names = new Set();
  const imports = [];
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (/^--[\w-]+$/.test(node.text)) names.add(node.text);
    }
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.endsWith('.css')) imports.push(node.moduleSpecifier.text);
    ts.forEachChild(node, visit);
  }
  visit(file.ast);
  for (const imported of imports) {
    const importedPath = path.relative(workspace, path.resolve(path.dirname(file.absolute), imported));
    const importedCSS = await sourceFile(importedPath);
    for (const name of cssCustomNames(importedCSS.css)) names.add(name);
  }
  return names;
}

function ownDeclarations(rules, tokenName) {
  const assigned = [];
  const consumed = [];
  for (const rule of rules) rule.walkDecls(declaration => {
    if (declaration.prop === tokenName) assigned.push(declaration);
    if (variableReferences(declaration.value).includes(tokenName)) consumed.push(declaration);
  });
  return { assigned, consumed };
}

test('token documentation covers each built public component exactly once', () => {
  const documented = componentTokenDocs.map(documentation => documentation.component);
  assert.equal(new Set(documented).size, documented.length);
  assert.deepEqual([...documented].sort(), publicComponents);
  const globals = new Set(globalTokens.map(token => token.name));
  const known = new Set([...globals, ...componentTokenDocs.flatMap(documentation => [
    ...documentation.componentTokens.map(token => token.name),
    ...(documentation.runtimeVariables || []).map(variable => variable.name),
  ])]);
  for (const documentation of componentTokenDocs) {
    const names = [...documentation.componentTokens.map(token => token.name), ...(documentation.runtimeVariables || []).map(variable => variable.name)];
    assert.equal(new Set(names).size, names.length, `${documentation.component}: styling hooks and internals stay unique and separate`);
    assert.equal(new Set(documentation.globalTokens).size, documentation.globalTokens.length, `${documentation.component}: unique global references`);
    for (const name of documentation.globalTokens) assert.ok(globals.has(name), `${documentation.component}: global ${name} resolves`);
    assert.deepEqual(catalog.relevantGlobalTokens(documentation).unresolved, [], `${documentation.component}: rendered global lookup resolves`);
    for (const token of documentation.componentTokens) {
      for (const reference of token.references || []) assert.ok(known.has(reference), `${documentation.component}.${token.name}: dependency ${reference} resolves`);
    }
  }
});

test('the shared token catalog matches actual unconditional :root CSS defaults', async () => {
  const { css } = await sourceFile('src/system/styles.css');
  const defaults = new Map();
  css.walkRules(rule => {
    if (rule.selector.trim() !== ':root') return;
    let ancestor = rule.parent;
    while (ancestor) {
      if (ancestor.type === 'atrule' && ['media', 'supports', 'container', 'starting-style'].includes(ancestor.name)) return;
      ancestor = ancestor.parent;
    }
    for (const declaration of rule.nodes || []) {
      if (declaration.type !== 'decl' || !declaration.prop.startsWith('--')) continue;
      assert.ok(!defaults.has(declaration.prop), `${declaration.prop}: document one unambiguous root default`);
      defaults.set(declaration.prop, declaration.value);
    }
  });
  assert.ok(defaults.size > 0);
  assert.equal(new Set(globalTokens.map(token => token.name)).size, globalTokens.length);
  assert.deepEqual(globalTokens.map(token => token.name).sort(), [...defaults.keys()].sort());
  for (const token of globalTokens) {
    assert.deepEqual(valueTokens(token.defaultValue), valueTokens(defaults.get(token.name)), `${token.name}: documented default matches authoring CSS`);
    assert.ok(token.description?.trim() && token.type?.trim());
    if (token.themes) {
      assert.deepEqual(valueTokens(token.defaultValue), valueTokens(`light-dark(${token.themes.light}, ${token.themes.dark})`), `${token.name}: swatch themes match the declared light-dark branches`);
    }
    await provenance(token.source);
    for (const source of token.sources || []) await provenance(source);
    const actualReferences = new Set(variableReferences(defaults.get(token.name)));
    for (const reference of token.references || []) {
      assert.ok(defaults.has(reference), `${token.name}: global dependency ${reference} resolves`);
      assert.ok(actualReferences.has(reference), `${token.name}: dependency is a real var(), not a same-value literal`);
    }
  }
});

test('component hooks and implementation variables have real source provenance', async () => {
  for (const documentation of componentTokenDocs) {
    for (const token of documentation.componentTokens) {
      assert.match(token.name, /^--[\w-]+$/);
      assert.ok(token.description?.trim() && token.type?.trim() && token.defaultValue?.trim(), `${documentation.component}.${token.name}: complete styling contract`);
      const sources = await Promise.all([token.source, ...(token.sources || [])].map(provenance));
      const assigned = [], consumed = [];
      for (const source of sources) {
        const declarations = ownDeclarations(source.rules, token.name);
        assigned.push(...declarations.assigned); consumed.push(...declarations.consumed);
      }
      assert.ok(assigned.length || consumed.length, `${documentation.component}.${token.name}: declared or consumed in the documented CSS scope`);
      // When a hook is not assigned locally (Stat), its explicit consumption
      // fallback is the contract. Otherwise dependencies come from assignments.
      const values = (assigned.length ? assigned : consumed).map(declaration => declaration.value);
      const dependencies = new Set(values.flatMap(variableReferences).filter(name => name !== token.name));
      for (const reference of token.references || []) assert.ok(dependencies.has(reference), `${documentation.component}.${token.name}: ${reference} is an actual declaration/fallback dependency`);
    }
    for (const variable of documentation.runtimeVariables || []) {
      assert.match(variable.name, /^--[\w-]+$/);
      assert.ok(variable.description?.trim(), `${documentation.component}.${variable.name}: internal ownership is explained`);
      const source = await provenance(variable.source);
      const names = source.rules.length ? new Set(source.rules.flatMap(rule => [...cssCustomNames(rule)])) : await sourceCustomNames(source.file);
      assert.ok(names.has(variable.name), `${documentation.component}.${variable.name}: source code or imported CSS actually declares/consumes this name`);
    }
  }
});
