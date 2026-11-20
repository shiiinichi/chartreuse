import { useId } from 'react';
import { Palette } from 'lucide-react';
import { Disclosure } from '../system/Disclosure';
import { Badge } from '../system/components';
import { CodeBlock } from './shared';
import { getComponentTokenDoc, relevantGlobalTokens } from './tokens';
import type { ComponentTokenDoc, RuntimeVariableDefinition, TokenDefinition, TokenSource } from './tokens/types';
import { Text } from '../system';
import './design-token-section.css';

function SourceLocation({ source }: { source: TokenSource }) {
  return <span className="token-source-location"><code>{source.file}</code>{source.selector && <code>{source.selector}</code>}{source.detail && <span>{source.detail}</span>}</span>;
}

function TokenDetails({ token }: { token: TokenDefinition }) {
  return <><Text size="body">{token.description}</Text>{token.references?.length ? <Text size="body" className="token-detail"><Text bold>References:</Text> {token.references.map((name, index) => <span key={name}>{index > 0 && ', '}<code>{name}</code></span>)}</Text> : null}{token.responsive && <Text size="body" className="token-detail"><Text bold>Responsive:</Text> {token.responsive}</Text>}{token.notes?.length ? <ul className="token-row-notes">{token.notes.map(note => <li key={note}>{note}</li>)}</ul> : null}</>;
}

export function DesignTokenTable({ label, tokens }: { label: string; tokens: readonly TokenDefinition[] }) {
  return <div className="design-token-scroll" role="region" aria-label={label} tabIndex={0}><table className="design-token-table"><caption className="cr-sr-only">{label}</caption><thead><tr><th scope="col">Token</th><th scope="col">Description</th><th scope="col">Type</th><th scope="col">Default / fallback</th><th scope="col">Source / scope</th></tr></thead><tbody>{tokens.map(token => <tr key={token.name}><th scope="row"><code>{token.name}</code>{token.availability === 'docs-css' && <span className="token-availability">Documentation CSS</span>}</th><td><TokenDetails token={token} /></td><td><code>{token.type}</code></td><td><code>{token.defaultValue}</code>{token.themes && <dl className="token-theme-values"><div><dt>Light</dt><dd><code>{token.themes.light}</code></dd></div><div><dt>Dark</dt><dd><code>{token.themes.dark}</code></dd></div></dl>}</td><td><SourceLocation source={token.source} />{token.sources?.map((source, index) => <SourceLocation key={`${source.file}-${source.selector}-${index}`} source={source} />)}</td></tr>)}</tbody></table></div>;
}

function RuntimeVariableTable({ component, variables }: { component: string; variables: readonly RuntimeVariableDefinition[] }) {
  return <div className="design-token-scroll" role="region" aria-label={`${component} prop and state variables`} tabIndex={0}><table className="design-token-table token-runtime-table"><caption className="cr-sr-only">{component} variables owned by props or runtime state</caption><thead><tr><th scope="col">Variable</th><th scope="col">Ownership</th><th scope="col">Source</th></tr></thead><tbody>{variables.map(variable => <tr key={variable.name}><th scope="row"><code>{variable.name}</code></th><td><Text size="body">{variable.description}</Text>{variable.notes?.length ? <ul className="token-row-notes">{variable.notes.map(note => <li key={note}>{note}</li>)}</ul> : null}</td><td><SourceLocation source={variable.source} /></td></tr>)}</tbody></table></div>;
}

