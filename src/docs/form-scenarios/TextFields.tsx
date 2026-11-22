import { useId, useRef, useState } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';
import { Button, TextArea, TextField } from '../../system/components';
import { Flex } from '../../system/Flex';
import { Grid, GridItem } from '../../system/Grid';
import { ExampleGallery, FormActions, FormScenario, ScenarioForm, formCode } from './shared';
import { Text } from '../../system';
import './text-field-examples.css';

function TextFieldSizes() {
  const sizes = ['sm', 'md', 'lg'] as const;
  const rowStyle = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 5.5rem', alignItems: 'end', gap: 'var(--cr-space-3)' };
  return <FormScenario title="Text field sizes" description="Use the same size on a field and button to match their heights. The default is md."
    code={formCode('Button, TextField', `export function TextFieldSizes() {
  const sizes = ['sm', 'md', 'lg'] as const;
  return sizes.map(size => (
    <form key={size} onSubmit={event => event.preventDefault()} style={{
      display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 5.5rem',
      alignItems: 'end', gap: 'var(--cr-space-3)',
    }}>
      <TextField size={size} label={'Search tasks (' + size + ')'} name="query" type="search" icon={Search} />
      <Button size={size} type="reset" variant="secondary">Clear</Button>
    </form>
  ));
}`, '', "import { Search } from 'lucide-react';")}>
    {sizes.map(size => <ScenarioForm key={size} onSubmit={event => event.preventDefault()} style={rowStyle}>
      <TextField size={size} label={`Search tasks (${size})`} name="query" type="search" icon={Search} />
      <Button size={size} type="reset" variant="secondary">Clear</Button>
    </ScenarioForm>)}
  </FormScenario>;
}

function ControlledTextField() {
  const [name, setName] = useState('');
  return <FormScenario title="Controlled input" description="Store the input value in React state and update it on change."
    code={formCode("TextField, Text", `export function TaskNameExample() {
  const [name, setName] = useState('');
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <TextField label="Task name" name="taskName" value={name} onChange={event => setName(event.target.value)} hint="Name the change or investigation." placeholder="Review the API" />
    <Text size="body" style={{ margin: 0 }}>Draft: {name || 'No task name entered.'}</Text>
  </div>;
}`, 'useState')}>
    <TextField label="Task name" name="taskName" value={name} onChange={event => setName(event.target.value)} hint="Name the change or investigation." placeholder="Review the API" />
    <Text size="body" className="form-scenario-feedback">Draft: {name || 'No task name entered.'}</Text>
  </FormScenario>;
}

function BranchValidation() {
  const [branch, setBranch] = useState('my new branch');
  const [error, setError] = useState('Use letters, numbers, or hyphens.');
  return <FormScenario title="Validation on blur" description="Clear the error on change and validate the example branch format on blur."
    code={formCode('TextField', `export function BranchExample() {
  const [branch, setBranch] = useState('my new branch');
  const [error, setError] = useState('Use letters, numbers, or hyphens.');
  return <TextField label="Branch" name="branch" value={branch}
    onChange={event => { setBranch(event.target.value); setError(''); }}
    onBlur={() => setError(/^[a-zA-Z0-9-]+$/.test(branch)
      ? '' : 'Use letters, numbers, or hyphens.')}
    hint="Use letters, numbers, and hyphens in the branch name."
    error={error} spellCheck={false} autoCapitalize="none" />;
}`, 'useState')}>
    <TextField label="Branch" name="branch" value={branch} onChange={event => { setBranch(event.target.value); setError(''); }} onBlur={() => setError(/^[a-zA-Z0-9-]+$/.test(branch) ? '' : 'Use letters, numbers, or hyphens.')} hint="Use letters, numbers, and hyphens in the branch name." error={error} spellCheck={false} autoCapitalize="none" />
  </FormScenario>;
}

