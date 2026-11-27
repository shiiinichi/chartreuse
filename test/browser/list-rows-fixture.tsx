import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Badge, Flex, List, Text, Tree } from '../../src/system';
import type { ListItem, TreeNode } from '../../src/system';
import '../../src/system/styles.css';

const calls: string[] = [];
(window as unknown as { listCalls: string[] }).listCalls = calls;

const treeNodes: TreeNode[] = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }];
const slotItems: ListItem[] = [{ id: 'a', title: 'Alpha' }, { id: 'b', title: 'Beta' }];

/** A run-history style row: a title with a status pinned top right, wrapping text, and a footer. */
const run = (id: string, title: string, status: string): ListItem => ({
  id,
  content: <Flex direction="column" gap={2}>
    <Flex direction="row" justify="space-between" align="start" gap={3}>
      <Text bold data-testid={`title-${id}`}>{title}</Text><Badge tone="success">{status}</Badge>
    </Flex>
    <Text size="body">A long summary that wraps across several lines when the row is narrow, without pushing the status out of the row.</Text>
    <Flex direction="row" justify="space-between" gap={3}><span>3 files</span><time>2:14 PM</time></Flex>
  </Flex>,
});

function Parity({ width, variant }: { width: number; variant: 'outline' | 'plain' }) {
  return <div data-testid={`parity-${variant}-${width}`} style={{ inlineSize: width, display: 'grid', gap: 16 }}>
    <Tree label={`Tree ${variant} ${width}`} nodes={treeNodes} variant={variant} alignLeaves={false} defaultSelectedId="b" />
    <List aria-label={`List ${variant} ${width}`} variant={variant} items={slotItems} selectedId="b" onSelectionChange={() => {}} />
  </div>;
}

function Selectable() {
  const [selectedId, setSelectedId] = useState<string | null>('run-1');
  return <List aria-label="Runs" variant="outline" selectedId={selectedId}
    onSelectionChange={id => { calls.push(`select:${id}`); setSelectedId(id); }}
    items={[run('run-1', 'Refactor the board', 'Done'), run('run-2', 'Fix the composer height', 'Done'), { ...run('run-3', 'Clickable chevrons', 'Done'), label: 'Run 3: clickable chevrons' }]} />;
}

/** Like a Sidebar body: 16px padding, a scrolling box, a search field above the rows, and an app focus ring. */
function SidebarBody() {
  const runs: ListItem[] = [{ id: 'a', content: <Text bold>Run A</Text> }, { id: 'b', content: <Text bold>Run B</Text> }, { id: 'c', content: <Text bold>Run C</Text> }];
  return <div data-testid="sidebar" style={{ inlineSize: 320, blockSize: 640, padding: 16, overflow: 'auto', boxSizing: 'border-box', display: 'grid', gap: 12, alignContent: 'start', border: '1px solid' }}>
    <style>{'.cr-list-row-action:focus-visible, .cr-tree-item:focus-visible > .cr-tree-row { outline: 2px solid rgb(255, 0, 0); outline-offset: -2px; }'}</style>
    <input data-testid="search" aria-label="Search runs" style={{ boxSizing: 'border-box', inlineSize: '100%', margin: 0 }} />
    <List aria-label="Flush runs" variant="plain" flush defaultSelectedId="a" onSelectionChange={() => {}} items={runs} />
    <List aria-label="Default runs" variant="plain" defaultSelectedId="a" onSelectionChange={() => {}} items={runs} />
    <List aria-label="Flush outline runs" variant="outline" flush maxHeight={120} defaultSelectedId="a" onSelectionChange={() => {}} items={runs} />
    <Tree label="Flush tree" nodes={treeNodes} variant="plain" flush alignLeaves={false} defaultSelectedId="a" />
    <Tree label="Default tree" nodes={treeNodes} variant="plain" alignLeaves={false} defaultSelectedId="a" />
  </div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode>
  <main style={{ display: 'grid', gap: 32, padding: 24, inlineSize: 900 }}>
    <h1>List rows fixture</h1>
    <div style={{ display: 'flex', gap: 24, alignItems: 'start' }}>
      <Parity width={560} variant="outline" /><Parity width={320} variant="outline" />
      <Parity width={560} variant="plain" /><Parity width={320} variant="plain" />
    </div>
    <div data-testid="selectable" style={{ inlineSize: 480 }}><Selectable /></div>
    <SidebarBody />
    <div data-testid="links" style={{ inlineSize: 480 }}>
      <List aria-label="Threads" variant="plain" items={[
        { id: 't1', href: '#thread-1', selected: true, content: <Text bold>Thread one</Text> },
        { id: 't2', href: '#thread-2', content: <Text bold>Thread two</Text>, onClick: () => calls.push('click:t2') },
      ]} />
    </div>
    <div data-testid="sizes" style={{ inlineSize: 480 }}>
      <List aria-label="Sized" variant="outline" maxHeight={200} minWidth={240} items={[
        { ...run('s1', 'Clipped row', 'Done'), maxHeight: 64 },
        { ...run('s2', 'Narrow row', 'Done'), maxWidth: 300, minHeight: '120px' },
        run('s3', 'Third row', 'Done'),
      ]} />
    </div>
    <Flex data-testid="flex-row" direction="row" gap={4}>
      <List aria-label="Left" variant="outline" items={[run('l1', 'Left row', 'Done')]} onSelectionChange={() => {}} />
      <List aria-label="Right" variant="outline" items={[run('r1', 'Right row', 'Done')]} onSelectionChange={() => {}} />
    </Flex>
    <div style={{ inlineSize: 700 }}>
      <Flex data-testid="flex-column" direction="column" gap={4}>
        <List aria-label="In a column" variant="outline" items={[run('c1', 'Column row', 'Done')]} onSelectionChange={() => {}} />
      </Flex>
    </div>
  </main>
</StrictMode>);
