import { useState } from 'react';
import { ArrowRight, Bookmark, Check, FolderOpen, Plus, RotateCcw } from 'lucide-react';
import { Alert, Button, IconButton, TextField, useToast } from '../system/components';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';

const snippet = (...lines: string[]) => lines.join('\n');

export function ButtonScenarios() {
  const [chosen, setChosen] = useState('');
  const [loading, setLoading] = useState(false);
  const [formResult, setFormResult] = useState('No action recorded.');
  const [linkArchived, setLinkArchived] = useState(true);
  const notify = useToast();
  const variants = ['primary', 'secondary', 'accent', 'ghost', 'danger'] as const;
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Button variants" description="Set variant to control action emphasis. Clicking a variant records it in local state." code={snippet(
      'import { useState } from "react";',
      'import { Button, Text } from "@chartreuse/ui";',
      '',
      'function ButtonVariants() {',
      '  const [chosen, setChosen] = useState("");',
      '  const variants = ["primary", "secondary", "accent", "ghost", "danger"] as const;',
      '  return <>',
      '    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>',
      '      {variants.map(variant => <Button key={variant} variant={variant}',
      '        onClick={() => setChosen(variant)}>',
      '        {variant.charAt(0).toUpperCase() + variant.slice(1)}',
      '      </Button>)}',
      '    </div>',
      '    <Text size="body" role="status">{chosen ? "Selected variant: " + chosen : "Select a variant."}</Text>',
      '  </>;',
      '}',
    )}><div className="core-example-stack"><div className="core-example-row">{variants.map(variant => <Button key={variant} variant={variant} onClick={() => setChosen(variant)}>{variant.charAt(0).toUpperCase() + variant.slice(1)}</Button>)}</div><Text size="body" className="core-example-result" role="status">{chosen ? 'Selected variant: ' + chosen : 'Select a variant.'}</Text></div></Showcase>
    <Showcase title="Link buttons" description="Set variant to link for an action that reads as link text. It inherits the surrounding font size and line height, adds no padding or hover background, and stays a native button. Use a real link for navigation." code={snippet(
      'import { useState } from "react";',
      'import { RotateCcw } from "lucide-react";',
      'import { Button, Text } from "@chartreuse/ui";',
      '',
      'function LinkButtons() {',
      '  const [archived, setArchived] = useState(true);',
      '  return <>',
      '    <Text size="body" role="status">',
      '      {archived ? "Task archived. " : "Task restored. "}',
      '      <Button variant="link" onClick={() => setArchived(!archived)}>',
      '        {archived ? "Undo" : "Archive again"}',
      '      </Button>',
      '    </Text>',
      '    <Button variant="link" icon={RotateCcw}>Retry the last run</Button>',
      '  </>;',
      '}',
    )}><div className="core-example-stack"><Text size="body" role="status">{linkArchived ? 'Task archived. ' : 'Task restored. '}<Button variant="link" onClick={() => setLinkArchived(!linkArchived)}>{linkArchived ? 'Undo' : 'Archive again'}</Button></Text><div><Button variant="link" icon={RotateCcw} onClick={() => notify('Retry requested', 'info')}>Retry the last run</Button></div></div></Showcase>
    <Showcase title="Button sizes" description="Set size to sm, md (default), or lg." code={snippet(
      'import { Button } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12 }}>',
      '  <Button size="sm">Small</Button>',
      '  <Button>Default</Button>',
      '  <Button size="lg">Large</Button>',
      '</div>',
    )}><div className="core-example-row"><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button></div></Showcase>
    <Showcase title="Full-width button" description="Set fullWidth to stretch the button across its container, such as a narrow panel or card footer." code={"import { Button } from '@chartreuse/ui';\n\n<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--cr-space-3)', inlineSize: 'min(100%, 20rem)' }}>\n  <Button variant=\"secondary\">Default width</Button>\n  <Button fullWidth>Full width</Button>\n</div>"}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--cr-space-3)', inlineSize: 'min(100%, 20rem)' }}><Button variant="secondary">Default width</Button><Button fullWidth>Full width</Button></div>
    </Showcase>
    <Showcase title="Leading and trailing icons" description="Use icon and iconRight to place decorative icons beside the button label." code={snippet(
      'import { Plus, ArrowRight } from "lucide-react";',
      'import { Button } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>',
      '  <Button icon={Plus}>Create task</Button>',
      '  <Button variant="secondary" iconRight={ArrowRight}>View workspace</Button>',
      '</div>',
    )}><div className="core-example-row"><Button icon={Plus}>Create task</Button><Button variant="secondary" iconRight={ArrowRight}>View workspace</Button></div></Showcase>
    <Showcase title="Controlled loading state" description="loading disables the button and displays a spinner. The secondary action clears the local loading state." code={snippet(
      'import { useState } from "react";',
      'import { Button, Text } from "@chartreuse/ui";',
      '',
      'function PendingAction() {',
      '  const [loading, setLoading] = useState(false);',
      '  return <>',
      '    <Button loading={loading} onClick={() => setLoading(true)}>Start action</Button>',
      '    <Button variant="secondary" disabled={!loading}',
      '      onClick={() => setLoading(false)}>Complete action</Button>',
      '    <Text size="body" role="status">{loading ? "Action pending." : "Action ready."}</Text>',
      '  </>;',
      '}',
    )}><div className="core-example-stack"><div className="core-example-row"><Button loading={loading} onClick={() => setLoading(true)}>Start action</Button><Button variant="secondary" disabled={!loading} onClick={() => setLoading(false)}>Complete action</Button></div><Text size="body" className="core-example-result" role="status">{loading ? 'Action pending.' : 'Action ready.'}</Text></div></Showcase>
    <Showcase title="Disabled button" description="disabled applies the native button state and removes the control from sequential keyboard navigation." code={snippet(
      'import { Button } from "@chartreuse/ui";',
      '',
      '<Button disabled>Unavailable action</Button>',
    )}><Button disabled>Unavailable action</Button></Showcase>
    <Showcase title="Button and submit types" description="The default type is button. Set type to submit to invoke the form submit handler." code={snippet(
      'import { useState } from "react";',
      'import { Button, Text } from "@chartreuse/ui";',
      '',
      'function FormActions() {',
      '  const [result, setResult] = useState("No action recorded.");',
      '  return <form onSubmit={event => {',
      '    event.preventDefault(); setResult("Submit handler called.");',
      '  }}>',
      '    <Button variant="secondary" onClick={() => setResult("Button click handler called.")}>',
      '      Run button action',
      '    </Button>',
      '    <Button type="submit">Submit form</Button>',
      '    <Text size="body" role="status">{result}</Text>',
      '  </form>;',
      '}',
    )}><form className="core-example-stack" aria-label="Button form actions" onSubmit={event => { event.preventDefault(); setFormResult('Submit handler called.'); }}><div className="core-example-row"><Button variant="secondary" onClick={() => setFormResult('Button click handler called.')}>Run button action</Button><Button type="submit">Submit form</Button></div><Text size="body" className="core-example-result" role="status">{formResult}</Text></form></Showcase>
  </ExampleGallery>;
}

const customWorkspaceIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 9 9-9 9-9-9Z" /><path d="M8 12h8m-4-4v8" /></svg>;

export function IconButtonScenarios() {
  const [bookmarked, setBookmarked] = useState(false);
  const [customClicks, setCustomClicks] = useState(0);
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Toggle action with an accessible name" description="label supplies the accessible name; aria-pressed exposes the controlled bookmark state." code={snippet(
      'import { useState } from "react";',
      'import { Bookmark } from "lucide-react";',
      'import { IconButton, Text } from "@chartreuse/ui";',
      '',
      'function BookmarkAction() {',
      '  const [bookmarked, setBookmarked] = useState(false);',
      '  return <>',
      '    <IconButton icon={Bookmark}',
      '      label={bookmarked ? "Remove bookmark" : "Bookmark task"}',
      '      aria-pressed={bookmarked} variant="secondary"',
      '      onClick={() => setBookmarked(value => !value)} />',
      '    <Text size="body" role="status">{bookmarked ? "Task bookmarked." : "Task not bookmarked."}</Text>',
      '  </>;',
      '}',
    )}><div className="core-example-stack"><IconButton icon={Bookmark} label={bookmarked ? 'Remove bookmark' : 'Bookmark task'} aria-pressed={bookmarked} variant="secondary" onClick={() => setBookmarked(value => !value)} /><Text size="body" className="core-example-result" role="status">{bookmarked ? 'Task bookmarked.' : 'Task not bookmarked.'}</Text></div></Showcase>
    <Showcase title="Icon button sizes and disabled state" description="IconButton accepts Button sizing and disabled props. label supplies its accessible name." code={snippet(
      'import { Plus, FolderOpen, RotateCcw } from "lucide-react";',
      'import { IconButton } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "flex", alignItems: "center", gap: 12 }}>',
      '  <IconButton size="sm" icon={Plus} label="Add task" variant="secondary" />',
      '  <IconButton icon={FolderOpen} label="Open folder" variant="secondary" />',
      '  <IconButton size="lg" icon={RotateCcw} label="Reset changes" variant="secondary" />',
      '  <IconButton icon={RotateCcw} label="Reset changes (unavailable)" disabled />',
      '</div>',
    )}><div className="core-example-row"><IconButton size="sm" icon={Plus} label="Add task" variant="secondary" /><IconButton icon={FolderOpen} label="Open folder" variant="secondary" /><IconButton size="lg" icon={RotateCcw} label="Reset changes" variant="secondary" /><IconButton icon={RotateCcw} label="Reset changes (unavailable)" disabled /></div></Showcase>
    <Showcase title="Custom SVG icon" description="Pass an inline SVG element to icon. IconButton renders it as a decorative icon." code={snippet(
      'import { useState } from "react";',
      'import { IconButton, Text } from "@chartreuse/ui";',
      '',
      'const workspaceIcon = <svg viewBox="0 0 24 24" fill="none"',
      '  stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">',
      '  <path d="m12 3 9 9-9 9-9-9Z" /><path d="M8 12h8m-4-4v8" />',
      '</svg>;',
      '',
      'function CustomAction() {',
      '  const [clicks, setClicks] = useState(0);',
      '  return <>',
      '    <IconButton icon={workspaceIcon} label="Run workspace action"',
      '      variant="secondary" onClick={() => setClicks(value => value + 1)} />',
      '    <Text size="body" role="status">Activation count: {clicks}</Text>',
      '  </>;',
      '}',
    )}><div className="core-example-stack"><IconButton icon={customWorkspaceIcon} label="Run workspace action" variant="secondary" onClick={() => setCustomClicks(value => value + 1)} /><Text size="body" className="core-example-result" role="status">Activation count: {customClicks}</Text></div></Showcase>
  </ExampleGallery>;
}

