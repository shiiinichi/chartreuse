import type { ComponentReference } from './types';

export const treeReferences: ComponentReference[] = [{
  name: 'Tree',
  slug: 'tree',
  summary: 'An expandable single-selection hierarchy with branch connectors, custom node content, and keyboard navigation.',
  importCode: "import { Tree } from '@chartreuse/ui';\nimport type { TreeNode } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `const nodes: TreeNode[] = [{
  id: 'coordinator', label: 'Coordinator',
  children: [
    { id: 'reviewer-1', label: 'Reviewer · Call 2' },
    { id: 'reviewer-2', label: 'Reviewer · Call 3' },
  ],
}];

<Tree
  label="Call hierarchy"
  nodes={nodes}
  defaultExpandedIds={['coordinator']}
  selectedId={selectedCall}
  onSelectionChange={setSelectedCall}
/>

// Use plain rows for a compact navigator.
<Tree label="Workspace files" nodes={files} variant="plain" />`,
  props: [
    { name: 'nodes', type: 'readonly TreeNode[]', required: true, description: 'Root nodes. Each node has a unique id, a plain-text label, and optional description, IconSource icon, and children.' },
    { name: 'label', type: 'string', required: true, description: 'Accessible name for the hierarchy. A native aria-labelledby prop may associate an existing visible heading instead.' },
    { name: 'selectedId', type: 'string | null', description: 'Controlled selected node. Selection is independent of keyboard focus.' },
    { name: 'defaultSelectedId', type: 'string | null', defaultValue: 'null', description: 'Initial selected node when selection is uncontrolled.' },
    { name: 'onSelectionChange', type: '(id: string, node: TreeNode) => void', description: 'Called when clicking a node, Enter, or Space requests a different selection.' },
    { name: 'expandedIds', type: 'readonly string[]', description: 'Controlled IDs of expanded parent nodes.' },
    { name: 'defaultExpandedIds', type: 'readonly string[]', defaultValue: '[]', description: 'Initially expanded parents when expansion is uncontrolled.' },
    { name: 'onExpandedChange', type: '(ids: string[]) => void', description: 'Reports the next expanded IDs after a branch toggle or arrow-key request.' },
    { name: 'variant', type: "'outline' | 'plain'", defaultValue: "'outline'", description: 'Outline gives each node a card surface; plain uses compact rows.' },
    { name: 'connectors', type: 'boolean', defaultValue: 'true', description: 'Shows the parent rail and branch connectors.' },
    { name: 'renderNode', type: '(node: TreeNode, state: TreeNodeState) => ReactNode', description: 'Optional display content replacing the default label and description. State supplies selected, expanded, and level. Keep node.label visibly present and omit interactive descendants.' },
    { name: 'emptyMessage', type: 'ReactNode', defaultValue: "'No items available.'", description: 'Content displayed when nodes is empty.' },
    { name: 'className', type: 'string', description: 'Additional classes on the root ul.' },
    { name: 'ref', type: 'Ref<HTMLUListElement>', description: 'Native ref to the root ul.' },
  ],
  nativeElement: 'ul[role="tree"] with li[role="treeitem"] and nested ul[role="group"]',
  nativeProps: 'Inherits ul props/ref except children, role, onSelect, aria-label, and tabIndex. label supplies aria-label; onSelectionChange owns selection and the tree owns its one Tab stop. Native onKeyDown, onKeyUp, onFocus, and onBlur callbacks are composed with tree behavior.',
  notes: [
    'Use Tree when parent-child relationships need to be exposed. Use an ordinary list for unrelated cards or a disclosure when content simply needs to expand.',
    'Each tree is one Tab stop. Up/Down move through visible nodes; Right opens a branch or enters its first child, Left closes a branch or returns to its parent. Left/Right are mirrored in right-to-left layouts.',
    'Home and End reach the first and last visible nodes. Typing a label moves focus to a matching node; repeated initial letters cycle through matches.',
    'Enter and Space select; arrow keys move focus without changing the selected node. Keep the inspector or other actions beside the tree, rather than inside its node content.',
    'TreeNode IDs must be stable and unique within the tree. Supply expandedIds/onExpandedChange or defaultExpandedIds independently from controlled or uncontrolled selection.',
    'A custom renderNode may show status, time, descriptions, and counts, as in the call hierarchy. Keep node.label visible, supply a concise description for supplemental accessible context, and avoid nested links, buttons, or form controls.',
    'Use outline nodes for multiline summaries and plain rows for compact navigation. Indentation responds to the tree’s container width so the same component fits panels and wider pages.',
  ],
}];
