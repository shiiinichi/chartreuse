import { useState } from 'react';
import { Button, Checkbox, Select, TextArea, TextField } from '../system/components';
import { Form, FormLayout } from '../system/Form';
import { Fieldset } from '../system/Fieldset';
import { Grid, GridItem } from '../system/Grid';
import { NumberInput } from '../system/NumberInput';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './form-demo.css';

type Layout = 'vertical' | 'horizontal' | 'inline';
type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type FieldErrors = Record<string, string>;
type Profile = { user: { name: string; email: string; age: number | null; website: string; introduction: string } };

const exampleStyles = `.form-demo-stack { display: flex; flex-direction: column; gap: var(--cr-space-6); min-width: 0; }
.form-demo-feedback { margin: 0; color: var(--cr-color-muted); font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; }
.form-demo-feedback[data-error] { color: var(--cr-color-danger); }
.form-demo-result { margin: 0; padding: var(--cr-space-4); max-width: 100%; border: 1px solid var(--cr-color-border); border-radius: var(--cr-radius-md); background: var(--cr-color-canvas); color: var(--cr-color-text); font: 12px/1.8 var(--cr-font-mono); white-space: pre-wrap; overflow-wrap: anywhere; }
.form-demo-frame { box-sizing: border-box; max-width: 100%; min-width: 0; padding: var(--cr-space-4); border: 1px solid var(--cr-color-border); border-radius: var(--cr-radius-md); }`;

function exampleCode(components: string, body: string, helpers = '') {
  return `import { useState } from 'react';\nimport { ${components} } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';\n\n${helpers ? `${helpers}\n\n` : ''}${body}\n\n/* Example styles:\n${exampleStyles}\n*/`;
}

function LayoutChoice() {
  const [layout, setLayout] = useState<Layout>('vertical');
  const [saved, setSaved] = useState('');
  return <Showcase title="Compare vertical, horizontal, and inline layouts" description="Switch the layout while keeping the existing fields mounted and retaining their values." code={exampleCode('Button, Form, Grid, GridItem, Select, TextField, Text', `export function LayoutChoice() {
  const [layout, setLayout] = useState<'vertical' | 'horizontal' | 'inline'>(${JSON.stringify(layout)});
  const [saved, setSaved] = useState('');
  return <div className="form-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <Select label="Form layout" value={layout}
        onChange={event => setLayout(event.currentTarget.value as typeof layout)}>
        <option value="vertical">Vertical</option><option value="horizontal">Horizontal</option>
        <option value="inline">Inline</option>
      </Select>
    </GridItem></Grid>
    <Form aria-label="Layout comparison example" layout={layout}
      onReset={() => setSaved('')}
      onSubmit={event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setSaved(String(values.get('project')) + ' · ' + String(values.get('visibility')));
      }} actions={<>
        <Button type="submit" size="sm">Save layout values</Button>
        <Button type="reset" size="sm" variant="secondary">Reset values</Button>
      </>}>
      <Grid columns={layout === 'inline' ? { base: 1, sm: 2 } : 1} gap={4}>
        <GridItem span={1}><TextField label="Project" name="project"
          defaultValue="Component library" required hint="Field values persist when the layout changes." /></GridItem>
        <GridItem span={1}><Select label="Visibility" name="visibility" defaultValue="workspace">
          <option value="workspace">Workspace</option><option value="private">Private</option>
        </Select></GridItem>
      </Grid>
    </Form>
    <Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved locally: ' + saved : 'No layout values submitted.'}</Text>
  </div>;
}`)}>
    <div className="form-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><Select label="Form layout" value={layout} onChange={event => setLayout(event.currentTarget.value as Layout)}><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option><option value="inline">Inline</option></Select></GridItem></Grid><Form aria-label="Layout comparison example" layout={layout} onReset={() => setSaved('')} onSubmit={event => { event.preventDefault(); const values = new FormData(event.currentTarget); setSaved(String(values.get('project')) + ' · ' + String(values.get('visibility'))); }} actions={<><Button type="submit" size="sm">Save layout values</Button><Button type="reset" size="sm" variant="secondary">Reset values</Button></>}><Grid columns={layout === 'inline' ? { base: 1, sm: 2 } : 1} gap={4}><GridItem span={1}><TextField label="Project" name="project" defaultValue="Component library" required hint="Field values persist when the layout changes." /></GridItem><GridItem span={1}><Select label="Visibility" name="visibility" defaultValue="workspace"><option value="workspace">Workspace</option><option value="private">Private</option></Select></GridItem></Grid></Form><Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved locally: ' + saved : 'No layout values submitted.'}</Text></div>
  </Showcase>;
}

