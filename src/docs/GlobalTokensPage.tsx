import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge, Select, TextField } from '../system/components';
import { DesignTokenTable } from './DesignTokenSection';
import { globalTokenNotes, globalTokens } from './tokens';
import { CodeBlock } from './shared';
import './global-tokens-page.css';

const overrideCode = `/* Import @chartreuse/ui/styles.css once at your app entry.\n   In application CSS, scope overrides through an ordinary wrapper. */\n.my-feature {\n  --cr-color-primary: var(--cr-evergreen);\n  --cr-color-on-primary: var(--cr-paper);\n  --cr-radius-md: var(--cr-radius-lg);\n}\n\n/* Variables inherit into controls within this wrapper:\n   <div className="my-feature"><Button>Continue</Button></div> */`;

const descriptorCode = `import { colors, spacing, typography, radii, tokens }\n  from '@chartreuse/ui/tokens';\n\ncolors.evergreen.value; // '#024340'\ncolors.evergreen.token; // '--cr-evergreen'\nspacing.find(step => step.name === '6')?.value; // 24 (px descriptor)\nradii.md; // 7 (px descriptor)\ntypography.find(style => style.name === 'Body');\ntokens; // name/version plus primitive colors, spacing, typography, radii\n\n// These JavaScript descriptors do not read computed CSS values\n// and do not include every semantic/component CSS variable.`;

const descriptorRows = [
  { name: 'colors', shape: '10 primitive color descriptors', meaning: 'Each entry includes a value, CSS token name, and role. Semantic light/dark pairs are listed in the CSS catalog below and are excluded from this object.' },
  { name: 'spacing', shape: 'name/value array', meaning: 'Numeric pixel descriptors for the four-pixel scale. The stylesheet uses rem values, so their computed pixels can change with the root font size.' },
  { name: 'typography', shape: 'display/body sample descriptors', meaning: 'Size, weight, line-height, and sample text. These descriptors do not generate CSS font-size variables; component text sizes are defined separately.' },
  { name: 'radii', shape: 'numeric pixel descriptors', meaning: 'sm, md, lg, xl, and full values, corresponding to the --cr-radius-* CSS variables.' },
  { name: 'tokens', shape: 'metadata + primitive descriptor snapshot', meaning: 'Contains name/version and the colors, spacing, typography, and radii descriptors. Semantic, layout, shadow, duration, and component hooks are excluded from this snapshot.' },
];

/** Content-only page; the documentation route supplies its foundation heading. */
export function GlobalTokensPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const categories = useMemo(() => [...new Set(globalTokens.map(token => token.type))].sort(), []);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return globalTokens.filter(token => (type === 'all' || token.type === type) && [token.name, token.description, token.defaultValue, token.source.file, token.source.selector, ...(token.references || [])].filter(Boolean).join(' ').toLocaleLowerCase().includes(needle));
  }, [query, type]);

  return <div className="global-tokens-page"><div className="global-token-intro"><p>Shared CSS custom properties declared in the stylesheet, with source defaults, theme behavior, and source locations. Each public React export lists the variables used by its implementation on its API page.</p><Badge>{globalTokens.length} global CSS tokens</Badge></div>
    <section className="global-token-section"><div className="component-section-heading"><h2>Global CSS catalog</h2><span>{filtered.length} of {globalTokens.length} tokens</span></div><div className="global-token-filters"><TextField label="Search tokens" type="search" icon={Search} value={query} onChange={event => setQuery(event.target.value)} placeholder="Token name, value, source, or description…" /><Select label="Token type" value={type} onChange={event => setType(event.target.value)}><option value="all">All types</option>{categories.map(category => <option value={category} key={category}>{category}</option>)}</Select></div>{filtered.length ? <DesignTokenTable label="Global CSS token catalog" tokens={filtered} /> : <p className="token-empty-note">No tokens match the search and selected type. Shorten the search or select all types.</p>}</section>
    <section className="global-token-section"><div className="component-section-heading"><h2>CSS variables and JavaScript exports</h2><span>Separate CSS and JavaScript contracts</span></div><div className="global-token-export-scroll" role="region" aria-label="JavaScript token export contracts" tabIndex={0}><table><caption className="cr-sr-only">Exports from @chartreuse/ui/tokens</caption><thead><tr><th scope="col">Export</th><th scope="col">Shape</th><th scope="col">Connection to CSS</th></tr></thead><tbody>{descriptorRows.map(row => <tr key={row.name}><th scope="row"><code>{row.name}</code></th><td>{row.shape}</td><td>{row.meaning}</td></tr>)}</tbody></table></div><CodeBlock language="ts" code={descriptorCode} /></section>
    <section className="global-token-section"><div className="component-section-heading"><h2>Override CSS variables</h2><span>Match the documented scope</span></div><p className="global-token-copy">Set shared variables on an application wrapper. When a component defines a local CSS hook, override it on the documented selector. Component pages list these hooks separately from variables controlled by props or runtime state.</p><CodeBlock language="css" code={overrideCode} /></section>
    <section className="global-token-section global-token-notes"><h2>Defaults and source locations</h2><ul>{globalTokenNotes.map(note => <li key={note}>{note}</li>)}</ul><p>Source locations use repository-relative paths and selectors. The tables list source defaults and explicit fallbacks; computed styles can differ.</p></section>
  </div>;
}
