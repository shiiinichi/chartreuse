import type { ComponentTokenDoc, RuntimeVariableDefinition, TokenDefinition } from './types';

const systemFile = (name: string) => `src/system/${name}`;
const globals = (...groups: readonly string[][]) => [...new Set(groups.flat())].sort();
const names = (value: string) => value.trim().split(/\s+/).map(name => `--cr-${name}`);
const fieldGlobals = names('font-sans color-text color-muted color-danger color-surface color-input-border color-focus radius-md duration-fast');
// IconButton defaults to Button's ghost variant. Primary/accent/danger button
// palettes and the primary-button hover shadow are not active for that variant.
const ghostButtonGlobals = names('font-sans color-text color-focus color-subtle radius-md duration-fast');
const primaryButtonGlobals = names('font-sans color-text color-focus radius-md duration-fast color-primary color-on-primary shadow-sm');
const markdownGlobals = globals(names('color-text color-muted color-success color-success-bg color-focus color-border color-subtle color-canvas color-primary font-sans font-mono radius-sm radius-md'), ghostButtonGlobals);
const gridGapGlobals = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map(step => `--cr-space-${step}`);
const tiers = ['base', 'sm', 'md', 'lg', 'xl'] as const;

function responsiveVariables(prefix: string, owner: string, purpose: string): RuntimeVariableDefinition[] {
  return tiers.map(tier => ({
    name: `--cr-${prefix}-${tier}`,
    description: `${purpose} at the ${tier} container tier.`,
    source: { file: systemFile('Grid.tsx'), detail: `variables('${prefix}', …) creates the five exact tier names; ${owner} supplies these inline.` },
    notes: ['Use the documented responsive props. These values are controlled by the layout implementation and are not independent design tokens.'],
  }));
}
const gridRuntime: RuntimeVariableDefinition[] = [
  ...responsiveVariables('grid-columns', 'Grid.columns', 'Normalized column count'),
  ...responsiveVariables('grid-row-gap', 'Grid.gap/rowGap', 'Resolved shared-space row gap'),
  ...responsiveVariables('grid-column-gap', 'Grid.gap/columnGap', 'Resolved shared-space column gap'),
  ...responsiveVariables('grid-align', 'Grid.align', 'Item block-axis alignment'),
  ...responsiveVariables('grid-justify', 'Grid.justify', 'Item inline-axis alignment'),
  ...['columns', 'row-gap', 'column-gap'].map(name => ({
    name: `--cr-grid-${name}`,
    description: `The active ${name} value selected by the current container breakpoint.`,
    source: { file: systemFile('grid.css'), selector: '.cr-grid-layout', detail: 'Base and 480/768/1024/1280px container-query rules select their corresponding inline tier values.' },
    notes: ['Owned by the grid’s responsive layout; configure columns/gap/rowGap/columnGap instead.'],
  })),
];
const gridItemRuntime: RuntimeVariableDefinition[] = [
  ...responsiveVariables('grid-item-span', 'GridItem.span', 'Column span'),
  ...responsiveVariables('grid-item-rows', 'GridItem.rowSpan', 'Row span'),
  ...responsiveVariables('grid-item-align', 'GridItem.align', 'Item block-axis self-alignment'),
  ...responsiveVariables('grid-item-justify', 'GridItem.justify', 'Item inline-axis self-alignment'),
  ...['span', 'rows'].map(name => ({
    name: `--cr-grid-item-${name}`,
    description: `The active item ${name} selected at the current parent Grid container tier.`,
    source: { file: systemFile('grid.css'), selector: '.cr-grid-item', detail: 'Base and responsive rules select the corresponding GridItem inline value.' },
    notes: ['Use span/rowSpan. Column spans also consume the parent-owned --cr-grid-columns and are clamped to its actual track count.'],
  })),
];

const gridSpacerRuntime: RuntimeVariableDefinition[] = [
  ...gridItemRuntime,
  ...responsiveVariables('grid-spacer-display', 'GridSpacer.visible', 'Whether the cell uses block or none display'),
];

