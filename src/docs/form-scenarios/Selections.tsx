import { useState } from 'react';
import { Button, Checkbox, Select, Switch } from '../../system/components';
import { Fieldset } from '../../system/Fieldset';
import { Grid, GridItem } from '../../system/Grid';
import { ExampleGallery, FormActions, FormScenario, ScenarioForm, formCode } from './shared';

function SelectSizes() {
  const sizes = ['sm', 'md', 'lg'] as const;
  const rowStyle = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 5.5rem', alignItems: 'end', gap: 'var(--cr-space-3)' };
  return <FormScenario title="Select sizes" description="Match the button height for each size. The default is md."
    code={formCode('Button, Select', `export function SelectSizes() {
  const sizes = ['sm', 'md', 'lg'] as const;
  return sizes.map(size => (
    <form key={size} style={{
      display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 5.5rem',
      alignItems: 'end', gap: 'var(--cr-space-3)',
    }}>
      <Select size={size} label={'Priority (' + size + ')'} name="priority" defaultValue="normal">
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </Select>
      <Button size={size} type="reset" variant="secondary">Reset</Button>
    </form>
  ));
}`)}>
    {sizes.map(size => <ScenarioForm key={size} style={rowStyle}>
      <Select size={size} label={`Priority (${size})`} name="priority" defaultValue="normal">
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </Select>
      <Button size={size} type="reset" variant="secondary">Reset</Button>
    </ScenarioForm>)}
  </FormScenario>;
}

function PrioritySelection() {
  const [priority, setPriority] = useState('medium');
  return <FormScenario title="Controlled select" description="Keep the selected option value in React state."
    code={formCode("Select", `export function PriorityExample() {
  const [priority, setPriority] = useState('medium');
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <Select label="Priority" name="priority" value={priority} onChange={event => setPriority(event.target.value)} hint="Choose the priority for this task.">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </Select>
    <p style={{ margin: 0 }}>Selected priority: {priority}</p>
  </div>;
}`, 'useState')}>
    <Select label="Priority" name="priority" value={priority} onChange={event => setPriority(event.target.value)} hint="Choose the priority for this task."><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select>
    <p className="form-scenario-feedback">Selected priority: {priority}</p>
  </FormScenario>;
}

function DestinationSelection() {
  const [saved, setSaved] = useState('');
  return <FormScenario title="Grouped options and native validation" description="Use optgroup, a disabled placeholder, a disabled option, and required validation."
    code={formCode("Select, Button", `export function DestinationExample() {
  const [saved, setSaved] = useState('');
  return <form onReset={() => setSaved('')} onSubmit={event => {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('destination') || ''));
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select label="Destination workspace" name="destination" defaultValue="" required>
        <option value="" disabled>Choose a workspace…</option>
        <optgroup label="Active workspaces">
          <option value="component-library">Component library</option>
          <option value="sample-app">Sample app</option>
        </optgroup>
        <optgroup label="Unavailable workspaces">
          <option value="archive" disabled>Archive — read only</option>
        </optgroup>
      </Select>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button type="submit">Use destination</Button>
        <Button type="reset" variant="secondary">Reset destination</Button>
      </div>
      <p role="status" style={{ margin: 0 }}>{saved ? 'Saved destination: ' + saved : 'No destination saved yet.'}</p>
    </div>
  </form>;
}`, 'useState')}>
    <ScenarioForm className="form-scenario-form" aria-label="Destination workspace example" onReset={() => setSaved('')} onSubmit={event => { event.preventDefault(); setSaved(String(new FormData(event.currentTarget).get('destination') || '')); }}>
      <Select label="Destination workspace" name="destination" defaultValue="" required><option value="" disabled>Choose a workspace…</option><optgroup label="Active workspaces"><option value="component-library">Component library</option><option value="sample-app">Sample app</option></optgroup><optgroup label="Unavailable workspaces"><option value="archive" disabled>Archive — read only</option></optgroup></Select>
      <FormActions><Button type="submit">Use destination</Button><Button type="reset" variant="secondary">Reset destination</Button></FormActions>
      <p className="form-scenario-feedback" role="status">{saved ? 'Saved destination: ' + saved : 'No destination saved yet.'}</p>
    </ScenarioForm>
  </FormScenario>;
}