function LongLabels() {
  const [saved, setSaved] = useState('');
  return <Showcase title="Align controls under wrapping labels" description="Labels wrap within the chosen width. Supporting text and the action row follow the controls." code={exampleCode('Button, Form, Grid, GridItem, TextArea, TextField, Text', `export function LongLabels() {
  const [saved, setSaved] = useState('');
  return <div className="form-demo-stack">
    <Form aria-label="Long label example" layout="horizontal" labelWidth={168} labelAlign="end"
      onReset={() => setSaved('')} onSubmit={event => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get('branch')));
      }} actions={<>
        <Button type="submit" size="sm">Save review context</Button>
        <Button type="reset" size="sm" variant="secondary">Reset context</Button>
      </>}>
      <Grid columns={1} gap={4}>
        <GridItem span={1}><TextField label="Repository branch used for the shared review"
          name="branch" defaultValue="feature/form-layouts" required
          hint="Use the branch that contains the changes being reviewed." /></GridItem>
        <GridItem span={1}><TextArea label="Additional context for the repository branch review"
          name="context" rows={3} defaultValue="Compare labels, helper text, and the action row." /></GridItem>
      </Grid>
    </Form>
    <Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved branch: ' + saved : 'No changes saved yet.'}</Text>
  </div>;
}`)}>
    <div className="form-demo-stack"><Form aria-label="Long label example" layout="horizontal" labelWidth={168} labelAlign="end" onReset={() => setSaved('')} onSubmit={event => { event.preventDefault(); setSaved(String(new FormData(event.currentTarget).get('branch'))); }} actions={<><Button type="submit" size="sm">Save review context</Button><Button type="reset" size="sm" variant="secondary">Reset context</Button></>}><Grid columns={1} gap={4}><GridItem span={1}><TextField label="Repository branch used for the shared review" name="branch" defaultValue="feature/form-layouts" required hint="Use the branch that contains the changes being reviewed." /></GridItem><GridItem span={1}><TextArea label="Additional context for the repository branch review" name="context" rows={3} defaultValue="Compare labels, helper text, and the action row." /></GridItem></Grid></Form><Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved branch: ' + saved : 'No changes saved yet.'}</Text></div>
  </Showcase>;
}

function InlineFilters() {
  const [result, setResult] = useState('');
  return <Showcase title="Inline task filters" description="Short labeled fields and an explicit search action share the available row, then stack in a narrow container." code={exampleCode('Button, Form, Grid, GridItem, Select, TextField, Text', `export function InlineFilters() {
  const [result, setResult] = useState('');
  return <div className="form-demo-stack">
    <search aria-label="Task filters">
      <Form aria-label="Inline filter example" layout="inline" method="get"
        onReset={() => setResult('')} onSubmit={event => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          setResult('Query: ' + (String(values.get('query')).trim() || 'all tasks')
            + ' · Status: ' + String(values.get('status')));
        }} actions={<>
          <Button type="submit" size="sm">Apply filters</Button>
          <Button type="reset" size="sm" variant="secondary">Clear filters</Button>
        </>}>
        <Grid columns={{ base: 1, sm: 2 }} gap={4}>
          <GridItem span={1}><TextField label="Keyword" name="query" type="search"
            placeholder="Search task titles" /></GridItem>
          <GridItem span={1}><Select label="Status" name="status" defaultValue="all">
            <option value="all">All statuses</option><option value="review">In review</option>
            <option value="done">Done</option>
          </Select></GridItem>
        </Grid>
      </Form>
    </search>
    <Text size="body" className="form-demo-feedback" role="status">{result || 'Apply the filters to preview the selection.'}</Text>
  </div>;
}`)}>
    <div className="form-demo-stack"><search aria-label="Task filters"><Form aria-label="Inline filter example" layout="inline" method="get" onReset={() => setResult('')} onSubmit={event => { event.preventDefault(); const values = new FormData(event.currentTarget); setResult('Query: ' + (String(values.get('query')).trim() || 'all tasks') + ' · Status: ' + String(values.get('status'))); }} actions={<><Button type="submit" size="sm">Apply filters</Button><Button type="reset" size="sm" variant="secondary">Clear filters</Button></>}><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><TextField label="Keyword" name="query" type="search" placeholder="Search task titles" /></GridItem><GridItem span={1}><Select label="Status" name="status" defaultValue="all"><option value="all">All statuses</option><option value="review">In review</option><option value="done">Done</option></Select></GridItem></Grid></Form></search><Text size="body" className="form-demo-feedback" role="status">{result || 'Apply the filters to preview the selection.'}</Text></div>
  </Showcase>;
}

