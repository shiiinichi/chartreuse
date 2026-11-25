import { useState } from 'react';
import { Archive, Copy, Download } from 'lucide-react';
import { Menu, Text } from '../../system';

export function TextTriggerExample() {
  const [status, setStatus] = useState('');
  return <div style={{ display: 'grid', gap: 'var(--cr-space-3)', justifyItems: 'start' }}>
    <Menu variant="secondary" size="sm" align="start" label="Board actions" items={[
      { id: 'duplicate', label: 'Duplicate board', icon: Copy, onSelect: () => setStatus('Duplicated the board') },
      { id: 'export', label: 'Export as CSV', icon: Download, onSelect: () => setStatus('Exported the board') },
      { id: 'archive', label: 'Archive board', icon: Archive, onSelect: () => setStatus('Archived the board') },
    ]}>Actions</Menu>
    <Text size="small" display="block" role="status">{status}</Text>
  </div>;
}