export function AlertScenarios() {
  const [dismissed, setDismissed] = useState(false);
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<'idle' | 'error' | 'success'>('idle');
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Alert tones" description="tone selects the icon and color; title and children provide the message." code={snippet(
      'import { Alert } from "@chartreuse/ui";',
      '',
      '<div style={{ display: "grid", gap: 16 }}>',
      '  <Alert tone="neutral" title="Configuration">This workspace uses the default branch settings.</Alert>',
      '  <Alert tone="info" title="Review available">Review the changed files before merging.</Alert>',
      '  <Alert tone="success" title="Changes saved">The workspace settings have been saved.</Alert>',
      '  <Alert tone="warning" title="Review required">Approval is required before merging.</Alert>',
      '  <Alert tone="danger" title="Invalid configuration">Resolve the validation errors before saving.</Alert>',
      '</div>',
    )}><div className="core-example-stack" style={{ inlineSize: '100%' }}><Alert tone="neutral" title="Configuration">This workspace uses the default branch settings.</Alert><Alert tone="info" title="Review available">Review the changed files before merging.</Alert><Alert tone="success" title="Changes saved">The workspace settings have been saved.</Alert><Alert tone="warning" title="Review required">Approval is required before merging.</Alert><Alert tone="danger" title="Invalid configuration">Resolve the validation errors before saving.</Alert></div></Showcase>
    <Showcase title="Controlled alert dismissal" description="onDismiss notifies the parent; the parent removes the alert from the rendered output." code={snippet(
      'import { useState } from "react";',
      'import { Alert, Button } from "@chartreuse/ui";',
      '',
      'function DismissibleAlert() {',
      '  const [dismissed, setDismissed] = useState(false);',
      '  return dismissed',
      '    ? <Button variant="secondary" onClick={() => setDismissed(false)}>Restore review notice</Button>',
      '    : <Alert tone="info" title="Review notice" onDismiss={() => setDismissed(true)}>',
      '        Review the changed files before merging.',
      '      </Alert>;',
      '}',
    )}>{dismissed ? <Button variant="secondary" onClick={() => setDismissed(false)}>Restore review notice</Button> : <Alert tone="info" title="Review notice" onDismiss={() => setDismissed(true)}>Review the changed files before merging.</Alert>}</Showcase>
    <Showcase title="Validation result announcements" description="Set role to alert for an error or status for a successful validation result." code={snippet(
      'import { useState } from "react";',
      'import { Alert, Button, TextField } from "@chartreuse/ui";',
      '',
      'function ValidationResult() {',
      '  const [title, setTitle] = useState("");',
      '  const [result, setResult] = useState<"idle" | "error" | "success">("idle");',
      '  return <>',
      '    <TextField label="Task title" value={title}',
      '      onChange={event => setTitle(event.target.value)} />',
      '    <Button variant="secondary"',
      '      onClick={() => setResult(title.trim() ? "success" : "error")}>Check title</Button>',
      '    {result === "error" && <Alert role="alert" tone="danger" title="Task title required">',
      '      Enter a title before continuing.',
      '    </Alert>}',
      '    {result === "success" && <Alert role="status" tone="success" title="Title valid">',
      '      The task title is not empty.',
      '    </Alert>}',
      '  </>;',
      '}',
    )}><div className="core-example-stack" style={{ inlineSize: '100%' }}><div className="core-example-field"><TextField label="Task title" value={title} onChange={event => setTitle(event.target.value)} /></div><Button variant="secondary" onClick={() => setResult(title.trim() ? 'success' : 'error')}>Check title</Button>{result === 'error' && <Alert role="alert" tone="danger" title="Task title required">Enter a title before continuing.</Alert>}{result === 'success' && <Alert role="status" tone="success" title="Title valid">The task title is not empty.</Alert>}</div></Showcase>
  </ExampleGallery>;
}