const profileLabels: Record<string, string> = { 'user.name': 'Name', 'user.email': 'Email', 'user.age': 'Age', 'user.website': 'Website', 'user.introduction': 'Introduction' };
const profileMessages = {
  required: (label: string) => `${label} is required.`,
  email: 'Enter an email address such as alex@example.com.',
  age: 'Enter an age from 0 to 120.',
  website: 'Enter a full website URL, including https://.',
};
function profileControls(form: HTMLFormElement): FormControl[] {
  return Array.from(form.elements).filter((field): field is FormControl => (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) && !field.disabled && field.name in profileLabels);
}
function profileErrors(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of profileControls(form)) {
    if (field.name === 'user.name' && !field.value.trim()) {
      errors[field.name] = profileMessages.required(profileLabels[field.name]); continue;
    }
    if (field.validity.valid) continue;
    errors[field.name] = field.validity.valueMissing ? profileMessages.required(profileLabels[field.name])
      : field.name === 'user.email' ? profileMessages.email
      : field.name === 'user.age' ? profileMessages.age
      : field.name === 'user.website' ? profileMessages.website
      : `${profileLabels[field.name]} needs a valid value.`;
  }
  return errors;
}
const profileHelpers = `type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type FieldErrors = Record<string, string>;
type Profile = { user: { name: string; email: string; age: number | null; website: string; introduction: string } };
const profileLabels: Record<string, string> = ${JSON.stringify(profileLabels, null, 2)};
const profileMessages = {
  required: (label: string) => label + ' is required.',
  email: 'Enter an email address such as alex@example.com.',
  age: 'Enter an age from 0 to 120.',
  website: 'Enter a full website URL, including https://.',
};
function profileControls(form: HTMLFormElement): FormControl[] {
  return Array.from(form.elements).filter((field): field is FormControl =>
    (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)
      && !field.disabled && field.name in profileLabels);
}
function profileErrors(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of profileControls(form)) {
    if (field.name === 'user.name' && !field.value.trim()) {
      errors[field.name] = profileMessages.required(profileLabels[field.name]); continue;
    }
    if (field.validity.valid) continue;
    errors[field.name] = field.validity.valueMissing ? profileMessages.required(profileLabels[field.name])
      : field.name === 'user.email' ? profileMessages.email
      : field.name === 'user.age' ? profileMessages.age
      : field.name === 'user.website' ? profileMessages.website
      : profileLabels[field.name] + ' needs a valid value.';
  }
  return errors;
}`;

