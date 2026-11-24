import type { ComponentReference } from './types';

export const splitButtonReference: ComponentReference = {
  name: 'SplitButton',
  slug: 'split-button',
  summary: 'A primary action Button joined to a menu segment that opens choices or custom popover content.',
  importCode: "import { useState } from 'react';\nimport { SplitButton } from '@chartreuse/ui';",
  usageCode: `const methods = [
  { value: 'merge', label: 'Create a merge commit' },
  { value: 'squash', label: 'Squash and merge' },
  { value: 'rebase', label: 'Rebase and merge' },
];

export function MergeButton({ onMerge }: { onMerge: (method: string) => void }) {
  const [method, setMethod] = useState('squash');
  return <SplitButton menuLabel="Merge method" options={methods} value={method}
    onValueChange={setMethod} checkmark onClick={() => onMerge(method)}>
    {methods.find(option => option.value === method)?.label}
  </SplitButton>;
}`,
  nativeElement: 'div[role="group"] containing two buttons and a div[popover]',
  nativeProps: 'Button props, native events, style, and ref target the action segment; className targets the group. The native value and defaultValue attributes are replaced by the menu selection. SplitButton manages the menu segment’s type, popover target, and expanded state.',
  props: [
    { name: 'children', type: 'ReactNode', description: 'The action segment’s visible label.' },
    { name: 'onClick', type: '(event: MouseEvent<HTMLButtonElement>) => void', description: 'Runs the primary action. The menu segment opens the popover instead.' },
    { name: 'menuLabel', type: 'string', required: true, description: 'Accessible name of the menu segment, such as "Agent for this request: Claude · Opus". It describes the current choice, since the segment shows only an icon.' },
    { name: 'menuTitle', type: 'string', defaultValue: 'menuLabel', description: 'Native tooltip on the menu segment.' },
    { name: 'menuDisabled', type: 'boolean', defaultValue: 'false', description: 'Disables the menu segment and closes its popover. It is independent of disabled.' },
    { name: 'menuIcon', type: 'IconSource', defaultValue: 'ChevronDown', description: 'Icon on the menu segment.' },
    { name: 'divider', type: 'boolean', defaultValue: 'true', description: 'Draws a line between the segments. Set false for a seamless control, such as ghost breadcrumb items; the segments keep their 1px join, so size and alignment do not change. Forced-colors mode still outlines each segment.' },
    { name: 'groupLabel', type: 'string', description: 'Accessible name of the group. By default the group is labeled by the action segment.' },
    { name: 'options', type: 'readonly ButtonSelectOption[]', description: 'Choices for the built-in picker, the same shape as ButtonSelect options. The action label does not change by itself; render the chosen option in children.' },
    { name: 'value', type: 'string', description: 'Controlled option ID in the built-in picker.' },
    { name: 'defaultValue', type: 'string', description: 'Initial option ID for an uncontrolled picker.' },
    { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the user chooses an enabled option.' },
    { name: 'checkmark', type: 'boolean | IconSource', defaultValue: 'false', description: 'Shows a selection icon in the built-in picker.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No options available.'", description: 'Message shown when the built-in picker has no options.' },
    { name: 'content', type: 'ReactNode | ((controls: ButtonSelectControls) => ReactNode)', description: 'Replaces the built-in options with custom popover content. The render function receives close().' },
    { name: 'matchTriggerWidth', type: 'boolean', defaultValue: 'false', description: 'Keeps the popover at the width of the whole control, within the viewport.' },
    { name: 'panelClassName', type: 'string', description: 'Additional classes on the popover panel, such as a width for custom content.' },
    { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'", defaultValue: "'primary'", description: 'Button variant applied to both segments.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Button size applied to both segments: 32px, 40px, or 46px tall, the same as Button.' },
    { name: 'icon', type: 'IconSource', description: 'Leading icon on the action segment.' },
    { name: 'loading', type: 'boolean', description: 'Shows the Button spinner on the action segment and disables it.' },
    { name: 'disabled', type: 'boolean', description: 'Disables the action segment only. Set menuDisabled as well to disable the whole control.' },
    { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Stretches the control to its container; the action segment takes the extra width.' },
    { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Native ref to the action segment.' },
  ],
  notes: [
    'Use SplitButton when one action is the common choice and a menu changes how it runs or which agent, method, or target it uses. Use ButtonSelect when the button only opens a menu.',
    'The segments share one border at the seam, with squared inner corners. Filled variants draw the seam in --cr-split-button-divider; secondary and accent reuse their border color. Pressing either segment moves the whole control so the seam stays aligned. Set divider={false} to hide the seam, for example on ghost breadcrumb items.',
    'Both segments are in the tab order. The menu segment behaves like ButtonSelect: Enter, Space, or ArrowDown opens it, Escape closes it and returns focus, and the built-in picker supports Arrow keys, Home, End, and typing.',
    'The popover aligns to the start of the whole control, not the menu segment. Custom content sizes to its contents; give width-filling content a definite width.',
    'Pass size="sm" inside MessageComposer controls to match an sm send button, or the size of the Buttons beside it elsewhere. On coarse pointers both segments follow Button’s touch sizing, and an md menu segment widens to 44px.',
  ],
};

export const splitButtonReferences: ComponentReference[] = [splitButtonReference];
