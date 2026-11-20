import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Bell, GitBranch, Save, SlidersHorizontal, Undo2 } from 'lucide-react';
import { Alert, Badge, Button, Fieldset, Flex, Form, FormLayout, Grid, GridItem, PagePanel, Select, Switch, Tabs, TextArea, TextField, WorkspaceContent, Text } from '../../system';
import './settings-pattern.css';

type SettingsTab = 'general' | 'execution' | 'notifications';

interface SettingsDraft {
  workspaceName: string;
  workspaceSlug: string;
  description: string;
  timezone: string;
  startingView: string;
  showArchived: boolean;
  branchPrefix: string;
  isolatedWorktrees: boolean;
  worktreeNaming: string;
  parallelRuns: string;
  retryLimit: string;
  requireReview: boolean;
  emailNotifications: boolean;
  notificationEmail: string;
  runFailures: boolean;
  reviewRequests: boolean;
  dailyDigest: boolean;
  digestTime: string;
}

const initialSettings: SettingsDraft = {
  workspaceName: 'Acme Platform',
  workspaceSlug: 'acme-platform',
  description: 'Shared workspace for services, infrastructure, and release tooling.',
  timezone: 'Asia/Manila',
  startingView: 'board',
  showArchived: false,
  branchPrefix: 'task/',
  isolatedWorktrees: true,
  worktreeNaming: 'task-id',
  parallelRuns: '3',
  retryLimit: '1',
  requireReview: true,
  emailNotifications: true,
  notificationEmail: 'platform@example.com',
  runFailures: true,
  reviewRequests: true,
  dailyDigest: false,
  digestTime: '08:00',
};

const validatedFields = [
  { name: 'workspaceName', tab: 'general', error: 'Enter a workspace name.' },
  { name: 'workspaceSlug', tab: 'general', error: 'Use lowercase letters and numbers, with single hyphens between words.' },
  { name: 'branchPrefix', tab: 'execution', error: 'Use lowercase letters, numbers, and hyphens, ending with a slash.' },
  { name: 'notificationEmail', tab: 'notifications', error: 'Enter an email address in the format team@example.com.' },
] as const;

type ValidatedField = typeof validatedFields[number]['name'];
type FieldErrors = Partial<Record<ValidatedField, string>>;

function readSettingsErrors(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of validatedFields) {
    const control = form.elements.namedItem(field.name);
    if (control instanceof HTMLInputElement && !control.disabled
      && (!control.value.trim() || !control.validity.valid)) errors[field.name] = field.error;
  }
  return errors;
}

