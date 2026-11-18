import type { TokenDefinition, TokenSource } from './types';

const root: TokenSource = { file: 'src/system/styles.css', selector: ':root', detail: '@layer cr-tokens' };
const primitiveColors = [
  ['evergreen', '#024340', 'Primitive evergreen brand color.'],
  ['chartreuse', '#dbffad', 'Primitive chartreuse accent color.'],
  ['paper', '#fffdf6', 'Primitive paper color.'],
  ['canvas', '#f2f0e6', 'Primitive workspace canvas color.'],
  ['muted', '#52645f', 'Primitive supporting text color.'],
  ['border', '#ceccc3', 'Primitive neutral border color.'],
  ['success', '#0a7366', 'Primitive success color.'],
  ['info', '#125996', 'Primitive informational color.'],
  ['warning', '#855900', 'Primitive warning color.'],
  ['danger', '#992b3d', 'Primitive error and destructive action color.'],
] as const;
const spaces = [
  ['1', '.25rem'], ['2', '.5rem'], ['3', '.75rem'], ['4', '1rem'], ['5', '1.25rem'],
  ['6', '1.5rem'], ['8', '2rem'], ['10', '2.5rem'], ['12', '3rem'], ['16', '4rem'],
] as const;
const semanticColors = [
  ['text', '#024340', '#e2eee2', 'Primary interface text and inherited icon color.'],
  ['muted', '#52645f', '#a3b7ac', 'Secondary text, supporting labels, and lower emphasis icons.'],
  ['canvas', '#f8f8f2', '#142723', 'Semantic workspace background.'],
  ['surface', '#fffdf8', '#1c302a', 'Raised component surfaces.'],
  ['subtle', '#f2f2e9', '#233a31', 'Inset surfaces and hover backgrounds.'],
  ['border', '#dedfd5', '#3f554a', 'Surface-separation borders and neutral progress tracks.'],
  ['input-border', '#849080', '#819386', 'Stronger form-control and interactive-surface border.'],
  ['primary', '#024340', '#dbffad', 'Primary action surface and selected-control accent.'],
  ['on-primary', '#fffdf6', '#024340', 'Content drawn on the primary action surface.'],
  ['focus', '#0a7366', '#dbffad', 'Keyboard focus outlines and selected interactive borders.'],
  ['success', '#0a7366', '#a5dcac', 'Success foreground and completed progress fill.'],
  ['success-bg', '#eaf1e3', '#284332', 'Success-tinted surface.'],
  ['info', '#125996', '#a4c9e9', 'Informational foreground.'],
  ['info-bg', '#e9eef6', '#243c4a', 'Informational tinted surface.'],
  ['warning', '#855900', '#efd591', 'Warning foreground.'],
  ['warning-bg', '#f8edcf', '#493f27', 'Warning-tinted surface.'],
  ['danger', '#992b3d', '#f1adba', 'Error and destructive-action foreground.'],
  ['danger-bg', '#f9e9ea', '#492d35', 'Error-tinted surface.'],
] as const;

