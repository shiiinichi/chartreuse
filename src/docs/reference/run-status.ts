import type { ComponentReference } from './types';

export const runStatusReference: ComponentReference = {
  name: 'RunStatus',
  slug: 'run-status',
  summary: 'A live row for running work, such as a pending agent reply: a spinner, the current step, the elapsed time, and an optional Stop action.',
  importCode: "import { RunStatus } from '@chartreuse/ui';",
  usageCode: `export function AgentRunning({ elapsed, onStop }: { elapsed: string; onStop: () => void }) {
  return <RunStatus label={<>Reading <code>docs/spec-1.md</code></>} title="Reading docs/spec-1.md"
    elapsed={elapsed} onStop={onStop} />;
}`,
  nativeElement: 'div containing a row and a visually hidden role="status" summary',
  nativeProps: 'HTML attributes such as className, style, id, and data attributes go to the outer div.',
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'The current step. A ReactNode, so a file path can be code. Truncated with an ellipsis on one line.' },
    { name: 'title', type: 'string', description: 'Full step text for the tooltip. Defaults to label when it is a string.' },
    { name: 'elapsed', type: 'ReactNode', description: 'Elapsed time, such as "0:18", in muted 12px tabular numbers. It is never announced.' },
    { name: 'announcement', type: 'string', description: 'Text announced when it changes. Defaults to title, or label when it is a string. Leave the timer out so it is not read every second.' },
    { name: 'onStop', type: '() => void', description: 'Shows a Stop button that calls this.' },
    { name: 'stopLabel', type: 'string', defaultValue: "'Stop'", description: 'Visible text of the Stop button.' },
    { name: 'stopAccessibleLabel', type: 'string', defaultValue: "'Stop agent reply'", description: 'Accessible name and tooltip of the Stop button, which goes icon-only below 360px.' },
    { name: 'stopDisabled', type: 'boolean', defaultValue: 'false', description: 'Disables the Stop button, for example while a stop request is in flight.' },
  ],
  notes: [
    'The row is a 1px-bordered surface box with a 6px radius and 13px text, so it reads as a live state rather than message text. It spans its container.',
    'Only a visually hidden role="status" summary is announced: step changes are read, the ticking timer is not. The spinner is decorative.',
    'RunStatus is a size container: below 360px the Stop button shows only its icon, keeping stopAccessibleLabel as its name.',
    'Put it in a CommentThread reply\u2019s content slot for a pending ask, or anywhere an agent run is in progress.',
  ],
};

export const runStatusReferences: ComponentReference[] = [runStatusReference];
