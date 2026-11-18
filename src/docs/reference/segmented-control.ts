import type { ComponentReference } from './types';

export const segmentedControlReferences: ComponentReference[] = [
  {
    name: 'SegmentedControl',
    slug: 'segmented-control',
    summary: 'A native radio group with segmented labels for selecting one option.',
    importCode: "import { SegmentedControl } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<SegmentedControl
  label="Size"
  name="icon-size"
  options={[
    { value: '16', label: '16' },
    { value: '20', label: '20' },
    { value: '24', label: '24' },
  ]}
  value={size}
  onValueChange={setSize}
/>

// Uncontrolled inputs retain native named form submission.
<SegmentedControl label="View" name="view" defaultValue="board"
  options={[{ value: 'board', label: 'Board' }, { value: 'list', label: 'List' }]}
/>`,
    props: [
      { name: 'label', type: 'string', required: true, description: 'Group label rendered as a native legend.' },
      { name: 'name', type: 'string', required: true, description: 'Shared radio name and submitted form key. Use a distinct name for each group in a form.' },
      { name: 'options', type: 'readonly SegmentedControlOption[]', required: true, description: 'Options with unique value, visible label, optional IconSource icon, and optional disabled state.' },
      { name: 'value', type: 'string', description: 'Controlled selected option value.' },
      { name: 'defaultValue', type: 'string', defaultValue: "''", description: 'Initial selected value when uncontrolled; also the reset value. Empty by default.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Receives the selected value. Uncontrolled form reset reports defaultValue.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Native fieldset disabled state, applying to every option.' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Applies native required validation to the radio group.' },
      { name: 'hideLabel', type: 'boolean', defaultValue: 'false', description: 'Visually hides the legend while retaining its accessible group name.' },
      { name: 'hint', type: 'string', description: 'Supporting text connected to the group and its radios.' },
      { name: 'error', type: 'string', description: 'Validation message and invalid state; replaces the visible hint.' },
      { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Stretches the track and distributes options evenly within the available width.' },
      { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Default 40px track or compact 32px track. Touch targets expand for coarse pointers.' },
      { name: 'form', type: 'string', description: 'Native form ID forwarded to the fieldset and each radio for form association outside its DOM subtree.' },
      { name: 'className', type: 'string', description: 'Additional classes on the outer fieldset.' },
      { name: 'ref', type: 'Ref<HTMLFieldSetElement>', description: 'Native ref to the outer fieldset.' },
    ],
    nativeElement: 'fieldset with legend and input[type="radio"] options',
    nativeProps: 'Inherits native fieldset attributes, style, events, and ref, excluding children, name, defaultValue, and onChange. value and onValueChange own selection; form is also forwarded to the radio inputs.',
    notes: [
      'Use a small set of mutually exclusive choices. For panel navigation use Tabs; for independent on/off values use Checkbox or Switch.',
      'Use Grid and one GridItem per complete labeled input when composing this radio group with other fields: columns={1} gap={4} for input stacks or columns={{ base: 1, sm: 2 }} for responsive input rows. Keep the native fieldset, legend, and radio-option strip together inside that item.',
      'Native radio behavior provides Tab entry, Arrow-key selection, Space activation, disabled-option skipping, required validation, and named form submission.',
      'Provide unique option values and a distinct name per group within the same form. Outside a form, radio groups with the same name share selection.',
      'Disabling a selected option preserves its selection. Native disabled inputs are omitted from form submission; update value in the owner if that choice should be cleared.',
      'Use value with onValueChange for controlled state, or defaultValue for internal state. Reset controlled values from the owning form’s onReset handler.',
      'Keep labels short and visible. Icons supplement the text and accept Lucide icons, custom React SVG components, or SVG JSX through IconSource.',
      'Options wrap inside narrow containers. The selected option has a border and surface treatment; keyboard focus remains visible in either color scheme.',
    ],
  },
];
