import type { ComponentTokenDoc, RuntimeVariableDefinition } from './types';

const tiers = ['base', 'sm', 'md', 'lg', 'xl'] as const;
const internalNote = 'Controlled by layout props and measurements. Configure them through the public component properties.';
function responsiveVariables(prefix: string, purpose: string): RuntimeVariableDefinition[] {
  return tiers.map(tier => ({
    name: `--cr-masonry-${prefix}-${tier}`,
    description: `${purpose} at the ${tier} container tier.`,
    source: { file: 'src/system/Masonry.tsx', detail: `variables('${prefix}', …) serializes the five exact tier names; masonry.css consumes each responsive value.` },
    notes: [internalNote],
  }));
}
const measuredPlacement: RuntimeVariableDefinition[] = [
  { name: '--cr-masonry-inline-size', description: 'Measured width assigned to a direct child before reading its natural height.', source: { file: 'src/system/Masonry.tsx', detail: 'The place measurement pass writes the final span width onto each participating child.' }, notes: [internalNote] },
  { name: '--cr-masonry-inline-start', description: 'Measured logical horizontal position of a packed child.', source: { file: 'src/system/Masonry.tsx', detail: 'masonryGeometry placement is written onto the participating child without changing DOM order.' }, notes: [internalNote] },
  { name: '--cr-masonry-block-start', description: 'Measured logical vertical position of a packed child.', source: { file: 'src/system/Masonry.tsx', detail: 'The shortest available contiguous column group determines this placement.' }, notes: [internalNote] },
];
const itemRuntime: RuntimeVariableDefinition[] = [
  ...responsiveVariables('item-span', 'Normalized item column span'),
  { name: '--cr-masonry-item-span', description: 'The active item span selected by the nearest Masonry container tier.', source: { file: 'src/system/masonry.css', selector: '.cr-masonry-item', detail: 'Base and container-query rules select one of the five item-span values.' }, notes: [internalNote] },
];

export const masonryTokenDocs: ComponentTokenDoc[] = [
  {
    component: 'Masonry', componentTokens: [],
    globalTokens: [1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map(step => `--cr-space-${step}`),
    runtimeVariables: [
      ...responsiveVariables('columns', 'Normalized exact column count'),
      ...responsiveVariables('row-gap', 'Vertical gap from the shared spacing scale'),
      ...responsiveVariables('column-gap', 'Horizontal gap from the shared spacing scale'),
      ...['columns', 'row-gap', 'column-gap'].map(name => ({
        name: `--cr-masonry-${name}`, description: `The active ${name} value selected at the current Masonry container width.`,
        source: { file: 'src/system/masonry.css', selector: '.cr-masonry-layout', detail: 'Base and 480/768/1024/1280px container-query rules select the current value.' }, notes: [internalNote],
      })),
      { name: '--cr-masonry-min-column-width', description: 'The CSS length supplied by minColumnWidth for automatic column measurement.', source: { file: 'src/system/Masonry.tsx', detail: 'The prop defaults to 240px; CSS resolves the length in the hidden measurement surface.' }, notes: [internalNote] },
      { name: '--cr-masonry-max-columns', description: 'The normalized upper limit supplied by maxColumns for automatic packing.', source: { file: 'src/system/Masonry.tsx', detail: 'The prop defaults to 24 and is normalized to a positive integer count.' }, notes: [internalNote] },
      { name: '--cr-masonry-block-size', description: 'The packed content height assigned to the layout surface.', source: { file: 'src/system/Masonry.tsx', detail: 'The final geometry pass writes this value after measuring child heights at their final widths.' }, notes: [internalNote] },
      ...measuredPlacement,
    ],
    notes: [
      'Masonry has no independent styling hooks. Gap properties consume the same shared spacing tokens as Grid; a gap of zero is a literal zero length.',
      'Column counts, minimum width, maximum count, and measured child positions are controlled by props or measurements. They are not additional design tokens.',
      'The invisible measurement surface resolves CSS lengths and gaps. Native CSS masonry is not required; the pre-measurement content uses a normal single-column CSS layout.',
      'Supplied cards and other content retain their own color, typography, surface, and token contracts. Those child tokens are not attributed to the Masonry container.',
    ],
  },
  {
    component: 'MasonryItem', componentTokens: [], globalTokens: [], runtimeVariables: itemRuntime,
    notes: [
      'MasonryItem has no direct global token consumption or component styling hooks. Its five span values and active span are controlled by the span property.',
      'The parent Masonry writes measured width and logical positions to participating children. Item content supplies its natural height and consumes its own styling tokens.',
      'The one-column default, numeric span normalization, and responsive thresholds are layout behavior rather than styling tokens.',
    ],
  },
  {
    component: 'MasonrySpacer', componentTokens: [], globalTokens: [],
    runtimeVariables: [
      ...itemRuntime,
      ...responsiveVariables('spacer-height', 'Reserved spacer block size'),
      ...responsiveVariables('spacer-display', 'Whether the spacer participates with block or none display'),
    ],
    notes: [
      'MasonrySpacer reuses MasonryItem span values and adds height and visibility values controlled by props. It consumes no global color, surface, border, or typography tokens.',
      'The default 64px height is a literal layout default. It is not an alias of a spacing token. Use the parent Masonry gap for normal spacing between items.',
      'The spacer has no visible decoration. Optional outline and tint in the examples belong to the documentation illustration and can be switched off independently of the reserved space.',
    ],
  },
];
