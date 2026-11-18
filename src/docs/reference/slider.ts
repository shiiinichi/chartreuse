import type { ComponentReference } from './types';

export const sliderReferences: ComponentReference[] = [{
  name: 'Slider',
  slug: 'slider',
  summary: 'A native range input with an associated label, optional value text, hint, and error feedback.',
  importCode: "import { useState } from 'react';\nimport { Slider } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `export function StrokeControl() {
  const [stroke, setStroke] = useState(1.5);
  return <Slider label="Stroke" min={0.5} max={3} step={0.5}
    value={stroke} onValueChange={setStroke}
    formatValue={value => value + 'px'} />;
}

// Native form submission and reset work with an uncontrolled value.
<Slider label="Confidence" name="confidence" defaultValue={65}
  min={0} max={100} step={5} formatValue={value => value + '%'} />`,
  props: [
    { name: 'label', type: 'string', required: true, description: 'The associated native label. It remains accessible when visually hidden.' },
    { name: 'value', type: 'number', description: 'Controlled numeric value. Update it from onValueChange; values are clamped and aligned to the supplied step.' },
    { name: 'defaultValue', type: 'number', description: 'Uncontrolled initial and native reset value. Defaults to the range midpoint, aligned to step.' },
    { name: 'min', type: 'number', defaultValue: '0', description: 'The inclusive minimum and step base.' },
    { name: 'max', type: 'number', defaultValue: '100', description: 'The inclusive maximum. A maximum below min becomes min.' },
    { name: 'step', type: "number | 'any'", defaultValue: '1', description: 'Positive allowed increment, or any for continuous values. Nonpositive or nonfinite numeric steps fall back to 1.' },
    { name: 'onValueChange', type: '(value: number) => void', description: 'Receives the native numeric value during pointer, touch, or keyboard changes.' },
    { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', description: 'Optional native change handler, called after onValueChange with the original event.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats the visible value and aria-valuetext, for example 1.5px or 65%. An explicit aria-valuetext overrides the generated accessible text.' },
    { name: 'showValue', type: 'boolean', defaultValue: 'true', description: 'Shows the formatted current value beside the label. The native input remains the accessible value source.' },
    { name: 'hideLabel', type: 'boolean', defaultValue: 'false', description: 'Visually hides the label while keeping its input association.' },
    { name: 'hint', type: 'string', description: 'Supporting text beneath the range control, associated through aria-describedby. Hidden while error is present.' },
    { name: 'error', type: 'string', description: 'An application-supplied error associated with the input, also setting aria-invalid.' },
    { name: 'className', type: 'string', description: 'Additional classes on the outer field wrapper.' },
    { name: 'style', type: 'CSSProperties', description: 'Inline styles on the native range input. The component owns --cr-slider-progress to keep fill synchronized.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Native ref to the range input for focus or inspection.' },
  ],
  nativeElement: 'input type="range" inside a labeled field wrapper',
  nativeProps: 'Inherits compatible native input attributes, events, and ref, including id, name, form, disabled, autoFocus, and aria-*. type, size, children, value, defaultValue, min, max, and step are managed by Slider. className targets the field wrapper; style targets the input. Range inputs do not support required validation.',
  notes: [
    'Use Slider to adjust a bounded numeric value. Use NumberInput when users need direct numeric entry.',
    'Place each complete labeled Slider in a GridItem when grouping it with other inputs. Use Grid columns={1} gap={4} for a vertical input stack or responsive columns={{ base: 1, sm: 2 }} with the same token gap for shared input rows. Keep the label, value, track, and hint together.',
    'The native input preserves arrow-key, Home/End, pointer, touch, and form behavior. The control adds no custom drag handlers or extra tab stops.',
    'Provide a meaningful formatValue when units matter. The same text is exposed as aria-valuetext, while the visual output is hidden from assistive technology to avoid duplicate live announcements.',
    'Use value with onValueChange for application state, or defaultValue for native uncontrolled state. Uncontrolled form reset restores the input, output, and fill together; controlled forms reset their state in the owning application.',
    'The field has a 40px interaction area, increasing to 44px for coarse pointers. Track, thumb, and keyboard focus use semantic colors in both themes.',
    'Hints and errors are associated with the range input through aria-describedby. Error text comes from application validation.',
  ],
}];
