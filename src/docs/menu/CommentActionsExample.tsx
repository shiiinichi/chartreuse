import { useState } from 'react';
import { Copy, Flag, Pencil, Trash2 } from 'lucide-react';
import { Badge, Flex, Menu, Text } from '../../system';

export function CommentActionsExample() {
  const [status, setStatus] = useState('');
  return <div style={{ display: 'grid', gap: 'var(--cr-space-3)' }}>
    <Flex align="center" gap={2}>
      <Badge tone="success">Human</Badge>
      <Text size="small">#5 · Nov 25, 6:10 PM</Text>
      <span style={{ marginInlineStart: 'auto' }}>
        <Menu size="sm" label="More actions for #5" items={[
          { id: 'edit', label: 'Edit', icon: Pencil, onSelect: () => setStatus('Editing #5') },
          { id: 'copy', label: 'Copy link', icon: Copy, onSelect: () => setStatus('Copied a link to #5') },
          { id: 'report', label: 'Report', icon: Flag, disabled: true, onSelect: () => setStatus('Reported #5') },
          { type: 'separator' },
          { id: 'delete', label: 'Delete', icon: Trash2, tone: 'danger', onSelect: () => setStatus('Asked to delete #5') },
        ]} />
      </span>
    </Flex>
    <Text size="small" display="block" role="status">{status}</Text>
  </div>;
}