function NestedProfile() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState<Profile | null>(null);
  const clearValidError = (field: FormControl) => {
    if (errors[field.name] && field.validity.valid && (field.name !== 'user.name' || field.value.trim())) setErrors(previous => { const next = { ...previous }; delete next[field.name]; return next; });
  };
  const count = Object.keys(errors).length;
  return <Showcase span="full" title="Build nested values from native form fields" description="Validate on submit, then construct the nested result from native FormData keys." code={exampleCode('Button, Form, Grid, GridItem, NumberInput, TextArea, TextField, Text', `export function NestedProfile() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState<Profile | null>(null);
  const clearValidError = (field: FormControl) => {
    if (errors[field.name] && field.validity.valid && (field.name !== 'user.name' || field.value.trim())) setErrors(previous => {
      const next = { ...previous }; delete next[field.name]; return next;
    });
  };
  const count = Object.keys(errors).length;
  return <div className="form-demo-stack">
    <Form aria-label="Nested profile example" layout="horizontal" noValidate
      onReset={() => { setErrors({}); setSaved(null); }} onSubmit={event => {
        event.preventDefault();
        const form = event.currentTarget;
        const next = profileErrors(form); setErrors(next); setSaved(null);
        if (Object.keys(next).length) {
          profileControls(form).find(field => Boolean(next[field.name]))?.focus();
          return;
        }
        const values = new FormData(form);
        const age = String(values.get('user.age') || '');
        setSaved({ user: {
          name: String(values.get('user.name') || '').trim(),
          email: String(values.get('user.email') || '').trim(),
          age: age === '' ? null : Number(age),
          website: String(values.get('user.website') || ''),
          introduction: String(values.get('user.introduction') || ''),
        } });
      }} actions={<>
        <Button type="submit" size="sm">Validate profile</Button>
        <Button type="reset" size="sm" variant="secondary">Reset profile</Button>
      </>}>
      <Grid columns={1} gap={4}>
        <GridItem span={1}><TextField label="Name" name="user.name" autoComplete="name" required
          defaultValue="Alex Morgan" error={errors['user.name']}
          onChange={event => clearValidError(event.currentTarget)} /></GridItem>
        <GridItem span={1}><TextField label="Email" name="user.email" type="email" autoComplete="email" required
          placeholder="alex@example.com" error={errors['user.email']}
          onChange={event => clearValidError(event.currentTarget)} /></GridItem>
        <GridItem span={1}><NumberInput label="Age" name="user.age" defaultValue={28}
          min={0} max={120} step={1} hint="Optional; enter a number from 0 to 120."
          error={errors['user.age']} onInput={event => clearValidError(event.currentTarget)} /></GridItem>
        <GridItem span={1}><TextField label="Website" name="user.website" type="url" autoComplete="url"
          placeholder="https://example.com" error={errors['user.website']}
          onChange={event => clearValidError(event.currentTarget)} /></GridItem>
        <GridItem span={1}><TextArea label="Introduction" name="user.introduction" rows={3} maxLength={300}
          defaultValue="Reviewing the form samples." hint="Up to 300 characters."
          error={errors['user.introduction']} onChange={event => clearValidError(event.currentTarget)} /></GridItem>
      </Grid>
    </Form>
    {count > 0 && <Text size="body" className="form-demo-feedback" data-error role="alert">Correct {count} {count === 1 ? 'field' : 'fields'} before continuing.</Text>}
    <Text size="body" className="form-demo-feedback" role="status">{saved ? 'Submitted profile values appear below.' : 'No profile values submitted.'}</Text>
    {saved && <pre className="form-demo-result" aria-label="Nested profile values">{JSON.stringify(saved, null, 2)}</pre>}
  </div>;
}`, profileHelpers)}>
    <div className="form-demo-stack"><Form aria-label="Nested profile example" layout="horizontal" noValidate onReset={() => { setErrors({}); setSaved(null); }} onSubmit={event => { event.preventDefault(); const form = event.currentTarget; const next = profileErrors(form); setErrors(next); setSaved(null); if (Object.keys(next).length) { profileControls(form).find(field => Boolean(next[field.name]))?.focus(); return; } const values = new FormData(form); const age = String(values.get('user.age') || ''); setSaved({ user: { name: String(values.get('user.name') || '').trim(), email: String(values.get('user.email') || '').trim(), age: age === '' ? null : Number(age), website: String(values.get('user.website') || ''), introduction: String(values.get('user.introduction') || '') } }); }} actions={<><Button type="submit" size="sm">Validate profile</Button><Button type="reset" size="sm" variant="secondary">Reset profile</Button></>}><Grid columns={1} gap={4}><GridItem span={1}><TextField label="Name" name="user.name" autoComplete="name" required defaultValue="Alex Morgan" error={errors['user.name']} onChange={event => clearValidError(event.currentTarget)} /></GridItem><GridItem span={1}><TextField label="Email" name="user.email" type="email" autoComplete="email" required placeholder="alex@example.com" error={errors['user.email']} onChange={event => clearValidError(event.currentTarget)} /></GridItem><GridItem span={1}><NumberInput label="Age" name="user.age" defaultValue={28} min={0} max={120} step={1} hint="Optional; enter a number from 0 to 120." error={errors['user.age']} onInput={event => clearValidError(event.currentTarget)} /></GridItem><GridItem span={1}><TextField label="Website" name="user.website" type="url" autoComplete="url" placeholder="https://example.com" error={errors['user.website']} onChange={event => clearValidError(event.currentTarget)} /></GridItem><GridItem span={1}><TextArea label="Introduction" name="user.introduction" rows={3} maxLength={300} defaultValue="Reviewing the form samples." hint="Up to 300 characters." error={errors['user.introduction']} onChange={event => clearValidError(event.currentTarget)} /></GridItem></Grid></Form>{count > 0 && <Text size="body" className="form-demo-feedback" data-error role="alert">Correct {count} {count === 1 ? 'field' : 'fields'} before continuing.</Text>}<Text size="body" className="form-demo-feedback" role="status">{saved ? 'Submitted profile values appear below.' : 'No profile values submitted.'}</Text>{saved && <pre className="form-demo-result" aria-label="Nested profile values">{JSON.stringify(saved, null, 2)}</pre>}</div>
  </Showcase>;
}

