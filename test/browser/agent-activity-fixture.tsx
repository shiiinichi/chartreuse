import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AgentActivity } from '../../src/system';
import type { AgentActivityEvent } from '../../src/system';

const events: AgentActivityEvent[] = [
  { id: 'short', kind: 'tool', title: 'Called list_cards', status: 'completed', durationMs: 420, output: '{ "cards": 3 }' },
  { id: 'long', kind: 'tool', title: 'Called add_comment on the order summary review card with a long recorded title', status: 'interrupted', durationMs: 83000, output: 'Comment saved.', defaultOpen: true },
  { id: 'plain', kind: 'message', title: 'Review evidence recorded', status: 'info' },
];

const widths = [350, 440, 760];

function Fixture() {
  return <main style={{ display: 'grid', gap: 24, padding: 24 }}>
    <h1>Agent activity fixture</h1>
    {(['ltr', 'rtl'] as const).flatMap(dir => widths.flatMap(width => (['default', 'list'] as const).flatMap(variant => (['single', 'multiple'] as const).map(titleLines => {
      const id = `${dir}-${width}-${variant}-${titleLines}`;
      return <div key={id} dir={dir} data-testid={id} style={{ inlineSize: width }}>
        {variant === 'list'
          ? <AgentActivity variant="list" titleLines={titleLines} label={id} events={events} />
          : <AgentActivity titleLines={titleLines} label={id} events={events} />}
      </div>;
    }))))}
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
