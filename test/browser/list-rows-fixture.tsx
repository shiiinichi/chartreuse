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

createRoot(document.getElementById('root')!).render(<StrictMode>
  <main style={{ display: 'grid', gap: 32, padding: 24, inlineSize: 900 }}>
    <h1>List rows fixture</h1>
    <div style={{ display: 'flex', gap: 24, alignItems: 'start' }}>
      <Parity width={560} variant="outline" /><Parity width={320} variant="outline" />
      <Parity width={560} variant="plain" /><Parity width={320} variant="plain" />
    </div>
    <div data-testid="selectable" style={{ inlineSize: 480 }}><Selectable /></div>
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
