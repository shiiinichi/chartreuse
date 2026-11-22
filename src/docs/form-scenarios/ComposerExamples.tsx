import { useEffect, useRef, useState } from 'react';
import { Button, Switch } from '../../system/components';
import { MessageComposer } from '../../system/MessageComposer';
import { Grid, GridItem } from '../../system/Grid';
import { ExampleGallery, FormScenario, formCode } from './shared';
import { Text } from '../../system';

function SimpleComposer() {
  const [sent, setSent] = useState('');
  return <FormScenario title="Uncontrolled message composer" description="Use internal draft state and handle submitted text synchronously." wide
    code={formCode("MessageComposer, Text", `export function SimpleMessageExample() {
  const [sent, setSent] = useState('');
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <MessageComposer label="Message" sendLabel="Submit message" rows={3} placeholder="Enter a message" hint="Enter inserts a line break. Command/Ctrl+Enter sends." onSend={message => setSent(message)} />
    <Text size="body" style={{ margin: 0 }}>{sent ? 'Last submitted message: ' + sent : 'No message submitted.'}</Text>
  </div>;
}`, 'useState')}>
    <MessageComposer label="Message" sendLabel="Submit message" rows={3} placeholder="Enter a message" hint="Enter inserts a line break. Command/Ctrl+Enter sends." onSend={message => setSent(message)} />
    <Text size="body" className="form-scenario-feedback">{sent ? 'Last submitted message: ' + sent : 'No message submitted.'}</Text>
  </FormScenario>;
}

function ControlledComposer() {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');
  return <FormScenario title="Controlled draft" description="Store the draft in parent state and update it from the composer or a button." wide
    code={formCode("MessageComposer, Button, Text", `export function ControlledDraftExample() {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <MessageComposer label="Controlled review message" sendLabel="Send controlled review message" value={draft} onValueChange={setDraft} onSend={message => setSent(message)} rows={3} hint="The parent component stores the draft value." />
    <Button variant="secondary" onClick={() => setDraft('Please review the API changes.')}>
      Insert sample message
    </Button>
    <Text size="body" style={{ margin: 0 }}>{draft.length} UTF-16 code units in the current draft.</Text>
    <Text size="body" style={{ margin: 0 }}>{sent ? 'Last submitted message: ' + sent : 'No controlled message submitted.'}</Text>
  </div>;
}`, 'useState')}>
    <MessageComposer label="Controlled review message" sendLabel="Send controlled review message" value={draft} onValueChange={setDraft} onSend={message => setSent(message)} rows={3} hint="The parent component stores the draft value." />
    <div className="form-scenario-actions"><Button variant="secondary" onClick={() => setDraft('Please review the API changes.')}>Insert sample message</Button></div>
    <Text size="body" className="form-scenario-feedback">{draft.length} UTF-16 code units in the current draft.</Text>
    <Text size="body" className="form-scenario-feedback">{sent ? 'Last submitted message: ' + sent : 'No controlled message submitted.'}</Text>
  </FormScenario>;
}

function PendingComposer() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState('');
  const finish = useRef<(() => void) | null>(null);
  const pendingMessage = useRef('');
  useEffect(() => () => { finish.current?.(); }, []);
  return <FormScenario title="Draft preservation during an async send" description="Start the local send, edit the draft, then complete it. The newer draft remains after completion." wide
    code={formCode("MessageComposer, Button, Text", `export function PendingSendExample() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState('');
  const finish = useRef<(() => void) | null>(null);
  const pendingMessage = useRef('');
  useEffect(() => () => { finish.current?.(); }, []);
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <MessageComposer label="Message with a pending send" sendLabel="Start local send" rows={3} hint="Select Complete local send to resolve the pending promise." onSend={message => {
      pendingMessage.current = message;
      setPending(true);
      return new Promise<void>(resolve => {
        finish.current = resolve;
      });
    }} />
    <Button disabled={!pending} variant="secondary" onClick={() => {
      if (!finish.current)
        return;
      setSent(pendingMessage.current);
      setPending(false);
      finish.current?.();
      finish.current = null;
    }}>Complete local send</Button>
    <Text size="body" style={{ margin: 0 }}>{pending ? 'Local send pending.'
      : sent ? 'Last completed message: ' + sent : 'No local send started.'}</Text>
  </div>;
}`, 'useEffect, useRef, useState')}>
    <MessageComposer label="Message with a pending send" sendLabel="Start local send" rows={3} hint="Select Complete local send to resolve the pending promise." onSend={message => {
      pendingMessage.current = message;
      setPending(true);
      return new Promise<void>(resolve => {
        finish.current = resolve;
      });
    }} />
    <div className="form-scenario-actions"><Button disabled={!pending} variant="secondary" onClick={() => { if (!finish.current) return; setSent(pendingMessage.current); setPending(false); finish.current(); finish.current = null; }}>Complete local send</Button></div>
    <Text size="body" className="form-scenario-feedback">{pending ? 'Local send pending.' : sent ? 'Last completed message: ' + sent : 'No local send started.'}</Text>
  </FormScenario>;
}

