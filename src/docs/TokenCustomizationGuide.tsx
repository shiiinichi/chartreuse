import { Text } from '../system';
import { CodeBlock } from './shared';
import { customizationNotes, tokenOverrideScope } from './tokens';
import './token-customization-guide.css';

const appWideCode = `/* Unlayered app CSS, after styles.css */
:root {
  --cr-radius-md: 10px; /* every Chartreuse corner */
}`;

const featureCode = `/* Restyle one feature only */
.settings-panel {
  --cr-radius-md: 4px;
  --cr-color-primary: var(--cr-evergreen);
  --cr-color-on-primary: var(--cr-paper);
}

/* <div className="settings-panel">…</div> */`;

/**
 * How a consuming app changes shared tokens. The order of preference comes from
 * customizationNotes(), the same text `chartreuse token` prints, so the site and CLI stay in step.
 */
export function TokenCustomizationGuide({ id = 'customize-tokens', showOrder = true }: { id?: string; showOrder?: boolean }) {
  return <section className="token-customization" aria-labelledby={`${id}-heading`}>
    <div className="token-customization-heading"><Text size="heading-2" id={`${id}-heading`}>Customize tokens</Text><Text size="body">Change a shared token by declaring the same CSS custom property in application CSS. No theme provider or build step is involved.</Text></div>
    <div className="token-customization-scopes">
      <div><Text size="heading-3">App-wide: <code>:root</code></Text><Text size="body">{tokenOverrideScope.root}</Text><CodeBlock language="css" code={appWideCode} /></div>
      <div><Text size="heading-3">One feature: a wrapper</Text><Text size="body">{tokenOverrideScope.wrapper}</Text><CodeBlock language="css" code={featureCode} /></div>
    </div>
    <div className="token-customization-notes">
      <Text size="heading-3">Why no extra specificity is needed</Text><Text size="body">{tokenOverrideScope.layers}</Text>
      <Text size="heading-3">JavaScript token exports</Text><Text size="body">{tokenOverrideScope.javascript}</Text>
    </div>
    {showOrder && <div className="token-customization-notes"><Text size="heading-3">Order of preference</Text><Text size="body">The same guidance <code>chartreuse token</code> prints. Run <code>chartreuse token &lt;Component&gt;</code> for one component's hooks and selectors.</Text><ol>{customizationNotes().map(note => <li key={note}>{note}</li>)}</ol></div>}
  </section>;
}
