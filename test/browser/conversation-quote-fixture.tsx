import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Conversation, MessageComposer, insertQuote } from '../../src/system';
import type { ConversationMessage } from '../../src/system';
import '../../src/system/styles.css';

const messages: ConversationMessage[] = [
  { id: 'user', role: 'user', body: 'Plain **text** from the user.\nSecond line.' },
  { id: 'agent', role: 'agent', sender: 'Codex', body: 'Run `npm test` before **every** release.\n\n- First item\n- Second item\n\n```ts\nconst answer = 42;\n```' },
  { id: 'last', role: 'agent', sender: 'Codex', body: 'A final reply.' },
];

function Fixture() {
  const composer = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const [quoted, setQuoted] = useState('');
  return (
    <main style={{ display: 'grid', gap: 24, padding: 24, inlineSize: 640 }}>
      <h1>Conversation quote fixture</h1>
      <Conversation messages={messages} onQuote={(text, message) => { setQuoted(message.id); insertQuote(composer.current, text); }} />
      <output data-testid="quoted">{quoted}</output>
      <MessageComposer ref={composer} label="Reply" value={draft} onValueChange={setDraft} onSend={() => setDraft('')} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