function ReviewerSelection() {
  const [reviewer, setReviewer] = useState('');
  const [error, setError] = useState('Select a reviewer.');
  return <FormScenario title="Application validation error" description="Clear the error when the selected value changes."
    code={formCode('Select', `export function ReviewerExample() {
  const [reviewer, setReviewer] = useState('');
  const [error, setError] = useState('Select a reviewer.');
  return <Select label="Review owner" name="reviewer" value={reviewer} error={error}
    onChange={event => { setReviewer(event.target.value); setError(''); }}>
    <option value="" disabled>Choose a reviewer…</option>
    <option value="alex">Alex Morgan</option>
    <option value="sam">Sam Lee</option>
  </Select>;
}`, 'useState')}>
    <Select label="Review owner" name="reviewer" value={reviewer} error={error} onChange={event => { setReviewer(event.target.value); setError(''); }}><option value="" disabled>Choose a reviewer…</option><option value="alex">Alex Morgan</option><option value="sam">Sam Lee</option></Select>
  </FormScenario>;
}

export function SelectScenarios() {
  return <ExampleGallery className="form-scenarios">
    <SelectSizes />
    <PrioritySelection />
    <DestinationSelection />
    <ReviewerSelection />
    <FormScenario title="Disabled select" description="Display the selected option while preventing changes and form submission."
      code={formCode('Select', `<Select label="Deployment region" name="region" defaultValue="local" disabled
  hint="The workspace sets the deployment region.">
  <option value="local">Local workspace</option>
  <option value="remote">Remote workspace</option>
</Select>`)}>
      <Select label="Deployment region" name="region" defaultValue="local" disabled hint="The workspace sets the deployment region."><option value="local">Local workspace</option><option value="remote">Remote workspace</option></Select>
    </FormScenario>
  </ExampleGallery>;
}

function ControlledCheckbox() {
  const [checked, setChecked] = useState(true);
  return <FormScenario title="Controlled checkbox" description="Store the checked state in React and associate the hint with the control."
    code={formCode("Checkbox", `export function WorktreeExample() {
  const [checked, setChecked] = useState(true);
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <Checkbox label="Create a worktree" name="worktree" checked={checked} onChange={event => setChecked(event.target.checked)} hint="Use a separate Git worktree for this task." />
    <p style={{ margin: 0 }}>{checked ? 'Worktree preference: enabled.' : 'Worktree preference: disabled.'}</p>
  </div>;
}`, 'useState')}>
    <Checkbox label="Create a worktree" name="worktree" checked={checked} onChange={event => setChecked(event.target.checked)} hint="Use a separate Git worktree for this task." />
    <p className="form-scenario-feedback">{checked ? 'Worktree preference: enabled.' : 'Worktree preference: disabled.'}</p>
  </FormScenario>;
}

function CheckboxForm() {
  const [saved, setSaved] = useState<string[] | null>(null);
  return <FormScenario title="Checkbox group in a native form" description="Place independent choices in a responsive grid. FormData includes checked values and omits unchecked values." wide span="full"
    code={formCode("Button, Checkbox, Fieldset, Grid, GridItem", `export function ReviewPreferencesExample() {
  const [saved, setSaved] = useState<string[] | null>(null);
  return <form onReset={() => setSaved(null)} onSubmit={event => {
    event.preventDefault();
    setSaved(new FormData(event.currentTarget).getAll('reviewContext').map(String));
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Fieldset legend="Review context">
        <Grid columns={{ base: 1, sm: 2 }} gap={4}>
          <GridItem span={1}>
            <Checkbox label="Attach the checklist" name="reviewContext" value="checklist" defaultChecked />
          </GridItem>
          <GridItem span={1}>
            <Checkbox label="Include the activity summary" name="reviewContext" value="activity" />
          </GridItem>
        </Grid>
      </Fieldset>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button type="submit">Save review preferences</Button>
        <Button type="reset" variant="secondary">Reset review preferences</Button>
      </div>
      <p role="status" style={{ margin: 0 }}>{saved === null ? 'No preferences saved yet.'
        : 'Saved: ' + (saved.join(', ') || 'none')}</p>
    </div>
  </form>;
}`, 'useState')}>
    <ScenarioForm className="form-scenario-form" aria-label="Review context preferences example" onReset={() => setSaved(null)} onSubmit={event => { event.preventDefault(); setSaved(new FormData(event.currentTarget).getAll('reviewContext').map(String)); }}>
      <Fieldset legend="Review context"><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Checkbox label="Attach the checklist" name="reviewContext" value="checklist" defaultChecked /></GridItem><GridItem span={1}><Checkbox label="Include the activity summary" name="reviewContext" value="activity" /></GridItem></Grid></Fieldset>
      <FormActions><Button type="submit">Save review preferences</Button><Button type="reset" variant="secondary">Reset review preferences</Button></FormActions>
      <p className="form-scenario-feedback" role="status">{saved === null ? 'No preferences saved yet.' : 'Saved: ' + (saved.join(', ') || 'none')}</p>
    </ScenarioForm>
  </FormScenario>;
}

