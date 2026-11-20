#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { version as chartreuseVersion } from '../../package.json';
import { samplePatternDefinitions } from '../docs/pattern-definitions';
import { componentReferences } from '../docs/reference';
import { getComponentTokenDoc, globalTokenNotes, globalTokens, relevantGlobalTokens } from '../docs/tokens';

const metadata = { schemaVersion: 1, chartreuseVersion };
const guides = [
  {
    id: 'layout',
    label: 'Layout',
    description: 'Choose layout components based on the content you are arranging.',
    notes: [
      'Use Grid for grouped inputs. Keep each complete labeled field in one GridItem and use the Grid gap for consistent spacing.',
      'Use Flex for rows, stacks, and action groups that align along one axis.',
      'Use Masonry for cards or other content with uneven heights. Keep the items in logical reading order.',
      'Use WorkspaceLayout beneath Navbar to arrange Sidebar and WorkspaceContent. Choose Comfortable or Full on WorkspaceContent.',
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    description: 'Use Text for the shared type scale, semantic headings, and inline formatting.',
    notes: [
      'Use Text with size="display" or size="heading-1" through size="heading-3" for headings, and size="body" for paragraphs.',
      'The Typography foundation lists all seven presets, including size="small" and size="label".',
      'An explicit size overrides inherited typography and applies to its children. Nested Text can set another size.',
      'Use bold, italic, and strikethrough for emphasis. Omit size for inline formatting that follows the surrounding text.',
      'Use display="block" for a standalone text block and display="inline" within running text. Use GridItem or MasonryItem when the text needs to span columns.',
    ],
  },
  ...samplePatternDefinitions,
];

class QueryError extends Error {
  constructor(code, message, hint, exitCode = 2) {
    super(message);
    this.code = code;
    this.hint = hint;
    this.exitCode = exitCode;
  }
}

function componentResult({ name, slug, summary }) {
  return { kind: 'component', id: slug, name, summary, docsPath: `#components/${slug}` };
}

function guideResult({ id, label, description }) {
  return { kind: 'guide', id, name: label, summary: description, docsPath: `#${id}` };
}

function findComponent(name) {
  const key = name.toLowerCase();
  const reference = componentReferences.find(item => item.name.toLowerCase() === key || item.slug === key);
  if (!reference) {
    throw new QueryError('COMPONENT_NOT_FOUND', `Unknown component ${JSON.stringify(name)}.`, 'Run chartreuse list or chartreuse search <query>.', 1);
  }
  return reference;
}

function listComponents() {
  const components = componentReferences.map(componentResult);
  return { data: { components }, lines: components.map(entry => `${entry.name} — ${entry.summary}`) };
}

function search(query) {
  const normalizedQuery = query.toLowerCase();
  const terms = [...new Set(normalizedQuery.match(/[a-z0-9]+/g) ?? [])].filter(term => term.length > 1);
  const entries = [
    ...componentReferences.map(component => ({ result: componentResult(component), notes: component.notes ?? [] })),
    ...guides.map(guide => ({ result: guideResult(guide), notes: guide.notes })),
  ];
  const results = entries.map(({ result, notes }) => {
    const name = result.name.toLowerCase();
    const title = `${name} ${result.id}`;
    const summary = result.summary.toLowerCase();
    const guidance = notes.join(' ').toLowerCase();
    let score = name === normalizedQuery || result.id === normalizedQuery ? 100 : 0;
    for (const term of terms) {
      if (title.includes(term)) score += 5;
      else if (summary.includes(term)) score += 3;
      else if (guidance.includes(term)) score += 1;
    }
    return { result, score };
  }).filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.result.id.localeCompare(b.result.id, 'en'))
    .slice(0, 10)
    .map(entry => entry.result);
  return {
    data: { query, results },
    lines: results.length ? results.map(entry => `${entry.name} (${entry.kind}) — ${entry.summary}`) : ['No matches.'],
  };
}

function info(name) {
  const reference = findComponent(name);
  const { importCode, props, nativeElement, nativeProps, notes = [] } = reference;
  const component = { ...componentResult(reference), importCode, props, nativeElement, nativeProps, notes };
  const lines = [component.name, component.summary, '', importCode, '', 'Props'];
  for (const prop of props) {
    const qualifiers = [];
    if (prop.required) qualifiers.push('required');
    if (prop.defaultValue !== undefined) qualifiers.push(`default ${prop.defaultValue || '""'}`);
    const detail = qualifiers.length ? ` (${qualifiers.join(', ')})` : '';
    lines.push(`- ${prop.name}${detail} — ${prop.type}. ${prop.description}`);
  }
  if (nativeElement) lines.push('', `Native element <${nativeElement}>`);
  if (nativeProps) lines.push(nativeProps);
  if (notes.length) lines.push('', 'Implementation notes', ...notes.map(note => `- ${note}`));
  return { data: { component }, lines };
}

function demo(name) {
  const reference = findComponent(name);
  const code = `${reference.importCode}\n\n${reference.usageCode}`;
  return { data: { component: componentResult(reference), language: 'tsx', code }, lines: [code] };
}

