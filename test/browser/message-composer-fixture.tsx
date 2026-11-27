import { StrictMode, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles } from 'lucide-react';
import { Button, MessageComposer, SplitButton } from '../../src/system';
import '../../src/system/styles.css';

/** Each send waits until the page calls window.finishSend(). */
function Fixture() {
  const pending = useRef<(() => void)[]>([]);
  (window as unknown as { finishSend: () => void }).finishSend = () => pending.current.splice(0).forEach(resolve => resolve());
  const send = () => new Promise<void>(resolve => { pending.current.push(resolve); });
  const controls = <><Button size="sm">Default model · Low</Button><Button size="sm" variant="secondary">Access</Button></>;
  return (
    <main style={{ display: 'grid', gap: 24, padding: 24, inlineSize: 377 }}>
      <h1>Message composer fixture</h1>
      <div data-testid="no-hint"><MessageComposer label="Without hint" rows={1} hint={null} controls={controls} sendSize="sm" onSend={send} /></div>
      <div data-testid="with-hint"><MessageComposer label="With hint" rows={1} hint="Enter to send" sendSize="sm" onSend={send} /></div>
      {/* The test widens this from 200px to 560px, like a card comment in a dialog that opens wider. */}
      <div data-testid="inline-resize" style={{ inlineSize: 200 }}><MessageComposer layout="inline" label="Reply" placeholder="Reply or ask Opus 5.5 · Medium" hint={null} sendSize="sm"
        controls={<SplitButton variant="secondary" size="sm" icon={Sparkles} iconOnly="narrow" menuLabel="Agent for this request" content="Agent settings">Ask agent</SplitButton>} onSend={send} /></div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