function NotificationFromChild() {
  const notify = useToast();
  return <Button icon={Check} onClick={() => notify('Workspace settings saved.')}>Show saved notification</Button>;
}

function NotificationTones() {
  const notify = useToast();
  return <div className="core-example-row"><Button variant="secondary" onClick={() => notify('Configuration saved.', 'success')}>Success notification</Button><Button variant="secondary" onClick={() => notify('Approval is required before merging.', 'warning')}>Warning notification</Button><Button variant="secondary" onClick={() => notify('A new review is available.', 'info')}>Information notification</Button></div>;
}

export function ToastProviderScenarios() {
  return <ExampleGallery className="core-scenarios">
    <Showcase title="Notifications from child components" description="Call useToast inside ToastProvider. This preview uses the documentation provider." code={snippet(
      'import { Check } from "lucide-react";',
      'import { Button, ToastProvider, useToast } from "@chartreuse/ui";',
      '',
      'function SaveAction() {',
      '  const notify = useToast();',
      '  return <Button icon={Check}',
      '    onClick={() => notify("Workspace settings saved.")}>',
      '    Show saved notification',
      '  </Button>;',
      '}',
      '',
      'export function NotificationExample() {',
      '  return <ToastProvider><SaveAction /></ToastProvider>;',
      '}',
    )}><NotificationFromChild /></Showcase>
    <Showcase title="Notification tones and replacement" description="Pass a tone as the second notify argument. Each call replaces the current notification." code={snippet(
      'import { Button, ToastProvider, useToast } from "@chartreuse/ui";',
      '',
      'function NotificationActions() {',
      '  const notify = useToast();',
      '  return <>',
      '    <Button variant="secondary" onClick={() => notify("Configuration saved.", "success")}>',
      '      Success notification',
      '    </Button>',
      '    <Button variant="secondary" onClick={() => notify("Approval is required before merging.", "warning")}>',
      '      Warning notification',
      '    </Button>',
      '    <Button variant="secondary" onClick={() => notify("A new review is available.", "info")}>',
      '      Information notification',
      '    </Button>',
      '  </>;',
      '}',
      '',
      'export function NotificationTonesExample() {',
      '  return <ToastProvider><NotificationActions /></ToastProvider>;',
      '}',
    )}><NotificationTones /></Showcase>
  </ExampleGallery>;
}