function PrefixForm() {
  const [saved, setSaved] = useState('');
  return <FormScenario title="Native validation and form reset" description="Submit a named field with required, length, and pattern constraints. Reset restores the default value."
    code={formCode("TextField, Button, Text", `export function PrefixFormExample() {
  const [saved, setSaved] = useState('');
  return <form onReset={() => setSaved('')} onSubmit={event => {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('prefix') || ''));
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextField label="Project prefix" name="prefix" defaultValue="TASK" required minLength={2} maxLength={8} pattern="[A-Z](?:[A-Z0-9]|-)*" title="Start with an uppercase letter; use uppercase letters, numbers, or hyphens." hint="2–8 characters. Start with an uppercase letter." spellCheck={false} autoCapitalize="characters" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button type="submit">Save prefix</Button>
        <Button type="reset" variant="secondary">Reset prefix</Button>
      </div>
      <Text size="body" role="status" style={{ margin: 0 }}>{saved ? 'Saved prefix: ' + saved : 'No prefix saved yet.'}</Text>
    </div>
  </form>;
}`, 'useState')}>
    <ScenarioForm className="form-scenario-form" aria-label="Project prefix example" onReset={() => setSaved('')} onSubmit={event => { event.preventDefault(); setSaved(String(new FormData(event.currentTarget).get('prefix') || '')); }}>
      <TextField label="Project prefix" name="prefix" defaultValue="TASK" required minLength={2} maxLength={8} pattern="[A-Z](?:[A-Z0-9]|-)*" title="Start with an uppercase letter; use uppercase letters, numbers, or hyphens." hint="2–8 characters. Start with an uppercase letter." spellCheck={false} autoCapitalize="characters" />
      <FormActions><Button type="submit">Save prefix</Button><Button type="reset" variant="secondary">Reset prefix</Button></FormActions>
      <Text size="body" className="form-scenario-feedback" role="status">{saved ? 'Saved prefix: ' + saved : 'No prefix saved yet.'}</Text>
    </ScenarioForm>
  </FormScenario>;
}


function PasswordVisibility() {
  const id = useId();
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  return <FormScenario title="Password visibility" description="Toggle the native input type between password and text while retaining the same input element."
    code={formCode('Button, Flex, Grid, GridItem, TextField', `export function PasswordVisibilityExample() {
  const id = useId();
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  return <Flex direction="column" gap={4}>
    <Grid columns={1} gap={4}><GridItem span={1}>
      <TextField id={id} label="Example password" name="examplePassword"
        type={visible ? 'text' : 'password'} value={password}
        onChange={event => setPassword(event.currentTarget.value)}
        autoComplete="new-password" spellCheck={false}
        hint="Show password displays this field as plain text." />
    </GridItem></Grid>
    <Flex wrap gap={3}>
      <Button variant="secondary" icon={visible ? EyeOff : Eye}
        aria-controls={id} aria-pressed={visible}
        onClick={() => setVisible(current => !current)}>
        {visible ? 'Hide password' : 'Show password'}
      </Button>
    </Flex>
  </Flex>;
}`, 'useId, useState', "import { Eye, EyeOff } from 'lucide-react';")}>
    <Flex direction="column" gap={4}>
      <Grid columns={1} gap={4}><GridItem span={1}><TextField id={id} label="Example password" name="examplePassword" type={visible ? 'text' : 'password'} value={password} onChange={event => setPassword(event.currentTarget.value)} autoComplete="new-password" spellCheck={false} hint="Show password displays this field as plain text." /></GridItem></Grid>
      <Flex wrap gap={3}><Button variant="secondary" icon={visible ? EyeOff : Eye} aria-controls={id} aria-pressed={visible} onClick={() => setVisible(current => !current)}>{visible ? 'Hide password' : 'Show password'}</Button></Flex>
    </Flex>
  </FormScenario>;
}

function ClearableQuery() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('review notes');
  return <FormScenario title="Clear and refocus a field" description="Clear the controlled value, then return focus through the input ref."
    code={formCode('Button, Flex, Grid, GridItem, TextField', `export function ClearableQueryExample() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('review notes');
  return <Flex direction="column" gap={4}>
    <Grid columns={1} gap={4}><GridItem span={1}>
      <TextField ref={input} id={id} label="Task filter" name="taskFilter"
        value={query} onChange={event => setQuery(event.currentTarget.value)}
        hint="Clear the field to enter another filter." />
    </GridItem></Grid>
    <Flex wrap gap={3}>
      <Button variant="secondary" icon={X} aria-controls={id} disabled={!query}
        onClick={() => { setQuery(''); input.current?.focus(); }}>
        Clear task filter
      </Button>
    </Flex>
  </Flex>;
}`, 'useId, useRef, useState', "import { X } from 'lucide-react';")}>
    <Flex direction="column" gap={4}>
      <Grid columns={1} gap={4}><GridItem span={1}><TextField ref={input} id={id} label="Task filter" name="taskFilter" value={query} onChange={event => setQuery(event.currentTarget.value)} hint="Clear the field to enter another filter." /></GridItem></Grid>
      <Flex wrap gap={3}><Button variant="secondary" icon={X} aria-controls={id} disabled={!query} onClick={() => { setQuery(''); input.current?.focus(); }}>Clear task filter</Button></Flex>
    </Flex>
  </FormScenario>;
}