function RetryComposer() {
  const [fail, setFail] = useState(true);
  const [sent, setSent] = useState('');
  return <FormScenario title="Draft preservation after a failed send" description="Enable the simulated failure to reject a send. Disable it and submit the retained draft again." wide
    code={formCode("MessageComposer, Switch, Grid, GridItem, Text", `export function RetryMessageExample() {
  const [fail, setFail] = useState(true);
  const [sent, setSent] = useState('');
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <Grid columns={1} gap={4}>
      <GridItem span={1}>
        <Switch label="Simulate send failure" checked={fail} onChange={event => setFail(event.target.checked)} />
      </GridItem>
      <GridItem span={1}>
        <MessageComposer label="Message to retry" sendLabel="Retry sample message" rows={3} defaultValue="Please keep the review notes with the task." hint="A failed send preserves the draft." onSend={message => {
          if (fail)
            throw new Error('Simulated send failed. The draft has been retained.');
          setSent(message);
        }} />
      </GridItem>
    </Grid>
    <Text size="body" style={{ margin: 0 }}>{sent ? 'Last successful message: ' + sent : 'No successful submission.'}</Text>
  </div>;
}`, 'useState')}>
    <Grid columns={1} gap={4}>
      <GridItem span={1}><Switch label="Simulate send failure" checked={fail} onChange={event => setFail(event.target.checked)} /></GridItem>
      <GridItem span={1}><MessageComposer label="Message to retry" sendLabel="Retry sample message" rows={3} defaultValue="Please keep the review notes with the task." hint="A failed send preserves the draft." onSend={message => { if (fail) throw new Error('Simulated send failed. The draft has been retained.'); setSent(message); }} /></GridItem>
    </Grid>
    <Text size="body" className="form-scenario-feedback">{sent ? 'Last successful message: ' + sent : 'No successful submission.'}</Text>
  </FormScenario>;
}

export function MessageComposerScenarios() {
  return <ExampleGallery className="form-scenarios">
    <SimpleComposer />
    <ControlledComposer />
    <PendingComposer />
    <RetryComposer />
    <FormScenario title="Send button sizes" description="Set sendSize to sm, md, or lg to match the density of the surrounding layout." wide
      code={formCode('MessageComposer', `<MessageComposer label="Small send button" sendLabel="Send small" sendSize="sm" rows={2} defaultValue="Compact layouts use the small send button." onSend={() => {}} />
<MessageComposer label="Medium send button" sendLabel="Send medium" sendSize="md" rows={2} defaultValue="The medium send button is the default." onSend={() => {}} />
<MessageComposer label="Large send button" sendLabel="Send large" sendSize="lg" rows={2} defaultValue="Spacious layouts use the large send button." onSend={() => {}} />`)}>
      <MessageComposer label="Small send button" sendLabel="Send small" sendSize="sm" rows={2} defaultValue="Compact layouts use the small send button." onSend={() => {}} />
      <MessageComposer label="Medium send button" sendLabel="Send medium" sendSize="md" rows={2} defaultValue="The medium send button is the default." onSend={() => {}} />
      <MessageComposer label="Large send button" sendLabel="Send large" sendSize="lg" rows={2} defaultValue="Spacious layouts use the large send button." onSend={() => {}} />
    </FormScenario>
    <FormScenario title="Disabled composer" description="Disable both the textarea and the submit button." wide
      code={formCode('MessageComposer', `<MessageComposer label="Managed conversation" sendLabel="Send managed message" rows={3} disabled
  defaultValue="This channel is managed by the workspace."
  hint="Sending is disabled for this workspace."
  onSend={() => {}} />`)}>
      <MessageComposer label="Managed conversation" sendLabel="Send managed message" rows={3} disabled defaultValue="This channel is managed by the workspace." hint="Sending is disabled for this workspace." onSend={() => {}} />
    </FormScenario>
  </ExampleGallery>;
}