const calloutPalette: TokenDefinition[] = [
  {
    name: '--cr-color-text', description: 'Local text palette available to content and action descendants.', type: 'color', defaultValue: 'var(--cr-paper)',
    source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' },
    sources: [{ file: systemFile('callout-banner.css'), selector: '.cr-callout-banner-action', detail: 'The action scope reassigns this name to var(--cr-chartreuse).' }],
    references: ['--cr-paper', '--cr-chartreuse'],
    notes: ['This local declaration shadows the root token with the same name. The action wrapper has a second local assignment, so override that scope separately when needed.'],
  },
  { name: '--cr-color-muted', description: 'Supporting text on the evergreen banner.', type: 'color', defaultValue: '#fffdf6c2', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' }, notes: ['A fixed translucent paper literal; it is not an alias of the root muted semantic color.'] },
  { name: '--cr-color-primary', description: 'Local primary color for components supplied in a banner slot.', type: 'color', defaultValue: 'var(--cr-chartreuse)', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' }, references: ['--cr-chartreuse'] },
  { name: '--cr-color-on-primary', description: 'Foreground for a primary action supplied in the banner.', type: 'color', defaultValue: 'var(--cr-evergreen)', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' }, references: ['--cr-evergreen'] },
  { name: '--cr-color-surface', description: 'Local surface color inherited by supplied child components.', type: 'color', defaultValue: 'var(--cr-evergreen)', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' }, references: ['--cr-evergreen'] },
  { name: '--cr-color-subtle', description: 'Local subtle surface used by supplied controls, including ghost action hover.', type: 'color', defaultValue: '#14534a', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' } },
  { name: '--cr-color-border', description: 'Local border color inherited by supplied content.', type: 'color', defaultValue: '#48766b', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' } },
  { name: '--cr-color-input-border', description: 'Local input/secondary-control border color for supplied content.', type: 'color', defaultValue: '#b9d29f', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' } },
  { name: '--cr-color-focus', description: 'Focus color inherited by interactive banner content.', type: 'color', defaultValue: 'var(--cr-chartreuse)', source: { file: systemFile('callout-banner.css'), selector: '.cr-callout-banner' }, references: ['--cr-chartreuse'] },
];

const sliderHooks: TokenDefinition[] = [
  {
    name: '--cr-slider-track-size', description: 'Track thickness and the thumb’s centering calculation.', type: 'length', defaultValue: '6px',
    source: { file: systemFile('slider.css'), selector: '.cr-slider-input', detail: 'Used by WebKit and Firefox track/progress rules and the WebKit thumb offset.' },
    notes: ['Assigned on the native input. Override the input itself (including its forwarded style prop), not only an ancestor.'],
  },
  {
    name: '--cr-slider-thumb-size', description: 'Thumb width and height in both supported range-control engines.', type: 'length', defaultValue: '20px',
    source: { file: systemFile('slider.css'), selector: '.cr-slider-input' },
    sources: [{ file: systemFile('slider.css'), selector: '.cr-slider-input', detail: '@media (pointer: coarse) assigns 24px.' }],
    responsive: '24px for coarse pointers; 20px otherwise.',
    notes: ['The range target’s 40px/44px block size is a separate literal CSS value, not this token.'],
  },
  {
    name: '--cr-slider-fill', description: 'Filled track and thumb color.', type: 'color', defaultValue: 'var(--cr-color-primary)',
    source: { file: systemFile('slider.css'), selector: '.cr-slider-input' },
    sources: [{ file: systemFile('slider.css'), selector: ".cr-slider-input[aria-invalid='true']", detail: 'Validation assigns var(--cr-color-danger).' }, { file: systemFile('slider.css'), selector: '.cr-slider-input', detail: '@media (forced-colors: active) assigns Highlight; native thumb overrides use ButtonText.' }],
    references: ['--cr-color-primary', '--cr-color-danger'],
    notes: ['This is a stateful local alias. Preserve the invalid-state distinction when overriding it. Forced-colors rules also replace the track/thumb paint directly.'],
  },
  {
    name: '--cr-slider-track', description: 'Unfilled track color.', type: 'color', defaultValue: 'var(--cr-color-subtle)',
    source: { file: systemFile('slider.css'), selector: '.cr-slider-input' },
    sources: [{ file: systemFile('slider.css'), selector: '.cr-slider-input', detail: '@media (forced-colors: active) assigns Canvas and directly replaces the track background.' }],
    references: ['--cr-color-subtle'],
    notes: ['The shared input-border token independently supplies the track’s inset outline.'],
  },
];

const swimlaneHooks: TokenDefinition[] = [
  {
    name: '--cr-swimlane-accent', description: 'Top border color for the lane.', type: 'color', defaultValue: 'var(--cr-color-muted)',
    source: { file: systemFile('swimlane.css'), selector: '.cr-swimlane' },
    sources: ['info', 'warning', 'success', 'danger'].map(tone => ({ file: systemFile('swimlane.css'), selector: `.cr-swimlane[data-tone='${tone}']`, detail: `Assigns var(--cr-color-${tone}).` })),
    references: names('color-muted color-info color-warning color-success color-danger'),
    notes: ['A local tone alias; use tone for the built-in palette, or override the same lane element for a custom accent. The header Badge has its own tone aliases.'],
  },
  {
    name: '--cr-swimlane-tint', description: 'Tint mixed at 60% with the shared canvas color for the lane background.', type: 'color', defaultValue: 'var(--cr-color-subtle)',
    source: { file: systemFile('swimlane.css'), selector: '.cr-swimlane' },
    sources: ['info', 'warning', 'success', 'danger'].map(tone => ({ file: systemFile('swimlane.css'), selector: `.cr-swimlane[data-tone='${tone}']`, detail: `Assigns var(--cr-color-${tone}-bg).` })),
    references: names('color-subtle color-info-bg color-warning-bg color-success-bg color-danger-bg'),
    notes: ['The 60% mix and 3px top-border width are literal CSS, not additional design-token hooks.'],
  },
];

const statHooks: TokenDefinition[] = [
  { name: '--cr-stat-label-color', description: 'Statistic label color.', type: 'color', defaultValue: 'var(--cr-color-muted)', source: { file: systemFile('stat.css'), selector: '.cr-stat-label', detail: 'Consumed with an explicit fallback; no local declaration blocks inheritance.' }, references: ['--cr-color-muted'] },
  { name: '--cr-stat-value-color', description: 'Statistic value color, ahead of the tone-selected color.', type: 'color', defaultValue: 'var(--cr-stat-tone-color, var(--cr-color-text))', source: { file: systemFile('stat.css'), selector: '.cr-stat-value', detail: 'Consumed as var(--cr-stat-value-color, var(--cr-stat-tone-color, var(--cr-color-text))).' }, references: ['--cr-stat-tone-color', '--cr-color-text'], notes: ['The internal tone variable selects shared text/info/success/warning/danger colors. A value-color override takes precedence. Forced-colors mode paints the value with CanvasText.'] },
  { name: '--cr-stat-value-size', description: 'Font size of the main statistic value.', type: 'length', defaultValue: '2rem', source: { file: systemFile('stat.css'), selector: '.cr-stat-value', detail: 'Consumed as var(--cr-stat-value-size, 2rem); prefix/suffix size stays .625em relative to the value.' } },
  { name: '--cr-stat-description-color', description: 'Supporting description color.', type: 'color', defaultValue: 'var(--cr-color-muted)', source: { file: systemFile('stat.css'), selector: '.cr-stat-description', detail: 'Consumed with an explicit fallback; no local declaration blocks inheritance.' }, references: ['--cr-color-muted'] },
];

function sequenceHooks(component: 'Timeline' | 'Steps'): TokenDefinition[] {
  const timeline = component === 'Timeline';
  return [
    {
      name: '--cr-sequence-marker-size', description: 'Marker diameter and the matching grid/connector geometry.', type: 'length', defaultValue: timeline ? 'var(--cr-space-4)' : 'var(--cr-space-8)',
      source: { file: systemFile(timeline ? 'timeline.css' : 'sequence.css'), selector: timeline ? '.cr-sequence.cr-timeline' : '.cr-sequence' },
      sources: [{ file: systemFile('sequence.css'), selector: '.cr-sequence-item', detail: 'Used by grid tracks, marker centering, title minimum height, and vertical/horizontal connector coordinates.' }],
      references: [timeline ? '--cr-space-4' : '--cr-space-8'],
      notes: [timeline ? 'Timeline locally overrides the shared 32px/space-8 default with 16px/space-4; the space-8 default is not effective for Timeline.' : 'The shared default is 32px at a 16px root. Steps does not add a marker-size override.', 'Locally assigned on the sequence root; override that same component element rather than only an ancestor.'],
    },
    {
      name: '--cr-sequence-gap', description: 'Space between entries and the connector length across that space.', type: 'length', defaultValue: 'var(--cr-space-6)',
      source: { file: systemFile('sequence.css'), selector: '.cr-sequence' },
      sources: [{ file: systemFile('sequence.css'), selector: '.cr-sequence-item', detail: 'Used as vertical item end padding; horizontal sequence rules consume it as flex gap and connector width.' }],
      references: ['--cr-space-6'],
      notes: ['The final vertical entry removes its end padding. Horizontal marker-to-content spacing within an item is a separate literal 12px gap.'],
    },
    {
      name: '--cr-sequence-column-gap', description: 'Gap between marker/date/content columns in vertical layouts.', type: 'length', defaultValue: 'var(--cr-space-4)',
      source: { file: systemFile('sequence.css'), selector: '.cr-sequence' },
      sources: [{ file: systemFile('sequence.css'), selector: '.cr-sequence-item', detail: 'Consumed by column-gap.' }, ...(timeline ? [{ file: systemFile('timeline.css'), selector: ".cr-timeline[data-date-placement='column'][data-align='start'] > .cr-sequence-item::after", detail: 'Date-column connector positioning also uses this gap; the end-aligned counterpart does likewise.' }] : [])],
      references: ['--cr-space-4'],
      notes: ['Horizontal items switch to flex layout; horizontal entry separation uses --cr-sequence-gap instead.'],
    },
    {
      name: '--cr-sequence-line-color', description: 'Connecting rule color between entries.', type: 'color', defaultValue: 'var(--cr-color-border)',
      source: { file: systemFile('sequence.css'), selector: '.cr-sequence' },
      sources: [{ file: systemFile('sequence.css'), selector: '.cr-sequence-item:not(:last-child)::after', detail: 'Vertical rules consume the token; horizontal rules use it for border-block-start.' }, { file: systemFile('sequence.css'), selector: '.cr-sequence-marker, .cr-sequence-item::after', detail: 'Forced-colors mode directly replaces border paint with CanvasText, without reassigning the token.' }],
      references: ['--cr-color-border'],
      notes: ['Marker colors are independently selected from item tone/status. The rule’s 1px thickness is a literal style.'],
    },
    ...(timeline ? [{
      name: '--cr-timeline-date-width', description: 'Dedicated date track width in vertical column-date layouts.', type: 'length', defaultValue: '150px',
      source: { file: systemFile('timeline.css'), selector: '.cr-sequence.cr-timeline' },
      sources: [{ file: systemFile('timeline.css'), selector: ".cr-timeline[data-date-placement='column'][data-align='start'] > .cr-sequence-item", detail: 'Used in grid-template-columns; the end-aligned track and both connector coordinates consume the same value.' }],
      responsive: 'Below a 560px sequence container width, column dates collapse above content; the custom-property value remains unchanged but no longer constrains a date track.',
      notes: ['Consumed only for vertical datePlacement=column with start/end alignment. Horizontal and alternate layouts use inline dates.'],
    }] : []),
  ];
}

function sequenceRuntime(component: 'Timeline' | 'Steps'): RuntimeVariableDefinition[] {
  const timeline = component === 'Timeline';
  return [
    {
      name: '--_cr-sequence-color', description: 'Internal per-entry marker border/fill/foreground color derived from tone or step status.',
      source: { file: systemFile(timeline ? 'sequence.css' : 'steps.css'), selector: timeline ? '.cr-sequence-item' : '.cr-steps > .cr-sequence-item', detail: timeline ? 'Base/neutral Timeline entries use --cr-color-primary. timeline.css success/info/warning/danger entries use matching semantic colors; pending entries use muted.' : 'Steps defaults to muted; complete/current/error selectors use success/primary/danger respectively. Upcoming entries keep muted.' },
      notes: [timeline ? 'Use item.tone for built-in marker states. Pending state is component-owned.' : 'Use current or item.status for the process state. The complete outline marker also consumes the shared success background.', 'The leading underscore marks an implementation variable; public geometry/line hooks do not replace this state mapping.'],
    },
    {
      name: '--_cr-sequence-marker-offset', description: 'Internal vertical centering offset derived from the marker diameter.',
      source: { file: systemFile('sequence.css'), selector: '.cr-sequence-item', detail: 'Computed as max(0px, calc((24px - var(--cr-sequence-marker-size)) / 2)); horizontal items assign 0px.' },
      notes: ['The marker margin and connecting-rule endpoints consume this derived offset. Change the public marker-size hook rather than the derived centering variable.'],
    },
  ];
}

/** Extended exports: every row is backed by a CSS declaration/consumption or a TSX recipe. */
export const extendedTokenDocs: ComponentTokenDoc[] = [
  {
    component: 'Autocomplete', componentTokens: [],
    globalTokens: globals(fieldGlobals, names('color-subtle color-border color-success-bg radius-lg shadow-lg')),
    runtimeVariables: ['left', 'top', 'bottom', 'width', 'max-height'].map(part => ({ name: `--cr-ac-${part}`, description: `Measured popup ${part}; recomputed for the current input, viewport, and available space.`, source: { file: systemFile('Autocomplete.tsx'), detail: 'The popup’s inline style serializes position; autocomplete.css .cr-autocomplete-popup consumes the same exact names.' }, notes: ['Positioning is owned by the combobox. Do not use its geometry variables as theme tokens.'] })),
    notes: ['No component-owned styling tokens are declared. autocomplete.css supplies the listbox/actions; shared .cr-field, .cr-required, .cr-input, and .cr-field-error rules in styles.css supply labels, input states, and validation.', 'Input size presets share Button minimum heights. The clear and dropdown actions fit inside the field at each size.', 'The popup uses the shared large radius and shadow. The active option uses the success background.'],
  },
  {
    component: 'MessageComposer', componentTokens: [],
    globalTokens: globals(primaryButtonGlobals, names('color-input-border radius-lg color-surface color-danger color-muted')),
    notes: ['No component-owned CSS variables are declared. message-composer.css consumes shared colors, radii, font, and fast motion; the built-in primary Button adds its primary/on-primary palette and hover shadow.', 'The textarea’s 13px size, coarse-pointer 16px size, padding, and send/error gap are literal CSS. Reduced-motion removes the wrapper transition.'],
  },
  {
    component: 'Drawer', componentTokens: [],
    globalTokens: globals(ghostButtonGlobals, names('color-surface color-border color-muted space-6 shadow-lg')),
    runtimeVariables: [
      { name: '--cr-drawer-width', description: 'Sanitized width prop serialized inline in pixels.', source: { file: systemFile('Drawer.tsx'), detail: 'The root inline style assigns safeWidth; drawer.css uses a 380px fallback.' }, notes: ['Use width rather than overriding the internal sizing recipe.'] },
      { name: '--cr-drawer-max-width', description: 'Sanitized maxWidth prop serialized inline in pixels.', source: { file: systemFile('Drawer.tsx'), detail: 'The root inline style assigns safeMaxWidth; drawer.css uses a 520px fallback.' }, notes: ['Use maxWidth; docked/modal viewport limits still apply.'] },
      { name: '--cr-drawer-offset', description: 'Side-dependent entry-animation translation.', source: { file: systemFile('drawer.css'), selector: ".cr-drawer[data-mode='modal'][data-side='left']", detail: 'Reduced-motion:no-preference rule assigns -24px for the left side; cr-drawer-in reads a 24px fallback for the right side.' }, notes: ['This direction/animation state is internal; use side and the system motion preference.'] },
    ],
    notes: ['No component styling hooks are declared. Header/body/footer padding uses --cr-space-6; the modal shadow uses --cr-shadow-lg. The built-in close IconButton is the ghost variant and contributes the shared control font/radius/focus/motion tokens.', 'The backdrop color/blur, header type sizes, 180ms entry duration, and viewport insets are literals. The fixed duration does not consume --cr-duration-normal.'],
  },
  {
    component: 'MarkdownRenderer', componentTokens: [], globalTokens: markdownGlobals,
    notes: ['No component-owned CSS custom properties are declared. markdown-renderer.css uses semantic colors, fonts, small/medium radii, and the primary color for GFM checkboxes; code-copy IconButton transitively consumes ghost Button focus/fast-motion/radius globals.', 'Heading sizes, paragraph rhythm, table/code padding, and maximum heights remain literal CSS. Markdown code typography consumes --cr-font-mono directly.'],
  },
  {
    component: 'Disclosure', componentTokens: [],
    globalTokens: names('color-border radius-lg color-surface color-text font-sans space-3 space-4 space-5 color-subtle color-focus color-muted duration-fast space-2 color-primary radius-sm font-mono').sort(),
    notes: ['No component-local CSS variables are declared. disclosure.css consumes the shared 8/12/16/20px spacing steps for the summary, body indentation, paragraph spacing, and lists. The same stylesheet’s optional .cr-disclosure-group framing uses these same globals.', 'headerHighlight reuses --cr-color-subtle for the summary on hover, while open, or in both states. The disclosure body retains its normal --cr-color-surface background.', 'The 56px trigger height, 72ch reading measure, type sizes, and link/code padding are literal CSS. Reduced-motion removes chevron/hover transitions; forced-colors mode substitutes system colors.'],
  },
  {
    component: 'Fieldset', componentTokens: [], globalTokens: names('space-6 color-border radius-lg color-surface color-text font-sans color-muted color-canvas').sort(),
    notes: ['No component-owned CSS variables are declared. fieldset.css consumes --cr-space-6 for the group’s inline/bottom padding and uses canvas for disabled groups.', 'The top padding, legend sizing, header gaps, and hint spacing are literals. Actions and child fields are supplied content and retain their own component token contracts.'],
  },
  {
    component: 'FilePicker', componentTokens: [],
    globalTokens: globals(ghostButtonGlobals, names('color-muted color-input-border color-surface color-danger color-border color-success-bg color-canvas font-mono')),
    notes: ['No component-owned styling variables are declared. file-picker.css styles the native selector button, selection summary, and errors; the optional clear IconButton contributes ghost Button states. Shared .cr-required in styles.css supplies required-marker danger color.', 'File path text consumes --cr-font-mono. Selection text sizes and picker dimensions are literal CSS, including the coarse-pointer adjustments.'],
  },
  {
    component: 'PagePanel', componentTokens: [], globalTokens: names('color-border radius-xl color-surface color-text font-sans space-4 space-6 color-muted space-2 color-focus space-3 color-subtle').sort(),
    notes: ['No component-owned CSS variables are declared. page-panel.css consumes shared spacing for header/body/footer and the large panel radius; its footer uses the subtle surface.', 'The heading size and description spacing are literals. Navigation, leading content, header actions, and footer actions are slots; their child components have separate token contracts.'],
  },
  {
    component: 'CalloutBanner', componentTokens: calloutPalette,
    globalTokens: names('paper evergreen chartreuse font-sans radius-lg color-muted').sort(),
    notes: ['callout-banner.css intentionally creates a local evergreen palette with the same semantic names used globally. These assignments shadow inherited root values in both light and dark themes; override the banner/action scope or a consumed primitive when changing it.', 'The banner background/title use the evergreen/paper primitives directly, and artwork/actions use chartreuse. Only --cr-color-muted is consumed directly by banner copy; the other local semantic aliases prepare optional supplied child controls.', 'The eyebrow alpha color, 32px/40px padding, 28px/25px heading sizes, artwork sizes, and the 600px container threshold are literal CSS. The built-in BrandMark consumes currentColor, not additional global tokens.'],
  },
  {
    component: 'PathSelector', componentTokens: [],
    globalTokens: globals(ghostButtonGlobals, names('color-muted color-input-border color-surface color-danger color-border')),
    notes: ['No component-owned styling variables are declared. path-selector.css consumes shared field colors/radius/motion; clear and browse actions use IconButton/Button ghost variants, including their focus and hover globals.', 'The path uses the shared sans font rather than a separate monospace token. Heights, font sizes, padding, and split-button corner values remain literal CSS.'],
  },
  {
    component: 'Grid', componentTokens: [], globalTokens: gridGapGlobals, runtimeVariables: gridRuntime,
    notes: ['No component styling hooks are declared for Grid. Grid.tsx gapValue serializes the documented gap step into var(--cr-space-N, N×4px); gap 0 serializes 0px. The default gap=4 consumes --cr-space-4.', 'Column counts, alignments, responsive tiers, and generated --cr-grid-* values are controlled by props. grid.css selects them with 480/768/1024/1280px container queries and bounds gaps to the available width.', 'gridBreakpoints and gridDefaultColumns are exported JavaScript constants, not CSS custom properties. The breakpoint numbers and one-track minimum are fixed layout values.'],
  },
  {
    component: 'GridItem', componentTokens: [], globalTokens: [], runtimeVariables: gridItemRuntime,
    notes: ['GridItem has no direct shared global token consumption or component styling hooks. Grid.tsx serializes span/rowSpan/alignment props, and grid.css consumes those values with the parent’s --cr-grid-columns.', 'Spacing belongs to the parent Grid; a child component inside GridItem consumes its own tokens. This page does not attribute arbitrary child styling to GridItem.'],
  },
  {
    component: 'GridSpacer', componentTokens: [], globalTokens: [], runtimeVariables: gridSpacerRuntime,
    notes: ['GridSpacer delegates span/rowSpan to GridItem and serializes visible into five container-tier display recipes. Its empty cell has no direct global-token consumption or additional theme hooks.', 'GridItem’s automatic alignment values are retained internally. Configure span, rowSpan, and visible through the spacer API; use the parent Grid gap for ordinary input spacing.', 'The examples add their own outline/background to make empty cells visible. Those documentation styles are not built-in spacer tokens.'],
  },
  {
    component: 'Blockquote', componentTokens: [], globalTokens: names('space-1 space-3 space-4 color-border color-text font-sans color-muted color-success color-focus color-subtle color-info color-info-bg color-success-bg color-warning color-warning-bg color-danger color-danger-bg').sort(),
    notes: ['No component-owned custom properties are declared. content-blocks.css uses shared spacing for the left rule inset, paragraphs, attribution, and filled padding, with shared link/focus colors.', 'Neutral filled quotes use --cr-color-subtle for the surface and --cr-color-success for the rule. The info, success, warning, and danger tones use their corresponding shared foreground and background tokens; these adapt to the active color scheme. Quoted text keeps --cr-color-text and attribution keeps --cr-color-muted.', 'The plain rule is a literal 2px; the filled rule is a literal 3px. Body/attribution sizes and link radius are also literals. ActivityItem-only spacing in the shared file is not attributed to Blockquote.'],
  },
  {
    component: 'ActivityItem', componentTokens: [], globalTokens: names('space-1 space-2 space-3 space-4 color-border color-text font-sans color-muted color-success color-focus').sort(),
    notes: ['No component-owned CSS variables are declared. The activity-specific and shared left-rule rules in content-blocks.css consume shared spacing, text/border colors, and link/focus colors.', 'Identifier, title, metadata, and footer type sizes are literal CSS. Supplied metadata badges/actions retain their own component token contracts.'],
  },
  {
    component: 'Tree', componentTokens: [], globalTokens: names('color-text font-sans color-border radius-md color-surface color-subtle color-success color-success-bg color-focus color-muted color-input-border').sort(),
    runtimeVariables: [{ name: '--cr-tree-closed-rotation', description: 'Chevron angle for a closed branch in the current text direction.', source: { file: systemFile('tree.css'), selector: '.cr-tree:dir(rtl)', detail: 'RTL assigns 90deg; .cr-tree-toggle > svg consumes a -90deg fallback. Expanded branches use a direct 0deg rule.' }, notes: ['Internal direction state. Set dir/use inherited document direction rather than overriding the angle.'] }],
    notes: ['No component styling hooks are declared for Tree. tree.css uses shared neutral/selected colors and the input-border color for branch connectors.', 'Node gaps/padding, line widths, indentation, type size, 400px container adjustment, and coarse-pointer sizes are literal CSS, not shared spacing tokens. Custom node content retains its own tokens.'],
  },
  {
    component: 'AgentActivity', componentTokens: [], globalTokens: names('color-text font-sans space-2 radius-sm color-subtle color-focus color-muted color-info color-danger duration-fast space-3 color-border space-1 color-success radius-md font-mono').sort(),
    notes: ['No component-owned CSS variables are declared. agent-activity.css consumes shared status colors and 4/8/12px spacing steps, with monospace output and fast chevron transitions.', 'The 1s running spin, 440px container breakpoint, row heights, output height, and margins expressed in pixels are literal CSS. Coarse-pointer and reduced-motion rules adjust those styles without additional tokens.'],
  },
  {
    component: 'SegmentedControl', componentTokens: [], globalTokens: names('color-text font-sans space-2 space-1 color-border color-subtle radius-md space-3 radius-sm color-muted color-input-border color-surface color-primary color-on-primary shadow-sm color-focus color-danger').sort(),
    notes: ['The solid variant uses color-primary for the selected segment fill and color-on-primary for its label. The outline variant uses color-surface and color-input-border. Required-marker danger color comes from styles.css.', 'The segment sizes, track inset, optical error-icon adjustment, and coarse-pointer height are literal CSS. Selection uses native radio state.'],
  },
  {
    component: 'Slider', componentTokens: sliderHooks,
    globalTokens: globals(names('space-2 space-3 color-muted color-primary color-subtle radius-md radius-full color-input-border color-focus'), names('font-sans color-text color-danger')),
    runtimeVariables: [
      { name: '--cr-slider-progress', description: 'The normalized percentage of the current range value.', source: { file: systemFile('Slider.tsx'), detail: 'The native input inline style assigns the current progress percentage after consumer style values.' }, notes: ['Owned by value/min/max; use the range props and onValueChange rather than overriding its fill percentage.'] },
      { name: '--cr-slider-direction', description: 'Gradient direction matching the input’s text direction.', source: { file: systemFile('slider.css'), selector: '.cr-slider-input', detail: 'Default to right; :dir(rtl) assigns to left.' }, notes: ['Internal direction value; use dir or the document direction.'] },
    ],
    notes: ['The four input-scoped CSS variables are styling hooks; progress and direction are documented separately as values controlled by state. Slider also renders shared .cr-field/.cr-field-error classes from styles.css for typography and validation.', 'The 13px/11px typography, 40px/44px range target height, and outline widths are literal styles. Local slider-variable assignments require input-level overrides; the style prop targets that native input.'],
  },
  {
    component: 'Navbar', componentTokens: [],
    globalTokens: names('layout-content-max layout-gutter font-sans evergreen color-surface color-text color-muted color-subtle color-border color-primary color-on-primary color-focus radius-md space-1 space-2 space-3 space-6').sort(),
    runtimeVariables: [
      { name: '--_cr-navbar-item-height', description: 'Minimum item height set by Navbar size.', source: { file: systemFile('navbar.css'), selector: '.cr-navbar' }, notes: ['Medium uses 2.5rem and Large uses 3rem.'] },
    ],
    notes: ['navbar.css uses the shared content cap for Comfortable mode. Both widths use the shared gutter, reduced when the bar is inside a narrow parent.', 'Medium uses space-2 for vertical padding and Large uses space-3.', 'The dark green variant uses --cr-evergreen for the background and resolves the shared colors in the dark scheme inside the navbar.'],
  },
  {
    component: 'NavbarItem', componentTokens: [],
    globalTokens: names('color-text color-muted color-subtle color-primary color-on-primary color-focus radius-md space-2 space-3').sort(),
    notes: ['NavbarItem links use the shared subtle fill on hover, the primary palette for the current page, and the shared focus color. Content items use the shared spacing token to separate their children.'],
  },
  {
    component: 'Sidebar', componentTokens: [], globalTokens: names('color-border color-surface color-text font-sans radius-lg shadow-sm space-4 color-input-border color-focus evergreen paper').sort(),
    runtimeVariables: [
      { name: '--cr-sidebar-width', description: 'Positive width prop serialized as pixels on the sidebar root.', source: { file: systemFile('Sidebar.tsx'), detail: 'sizing assigns the width recipe inline, with 280px fallback in sidebar.css.' }, notes: ['Use width. The native style prop is merged after the sizing recipe, but the variable remains part of layout implementation rather than a palette/spacing token.'] },
      { name: '--cr-sidebar-max-width', description: 'Positive maxWidth prop in pixels, otherwise 100%.', source: { file: systemFile('Sidebar.tsx'), detail: 'sizing assigns the cap inline; sidebar.css also constrains it to available width.' }, notes: ['Use maxWidth for the supported sizing contract.'] },
    ],
    notes: ['No component styling hooks are declared. sidebar.css consumes shared colors/font, --cr-space-4 for header/footer padding, and large-radius/small-shadow globals in floating mode.', 'The body scrollbar consumes input-border. A pressed ghost Button in the body uses evergreen and paper for its selection highlight.', 'Root width/max-width are controlled by props; body content and supplied header/footer components retain their own tokens.'],
  },
  {
    component: 'WorkspaceContent', componentTokens: [],
    globalTokens: names('layout-content-max layout-gutter'),
    notes: ['workspace-content.css uses the shared cap for Comfortable. Both widths use the shared gutter, reduced in narrow containers.'],
  },
  {
    component: 'WorkspaceLayout', componentTokens: [], globalTokens: [],
    notes: ['workspace-layout.css uses flex wrapping and a preferred 24rem basis for WorkspaceContent. Set a gap or height through the native style prop or a class.'],
  },
  {
    component: 'Conversation', componentTokens: [], globalTokens: globals(markdownGlobals, names('space-8 space-6 space-4 space-2 space-3 radius-lg')),
    notes: ['The user message card uses the shared subtle background, border, large radius, and spacing tokens. conversation.css also consumes shared text, muted, font, and radius tokens.', 'MarkdownRenderer renders Markdown messages (agent messages by default), so its code/link/table/checkbox/copy-action globals are included transitively. Conversation overrides the Markdown root font to inherit its own 13px style; code still uses the mono token.', 'The activity slot is supplied content, not an automatically instantiated AgentActivity. Its arbitrary child tokens are not included here. Pending-spin duration and role-specific type sizes remain literal CSS.'],
  },
  {
    component: 'Swimlane', componentTokens: swimlaneHooks,
    globalTokens: names('color-muted color-subtle color-border radius-lg color-canvas color-text font-sans color-info color-info-bg color-warning color-warning-bg color-success color-success-bg color-danger color-danger-bg radius-sm color-surface color-input-border radius-md').sort(),
    notes: ['swimlane.css declares two lane-scoped tone aliases; override the same element for a custom palette or use tone for the built-in mappings. Its instantiated Badge adds the shared small-radius/font/status palette.', 'Lane minimum heights, header/card gaps, count size, top-border width, and padding are literal CSS. Supplied cards/actions/empty content have independent component token contracts.'],
  },
  {
    component: 'NumberInput', componentTokens: [], globalTokens: globals(fieldGlobals, names('color-border color-subtle')),
    notes: ['No component-owned CSS variables are declared. NumberInput renders shared .cr-field/.cr-input/.cr-field-error/.cr-required classes; number-input.css adds stepper surface/border/motion/focus consumption.', 'Size presets share the Button minimum heights. On touch, each step button is 44px wide and follows the input height.', 'Hover redistributes the fixed rail height. Reduced motion disables transitions.'],
  },
  {
    component: 'Stat', componentTokens: statHooks,
    globalTokens: names('color-text font-sans space-2 color-muted space-1 space-3 space-4 color-info color-success color-warning color-danger color-border').sort(),
    runtimeVariables: [{ name: '--cr-stat-tone-color', description: 'Internal neutral/info/success/warning/danger color selected by the tone prop.', source: { file: systemFile('stat.css'), selector: ".cr-stat[data-tone='neutral']", detail: 'The neutral selector assigns --cr-color-text; additional data-tone=info/success/warning/danger selectors assign their matching shared semantic colors.' }, notes: ['Use tone, or the explicit public --cr-stat-value-color hook for a value-color override.'] }],
    notes: ['stat.css explicitly consumes four public styling hooks with fallbacks, so ancestor/Stat-root custom properties can flow into them without a local declaration. The value-color hook is checked before the internal tone-selected color.', 'The rendered Skeleton consumes --cr-color-border for its loading background and owns its literal pulse/reduced-motion behavior in styles.css. Stat’s prefix/suffix sizing and value typography beyond the size hook are literal CSS.'],
  },
  {
    component: 'StatGroup', componentTokens: [], globalTokens: gridGapGlobals, runtimeVariables: [...gridRuntime, ...gridItemRuntime],
    notes: ['StatGroup.tsx instantiates Grid and wraps children with GridItem. It has no stylesheet or independent token hooks; its default gap=6 consumes --cr-space-6 through Grid.tsx gapValue.', 'The relevant globals are Grid’s allowed shared gap steps. A child can be any React node, so Stat colors/fonts/hooks are not attributed to the group automatically.', 'Responsive columns, spans, and alignments are controlled by Grid/GridItem props. Configure the group’s inherited Grid props and explicit GridItem props rather than treating the internal variables as theme tokens.'],
  },
  {
    component: 'Timeline', componentTokens: sequenceHooks('Timeline'),
    globalTokens: names('space-3 space-4 space-6 color-border color-text font-sans color-primary radius-full color-surface color-on-primary color-muted color-focus color-success color-info color-warning color-danger').sort(),
    runtimeVariables: sequenceRuntime('Timeline'),
    notes: ['Timeline.tsx imports sequence.css and timeline.css. Four shared sequence hooks plus the date-width hook control marker/entry/connector geometry; Timeline’s local marker-size override makes space-4 effective instead of the shared space-8 default.', 'The shared hooks are assigned locally. Scope per-Timeline overrides to .cr-timeline or the compound .cr-sequence.cr-timeline root (or its inline style); assigning them only on :root does not override the local defaults.', 'Neutral markers use primary, optional tones select their corresponding semantic colors, and pending markers use muted. Solid markers consume on-primary; horizontal scroll focus consumes the shared focus color.', 'The 14px/13px/12px typography, 560px collapse threshold, title centering minimum, and pending 1s spin remain literal CSS. Supplied title/date/content nodes retain their own component token contracts.'],
  },
  {
    component: 'Steps', componentTokens: sequenceHooks('Steps'),
    globalTokens: names('space-3 space-4 space-6 space-8 color-border color-text font-sans color-primary radius-full color-surface color-on-primary color-muted color-focus color-success color-danger color-success-bg font-mono').sort(),
    runtimeVariables: sequenceRuntime('Steps'),
    notes: ['Steps.tsx imports sequence.css and steps.css. It uses the four shared sequence hooks without Timeline’s marker-size/date-column overrides; default markers use space-8.', 'The shared hooks are assigned locally. Scope per-Steps overrides to .cr-steps or the compound .cr-sequence.cr-steps root (or its inline style); assigning them only on :root does not override the local defaults.', 'Step status selects muted/success/primary/danger markers. Complete outline markers additionally consume success-bg, numbered markers consume font-mono, and solid markers consume on-primary. There is no Steps info/warning palette consumption.', 'Marker numbers, status border widths, typography, and horizontal item widths are literal CSS. Icons use currentColor, and supplied content has its own independent styling contract.'],
  },
];
