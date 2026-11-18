import { useEffect, useId, useRef, useState } from 'react';
import { Check, Layers, Plus, Trash2 } from 'lucide-react';
import { Alert, Badge, Button, Checkbox, EmptyState, IconButton, Select, Switch, TextField, useToast } from '../system/components';
import { Fieldset } from '../system/Fieldset';
import { Grid, GridItem } from '../system/Grid';
import { ExampleGallery, Showcase } from './shared';
import { GuidanceNotes } from './GuidanceNotes';
import { componentReferences } from './reference';
import './FieldsetPage.css';

interface GuidanceRule {
  id: string;
  title: string;
  mode: 'guidance' | 'requirement';
  status: 'draft' | 'active' | 'paused';
  repository: string;
}
const firstRule: GuidanceRule = { id: 'rule-1', title: 'Reuse the assessment test helpers', mode: 'guidance', status: 'draft', repository: '' };

const relatedControlsCode = `import { Fieldset, Grid, GridItem, Select, TextField } from '@chartreuse/ui';

<Fieldset legend="Task context"
  description="Repository and visibility values belong to the task context group."
  hint="The legend provides the accessible name for this group.">
  <Grid columns={1} gap={4}>
    <GridItem span={1}>
      <TextField label="Task repository" name="taskRepository"
        defaultValue="sample-app" />
    </GridItem>
    <GridItem span={1}>
      <Select label="Task visibility" name="taskVisibility" defaultValue="team">
        <option value="team">Team workspace</option>
        <option value="private">Private draft</option>
      </Select>
    </GridItem>
  </Grid>
</Fieldset>`;

function DisabledGroupExample() {
  const [disabled, setDisabled] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  return <Showcase title="Native fieldset disabled behavior" description="The fieldset disables its inputs and header action together. Disabled values are omitted from FormData."
    code={`import { useState } from 'react';
import { Button, Checkbox, Fieldset, Grid, GridItem, Switch, TextField } from '@chartreuse/ui';

export function DisabledGroupExample() {
  const [disabled, setDisabled] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  return <>
    <Switch label="Disable managed group" checked={disabled}
      onChange={event => setDisabled(event.target.checked)} />
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      onReset={() => setResult(null)} onSubmit={event => {
      event.preventDefault();
      const values = Array.from(new FormData(event.currentTarget).entries());
      setResult(values.length ? JSON.stringify(Object.fromEntries(values))
        : 'No enabled group values were submitted.');
    }}>
      <Fieldset legend="Managed review settings" disabled={disabled}
            description="disabled applies to descendant controls, including the reset action."
            actions={<Button type="reset" variant="ghost" size="sm">Reset managed fields</Button>}>
            <Grid columns={1} gap={4}>
              <GridItem span={1}><TextField label="Managed task prefix"
                name="managedPrefix" defaultValue="TASK" /></GridItem>
              <GridItem span={1}><Checkbox label="Keep supporting evidence"
                name="keepEvidence" value="yes" defaultChecked /></GridItem>
            </Grid>
      </Fieldset>
      <div><Button type="submit">Read group values</Button></div>
      <p role="status" style={{ margin: 0, overflowWrap: 'anywhere' }}>
        {result ?? 'Submit to inspect enabled field values in FormData.'}
      </p>
    </form>
  </>;
}`}>
    <div className="fieldset-demo" style={{ maxInlineSize: 520 }}>
      <div className="fieldset-demo-toolbar"><Switch label="Disable managed group" checked={disabled} onChange={event => setDisabled(event.target.checked)} /></div>
      <form className="fieldset-demo-form fieldset-demo-form-compact" aria-label="Disabled fieldset example" onReset={() => setResult(null)} onSubmit={event => {
        event.preventDefault();
        const values = Array.from(new FormData(event.currentTarget).entries());
        setResult(values.length ? JSON.stringify(Object.fromEntries(values)) : 'No enabled group values were submitted.');
      }}>
        <Fieldset legend="Managed review settings" disabled={disabled} description="disabled applies to descendant controls, including the reset action." actions={<Button type="reset" variant="ghost" size="sm">Reset managed fields</Button>}>
            <Grid columns={1} gap={4}>
              <GridItem span={1}><TextField label="Managed task prefix" name="managedPrefix" defaultValue="TASK" /></GridItem>
              <GridItem span={1}><Checkbox label="Keep supporting evidence" name="keepEvidence" value="yes" defaultChecked /></GridItem>
            </Grid>
        </Fieldset>
        <div className="fieldset-demo-actions"><Button type="submit">Read group values</Button></div>
        <p className="fieldset-example-status" role="status" style={{ margin: 0, overflowWrap: 'anywhere' }}>{result ?? 'Submit to inspect enabled field values in FormData.'}</p>
      </form>
    </div>
  </Showcase>;
}

