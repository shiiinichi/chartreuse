import type { ComponentReference, PropDefinition } from './types';

const layoutProperties: PropDefinition[] = [
  { name: 'children', type: 'ReactNode', description: 'Labeled controls and section content. Use Grid and one GridItem per complete input group; controls keep their own labels, hints, and errors.' },
  { name: 'layout', type: "'vertical' | 'horizontal' | 'inline'", defaultValue: "'vertical'", description: 'Vertical stacks each label and control. Horizontal shares a label column. Inline places short fields and actions beside one another with wrapping. All modes stack below 480px of their layout container.' },
  { name: 'labelWidth', type: 'number | string', defaultValue: '144', description: 'Preferred horizontal label-column width. Numbers are CSS pixels; strings accept a CSS length. Use a one-column input Grid for aligned label and action edges, or a vertical FormLayout for narrow peer fields.' },
  { name: 'labelAlign', type: "'start' | 'end'", defaultValue: "'start'", description: 'Label text alignment in wide horizontal and inline layouts. Vertical labels remain start-aligned. Long labels wrap.' },
  { name: 'actions', type: 'ReactNode', description: 'Optional native submit, reset, and other actions. A compact wrapping flex row places them outside the input Grid and follows the active layout.' },
  { name: 'className', type: 'string', description: 'Additional classes on the native outer container.' },
];

export const formReferences: ComponentReference[] = [
  {
    name: 'Form', slug: 'form',
    summary: 'A native form that arranges labeled controls in vertical, horizontal, or inline layouts.',
    importCode: "import { Form, Grid, GridItem, TextField, Select, Button } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Form aria-label="Project settings" layout="horizontal" labelWidth={144}
  onSubmit={event => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    console.log(values.get('project'));
  }} actions={<>
    <Button type="submit">Save settings</Button>
    <Button type="reset" variant="secondary">Reset</Button>
  </>}>
  <Grid columns={1} gap={4}>
    <GridItem span={1}><TextField label="Project" name="project" required /></GridItem>
    <GridItem span={1}><Select label="Visibility" name="visibility" defaultValue="team">
      <option value="team">Team</option><option value="private">Private</option>
    </Select></GridItem>
  </Grid>
</Form>`,
    props: [
      ...layoutProperties,
      { name: 'ref', type: 'Ref<HTMLFormElement>', description: 'Native ref to the form for reading values, checking validity, or resetting controls.' },
    ],
    nativeElement: 'form containing a layout div and optional action div',
    nativeProps: 'Inherits native form attributes, events, style, className, and ref. The outer form retains onSubmit, onReset, action, method, autoComplete, and noValidate. Layout properties are consumed by the component, not forwarded as native attributes.',
    notes: [
      'Use Form to collect values with native field names, FormData, constraints, submit, and reset behavior. It does not own field values or create a form-state registry.',
      'Keep Grid for peer input groups and use one GridItem for each complete labeled control. Keep actions outside Grid through the actions slot, which supplies compact wrapping flex spacing.',
      'Vertical is the default. Horizontal and inline modes become vertical below 480px of the Form container, including when an example is placed in a narrow panel.',
      'For aligned horizontal labels and actions, use a one-column input Grid. Use a vertical FormLayout when peer fields have narrow individual widths. The controls own their visible labels, required marks, hint/error relationships, and native semantics.',
      'Use native Fieldset and legend for related controls. Use FormLayout inside a form when a section needs a different label arrangement; never nest native forms.',
      'Validation belongs to the native constraints or the application. Show custom errors after submission or edited-field blur, clear corrected errors while typing, and focus the first invalid control.',
      'Names containing dots remain literal native FormData keys. Explicitly map those keys into an object when the application needs a nested result.',
    ],
  },
  {
    name: 'FormLayout', slug: 'form-layout',
    summary: 'A local label-layout scope for sections and grouped inputs inside one native form.',
    importCode: "import { Form, FormLayout, Fieldset, Grid, GridItem, TextField, TextArea, Button } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
    usageCode: `<Form aria-label="Workspace settings"
  actions={<Button type="submit">Save both sections</Button>}>
  <Fieldset legend="Identity">
    <FormLayout layout="horizontal" labelWidth={144}>
      <Grid columns={1} gap={4}>
        <GridItem span={1}><TextField label="Workspace" name="workspace" required /></GridItem>
      </Grid>
    </FormLayout>
  </Fieldset>
  <Fieldset legend="Supporting notes">
    <FormLayout layout="vertical">
      <Grid columns={1} gap={4}>
        <GridItem span={1}><TextArea label="Notes" name="notes" /></GridItem>
      </Grid>
    </FormLayout>
  </Fieldset>
</Form>`,
    props: [
      ...layoutProperties,
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Native ref to the local layout scope div.' },
    ],
    nativeElement: 'div query container containing a layout div and optional action div',
    nativeProps: 'Inherits native div attributes, events, style, className, and ref. It adds a local presentation scope, not another form, fieldset, role, or data store. Native form ownership remains with the surrounding form.',
    notes: [
      'Use FormLayout to mix vertical, horizontal, and inline sections inside one native form. It does not add a second form or change native field ownership.',
      'Each instance resets its label and layout recipes locally. A vertical section inside a horizontal Form keeps vertical labels, with its own width and action alignment.',
      'Container responsiveness measures this section, not the viewport or outer form. Horizontal and inline sections stack below 480px of their own width.',
      'Use Fieldset with a visible legend when controls share a semantic group. FormLayout supplies presentation only; the existing controls still provide their individual labels and feedback.',
      'Use Grid inside the section for input groups. Keep each control, its label, and its supporting content inside one GridItem.',
      'The actions slot belongs to the surrounding native form and remains a compact flex row. Use explicit submit and reset button types.',
      'Native field names, validation, disabled behavior, refs, and events stay with the controls. FormLayout does not bind values or run validation.',
    ],
  },
];
