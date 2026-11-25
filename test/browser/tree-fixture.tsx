import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Tree, Text } from '../../src/system';
import type { TreeNode } from '../../src/system';
import '../../src/system/styles.css';

const nodes: TreeNode[] = [{ id: 'parent', label: 'Coordinator', children: [{ id: 'child', label: 'Reviewer' }] }, { id: 'other', label: 'Other' }];

createRoot(document.getElementById('root')!).render(<StrictMode>
  <main style={{ display: 'grid', gap: 24, padding: 24, inlineSize: 420 }}>
    <h1>Tree fixture</h1>
    <Tree label="Start tree" nodes={nodes} />
    <Tree label="End tree" nodes={nodes} togglePosition="end"
      renderNode={(node, state) => <Text bold>{node.label}{state.toggle}</Text>} />
  </main>
</StrictMode>);
