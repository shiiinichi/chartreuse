import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';

/** Small component diagrams using the sidebar’s existing SVG sizing contract. */
function componentIcon(name: string, artwork: ReactNode): LucideIcon {
  const Icon = forwardRef<SVGSVGElement, LucideProps>(({ size = 24, color = 'currentColor', strokeWidth = 1.6, absoluteStrokeWidth = false, width = size, height = size, className, ...props }, ref) => {
    const numericSize = typeof size === 'number' ? size : Number(size);
    const weight = absoluteStrokeWidth && Number.isFinite(numericSize) && numericSize > 0 ? Number(strokeWidth) * 24 / numericSize : strokeWidth;
    return <svg ref={ref} viewBox="0 0 24 24" width={width} height={height} fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" {...props} className={['component-sidebar-icon', className].filter(Boolean).join(' ')} data-component-icon={name} aria-hidden="true" focusable="false" tabIndex={-1}>{artwork}</svg>;
  });
  Icon.displayName = `${name}SidebarIcon`;
  return Icon;
}

export const componentSidebarIcons: Record<string, LucideIcon> = {
  ActivityItem: componentIcon('ActivityItem', <><path d="M4 3v2m0 4v12M9 7h12M9 12h10M9 17h6" /><circle cx="4" cy="7" r="2" /></>),
  AgentActivity: componentIcon('AgentActivity', <><path d="M4 3v18M4 6h5M4 16h8" /><rect x="9" y="3" width="12" height="6" rx="1.5" /><rect x="12" y="13" width="9" height="6" rx="1.5" /><path d="M12 6h6m-3 10h3" /></>),
  AgentCard: componentIcon('AgentCard', <><rect x="2" y="4" width="20" height="16" rx="2" /><circle cx="8" cy="10" r="2" /><circle cx="6" cy="16" r="1" /><circle cx="11" cy="16" r="1" /><path d="m7 12-1 3m3-3 1 3m5-6h4m-4 5h4" /></>),
  Alert: componentIcon('Alert', <><path d="m10.3 3.6-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none" /></>),
  Autocomplete: componentIcon('Autocomplete', <><rect x="2" y="3" width="20" height="7" rx="2" /><circle cx="7" cy="6.3" r="1.7" /><path d="m8.3 7.6 1.2 1.2M12 6.5h6M5 14h2m3 0h10M5 19h2m3 0h7" /></>),
  Avatar: componentIcon('Avatar', <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="9" r="3" /><path d="M5.5 18a7 7 0 0 1 13 0" /></>),
  AvatarGroup: componentIcon('AvatarGroup', <><circle cx="12" cy="12" r="4" /><path d="M7 8a4 4 0 1 0 0 8M17 8a4 4 0 1 1 0 8" /></>),
  Badge: componentIcon('Badge', <><path d="M3 7h12l6 5-6 5H3Z" /><circle cx="6.5" cy="12" r=".8" fill="currentColor" stroke="none" /><path d="M10 12h5" /></>),
  ChipGroup: componentIcon('ChipGroup', <><rect x="2" y="5" width="9" height="6" rx="3" /><rect x="13" y="5" width="9" height="6" rx="3" /><rect x="2" y="13" width="12" height="6" rx="3" /><circle cx="5" cy="8" r=".8" fill="currentColor" stroke="none" /></>),
  List: componentIcon('List', <><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /><path d="M9 6h12M9 12h12M9 18h12" /></>),
  Blockquote: componentIcon('Blockquote', <><path d="M3 3v18M8 17h13M9 6H7v5h4V7H8m10-1h-2v5h4V7h-3" /></>),
  BrandMark: componentIcon('BrandMark', <path d="M12 12H3V3h3a6 6 0 0 1 6 6Zm0 0V3h9v3a6 6 0 0 1-6 6Zm0 0h9v9h-3a6 6 0 0 1-6-6Zm0 0v9H3v-3a6 6 0 0 1 6-6Z" fill="currentColor" stroke="none" />),
  Breadcrumbs: componentIcon('Breadcrumbs', <><rect x="2" y="10" width="4" height="4" rx="1" /><path d="m9 10 2 2-2 2m6-4 2 2-2 2" /><path d="M20 10h2v4h-2" /></>),
  Button: componentIcon('Button', <><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M7 12h10" /></>),
  CalloutBanner: componentIcon('CalloutBanner', <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M6 5v14M10 10h8m-8 4h6" /></>),
  Card: componentIcon('Card', <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 8h18M7 12h10M7 16h6" /></>),
  Checkbox: componentIcon('Checkbox', <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m7 12 3 3 7-7" /></>),
  Conversation: componentIcon('Conversation', <><path d="M4 3h11a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6l-4 3V5a2 2 0 0 1 2-2Zm6 10h10a2 2 0 0 1 2 2v7l-4-3h-8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" /><path d="M6 6.5h7M12 16h6" /></>),
  Dialog: componentIcon('Dialog', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20m-5-3 2 2m0-2-2 2M14 16h5" /></>),
  Disclosure: componentIcon('Disclosure', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m5 8 3 3 3-3m3 1h4M6 15h12" /></>),
  Divider: componentIcon('Divider', <><path d="M2 12h20" /><path d="M7 6h10M7 18h10" strokeDasharray="2 3" /></>),
  Drawer: componentIcon('Drawer', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M14 3v18m4-12-3 3 3 3" /></>),
  EmptyState: componentIcon('EmptyState', <><path d="M3 14 6 5h12l3 9v6H3Z" /><path d="M3 14h5l2 3h4l2-3h5" /></>),
  Fieldset: componentIcon('Fieldset', <><path d="M5 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5" /><rect x="6" y="3" width="8" height="5" rx="1" /><path d="M6 13h2m3 0h7M6 17h2m3 0h5" /></>),
  FilePicker: componentIcon('FilePicker', <><path d="M13 21H5V3h9l5 5v5M14 3v5h5" /><circle cx="17" cy="17" r="4" /><path d="M15 17h4m-2-2v4" /></>),
  Form: componentIcon('Form', <><rect x="3" y="2" width="18" height="20" rx="2" /><path d="M7 6h4M7 13h4m3 5h3" /><rect x="7" y="8" width="10" height="3" rx=".5" /><rect x="7" y="15" width="10" height="3" rx=".5" /></>),
  FormLayout: componentIcon('FormLayout', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M6 8h3m-3 8h3M12 3v18" /><rect x="15" y="6" width="4" height="4" rx=".5" /><rect x="15" y="14" width="4" height="4" rx=".5" /></>),
  SegmentedProgress: componentIcon('SegmentedProgress', <><rect x="2" y="9" width="20" height="6" rx="3" /><path d="M8 9v6m6-6v6" /><path d="M4.5 12h2" strokeWidth="3" /></>),
  SwimlaneGroup: componentIcon('SwimlaneGroup', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M9 3v18m6-18v18M2 8h20" /><rect x="4" y="10" width="3" height="3" rx=".5" /><rect x="11" y="10" width="2" height="3" rx=".5" /></>),
  ToggleChip: componentIcon('ToggleChip', <><rect x="2" y="7" width="20" height="10" rx="5" /><circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none" /><path d="M11 12h4m3 0h.5" /></>),
  Tooltip: componentIcon('Tooltip', <><path d="M4 3h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l-3 5-3-5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M7 7h10M7 11h7" /></>),
  Grid: componentIcon('Grid', <><rect x="3" y="3" width="18" height="18" rx="1.5" /><path d="M9 3v18m6-18v18M3 9h18M3 15h18" /></>),
  GridItem: componentIcon('GridItem', <><rect x="3" y="3" width="11" height="10" rx="1" /><rect x="17" y="3" width="4" height="4" rx=".5" /><rect x="17" y="10" width="4" height="4" rx=".5" /><rect x="3" y="17" width="18" height="4" rx=".5" /></>),
  GridSpacer: componentIcon('GridSpacer', <><rect x="3" y="4" width="7" height="7" rx="1" /><rect x="14" y="4" width="7" height="7" rx="1" strokeDasharray="2 2" /><rect x="3" y="15" width="7" height="5" rx="1" /><rect x="14" y="15" width="7" height="5" rx="1" /></>),
  Flex: componentIcon('Flex', <><rect x="3" y="8" width="4" height="8" rx="1" /><rect x="10" y="6" width="4" height="12" rx="1" /><rect x="17" y="8" width="4" height="8" rx="1" /><path d="M3 3h18M3 21h18" /></>),
  Masonry: componentIcon('Masonry', <><rect x="3" y="3" width="7" height="11" rx="1" /><rect x="3" y="17" width="7" height="4" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="11" width="7" height="10" rx="1" /></>),
  MasonryItem: componentIcon('MasonryItem', <><rect x="3" y="3" width="18" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h7v7h-7z" strokeDasharray="2 2" /></>),
  MasonrySpacer: componentIcon('MasonrySpacer', <><rect x="3" y="3" width="7" height="6" rx="1" /><rect x="3" y="12" width="7" height="9" rx="1" strokeDasharray="2 2" /><rect x="14" y="3" width="7" height="12" rx="1" /><rect x="14" y="18" width="7" height="3" rx=".5" /></>),
  IconButton: componentIcon('IconButton', <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 12h8m-4-4v8" /></>),
  MarkdownRenderer: componentIcon('MarkdownRenderer', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M5 15V9l3 3 3-3v6m3-3 3 3 3-3m-3-3v6" /></>),
  MessageComposer: componentIcon('MessageComposer', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M6 7h10M6 11h6M2 15h20m-7 4 2-2 2 2m-2-2v4" /></>),
  Navbar: componentIcon('Navbar', <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h3v4H6Zm6 2h2m3 0h1" /></>),
  NavbarItem: componentIcon('NavbarItem', <><rect x="4" y="7" width="16" height="10" rx="3" /><path d="M8 12h8" /></>),
  NavbarItemGroup: componentIcon('NavbarItemGroup', <><rect x="2" y="7" width="20" height="10" rx="3" /><rect x="4" y="9" width="7" height="6" rx="1.5" /><path d="M14 12h2m2 0h1" /></>),
  NumberInput: componentIcon('NumberInput', <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M16 6v12M8 9l-2 2h2v4m-2 0h4m8-5 1-1 1 1m-2 4 1 1 1-1" /></>),
  PagePanel: componentIcon('PagePanel', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M2 8h20M2 17h20M6 12h5m3 0h4" /></>),
  Pagination: componentIcon('Pagination', <><path d="m5 9-3 3 3 3m14-6 3 3-3 3" /><rect x="8" y="8" width="8" height="8" rx="1.5" /><path d="M11 12h2" /></>),
  PathSelector: componentIcon('PathSelector', <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="m7 9-2 6m5-3h3m3-2 2 2-2 2" /></>),
  Progress: componentIcon('Progress', <><rect x="2" y="9" width="20" height="6" rx="3" /><path d="M5 12h8" strokeWidth="3" /></>),
  SegmentedControl: componentIcon('SegmentedControl', <><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M9 6v12m7-12v12" /><rect x="4" y="8" width="3" height="8" rx="1" fill="currentColor" stroke="none" /></>),
  Select: componentIcon('Select', <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M6 12h5m4-1 2 2 2-2" /></>),
  Sidebar: componentIcon('Sidebar', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M8 3v18M4.5 7h1m-1 4h1m-1 4h1M12 7h6m-6 5h4" /></>),
  Skeleton: componentIcon('Skeleton', <><rect x="3" y="3" width="18" height="4" rx="2" /><rect x="3" y="10" width="13" height="4" rx="2" /><rect x="3" y="17" width="16" height="4" rx="2" /></>),
  Slider: componentIcon('Slider', <><path d="M2 12h4m6 0h10" /><circle cx="9" cy="12" r="3" /><path d="M3 19v1m9-1v1m9-1v1" /></>),
  Spinner: componentIcon('Spinner', <><path d="M20 12a8 8 0 1 1-8-8" /><circle cx="20" cy="12" r="1" fill="currentColor" stroke="none" /></>),
  Stat: componentIcon('Stat', <><path d="M4 4h10M7 10l-2 2h2v8m-2 0h4m4-8h5l-5 8h5" /></>),
  StatGroup: componentIcon('StatGroup', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M8.5 4v16m7-16v16M4 8h2m5 0h2m5 0h2M4 15h2m5 0h2m5 0h2" /></>),
  Steps: componentIcon('Steps', <><circle cx="4" cy="10" r="2" /><circle cx="12" cy="10" r="2" /><circle cx="20" cy="10" r="2" /><path d="M6 10h4m4 0h4M2 16h4m4 0h4m4 0h4" /></>),
  Swimlane: componentIcon('Swimlane', <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M5 8h14M10 5h6" /><circle cx="8" cy="5" r=".7" fill="currentColor" stroke="none" /><rect x="8" y="11" width="8" height="3" rx=".5" /><rect x="8" y="17" width="8" height="3" rx=".5" /></>),
  Switch: componentIcon('Switch', <><rect x="2" y="7" width="20" height="10" rx="5" /><circle cx="16" cy="12" r="2.5" fill="currentColor" stroke="none" /></>),
  Table: componentIcon('Table', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20M2 14.5h20M10 4v16" /></>),
  Tabs: componentIcon('Tabs', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20M10 4v6M5 7h2m-1 8h12" /></>),
  TaskCard: componentIcon('TaskCard', <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 7h10M7 11h7m-1 6h4" /><rect x="6" y="15" width="4" height="4" rx=".5" /></>),
  TextArea: componentIcon('TextArea', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M6 7h12M6 11h12M6 15h7m3 3 3-3m-1 4 2-2" /></>),
  TextField: componentIcon('TextField', <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M7 9v6m-1-6h2m-2 6h2m3-3h7" /></>),
  Timeline: componentIcon('Timeline', <><circle cx="5" cy="4" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="5" cy="20" r="2" /><path d="M5 6v4m0 4v4M11 4h10m-10 8h7m-7 8h10" /></>),
  ToastProvider: componentIcon('ToastProvider', <><path d="M4 20H2V4h20v6" /><rect x="6" y="12" width="16" height="8" rx="2" /><path d="m9 16 2 2 3-4m3 2h2" /></>),
  Tree: componentIcon('Tree', <><circle cx="5" cy="4" r="2" /><path d="M5 6v14h8M5 12h8" /><rect x="13" y="9" width="8" height="5" rx="1" /><rect x="13" y="17" width="8" height="5" rx="1" /></>),
  WorkspaceContent: componentIcon('WorkspaceContent', <><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M2 8h20M8 8v13M12 12h6m-6 4h4" /></>),
  WorkspaceLayout: componentIcon('WorkspaceLayout', <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M9 4v16M5 8h1m-1 4h1m-1 4h1M13 8h5m-5 4h5m-5 4h5" /></>),
};
