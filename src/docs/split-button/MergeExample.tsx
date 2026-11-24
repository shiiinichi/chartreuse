import { useState } from 'react';
import { SplitButton, Text } from '../../system';

const methods = [
  { value: 'merge', label: 'Create a merge commit', description: 'Keep every commit and add a merge commit.' },
  { value: 'squash', label: 'Squash and merge', description: 'Combine the commits into one.' },
  { value: 'rebase', label: 'Rebase and merge', description: 'Replay the commits onto the base branch.' },
];

export function MergeExample() {
  const [method, setMethod] = useState('squash');
  const [merged, setMerged] = useState('');
  const label = methods.find(option => option.value === method)?.label ?? '';

  return <div style={{ display: 'grid', gap: 'var(--cr-space-3)', justifyItems: 'start' }}>
    <SplitButton menuLabel="Merge method" options={methods} value={method} onValueChange={setMethod} checkmark
      onClick={() => setMerged(label)}>
      {label}
    </SplitButton>
    <Text size="small" display="block" role="status">{merged && `Done: ${merged}.`}</Text>
  </div>;
}