const ruleEditorCode = `import { useEffect, useId, useRef, useState } from 'react';
import { Check, Layers, Plus, Trash2 } from 'lucide-react';
import { Alert, Badge, Button, EmptyState, Fieldset, Grid, GridItem,
  IconButton, Select, Switch, TextField } from '@chartreuse/ui';

interface GuidanceRule {
  id: string;
  title: string;
  mode: 'guidance' | 'requirement';
  status: 'draft' | 'active' | 'paused';
  repository: string;
}

export function GuidanceRuleEditor() {
  const [rules, setRules] = useState<GuidanceRule[]>([{
    id: 'rule-1', title: 'Reuse the assessment test helpers',
    mode: 'guidance', status: 'draft', repository: '',
  }]);
  const [disabled, setDisabled] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const nextId = useRef(2);
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const addButton = useRef<HTMLButtonElement>(null);
  const focusAfterChange = useRef<string | null>(null);
  const formId = useId();

  useEffect(() => {
    const id = focusAfterChange.current;
    focusAfterChange.current = null;
    if (id === 'add') addButton.current?.focus();
    else if (id) inputs.current.get(id)?.focus();
  }, [rules]);

  const update = (id: string, patch: Partial<GuidanceRule>) => {
    setRules(previous => previous.map(rule => rule.id === id ? { ...rule, ...patch } : rule));
    setSavedCount(null);
  };
  const add = () => {
    const id = 'rule-' + nextId.current++;
    focusAfterChange.current = id;
    setRules(previous => [...previous, {
      id, title: '', mode: 'guidance', status: 'draft', repository: '',
    }]);
    setSavedCount(null);
    setAnnouncement('Guidance rule added; focus moved to its title input.');
  };
  const remove = (id: string) => {
    const index = rules.findIndex(rule => rule.id === id);
    const remaining = rules.filter(rule => rule.id !== id);
    focusAfterChange.current = remaining[Math.min(index, remaining.length - 1)]?.id || 'add';
    setRules(remaining); setSavedCount(null); setAnnouncement('Guidance rule removed; focus moved to the next available control.');
  };

  return <>
    <p>{rules.length} {rules.length === 1 ? 'rule' : 'rules'} in this example</p>
    <Switch label="Disable groups" checked={disabled}
      onChange={event => setDisabled(event.target.checked)} />
    <form style={{ display: 'flex', flexDirection: 'column', gap: 24 }} onSubmit={event => {
      event.preventDefault(); setSavedCount(rules.length); setAnnouncement('');
    }}>
      {rules.map((rule, index) => {
        const modeHint = formId + '-' + rule.id + '-mode-hint';
        return <Fieldset key={rule.id} name={rule.id}
          legend={'Guidance rule ' + (index + 1)} disabled={disabled}
          description={<>{rule.repository || 'All repositories'} ·
            <Badge tone={rule.status === 'active' ? 'success'
              : rule.status === 'paused' ? 'warning' : 'neutral'}>
              {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
            </Badge></>}
          actions={<IconButton icon={Trash2}
            label={'Remove guidance rule ' + (index + 1)} onClick={() => remove(rule.id)} />}>
          <Grid columns={1} gap={4}><GridItem span={1}><TextField label="Title" name={rule.id + '.title'} value={rule.title}
            onChange={event => update(rule.id, { title: event.target.value })}
            ref={element => { if (element) inputs.current.set(rule.id, element);
              else inputs.current.delete(rule.id); }} required
            pattern={'.*\\\\S.*'} title="Use at least one non-space character"
            placeholder="Enter a rule title" /></GridItem>
          <GridItem span={1}><Grid columns={{ base: 1, sm: 2 }} gap={4}>
            <GridItem span={1}><Select label="Mode" name={rule.id + '.mode'}
              value={rule.mode} aria-describedby={modeHint}
              onChange={event => update(rule.id, {
                mode: event.target.value as GuidanceRule['mode'],
              })}>
              <option value="guidance">Guidance</option>
              <option value="requirement">Requirement</option>
            </Select>
              <p id={modeHint} style={{ margin: '8px 0 0' }}>{rule.mode === 'guidance'
                ? 'Record a preferred implementation approach; compliance is advisory.'
                : 'Record an acceptance criterion required for each applicable change.'}</p>
            </GridItem>
            <GridItem span={1}><Select label="Status" name={rule.id + '.status'}
              value={rule.status} onChange={event => update(rule.id, {
                status: event.target.value as GuidanceRule['status'],
              })}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </Select></GridItem>
          </Grid></GridItem>
          <GridItem span={1}><TextField label="Repository" name={rule.id + '.repository'}
            value={rule.repository} onChange={event => update(rule.id, {
              repository: event.target.value,
            })} placeholder="All repositories"
            hint="Leave empty for all repositories, or enter a repository folder name or absolute path." /></GridItem></Grid>
        </Fieldset>;
      })}
      {rules.length === 0 && <EmptyState icon={Layers} title="No guidance rules"
        description="Select Add rule to create an editable fieldset." />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button ref={addButton} icon={Plus} onClick={add} disabled={disabled}>Add rule</Button>
        <Button type="submit" icon={Check} disabled={disabled || !rules.length}>Save rules</Button>
      </div>
    </form>
    <div role="status" aria-atomic="true">{savedCount !== null
      ? <Alert tone="success" title="Guidance rule count saved">
          {savedCount} {savedCount === 1 ? 'rule is' : 'rules are'} recorded in local example state.
        </Alert>
      : announcement && <span>{announcement}</span>}
    </div>
  </>;
}`;

