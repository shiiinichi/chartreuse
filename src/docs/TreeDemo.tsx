import { useState } from 'react';
import { FileCode2, FileText, Folder, FolderOpen, GitBranch, RotateCcw, Terminal } from 'lucide-react';
import { Badge, Button, Switch } from '../system/components';
import { Tree } from '../system/Tree';
import type { TreeNode } from '../system/Tree';
import { ExampleGallery, Showcase } from './shared';
import { Text } from '../system';
import './tree-demo.css';

const calls = [
  { id: 'coordinator', name: 'Coordinator', call: 'Call 1', elapsed: '1m 44s', tokens: '109,461', description: 'Review the workspace and consolidate the specialist findings.', result: 'The review is complete. All three specialist calls returned their findings.' },
  { id: 'review-1', name: 'Reviewer', call: 'Call 2', elapsed: '17s', tokens: '43,155', description: 'Verify that assignment context belongs to the correct call.', result: 'The call retained its assignment context and returned a review result.', tool: 'commandExecution' },
  { id: 'review-2', name: 'Reviewer', call: 'Call 3', elapsed: '14s', tokens: '22,684', description: 'Continue the review using the existing assignment.', result: 'The existing assignment was reused for the next review step.' },
  { id: 'review-3', name: 'Reviewer', call: 'Call 4', elapsed: '12s', tokens: '43,008', description: 'Create a separate assignment and review its final checks.', result: 'The new assignment retained separate context and returned its own result.', tool: 'commandExecution' },
];
const callNodes: TreeNode[] = [{
  id: calls[0].id, label: `${calls[0].name} · ${calls[0].call}`,
  description: `Succeeded. ${calls[0].elapsed}. ${calls[0].tokens} tokens.`,
  children: calls.slice(1).map(call => ({ id: call.id, label: `${call.name} · ${call.call}`, description: `Succeeded. ${call.elapsed}. ${call.tokens} tokens.` })),
}];
const files: TreeNode[] = [
  { id: 'workspace', label: 'component-library', icon: FolderOpen, children: [
    { id: 'source', label: 'src', icon: Folder, children: [
      { id: 'system', label: 'system', icon: Folder, children: [
        { id: 'tree-file', label: 'Tree.tsx', icon: FileCode2 },
        { id: 'button-file', label: 'Button.tsx', icon: FileCode2 },
      ] },
      { id: 'app-file', label: 'App.tsx', icon: FileCode2 },
    ] },
    { id: 'readme', label: 'README.md', icon: FileText },
  ] },
];
function findNodeLabel(nodes: readonly TreeNode[], id: string): string | undefined {
  for (const node of nodes) {
    if (node.id === id) return node.label;
    const child = node.children && findNodeLabel(node.children, id);
    if (child) return child;
  }
}

