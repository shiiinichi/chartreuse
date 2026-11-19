import type { ComponentReference } from './types';

export const coreReferences: ComponentReference[] = [
  {
    name: 'Button',
    slug: 'button',
    summary: 'A native button with visual variants, size presets, optional icons, and a loading state.',
    importCode: "import { useState } from 'react';\nimport { Plus } from 'lucide-react';\nimport { Button } from '@chartreuse/ui';",
    usageCode: `export function ButtonExample() {
  const [count, setCount] = useState(0);
  return <Button icon={Plus} onClick={() => setCount(count + 1)}>
    Add a task ({count})
  </Button>;
}`,
    nativeElement: 'button',
    nativeProps: "Extends ComponentPropsWithRef<'button'>. Native attributes, events, form association, and ref are forwarded to the button; className is merged with the component class.",
    props: [
      { name: 'children', type: 'ReactNode', description: 'The visible button label or content.' },
      { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'", defaultValue: "'primary'", description: 'The action’s visual emphasis.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'The button’s control size.' },
      { name: 'icon', type: 'IconSource', description: 'A leading Lucide icon, custom React SVG component, or inline SVG JSX element. Loading replaces it with a spinner.' },
      { name: 'iconRight', type: 'IconSource', description: 'A trailing Lucide icon, custom SVG component, or inline SVG JSX element.' },
      { name: 'loading', type: 'boolean', description: 'Shows a spinner, sets aria-busy, and disables interaction while true.' },
      { name: 'disabled', type: 'boolean', description: 'Disables the native button. Loading also disables it.' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", description: 'The native button behavior; use submit for a form’s primary submission action.' },
      { name: 'onClick', type: '(event: MouseEvent<HTMLButtonElement>) => void', description: 'Handles the native click event when enabled.' },
    ],
    notes: [
      'Provide a visible label that names the action. Use IconButton when the action has only an icon. Custom icons receive control sizing and decorative SVG attributes.', 'Native form attributes such as form and name are supported.'],
  },
  {
    name: 'IconButton',
    slug: 'icon-button',
    summary: 'A compact button with a required icon and accessible action label.',
    importCode: "import { useState } from 'react';\nimport { Bookmark } from 'lucide-react';\nimport { IconButton } from '@chartreuse/ui';",
    usageCode: `export function IconButtonExample() {
  const [saved, setSaved] = useState(false);
  return <IconButton icon={Bookmark} label={saved ? 'Remove bookmark' : 'Bookmark task'}
    aria-pressed={saved} onClick={() => setSaved(!saved)} />;
}`,
    nativeElement: 'button',
    nativeProps: "Inherits ButtonProps except children and icon. Native button attributes, events, and ref are forwarded. label supplies aria-label and the default title; an explicit title overrides that fallback.",
    props: [
      { name: 'icon', type: 'IconSource', required: true, description: 'A Lucide icon, custom React SVG component, or inline SVG JSX element for the action.' },
      { name: 'label', type: 'string', required: true, description: 'The accessible action name and fallback native title.' },
      { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'", defaultValue: "'ghost'", description: 'The action’s visual emphasis.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'The inherited Button size.' },
      { name: 'loading', type: 'boolean', description: 'Forwards Button’s loading indicator and disabled behavior.' },
      { name: 'disabled', type: 'boolean', description: 'Disables interaction.' },
      { name: 'iconRight', type: 'IconSource', description: 'An optional trailing IconSource inherited from Button.' },
      { name: 'onClick', type: '(event: MouseEvent<HTMLButtonElement>) => void', description: 'Handles the action’s native click event.' },
    ],
    notes: [
      'Use aria-pressed for a toggle action; a changing label can describe its next action.', 'children is intentionally not part of this API. Custom icons remain decorative; label supplies the accessible action name.', 'Tooltip can add a hover and keyboard-focus explanation. An empty native title suppresses the browser title while the accessible action label remains.'],
  },
  {
    name: 'BrandMark',
    slug: 'brand-mark',
    summary: 'The Chartreuse mark as an SVG that follows the current text color.',
    importCode: "import { BrandMark } from '@chartreuse/ui';",
    usageCode: `<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <BrandMark style={{ inlineSize: 40, blockSize: 40 }} />
  <span>Chartreuse</span>
</div>`,
    nativeElement: 'svg',
    nativeProps: "Accepts ComponentPropsWithRef<'svg'>. Native SVG attributes and ref are forwarded; className is merged. The fixed mark path remains the SVG’s content.",
    props: [
      { name: 'className', type: 'string', description: 'Additional classes on the SVG.' },
      { name: 'style', type: 'CSSProperties', description: 'Custom color or dimensions. CSS inlineSize/blockSize can override the default 32px size.' },
      { name: 'aria-hidden', type: "boolean | 'true' | 'false'", defaultValue: 'true', description: 'Treats the mark as decoration by default. Native SVG accessibility attributes can override it.' },
      { name: 'viewBox', type: 'string', defaultValue: "'0 0 40 40'", description: 'The SVG coordinate system. The mark path uses a 40×40 space.' },
    ],
    notes: ['Place a visible brand name beside a decorative mark. If the SVG conveys the name by itself, explicitly expose and label it.', 'The path uses currentColor; set color to change its fill.'],
  },
  {
    name: 'Badge',
    slug: 'badge',
    summary: 'A small label for status, category, or supporting metadata.',
    importCode: "import { Check } from 'lucide-react';\nimport { Badge } from '@chartreuse/ui';",
    usageCode: `<>
  <Badge tone="success" icon={Check}>Done</Badge>
  <Badge variant="ghost" tone="info" dot>Running</Badge>
</>`,
    nativeElement: 'span',
    nativeProps: 'Extends HTMLAttributes<HTMLSpanElement>; native span attributes and events are forwarded. This interface does not declare a ref prop.',
    props: [
      { name: 'children', type: 'ReactNode', description: 'The visible label.' },
      { name: 'tone', type: "'neutral' | 'success' | 'info' | 'warning' | 'danger'", defaultValue: "'neutral'", description: 'The label’s semantic color treatment.' },
      { name: 'variant', type: "'soft' | 'ghost'", defaultValue: "'soft'", description: 'Soft uses a tinted surface. Ghost uses a transparent surface.' },
      { name: 'dot', type: 'boolean', description: 'Adds a small decorative status dot when no icon is supplied.' },
      { name: 'icon', type: 'IconSource', description: 'A leading Lucide icon, custom SVG component, or SVG JSX element; takes precedence over dot.' },
    ],
    notes: [
      'Use text alongside color to express status. Badge itself is not an interactive control.'],
  },
  {
    name: 'TextField',
    slug: 'text-field',
    summary: 'A labeled native input with size presets and optional hint, error, and leading icon.',
    importCode: "import { Search } from 'lucide-react';\nimport { TextField } from '@chartreuse/ui';",
    usageCode: `<TextField label="Find a task" name="query" type="search" icon={Search}
  placeholder="Search workspace tasks" />`,
    nativeElement: 'input',
    nativeProps: "Extends ComponentPropsWithRef<'input'> except the native size attribute. Native values, constraints, events, style, and ref target the input; className targets the field wrapper. Caller aria-describedby IDs merge with the generated hint or error ID.",
    props: [
      { name: 'label', type: 'string', required: true, description: 'The visible label associated with the input.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'The control size. Use the same size on a Button to match the input height.' },
      { name: 'hint', type: 'string', description: 'Supporting text beneath the input control, linked with aria-describedby; hidden while an error is present.' },
      { name: 'error', type: 'string', description: 'An error message linked to the input; also sets aria-invalid.' },
      { name: 'icon', type: 'IconSource', description: 'A decorative leading IconSource: Lucide icon, custom SVG component, or inline SVG JSX element.' },
      { name: 'id', type: 'string', defaultValue: 'Generated with useId()', description: 'The native input ID, also used for the label association and generated description IDs.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer field wrapper.' },
      { name: 'onChange', type: '(event: ChangeEvent<HTMLInputElement>) => void', description: 'The native input change callback. Use event.currentTarget.value for the text.' },
    ],
    notes: [
      "Use Grid and GridItem for peer fields in either direction: columns={1} gap={4} for a vertical stack, or columns={{ base: 1, sm: 2 }} gap={4} for a responsive row. Put each whole labeled control in GridItem span={1}.",
      'Controlled value and uncontrolled defaultValue follow React’s native input API.', 'Use native required, type, minLength, pattern, and autoComplete where appropriate. Native constraints and application logic own validation; error displays application-supplied feedback.'],
  },
  {
    name: 'TextArea',
    slug: 'text-area',
    summary: 'A labeled multiline native field with hint and error descriptions.',
    importCode: "import { TextArea } from '@chartreuse/ui';",
    usageCode: `<TextArea label="Description" name="description" rows={4}
  placeholder="Describe the task requirements" hint="Include the expected result and implementation constraints." />`,
    nativeElement: 'textarea',
    nativeProps: "Extends ComponentPropsWithRef<'textarea'>. Native values, rows, constraints, events, style, and ref target the textarea; className targets the field wrapper. Caller aria-describedby IDs merge with the generated hint or error ID.",
    props: [
      { name: 'label', type: 'string', required: true, description: 'The visible label associated with the textarea.' },
      { name: 'hint', type: 'string', description: 'Supporting text beneath the input control, linked with aria-describedby; hidden while an error is present.' },
      { name: 'error', type: 'string', description: 'An error description; sets aria-invalid while present.' },
      { name: 'id', type: 'string', defaultValue: 'Generated with useId()', description: 'The native textarea ID, also used for the label association and generated description IDs.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer field wrapper.' },
      { name: 'onChange', type: '(event: ChangeEvent<HTMLTextAreaElement>) => void', description: 'The native change callback. Read event.currentTarget.value.' },
    ],
    notes: [
      "Use Grid and GridItem for peer fields in either direction: columns={1} gap={4} for a vertical stack, or columns={{ base: 1, sm: 2 }} gap={4} for a responsive row. Put each whole labeled control in GridItem span={1}.",
      'The textarea can be resized vertically. Native value/defaultValue and required behavior are preserved.'],
  },
  {
    name: 'Select',
    slug: 'select',
    summary: 'A labeled native select with a decorative arrow, optional hint, and error feedback.',
    importCode: "import { Select } from '@chartreuse/ui';",
    usageCode: `<Select label="Priority" name="priority" defaultValue="medium">
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</Select>`,
    nativeElement: 'select',
    nativeProps: "Extends ComponentPropsWithRef<'select'> with visual size presets. Native values, multiple, numeric size, required, option children, events, style, and ref target the select. className targets the field wrapper. Caller aria-describedby IDs merge with the generated hint or error ID.",
    props: [
      { name: 'label', type: 'string', required: true, description: 'The associated label, visible unless hideLabel is enabled.' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | number", defaultValue: "'md'", description: 'Dropdowns match the height of a Button of the same size. Numeric values set the native row count for a listbox.' },
      { name: 'children', type: 'ReactNode', description: 'Native option and optgroup elements.' },
      { name: 'hint', type: 'string', description: 'Supporting text beneath the select, linked with aria-describedby; hidden while an error is present.' },
      { name: 'error', type: 'string', description: 'An error description that also sets aria-invalid.' },
      { name: 'hideLabel', type: 'boolean', defaultValue: 'false', description: 'Visually hides the label while preserving its accessible association.' },
      { name: 'id', type: 'string', defaultValue: 'Generated with useId()', description: 'The native select ID, also used for the label association and generated description IDs.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer field wrapper.' },
      { name: 'onChange', type: '(event: ChangeEvent<HTMLSelectElement>) => void', description: 'The native selection callback. Read currentTarget.value or selectedOptions.' },
    ],
    notes: [
      "Use Grid and GridItem for peer fields in either direction: columns={1} gap={4} for a vertical stack, or columns={{ base: 1, sm: 2 }} gap={4} for a responsive row. Put each whole labeled control in GridItem span={1}.",
      'Options use native browser UI. When using hideLabel, retain visible context that identifies the field’s purpose.'],
  },
  {
    name: 'Checkbox',
    slug: 'checkbox',
    summary: 'A native checkbox with an associated text label and optional hint.',
    importCode: "import { Checkbox } from '@chartreuse/ui';",
    usageCode: `<Checkbox name="worktree" label="Create a worktree"
  hint="Use a separate Git worktree for this task." defaultChecked />`,
    nativeElement: 'input[type="checkbox"]',
    nativeProps: "Extends ComponentPropsWithRef<'input'> except type, which is fixed to checkbox. Native checked/defaultChecked, name, disabled, events, and ref are forwarded. The component derives aria-describedby from hint; className styles the wrapping label.",
    props: [
      { name: 'label', type: 'string', required: true, description: 'The visible, clickable label associated with the checkbox.' },
      { name: 'hint', type: 'string', description: 'Optional supporting text linked with aria-describedby.' },
      { name: 'checked', type: 'boolean', description: 'Controls the checked state; pair with onChange.' },
      { name: 'defaultChecked', type: 'boolean', description: 'The initial checked state for uncontrolled usage.' },
      { name: 'onChange', type: '(event: ChangeEvent<HTMLInputElement>) => void', description: 'The native change callback. Read event.currentTarget.checked.' },
      { name: 'id', type: 'string', defaultValue: 'Generated with useId()', description: 'A custom checkbox ID used by its label.' },
      { name: 'className', type: 'string', description: 'Additional classes on the wrapping label.' },
    ],
    notes: [
      "Place related choices inside a Fieldset and arrange each whole control in a GridItem span={1}. Use Grid columns={1} gap={4} for a vertical group, or columns={{ base: 1, sm: 2 }} gap={4} for a responsive row; retain each native label and form value.",
      'Space toggles the focused native checkbox. This component does not expose an indeterminate prop.'],
  },
  {
    name: 'Switch',
    slug: 'switch',
    summary: 'A switch-style native checkbox for a setting with on and off states.',
    importCode: "import { useState } from 'react';\nimport { Switch } from '@chartreuse/ui';",
    usageCode: `export function SwitchExample() {
  const [live, setLive] = useState(true);
  return <Switch label="Live updates" checked={live}
    onChange={event => setLive(event.currentTarget.checked)} />;
}`,
    nativeElement: 'input[type="checkbox"][role="switch"]',
    nativeProps: 'Uses CheckboxProps. Native input attributes and ref are forwarded, with type fixed to checkbox and role fixed to switch. The component derives aria-describedby from hint; className styles the wrapping label.',
    props: [
      { name: 'label', type: 'string', required: true, description: 'The setting’s visible label.' },
      { name: 'hint', type: 'string', description: 'Optional supporting text linked to the control.' },
      { name: 'checked', type: 'boolean', description: 'The controlled on/off state.' },
      { name: 'defaultChecked', type: 'boolean', description: 'The initial state when uncontrolled.' },
      { name: 'onChange', type: '(event: ChangeEvent<HTMLInputElement>) => void', description: 'The native state-change callback. Read currentTarget.checked.' },
      { name: 'id', type: 'string', defaultValue: 'Generated with useId()', description: 'A custom input ID associated with its label.' },
      { name: 'className', type: 'string', description: 'Additional classes on the wrapping label.' },
    ],
    notes: [
      "Place related choices inside a Fieldset and arrange each whole control in a GridItem span={1}. Use Grid columns={1} gap={4} for a vertical group, or columns={{ base: 1, sm: 2 }} gap={4} for a responsive row; retain each native label and form value.",
      'The visual track is decorative; the native input provides state, keyboard behavior, and accessibility.'],
  },
  {
    name: 'Avatar',
    slug: 'avatar',
    summary: 'A circular initials avatar with an accessible name and optional visible name text.',
    importCode: "import { Avatar } from '@chartreuse/ui';",
    usageCode: `<Avatar name="Alex Morgan" showName />`,
    nativeElement: 'span[role="img"], or a span containing a decorative avatar and visible name',
    nativeProps: 'Extends HTMLAttributes<HTMLSpanElement>; no ref prop is declared. In standalone mode, extra attributes target the avatar span and role, aria-label, and title come from the implementation. With showName, native attributes, className, and style target the outer person wrapper; its glyph is decorative and the visible name provides identification.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Supplies the initials and identification: an accessible image name/hover title in standalone mode, or visible text with showName.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'The avatar size: 26px, 32px, or 44px.' },
      { name: 'color', type: "'green' | 'peach' | 'blue' | 'purple'", defaultValue: "'green'", description: 'The initials surface and text palette.' },
      { name: 'showName', type: 'boolean', defaultValue: 'false', description: 'Displays the full name beside a decorative initials glyph, using a built-in aligned wrapper.' },
      { name: 'className', type: 'string', description: 'Additional classes on the standalone avatar span, or on the outer wrapper when showName is enabled.' },
    ],
    notes: [
      'Initials use the first characters of the first two nonempty space-separated name parts.', 'Use showName to render the initials and full name together. The initials glyph is hidden from assistive technology; the visible name identifies the person.', 'Named avatars keep the same glyph size/color props. The visible name inherits its context color and wraps within the available width.', 'Use a meaningful name; the component does not load remote profile images.'],
  },
  {
    name: 'AvatarGroup',
    slug: 'avatar-group',
    summary: 'A compact, overlapping row of initials avatars with an overflow count.',
    importCode: "import { AvatarGroup } from '@chartreuse/ui';",
    usageCode: `<AvatarGroup names={['Alex Morgan', 'Sam Lee', 'Jamie Park', 'Taylor Reed']}
  max={3} />`,
    nativeElement: 'span',
    nativeProps: 'Only the listed props are accepted. Additional native attributes, className, and ref are not part of this component’s API.',
    props: [
      { name: 'names', type: 'string[]', required: true, description: 'Names for the avatars, in display order.' },
      { name: 'max', type: 'number', defaultValue: '3', description: 'How many names are shown before a +N overflow avatar. Use a nonnegative integer.' },
    ],
    notes: ['Displayed avatars use the small size and cycle through the built-in color palette.', 'Each avatar retains its accessible name, and the overflow indicator announces how many people remain.'],
  },
  {
    name: 'Progress',
    slug: 'progress',
    summary: 'A thin native progress indicator with optional visible label, formatted value, and supporting text.',
    importCode: "import { Progress } from '@chartreuse/ui';",
    usageCode: `<Progress value={3} max={5} label="3 of 5 tasks complete" />

<Progress
  value={31797}
  max={828400}
  label="Last reported context"
  showLabel
  valueText="31,797 / 828,400 tokens"
  aria-valuetext="31,797 of 828,400 tokens"
  description="4% of the reported model window. Context is separate from accumulated token usage."
/>`,
    nativeElement: 'progress',
    nativeProps: "Extends ComponentPropsWithRef<'progress'> with numeric value/max. Native attributes, events, children, and ref are forwarded to the progress element. className, style, and id remain on the native bar when optional text adds a visual wrapper.",
    props: [
      { name: 'value', type: 'number', required: true, description: 'The current amount of progress.' },
      { name: 'label', type: 'string', required: true, description: 'Accessible name of the native bar. Label text is rendered only when showLabel is enabled.' },
      { name: 'max', type: 'number', defaultValue: '100', description: 'The total amount represented by a complete bar.' },
      { name: 'showLabel', type: 'boolean', defaultValue: 'false', description: 'Displays label above the bar using a native associated label element.' },
      { name: 'valueText', type: 'string', description: 'Caller-formatted value and units at the trailing edge. Also supplies aria-valuetext unless explicitly overridden.' },
      { name: 'description', type: 'ReactNode', description: 'Supporting text below the bar, linked through aria-describedby.' },
      { name: 'className', type: 'string', description: 'Additional classes on the progress element.' },
      { name: 'id', type: 'string', description: 'Native bar ID; a unique ID is generated when omitted.' },
      { name: 'ref', type: 'Ref<HTMLProgressElement>', description: 'Native ref to the progress element, including when text is shown.' },
      { name: 'aria-valuetext', type: 'string', defaultValue: 'valueText when provided', description: 'Optional accessible value wording, such as an expanded version of the displayed units.' },
      { name: 'aria-describedby', type: 'string', description: 'Additional description IDs, merged with the generated supporting-text ID.' },
    ],
    notes: ['Without optional text, Progress renders a 4px bar with an accessible label.', 'The value and maximum follow native progress semantics. This typed API requires a numeric value.', 'The caller owns value formatting, percentages, units, and supporting copy. The component does not infer whether a number is context, accumulated usage, files, or tasks.', 'showLabel displays the accessible label; valueText can be shown independently. Label and value text wrap within the available width.', 'A displayed valueText is also the default aria-valuetext. Override it when the displayed abbreviation needs an expanded spoken form.', 'Supporting text is linked to the native bar and merges with caller-provided aria-describedby IDs.', 'Native props and ref target the progress element; a text wrapper appears only when one of the optional text slots is used.'],
  },
  {
    name: 'Tabs',
    slug: 'tabs',
    summary: 'A labeled tab list and its content panels, with controlled or internal selection.',
    importCode: "import { Activity, LayoutDashboard } from 'lucide-react';\nimport { Tabs } from '@chartreuse/ui';",
    usageCode: `<Tabs label="Workspace views" items={[
  { value: 'board', label: 'Board', icon: LayoutDashboard, count: 4,
    content: <p>Tasks grouped by status.</p> },
  { value: 'activity', label: 'Activity', icon: Activity,
    content: <p>Recent task and agent updates.</p> },
]} />`,
    nativeElement: 'div',
    nativeProps: 'Only TabsProps are accepted. Native root attributes and ref are not forwarded; tab and panel IDs are generated internally.',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, description: 'Tabs to render. Each item requires value, label, and content; icon and count are optional.' },
      { name: 'items[].value', type: 'string', required: true, description: 'A unique key used by controlled/default selection and generated tab IDs.' },
      { name: 'items[].label', type: 'string', required: true, description: 'The visible tab label.' },
      { name: 'items[].content', type: 'ReactNode', required: true, description: 'The corresponding panel content.' },
      { name: 'items[].icon', type: 'IconSource', description: 'An optional IconSource before the tab label, including custom SVG components or SVG JSX.' },
      { name: 'items[].count', type: 'number', description: 'An optional small count beside the label.' },
      { name: 'label', type: 'string', required: true, description: 'The tab list’s accessible name.' },
      { name: 'defaultValue', type: 'string', defaultValue: 'First item’s value', description: 'The initial selected key for uncontrolled usage.' },
      { name: 'value', type: 'string', description: 'The controlled selected key. Pair with onValueChange.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when a tab is selected by click or keyboard.' },
      { name: 'variant', type: "'line' | 'pill'", defaultValue: "'line'", description: 'The tab list’s visual treatment.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Each tab button uses the same minimum height as a Button of the corresponding size.' },
      { name: 'className', type: 'string', description: 'Additional classes on the root div.' },
    ],
    notes: ['Arrow keys, Home, and End move focus and selection. Horizontal direction respects RTL.', 'Inactive panels remain mounted and are hidden with the native hidden attribute.', 'Use tabs for views within a page; use links for page navigation.'],
  },
  {
    name: 'Card',
    slug: 'card',
    summary: 'An article surface with a border, radius, and shadow for composed content.',
    importCode: "import { Card } from '@chartreuse/ui';",
    usageCode: `<Card style={{ padding: 24 }}>
  <h3>Workspace configuration</h3>
  <p>Review repository settings and task defaults.</p>
</Card>`,
    nativeElement: 'article',
    nativeProps: 'Accepts HTMLAttributes<HTMLElement> and forwards them to article. className is merged; this type does not declare a ref prop.',
    props: [
      { name: 'children', type: 'ReactNode', description: 'The card content.' },
      { name: 'className', type: 'string', description: 'Additional classes on the article surface.' },
    ],
    notes: [
      'Card adds a surface, border, radius, and shadow. It does not add padding or a button interaction.', 'Use native buttons and links inside the card for actions and navigation.'],
  },
  {
    name: 'Alert',
    slug: 'alert',
    summary: 'An inline notice with a semantic tone, heading, optional details, and dismissal action.',
    importCode: "import { useState } from 'react';\nimport { Alert } from '@chartreuse/ui';",
    usageCode: `export function AlertExample() {
  const [visible, setVisible] = useState(true);
  return visible ? <Alert tone="success" title="All changes saved"
    onDismiss={() => setVisible(false)}>Your workspace is up to date.</Alert> : null;
}`,
    nativeElement: 'div',
    nativeProps: 'Extends HTMLAttributes<HTMLDivElement>. Native attributes such as role and aria-live are forwarded; no ref prop is declared.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'The notice heading.' },
      { name: 'children', type: 'ReactNode', description: 'Optional supporting content displayed in a paragraph.' },
      { name: 'tone', type: "'neutral' | 'success' | 'info' | 'warning' | 'danger'", defaultValue: "'info'", description: 'The icon, text color, and surface treatment.' },
      { name: 'onDismiss', type: '() => void', description: 'Adds a dismiss button and handles its activation. The parent controls whether the Alert remains rendered.' },
      { name: 'className', type: 'string', description: 'Additional classes on the alert div.' },
    ],
    notes: [
      'Alert does not assign a live-region role by default. Use role="status" or role="alert" when the timing of a dynamic notice calls for it.'],
  },
  {
    name: 'Divider',
    slug: 'divider',
    summary: 'A native horizontal rule separating groups of content.',
    importCode: "import { Divider } from '@chartreuse/ui';",
    usageCode: `<section>
  <p>Current configuration.</p>
  <Divider />
  <p>Next action.</p>
</section>`,
    nativeElement: 'hr',
    nativeProps: "Accepts ComponentPropsWithRef<'hr'>. Native attributes and ref are forwarded to the horizontal rule.",
    props: [
      { name: 'className', type: 'string', description: 'Additional classes on the horizontal rule.' },
    ],
    notes: ['Divider has no required or additional custom props. Use spacing when a visible separator is unnecessary.'],
  },
  {
    name: 'Skeleton',
    slug: 'skeleton',
    summary: 'A decorative placeholder bar for a loading layout.',
    importCode: "import { Skeleton } from '@chartreuse/ui';",
    usageCode: `<div aria-busy="true" aria-label="Loading task details">
  <Skeleton style={{ inlineSize: '60%', marginBlockEnd: 12 }} />
  <Skeleton />
</div>`,
    nativeElement: 'span',
    nativeProps: 'Accepts HTMLAttributes<HTMLSpanElement>. Native attributes are forwarded, but aria-hidden is always set to true. No ref prop is declared.',
    props: [
      { name: 'className', type: 'string', description: 'Additional classes for the placeholder shape.' },
      { name: 'style', type: 'CSSProperties', description: 'Native inline styling for a custom width, height, or spacing.' },
    ],
    notes: ['The default bar is 12px tall and full width. Supply CSS for other shapes.', 'Place loading context on the containing region; the decorative bar is hidden from assistive technology.', 'The pulse animation respects reduced-motion preference.'],
  },
  {
    name: 'Spinner',
    slug: 'spinner',
    summary: 'A loading icon in a status region with visually hidden text.',
    importCode: "import { Spinner } from '@chartreuse/ui';",
    usageCode: `<Spinner label="Loading workspace" size={20} />`,
    nativeElement: 'span[role="status"]',
    nativeProps: 'Only the listed props are accepted. Additional native attributes and ref are not forwarded.',
    props: [
      { name: 'label', type: 'string', defaultValue: "'Loading'", description: 'The visually hidden text announced by the status region.' },
      { name: 'size', type: 'number', defaultValue: '18', description: 'The icon’s width and height in CSS pixels.' },
      { name: 'className', type: 'string', description: 'Additional classes on the status span.' },
    ],
    notes: ['Use a specific label when it helps explain what is loading. The rotation stops when reduced motion is requested.'],
  },
  {
    name: 'Dialog',
    slug: 'dialog',
    summary: 'A controlled native modal dialog with a header, scrolling body, optional footer, and optional second pane.',
    importCode: "import { useState } from 'react';\nimport { Button, Dialog, TextField } from '@chartreuse/ui';",
    usageCode: `export function DialogExample() {
  const [open, setOpen] = useState(false);
  return <>
    <Button onClick={() => setOpen(true)}>Open dialog</Button>
    <Dialog open={open} onOpenChange={setOpen} title="Task details"
      footer={<Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>}>
      <TextField label="Task name" autoFocus />
    </Dialog>
  </>;
}`,
    nativeElement: 'dialog',
    nativeProps: 'Only DialogProps are accepted. The native dialog ref, opening method, accessible IDs, and close event are managed internally; arbitrary native dialog props are not forwarded.',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Whether the native modal should be open.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Called with false after native dismissal or the close button. Update the controlled open state.' },
      { name: 'title', type: 'string', required: true, description: 'The visible heading and accessible dialog name.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'The main body content.' },
      { name: 'description', type: 'string', description: 'Optional supporting text associated with the dialog.' },
      { name: 'footer', type: 'ReactNode', description: 'Shared actions below the body. The footer spans both panes in a split dialog.' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Maximum-width preset: 420px, 520px, 760px, or 1600px; still bounded by the viewport.' },
      { name: 'maxWidth', type: 'number', description: 'A positive finite maximum width in CSS pixels, overriding the size preset.' },
      { name: 'freezeHeight', type: 'boolean', defaultValue: 'false', description: 'Preserves the modal’s opening height for the current open session. Content scrolls inside; viewport limits still apply.' },
      { name: 'sideContent', type: 'ReactNode', description: 'Adds a second body pane. Both panes remain above the shared footer.' },
      { name: 'contentLabel', type: 'string', defaultValue: "'Details'", description: 'Names the main pane and its compact-view button.' },
      { name: 'sideContentLabel', type: 'string', defaultValue: "'Related content'", description: 'Names the second pane, its compact-view button, and resize control.' },
      { name: 'resizableSplit', type: 'boolean', defaultValue: 'false', description: 'Enables pointer and keyboard resizing of the split divider on wide layouts.' },
      { name: 'sideContentMinWidth', type: 'number', defaultValue: '260', description: 'The preferred minimum side-pane width in CSS pixels, bounded by the available body width.' },
      { name: 'sideContentMaxWidth', type: 'number', defaultValue: '640', description: 'The maximum side-pane width in CSS pixels. Also applies when resizing is off.' },
      { name: 'className', type: 'string', description: 'Additional classes on the native dialog.' },
    ],
    notes: ['Choose small (420px), medium (520px), large (760px), or extra large (1600px maximum) to suit the content. Each size fits the available viewport.', 'Native showModal keeps focus inside, handles Escape, and returns focus to the opener. Use autoFocus on the first form field or the least destructive action in a destructive confirmation.', 'Long content scrolls inside the body while the heading, close button, and footer stay visible. The footer has 24px padding on every side.', 'Optional sideContent splits only the body; the shared footer stays full width. Below 700px of modal content width, the panes become a content switcher and the divider is hidden.', 'Height follows content by default. Enable freezeHeight when content changes should preserve the opening height.', 'For an optional resizable split, Arrow keys change the side width by 16px, Shift+Arrow by 48px, and Home/End use the current bounds. Horizontal direction respects RTL.', 'The main pane keeps roughly 280px of room on wide layouts; configured pane bounds are clamped to fit.'],
  },
  {
    name: 'ToastProvider',
    slug: 'toast-provider',
    summary: 'Provides the notification hook and a single dismissible toast region.',
    importCode: "import { Button, ToastProvider, useToast } from '@chartreuse/ui';",
    usageCode: `function NotificationButton() {
  const notify = useToast();
  return <Button onClick={() => notify('Workspace settings saved.', 'success')}>
    Show notification
  </Button>;
}

export function ToastExample() {
  return <ToastProvider><NotificationButton /></ToastProvider>;
}`,
    nativeProps: 'Only the children prop is accepted. The provider manages its notification region internally and does not forward native DOM props or ref.',
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'The component tree whose descendants can call useToast().' },
    ],
    notes: ["useToast() returns notify(message: string, tone?: Tone). Tone can be neutral, success, info, warning, or danger and defaults to success.", 'Calling useToast outside the provider throws an error.', 'The latest toast replaces the previous one, dismisses after 5000ms, and can be closed with its dismiss button. Duration and position are not configurable props.', 'Notifications use a persistent status region with polite announcement behavior.'],
  },
  {
    name: 'Breadcrumbs',
    slug: 'breadcrumbs',
    summary: 'A native breadcrumb navigation trail with the last item marked as the current page.',
    importCode: "import { Breadcrumbs } from '@chartreuse/ui';",
    usageCode: `<Breadcrumbs underline="none" items={[
  { label: 'Design system', href: '#overview' },
  { label: 'Card', href: '#components/card' },
  { label: 'Breadcrumbs' },
]} />`,
    nativeElement: 'nav',
    nativeProps: 'Accepts items, underline, and separator. The component manages the navigation label and ordered list.',
    props: [
      { name: 'items', type: '{ label: string; href?: string }[]', required: true, description: 'The ordered path. Items with href are links except for the final entry.' },
      { name: 'items[].label', type: 'string', required: true, description: 'The visible name of the path segment.' },
      { name: 'items[].href', type: 'string', description: 'The native link destination for a non-final path segment.' },
      { name: 'underline', type: "'always' | 'hover' | 'none'", defaultValue: "'always'", description: 'Underlines links always, only on hover or keyboard focus, or never. The visible focus ring remains in every mode.' },
      { name: 'separator', type: 'ReactNode', defaultValue: 'Chevron', description: 'Decorative text or JSX between items. Pass null to omit the separator.' },
    ],
    notes: ['The final entry is always plain text with aria-current="page", even when its item includes href.', 'Navigation follows native links; the component does not add a router callback.', 'underline="none" also removes hover and focus underlines; keyboard focus is still marked with an outline.'],
  },
  {
    name: 'TaskCard',
    slug: 'task-card',
    summary: 'A task summary with compact wrapping metadata, status, priority, and assignee avatars.',
    importCode: "import { useState } from 'react';\nimport { Button, Dialog, TaskCard } from '@chartreuse/ui';",
    usageCode: `export function TaskCardExample() {
  const [open, setOpen] = useState(false);
  return <>
    <TaskCard taskId="TASK-024" title="Implement the workspace task board"
      status="done" completed={4} total={4} hideMetadataLabels
      dependencies={{ completed: 1, total: 1 }}
      relatedCount={1} commentCount={2} attachmentCount={1}
      assignees={['Alex Morgan', 'Sam Lee']} onClick={() => setOpen(true)} />
    <Dialog open={open} onOpenChange={setOpen} title="Implement the workspace task board"
      footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
      <p>Add status lanes, task search, and task detail dialogs.</p>
    </Dialog>
  </>;
}`,
    nativeElement: 'article',
    nativeProps: 'Only TaskCardProps are accepted. The card owns its content button, semantic metadata list, and footer; additional DOM props, className, and ref are not forwarded.',
    props: [
      { name: 'taskId', type: 'string', required: true, description: 'The task identifier displayed above its title.' },
      { name: 'title', type: 'string', required: true, description: 'The task heading.' },
      { name: 'description', type: 'string', description: 'Optional supporting task context.' },
      { name: 'status', type: "'todo' | 'in-progress' | 'review' | 'done'", defaultValue: "'todo'", description: 'The task state shown in the footer badge.' },
      { name: 'priority', type: "'low' | 'medium' | 'high'", defaultValue: "'medium'", description: 'The displayed task priority.' },
      { name: 'branch', type: 'string', description: 'An optional branch label.' },
      { name: 'completed', type: 'number', defaultValue: '0', description: 'The number of completed checklist items.' },
      { name: 'total', type: 'number', defaultValue: '0', description: 'The checklist total. The count is shown only when total is greater than zero.' },
      { name: 'dependencies', type: 'TaskCardDependencies', description: 'Optional dependency progress, with completed and total counts. Omit to hide this stat; a zero total displays 0 deps.' },
      { name: 'dependencies.completed', type: 'number', description: 'Completed dependencies; required when the dependencies object is supplied.' },
      { name: 'dependencies.total', type: 'number', description: 'Total dependencies; required when the dependencies object is supplied.' },
      { name: 'relatedCount', type: 'number', description: 'Related card count. Omitted values hide the stat; an explicit zero remains visible.' },
      { name: 'commentCount', type: 'number', description: 'Comment count. Omitted values hide the stat; an explicit zero remains visible.' },
      { name: 'attachmentCount', type: 'number', description: 'Attached file count. Omitted values hide the stat; an explicit zero remains visible.' },
      { name: 'hideMetadataLabels', type: 'boolean', defaultValue: 'false', description: 'Displays each count beside its icon. Hover over or focus an indicator to read its full label.' },
      { name: 'assignees', type: 'string[]', defaultValue: '[]', description: 'Names displayed with AvatarGroup.' },
      { name: 'onClick', type: '() => void', description: 'Handles the main card action. The native content button is disabled when this callback is omitted.' },
    ],
    notes: [
      'Metadata is one wrapping list. Each icon and short label stay together, avoiding a tall row for every count.', 'Dependencies use a network icon and related cards use a link icon. Checklist progress uses a ratio.', 'Omit optional metadata props to hide their counts. Explicit zero values are included. The checklist appears when its total is greater than zero.', 'Counts are normalized to nonnegative whole numbers, with completed counts capped at their totals.', 'Screen readers receive the full meanings of abbreviated stats, which also describe the main card button.', 'Status and priority are display props; the component does not update task data itself.', 'Provide onClick for an actionable card. Keep other interactive controls outside its main button.'],
  },
  {
    name: 'AgentCard',
    slug: 'agent-card',
    summary: 'A selectable agent button showing an assignment, status, elapsed time, and token count.',
    importCode: "import { useState } from 'react';\nimport { AgentCard } from '@chartreuse/ui';",
    usageCode: `export function AgentCardExample() {
  const [selected, setSelected] = useState(false);
  return <AgentCard name="Research agent" task="Inspecting the component API and dependencies."
    status="running" tokens="2.4k" elapsed="00:42" selected={selected}
    onClick={() => setSelected(!selected)} />;
}`,
    nativeElement: 'button',
    nativeProps: 'Only AgentCardProps are accepted. The component manages the native button, disabled state, and aria-pressed; extra DOM props and ref are not forwarded.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'The displayed agent name.' },
      { name: 'task', type: 'string', required: true, description: 'The agent’s current assignment or summary.' },
      { name: 'status', type: "'running' | 'succeeded' | 'waiting' | 'idle'", defaultValue: "'running'", description: 'The displayed agent state.' },
      { name: 'tokens', type: 'string', defaultValue: "'2.4k'", description: 'A formatted token-count string.' },
      { name: 'elapsed', type: 'string', defaultValue: "'00:42'", description: 'A formatted elapsed-time string.' },
      { name: 'selected', type: 'boolean', description: 'Highlights the card and supplies aria-pressed when provided.' },
      { name: 'onClick', type: '() => void', description: 'Handles selection or inspection. The button is disabled when this callback is omitted.' },
    ],
    notes: [
      'Token and elapsed defaults are sample display values, not live measurements. Supply real values from your application.', 'Selection and agent execution are controlled by the parent.'],
  },
  {
    name: 'EmptyState',
    slug: 'empty-state',
    summary: 'An empty-view message with a decorative icon and optional action.',
    importCode: "import { useState } from 'react';\nimport { ClipboardList } from 'lucide-react';\nimport { Button, EmptyState } from '@chartreuse/ui';",
    usageCode: `export function EmptyStateExample() {
  const [started, setStarted] = useState(false);
  return started ? <p role="status">The task has been created. Add its details.</p> :
    <EmptyState icon={ClipboardList} title="No tasks yet"
      description="Create a task to start tracking work in this workspace."
      action={<Button onClick={() => setStarted(true)}>Create a task</Button>} />;
}`,
    nativeElement: 'div',
    nativeProps: 'Only the listed props are accepted. Extra native attributes, className, children, and ref are not forwarded.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'The empty-state heading.' },
      { name: 'description', type: 'string', required: true, description: 'Supporting context for the current state.' },
      { name: 'icon', type: 'IconSource', defaultValue: 'Circle', description: 'The decorative IconSource: Lucide icon, custom SVG component, or inline SVG JSX element.' },
      { name: 'action', type: 'ReactNode', description: 'Optional interactive content, such as a Button with a real callback.' },
    ],
    notes: ['Use action for the next step; the component does not create data or navigate by itself.'],
  },
];
