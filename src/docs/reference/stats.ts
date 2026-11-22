import type { ComponentReference } from './types';

export const statsReferences: ComponentReference[] = [
  {
    name: 'Stat', slug: 'stat',
    summary: 'A metric label and value with numeric formatting, supporting content, and a loading state.',
    importCode: "import { useState } from 'react';\nimport { Stat, Button } from '@chartreuse/ui';\nimport { ArrowUp } from 'lucide-react';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [reviewOpen, setReviewOpen] = useState(false);

<Stat label="Run duration" value={42.125} precision={2}
  suffix="s" description="The duration of this illustrative run." />

<Stat label="Example change" value={11.28} precision={2}
  suffix="%" icon={ArrowUp} tone="success"
  description="An increase of 11.28% in this static example." />

<Stat label="Items awaiting review" value={9} loading={false}
  action={<Button aria-expanded={reviewOpen} onClick={() => setReviewOpen(open => !open)}>Open review</Button>} />`,
    nativeElement: 'div containing one native dl/dt/dd label and value pair',
    nativeProps: 'Inherits native div attributes, events, style, className, and ref, except children and the RDFa prefix attribute. Native props/ref target the outer div; the description is associated with the native value through aria-describedby.',
    props: [
      { name: 'label', type: 'ReactNode', required: true, description: 'The visible term in the native description list. Name the metric being displayed.' },
      { name: 'value', type: 'number | string', required: true, description: 'Numbers are formatted without inferred units or scale. Strings are preformatted and remain unchanged. NaN and infinities display an accessible unavailable marker.' },
      { name: 'precision', type: 'number', defaultValue: 'preserve significant digits', description: 'Fixed fraction digits for a numeric value. Finite inputs floor and clamp to 0–20. Omitted or nonfinite precision preserves up to 21 significant digits rather than rounding to three fraction digits.' },
      { name: 'locale', type: 'string', defaultValue: "'en-US'", description: 'Explicit Intl.NumberFormat locale for deterministic default rendering. Malformed or unsupported locale requests fall back to en-US.' },
      { name: 'useGrouping', type: 'boolean', defaultValue: 'true', description: 'Whether Intl adds digit groups following the locale’s grouping pattern.' },
      { name: 'groupSeparator', type: 'string', defaultValue: 'locale separator', description: 'Overrides only the group parts of a numeric value. An empty string removes those separators; useGrouping=false disables the groups.' },
      { name: 'decimalSeparator', type: 'string', defaultValue: 'locale separator', description: 'Overrides only the decimal part separator of a numeric value. Does not affect signs, digits, precision, or magnitude.' },
      { name: 'formatter', type: '(value: number | string) => ReactNode', description: 'Custom rendered value, receiving the original finite number or string. Overrides built-in locale/precision/separator formatting and is not called while loading or for a nonfinite number.' },
      { name: 'prefix', type: 'ReactNode', description: 'Context before the formatted value. A currency sign is presentation only; it does not select currency formatting or conversion.' },
      { name: 'suffix', type: 'ReactNode', description: 'Context after the value, such as s, %, or / 100. A percent suffix does not multiply the value by 100.' },
      { name: 'icon', type: 'IconSource', description: 'Optional decorative Lucide icon, custom React SVG component, or SVG JSX element before the value.' },
      { name: 'tone', type: 'Tone', defaultValue: "'neutral'", description: 'Shared neutral/info/success/warning/danger value color. Express the meaning in label or description as well as color.' },
      { name: 'description', type: 'ReactNode', description: 'Supporting context below the value, associated through aria-describedby.' },
      { name: 'action', type: 'ReactNode', description: 'An optional action below the context. The consumer supplies its label, behavior, and disabled state.' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Replaces the value, prefix, suffix, and icon with a shared Skeleton and loading text. The native description list is marked aria-busy.' },
      { name: 'loadingLabel', type: 'string', defaultValue: "'Loading value'", description: 'Accessible loading text used while the visible numeric content is replaced.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer div.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the outer div.' },
    ],
    notes: [
      'Use a specific label and give units explicitly. Prefixes and suffixes never infer currency, percentages, compact notation, or a change of scale.',
      'Default numeric formatting preserves significant digits, including small fractions. Set precision when fixed-decimal rounding is required. Supply a string for an already formatted value or an exact identifier.',
      'Number values already follow JavaScript’s numeric precision. Use a preformatted string or a custom formatter when the source requires decimal or large-integer precision beyond Number.',
      'A custom formatter receives the raw value and owns its accessible content. Keep formatters deterministic when rendering on the server and client.',
      'Loading does not render stale digits or call the formatter. Shared Skeleton animation respects reduced motion. This component does not fetch data or announce every numeric update automatically.',
      'Compose Stat inside Card to add a card surface. The statistic itself adds no card padding or border; the surrounding component owns that composition.',
      'Public styling hooks are --cr-stat-label-color, --cr-stat-value-color, --cr-stat-value-size, and --cr-stat-description-color. They fall back to shared semantic colors and a 2rem value. --cr-stat-tone-color is an internal state variable.',
    ],
  },
  {
    name: 'StatGroup', slug: 'stat-group',
    summary: 'Related statistics arranged using Grid columns, spacing-token gaps, and optional GridItem spans.',
    importCode: "import { StatGroup, Stat, Card, GridItem } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<>\n<StatGroup aria-label="Workspace sample totals">\n  <Stat label="Workspaces" value={8} />\n  <Stat label="Active agents" value={12} />\n  <Stat label="Queued tasks" value={24} />\n</StatGroup>\n\n<StatGroup columns={{ base: 1, sm: 2, md: 4 }} gap={6}\n  aria-label="Task summary">\n  <GridItem span={{ base: 'full', md: 2 }}>\n    <Card><Stat label="Completed" value={96} /></Card>\n  </GridItem>\n  <Card><Stat label="In review" value={12} /></Card>\n  <Card><Stat label="Queued" value={24} /></Card>\n</StatGroup>\n</>`,
    nativeElement: 'div group and shared Grid container; ordinary children receive a shared GridItem wrapper',
    nativeProps: 'Inherits GridProps and native outer-div attributes, events, style, className, and ref. Native props/ref target the Grid query container. The default role is group; give it an aria-label or aria-labelledby when the collection benefits from a name.',
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Each ordinary direct child occupies one track through GridItem span=1. Direct GridItem children retain their own responsive span/rowSpan/alignment props.' },
      { name: 'columns', type: 'GridResponsive<number>', defaultValue: '{ base: 1, sm: 2, md: 3 }', description: 'Track count passed to Grid. A scalar stays constant; responsive values use the group’s own container width, normalize to 1–24, and inherit upward.' },
      { name: 'gap', type: 'GridResponsive<GridGap>', defaultValue: '6', description: 'Shared spacing-token step passed to Grid. Default space-6 is 24px at the standard root size.' },
      { name: 'rowGap', type: 'GridResponsive<GridGap>', defaultValue: 'gap', description: 'Independent Grid row-gap recipe. When supplied, the whole row-axis recipe replaces gap; omitted tiers inherit its previous value.' },
      { name: 'columnGap', type: 'GridResponsive<GridGap>', defaultValue: 'gap', description: 'Independent Grid column-gap recipe, with the same upward inheritance contract as Grid.' },
      { name: 'align', type: 'GridResponsive<GridAlignment>', defaultValue: "'stretch'", description: 'Grid block-axis alignment: start, center, end, stretch, or baseline.' },
      { name: 'justify', type: 'GridResponsive<GridJustification>', defaultValue: "'stretch'", description: 'Grid inline-axis alignment: start, center, end, or stretch.' },
      { name: 'role', type: 'AriaRole', defaultValue: "'group'", description: 'Native role on the outer Grid container. It is a collection, not an interactive ARIA grid.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer Grid container.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the outer Grid query container.' },
    ],
    notes: [
      'StatGroup delegates layout to Grid and GridItem, including their container-width and breakpoint rules.',
      'Container tiers are base 0px, sm 480px, md 768px, lg 1024px, and xl 1280px. The default group uses one, two, then three columns; smaller panels can stack independently of the page viewport.',
      'Each direct Stat or Card becomes one GridItem span=1. Use a direct GridItem when an individual item needs a different span. Fragments and custom wrappers are one child cell; use an array for separate cells.',
      'Use the same gap steps as Grid: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, or 16. These select four-pixel spacing tokens rather than raw pixels.',
      'Native DOM reading order is preserved. The group does not inspect values, aggregate totals, infer status, fetch data, or add keyboard navigation.',
      'Cards own their padding and can use height: 100% for equal-height surfaces. The group’s item alignment controls wrappers, as it does in Grid.',
      'StatGroup has no extra component styling variables. Use the documented Grid props for layout and Stat’s public hooks for value styling; Grid’s generated recipe variables remain internal.',
    ],
  },
];
