import type { ComponentTokenDoc, RuntimeVariableDefinition, TokenDefinition } from './types';

const css = 'src/system/styles.css';
const activeButtonSelector = ".cr-button:is([aria-pressed='true'], [aria-current='page'], [aria-current='true'])";
const globals = (...names: string[]) => [...new Set(names.map(name => name.startsWith('--') ? name : `--cr-${name}`))];
const tones = ['success', 'info', 'warning', 'danger'] as const;
const toneGlobals = (selected: readonly string[] = tones) => selected.flatMap(tone => [`color-${tone}`, `color-${tone}-bg`]);

const buttonGlobals = globals('font-sans', 'color-text', 'color-primary', 'color-on-primary',
  'radius-md', 'duration-fast', 'color-surface', 'color-input-border', 'chartreuse', 'evergreen',
  'color-danger', 'shadow-sm', 'color-subtle', 'color-active', 'color-on-active', 'color-active-border');
const ghostButtonGlobals = globals('font-sans', 'color-text', 'radius-md', 'duration-fast', 'color-subtle');
const fieldGlobals = globals('font-sans', 'color-text', 'color-muted', 'color-surface', 'color-input-border',
  'radius-md', 'color-focus', 'color-danger');
const badgeGlobals = globals('font-sans', 'radius-md', 'color-muted', 'color-subtle', ...toneGlobals());
const avatarGlobals = globals('font-sans', 'color-surface');

function buttonAliases(ghostDefault = false): TokenDefinition[] {
  return [
    {
      name: '--button-bg', type: 'color', defaultValue: ghostDefault ? 'transparent' : 'var(--cr-color-primary)',
      description: 'Local button surface alias. The variant assigns it; hover mixes this background with --button-fg.',
      source: { file: css, selector: ghostDefault ? ".cr-button[data-variant='ghost']" : '.cr-button' },
      sources: [
        ...(ghostDefault ? [{ file: css, selector: '.cr-button', detail: 'Primary variant base: var(--cr-color-primary).' }] : []),
        { file: css, selector: ".cr-button[data-variant='secondary']", detail: 'var(--cr-color-surface)' },
        { file: css, selector: ".cr-button[data-variant='accent']", detail: 'var(--cr-chartreuse)' },
        { file: css, selector: ".cr-button[data-variant='ghost']", detail: 'transparent' },
        { file: css, selector: ".cr-button[data-variant='danger']", detail: 'var(--cr-color-danger)' },
        { file: css, selector: activeButtonSelector, detail: 'var(--cr-color-active)' },
      ],
      references: ['--cr-color-primary', '--cr-color-surface', '--cr-chartreuse', '--cr-color-danger', '--cr-color-active'],
      notes: ['Use variant for the built-in resting styles. Override this local variable on the button element with a custom class or inline style.', 'Ghost hover uses --cr-color-subtle. A pressed or current button retains its active fill on hover.'],
    },
    {
      name: '--button-fg', type: 'color', defaultValue: ghostDefault ? 'var(--cr-color-text)' : 'var(--cr-color-on-primary)',
      description: 'Local button content color, also used to mix the default hover background.',
      source: { file: css, selector: ghostDefault ? ".cr-button[data-variant='ghost']" : '.cr-button' },
      sources: [
        ...(ghostDefault ? [{ file: css, selector: '.cr-button', detail: 'Primary variant base: var(--cr-color-on-primary).' }] : []),
        { file: css, selector: ".cr-button[data-variant='secondary'], .cr-button[data-variant='ghost']", detail: 'var(--cr-color-text)' },
        { file: css, selector: ".cr-button[data-variant='accent']", detail: 'var(--cr-evergreen)' },
        { file: css, selector: ".cr-button[data-variant='danger']", detail: 'var(--cr-color-surface)' },
        { file: css, selector: activeButtonSelector, detail: 'var(--cr-color-on-active)' },
      ],
      references: ['--cr-color-on-primary', '--cr-color-text', '--cr-evergreen', '--cr-color-surface', '--cr-color-on-active'],
      notes: ['The variant and active state assign the local foreground. Icons follow currentColor.', 'The resting accent border uses #c5e49d.'],
    },
  ];
}