function TokenOverrideHelp({ documentation, shared }: { documentation: ComponentTokenDoc; shared: readonly TokenDefinition[] }) {
  // Preserve the documented state/variant scope; selector lists need their own example.
  const componentHook = documentation.componentTokens.find(token => /^\.cr-[a-zA-Z0-9_-]+/.test(token.source.selector?.trim() || '') && !token.source.selector?.includes(','));
  const componentSelector = componentHook?.source.selector?.trim();
  const globalHook = shared.find(token => token.name === '--cr-color-text') || shared.find(token => token.name === '--cr-radius-md') || shared[0];
  const snippets = [
    globalHook ? `/* Scope a shared variable through an application wrapper.\n   Start from this source default, then replace its value. */\n.my-feature {\n  ${globalHook.name}: ${globalHook.defaultValue};\n}` : '',
    componentHook && componentSelector ? `/* Override a local hook on the element that declares or consumes it.\n   Use an application override outside the library's CSS layers. */\n.my-feature ${componentSelector} {\n  ${componentHook.name}: ${componentHook.defaultValue};\n}` : '',
  ].filter(Boolean).join('\n\n');
  return <Disclosure className="design-token-disclosure" title="Override tokens"><div className="token-override-help"><Text size="body">Shared variables inherit from the scope where they are set. If a component defines a local palette or alias, override that hook on the documented element.</Text>{snippets ? <CodeBlock language="css" code={snippets} /> : <Text size="body">No CSS token override is documented for this export. Use the customization properties and native styling contract listed in its API.</Text>}<Text size="body">Props and runtime state control the implementation variables listed separately. Configure layout and interaction through the documented API.</Text><a href="#tokens">Global token reference ↗</a></div></Disclosure>;
}

export function DesignTokenSection({ component }: { component: string }) {
  const headingId = useId();
  const documentation = getComponentTokenDoc(component);
  if (!documentation) return <section className="component-reference-section design-token-section" aria-labelledby={headingId}><div className="component-section-heading"><Text size="heading-2" id={headingId}><Palette size={18} aria-hidden="true" />Design tokens</Text></div><Text size="body" className="token-empty-note">Token documentation for this export is not available in the current catalog.</Text></section>;
  const shared = relevantGlobalTokens(documentation);

  return <section className="component-reference-section design-token-section" aria-labelledby={headingId}><div className="component-section-heading"><Text size="heading-2" id={headingId}><Palette size={18} aria-hidden="true" />Design tokens</Text><span>CSS declarations and fallbacks</span></div><Text size="body" className="design-token-intro">Component CSS hooks and shared tokens used by this implementation. Defaults come from declarations or explicit fallbacks. Fixed CSS values without custom properties are excluded from the token tables.</Text><div className="design-token-groups">
    <Disclosure className="design-token-disclosure" defaultOpen={documentation.componentTokens.length > 0} title={<span className="token-disclosure-title">Component CSS hooks<Badge>{documentation.componentTokens.length || 'None documented'}</Badge></span>}>
      {documentation.componentTokens.length ? <DesignTokenTable label={`${component} component CSS tokens`} tokens={documentation.componentTokens} /> : <Text size="body" className="token-empty-note">No additional component-specific styling hooks are documented for {component}. Shared variables are listed below, followed by any variables controlled by props or runtime state.</Text>}
    </Disclosure>
    <Disclosure className="design-token-disclosure" defaultOpen title={<span className="token-disclosure-title">Relevant global tokens<Badge>{shared.tokens.length}</Badge></span>}>
      {shared.tokens.length ? <DesignTokenTable label={`${component} relevant global CSS tokens`} tokens={shared.tokens} /> : <Text size="body" className="token-empty-note">No direct shared CSS variable dependencies are documented for this export. See its source and notes for inheritance or composition details.</Text>}
      {shared.unresolved.length > 0 && <Text size="body" className="token-catalog-note">Global references missing from this catalog: {shared.unresolved.map(name => <code key={name}>{name} </code>)}</Text>}
    </Disclosure>
    {documentation.runtimeVariables?.length ? <Disclosure className="design-token-disclosure" title={<span className="token-disclosure-title">Prop and state variables<Badge>{documentation.runtimeVariables.length}</Badge></span>}><Text size="body" className="token-runtime-intro">Props or runtime state control these implementation values. Configure them through the corresponding API properties.</Text><RuntimeVariableTable component={component} variables={documentation.runtimeVariables} /></Disclosure> : null}
    {documentation.notes?.length ? <div className="design-token-notes"><Text size="heading-3">Scope and behavior</Text><ul>{documentation.notes.map(note => <li key={note}>{note}</li>)}</ul></div> : null}
    <TokenOverrideHelp documentation={documentation} shared={shared.tokens} />
  </div></section>;
}
