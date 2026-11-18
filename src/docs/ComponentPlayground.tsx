import { lazy, Suspense } from 'react';
import { ActivityItemDemo, BlockquoteDemo } from './ContentBlocksDemo';
import { AgentActivityDemo } from './AgentActivityDemo';
import { DisclosurePage } from './DisclosurePage';
import { FieldsetPage } from './FieldsetPage';
import { GridDemo } from './GridDemo';
import { GridSpacerDemo } from './GridSpacerDemo';
import { MasonryDemo, MasonryItemDemo, MasonrySpacerDemo } from './MasonryDemo';
import { FlexDemo } from './FlexDemo';
import { FormDemo, FormLayoutDemo } from './FormDemo';
import { TooltipDemo } from './TooltipDemo';
import { ModalsPage } from './ModalsPage';
import { NumberInputDemo } from './NumberInputDemo';
import { PathSelectorDemo } from './PathSelectorDemo';
import { SegmentedControlDemo } from './SegmentedControlDemo';
import { SidebarDemo } from './SidebarDemo';
import { SliderDemo } from './SliderDemo';
import { StatDemo, StatGroupDemo } from './StatDemo';
import { SwimlaneDemo } from './SwimlaneDemo';
import { TreeDemo } from './TreeDemo';
import { Showcase } from './shared';
import { componentReferences } from './reference';

const CoreScenarios = lazy(() => import('./CoreScenarios').then(module => ({ default: module.CoreScenarios })));
const FormScenarios = lazy(() => import('./FormScenarios').then(module => ({ default: module.FormScenarios })));
const LayoutScenarios = lazy(() => import('./LayoutScenarios').then(module => ({ default: module.LayoutScenarios })));
const MarkdownPage = lazy(() => import('./MarkdownPage').then(module => ({ default: module.MarkdownPage })));
const ConversationDemo = lazy(() => import('./ConversationDemo').then(module => ({ default: module.ConversationDemo })));
const TimelineDemo = lazy(() => import('./TimelineDemo').then(module => ({ default: module.TimelineDemo })));
const StepsDemo = lazy(() => import('./StepsDemo').then(module => ({ default: module.StepsDemo })));

const demosWithOwnShowcases = new Set([
  'ActivityItem', 'AgentActivity', 'AgentCard', 'Alert', 'Autocomplete', 'Avatar',
  'AvatarGroup', 'Badge', 'Blockquote', 'BrandMark', 'Breadcrumbs', 'Button',
  'CalloutBanner', 'Card', 'Checkbox', 'Conversation', 'Dialog', 'Disclosure',
  'Divider', 'Drawer', 'EmptyState', 'Fieldset', 'FilePicker', 'Flex', 'Form', 'FormLayout', 'Grid', 'GridItem', 'GridSpacer',
  'Masonry', 'MasonryItem', 'MasonrySpacer',
  'IconButton', 'MarkdownRenderer', 'MessageComposer', 'NumberInput', 'PagePanel',
  'PathSelector', 'Progress', 'SegmentedControl', 'Select', 'Sidebar', 'Skeleton',
  'Slider', 'Spinner', 'Stat', 'StatGroup', 'Swimlane', 'Switch', 'Tabs', 'TaskCard',
  'Steps', 'TextArea', 'TextField', 'Timeline', 'ToastProvider', 'Tooltip', 'Tree',
]);

/** Scenario galleries own their frames; new simple playgrounds get a shared fallback. */
export function ComponentPlayground({ name, code }: { name: string; code?: string }) {
  if (demosWithOwnShowcases.has(name)) return <ComponentPlaygroundContent name={name} />;
  const reference = componentReferences.find(item => item.name === name);
  const source = code ?? [reference?.importCode, reference?.usageCode].filter(Boolean).join('\n\n');
  const title = `${name.replace(/([a-z0-9])([A-Z])/g, '$1 $2')} example`;
  return <Showcase title={title} description="Interactive example and React usage." code={source}><ComponentPlaygroundContent name={name} /></Showcase>;
}

function ComponentPlaygroundContent({ name }: { name: string }) {
  switch (name) {
    case 'Button':
    case 'Badge':
    case 'Avatar':
    case 'AvatarGroup':
    case 'IconButton':
    case 'Card':
    case 'Alert':
    case 'Progress':
    case 'Skeleton':
    case 'Spinner':
    case 'EmptyState':
    case 'Tabs':
    case 'Breadcrumbs':
    case 'BrandMark':
    case 'Divider':
    case 'ToastProvider':
      return <Suspense fallback={<p className="muted">Loading examples…</p>}><CoreScenarios name={name} /></Suspense>;
    case 'TextField':
    case 'TextArea':
    case 'Select':
    case 'Checkbox':
    case 'Switch':
    case 'Autocomplete':
    case 'FilePicker':
    case 'MessageComposer':
      return <Suspense fallback={<p className="muted">Loading examples…</p>}><FormScenarios name={name} /></Suspense>;
    case 'AgentCard':
    case 'CalloutBanner':
    case 'TaskCard':
    case 'Drawer':
    case 'PagePanel':
    case 'GridItem':
      return <Suspense fallback={<p className="muted">Loading examples…</p>}><LayoutScenarios name={name} /></Suspense>;
    case 'ActivityItem': return <ActivityItemDemo />;
    case 'AgentActivity': return <AgentActivityDemo />;
    case 'Blockquote': return <BlockquoteDemo />;
    case 'Conversation': return <Suspense fallback={<p className="muted">Loading conversation example…</p>}><ConversationDemo /></Suspense>;
    case 'Dialog': return <ModalsPage showGuidance={false} />;
    case 'Disclosure': return <DisclosurePage showGuidance={false} />;
    case 'Fieldset': return <FieldsetPage showGuidance={false} />;
    case 'Form': return <FormDemo />;
    case 'FormLayout': return <FormLayoutDemo />;
    case 'Flex': return <FlexDemo />;
    case 'Grid': return <GridDemo />;
    case 'GridSpacer': return <GridSpacerDemo />;
    case 'Masonry': return <MasonryDemo />;
    case 'MasonryItem': return <MasonryItemDemo />;
    case 'MasonrySpacer': return <MasonrySpacerDemo />;
    case 'MarkdownRenderer': return <Suspense fallback={<p className="muted">Loading Markdown example…</p>}><MarkdownPage /></Suspense>;
    case 'NumberInput': return <NumberInputDemo />;
    case 'PathSelector': return <PathSelectorDemo />;
    case 'SegmentedControl': return <SegmentedControlDemo />;
    case 'Sidebar': return <SidebarDemo />;
    case 'Slider': return <SliderDemo />;
    case 'Stat': return <StatDemo />;
    case 'StatGroup': return <StatGroupDemo />;
    case 'Steps': return <Suspense fallback={<p className="muted">Loading examples…</p>}><StepsDemo /></Suspense>;
    case 'Swimlane': return <SwimlaneDemo />;
    case 'Timeline': return <Suspense fallback={<p className="muted">Loading examples…</p>}><TimelineDemo /></Suspense>;
    case 'Tree': return <TreeDemo />;
    case 'Tooltip': return <TooltipDemo />;
    default: throw new Error(`No live example registered for ${name}.`);
  }
}