export function SettingsPattern() {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFocus = useRef<ValidatedField | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [draft, setDraft] = useState<SettingsDraft>(() => ({ ...initialSettings }));
  const [savedSnapshot, setSavedSnapshot] = useState<SettingsDraft>(() => ({ ...initialSettings }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [announcement, setAnnouncement] = useState('');
  const dirty = (Object.keys(initialSettings) as (keyof SettingsDraft)[])
    .some(key => draft[key] !== savedSnapshot[key]);
  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    if (!pendingFocus.current) return;
    const control = formRef.current?.elements.namedItem(pendingFocus.current);
    if (control instanceof HTMLElement) control.focus();
    pendingFocus.current = null;
  }, [activeTab, errors]);

  function update<K extends keyof SettingsDraft>(field: K, value: SettingsDraft[K], control?: HTMLInputElement) {
    setDraft(previous => ({ ...previous, [field]: value }));
    setAnnouncement('');
    if (control?.validity.valid && control.value.trim()) {
      setErrors(previous => {
        if (!previous[control.name as ValidatedField]) return previous;
        const next = { ...previous };
        delete next[control.name as ValidatedField];
        return next;
      });
    }
    if (field === 'emailNotifications' && value === false) {
      setErrors(previous => {
        const next = { ...previous };
        delete next.notificationEmail;
        return next;
      });
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = readSettingsErrors(event.currentTarget);
    setErrors(nextErrors);
    const firstInvalid = validatedFields.find(field => nextErrors[field.name]);
    if (firstInvalid) {
      pendingFocus.current = firstInvalid.name;
      setActiveTab(firstInvalid.tab);
      setAnnouncement('Review the highlighted fields before saving.');
      return;
    }
    const snapshot = {
      ...draft,
      workspaceName: draft.workspaceName.trim(),
      workspaceSlug: draft.workspaceSlug.trim(),
      branchPrefix: draft.branchPrefix.trim(),
      notificationEmail: draft.notificationEmail.trim(),
    };
    setDraft(snapshot);
    setSavedSnapshot({ ...snapshot });
    setAnnouncement('Settings saved in this example.');
  }

  function discard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pendingFocus.current = null;
    setDraft({ ...savedSnapshot });
    setErrors({});
    setAnnouncement('Draft restored from the last saved settings.');
  }

  const panel = <div className="settings-pattern-frame">
    <PagePanel className="settings-pattern-panel" title="Workspace settings"
      description="Edit project metadata, run defaults, and notification preferences."
      headerActions={<Badge tone={dirty ? 'warning' : 'neutral'}>{dirty ? 'Unsaved draft' : 'Saved'}</Badge>}
      footer={<Flex className="settings-pattern-footer" align="center" justify="space-between" wrap gap={3}>
        <Text size="body" className="settings-pattern-status" role="status" aria-atomic="true">
          {announcement || (dirty ? 'Unsaved changes across settings sections.' : 'Saved settings match the current draft.')}
        </Text>
        <Flex className="settings-pattern-actions" wrap gap={2}>
          <Button type="reset" form={formId} variant="secondary" icon={Undo2} disabled={!dirty}>Discard changes</Button>
          <Button type="submit" form={formId} icon={Save} disabled={!dirty}>Save changes</Button>
        </Flex>
      </Flex>}>
      <Form ref={formRef} id={formId} className="settings-pattern-form" aria-label="Workspace settings"
        noValidate onSubmit={save} onReset={discard}>
        {errorCount > 0 && <Alert className="settings-pattern-errors" tone="danger" title="Settings could not be saved" role="alert">
          Correct {errorCount === 1 ? 'the highlighted field' : `the ${errorCount} highlighted fields`}, then save again.
        </Alert>}
        <Tabs className="settings-pattern-tabs" label="Workspace settings sections" value={activeTab}
          onValueChange={value => setActiveTab(value as SettingsTab)} items={[
            { value: 'general', label: 'General', icon: SlidersHorizontal, content: <div className="settings-pattern-section">
              <div className="settings-pattern-section-heading"><Text size="heading-3">General</Text><Text size="body">Identify this workspace and set its initial view.</Text></div>
              <Fieldset legend="Workspace identity" description="The slug is used in workspace URLs and configuration references.">
                <FormLayout layout="vertical"><Grid columns={{ base: 1, sm: 2 }} gap={4}>
                  <GridItem span={1}><TextField label="Workspace name" name="workspaceName" required maxLength={72}
                    value={draft.workspaceName} error={errors.workspaceName}
                    onChange={event => update('workspaceName', event.currentTarget.value, event.currentTarget)} /></GridItem>
                  <GridItem span={1}><TextField label="Workspace slug" name="workspaceSlug" required
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={64} autoComplete="off"
                    autoCapitalize="none" autoCorrect="off" spellCheck={false}
                    hint="Lowercase words separated by hyphens." value={draft.workspaceSlug} error={errors.workspaceSlug}
                    onChange={event => update('workspaceSlug', event.currentTarget.value, event.currentTarget)} /></GridItem>
                  <GridItem span="full"><TextArea label="Description" name="description" rows={3} maxLength={300}
                    hint="Describe the repositories or services owned by this workspace." value={draft.description}
                    onChange={event => update('description', event.currentTarget.value)} /></GridItem>
                </Grid></FormLayout>
              </Fieldset>
              <Fieldset legend="Workspace defaults" description="Choose how dates and work items appear when opening the workspace.">
                <FormLayout layout="horizontal" labelWidth={128}><Grid columns={1} gap={4}>
                  <GridItem span={1}><Select label="Time zone" name="timezone" value={draft.timezone}
                    onChange={event => update('timezone', event.currentTarget.value)}>
                    <option value="UTC">UTC</option><option value="Asia/Manila">Asia/Manila</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option><option value="Asia/Singapore">Asia/Singapore</option>
                    <option value="Europe/London">Europe/London</option><option value="Europe/Berlin">Europe/Berlin</option>
                    <option value="America/New_York">America/New_York</option><option value="America/Los_Angeles">America/Los_Angeles</option>
                  </Select></GridItem>
                  <GridItem span={1}><Select label="Starting view" name="startingView" value={draft.startingView}
                    onChange={event => update('startingView', event.currentTarget.value)}>
                    <option value="board">Task board</option><option value="runs">Run history</option><option value="activity">Activity feed</option>
                  </Select></GridItem>
                  <GridItem span={1}><Switch label="Show archived work" name="showArchived" checked={draft.showArchived}
                    hint="Include archived tasks in the default board filters."
                    onChange={event => update('showArchived', event.currentTarget.checked)} /></GridItem>
                </Grid></FormLayout>
              </Fieldset>
              <Alert tone="info" title="Local settings example">Save creates an in-memory snapshot. Reloading the page restores the initial values.</Alert>
            </div> },
            { value: 'execution', label: 'Execution', icon: GitBranch, content: <div className="settings-pattern-section">
              <div className="settings-pattern-section-heading"><Text size="heading-3">Execution</Text><Text size="body">Define branch conventions and defaults for new task runs.</Text></div>
              <Fieldset legend="Branches and worktrees" description="Keep generated branches and checkout directories consistent across tasks.">
                <FormLayout layout="vertical"><Grid columns={{ base: 1, sm: 2 }} gap={4}>
                  <GridItem span={1}><TextField label="Branch prefix" name="branchPrefix" required
                    pattern="[a-z][a-z0-9]*(?:-[a-z0-9]+)*/" autoComplete="off"
                    autoCapitalize="none" autoCorrect="off" spellCheck={false}
                    hint="Lowercase letters, numbers, and hyphens, ending with /." value={draft.branchPrefix} error={errors.branchPrefix}
                    onChange={event => update('branchPrefix', event.currentTarget.value, event.currentTarget)} /></GridItem>
                  <GridItem span={1}><Select label="Worktree directory" name="worktreeNaming" value={draft.worktreeNaming}
                    disabled={!draft.isolatedWorktrees} hint="Applied when an isolated worktree is enabled."
                    onChange={event => update('worktreeNaming', event.currentTarget.value)}>
                    <option value="task-id">Task ID</option><option value="branch">Branch name</option><option value="task-slug">Task slug</option>
                  </Select></GridItem>
                  <GridItem span="full"><Switch label="Create an isolated worktree" name="isolatedWorktrees" checked={draft.isolatedWorktrees}
                    hint="Give each new task a separate checkout."
                    onChange={event => update('isolatedWorktrees', event.currentTarget.checked)} /></GridItem>
                </Grid></FormLayout>
              </Fieldset>
              <Fieldset legend="Run policy" description="Configure scheduling limits and the review requirement for new runs.">
                <FormLayout layout="vertical"><Grid columns={{ base: 1, sm: 2 }} gap={4}>
                  <GridItem span={1}><Select label="Parallel runs" name="parallelRuns" value={draft.parallelRuns}
                    hint="Maximum number of runs scheduled at once." onChange={event => update('parallelRuns', event.currentTarget.value)}>
                    {[1, 2, 3, 4, 6, 8].map(count => <option key={count} value={String(count)}>{count} {count === 1 ? 'run' : 'runs'}</option>)}
                  </Select></GridItem>
                  <GridItem span={1}><Select label="Retry limit" name="retryLimit" value={draft.retryLimit}
                    hint="Retries after a run reports a recoverable failure." onChange={event => update('retryLimit', event.currentTarget.value)}>
                    <option value="0">No automatic retries</option><option value="1">1 retry</option><option value="2">2 retries</option><option value="3">3 retries</option>
                  </Select></GridItem>
                  <GridItem span="full"><Switch label="Require review before merging" name="requireReview" checked={draft.requireReview}
                    hint="Keep completed changes pending until a reviewer approves them."
                    onChange={event => update('requireReview', event.currentTarget.checked)} /></GridItem>
                </Grid></FormLayout>
              </Fieldset>
            </div> },
            { value: 'notifications', label: 'Notifications', icon: Bell, content: <div className="settings-pattern-section">
              <div className="settings-pattern-section-heading"><Text size="heading-3">Notifications</Text><Text size="body">Choose delivery settings and which task events should be included.</Text></div>
              <Fieldset legend="Email delivery" description="Use a team mailbox for workspace notifications.">
                <FormLayout layout="vertical"><Grid columns={1} gap={4}>
                  <GridItem span={1}><Switch label="Enable email notifications" name="emailNotifications" checked={draft.emailNotifications}
                    hint="Preserve the address and event preferences when disabled."
                    onChange={event => update('emailNotifications', event.currentTarget.checked)} /></GridItem>
                  <GridItem span={1}><TextField label="Notification email" name="notificationEmail" type="email" autoComplete="email"
                    required={draft.emailNotifications} disabled={!draft.emailNotifications} autoCapitalize="none" autoCorrect="off" spellCheck={false}
                    value={draft.notificationEmail} error={errors.notificationEmail}
                    onChange={event => update('notificationEmail', event.currentTarget.value, event.currentTarget)} /></GridItem>
                </Grid></FormLayout>
              </Fieldset>
              <Fieldset legend="Events and digest" description="Select event notifications and the optional daily summary." disabled={!draft.emailNotifications}>
                <FormLayout layout="vertical"><Grid columns={1} gap={4}>
                  <GridItem span={1}><Switch label="Run failures" name="runFailures" checked={draft.runFailures}
                    hint="Include failures that need an engineer to investigate."
                    onChange={event => update('runFailures', event.currentTarget.checked)} /></GridItem>
                  <GridItem span={1}><Switch label="Review requests" name="reviewRequests" checked={draft.reviewRequests}
                    hint="Include completed runs waiting for review."
                    onChange={event => update('reviewRequests', event.currentTarget.checked)} /></GridItem>
                  <GridItem span={1}><Switch label="Daily digest" name="dailyDigest" checked={draft.dailyDigest}
                    hint="Summarize run outcomes once per day."
                    onChange={event => update('dailyDigest', event.currentTarget.checked)} /></GridItem>
                  <GridItem span={1}><Select label="Digest time" name="digestTime" value={draft.digestTime} disabled={!draft.dailyDigest}
                    hint={`Uses the workspace time zone: ${draft.timezone}.`} onChange={event => update('digestTime', event.currentTarget.value)}>
                    {['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map(time => <option key={time} value={time}>{time}</option>)}
                  </Select></GridItem>
                </Grid></FormLayout>
              </Fieldset>
            </div> },
          ]} />
      </Form>
    </PagePanel>
  </div>;

  return <WorkspaceContent as="section" width="full" aria-label="Example workspace content">{panel}</WorkspaceContent>;
}
