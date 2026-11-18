import { useState } from 'react';
import { Check, FolderOpen } from 'lucide-react';
import { Autocomplete } from '../system/Autocomplete';
import { Alert, Badge, Button, useToast } from '../system';
import { Showcase } from './shared';
import { snippets } from './catalog';
import './AutocompleteDemo.css';

const workspaces = [
  { value: 'sample-app', label: 'Sample app', description: 'Application features and workflows' },
  { value: 'component-library', label: 'Component library', description: 'UI foundations, components, and patterns' },
  { value: 'frontend-client', label: 'Frontend client', description: 'User dashboards and navigation' },
  { value: 'worker-service', label: 'Worker service', description: 'Background jobs and scheduled tasks' },
  { value: 'service-api', label: 'Service API', description: 'Application endpoints and integrations' },
  { value: 'archived', label: 'Archived workspace', description: 'Unavailable for new work', disabled: true },
];

export function AutocompleteDemo() {
  const [workspace, setWorkspace] = useState('');
  const [submitted, setSubmitted] = useState('');
  const notify = useToast();
  return <Showcase title="Workspace autocomplete" description="Filter workspace names and descriptions. Use the arrow keys to navigate and Enter to select." code={snippets.autocomplete}>
    <form className="autocomplete-demo" aria-label="Choose an example workspace" onSubmit={event => {
      event.preventDefault();
      const selected = new FormData(event.currentTarget).get('workspace');
      setSubmitted(String(selected || ''));
      notify(`Workspace selection submitted: ${workspaces.find(option => option.value === selected)?.label || selected}`);
    }}>
      <Autocomplete label="Workspace" name="workspace" options={workspaces} value={workspace} onValueChange={next => { setWorkspace(next); setSubmitted(''); }} hint="Search by workspace name or description." placeholder="Search workspaces…" required />
      <div className="autocomplete-demo-actions"><span className="muted small">{workspace ? <Badge icon={FolderOpen}>{workspace}</Badge> : 'Search for “dashboard”, “jobs”, or “components”.'}</span><Button type="submit" size="sm" icon={Check}>Submit workspace</Button></div>
      {submitted && <Alert tone="success" title="Workspace selection submitted">The form submitted <code>{submitted}</code> as the selected workspace value.</Alert>}
    </form>
  </Showcase>;
}