export function FieldsetPage({ showGuidance = true }: { showGuidance?: boolean } = {}) {
  const [rules, setRules] = useState<GuidanceRule[]>([firstRule]);
  const [groupsDisabled, setGroupsDisabled] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const nextId = useRef(2);
  const titleInputs = useRef(new Map<string, HTMLInputElement>());
  const addButton = useRef<HTMLButtonElement>(null);
  const focusAfterChange = useRef<string | null>(null);
  const formId = useId();
  const notify = useToast();

  useEffect(() => {
    const target = focusAfterChange.current;
    if (!target) return;
    focusAfterChange.current = null;
    if (target === 'add') addButton.current?.focus();
    else titleInputs.current.get(target)?.focus();
  }, [rules]);

  const update = (id: string, patch: Partial<GuidanceRule>) => {
    setRules(previous => previous.map(rule => rule.id === id ? { ...rule, ...patch } : rule));
    setSavedCount(null);
  };
  const add = () => {
    const id = `rule-${nextId.current++}`;
    focusAfterChange.current = id;
    setRules(previous => [...previous, { id, title: '', mode: 'guidance', status: 'draft', repository: '' }]);
    setSavedCount(null);
    setAnnouncement('Guidance rule added; focus moved to its title input.');
  };
  const remove = (id: string) => {
    const index = rules.findIndex(rule => rule.id === id);
    const remaining = rules.filter(rule => rule.id !== id);
    focusAfterChange.current = remaining[Math.min(index, remaining.length - 1)]?.id || 'add';
    setRules(remaining); setSavedCount(null); setAnnouncement('Guidance rule removed; focus moved to the next available control.');
  };

  return <>
    <div className="fieldset-page-intro"><p>A native <code>fieldset</code> groups related form controls. Its legend provides the group name; description, hint, and actions supply group-level context.</p><Badge icon={Layers}>Native form grouping</Badge></div>
    <ExampleGallery className="fieldset-page-examples" maxColumns={2}>
    <Showcase title="Legend, description, and hint" description="The legend names the group. Description and hint apply to its related controls." code={relatedControlsCode}>
      <div className="fieldset-demo" style={{ maxInlineSize: 520 }}><Fieldset legend="Task context" description="Repository and visibility values belong to the task context group." hint="The legend provides the accessible name for this group."><Grid columns={1} gap={4}><GridItem span={1}><TextField label="Task repository" name="taskRepository" defaultValue="sample-app" /></GridItem><GridItem span={1}><Select label="Task visibility" name="taskVisibility" defaultValue="team"><option value="team">Team workspace</option><option value="private">Private draft</option></Select></GridItem></Grid></Fieldset></div>
    </Showcase>
    <DisabledGroupExample />
    <Showcase span="full" title="Repeated fieldsets with local editing state" description="Add and remove groups with focus restoration. Submit records the current group count in local state." className="fieldset-showcase" code={ruleEditorCode}>
      <div className="fieldset-demo"><div className="fieldset-demo-toolbar"><span>{rules.length} {rules.length === 1 ? 'rule' : 'rules'} in this example</span><Switch label="Disable groups" checked={groupsDisabled} onChange={event => setGroupsDisabled(event.target.checked)} /></div>
        <form aria-label="Guidance rules example" className="fieldset-demo-form" onSubmit={event => {
          event.preventDefault();
          setSavedCount(rules.length); setAnnouncement(''); notify(`${rules.length} ${rules.length === 1 ? 'rule' : 'rules'} recorded in local example state`);
        }}>
          {rules.map((rule, index) => {
            const modeHint = `${formId}-${rule.id}-mode-hint`;
            return <Fieldset key={rule.id} name={rule.id} legend={`Guidance rule ${index + 1}`} disabled={groupsDisabled} description={<span className="fieldset-rule-meta"><span>{rule.repository || 'All repositories'}</span><span aria-hidden="true">·</span><Badge tone={rule.status === 'active' ? 'success' : rule.status === 'paused' ? 'warning' : 'neutral'}>{rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}</Badge></span>} actions={<IconButton icon={Trash2} label={`Remove guidance rule ${index + 1}`} onClick={() => remove(rule.id)} />}>
              <Grid columns={1} gap={4}><GridItem span={1}><TextField label="Title" name={`${rule.id}.title`} placeholder="Enter a rule title" value={rule.title} onChange={event => update(rule.id, { title: event.target.value })} ref={element => { if (element) titleInputs.current.set(rule.id, element); else titleInputs.current.delete(rule.id); }} required pattern=".*\S.*" title="Use at least one non-space character" /></GridItem>
                <GridItem span={1}><Grid columns={{ base: 1, sm: 2 }} gap={4}><GridItem span={1}><Select label="Mode" name={`${rule.id}.mode`} value={rule.mode} aria-describedby={modeHint} onChange={event => update(rule.id, { mode: event.target.value as GuidanceRule['mode'] })}><option value="guidance">Guidance</option><option value="requirement">Requirement</option></Select><p className="fieldset-mode-hint" id={modeHint}>{rule.mode === 'guidance' ? 'Record a preferred implementation approach; compliance is advisory.' : 'Record an acceptance criterion required for each applicable change.'}</p></GridItem><GridItem span={1}><Select label="Status" name={`${rule.id}.status`} value={rule.status} onChange={event => update(rule.id, { status: event.target.value as GuidanceRule['status'] })}><option value="draft">Draft</option><option value="active">Active</option><option value="paused">Paused</option></Select></GridItem></Grid></GridItem>
                <GridItem span={1}><TextField label="Repository" name={`${rule.id}.repository`} placeholder="All repositories" hint="Leave empty for all repositories, or enter a repository folder name or absolute path." value={rule.repository} onChange={event => update(rule.id, { repository: event.target.value })} /></GridItem>
              </Grid>
            </Fieldset>;
          })}
          {rules.length === 0 && <div className="fieldset-empty"><EmptyState icon={Layers} title="No guidance rules" description="Select Add rule to create an editable fieldset." /></div>}
          <div className="fieldset-demo-actions"><Button ref={addButton} variant="secondary" icon={Plus} onClick={add} disabled={groupsDisabled}>Add rule</Button><Button type="submit" icon={Check} disabled={groupsDisabled || rules.length === 0}>Save rules</Button></div>
        </form>
        <div className="fieldset-example-status" role="status" aria-atomic="true">{savedCount !== null ? <Alert tone="success" title="Guidance rule count saved">{savedCount} {savedCount === 1 ? 'rule is' : 'rules are'} recorded in local example state.</Alert> : announcement && <span>{announcement}</span>}</div>
      </div>
    </Showcase>
    </ExampleGallery>
    {showGuidance && <GuidanceNotes notes={componentReferences.find(reference => reference.name === 'Fieldset')?.notes || []} />}
  </>;
}