function toneAliases(defaultTone: 'neutral' | typeof tones[number], background = true): TokenDefinition[] {
  const names = background ? ['fg', 'bg'] as const : ['fg'] as const;
  return names.map(part => ({
    name: `--tone-${part}`, type: 'color',
    defaultValue: defaultTone === 'neutral' ? 'Not assigned for neutral tone' : `var(--cr-color-${defaultTone}${part === 'bg' ? '-bg' : ''})`,
    description: `Local semantic ${part === 'fg' ? 'foreground' : 'surface'} alias assigned by a non-neutral data-tone.`,
    source: { file: css, selector: `[data-tone='${defaultTone === 'neutral' ? 'success' : defaultTone}']` },
    sources: tones.map(tone => ({ file: css, selector: `[data-tone='${tone}']`, detail: `var(--cr-color-${tone}${part === 'bg' ? '-bg' : ''})` })),
    references: tones.map(tone => `--cr-color-${tone}${part === 'bg' ? '-bg' : ''}`),
    notes: ['Use the tone prop to select a semantic palette. Non-neutral tone selectors assign the alias on that element, so an inherited alias value is shadowed.', 'Neutral Badge/Alert styles use --cr-color-muted and --cr-color-subtle directly and do not consume these aliases.'],
  }));
}

const splitButtonCss = 'src/system/split-button.css';
const splitButtonDivider: TokenDefinition = {
  name: '--cr-split-button-divider', type: 'color',
  defaultValue: 'color-mix(in srgb, var(--cr-color-on-primary) 28%, var(--cr-color-primary))',
  description: 'Color of the single border line between the action and menu segments.',
  source: { file: splitButtonCss, selector: '.cr-split-button' },
  sources: [
    { file: splitButtonCss, selector: ".cr-split-button[data-variant='secondary']", detail: 'var(--cr-color-input-border)' },
    { file: splitButtonCss, selector: ".cr-split-button[data-variant='accent']", detail: '#c5e49d' },
    { file: splitButtonCss, selector: ".cr-split-button[data-variant='ghost']", detail: 'var(--cr-color-border)' },
    { file: splitButtonCss, selector: ".cr-split-button[data-variant='danger']", detail: 'color-mix(in srgb, var(--cr-color-surface) 28%, var(--cr-color-danger))' },
    { file: splitButtonCss, selector: '.cr-split-button > .cr-split-button-menu', detail: 'Consumed as border-inline-start-color.' },
  ],
  references: ['--cr-color-on-primary', '--cr-color-primary', '--cr-color-input-border', '--cr-color-border', '--cr-color-surface', '--cr-color-danger'],
  notes: ['Filled variants mix their content color into the surface; secondary and accent reuse their border color, so the seam reads as one shared border. Set it on .cr-split-button with a variant selector to override it.', 'Forced-colors mode draws the seam in ButtonText.'],
};

