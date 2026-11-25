import { useEffect, useState } from 'react';
import { RunStatus, Text } from '../../system';

const steps = ['docs/spec-1.md', 'src/comments.jsx', 'test/comments.test.ts'];

export function RunStatusExample() {
  const [seconds, setSeconds] = useState(0);
  const [stopped, setStopped] = useState(false);
  useEffect(() => {
    if (stopped) return;
    const timer = window.setInterval(() => setSeconds(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stopped]);
  const file = steps[Math.floor(seconds / 4) % steps.length];
  const elapsed = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return <div style={{ display: 'grid', gap: 'var(--cr-space-3)' }}>
    {stopped ? <Text size="body">Stopped after {elapsed}.</Text>
      : <RunStatus label={<>Reading <code>{file}</code></>} title={`Reading ${file}`} elapsed={elapsed} onStop={() => setStopped(true)} />}
    <div style={{ inlineSize: 280, maxInlineSize: '100%' }}>
      <RunStatus label={<>Reading <code>{file}</code></>} title={`Reading ${file}`} elapsed={elapsed} onStop={() => setStopped(true)} stopDisabled={stopped} />
    </div>
  </div>;
}