function LimitedTitle() {
  const [title, setTitle] = useState('');
  const maxLength = 40;
  return <FormScenario title="Input length limit and counter" description="Use maxLength and String.length to apply and display the same UTF-16 code-unit limit."
    code={formCode('Grid, GridItem, TextField', `export function LimitedTitleExample() {
  const [title, setTitle] = useState('');
  const maxLength = 40;
  return <Grid columns={1} gap={4}><GridItem span={1}>
    <TextField label="Short task title" name="shortTitle" value={title}
      onChange={event => setTitle(event.currentTarget.value)} maxLength={maxLength}
      hint={title.length + ' / ' + maxLength + ' UTF-16 code units used.'}
      placeholder="Review API error handling" />
  </GridItem></Grid>;
}`, 'useState')}>
    <Grid columns={1} gap={4}><GridItem span={1}><TextField label="Short task title" name="shortTitle" value={title} onChange={event => setTitle(event.currentTarget.value)} maxLength={maxLength} hint={`${title.length} / ${maxLength} UTF-16 code units used.`} placeholder="Review API error handling" /></GridItem></Grid>
  </FormScenario>;
}

const localTasks = ['Review the API', 'Write the tests', 'Review the examples'];
const searchExampleCss = `.input-example-status { margin: 0; color: var(--cr-color-muted); font-size: 13px; line-height: 1.8; }
.input-example-results { margin: 0; padding-inline-start: 20px; color: var(--cr-color-text); font-size: 13px; line-height: 1.8; }`;

function SubmittedSearch() {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<string[] | null>(null);
  return <FormScenario title="Submit a search form" description="Submit with Enter or Search tasks. Filter a local task array after submission."
    code={formCode('Button, Flex, Grid, GridItem, TextField, Text', `const tasks = ${JSON.stringify(localTasks, null, 2)};

export function SubmittedSearchExample() {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<string[] | null>(null);
  return <search>
    <form aria-label="Local task search" onReset={() => { setQuery(''); setMatches(null); }}
      onSubmit={event => {
        event.preventDefault();
        const term = String(new FormData(event.currentTarget).get('searchQuery') || '').trim().toLowerCase();
        setMatches(tasks.filter(task => task.toLowerCase().includes(term)));
      }}>
      <Flex direction="column" gap={4}>
        <Grid columns={1} gap={4}><GridItem span={1}>
          <TextField label="Search local tasks" name="searchQuery" type="search"
            icon={Search} value={query} onChange={event => setQuery(event.currentTarget.value)}
            hint="Search for review or tests. An empty query returns every task." />
        </GridItem></Grid>
        <Flex wrap gap={3}>
          <Button type="submit" icon={Search}>Search tasks</Button>
          <Button type="reset" variant="secondary">Reset task search</Button>
        </Flex>
        <Text size="body" className="input-example-status" role="status">
          {matches === null ? 'Submit a query to display matching tasks.'
            : matches.length + ' task' + (matches.length === 1 ? '' : 's') + ' matched the last search.'}
        </Text>
        {!!matches?.length && <ul className="input-example-results">
          {matches.map(task => <li key={task}>{task}</li>)}
        </ul>}
      </Flex>
    </form>
  </search>;
}

/* Example styles:
${searchExampleCss}
*/`, 'useState', "import { Search } from 'lucide-react';")}>
    <search><ScenarioForm aria-label="Local task search" onReset={() => { setQuery(''); setMatches(null); }} onSubmit={event => { event.preventDefault(); const term = String(new FormData(event.currentTarget).get('searchQuery') || '').trim().toLowerCase(); setMatches(localTasks.filter(task => task.toLowerCase().includes(term))); }}>
      <Flex direction="column" gap={4}>
        <Grid columns={1} gap={4}><GridItem span={1}><TextField label="Search local tasks" name="searchQuery" type="search" icon={Search} value={query} onChange={event => setQuery(event.currentTarget.value)} hint="Search for review or tests. An empty query returns every task." /></GridItem></Grid>
        <Flex wrap gap={3}><Button type="submit" icon={Search}>Search tasks</Button><Button type="reset" variant="secondary">Reset task search</Button></Flex>
        <Text size="body" className="input-example-status" role="status">{matches === null ? 'Submit a query to display matching tasks.' : `${matches.length} task${matches.length === 1 ? '' : 's'} matched the last search.`}</Text>
        {!!matches?.length && <ul className="input-example-results">{matches.map(task => <li key={task}>{task}</li>)}</ul>}
      </Flex>
    </ScenarioForm></search>
  </FormScenario>;
}