/** Exact published :root CSS variables, rather than inferred typography/size tokens. */
export const globalTokens: TokenDefinition[] = [
  ...primitiveColors.map(([key, defaultValue, description]) => ({
    name: `--cr-${key}`, type: 'color', defaultValue, description, source: root,
    availability: 'library-css' as const,
    sources: [{ file: 'src/system/tokens.ts', detail: `colors.${key} contains an independent JS value and this CSS-variable name.` }],
    notes: ['Primitive palette value. Semantic --cr-color-* variables use their own literal light/dark values, so they do not automatically follow a primitive override.'],
  })),
  {
    name: '--cr-font-sans', type: 'font-family',
    defaultValue: "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    description: 'Shared sans-serif family used where component CSS explicitly references it.', source: root, availability: 'library-css',
    notes: ['This is a family token. Individual component font sizes, weights, and line heights are generally literal CSS values; the JS typography descriptors do not create CSS custom properties.'],
  },
  {
    name: '--cr-font-mono', type: 'font-family', defaultValue: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
    description: 'Monospace family for identifiers, code, and runtime data where explicitly consumed.', source: root, availability: 'library-css',
  },
  ...spaces.map(([step, defaultValue]) => ({
    name: `--cr-space-${step}`, type: 'length', defaultValue,
    description: `Shared spacing step ${step}; ${Number(step) * 4}px when the root font size is 16px.`,
    source: root, availability: 'library-css' as const,
    sources: [{ file: 'src/system/tokens.ts', detail: `spacing entry ${step} and tokens.spacing are independent numeric/px descriptors.` }],
    notes: ['The CSS value is rem-based. Identical literal margins or gaps in a component are not aliases of this token unless the CSS uses var().'],
  })),
  {
    name: '--cr-layout-content-max', type: 'length', defaultValue: '1320px',
    description: 'Maximum width of the documentation content container, including its gutters.',
    source: root, availability: 'library-css',
    sources: [{ file: 'src/docs.css', selector: '.docs-main' }, { file: 'src/docs/LayoutPage.css', selector: '.layout-preview-content' }],
    notes: ['Published in the library stylesheet. Its current consumers are the documentation shell and documented layout recipe; components do not automatically cap their own width with this variable.', 'The docs Full-width preference removes the container maximum while retaining the gutter.'],
  },
  {
    name: '--cr-layout-gutter', type: 'length', defaultValue: '48px',
    description: 'Responsive horizontal gutter used by the documentation content container.',
    source: root, availability: 'library-css',
    sources: [
      { file: 'src/system/styles.css', selector: ':root', detail: 'Viewport media queries: min-width 1600px; max-width 1200px, 800px, 600px, and 360px.' },
      { file: 'src/docs.css', selector: '.docs-main' },
      { file: 'src/docs/LayoutPage.css', selector: '.layout-preview-content' },
    ],
    responsive: '65px at viewport widths ≥1600px; 48px at 1201–1599px; 30px at 801–1200px; 28px at 601–800px; 20px at 361–600px; 16px at ≤360px.',
    notes: ['Published in the library stylesheet, with current usage in documentation layouts. These are viewport breakpoints, independent of Grid’s container breakpoints.'],
  },
  ...([['sm', '4px'], ['md', '7px'], ['lg', '10px'], ['xl', '14px'], ['full', '999px']] as const).map(([size, defaultValue]) => ({
    name: `--cr-radius-${size}`, type: 'length', defaultValue,
    description: size === 'full' ? 'Corner radius for pill and circular shapes where explicitly referenced.' : `Shared ${size} corner radius.`,
    source: root, availability: 'library-css' as const,
    sources: [{ file: 'src/system/tokens.ts', detail: `radii.${size} is the independent numeric JS descriptor.` }],
  })),
  {
    name: '--cr-duration-fast', type: 'time', defaultValue: '150ms',
    description: 'Fast transition duration for consumers such as buttons, inputs, and switch thumbs.', source: root, availability: 'library-css',
    notes: ['Reduced-motion rules can disable a consumer’s transition without changing this variable. Spinner and Skeleton animation durations are separate literal values.'],
  },
  {
    name: '--cr-duration-normal', type: 'time', defaultValue: '220ms',
    description: 'Declared normal-duration design value, available for consumer styles.', source: root, availability: 'library-css',
    notes: ['No current library component consumes this variable. Drawer entry uses a literal 180ms; Spinner uses 1s and Skeleton 1.8s. Changing this token does not alter those animations.'],
  },
  ...([
    ['sm', '0 2px 4px #012f2d06', 'Small shadow for component surfaces and hover states.'],
    ['md', '0 4px 16px #012f2d0c', 'Medium raised-surface shadow.'],
    ['lg', '0 16px 50px #012f2d1a', 'Large overlay and notification shadow.'],
  ] as const).map(([size, defaultValue, description]) => ({
    name: `--cr-shadow-${size}`, type: 'box-shadow', defaultValue, description, source: root, availability: 'library-css' as const,
  })),
  ...semanticColors.map(([role, light, dark, description]) => ({
    name: `--cr-color-${role}`, type: 'color', defaultValue: `light-dark(${light}, ${dark})`, description,
    source: root, availability: 'library-css' as const, themes: { light, dark },
    notes: ['Both branches are literal colors, not var() aliases of the primitive palette. color-scheme selects the branch; components can shadow inherited semantic values locally.'],
  })),
];

export const globalTokenNotes = [
  'These rows list published CSS custom properties. No individual font-size, font-weight, line-height, control-height, or icon-size variables are generated from the JS descriptors.',
  'The @chartreuse/ui/tokens exports are static JavaScript data. colors maps ten primitive names to value/token/role descriptors; tokens.colors contains their literal values. Neither is a live reading of CSS overrides or color-scheme.',
  'Semantic --cr-color-* values contain literal light-dark() branches. Equal light-mode values do not make them aliases of --cr-evergreen, --cr-paper, or another primitive.',
  'CSS spacing is expressed in rem. The numeric spacing and tokens.spacing px strings in JavaScript match a 16px root font; they do not change when the root font size changes.',
  'typography and radii are JavaScript descriptors; consumption varies by component. Per-component tables list var() references, including those used by helper controls rendered by the component.',
  'Local component declarations can shadow inherited globals, and variant/tone aliases are assigned on the component itself. Override the correct scope or use the documented prop; a root override of a locally assigned alias will not win automatically.',
  'Layout maximum/gutter variables are distributed with the library but currently consumed by the documentation container and its recipe. Grid separately responds to its own container width.',
];
