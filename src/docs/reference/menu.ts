import type { ComponentReference } from './types';

export const menuReference: ComponentReference = {
  name: 'Menu',
  slug: 'menu',
  summary: 'An action menu behind a trigger button, such as the ⋯ Edit, Copy link, and Delete actions on a comment.',
  importCode: "import { Copy, Pencil, Trash2 } from 'lucide-react';\nimport { Menu } from '@chartreuse/ui';",
  usageCode: `export function CommentActions({ number, onEdit, onCopyLink, onDelete }: {
  number: number;
  onEdit: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
}) {
  return <Menu size="sm" label={\`More actions for #\${number}\`} items={[
    { id: 'edit', label: 'Edit', icon: Pencil, onSelect: onEdit },
    { id: 'copy', label: 'Copy link', icon: Copy, onSelect: onCopyLink },
    { type: 'separator' },
    { id: 'delete', label: 'Delete', icon: Trash2, tone: 'danger', onSelect: onDelete },
  ]} />;
}`,
  nativeElement: 'button[aria-haspopup="menu"] and a div[popover][role="menu"] of button[role="menuitem"]',
  nativeProps: 'Button props, native events, and ref target the trigger. Menu manages its type, popover target, aria-haspopup, aria-expanded, and aria-controls.',
  props: [
    { name: 'label', type: 'string', required: true, description: 'Accessible name of the trigger and the menu, such as "More actions for #5". It is also the tooltip of an icon-only trigger.' },
    { name: 'items', type: 'readonly MenuEntry[]', required: true, description: "Actions and separators. An item is { id, label, icon?, tone?: 'neutral' | 'danger', disabled?, onSelect }; a separator is { type: 'separator' }." },
    { name: 'icon', type: 'IconSource', defaultValue: 'Ellipsis', description: 'Trigger icon.' },
    { name: 'children', type: 'ReactNode', description: 'Visible trigger text. Without it the trigger is an icon button named by label.' },
    { name: 'align', type: "'start' | 'end'", defaultValue: "'end'", description: 'Which trigger edge the menu lines up with. The default suits a trigger at the end of a row; the menu stays inside the viewport either way.' },
    { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'link' | 'dashed'", defaultValue: "'ghost'", description: 'Trigger Button variant.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Trigger Button size.' },
    { name: 'panelClassName', type: 'string', description: 'Additional classes on the menu panel.' },
    { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Native ref to the trigger.' },
  ],
  notes: [
    'Use Menu for actions; use ButtonSelect or SplitButton to pick a value. onSelect runs after the menu closes and focus returns to the trigger, so an action such as Edit can move focus into a field.',
    'Keyboard: Enter, Space, or ArrowDown opens the menu on its first item and ArrowUp on its last. Arrow keys wrap, Home and End jump, typing a letter moves to the next matching item, Enter or Space runs it, Escape closes the menu and returns focus to the trigger, and Tab closes it and moves on. Disabled items are skipped.',
    "tone: 'danger' colors a destructive item, such as Delete; confirm it in the host, for example in a Card footer with footerTone=\"danger\".",
    'The panel is a popover in the top layer, so it is not clipped by a scrolling pane, and it restores the root color tokens like other Chartreuse popups. Clicking outside closes it.',
  ],
};

export const menuReferences: ComponentReference[] = [menuReference];