function FocusActions() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  return <FormScenario title="Focus and select through a ref" description="Call focus() or select() on the native input element."
    code={formCode('Button, Flex, Grid, GridItem, TextField', `export function FocusActionsExample() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  return <Flex direction="column" gap={4}>
    <Grid columns={1} gap={4}><GridItem span={1}>
      <TextField ref={input} id={id} label="Editable review query" name="reviewQuery"
        defaultValue="Review the layout" hint="Focus the field or select its current value." />
    </GridItem></Grid>
    <Flex wrap gap={3}>
      <Button variant="secondary" aria-controls={id}
        onClick={() => input.current?.focus()}>Focus review query</Button>
      <Button variant="secondary" aria-controls={id}
        onClick={() => { input.current?.focus(); input.current?.select(); }}>Select review query</Button>
    </Flex>
  </Flex>;
}`, 'useId, useRef')}>
    <Flex direction="column" gap={4}>
      <Grid columns={1} gap={4}><GridItem span={1}><TextField ref={input} id={id} label="Editable review query" name="reviewQuery" defaultValue="Review the layout" hint="Focus the field or select its current value." /></GridItem></Grid>
      <Flex wrap gap={3}><Button variant="secondary" aria-controls={id} onClick={() => input.current?.focus()}>Focus review query</Button><Button variant="secondary" aria-controls={id} onClick={() => { input.current?.focus(); input.current?.select(); }}>Select review query</Button></Flex>
    </Flex>
  </FormScenario>;
}

function FullWidthTextField() {
  const rowStyle = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };
  return <FormScenario title="Full-width input" description="In a flex row, a field is only as wide as its control. Set fullWidth to fill the remaining space."
    code={formCode('Button, TextField', `const rowStyle = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };

<>
  <div style={rowStyle}>
    <TextField label="Email (default width)" name="email" type="email" />
    <Button variant="secondary">Invite</Button>
  </div>
  <div style={rowStyle}>
    <TextField label="Email (fullWidth)" name="email" type="email" fullWidth />
    <Button variant="secondary">Invite</Button>
  </div>
</>`)}>
    <div style={rowStyle}><TextField label="Email (default width)" name="email" type="email" /><Button variant="secondary">Invite</Button></div>
    <div style={rowStyle}><TextField label="Email (fullWidth)" name="email" type="email" fullWidth /><Button variant="secondary">Invite</Button></div>
  </FormScenario>;
}

export function TextFieldScenarios() {
  return <ExampleGallery className="form-scenarios">
    <TextFieldSizes />
    <ControlledTextField />
    <FormScenario title="Search input with an icon" description="Render a labeled native search input with a decorative leading icon."
      code={formCode('TextField', `<TextField label="Find a task" name="taskQuery" type="search"
  icon={Search} placeholder="Search tasks…"
  hint="The icon does not replace the field label." autoComplete="off" />`, '', "import { Search } from 'lucide-react';")}>
      <TextField label="Find a task" name="taskQuery" type="search" icon={Search} placeholder="Search tasks…" hint="The icon does not replace the field label." autoComplete="off" />
    </FormScenario>
    <BranchValidation />
    <FormScenario title="Disabled input" description="Display a value in a field excluded from focus and form submission."
      code={formCode('TextField', `<TextField label="Repository" name="repository" defaultValue="sample-app"
  disabled hint="This repository is managed by the workspace." />`)}>
      <TextField label="Repository" name="repository" defaultValue="sample-app" disabled hint="This repository is managed by the workspace." />
    </FormScenario>
    <FormScenario title="Read-only input" description="Keep the value selectable and available to native form submission."
      code={formCode('TextField', `<TextField label="Workspace identifier" name="workspaceId"
  defaultValue="TASK-024" readOnly
  hint="Select and copy the workspace identifier." />`)}>
      <TextField label="Workspace identifier" name="workspaceId" defaultValue="TASK-024" readOnly hint="Select and copy the workspace identifier." />
    </FormScenario>
    <FullWidthTextField />
    <PrefixForm />
    <PasswordVisibility />
    <ClearableQuery />
    <LimitedTitle />
    <SubmittedSearch />
    <FocusActions />
  </ExampleGallery>;
}