function NativeConstraints() {
  const [result, setResult] = useState('');
  return <Showcase title="Native constraints and reset" description="Required fields and a branch-name pattern use browser validation. Reset restores the uncontrolled defaults." code={exampleCode('Button, Checkbox, Fieldset, Form, Grid, GridItem, Select, TextField, Text', `export function NativeConstraints() {
  const [result, setResult] = useState('');
  return <div className="form-demo-stack">
    <Form aria-label="Native constraints example" onReset={() => setResult('')}
      onSubmit={event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setResult('Branch: ' + String(values.get('branch')) + ' · Summary: '
          + (values.has('includeSummary') ? 'included' : 'not included'));
      }} actions={<>
        <Button type="submit" size="sm">Save branch settings</Button>
        <Button type="reset" size="sm" variant="secondary">Reset branch settings</Button>
      </>}>
      <Fieldset legend="Branch settings">
        <Grid columns={1} gap={4}>
          <GridItem span={1}><TextField label="Branch name" name="branch" required
            pattern="[a-z0-9-]+" defaultValue="review-layouts"
            title="Use lowercase letters, numbers, or hyphens."
            hint="Use lowercase letters, numbers, or hyphens." /></GridItem>
          <GridItem span={1}><Select label="Review policy" name="policy" required defaultValue="">
            <option value="">Choose a policy</option><option value="team">Team review</option>
            <option value="owner">Owner review</option>
          </Select></GridItem>
          <GridItem span={1}><Checkbox label="Include the review summary" name="includeSummary" defaultChecked /></GridItem>
        </Grid>
      </Fieldset>
    </Form>
    <Text size="body" className="form-demo-feedback" role="status">{result || 'No branch settings submitted.'}</Text>
  </div>;
}`)}>
    <div className="form-demo-stack"><Form aria-label="Native constraints example" onReset={() => setResult('')} onSubmit={event => { event.preventDefault(); const values = new FormData(event.currentTarget); setResult('Branch: ' + String(values.get('branch')) + ' · Summary: ' + (values.has('includeSummary') ? 'included' : 'not included')); }} actions={<><Button type="submit" size="sm">Save branch settings</Button><Button type="reset" size="sm" variant="secondary">Reset branch settings</Button></>}><Fieldset legend="Branch settings"><Grid columns={1} gap={4}><GridItem span={1}><TextField label="Branch name" name="branch" required pattern="[a-z0-9-]+" defaultValue="review-layouts" title="Use lowercase letters, numbers, or hyphens." hint="Use lowercase letters, numbers, or hyphens." /></GridItem><GridItem span={1}><Select label="Review policy" name="policy" required defaultValue=""><option value="">Choose a policy</option><option value="team">Team review</option><option value="owner">Owner review</option></Select></GridItem><GridItem span={1}><Checkbox label="Include the review summary" name="includeSummary" defaultChecked /></GridItem></Grid></Fieldset></Form><Text size="body" className="form-demo-feedback" role="status">{result || 'No branch settings submitted.'}</Text></div>
  </Showcase>;
}