const dialogRuntime: RuntimeVariableDefinition[] = [
  {
    name: '--dialog-width', description: 'Dialog width controlled by size and maxWidth. CSS starts at 520px, with sm 420px, lg 760px, and xl 1600px; a valid maxWidth prop writes an inline px value.',
    source: { file: 'src/system/components.tsx', detail: 'Dialog widthStyle; size defaults are in styles.css .cr-dialog[data-size].' },
    notes: ['Configure size or maxWidth. This is a prop-controlled implementation variable, not a root design token. The viewport still caps the actual width.'],
  },
  {
    name: '--cr-dialog-height', description: 'Opening-height measurement written in pixels while freezeHeight is enabled, and removed on close or when the option is disabled.',
    source: { file: 'src/system/components.tsx', detail: 'Dialog opening effect; consumed by .cr-dialog[open][data-freeze-height].' },
    notes: ['The CSS fallback is auto. Use freezeHeight rather than setting this measured value manually.'],
  },
  {
    name: '--cr-dialog-side-min-width', description: 'Normalized sideContentMinWidth written to the split body in pixels; the prop and CSS fallback default to 260px.',
    source: { file: 'src/system/components.tsx', detail: 'DialogSplit configuredMin and splitStyle; consumed by .cr-dialog-body[data-layout="split"].' },
    notes: ['A size constraint controlled by the prop. Available space and the main-pane reserve also bound the effective side pane.'],
  },
  {
    name: '--cr-dialog-side-max-width', description: 'Normalized sideContentMaxWidth written to the split body in pixels; the prop and CSS fallback default to 640px.',
    source: { file: 'src/system/components.tsx', detail: 'DialogSplit configuredMax and splitStyle.' },
    notes: ['Configure sideContentMaxWidth; do not treat this as a global width token.'],
  },
  {
    name: '--cr-dialog-side-width', description: 'Pane width written in pixels after measurement or resizing. Before a state value is written, the CSS fallback is 38%.',
    source: { file: 'src/system/components.tsx', detail: 'DialogSplit paneWidth and splitStyle; pointer/keyboard resize updates it.' },
    notes: ['Owned by the split measurement and resize interaction. It is not a styling override contract.'],
  },
  {
    name: '--dialog-splitter-width', description: 'Divider column width. The resizable gutter is 10px and the fixed divider is 1px.',
    source: { file: 'src/system/components.tsx', detail: 'DialogSplit splitterWidth and splitStyle.' },
  },
  {
    name: '--dialog-side-available-width', description: 'Available width for the side pane after reserving 280px for the main pane and room for the divider.',
    source: { file: 'src/system/components.tsx', detail: 'DialogSplit reservedWidth and splitStyle.' },
  },
];

