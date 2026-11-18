import { useState } from 'react';
import { Autocomplete } from '../../system/Autocomplete';
import { Button } from '../../system/components';
import { ExampleGallery, FormActions, FormScenario, ScenarioForm, formCode } from './shared';

const projects = [
  { value: 'sample-app', label: 'Sample app' },
  { value: 'component-library', label: 'Component library' },
  { value: 'frontend-client', label: 'Frontend client' },
];
const workspaces = [
  { value: 'sample-app', label: 'Sample app', description: 'Application features and workflows' },
  { value: 'component-library', label: 'Component library', description: 'UI foundations, components, and patterns' },
  { value: 'frontend-client', label: 'Frontend client', description: 'User dashboards and navigation' },
  { value: 'archive', label: 'Archived workspace', description: 'Unavailable for new work', disabled: true },
];
const projectsCode = `const projects = ${JSON.stringify(projects, null, 2)};`;
const workspacesCode = `const workspaces = ${JSON.stringify(workspaces, null, 2)};`;

function ControlledProject() {
  const [project, setProject] = useState('');
  return <FormScenario title="Controlled project selection" description="Filter options, then select a value with the keyboard or pointer."
    code={formCode("Autocomplete", `${projectsCode}
export function ProjectExample() {
  const [project, setProject] = useState('');
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <Autocomplete label="Find a project" name="project" options={projects} value={project} onValueChange={setProject} placeholder="Search projects…" />
    <p style={{ margin: 0 }}>Selected project ID: {project || 'none'}</p>
  </div>;
}`, 'useState')}>
    <Autocomplete label="Find a project" name="project" options={projects} value={project} onValueChange={setProject} placeholder="Search projects…" />
    <p className="form-scenario-feedback">Selected project ID: {project || 'none'}</p>
  </FormScenario>;
}

function WorkspaceForm() {
  const [saved, setSaved] = useState('');
  return <FormScenario title="Selected value in FormData" description="Submit the option value from an uncontrolled field and restore its default selection on reset."
    code={formCode("Autocomplete, Button", `${workspacesCode}
export function WorkspaceFormExample() {
  const [saved, setSaved] = useState('');
  return <form onReset={() => setSaved('')} onSubmit={event => {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('workspace') || ''));
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Autocomplete label="Workspace" name="workspace" options={workspaces} defaultValue="sample-app" required hint="FormData contains the selected option value." />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button type="submit">Submit workspace selection</Button>
        <Button type="reset" variant="secondary">Reset workspace selection</Button>
      </div>
      <p role="status" style={{ margin: 0 }}>{saved ? 'Submitted workspace ID: ' + saved : 'No workspace submitted yet.'}</p>
    </div>
  </form>;
}`, 'useState')}>
    <ScenarioForm className="form-scenario-form" aria-label="Autocomplete form example" onReset={() => setSaved('')} onSubmit={event => { event.preventDefault(); setSaved(String(new FormData(event.currentTarget).get('workspace') || '')); }}>
      <Autocomplete label="Workspace" name="workspace" options={workspaces} defaultValue="sample-app" required hint="FormData contains the selected option value." />
      <FormActions><Button type="submit">Submit workspace selection</Button><Button type="reset" variant="secondary">Reset workspace selection</Button></FormActions>
      <p className="form-scenario-feedback" role="status">{saved ? 'Submitted workspace ID: ' + saved : 'No workspace submitted yet.'}</p>
    </ScenarioForm>
  </FormScenario>;
}

function MissingProject() {
  const [project, setProject] = useState('');
  const [error, setError] = useState('Select a project.');
  return <FormScenario title="Application validation error" description="Clear the error on selection and restore it when an empty field loses focus."
    code={formCode('Autocomplete', `${projectsCode}

export function RequiredProjectExample() {
  const [project, setProject] = useState('');
  const [error, setError] = useState('Select a project.');
  return <Autocomplete label="Project for review" name="reviewProject" options={projects}
    value={project} required error={error}
    onValueChange={next => { setProject(next); setError(''); }}
    onBlur={() => setError(project ? '' : 'Select a project.')} />;
}`, 'useState')}>
    <Autocomplete label="Project for review" name="reviewProject" options={projects} value={project} required error={error} onValueChange={next => { setProject(next); setError(''); }} onBlur={() => setError(project ? '' : 'Select a project.')} />
  </FormScenario>;
}

export function AutocompleteScenarios() {
  return <ExampleGallery className="form-scenarios">
    <ControlledProject />
    <FormScenario title="Option descriptions and disabled states" description="Filter by label or description. Keep disabled options visible and unselectable."
      code={formCode('Autocomplete', `${workspacesCode}

<Autocomplete label="Assign a workspace" name="assignedWorkspace"
  options={workspaces} defaultValue="component-library"
  hint="Search for app, dashboards, or patterns." />`)}>
      <Autocomplete label="Assign a workspace" name="assignedWorkspace" options={workspaces} defaultValue="component-library" hint="Search for app, dashboards, or patterns." />
    </FormScenario>
    <WorkspaceForm />
    <MissingProject />
    <FormScenario title="Disabled autocomplete" description="Display the selected label while preventing input and selection."
      code={formCode('Autocomplete', `${projectsCode}

<Autocomplete label="Managed project selection" name="managedProject"
  options={projects} defaultValue="component-library" disabled
  hint="The workspace manages this project." />`)}>
      <Autocomplete label="Managed project selection" name="managedProject" options={projects} defaultValue="component-library" disabled hint="The workspace manages this project." />
    </FormScenario>
    <FormScenario title="Empty option list" description="Focus the field to display the empty-result message."
      code={formCode('Autocomplete', `<Autocomplete label="Assigned repositories" name="assignedRepository"
  options={[]} emptyMessage="No repositories available."
  placeholder="Search repositories…"
  hint="This field has an empty options array." />`)}>
      <Autocomplete label="Assigned repositories" name="assignedRepository" options={[]} emptyMessage="No repositories available." placeholder="Search repositories…" hint="This field has an empty options array." />
    </FormScenario>
  </ExampleGallery>;
}