function MixedSections() {
  const [result, setResult] = useState('');
  return <Showcase title="Combine label layouts within one form" description="Each FormLayout chooses its own label arrangement. The fields still belong to one native form." code={exampleCode('Button, Fieldset, Form, FormLayout, Grid, GridItem, Select, TextArea, TextField, Text', `export function MixedSections() {
  const [result, setResult] = useState('');
  return <div className="form-demo-stack">
    <Form aria-label="Mixed section example" onReset={() => setResult('')}
      onSubmit={event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setResult(String(values.get('workspace')) + ' · Notes: ' + String(values.get('notes')));
      }} actions={<>
        <Button type="submit" size="sm">Save both sections</Button>
        <Button type="reset" size="sm" variant="secondary">Reset sections</Button>
      </>}>
      <Fieldset legend="Workspace identity">
        <FormLayout layout="horizontal">
          <Grid columns={1} gap={4}>
            <GridItem span={1}><TextField label="Workspace" name="workspace" defaultValue="Sample workspace" required /></GridItem>
            <GridItem span={1}><Select label="Access" name="access" defaultValue="team">
              <option value="team">Team members</option><option value="private">Private</option>
            </Select></GridItem>
          </Grid>
        </FormLayout>
      </Fieldset>
      <Fieldset legend="Review notes">
        <FormLayout layout="vertical"><Grid columns={1} gap={4}><GridItem span={1}>
          <TextArea label="Notes for the next reviewer" name="notes" rows={3}
            defaultValue="Check the narrow layout as well." />
        </GridItem></Grid></FormLayout>
      </Fieldset>
    </Form>
    <Text size="body" className="form-demo-feedback" role="status">{result || 'Both sections save together.'}</Text>
  </div>;
}`)}>
    <div className="form-demo-stack"><Form aria-label="Mixed section example" onReset={() => setResult('')} onSubmit={event => { event.preventDefault(); const values = new FormData(event.currentTarget); setResult(String(values.get('workspace')) + ' · Notes: ' + String(values.get('notes'))); }} actions={<><Button type="submit" size="sm">Save both sections</Button><Button type="reset" size="sm" variant="secondary">Reset sections</Button></>}><Fieldset legend="Workspace identity"><FormLayout layout="horizontal"><Grid columns={1} gap={4}><GridItem span={1}><TextField label="Workspace" name="workspace" defaultValue="Sample workspace" required /></GridItem><GridItem span={1}><Select label="Access" name="access" defaultValue="team"><option value="team">Team members</option><option value="private">Private</option></Select></GridItem></Grid></FormLayout></Fieldset><Fieldset legend="Review notes"><FormLayout layout="vertical"><Grid columns={1} gap={4}><GridItem span={1}><TextArea label="Notes for the next reviewer" name="notes" rows={3} defaultValue="Check the narrow layout as well." /></GridItem></Grid></FormLayout></Fieldset></Form><Text size="body" className="form-demo-feedback" role="status">{result || 'Both sections save together.'}</Text></div>
  </Showcase>;
}