function token(name) {
  const describe = tokens => tokens.map(entry => `- ${entry.name} = ${entry.defaultValue} — ${entry.description}`);
  if (!name) {
    return { data: { globalTokens, notes: globalTokenNotes }, lines: ['Global CSS tokens', ...describe(globalTokens), '', ...globalTokenNotes] };
  }
  const component = componentResult(findComponent(name));
  const documentation = getComponentTokenDoc(component.name);
  if (!documentation) {
    throw new QueryError('TOKEN_DOCS_NOT_FOUND', `No token reference for ${component.name}.`, 'Run chartreuse token for shared tokens.', 1);
  }
  const { tokens } = relevantGlobalTokens(documentation);
  const { componentTokens, runtimeVariables = [], notes = [] } = documentation;
  const lines = [component.name, '', 'Component tokens', ...describe(componentTokens), '', 'Shared tokens', ...describe(tokens)];
  if (runtimeVariables.length) lines.push('', 'Runtime variables', ...runtimeVariables.map(entry => `- ${entry.name} — ${entry.description}`));
  if (notes.length) lines.push('', ...notes);
  return { data: { component, componentTokens, globalTokens: tokens, runtimeVariables, notes }, lines };
}

function guide(topic) {
  if (!topic) {
    const entries = guides.map(guideResult);
    return { data: { guides: entries }, lines: entries.map(entry => `${entry.id} — ${entry.summary}`) };
  }
  const key = topic.toLowerCase();
  const entry = guides.find(item => item.id === key || item.label.toLowerCase() === key);
  if (!entry) {
    throw new QueryError('GUIDE_NOT_FOUND', `Unknown guide ${JSON.stringify(topic)}.`, 'Run chartreuse guide to list topics.', 1);
  }
  const result = { ...guideResult(entry), notes: entry.notes };
  return { data: { guide: result }, lines: [result.name, result.summary, '', ...result.notes.map(note => `- ${note}`)] };
}

const commands = {
  list: { description: 'List the public components.', run: listComponents },
  search: { argument: 'query', description: 'Find components and guides by keyword.', run: search },
  info: { argument: 'component', description: 'Show props, defaults, native attributes, and implementation notes.', run: info },
  demo: { argument: 'component', description: 'Print the documented TSX example.', run: demo },
  token: { argument: 'component', optional: true, description: 'Show global or component CSS tokens.', run: token },
  guide: { argument: 'topic', optional: true, description: 'List guidance topics or read a specific guide.', run: guide },
};

function usage(name, { argument, optional }) {
  if (!argument) return name;
  return optional ? `${name} [${argument}]` : `${name} <${argument}>`;
}

function help() {
  const entries = Object.entries(commands).map(([name, command]) => ({
    name, usage: usage(name, command), description: command.description,
  }));
  return {
    data: { commands: entries, formats: ['text', 'json'] },
    lines: [
      'Usage: chartreuse <command> [argument] [--format text|json]', '',
      ...entries.map(entry => `  ${entry.usage.padEnd(20)} ${entry.description}`), '',
      '  -h, --help          Show help.',
      '  -V, --version       Show the Chartreuse package version.',
    ],
  };
}

const args = process.argv.slice(2);
const terminator = args.indexOf('--');
const optionArgs = terminator < 0 ? args : args.slice(0, terminator);
let json = optionArgs.some((arg, index) => arg === '--format=json' || (arg === '--format' && optionArgs[index + 1] === 'json'));

try {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      format: { type: 'string', default: 'text' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'V' },
    },
  });
  if (values.format !== 'text' && values.format !== 'json') {
    throw new QueryError('INVALID_FORMAT', `Unknown format ${JSON.stringify(values.format)}.`, 'Use --format text or --format json.');
  }
  json = values.format === 'json';
  const [name, ...operands] = positionals;
  let result;
  let command;
  if (values.version) {
    command = 'version';
    result = { data: {}, lines: [chartreuseVersion] };
  } else if (values.help || name === undefined) {
    command = 'help';
    result = help();
  } else {
    if (!Object.hasOwn(commands, name)) {
      throw new QueryError('UNKNOWN_COMMAND', `Unknown command ${JSON.stringify(name)}.`, 'Run chartreuse --help.');
    }
    const spec = commands[name];
    const [argument] = operands.map(operand => operand.trim());
    const minOperands = spec.argument && !spec.optional ? 1 : 0;
    const maxOperands = spec.argument ? 1 : 0;
    if (operands.length < minOperands || operands.length > maxOperands || argument === '') {
      throw new QueryError('INVALID_ARGUMENTS', `Invalid arguments for ${name}.`, `Usage: chartreuse ${usage(name, spec)}.`);
    }
    command = name;
    result = spec.run(argument);
  }
  console.log(json ? JSON.stringify({ ...metadata, command, data: result.data }) : result.lines.join('\n'));
} catch (error) {
  const problem = error instanceof QueryError ? error
    : error?.code?.startsWith('ERR_PARSE_ARGS_') ? new QueryError('INVALID_ARGUMENTS', error.message, 'Run chartreuse --help.')
      : new QueryError('INTERNAL_ERROR', 'Could not read the packaged Chartreuse reference.', undefined, 1);
  const { code, message, hint, exitCode } = problem;
  process.exitCode = exitCode;
  console.error(json ? JSON.stringify({ ...metadata, error: { code, message, hint } }) : [message, hint].filter(Boolean).join('\n'));
}