/** Source-audited token usage for the 24 components defined in components.tsx. */
export const coreTokenDocs: ComponentTokenDoc[] = [
  {
    component: 'Text', componentTokens: [], globalTokens: globals('font-sans'),
    notes: ['A size preset uses the shared sans-serif font family and the size, weight, and line height shown in the Typography foundation. With size omitted, native and inherited typography apply.'],
  },
  {
    component: 'Button', componentTokens: buttonAliases(), globalTokens: buttonGlobals,
    notes: ['Consumption: styles.css .cr-button, its data-variant selectors, and shared base typography.', 'Buttons use the evergreen active palette when aria-pressed is true or aria-current is page or true.', 'Control sizes, gaps, padding, font size/weight/line-height, disabled opacity, and the 1s loading spin are literal rules or props, not additional CSS tokens. --cr-duration-fast controls transitions only.'],
  },
  {
    component: 'ButtonSelect', componentTokens: buttonAliases(),
    globalTokens: [...buttonGlobals, ...globals('color-border', 'color-muted', 'shadow-lg', 'space-2')],
    notes: ['The trigger renders Button, so it shares its sizes, variants, and local color aliases. The built-in option list shares Autocomplete’s popover and active option colors. The custom panel uses shared surface, text, border, radius, shadow, and spacing tokens.'],
  },
  {
    component: 'SplitButton', componentTokens: [...buttonAliases(), splitButtonDivider],
    globalTokens: [...buttonGlobals, ...globals('color-border', 'color-muted', 'shadow-lg', 'space-2')],
    notes: ['Both segments render Button, so they share its sizes, variants, and local color aliases; set them on .cr-split-button > .cr-button to restyle both. The popover is ButtonSelect’s, with the same option list and custom panel tokens.', 'The menu segment overlaps the action by 1px and its start border is the seam. Inner corners are 0; outer corners keep --cr-radius-md. The menu segment is as wide as it is tall, 44px wide at md on coarse pointers.'],
  },
  {
    component: 'IconButton', componentTokens: buttonAliases(true), globalTokens: buttonGlobals,
    notes: ['IconButton renders Button with an added .cr-icon-button class and defaults to the ghost variant. Its root is the same button, so the shared button aliases and variant tokens apply.', 'The 17px icon size and icon-button padding are literal implementation values; there is no separate icon-size or icon-button-size CSS variable.'],
  },
  {
    component: 'BrandMark', componentTokens: [], globalTokens: [],
    notes: ['Consumption: components.tsx BrandMark path uses currentColor; styles.css .cr-brand-mark only supplies literal dimensions and flex behavior.', 'No CSS variable is read directly. Set the SVG color through native style/className or let it inherit. A surrounding component may itself derive its color from a token, but that does not make BrandMark a direct token consumer.'],
  },
  {
    component: 'Badge', componentTokens: toneAliases('neutral'), globalTokens: badgeGlobals,
    notes: ['Consumption: styles.css .cr-badge, generic [data-tone] aliases, and the non-neutral Badge tone rule. The optional status dot uses currentColor.', 'The ghost variant uses a transparent background with the same foreground tone.', 'Font size, padding, gap, and status-dot size are literal CSS. Forced-colors mode uses system CanvasText for the border and dot.'],
  },
  {
    component: 'TextField', componentTokens: [], globalTokens: fieldGlobals,
    notes: ['Consumption: styles.css .cr-field, .cr-input, .cr-input-wrap icon, placeholder, required marker, error helper, and shared input styles. The active field uses --cr-color-focus for its feathered border.', 'The size prop uses the same minimum heights as Button. CSS sets typography, padding, and the icon inset.', 'On coarse pointers a media query increases the default minimum height and input font size.'],
  },
  {
    component: 'TextArea', componentTokens: [], globalTokens: fieldGlobals,
    notes: ['Consumption: styles.css .cr-field/.cr-input, textarea.cr-input, placeholder/error rules, and shared input typography. It uses the same global field palette as TextField.', 'The minimum textarea height, padding, type sizes, and vertical-resize behavior are literal CSS. No local textarea variables exist.'],
  },
  {
    component: 'Select', componentTokens: [], globalTokens: globals(...fieldGlobals, 'color-active', 'color-on-active', 'color-active-border', 'radius-md', 'shadow-lg'),
    notes: ['The trigger uses shared field styles and a chevron in --cr-color-muted. The single-choice popup shares the panel and option styles in option-list.css.', 'Dropdown size presets share Button minimum heights. Native listboxes keep their row-based height and use active colors for checked options where the browser allows styling.'],
  },
  {
    component: 'Checkbox', componentTokens: [], globalTokens: globals('font-sans', 'color-text', 'color-active'),
    notes: ['Consumption: styles.css .cr-checkbox typography and its native input accent-color.', 'The checkbox and hint inherit the component text color. Hint type size, checkbox dimensions, and coarse-pointer hit-area minimum are literal CSS, not spacing/size tokens.'],
  },
  {
    component: 'Switch', componentTokens: [], globalTokens: globals('font-sans', 'color-text', 'color-muted', 'paper', 'color-active', 'color-on-active', 'color-active-border', 'radius-full', 'duration-fast'),
    notes: ['The checked track uses the active fill and border. The unchecked thumb uses --cr-paper and the checked thumb uses --cr-color-on-active.', 'Track/thumb dimensions and travel distance are literal CSS. --cr-duration-fast controls thumb transition. Reduced-motion disables it without changing the token.'],
  },
  {
    component: 'Avatar', componentTokens: [], globalTokens: globals(...avatarGlobals, 'space-3'),
    notes: ['Consumption: styles.css .cr-avatar reads --cr-font-sans and --cr-color-surface for its border. Optional .cr-avatar-person uses --cr-font-sans for its name row and --cr-space-3 for the glyph/name gap; name color is inherited from its context.', 'Green, peach, blue, and purple foreground/background pairs are literal values selected by color. Glyph sizes, name type size/weight, and the 50% radius are literal CSS; no avatar palette, size, or radius variables exist.'],
  },
  {
    component: 'AvatarGroup', componentTokens: [], globalTokens: globals(...avatarGlobals, 'color-subtle', 'color-muted'),
    notes: ['Consumption: owned Avatar instances use .cr-avatar tokens. The .cr-avatar-more overflow count adds --cr-color-subtle and --cr-color-muted.', 'Overlap, border width, individual sizes, and palette selection are literal styles/props. AvatarGroup has no local styling token or native className override prop.'],
  },
  {
    component: 'Progress', componentTokens: [], globalTokens: globals('radius-full', 'color-border', 'color-success', 'space-2', 'font-sans', 'color-text', 'color-muted'),
    notes: ['Consumption: styles.css .cr-progress and native progress pseudo-elements use radius/track/fill tokens. Optional .cr-progress-group text uses the listed typography/colors and --cr-space-2 gap.', 'The bare bar has no label-text layout by default. Its 4px thickness and optional text sizes are literal CSS; value/max are native progress attributes, not CSS implementation variables.'],
  },
  {
    component: 'Tabs', componentTokens: [], globalTokens: globals('font-sans', 'color-text', 'color-border', 'color-muted', 'color-active', 'color-active-border', 'color-subtle', 'radius-md', 'color-surface', 'shadow-sm', 'space-1', 'space-3'),
    notes: ['Selected tabs use --cr-color-active for the underline and --cr-color-text for the foreground. Pill tabs use --cr-color-surface and --cr-shadow-sm for the selected tab. Highlight tabs use --cr-color-subtle for the selected fill, --cr-radius-md for the top corners, and --cr-space-1 and --cr-space-3 for the gap and button padding.', 'Tab buttons share Button minimum heights and font sizes.'],
  },
  {
    component: 'Card', componentTokens: [], globalTokens: globals('color-border', 'radius-md', 'color-surface', 'shadow-sm', 'color-text', 'space-4'),
    notes: ['Header, footer, and divided sections use --cr-space-4 for padding. An undivided body uses the same padding when header or footer is supplied.', 'Dividers use --cr-color-border. Card content inherits typography from its surroundings.'],
  },
  {
    component: 'Alert', componentTokens: toneAliases('info'),
    globalTokens: globals('font-sans', 'radius-md', 'color-muted', 'color-subtle', ...toneGlobals(), 'duration-fast'),
    notes: ['Consumption: styles.css .cr-alert, generic non-neutral tone aliases, and its optional owned ghost IconButton dismissal control. The border is a color-mix of currentColor, so it follows the foreground alias.', 'The .cr-alert > .cr-button rule makes the dismiss button inherit the Alert foreground. The button keeps its ghost radius, transition duration, and subtle hover background.', 'Alert padding, gaps, font size, and border mixing percentage are literal values.'],
  },
  {
    component: 'Divider', componentTokens: [], globalTokens: globals('color-border'),
    notes: ['Consumption: styles.css .cr-divider reads only --cr-color-border.', 'The 1px line and 1.5rem vertical margin are literal CSS. The margin is not a var(--cr-space-6) reference despite matching it at the default root size.'],
  },
  {
    component: 'Skeleton', componentTokens: [], globalTokens: globals('color-border'),
    notes: ['Consumption: styles.css .cr-skeleton background. No local skeleton variables exist.', 'The 12px height, 4px radius, and 1.8s pulse duration are literal CSS. --cr-duration-fast/normal do not control this animation; reduced-motion disables it directly.'],
  },
  {
    component: 'Spinner', componentTokens: [], globalTokens: globals('color-muted'),
    notes: ['Consumption: styles.css .cr-spinner sets --cr-color-muted; the LoaderCircle SVG inherits currentColor.', 'The size prop controls SVG dimensions. .cr-spin has a literal 1s animation duration, not a motion-token reference; reduced-motion disables the animation directly.'],
  },
  {
    component: 'Dialog', componentTokens: [],
    globalTokens: globals('font-sans', 'color-text', 'color-focus', 'color-border', 'border', 'radius-md', 'color-surface', 'shadow-lg', 'color-muted', 'color-subtle', 'space-6', 'radius-full', 'radius-md', 'duration-fast', 'color-active', 'color-on-active', 'color-active-border'),
    runtimeVariables: dialogRuntime,
    notes: ['Consumption: styles.css .cr-dialog/header/body/footer, optional split pane/switcher/separator rules, and its owned ghost close IconButton. User-supplied content/footer components are not assumed to be part of this token set.', 'Dialog exposes size, maxWidth, freezeHeight, and split-width props. Their internal custom properties are listed separately because JavaScript/size selectors own them.', 'The 24px footer/pane padding consumes --cr-space-6; similar header padding is literal CSS. The backdrop color/blur, viewport margins, and responsive thresholds are literal rules, not tokens.', 'The close IconButton uses Button’s local aliases on its child button; use its documented global inputs rather than a Dialog-root alias.'],
  },
  {
    component: 'ToastProvider', componentTokens: toneAliases('success', false),
    globalTokens: globals('font-sans', 'color-text', 'color-surface', 'color-input-border', 'radius-md', 'shadow-lg', 'color-success', 'color-info', 'color-warning', 'color-danger', ...ghostButtonGlobals),
    notes: ['Consumption: styles.css .cr-toast and its leading SVG, generic [data-tone] foreground aliases, plus the owned ghost dismissal IconButton.', 'Only the leading notification icon consumes --tone-fg (with --cr-color-success fallback). The toast surface stays --cr-color-surface; the generic --tone-bg assignment is not consumed by the toast and is not offered as a background hook.', 'A neutral toast assigns no local --tone-fg. It can inherit that alias from an ancestor; the success fallback is used only when the alias is unset.', 'Position offsets, maximum width, padding, and the 5-second lifetime are literal values or JavaScript behavior. Button aliases apply only on the child dismiss button.'],
  },
  {
    component: 'Breadcrumbs', componentTokens: [], globalTokens: globals('font-sans', 'color-muted', 'color-text'),
    notes: ['Consumption: styles.css .cr-breadcrumbs, its current-page item, and link underline styles. Links and separator SVGs inherit currentColor.', 'Gaps, font size, and underline offset are literal CSS. The underline prop selects rules; it does not set a CSS variable.'],
  },
  {
    component: 'TaskCard', componentTokens: [],
    globalTokens: globals('font-sans', 'font-mono', 'color-text', 'color-border', 'radius-md', 'color-surface', 'shadow-sm', 'color-subtle', 'color-muted', 'radius-md', ...toneGlobals(['success', 'info', 'warning'])),
    notes: ['Consumption: styles.css task button/identifier/metadata/footer rules plus owned Card, Badge, and AvatarGroup helpers. Task status selects neutral/info/warning/success Badge palettes; priority can select warning. Danger is not a TaskCard status.', 'Badge tone aliases are assigned on the nested Badge elements and are documented on Badge, not as TaskCard-root styling hooks.', 'Metadata/type sizes, card/footer padding, gaps, and avatar palettes remain literal CSS. Counts and progress ratios are content props; no task-specific custom properties are defined.', 'With hideMetadataLabels, Tooltip supplies the floating labels.'],
  },
  {
    component: 'AgentCard', componentTokens: [],
    globalTokens: globals('font-sans', 'font-mono', 'color-text', 'color-surface', 'color-border', 'radius-md', 'color-active', 'color-on-active', 'color-active-border', 'color-subtle', 'color-muted', 'radius-md', ...toneGlobals(['success', 'info', 'warning'])),
    notes: ['The pressed card uses the solid active fill and its paired foreground. The status badge uses its own info, success, warning, or neutral tone.', 'Badge tone aliases belong to the nested Badge. The card has no local CSS variables.', 'Card padding, icon surface size/7px radius, type sizes, and runtime data spacing are literal rules. elapsed and tokens are display props.'],
  },
  {
    component: 'EmptyState', componentTokens: [], globalTokens: globals('font-sans', 'color-text', 'color-success-bg', 'color-muted', 'color-border', 'radius-md', 'space-3', 'space-5', 'space-6'),
    notes: ['The default variant uses --cr-color-success-bg for the icon surface. The description and the dashed variant’s icon use --cr-color-muted.', 'The dashed panel uses --cr-color-border and --cr-radius-md for its outline, --cr-space-3 for the content gap, and --cr-space-5 and --cr-space-6 for padding.'],
  },
];
