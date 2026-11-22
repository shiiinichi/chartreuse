import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Every component reference ships `importCode + usageCode`, and the CLI `demo` command prints
// exactly that for agents to paste. Each example must therefore type-check as a standalone
// module against the source library: no undeclared identifiers, missing imports, or wrong props.
//
// Snippet shapes (the normalization rule):
// - Module code: declarations only, including exported function components. Checked as written.
// - JSX: the snippet ends with JSX starting at column 0, optionally preceded by statements such
//   as `const [value, setValue] = useState('')` or small handlers and data. The test wraps the
//   whole snippet in a component body (`export function UsageExample() { …; return <>…</>; }`),
//   so sibling elements are allowed and `//` lines at column 0 between them are comments.
//
// Beyond type errors, an identifier that only resolves because tsconfig includes the DOM lib
// (`status`, `close`, `name`, `event`…) fails unless it is a deliberate browser API on the allowlist.

const root = fileURLToPath(new URL('..', import.meta.url));
const referenceDirectory = path.join(root, 'src/docs/reference');
const virtualDirectory = path.join(root, '__usage_examples__');

async function readReferenceModule(filename) {
  const source = await readFile(path.join(referenceDirectory, filename), 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputText).toString('base64')}`);
}

const isExample = entry => entry && typeof entry.importCode === 'string' && typeof entry.usageCode === 'string';
const exampleKey = entry => `${entry.importCode}\n${entry.usageCode}`;

// Component references are the exported arrays; standalone exported examples (such as the
// navbar showcase snippets) are rendered by the docs too, so they are checked as well.
async function loadExamples() {
  const examples = new Map();
  const references = [];
  const standalone = [];
  const filenames = (await readdir(referenceDirectory)).filter(name => name.endsWith('.ts') && !['index.ts', 'types.ts', 'navigation.ts'].includes(name)).sort();
  for (const filename of filenames) {
    for (const [exportName, value] of Object.entries(await readReferenceModule(filename))) {
      if (Array.isArray(value)) references.push(...value.filter(isExample).map(entry => ({ entry, label: entry.name, file: filename })));
      else if (isExample(value)) standalone.push({ entry: value, label: `${value.name ?? exportName} (${exportName})`, file: filename });
    }
  }
  for (const { entry, label, file } of [...references, ...standalone]) {
    const key = exampleKey(entry);
    if (!examples.has(key)) examples.set(key, { key, label, file, importCode: entry.importCode, usageCode: entry.usageCode });
  }
  return { examples: [...examples.values()], references: references.map(({ entry }) => entry) };
}

function normalizeSnippet(importCode, usageCode) {
  const lines = usageCode.replace(/\s+$/, '').split('\n');
  const jsxStart = lines.findIndex(line => /^<[A-Za-z>]/.test(line));
  if (jsxStart === -1) return { shape: 'module', source: `${importCode}\n\n${usageCode}\n` };
  const prelude = lines.slice(0, jsxStart);
  // Only column-0 `//` lines sit between top-level sibling elements; indented ones may be JSX text.
  const markup = lines.slice(jsxStart).map(line => line.replace(/^\/\/\s?(.*)$/, '{/* $1 */}'));
  const source = [importCode, '', 'export function UsageExample() {', ...prelude, 'return (<>', ...markup, '</>);', '}', ''].join('\n');
  // Map generated lines back to snippet lines: prelude starts after the wrapper's opening line,
  // markup after the extra `return (<>` line.
  const head = importCode.split('\n').length + 2;
  return { shape: 'jsx', source, lineOf: generated => (generated < head + prelude.length ? generated - head : generated - head - 1) };
}

function compilerOptions() {
  const configFile = path.join(root, 'tsconfig.json');
  const { config, error } = ts.readConfigFile(configFile, ts.sys.readFile);
  assert.ok(!error, error && ts.flattenDiagnosticMessageText(error.messageText, '\n'));
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root);
  return { ...parsed.options, noEmit: true, noUncheckedSideEffectImports: true, paths: { '@chartreuse/ui': [path.join(root, 'src/system/index.ts')] } };
}

const { examples, references } = await loadExamples();
const virtualFile = (example, index) => [
  path.join(virtualDirectory, `${String(index).padStart(2, '0')}-${example.label.replace(/[^A-Za-z0-9]+/g, '-')}.tsx`),
  { example, ...normalizeSnippet(example.importCode, example.usageCode) },
];
const files = new Map(examples.map(virtualFile));
// A deliberately broken probe proves that DOM globals are not mistaken for declarations.
const probe = virtualFile({ label: 'dom-global-probe', file: '(self-test)', importCode: "import { Button } from '@chartreuse/ui';", usageCode: '<Button onClick={close}>{status}</Button>' }, 99);
// The published stylesheet export has no types; declare exactly that specifier so a mistyped
// side-effect import still fails under noUncheckedSideEffectImports.
const ambient = [path.join(virtualDirectory, 'ambient.d.ts'), { source: "declare module '@chartreuse/ui/styles.css';\n" }];
const virtualFiles = new Map([...files, probe, ambient]);