function GroupedAddress() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState('');
  const clear = (field: HTMLInputElement | HTMLTextAreaElement) => {
    if (errors[field.name] && field.validity.valid) setErrors(previous => { const next = { ...previous }; delete next[field.name]; return next; });
  };
  return <Showcase title="Group controls with per-field validation" description="Fieldset groups the address under one legend. Each field retains its own label, hint, and validation message." code={exampleCode('Button, Fieldset, Form, FormLayout, Grid, GridItem, TextArea, TextField, Text', `export function GroupedAddress() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState('');
  const clear = (field: HTMLInputElement | HTMLTextAreaElement) => {
    if (errors[field.name] && field.validity.valid) setErrors(previous => {
      const next = { ...previous }; delete next[field.name]; return next;
    });
  };
  return <div className="form-demo-stack">
    <Form aria-label="Grouped address example" noValidate
      onReset={() => { setErrors({}); setSaved(''); }} onSubmit={event => {
        event.preventDefault();
        const form = event.currentTarget;
        const next: Record<string, string> = {};
        for (const field of Array.from(form.elements)) {
          if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)
            && !field.validity.valid) next[field.name] = field.name === 'street'
              ? 'Enter the street address.' : 'Enter the city or locality.';
        }
        setErrors(next); setSaved('');
        if (Object.keys(next).length) {
          const first = form.elements.namedItem(Object.keys(next)[0]);
          if (first instanceof HTMLElement) first.focus();
          return;
        }
        const values = new FormData(form);
        setSaved(String(values.get('street')) + ', ' + String(values.get('city'))
          + (values.get('postal') ? ' · ' + String(values.get('postal')) : ''));
      }}>
      <Fieldset legend="Address" description="Each field has its own label, including fields that share a row.">
        <FormLayout layout="vertical" actions={<>
          <Button type="submit" size="sm">Save address</Button>
          <Button type="reset" size="sm" variant="secondary">Reset address</Button>
        </>}>
          <Grid columns={{ base: 1, sm: 2 }} gap={4}>
            <GridItem span="full"><TextArea label="Street address" name="street" rows={2}
              autoComplete="street-address" required error={errors.street}
              onChange={event => clear(event.currentTarget)} /></GridItem>
            <GridItem span={1}><TextField label="City or locality" name="city"
              autoComplete="address-level2" required error={errors.city}
              onChange={event => clear(event.currentTarget)} /></GridItem>
            <GridItem span={1}><TextField label="Postal code" name="postal"
              autoComplete="postal-code" hint="Optional." /></GridItem>
          </Grid>
        </FormLayout>
      </Fieldset>
    </Form>
    {Object.keys(errors).length > 0 && <Text size="body" className="form-demo-feedback" data-error role="alert">Complete the required address fields.</Text>}
    <Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved locally: ' + saved : 'No address saved.'}</Text>
  </div>;
}`)}>
    <div className="form-demo-stack"><Form aria-label="Grouped address example" noValidate onReset={() => { setErrors({}); setSaved(''); }} onSubmit={event => { event.preventDefault(); const form = event.currentTarget; const next: FieldErrors = {}; for (const field of Array.from(form.elements)) { if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && !field.validity.valid) next[field.name] = field.name === 'street' ? 'Enter the street address.' : 'Enter the city or locality.'; } setErrors(next); setSaved(''); if (Object.keys(next).length) { const first = form.elements.namedItem(Object.keys(next)[0]); if (first instanceof HTMLElement) first.focus(); return; } const values = new FormData(form); setSaved(String(values.get('street')) + ', ' + String(values.get('city')) + (values.get('postal') ? ' · ' + String(values.get('postal')) : '')); }}><Fieldset legend="Address" description="Each field has its own label, including fields that share a row."><FormLayout layout="vertical" actions={<><Button type="submit" size="sm">Save address</Button><Button type="reset" size="sm" variant="secondary">Reset address</Button></>}><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span="full"><TextArea label="Street address" name="street" rows={2} autoComplete="street-address" required error={errors.street} onChange={event => clear(event.currentTarget)} /></GridItem><GridItem span={1}><TextField label="City or locality" name="city" autoComplete="address-level2" required error={errors.city} onChange={event => clear(event.currentTarget)} /></GridItem><GridItem span={1}><TextField label="Postal code" name="postal" autoComplete="postal-code" hint="Optional." /></GridItem></Grid></FormLayout></Fieldset></Form>{Object.keys(errors).length > 0 && <Text size="body" className="form-demo-feedback" data-error role="alert">Complete the required address fields.</Text>}<Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved locally: ' + saved : 'No address saved.'}</Text></div>
  </Showcase>;
}