function ControlledNotes() {
  const [notes, setNotes] = useState('');
  return <FormScenario title="Controlled textarea" description="Store multiline text in React state and display its String.length count."
    code={formCode("TextArea, Text", `export function NotesExample() {
  const [notes, setNotes] = useState('');
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <TextArea label="Workspace notes" name="workspaceNotes" rows={4} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Describe the change and its constraints…" hint="Record the change, constraints, and verification results." />
    <Text size="body" style={{ margin: 0 }}>{notes.length} UTF-16 code units in this draft.</Text>
  </div>;
}`, 'useState')}>
    <TextArea label="Workspace notes" name="workspaceNotes" rows={4} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Describe the change and its constraints…" hint="Record the change, constraints, and verification results." />
    <Text size="body" className="form-scenario-feedback">{notes.length} UTF-16 code units in this draft.</Text>
  </FormScenario>;
}

function SummaryValidation() {
  const [summary, setSummary] = useState('Too short.');
  const [error, setError] = useState('Enter a summary with a trimmed length of at least 20.');
  return <FormScenario title="Textarea validation on blur" description="Validate the trimmed value with String.length on blur; clear the error on change."
    code={formCode('TextArea', `export function SummaryExample() {
  const [summary, setSummary] = useState('Too short.');
  const [error, setError] = useState('Enter a summary with a trimmed length of at least 20.');
  return <TextArea label="Review summary" name="reviewSummary" rows={3}
    value={summary} maxLength={240}
    onChange={event => { setSummary(event.target.value); setError(''); }}
    onBlur={() => setError(summary.trim().length >= 20
      ? '' : 'Enter a summary with a trimmed length of at least 20.')}
    hint="Maximum length: 240 UTF-16 code units." error={error} />;
}`, 'useState')}>
    <TextArea label="Review summary" name="reviewSummary" rows={3} value={summary} maxLength={240} onChange={event => { setSummary(event.target.value); setError(''); }} onBlur={() => setError(summary.trim().length >= 20 ? '' : 'Enter a summary with a trimmed length of at least 20.')} hint="Maximum length: 240 UTF-16 code units." error={error} />
  </FormScenario>;
}

function DecisionForm() {
  const [saved, setSaved] = useState('');
  return <FormScenario title="Textarea in a native form" description="Read the named value through FormData and restore defaultValue on form reset."
    code={formCode("TextArea, Button, Text", `export function DecisionExample() {
  const [saved, setSaved] = useState('');
  return <form onReset={() => setSaved('')} onSubmit={event => {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('decision') || ''));
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextArea label="Decision note" name="decision" rows={3} required defaultValue="Keep the review notes with the task." />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button type="submit">Save decision</Button>
        <Button type="reset" variant="secondary">Reset decision</Button>
      </div>
      <Text size="body" role="status" style={{ margin: 0 }}>{saved ? 'Saved decision: ' + saved : 'No decision saved yet.'}</Text>
    </div>
  </form>;
}`, 'useState')}>
    <ScenarioForm className="form-scenario-form" aria-label="Decision note example" onReset={() => setSaved('')} onSubmit={event => { event.preventDefault(); setSaved(String(new FormData(event.currentTarget).get('decision') || '')); }}>
      <TextArea label="Decision note" name="decision" rows={3} required defaultValue="Keep the review notes with the task." />
      <FormActions><Button type="submit">Save decision</Button><Button type="reset" variant="secondary">Reset decision</Button></FormActions>
      <Text size="body" className="form-scenario-feedback" role="status">{saved ? 'Saved decision: ' + saved : 'No decision saved yet.'}</Text>
    </ScenarioForm>
  </FormScenario>;
}


