import { Fragment } from 'react';
import { Check, Code2, ExternalLink } from 'lucide-react';
import { Badge } from '../system/components';
import { CodeBlock, ShowcaseHeadingLevelContext } from './shared';
import { ComponentPlayground } from './ComponentPlayground';
import { GuidanceNotes } from './GuidanceNotes';
import { DesignTokenSection } from './DesignTokenSection';
import type { ComponentReference, PropDefinition } from './reference/types';
import { Text } from '../system';
import './component-reference.css';

function ComponentName({ name }: { name: string }) {
  return <>{name.split(/(?<=[a-z0-9])(?=[A-Z])/).map((part, index) => <Fragment key={`${part}-${index}`}>{index > 0 && <wbr />}{part}</Fragment>)}</>;
}

export function ApiTable({ name, rows }: { name: string; rows: readonly PropDefinition[] }) {
  return <div className="component-api-scroll" role="region" aria-label={`${name} API properties`} tabIndex={0}><table className="component-api-table"><caption className="sr-only">{name} properties</caption><thead><tr><th scope="col">Property</th><th scope="col">Description</th><th scope="col">Type</th><th scope="col">Default</th></tr></thead><tbody>{rows.length ? rows.map(property => <tr key={property.name}><th scope="row"><code>{property.name}</code>{property.required && <span className="component-api-required">Required</span>}</th><td>{property.description}</td><td><code>{property.type}</code></td><td><code>{property.defaultValue === '' ? '""' : property.defaultValue ?? '—'}</code></td></tr>) : <tr><td colSpan={4}>This component defines no additional properties. Native attribute support is documented below.</td></tr>}</tbody></table></div>;
}

export function ComponentReferencePage({ reference, group = 'Components', category }: { reference: ComponentReference; group?: 'Components' | 'Foundations'; category?: string }) {
  const acceptsCustomIcons = reference.props.some(property => `${property.type} ${property.description}`.includes('IconSource'))
    || reference.notes?.some(note => /IconSource|icon slots/.test(note));
  return <article className="component-reference"><header className="document-heading"><div className="eyebrow">{group}{category && <> · {category}</>}</div><div className="document-title-row"><Text size="heading-1"><ComponentName name={reference.name} /></Text><Badge tone="success" icon={Check}>API documented</Badge></div><Text size="body">{reference.summary}</Text></header>
    <section className="component-reference-section" aria-labelledby="component-examples-heading"><div className="component-section-heading"><Text size="heading-2" id="component-examples-heading">Examples</Text><span>Preview and code</span></div><ShowcaseHeadingLevelContext value={3}><div className="component-reference-playground" data-component={reference.name}><ComponentPlayground name={reference.name} code={`${reference.importCode}\n\n${reference.usageCode}`} /></div></ShowcaseHeadingLevelContext></section>
    <section className="component-reference-section" aria-labelledby="component-usage-heading"><div className="component-section-heading"><Text size="heading-2" id="component-usage-heading"><Code2 size={18} aria-hidden="true" />Usage</Text><span>React 19 + TypeScript</span></div><CodeBlock code={reference.importCode} /><CodeBlock code={reference.usageCode} />{acceptsCustomIcons && <Text size="body" className="component-common-intro"><a href="#icons">Custom SVG icon requirements and generation guidance ↗</a></Text>}</section>
    <section className="component-reference-section" aria-labelledby="component-api-heading"><div className="component-section-heading"><Text size="heading-2" id="component-api-heading">API</Text><span>{reference.props.length} {reference.props.length === 1 ? 'property' : 'properties'}</span></div><ApiTable name={reference.name} rows={reference.props} />
      {(reference.nativeElement || reference.nativeProps) && <div className="component-native-contract"><Text size="heading-3">Native attributes</Text>{reference.nativeElement && <Text size="body">Rendered element: <code>{reference.nativeElement}</code>.</Text>}{reference.nativeProps && <Text size="body">{reference.nativeProps}</Text>}<a href="#common-props">Common DOM properties reference<ExternalLink size={14} aria-hidden="true" /></a><Text size="body" className="component-native-reminder">Attribute forwarding and ref support depend on this component’s documented contract, including when it renders a native element.</Text></div>}
    </section>
    <DesignTokenSection component={reference.name} />
    <GuidanceNotes notes={reference.notes || []} />
  </article>;
}

const commonProperties: PropDefinition[] = [
  { name: 'id', description: 'Identifies the native element. Field components may generate an ID to associate a visible label.', type: 'string' },
  { name: 'className', description: 'Adds classes when the component accepts and forwards this property. The API table documents wrapper-specific behavior.', type: 'string' },
  { name: 'style', description: 'Sets inline styles when the component forwards this property. Shared CSS variables provide common styling values.', type: 'CSSProperties' },
  { name: 'name', description: 'The native form control name, when the component supports form participation.', type: 'string' },
  { name: 'disabled', description: 'Disables supported native controls. Support depends on the rendered element and component contract.', type: 'boolean' },
  { name: 'aria-*', description: 'Accessible names, descriptions, state, and relationships supported by the rendered element and component contract.', type: 'AriaAttributes' },
  { name: 'data-*', description: 'Custom data attributes for native elements when additional attributes are forwarded.', type: 'string | number | boolean' },
  { name: 'onClick / onChange', description: 'Native React events where forwarded. Dedicated component callbacks are listed in each API table.', type: 'React event handler' },
  { name: 'ref', description: 'References the native element when explicitly exposed. Accepting HTMLAttributes does not establish ref support.', type: 'Ref<TElement>' },
  { name: 'children', description: 'Element content where supported. Components with a specific content API list it in their own properties table.', type: 'ReactNode' },
];

export function CommonPropsPage() {
  return <><header className="document-heading"><div className="eyebrow">Start here</div><Text size="heading-1">Common DOM props</Text><Text size="body">Native attribute types and forwarding requirements shared across component APIs.</Text></header><Text size="body" className="component-common-intro">Components document which native DOM attributes they accept and forward. Check the native attribute section on the component’s API page before using these properties. Ref support must be explicitly documented.</Text><ApiTable name="Common DOM" rows={commonProperties} /><div className="component-native-contract"><Text size="heading-3">Native attribute and ref contracts</Text><Text size="body"><code>ComponentPropsWithRef</code> includes a native ref. <code>HTMLAttributes</code> alone does not. Components that destructure a fixed set of props do not automatically forward additional attributes.</Text></div></>;
}
