import type { ComponentReference } from './types';

export const numberInputReferences: ComponentReference[] = [
  {
    name: 'NumberInput',
    slug: 'number-input',
    summary: 'A native number input with step buttons revealed on focus and reserved space for those controls.',
    importCode: "import { useState } from 'react';\nimport { NumberInput } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `const [attempts, setAttempts] = useState<number | null>(3);

<NumberInput label="Retry attempts" name="attempts"
  value={attempts} onValueChange={setAttempts}
  min={0} max={10} hint="Choose between 0 and 10 attempts." />

// Uncontrolled inputs keep native form reset.
<NumberInput label="Interval" name="interval"
  defaultValue={1.5} min={0} max={5} step={0.25} />`,
    props: [
      { name: 'label', type: 'string', required: true, description: 'Visible label associated with the native number input. It also names the increase and decrease actions.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'The control size. Use the same size on a Button to match the input height.' },
      { name: 'value', type: 'number | null', description: 'Controlled numeric value. Use null for empty; use finite numbers.' },
      { name: 'defaultValue', type: 'number | null', defaultValue: 'null', description: 'Initial uncontrolled number and form-reset value. null starts empty.' },
      { name: 'onValueChange', type: '(value: number | null) => void', description: 'Receives numeric typing and step-command values. Empty or incomplete native edits report null. Uncontrolled reset reports defaultValue.' },
      { name: 'min', type: 'number | string', description: 'Native lower numeric bound. Typing is not clamped; validation and step commands use the constraint.' },
      { name: 'max', type: 'number | string', description: 'Native upper numeric bound. Typing is not clamped; validation and step commands use the constraint.' },
      { name: 'step', type: "number | string", defaultValue: 'Native default: 1', description: 'Native increment and validity interval. Use a positive step such as 0.25; step="any" allows arbitrary decimals and hides the step controls.' },
      { name: 'hint', type: 'string', description: 'Supporting text beneath the number control, connected to the input.' },
      { name: 'error', type: 'string', description: 'Visible validation feedback and aria-invalid state; replaces the hint.' },
      { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Stretches the field to the full width of its container, including inside flex rows.' },
      { name: 'name', type: 'string', description: 'Native form key for the input’s current value.' },
      { name: 'form', type: 'string', description: 'Native form association for fields outside the form’s DOM subtree.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Native disabled state; omits the form value and removes the custom step controls.' },
      { name: 'readOnly', type: 'boolean', defaultValue: 'false', description: 'Native read-only state; retains the named form value and removes the custom step controls.' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Native required validation for an empty field.' },
      { name: 'className', type: 'string', description: 'Additional classes on the field wrapper.' },
      { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Native ref to the number input, including its validity and step methods.' },
    ],
    nativeElement: 'input[type="number"] with optional adjacent step buttons',
    nativeProps: 'Inherits native input attributes/events/ref except type, size, children, value, defaultValue, and onChange. className targets the wrapper. onValueChange reports all edits and step actions; native onInput and other events are forwarded; programmatic step commands invoke onValueChange directly.',
    notes: [
      'Use NumberInput for a quantity with numeric meaning. Use TextField for identifiers such as postal codes, account numbers, or digit strings whose formatting matters.',
      'Space grouped number fields and other inputs with Grid and GridItem span={1}. Use columns={1} gap={4} for a vertical input stack or columns={{ base: 1, sm: 2 }} gap={4} for a responsive input row. Keep the complete labeled number field and its step controls in one item.',
      'The native spinbutton keeps keyboard editing and Arrow-key stepping. Custom buttons are hidden and absent from the Tab order until focus enters the field; focus stays within the control while using them.',
      'Steppers call native stepUp or stepDown. Bounds and decimal step alignment follow browser behavior, while direct typing is left untouched for native form validation.',
      'Empty and incomplete edits report null. Keep numeric state nullable, and let the input retain its editing text rather than formatting every change.',
      'Use value with onValueChange for controlled state or defaultValue for internal state. Reset controlled values from the form owner’s onReset handler.',
      'The stepper rail reserves its space, so revealing it does not move text or resize the field. On hover, the upper step grows downward or the lower step grows upward by sharing the rail’s fixed height. Both stay inside the input edge; reduced motion disables animation.',
      'On touch, the step buttons sit side by side with 44px widths and follow the field height. The input uses the shared 16px font size. Read-only, disabled, and step="any" fields do not show custom steppers.',
    ],
  },
];