function LimitedNotes() {
  const id = useId();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const initialNote = 'Record the constraints and test results with the task.';
  const [note, setNote] = useState(initialNote);
  const maxLength = 160;
  return <FormScenario title="Textarea length limit and actions" description="Retain native resizing with a length counter. Clear returns focus; Reset restores the initial note."
    code={formCode('Button, Flex, Grid, GridItem, TextArea', `export function LimitedNotesExample() {
  const id = useId();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const initialNote = 'Record the constraints and test results with the task.';
  const [note, setNote] = useState(initialNote);
  const maxLength = 160;
  return <Flex direction="column" gap={4}>
    <Grid columns={1} gap={4}><GridItem span={1}>
      <TextArea ref={textarea} id={id} label="Short handoff note" name="handoffNote"
        rows={4} value={note} maxLength={maxLength}
        onChange={event => setNote(event.currentTarget.value)}
        hint={note.length + ' / ' + maxLength + ' UTF-16 code units used.'} />
    </GridItem></Grid>
    <Flex wrap gap={3}>
      <Button variant="secondary" aria-controls={id} disabled={!note}
        onClick={() => { setNote(''); textarea.current?.focus(); }}>Clear handoff note</Button>
      <Button variant="secondary" aria-controls={id}
        onClick={() => setNote(initialNote)}>Reset handoff note</Button>
    </Flex>
  </Flex>;
}`, 'useId, useRef, useState')}>
    <Flex direction="column" gap={4}>
      <Grid columns={1} gap={4}><GridItem span={1}><TextArea ref={textarea} id={id} label="Short handoff note" name="handoffNote" rows={4} value={note} maxLength={maxLength} onChange={event => setNote(event.currentTarget.value)} hint={`${note.length} / ${maxLength} UTF-16 code units used.`} /></GridItem></Grid>
      <Flex wrap gap={3}><Button variant="secondary" aria-controls={id} disabled={!note} onClick={() => { setNote(''); textarea.current?.focus(); }}>Clear handoff note</Button><Button variant="secondary" aria-controls={id} onClick={() => setNote(initialNote)}>Reset handoff note</Button></Flex>
    </Flex>
  </FormScenario>;
}

function FullWidthTextArea() {
  const rowStyle = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };
  return <FormScenario title="Full-width textarea" description="In a flex row, a field is only as wide as its control. Set fullWidth to fill the remaining space."
    code={formCode('Button, TextArea', `const rowStyle = { display: 'flex', alignItems: 'end', gap: 'var(--cr-space-3)' };

<>
  <div style={rowStyle}>
    <TextArea label="Comment (default width)" name="comment" rows={2} />
    <Button variant="secondary">Post</Button>
  </div>
  <div style={rowStyle}>
    <TextArea label="Comment (fullWidth)" name="comment" rows={2} fullWidth />
    <Button variant="secondary">Post</Button>
  </div>
</>`)}>
    <div style={rowStyle}><TextArea label="Comment (default width)" name="comment" rows={2} /><Button variant="secondary">Post</Button></div>
    <div style={rowStyle}><TextArea label="Comment (fullWidth)" name="comment" rows={2} fullWidth /><Button variant="secondary">Post</Button></div>
  </FormScenario>;
}

export function TextAreaScenarios() {
  return <ExampleGallery className="form-scenarios">
    <ControlledNotes />
    <SummaryValidation />
    <FullWidthTextArea />
    <FormScenario title="Read-only textarea" description="Allow text selection and native resizing while preventing edits."
      code={formCode('TextArea', `<TextArea label="Archived review notes" name="archivedNotes" rows={3}
  defaultValue="The decision is recorded with the task. Keep it for the next review."
  readOnly hint="You can select this text without changing the record." />`)}>
      <TextArea label="Archived review notes" name="archivedNotes" rows={3} defaultValue="The decision is recorded with the task. Keep it for the next review." readOnly hint="You can select this text without changing the record." />
    </FormScenario>
    <FormScenario title="Disabled textarea" description="Display a value in a textarea excluded from focus and form submission."
      code={formCode('TextArea', `<TextArea label="Managed notes" name="managedNotes" rows={3}
  defaultValue="These notes are maintained by the workspace." disabled
  hint="Editing is unavailable in this example." />`)}>
      <TextArea label="Managed notes" name="managedNotes" rows={3} defaultValue="These notes are maintained by the workspace." disabled hint="Editing is unavailable in this example." />
    </FormScenario>
    <DecisionForm />
    <LimitedNotes />
  </ExampleGallery>;
}