export function CheckboxScenarios() {
  return <ExampleGallery className="form-scenarios" maxColumns={3}>
    <ControlledCheckbox />
    <FormScenario title="Initially checked checkbox" description="Set the initial native state with defaultChecked."
      code={formCode('Checkbox', `<Checkbox label="Keep the review notes" name="keepNotes" defaultChecked
  hint="Keep the review notes in the task." />`)}>
      <Checkbox label="Keep the review notes" name="keepNotes" defaultChecked hint="Keep the review notes in the task." />
    </FormScenario>
    <FormScenario title="Disabled checkbox states" description="Render checked and unchecked disabled controls."
      code={formCode("Checkbox, Grid, GridItem", `<Grid columns={{ base: 1, sm: 2 }} gap={4}>
  <GridItem span={1}>
    <Checkbox label="Managed review requirement" defaultChecked disabled hint="Required by the workspace." />
  </GridItem>
  <GridItem span={1}>
    <Checkbox label="Unavailable optional review" disabled hint="This option is not offered in the current workspace." />
  </GridItem>
</Grid>;`)}>
      <Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Checkbox label="Managed review requirement" defaultChecked disabled hint="Required by the workspace." /></GridItem><GridItem span={1}><Checkbox label="Unavailable optional review" disabled hint="This option is not offered in the current workspace." /></GridItem></Grid>
    </FormScenario>
    <CheckboxForm />
  </ExampleGallery>;
}

function ControlledSwitch() {
  const [enabled, setEnabled] = useState(true);
  return <FormScenario title="Controlled switch" description="Keep the checked state in React and display the current value."
    code={formCode("Switch", `export function LiveUpdatesExample() {
  const [enabled, setEnabled] = useState(true);
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <Switch label="Live updates" name="liveUpdates" checked={enabled} onChange={event => setEnabled(event.target.checked)} hint="This example stores the setting in local state." />
    <p style={{ margin: 0 }}>Live updates are {enabled ? 'on' : 'off'}.</p>
  </div>;
}`, 'useState')}>
    <Switch label="Live updates" name="liveUpdates" checked={enabled} onChange={event => setEnabled(event.target.checked)} hint="This example stores the setting in local state." />
    <p className="form-scenario-feedback">Live updates are {enabled ? 'on' : 'off'}.</p>
  </FormScenario>;
}

function SwitchForm() {
  const [saved, setSaved] = useState<string | null>(null);
  return <FormScenario title="Switch in a native form" description="Submit and reset the underlying native checkbox with the form."
    code={formCode("Button, Switch", `export function SoundPreferenceExample() {
  const [saved, setSaved] = useState<string | null>(null);
  return <form onReset={() => setSaved(null)} onSubmit={event => {
    event.preventDefault();
    setSaved(new FormData(event.currentTarget).has('soundCues') ? 'on' : 'off');
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Switch label="Sound cues" name="soundCues" value="enabled" defaultChecked hint="Submit to display the current preference." />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button type="submit">Save sound preference</Button>
        <Button type="reset" variant="secondary">Reset sound preference</Button>
      </div>
      <p role="status" style={{ margin: 0 }}>{saved === null ? 'No preference saved yet.'
        : 'Saved sound cues: ' + saved}</p>
    </div>
  </form>;
}`, 'useState')}>
    <ScenarioForm className="form-scenario-form" aria-label="Sound preference example" onReset={() => setSaved(null)} onSubmit={event => { event.preventDefault(); setSaved(new FormData(event.currentTarget).has('soundCues') ? 'on' : 'off'); }}>
      <Switch label="Sound cues" name="soundCues" value="enabled" defaultChecked hint="Submit to display the current preference." />
      <FormActions><Button type="submit">Save sound preference</Button><Button type="reset" variant="secondary">Reset sound preference</Button></FormActions>
      <p className="form-scenario-feedback" role="status">{saved === null ? 'No preference saved yet.' : 'Saved sound cues: ' + saved}</p>
    </ScenarioForm>
  </FormScenario>;
}

export function SwitchScenarios() {
  return <ExampleGallery className="form-scenarios">
    <ControlledSwitch />
    <FormScenario title="Initially enabled switch" description="Set the initial native state with defaultChecked."
      code={formCode('Switch', `<Switch label="Keep the agent monitor open" name="keepMonitor" defaultChecked
  hint="This choice only changes the current example." />`)}>
      <Switch label="Keep the agent monitor open" name="keepMonitor" defaultChecked hint="This choice only changes the current example." />
    </FormScenario>
    <FormScenario title="Disabled switch" description="Display the checked state while preventing changes."
      code={formCode('Switch', `<Switch label="Workspace-managed connection" defaultChecked disabled
  hint="The workspace manages this connection." />`)}>
      <Switch label="Workspace-managed connection" defaultChecked disabled hint="The workspace manages this connection." />
    </FormScenario>
    <SwitchForm />
  </ExampleGallery>;
}