export function TreeDemo() {
  const [selected, setSelected] = useState<string | null>('coordinator');
  const [expanded, setExpanded] = useState<string[]>(['coordinator']);
  const [connectors, setConnectors] = useState(true);
  const [selectedFile, setSelectedFile] = useState('tree-file');
  const call = calls.find(item => item.id === selected);
  const hierarchyCode = `import { useState } from 'react';
import { GitBranch, RotateCcw, Terminal } from 'lucide-react';
import { Badge, Button, Switch, Tree, Text } from '@chartreuse/ui';
import type { TreeNode } from '@chartreuse/ui';

const calls = ${JSON.stringify(calls, null, 2)};
const nodes: TreeNode[] = ${JSON.stringify(callNodes, null, 2)};

export function CallHierarchy() {
  const [selected, setSelected] = useState<string | null>(${JSON.stringify(selected)});
  const [expanded, setExpanded] = useState<string[]>(${JSON.stringify(expanded)});
  const [connectors, setConnectors] = useState(${connectors});
  const call = calls.find(item => item.id === selected);
  return <section className="tree-demo-hierarchy" aria-labelledby="tree-demo-hierarchy-title">
    <header className="tree-demo-heading">
      <div><Text size="heading-3" id="tree-demo-hierarchy-title"><GitBranch size={19} aria-hidden="true" />Call hierarchy</Text>
        <Text size="body">Choose a call to inspect its result. The connecting lines show which call started the others.</Text></div>
      <span>4 calls · 0 active</span>
    </header>
    <div className="tree-demo-controls">
      <Switch label="Show branch connectors" checked={connectors}
        onChange={event => setConnectors(event.target.checked)} />
      <Button variant="ghost" size="sm" icon={RotateCcw}
        onClick={() => { setSelected('coordinator'); setExpanded(['coordinator']); }}>Reset hierarchy</Button>
    </div>
    <Tree label="Call hierarchy" nodes={nodes}
      selectedId={selected} onSelectionChange={setSelected}
      expandedIds={expanded} onExpandedChange={setExpanded} connectors={connectors}
      renderNode={node => {
        const item = calls.find(entry => entry.id === node.id)!;
        return <div className="tree-demo-call">
          <div className="tree-demo-call-title"><Text bold>{item.name}</Text><span>{item.call}</span></div>
          <div className="tree-demo-call-state"><Badge tone="success" dot>Succeeded</Badge><span>{item.elapsed}</span></div>
          <Text size="body">{item.description}</Text>
          <div className="tree-demo-call-meta"><span>{item.tokens} tokens</span>
            {item.tool && <span><Terminal size={14} aria-hidden="true" />{item.tool}</span>}
          </div>
        </div>;
      }} />
    <div className="tree-demo-detail" role="status" aria-live="polite" aria-atomic="true">
      <Text bold>{call ? call.name + ' · ' + call.call : 'Select a call'}</Text>
      <Text size="body">{call?.result ?? 'The selected call’s result appears here.'}</Text>
    </div>
  </section>;
}`;
  const filesCode = `import { useState } from 'react';
import { FileCode2, FileText, Folder, FolderOpen } from 'lucide-react';
import { Tree, Text } from '@chartreuse/ui';
import type { TreeNode } from '@chartreuse/ui';

const nodes: TreeNode[] = [{ id: 'workspace', label: 'component-library', icon: FolderOpen, children: [
  { id: 'source', label: 'src', icon: Folder, children: [
    { id: 'system', label: 'system', icon: Folder, children: [
      { id: 'tree-file', label: 'Tree.tsx', icon: FileCode2 },
      { id: 'button-file', label: 'Button.tsx', icon: FileCode2 },
    ] },
    { id: 'app-file', label: 'App.tsx', icon: FileCode2 },
  ] },
  { id: 'readme', label: 'README.md', icon: FileText },
] }];

function findNodeLabel(items: readonly TreeNode[], id: string): string | undefined {
  for (const node of items) {
    if (node.id === id) return node.label;
    const child = node.children && findNodeLabel(node.children, id);
    if (child) return child;
  }
}

export function WorkspaceFiles() {
  const [selected, setSelected] = useState(${JSON.stringify(selectedFile)});
  return <section className="tree-demo-files" aria-labelledby="tree-demo-files-title">
    <header className="tree-demo-heading"><div>
      <Text size="heading-3" id="tree-demo-files-title">Plain file hierarchy</Text>
      <Text size="body">The plain variant renders file and folder labels without card borders.</Text>
    </div></header>
    <Tree label="Example workspace files" nodes={nodes} variant="plain"
      selectedId={selected} onSelectionChange={setSelected}
      defaultExpandedIds={['workspace', 'source', 'system']} />
    <Text size="body" className="tree-demo-selection">Selected: <code>{findNodeLabel(nodes, selected)}</code></Text>
  </section>;
}`;
  return <div className="tree-demo">
    <ExampleGallery >
    <Showcase title="Controlled call hierarchy" description="Control selectedId and expandedIds to manage call selection and expansion. Connectors show parent-child relationships." code={hierarchyCode}><section className="tree-demo-hierarchy" aria-labelledby="tree-demo-hierarchy-title">
      <header className="tree-demo-heading"><div><Text size="heading-3" id="tree-demo-hierarchy-title"><GitBranch size={19} aria-hidden="true" />Call hierarchy</Text><Text size="body">Choose a call to inspect its result. The connecting lines show which call started the others.</Text></div><span>4 calls · 0 active</span></header>
      <div className="tree-demo-controls"><Switch label="Show branch connectors" checked={connectors} onChange={event => setConnectors(event.target.checked)} /><Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => { setSelected('coordinator'); setExpanded(['coordinator']); }}>Reset hierarchy</Button></div>
      <Tree label="Call hierarchy" nodes={callNodes} selectedId={selected} onSelectionChange={setSelected}
        expandedIds={expanded} onExpandedChange={setExpanded} connectors={connectors}
        renderNode={node => {
          const item = calls.find(entry => entry.id === node.id)!;
          return <div className="tree-demo-call"><div className="tree-demo-call-title"><Text bold>{item.name}</Text><span>{item.call}</span></div><div className="tree-demo-call-state"><Badge tone="success" dot>Succeeded</Badge><span>{item.elapsed}</span></div><Text size="body">{item.description}</Text><div className="tree-demo-call-meta"><span>{item.tokens} tokens</span>{item.tool && <span><Terminal size={14} aria-hidden="true" />{item.tool}</span>}</div></div>;
        }} />
      <div className="tree-demo-detail" role="status" aria-live="polite" aria-atomic="true"><Text bold>{call ? `${call.name} · ${call.call}` : 'Select a call'}</Text><Text size="body">{call?.result ?? 'The selected call’s result appears here.'}</Text></div>
    </section></Showcase>
    <Showcase title="Plain file hierarchy" description="The plain variant uses the same selection, expansion, and keyboard controls as the outlined tree." code={filesCode}><section className="tree-demo-files" aria-labelledby="tree-demo-files-title"><header className="tree-demo-heading"><div><Text size="heading-3" id="tree-demo-files-title">Plain file hierarchy</Text><Text size="body">The plain variant renders file and folder labels without card borders.</Text></div></header><Tree label="Example workspace files" nodes={files} variant="plain" selectedId={selectedFile} onSelectionChange={setSelectedFile} defaultExpandedIds={['workspace', 'source', 'system']} /><Text size="body" className="tree-demo-selection">Selected: <code>{findNodeLabel(files, selectedFile)}</code></Text></section></Showcase>
    </ExampleGallery>
    <Text size="body" className="tree-demo-keyboard">Tab enters each tree once. Use ↑ ↓ to move, → ← to open branches or return to their parent, and Enter or Space to select. Type a name to jump to it.</Text>
  </div>;
}
