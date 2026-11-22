#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { version as chartreuseVersion } from '../../package.json';
import { componentPageAliases, componentSynonyms, searchSynonyms } from '../docs/component-aliases';
import { componentChoices } from '../docs/component-choices';
import { componentGroups } from '../docs/component-groups';
import { foundationGuides } from '../docs/foundation-guides';
import { samplePatternDefinitions } from '../docs/pattern-definitions';
import { componentReferences } from '../docs/reference';
import { samplePatternModuleCode } from '../docs/sample-pattern-sources';
import { setupGuide } from '../docs/setup-guide';
import { appearanceProps, customizationNotes, getComponentTokenDoc, globalTokenNotes, globalTokens, relevantGlobalTokens } from '../docs/tokens';

const metadata = { schemaVersion: 1, chartreuseVersion };
const guides = [
  setupGuide,
  {
    id: 'layout',
    label: 'Layout',
    description: 'Choose layout components based on the content you are arranging.',
    keywords: 'spacing gap column row stack alignment grid flex masonry workspace',
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
    keywords: 'font size weight line height text heading',
    notes: [
      'Use Text with size="display" or size="heading-1" through size="heading-3" for headings, and size="body" for paragraphs.',
      'The Typography foundation lists all seven presets, including size="small" and size="label".',
      'An explicit size overrides inherited typography and applies to its children. Nested Text can set another size.',
      'Use bold, italic, and strikethrough for emphasis. Omit size for inline formatting that follows the surrounding text.',
      'Use display="block" for a standalone text block and display="inline" within running text. Use GridItem or MasonryItem when the text needs to span columns.',
    ],
  },
  {
    id: 'choosing',
    label: 'Choosing a component',
    docsPath: null,
    description: 'Decide between similar components, such as Dialog, Drawer, and Sidebar or Select, Autocomplete, and ButtonSelect.',
    topics: 'choose choice which vs versus difference compare comparison alternative',
    notes: componentChoices.map(({ label, options }) => `${label}: ${options.map(option => option.reason).join(' ')}`),
    choices: componentChoices,
  },
  ...foundationGuides,
  ...samplePatternDefinitions.map(pattern => ({ ...pattern, patternCode: true })),
];

class QueryError extends Error {
  constructor(code, message, hint, exitCode = 2, suggestions) {
    super(message);
    this.code = code;
    this.hint = hint;
    this.exitCode = exitCode;
    this.suggestions = suggestions;
  }
}

const groupByComponent = new Map(componentGroups.flatMap(({ name, components }) => components.map(component => [component, name])));

function componentResult({ name, slug, summary }) {
  return { kind: 'component', id: slug, name, summary, group: groupByComponent.get(name) ?? null, docsPath: `#components/${slug}` };
}

/** Alternatives from the choosing guide: every other member of each confusable set, first reason wins. */
function seeAlso(name) {
  const entries = new Map();
  for (const { options } of componentChoices) {
    if (!options.some(option => option.name === name)) continue;
    for (const option of options) if (option.name !== name && !entries.has(option.name)) entries.set(option.name, option.reason);
  }
  return [...entries].map(([other, reason]) => ({ name: other, reason }));
}

/** docsPath is null for a guide without a documentation page. */
function guideResult({ id, label, description, docsPath = `#${id}` }) {
  return { kind: 'guide', id, name: label, summary: description, docsPath };
}

function tokenResult({ name, description, defaultValue }) {
  return { kind: 'token', id: name, name, summary: description, value: defaultValue, docsPath: '#tokens' };
}

