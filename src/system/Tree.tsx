import { useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import { Text } from './Text';
import './tree.css';

export interface TreeNode {
  /** Stable and unique within this tree. */
  id: string;
  /** Plain-text name used by assistive technology and type-ahead. */
  label: string;
  description?: string;
  icon?: IconSource;
  children?: readonly TreeNode[];
}

export interface TreeNodeState {
  selected: boolean;
  expanded: boolean;
  level: number;
}

export interface TreeProps extends Omit<ComponentPropsWithRef<'ul'>, 'children' | 'role' | 'onSelect' | 'aria-label' | 'tabIndex'> {
  nodes: readonly TreeNode[];
  label: string;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (id: string, node: TreeNode) => void;
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedChange?: (ids: string[]) => void;
  variant?: 'outline' | 'plain';
  connectors?: boolean;
  /** Display content only: include node.label and keep links/actions outside the tree. */
  renderNode?: (node: TreeNode, state: TreeNodeState) => ReactNode;
  emptyMessage?: ReactNode;
}

interface IndexedNode {
  node: TreeNode;
  parentId: string | null;
  level: number;
  position: number;
  siblings: number;
  domId: string;
}

/** A single-selection hierarchy. Focus moves independently of selection. */
export function Tree({ nodes, label, selectedId, defaultSelectedId = null, onSelectionChange,
  expandedIds, defaultExpandedIds = [], onExpandedChange, variant = 'outline', connectors = true,
  renderNode, emptyMessage = 'No items available.', className, ref, onKeyDown, onKeyUp,
  onBlur, onFocus, ...props }: TreeProps) {
  const instance = useId();
  const root = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const focusInside = useRef(false);
  const lastFocused = useRef<{ id: string; element: HTMLElement; ancestors: string[] } | null>(null);
  const search = useRef({ text: '', at: 0 });
  const [internalSelected, setInternalSelected] = useState<string | null>(defaultSelectedId);
  const [internalExpanded, setInternalExpanded] = useState<readonly string[]>(() => [...defaultExpandedIds]);
  const [focusedId, setFocusedId] = useState<string | null>(selectedId ?? defaultSelectedId);
  useImperativeHandle(ref, () => root.current!, []);

  const selected = selectedId === undefined ? internalSelected : selectedId;
  const expanded = new Set(expandedIds ?? internalExpanded);
  const index = useMemo(() => {
    const result = new Map<string, IndexedNode>();
    const visit = (items: readonly TreeNode[], parentId: string | null, level: number) => {
      items.forEach((node, position) => {
        if (result.has(node.id)) throw new Error(`Tree node IDs must be unique: ${node.id}`);
        result.set(node.id, { node, parentId, level, position: position + 1, siblings: items.length, domId: `${instance}-node-${result.size}` });
        if (node.children?.length) visit(node.children, node.id, level + 1);
      });
    };
    visit(nodes, null, 1);
    return result;
  }, [nodes, instance]);

  const visible: IndexedNode[] = [];
  const collect = (items: readonly TreeNode[]) => items.forEach(node => {
    visible.push(index.get(node.id)!);
    if (expanded.has(node.id) && node.children?.length) collect(node.children);
  });
  collect(nodes);
  const visibleIds = new Set(visible.map(item => item.node.id));
  const visibleAncestor = (id: string | null): string | null => {
    let item = id === null ? undefined : index.get(id);
    while (item && !visibleIds.has(item.node.id)) item = item.parentId === null ? undefined : index.get(item.parentId);
    return item?.node.id ?? null;
  };
  const tabStop = visibleAncestor(focusedId) ?? visibleAncestor(selected) ?? visible[0]?.node.id;

  useLayoutEffect(() => {
    const previous = lastFocused.current;
    if (!focusInside.current || !previous || visibleIds.has(previous.id) || !root.current) return;
    const active = document.activeElement;
    // Collapsing/removing the focused node can send browser focus to body.
    // A real external focus target always wins; never pull it into the tree.
    if (active && active !== document.body && !root.current.contains(active)) { focusInside.current = false; return; }
    if (previous.element.isConnected && !previous.element.closest('[hidden]')) return;
    const next = previous.ancestors.find(id => visibleIds.has(id)) ?? visibleAncestor(selected) ?? visible[0]?.node.id;
    setFocusedId(next ?? null);
    if (next !== undefined && next !== null) itemRefs.current.get(next)?.focus();
    else { lastFocused.current = null; root.current.focus(); }
  });

  const focus = (id: string | undefined | null) => {
    if (id === undefined || id === null) return;
    setFocusedId(id);
    itemRefs.current.get(id)?.focus();
  };
  const select = (node: TreeNode) => {
    if (selectedId === undefined) setInternalSelected(node.id);
    if (selected !== node.id) onSelectionChange?.(node.id, node);
  };
  const toggle = (node: TreeNode, next = !expanded.has(node.id)) => {
    if (!node.children?.length) return;
    const nextExpanded = new Set(expanded);
    if (next) nextExpanded.add(node.id); else nextExpanded.delete(node.id);
    if (expandedIds === undefined) setInternalExpanded([...nextExpanded]);
    onExpandedChange?.([...nextExpanded]);
  };
  const itemFromEvent = (event: KeyboardEvent<HTMLUListElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return undefined;
    const item = target.closest<HTMLElement>('[data-cr-tree-node]');
    if (!item || item.closest('[role="tree"]') !== root.current) return undefined;
    return index.get(item.dataset.crTreeNode!);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    const item = itemFromEvent(event);
    if (!item) return;
    const position = visible.findIndex(entry => entry.node.id === item.node.id);
    const rtl = root.current && getComputedStyle(root.current).direction === 'rtl';
    const openKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const closeKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    let handled = true;
    if (event.key === 'ArrowDown') focus(visible[Math.min(position + 1, visible.length - 1)]?.node.id);
    else if (event.key === 'ArrowUp') focus(visible[Math.max(position - 1, 0)]?.node.id);
    else if (event.key === 'Home') focus(visible[0]?.node.id);
    else if (event.key === 'End') focus(visible.at(-1)?.node.id);
    else if (event.key === openKey) {
      if (!expanded.has(item.node.id)) toggle(item.node, true);
      else focus(item.node.children?.[0]?.id);
    } else if (event.key === closeKey) {
      if (expanded.has(item.node.id) && item.node.children?.length) toggle(item.node, false);
      else focus(item.parentId);
    } else if (event.key === 'Enter') select(item.node);
    else if (event.key === ' ') { /* Selection happens on keyup; prevent page scrolling now. */ }
    else if (event.key.length === 1) {
      const key = event.key.toLocaleLowerCase();
      const text = event.timeStamp - search.current.at < 700 ? search.current.text + key : key;
      search.current = { text, at: event.timeStamp };
      const query = [...text].every(character => character === key) ? key : text;
      const candidates = [...visible.slice(position + 1), ...visible.slice(0, position + 1)];
      const match = candidates.find(entry => entry.node.label.toLocaleLowerCase().startsWith(query));
      if (match) focus(match.node.id);
    } else handled = false;
    if (handled) event.preventDefault();
  };

  const renderItems = (items: readonly TreeNode[]): ReactNode => items.map(node => {
    const item = index.get(node.id)!;
    const hasChildren = Boolean(node.children?.length);
    const isExpanded = hasChildren && expanded.has(node.id);
    const isSelected = selected === node.id;
    const descriptionId = node.description ? `${item.domId}-description` : undefined;
    return <li key={node.id} id={item.domId} role="treeitem" data-cr-tree-node={node.id}
      aria-label={node.label} aria-describedby={descriptionId} aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined} aria-level={item.level}
      aria-posinset={item.position} aria-setsize={item.siblings}
      tabIndex={tabStop === node.id ? 0 : -1} className="cr-tree-item"
      ref={element => { if (element) itemRefs.current.set(node.id, element); else itemRefs.current.delete(node.id); }}>
      <div className="cr-tree-row" onClick={event => {
        focus(node.id);
        if (hasChildren && event.target instanceof Element && event.target.closest('.cr-tree-toggle')) toggle(node);
        else select(node);
      }}>
        <span className="cr-tree-toggle" data-empty={!hasChildren || undefined} aria-hidden="true">{hasChildren && <ChevronDown size={16} focusable="false" />}</span>
        <div className="cr-tree-content">{renderNode ? <>{renderNode(node, { selected: isSelected, expanded: isExpanded, level: item.level })}{node.description && <span id={descriptionId} className="cr-sr-only">{node.description}</span>}</> : <>
          <div className="cr-tree-label">{renderIcon(node.icon, { size: 16 })}<span>{node.label}</span></div>
          {node.description && <Text size="body" id={descriptionId} className="cr-tree-description">{node.description}</Text>}
        </>}</div>
      </div>
      {hasChildren && <ul className="cr-tree-group" role="group" hidden={!isExpanded}>{renderItems(node.children!)}</ul>}
    </li>;
  });

  return <ul {...props} ref={root} role="tree" aria-label={label} tabIndex={-1}
    className={['cr-tree', className].filter(Boolean).join(' ')} data-variant={variant} data-connectors={connectors}
    onKeyDown={handleKeyDown} onKeyUp={event => {
      onKeyUp?.(event);
      if (event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.key !== ' ') return;
      const item = itemFromEvent(event);
      if (item) { event.preventDefault(); select(item.node); }
    }} onFocus={event => {
      const item = event.target.closest<HTMLElement>('[data-cr-tree-node]');
      focusInside.current = true;
      if (item?.dataset.crTreeNode !== undefined) {
        const id = item.dataset.crTreeNode;
        const ancestors: string[] = [];
        let parent = index.get(id)?.parentId;
        while (parent !== null && parent !== undefined) { ancestors.push(parent); parent = index.get(parent)?.parentId; }
        lastFocused.current = { id, element: item, ancestors };
        setFocusedId(id);
      }
      onFocus?.(event);
    }} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        const previous = lastFocused.current?.element;
        // A disappearing element may blur with no related target. Preserve
        // ownership for the layout-effect repair, but clear genuine exits.
        if (event.relatedTarget || (previous?.isConnected && !previous.closest('[hidden]'))) focusInside.current = false;
        setFocusedId(visibleAncestor(selected) ?? visible[0]?.node.id ?? null);
      }
      onBlur?.(event);
    }}>
    {nodes.length ? renderItems(nodes) : <li role="none" className="cr-tree-empty">{emptyMessage}</li>}
  </ul>;
}
