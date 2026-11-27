import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tree, Text } from '../../src/system';
import type { TreeNode } from '../../src/system';
import '../../src/system/styles.css';

const nodes: TreeNode[] = [{ id: 'parent', label: 'Coordinator', children: [{ id: 'child', label: 'Reviewer' }] }, { id: 'other', label: 'Other' }];
const calls: string[] = [];
(window as unknown as { treeCalls: string[] }).treeCalls = calls;

/** Like the agent monitor: controlled expansion and selection, with the chevron beside a custom title. */
function ControlledTree() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return <Tree label="Controlled tree" nodes={nodes} togglePosition="end" expandedIds={expandedIds} selectedId={selectedId}
    onExpandedChange={ids => { calls.push(`expanded:${ids.join(',')}`); setExpandedIds(ids); }}
    onSelectionChange={id => { calls.push(`selected:${id}`); setSelectedId(id); }}
    renderNode={(node, state) => <Text bold>{node.label}{state.toggle}</Text>} />;
}

createRoot(document.getElementById('root')!).render(<StrictMode>
  <main style={{ display: 'grid', gap: 24, padding: 24, inlineSize: 420 }}>
    <h1>Tree fixture</h1>
    <Tree label="Start tree" nodes={nodes} />
    <Tree label="End tree" nodes={nodes} togglePosition="end"
      renderNode={(node, state) => <Text bold>{node.label}{state.toggle}</Text>} />
    <Tree label="Plain end tree" nodes={nodes} variant="plain" togglePosition="end" />
    <ControlledTree />
  </main>
</StrictMode>);