// Type-check every snippet in one in-memory program; nothing is written to disk.
const options = compilerOptions();
const host = ts.createCompilerHost(options);
const { fileExists, readFile: hostReadFile, getSourceFile } = host;
host.fileExists = fileName => virtualFiles.has(path.resolve(fileName)) || fileExists.call(host, fileName);
host.readFile = fileName => virtualFiles.get(path.resolve(fileName))?.source ?? hostReadFile.call(host, fileName);
host.getSourceFile = (fileName, languageVersion, ...rest) => {
  const virtual = virtualFiles.get(path.resolve(fileName));
  return virtual ? ts.createSourceFile(fileName, virtual.source, languageVersion, true, ts.ScriptKind.TSX) : getSourceFile.call(host, fileName, languageVersion, ...rest);
};
const program = ts.createProgram({ rootNames: [...virtualFiles.keys()], options, host });

const checker = program.getTypeChecker();

function locate(entry, sourceFile, position) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(position);
  const text = sourceFile.text.split('\n')[line].trim();
  const importLines = entry.example.importCode.split('\n').length;
  const usageLine = entry.shape === 'jsx' ? entry.lineOf(line) : line - importLines - 1;
  const usageLines = entry.example.usageCode.replace(/\s+$/, '').split('\n').length;
  const where = line < importLines ? `importCode line ${line + 1}` : usageLine >= 0 && usageLine < usageLines ? `usageCode line ${usageLine + 1}` : 'test wrapper (around the JSX)';
  return { where, text };
}

function describe(diagnostic, entry) {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n  ');
  if (!diagnostic.file || diagnostic.start === undefined) return message;
  const { where, text } = locate(entry, diagnostic.file, diagnostic.start);
  return `${where}: ${message}\n    > ${text}`;
}

const allowedGlobals = new Set(['window', 'fetch', 'crypto', 'File', 'FormData', 'console', 'Error', 'setTimeout', 'clearTimeout', 'Promise', 'Date', 'Math', 'JSON', 'Intl', 'URL', 'Array', 'Object', 'Number', 'String']);
const isLibFile = fileName => /(^|[\\/])lib\.[^\\/]*\.d\.ts$/.test(fileName);

function domGlobalProblems(entry, sourceFile) {
  const problems = [];
  const visit = node => {
    if (ts.isIdentifier(node)) {
      const { parent } = node;
      const skip = (ts.isPropertyAccessExpression(parent) && parent.name === node)
        || (ts.isQualifiedName(parent) && parent.right === node)
        || (ts.isJsxAttribute(parent) && parent.name === node)
        || ((ts.isPropertyAssignment(parent) || ts.isMethodDeclaration(parent) || ts.isPropertySignature(parent)) && parent.name === node)
        || ts.isTypeReferenceNode(parent) || ts.isExpressionWithTypeArguments(parent);
      if (!skip && !allowedGlobals.has(node.text)) {
        const symbol = ts.isShorthandPropertyAssignment(parent) ? checker.getShorthandAssignmentValueSymbol(parent) : checker.getSymbolAtLocation(node);
        const declaration = symbol?.declarations?.[0];
        if (declaration && isLibFile(declaration.getSourceFile().fileName)) {
          const { where, text } = locate(entry, sourceFile, node.getStart(sourceFile));
          problems.push(`${where}: \`${node.text}\` resolves to a DOM global; declare it\n    > ${text}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return problems;
}

function check(fileName, entry) {
  const sourceFile = program.getSourceFile(fileName);
  assert.ok(sourceFile, `${fileName} is part of the program`);
  const diagnostics = [...program.getSyntacticDiagnostics(sourceFile), ...program.getSemanticDiagnostics(sourceFile)];
  return [...diagnostics.map(diagnostic => describe(diagnostic, entry)), ...domGlobalProblems(entry, sourceFile)];
}

test('every component reference has a usage example to check', () => {
  assert.ok(references.length > 0);
  const checked = new Set(examples.map(example => example.key));
  for (const reference of references) assert.ok(checked.has(exampleKey(reference)), `${reference.name} example is checked`);
  assert.equal(new Set(references.map(reference => reference.name)).size, references.length, 'one example per component reference');
});

test('undeclared names that happen to be DOM globals are reported', () => {
  const problems = check(...probe);
  for (const name of ['close', 'status']) assert.ok(problems.some(problem => problem.includes(`\`${name}\` resolves to a DOM global`) && problem.startsWith('usageCode line 1')), `${name} is reported:\n${problems.join('\n')}`);
});

for (const [fileName, entry] of files) {
  test(`${entry.example.label} usage example type-checks as pasted (${entry.example.file})`, () => {
    const problems = check(fileName, entry);
    assert.equal(problems.length, 0, `${entry.example.label} (${entry.shape} snippet in src/docs/reference/${entry.example.file}):\n  ${problems.join('\n  ')}`);
  });
}