const stopWords = new Set(['a', 'an', 'and', 'are', 'be', 'can', 'do', 'for', 'how', 'i', 'in', 'is', 'it', 'my', 'of', 'on', 'or', 'should', 'that', 'the', 'this', 'to', 'use', 'using', 'what', 'when', 'with']);
// Words too general to identify a result on their own; they score at most like a notes hit.
const genericWords = new Set(['app', 'component', 'page', 'screen', 'show', 'ui', 'view', 'which']);
// Alternate words for one query word. Alternates score one tier below the literal word and never prefix-match.
const termSynonyms = new Map(Object.entries({
  colour: ['color'], spacing: ['space'], gap: ['spacing', 'space'], padding: ['spacing', 'space'], margin: ['spacing', 'space'],
  corner: ['radius'], rounded: ['radius'], elevation: ['shadow'], scheme: ['theme'], font: ['typography'], style: ['stylesheet'],
}));
// Two-word phrases searched as one literal word.
const phraseTerms = new Map(Object.entries({
  'which component': 'choose', 'border radius': 'radius', 'font family': 'font', 'dark mode': 'theme', 'light mode': 'theme', 'font size': 'typography', 'line height': 'typography',
}));
const maxResults = 10;
const maxTokensBesideOthers = 5;

/** Deterministic light stemming of plurals (-s, -es, -ies). Applied to both index and query words. */
function stem(word) {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && /(?:ss|sh|ch|x|z)es$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !/(?:ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

const wordPattern = /[\p{L}\p{N}]+/gu;
const normalize = value => value.toLowerCase().match(wordPattern)?.join(' ') ?? '';
const stemPhrase = value => normalize(value).split(' ').filter(Boolean).map(stem).join(' ');
/** Key for name lookups: words normalized, stemmed, and joined, so "Page panels" and "PagePanel" agree. */
const lookupKey = value => stemPhrase(value).replace(/ /g, '');

/** Whole words, lowercased and stemmed; camelCase identifiers also yield their parts. */
function words(text) {
  const result = new Set();
  for (const raw of text.match(wordPattern) ?? []) {
    result.add(stem(raw.toLowerCase()));
    const parts = raw.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2').toLowerCase().split(' ');
    if (parts.length > 1) for (const part of parts) result.add(stem(part));
  }
  return result;
}

const findReference = target => componentReferences.find(item => item.name === target || item.slug === target);
/** Stemmed alias phrase → its targets. `resolves` marks aliases that name lookups may follow. */
const aliasIndex = new Map();
function addAliases(entries, resolves) {
  for (const [alias, names] of entries) {
    const key = stemPhrase(alias);
    if (aliasIndex.has(key)) continue;
    const targets = names.flatMap(target => findReference(target)?.name ?? []);
    if (targets.length) aliasIndex.set(key, { key, words: key.split(' '), targets, resolves });
  }
}
addAliases(Object.entries(componentSynonyms), true);
// Docs redirects such as navigation → Tabs are page routes, not synonyms; only plural forms of the target carry over.
addAliases(Object.entries(componentPageAliases).flatMap(([alias, page]) => {
  const slug = page.slice('components/'.length);
  return stemPhrase(alias) === stemPhrase(slug) ? [[alias, [slug]]] : [];
}), true);
addAliases(Object.entries(searchSynonyms), false);
const aliasesByLength = [...aliasIndex.values()].sort((a, b) => b.words.length - a.words.length || a.key.localeCompare(b.key, 'en'));

function levenshtein(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
}

const isSubsequence = (needle, haystack) => {
  let index = 0;
  for (const character of haystack) if (character === needle[index]) index += 1;
  return index === needle.length;
};

/**
 * Close candidate names, in order: alias targets, names within a small edit distance, then
 * names containing the query's words (or abbreviating to it), then the best search results.
 */
function suggest(value, candidates, { aliases = [], searchKind }) {
  const key = lookupKey(value);
  const valueWords = stemPhrase(value).split(' ').filter(word => word.length >= 3);
  const limit = key.length <= 4 ? 1 : 2;
  let close = candidates.flatMap(({ label, keys }) => {
    const distance = Math.min(...keys.map(candidate => levenshtein(key, lookupKey(candidate))));
    return distance <= limit ? [{ label, distance }] : [];
  }).sort((a, b) => a.distance - b.distance || a.label.localeCompare(b.label, 'en')).map(entry => entry.label);
  if (!close.length && key) {
    close = candidates.filter(({ keys }) => keys.some(candidate => {
      const candidateWords = [...words(candidate)];
      const compact = lookupKey(candidate);
      return valueWords.some(word => candidateWords.some(part => part.startsWith(word)))
        || candidateWords.some(part => part.length >= 4 && key.includes(part))
        || (key.length <= 4 && compact[0] === key[0] && isSubsequence(key, compact));
    })).map(({ label }) => label).sort((a, b) => a.localeCompare(b, 'en'));
  }
  if (!close.length && !aliases.length) {
    close = rank(value).filter(({ entry }) => entry.result.kind === searchKind).map(({ entry }) => (searchKind === 'guide' ? entry.result.id : entry.result.name));
  }
  return [...new Set([...aliases, ...close])].slice(0, 5);
}

function notFound(code, message, suggestions, listHint) {
  const hint = suggestions.length ? `Did you mean ${suggestions.join(', ')}? ${listHint}` : listHint;
  return new QueryError(code, message, hint, 1, suggestions);
}

/** Resolves a component by name, slug, plural form, or a single-target alias. */
function findComponent(name) {
  const lower = name.toLowerCase();
  const key = lookupKey(name);
  const reference = componentReferences.find(item => item.name.toLowerCase() === lower || item.slug === lower)
    ?? componentReferences.find(item => lookupKey(item.name) === key);
  if (reference) return { reference };
  const alias = aliasIndex.get(stemPhrase(name)) ?? aliasesByLength.find(entry => entry.key.replace(/ /g, '') === key);
  if (alias?.resolves && alias.targets.length === 1) return { reference: findReference(alias.targets[0]), resolvedFrom: name };
  const candidates = componentReferences.map(item => ({ label: item.name, keys: [item.name, item.slug] }));
  const suggestions = suggest(name, candidates, { aliases: alias?.targets, searchKind: 'component' });
  const message = alias?.resolves ? `${JSON.stringify(name)} matches several components.` : `Unknown component ${JSON.stringify(name)}.`;
  throw notFound('COMPONENT_NOT_FOUND', message, suggestions, 'Run chartreuse list or chartreuse search <query>.');
}

function listComponents() {
  const components = componentReferences.map(componentResult);
  const byName = new Map(components.map(entry => [entry.name, entry]));
  const groups = componentGroups.map(({ name, components: members }) => ({ name, components: members.filter(member => byName.has(member)) }));
  const ungrouped = components.filter(entry => entry.group === null).map(entry => entry.name);
  if (ungrouped.length) groups.push({ name: 'Other', components: ungrouped });
  const lines = groups.flatMap(({ name, components: members }, index) => [
    ...(index ? [''] : []), name, ...members.map(member => `  ${member} — ${byName.get(member).summary}`),
  ]);
  return { data: { components, groups }, lines };
}

const splitCamelCase = value => value.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2');

function indexEntry(entry) {
  const titleWords = words(entry.title);
  const summaryWords = words(entry.summary);
  const name = entry.result.kind === 'token' ? entry.title : splitCamelCase(entry.result.name);
  return {
    ...entry, titleWords, titleList: [...titleWords], summaryWords, summaryList: [...summaryWords], noteWords: words(entry.notes),
    nameWords: stemPhrase(name).split(' '),
  };
}

const searchIndex = [
  ...componentReferences.map(component => ({
    result: componentResult(component), title: `${component.name} ${component.slug}`, summary: component.summary, notes: (component.notes ?? []).join(' '),
  })),
  ...guides.map((guide, guideOrder) => ({
    // Topic words rank like the title: the guide answers them before matching tokens.
    result: guideResult(guide), guideOrder, title: `${guide.label} ${guide.id} ${guide.topics ?? ''}`, summary: [guide.description, guide.keywords ?? ''].join(' '), notes: guide.notes.join(' '),
  })),
  ...globalTokens.map((entry, order) => ({
    result: tokenResult(entry), order,
    title: entry.name.replace(/^--cr-/, ''),
    // Index the description before any conversion note ("…; 4px when the root font size is 16px").
    summary: [entry.description.split(';')[0], entry.type, entry.themes ? 'theme light dark' : ''].join(' '),
    notes: (entry.notes ?? []).join(' '),
  })),
].map(indexEntry);

const kindRank = { component: 0, guide: 0, token: 1 };

function parseQuery(query) {
  const sequence = normalize(query).split(' ').filter(word => (word.length > 1 || /^\p{N}+$/u.test(word)) && !stopWords.has(word)).map(stem);
  // Aliases: the longest phrase wins each word; an alias spanning the whole query acts like an exact name.
  const used = new Set();
  const aliases = [];
  for (const alias of aliasesByLength) {
    for (let start = 0; start + alias.words.length <= sequence.length; start += 1) {
      const positions = alias.words.map((_, offset) => start + offset);
      if (positions.some(position => used.has(position)) || alias.words.some((word, offset) => sequence[start + offset] !== word)) continue;
      positions.forEach(position => used.add(position));
      aliases.push({ ...alias, positions, whole: positions.length === sequence.length });
    }
  }
  const terms = [];
  for (let index = 0; index < sequence.length; index += 1) {
    const phrase = phraseTerms.get(`${sequence[index]} ${sequence[index + 1]}`);
    const literal = phrase ?? sequence[index];
    const positions = phrase ? [index, index + 1] : [index];
    if (phrase) index += 1;
    const existing = terms.find(term => term.literal === literal);
    if (existing) existing.positions.push(...positions);
    else terms.push({ literal, positions, generic: genericWords.has(literal), alternates: (termSynonyms.get(literal) ?? []).map(stem).filter(word => word !== literal) });
  }
  return { terms, aliases };
}

function termScore(entry, { literal, alternates, generic }) {
  let weight = 0;
  let strong = false;
  let noteHit = false;
  const hit = (value, isStrong) => { if (value > weight) weight = value; if (isStrong) strong = true; };
  if (entry.titleWords.has(literal)) hit(5, true);
  else if (literal.length >= 5 && entry.titleList.some(word => word.length > literal.length && word.startsWith(literal))) hit(4, false);
  if (entry.summaryWords.has(literal)) hit(3, true);
  else if (literal.length >= 5 && entry.summaryList.some(word => word.length > literal.length && word.startsWith(literal))) hit(2, false);
  if (entry.noteWords.has(literal)) { hit(1, false); noteHit = true; }
  for (const alternate of alternates) {
    // Token names are terse, so a synonym in one ties a literal summary hit and components win the tie.
    if (entry.titleWords.has(alternate)) hit(entry.result.kind === 'token' ? 3 : 4, true);
    else if (entry.summaryWords.has(alternate)) hit(2, true);
    else if (entry.noteWords.has(alternate)) { hit(1, false); noteHit = true; }
  }
  return generic ? { weight: Math.min(weight, 1), strong: false, noteHit: noteHit || weight > 0 } : { weight, strong, noteHit };
}

/** Every result that clears the relevance floor, best first. */
function rank(query) {
  const { terms, aliases } = parseQuery(query);
  const trimmed = query.trim().toLowerCase();
  const normalizedQuery = normalize(query);
  // Singular and plural forms of a whole name count as exact, so "icon" finds the icons guide.
  const queryKey = lookupKey(query);
  const scored = searchIndex.map(entry => {
    const { result } = entry;
    const exact = result.name.toLowerCase() === trimmed || result.id === trimmed || normalize(result.id) === normalizedQuery || normalize(result.name) === normalizedQuery
      || (queryKey !== '' && (lookupKey(result.id) === queryKey || lookupKey(result.name) === queryKey));
    let score = exact ? 100 : 0;
    let strong = exact;
    let noteHit = false;
    const aliasWeights = new Map();
    if (result.kind === 'component') {
      const ownName = entry.nameWords.join(' ');
      for (const alias of aliases) {
        const index = alias.targets.indexOf(result.name);
        if (index < 0 || alias.key === ownName) continue;
        strong = true;
        if (alias.whole) score += 60 - index;
        // An alias inside a longer query counts like a title hit on the words it covers, never more.
        else for (const position of alias.positions) aliasWeights.set(position, Math.max(aliasWeights.get(position) ?? 0, index ? 3 : 4));
      }
    }
    let matched = 0;
    let covered = 0;
    for (const term of terms) {
      const found = termScore(entry, term);
      const aliasWeight = Math.max(0, ...term.positions.map(position => aliasWeights.get(position) ?? 0));
      const weight = Math.max(found.weight, aliasWeight);
      if (weight) matched += 1;
      // A term is covered by a name, summary, or alias hit; generic words only need to match somewhere.
      if (weight && (term.generic || found.strong || aliasWeight)) covered += 1;
      strong ||= found.strong;
      noteHit ||= found.noteHit;
      score += weight;
    }
    if (terms.length > 1 && covered === terms.length) score += 2;
    // A longer query that names the whole title, as "select input" names Select.
    if (terms.length > 1 && entry.nameWords.every(word => terms.some(term => term.literal === word))) score += 2;
    return { entry, score, matched, strong, noteHit };
  }).filter(({ score }) => score > 0);
  // Relevance floor: results need a whole-word name, summary, or alias hit. Notes-only hits are kept
  // only when nothing stronger matched, and in a multi-term query only when they cover two or more terms.
  // Prefix-only hits never qualify on their own.
  const hasStrong = scored.some(({ strong }) => strong);
  const multiTerm = terms.length > 1;
  return scored.filter(({ strong, noteHit, matched }) => strong || (!hasStrong && noteHit && (!multiTerm || matched > 1)))
    .sort((a, b) => b.score - a.score
      || b.matched - a.matched
      || (multiTerm ? Number(b.entry.result.kind === 'guide') - Number(a.entry.result.kind === 'guide') : 0)
      || kindRank[a.entry.result.kind] - kindRank[b.entry.result.kind]
      // Between guides, the listed order wins ties, so Setup leads Color for "theme".
      || (a.entry.result.kind === 'guide' && b.entry.result.kind === 'guide' ? a.entry.guideOrder - b.entry.guideOrder : 0)
      || (a.entry.order ?? 0) - (b.entry.order ?? 0)
      || a.entry.result.id.localeCompare(b.entry.result.id, 'en'));
}

function search(query) {
  const ranked = rank(query);
  // Tokens are numerous and similar, so they leave room for components and guides that also match.
  const others = ranked.some(({ entry }) => entry.result.kind !== 'token');
  let tokens = 0;
  const results = ranked.filter(({ entry }) => entry.result.kind !== 'token' || !others || (tokens += 1) <= maxTokensBesideOthers)
    .slice(0, maxResults)
    .map(({ entry }) => entry.result);
  return {
    data: { query, results },
    lines: results.length ? results.map(entry => (entry.kind === 'token'
      ? `${entry.name} (token) = ${entry.value} — ${entry.summary}`
      : `${entry.name} (${entry.kind}) — ${entry.summary}`)) : ['No matches.'],
  };
}

const withResolution = (data, resolvedFrom) => (resolvedFrom === undefined ? data : { ...data, resolvedFrom });

function info(name) {
  const { reference, resolvedFrom } = findComponent(name);
  const { importCode, props, nativeElement, nativeProps, notes = [] } = reference;
  const alternatives = seeAlso(reference.name);
  const example = { language: 'tsx', code: `${importCode}\n\n${reference.usageCode}` };
  const component = { ...componentResult(reference), importCode, props, nativeElement, nativeProps, notes, seeAlso: alternatives, example };
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
  if (alternatives.length) lines.push('', 'See also', ...alternatives.map(entry => `- ${entry.reason}`));
  lines.push('', `Run chartreuse demo ${component.name} for the example.`);
  return { data: withResolution({ component }, resolvedFrom), lines };
}

function demo(name) {
  const { reference, resolvedFrom } = findComponent(name);
  const code = `${reference.importCode}\n\n${reference.usageCode}`;
  return { data: withResolution({ component: componentResult(reference), language: 'tsx', code }, resolvedFrom), lines: [code] };
}

function token(name) {
  const describe = (tokens, { selectors = false } = {}) => tokens.map(entry => {
    const selector = selectors && entry.source?.selector ? ` Selector: ${entry.source.selector}` : '';
    const fallback = selectors && entry.fallback ? ' (read with a fallback, so a wrapper override also works)' : '';
    return `- ${entry.name} = ${entry.defaultValue} — ${entry.description}${selector}${fallback}`;
  });
  const customizing = customization => ['', 'Customizing', ...customization.map((note, index) => `${index + 1}. ${note}`)];
  if (!name) {
    const customization = customizationNotes();
    return {
      data: { globalTokens, notes: globalTokenNotes, customization },
      lines: ['Global CSS tokens', ...describe(globalTokens), '', ...globalTokenNotes, ...customizing(customization)],
    };
  }
  const { reference, resolvedFrom } = findComponent(name);
  const component = componentResult(reference);
  const documentation = getComponentTokenDoc(component.name);
  if (!documentation) {
    throw new QueryError('TOKEN_DOCS_NOT_FOUND', `No token reference for ${component.name}.`, 'Run chartreuse token for shared tokens.', 1);
  }
  const { tokens } = relevantGlobalTokens(documentation);
  const { componentTokens, runtimeVariables = [], notes = [] } = documentation;
  const propNames = new Set(reference.props.map(prop => prop.name));
  const customization = customizationNotes({
    name: component.name,
    styleProps: appearanceProps.filter(prop => propNames.has(prop)),
    hooks: componentTokens.map(entry => ({ name: entry.name, selector: entry.source?.selector, fallback: entry.fallback === true })),
    redeclaresSemantic: componentTokens.some(entry => entry.name.startsWith('--cr-color-')),
    readsPrimitives: tokens.some(entry => entry.type === 'color' && !entry.name.startsWith('--cr-color-')),
  });
  const lines = [component.name, '', 'Component tokens', ...describe(componentTokens, { selectors: true }), '', 'Shared tokens', ...describe(tokens)];
  if (runtimeVariables.length) lines.push('', 'Runtime variables', ...runtimeVariables.map(entry => `- ${entry.name} — ${entry.description}`));
  if (notes.length) lines.push('', ...notes);
  lines.push(...customizing(customization));
  return { data: withResolution({ component, componentTokens, globalTokens: tokens, runtimeVariables, notes, customization }, resolvedFrom), lines };
}

function guide(topic, { code: withCode = false } = {}) {
  if (!topic) {
    if (withCode) throw new QueryError('INVALID_ARGUMENTS', '--code needs a guide topic.', 'Use chartreuse guide <pattern> --code.');
    const entries = guides.map(guideResult);
    return { data: { guides: entries }, lines: entries.map(entry => `${entry.id} — ${entry.summary}`) };
  }
  const key = topic.toLowerCase();
  const entry = guides.find(item => item.id === key || item.label.toLowerCase() === key)
    ?? guides.find(item => lookupKey(item.id) === lookupKey(topic) || lookupKey(item.label) === lookupKey(topic));
  if (!entry) {
    const candidates = guides.map(item => ({ label: item.id, keys: [item.id, item.label] }));
    throw notFound('GUIDE_NOT_FOUND', `Unknown guide ${JSON.stringify(topic)}.`, suggest(topic, candidates, { searchKind: 'guide' }), 'Run chartreuse guide to list topics.');
  }
  const result = { ...guideResult(entry), notes: entry.notes };
  if (entry.choices) result.choices = entry.choices;
  const lines = [result.name, result.summary, '', ...result.notes.map(note => `- ${note}`)];
  // Short snippets (setup, accessibility) are always included; pattern source is large, so it is opt-in.
  if (withCode && !entry.code && !entry.patternCode) {
    const patterns = guides.filter(item => item.patternCode).map(item => item.id).join(', ');
    throw new QueryError('INVALID_ARGUMENTS', `The ${entry.id} guide has no example source.`, `Use --code with a pattern guide: ${patterns}.`);
  }
  const code = entry.code ?? (withCode ? samplePatternModuleCode(entry.id) : undefined);
  if (code) {
    Object.assign(result, { language: entry.language ?? 'tsx', code });
    lines.push('', code);
  } else if (entry.patternCode) {
    result.hasCode = true;
    lines.push('', 'Add --code for the full source.');
  }
  return { data: { guide: result }, lines };
}

const commands = {
  list: { description: 'List the public components.', run: listComponents },
  search: { argument: 'query', description: 'Find components, guides, and CSS tokens by keyword.', run: search },
  info: { argument: 'component', description: 'Show props, defaults, native attributes, and implementation notes.', run: info },
  demo: { argument: 'component', description: 'Print the documented TSX example.', run: demo },
  token: { argument: 'component', optional: true, description: 'Show global or component CSS tokens.', run: token },
  guide: { argument: 'topic', optional: true, flags: ['code'], description: 'List guidance topics or read a specific guide.', run: guide },
};

function usage(name, { argument, optional, flags = [] }) {
  const operand = !argument ? '' : optional ? ` [${argument}]` : ` <${argument}>`;
  return `${name}${operand}${flags.map(flag => ` [--${flag}]`).join('')}`;
}

function help() {
  const entries = Object.entries(commands).map(([name, command]) => ({
    name, usage: usage(name, command), description: command.description,
  }));
  return {
    data: { commands: entries, formats: ['text', 'json'] },
    lines: [
      'Usage: chartreuse <command> [argument] [--format text|json]', '',
      ...entries.map(entry => `  ${entry.usage.padEnd(24)} ${entry.description}`), '',
      `  ${'--code'.padEnd(24)} With guide <pattern>, also print the component source and CSS.`,
      `  ${'-h, --help'.padEnd(24)} Show help.`,
      `  ${'-V, --version'.padEnd(24)} Show the Chartreuse package version.`,
    ],
  };
}

/**
 * In a source checkout (src/cli and src/docs beside dist/lib), returns true when package.json or any
 * file under src/cli or src/docs (the CLI's bundled inputs) is newer than this built script. Uses
 * directory reads and stat calls only, never throws, and is skipped inside node_modules.
 */
function buildIsStale() {
  try {
    const script = fileURLToPath(import.meta.url);
    if (/[\\/]node_modules[\\/]/.test(script)) return false;
    const root = new URL('../../', import.meta.url);
    const at = path => fileURLToPath(new URL(path, root));
    if (!statSync(at('src/cli')).isDirectory() || !statSync(at('src/docs')).isDirectory()) return false;
    const built = statSync(script).mtimeMs;
    const newer = path => statSync(path).mtimeMs > built;
    const newerIn = directory => readdirSync(directory, { withFileTypes: true }).some(entry => {
      const path = `${directory}/${entry.name}`;
      return entry.isDirectory() ? newerIn(path) : entry.isFile() && newer(path);
    });
    return newer(at('package.json')) || newerIn(at('src/cli')) || newerIn(at('src/docs'));
  } catch {
    return false;
  }
}
const staleWarning = { code: 'STALE_BUILD', message: 'Warning: the CLI build is older than its sources; run npm run build:lib.' };

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
      code: { type: 'boolean', default: false },
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
    if (values.code && !spec.flags?.includes('code')) {
      throw new QueryError('INVALID_ARGUMENTS', `--code does not apply to ${name}.`, 'Use --code with chartreuse guide <topic>.');
    }
    command = name;
    result = spec.run(argument, { code: values.code });
  }
  console.log(json ? JSON.stringify({ ...metadata, command, data: result.data }) : result.lines.join('\n'));
  // In JSON mode stderr only ever carries JSON: here a one-line document with the warnings.
  if (buildIsStale()) console.error(json ? JSON.stringify({ ...metadata, warnings: [staleWarning] }) : staleWarning.message);
} catch (error) {
  const problem = error instanceof QueryError ? error
    : error?.code?.startsWith('ERR_PARSE_ARGS_') ? new QueryError('INVALID_ARGUMENTS', error.message, 'Run chartreuse --help.')
      : new QueryError('INTERNAL_ERROR', 'Could not read the packaged Chartreuse reference.', undefined, 1);
  const { code, message, hint, exitCode, suggestions } = problem;
  process.exitCode = exitCode;
  const detail = suggestions ? { code, message, hint, suggestions } : { code, message, hint };
  const stale = buildIsStale();
  if (json) console.error(JSON.stringify({ ...metadata, error: detail, ...(stale ? { warnings: [staleWarning] } : {}) }));
  else console.error([message, hint, stale ? staleWarning.message : undefined].filter(Boolean).join('\n'));
}
