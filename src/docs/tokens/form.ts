import type { ComponentTokenDoc, RuntimeVariableDefinition } from './types';

const internalNote = 'Layout value controlled by props or selected by the container. Configure layout, labelWidth, and labelAlign through the public properties.';
const runtimeVariables: RuntimeVariableDefinition[] = [
  { name: '--cr-form-label-width', description: 'The preferred label width supplied by labelWidth, serialized as a CSS length.', source: { file: 'src/system/Form.tsx', detail: 'FormBody converts a numeric labelWidth to pixels; its default is the literal 144px.' }, notes: [internalNote] },
  { name: '--cr-form-label-align', description: 'The requested start or end label alignment.', source: { file: 'src/system/Form.tsx', detail: 'FormBody serializes normalized labelAlign on the inner layout body.' }, notes: [internalNote] },
  ...[
    ['field-columns', 'The active one- or two-column layout for each labeled field.'],
    ['label-column', 'The column occupied by the field’s label or slider header.'],
    ['control-column', 'The column occupied by the control and supporting content.'],
    ['label-row', 'The row selected for the label in the active layout.'],
    ['control-row', 'The row selected for the main control in the active layout.'],
    ['label-padding', 'The label’s top inset when it shares a row with the control.'],
    ['active-label-align', 'The active text alignment, reset to start in vertical layouts.'],
    ['action-indent', 'The active horizontal offset used by the compact action row.'],
  ].map(([name, description]) => ({
    name: `--cr-form-${name}`, description,
    source: { file: 'src/system/form.css', selector: '.cr-form-body', detail: 'The base body resets the layout values; the 480px container query selects horizontal or inline values for that body.' },
    notes: [internalNote],
  })),
];

export const formTokenDocs: ComponentTokenDoc[] = ['Form', 'FormLayout'].map(component => ({
  component,
  componentTokens: [],
  globalTokens: ['--cr-space-2', '--cr-space-3', '--cr-space-4'],
  runtimeVariables,
  notes: [
    'No independent styling hooks, colors, borders, or typography tokens are declared. The components arrange existing controls, which keep their own token contracts.',
    'form.css consumes space-2 for field row spacing, space-4 for field columns and content sections, and space-3 for the compact wrapping action row.',
    'Label width, alignment, field columns, and action indentation are prop- or container-owned variables. Each body resets the active layout values so nested scopes do not inherit an outer horizontal layout.',
    'The 480px container threshold, 144px default label width, and 10px horizontal label inset are literal layout values rather than new design tokens.',
  ],
}));