function ResponsiveSection() {
  const [width, setWidth] = useState('640');
  const [saved, setSaved] = useState('');
  return <Showcase title="Use section container breakpoints" description="A horizontal section becomes a vertical stack below 480px of its own width, even on a wide page." code={exampleCode('Button, Form, FormLayout, Grid, GridItem, Select, TextField, Text', `export function ResponsiveSection() {
  const [width, setWidth] = useState(${JSON.stringify(width)});
  const [saved, setSaved] = useState('');
  return <div className="form-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <Select label="Section width" value={width} onChange={event => setWidth(event.currentTarget.value)}>
        <option value="280">Narrow · 280px</option><option value="640">Wide · 640px</option>
        <option value="full">Available space</option>
      </Select>
    </GridItem></Grid>
    <Form aria-label="Responsive section example" onReset={() => setSaved('')}
      onSubmit={event => {
        event.preventDefault(); setSaved(String(new FormData(event.currentTarget).get('reviewer')));
      }}>
      <div className="form-demo-frame" style={{ width: width === 'full' ? '100%' : Number(width) }}>
        <FormLayout layout="horizontal" labelWidth={128} actions={<>
          <Button type="submit" size="sm">Save section</Button>
          <Button type="reset" size="sm" variant="secondary">Reset section</Button>
        </>}>
          <Grid columns={1} gap={4}>
            <GridItem span={1}><TextField label="Reviewer" name="reviewer" defaultValue="Sam Lee" required /></GridItem>
            <GridItem span={1}><TextField label="Team" name="team" defaultValue="Design systems"
              hint="Label layout responds to this section’s container width." /></GridItem>
          </Grid>
        </FormLayout>
      </div>
    </Form>
    <Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved reviewer: ' + saved : 'No section saved.'}</Text>
  </div>;
}`)}>
    <div className="form-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><Select label="Section width" value={width} onChange={event => setWidth(event.currentTarget.value)}><option value="280">Narrow · 280px</option><option value="640">Wide · 640px</option><option value="full">Available space</option></Select></GridItem></Grid><Form aria-label="Responsive section example" onReset={() => setSaved('')} onSubmit={event => { event.preventDefault(); setSaved(String(new FormData(event.currentTarget).get('reviewer'))); }}><div className="form-demo-frame" style={{ width: width === 'full' ? '100%' : Number(width) }}><FormLayout layout="horizontal" labelWidth={128} actions={<><Button type="submit" size="sm">Save section</Button><Button type="reset" size="sm" variant="secondary">Reset section</Button></>}><Grid columns={1} gap={4}><GridItem span={1}><TextField label="Reviewer" name="reviewer" defaultValue="Sam Lee" required /></GridItem><GridItem span={1}><TextField label="Team" name="team" defaultValue="Design systems" hint="Label layout responds to this section’s container width." /></GridItem></Grid></FormLayout></div></Form><Text size="body" className="form-demo-feedback" role="status">{saved ? 'Saved reviewer: ' + saved : 'No section saved.'}</Text></div>
  </Showcase>;
}

export function FormDemo() {
  return <><Text size="body" className="form-demo-intro">Form controls retain visible labels across vertical, horizontal, and inline layouts. The examples use Chartreuse fields and Grid to demonstrate grouped inputs and nested form values.</Text><ExampleGallery className="form-example-gallery"><LayoutChoice /><LongLabels /><InlineFilters /><NativeConstraints /><NestedProfile /></ExampleGallery></>;
}

export function FormLayoutDemo() {
  return <><Text size="body" className="form-demo-intro">FormLayout sets a section’s label arrangement inside a native form. Sections share the enclosing form; Grid controls input groups.</Text><ExampleGallery className="form-example-gallery"><MixedSections /><GroupedAddress /><ResponsiveSection /></ExampleGallery></>;
}
