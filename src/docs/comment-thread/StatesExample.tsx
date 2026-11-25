import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, CommentThread, Menu, Text } from '../../system';

export function StatesExample() {
  const [confirming, setConfirming] = useState(true);
  const [deleted, setDeleted] = useState(false);
  return <div style={{ display: 'grid', gap: 'var(--cr-space-4)' }}>
    <CommentThread highlighted comment={{ id: '1', sender: 'Human', senderTone: 'success', label: 'Comment #1, linked', reference: '#1',
      time: { label: 'Nov 24, 9:02 AM', shortLabel: '9:02 AM' }, body: 'Use the seeded GA board for every measurement so numbers compare.' }} />
    <CommentThread footerTone="danger" comment={{ id: '4', sender: 'Agent', senderTone: 'info', label: 'Comment #4', reference: '#4',
      time: { label: 'Nov 25, 5:52 PM', shortLabel: '5:52 PM' },
      actions: <Menu size="sm" label="More actions for #4" items={[{ id: 'delete', label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => { setDeleted(false); setConfirming(true); } }]} />,
      body: deleted ? '*#4 was deleted.*' : 'Corrected the p95 figure in the discovery report: 715 ms on the seeded board, not 1.1 s.' }}
      footer={confirming && <>
        <Text style={{ flex: '1 1 160px' }}><Text bold>Delete #4?</Text> Its 2 replies stay visible.</Text>
        <Button size="sm" variant="secondary" onClick={() => setConfirming(false)}>Keep</Button>
        <Button size="sm" variant="danger" onClick={() => { setDeleted(true); setConfirming(false); }}>Delete</Button>
      </>} />
  </div>;
}
