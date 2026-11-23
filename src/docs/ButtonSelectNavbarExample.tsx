import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ButtonSelect, Navbar } from '../system';

const boards = [
  { value: 'dev-001', label: 'DEV-001 · Audit Python ADK implementation against the agent runtime spec', description: '1 task board · 6 of 14 complete' },
  { value: 'dev-002', label: 'DEV-002 · Navbar and logo redesign', description: '2 task boards · 9 of 11 complete' },
  { value: 'dev-003', label: 'DEV-003 · Release checklist', description: '1 task board · Not started' },
];

// The Navbar recolors its own trigger area. The popup still opens on the page's default surface.
export function BoardSwitcher() {
  const [board, setBoard] = useState('dev-001');
  return (
    <Navbar surface="evergreen" width="full" aria-label="Dashboard"
      style={{ '--cr-color-text': 'var(--cr-paper)', '--cr-color-muted': 'color-mix(in srgb, var(--cr-paper) 72%, transparent)' } as CSSProperties}
      brand={<ButtonSelect variant="ghost" size="sm" aria-label="Task group" checkmark style={{ maxInlineSize: '18rem' }}
        options={boards} value={board} onValueChange={setBoard} />} />
  );
}
