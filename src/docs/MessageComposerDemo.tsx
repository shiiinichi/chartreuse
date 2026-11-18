import { useState } from 'react';
import { Check, MessageSquare } from 'lucide-react';
import { Badge, Switch } from '../system/components';
import { MessageComposer } from '../system/MessageComposer';
import './message-composer-demo.css';

export function MessageComposerDemo() {
  const [value, setValue] = useState('');
  const [slow, setSlow] = useState(false);
  const [fail, setFail] = useState(false);
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

  return <div className="composer-demo">
    <div className="composer-demo-options"><Switch label="Simulate a slow send" checked={slow} onChange={event => setSlow(event.target.checked)} /><Switch label="Simulate send failure" checked={fail} onChange={event => setFail(event.target.checked)} /><span>Command/Ctrl+Enter sends</span></div>
    <MessageComposer label="Example message" placeholder="Enter a message" hint="Messages are submitted within this example." rows={5} value={value} onValueChange={setValue} onSend={async message => {
      await new Promise(resolve => window.setTimeout(resolve, slow ? 2200 : 250));
      if (fail) throw new Error('Simulated send failed. The draft has been retained.');
      setMessages(previous => [...previous, { id: Date.now(), text: message }]);
    }} />
    <div className="composer-demo-results"><div><h3><MessageSquare size={14} aria-hidden="true" />Submitted messages</h3><Badge>{messages.length}</Badge></div>{messages.length === 0 ? <p className="composer-demo-empty">Submitted messages appear here and remain in this example.</p> : <ol>{messages.map(message => <li key={message.id}><div><strong>You</strong><span><Check size={11} aria-hidden="true" />Submitted</span></div><p>{message.text}</p></li>)}</ol>}</div>
  </div>;
}
