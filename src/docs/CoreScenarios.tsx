import { AlertScenarios, ButtonScenarios, IconButtonScenarios, ToastProviderScenarios } from './CoreActionScenarios';
import { AvatarGroupScenarios, AvatarScenarios, BadgeScenarios, BrandMarkScenarios, CardScenarios, DividerScenarios } from './CoreDisplayScenarios';
import { BreadcrumbsScenarios, EmptyStateScenarios, ProgressScenarios, SkeletonScenarios, SpinnerScenarios, TabsScenarios } from './CoreFeedbackScenarios';
import './core-scenarios.css';

export const coreScenarioNames = [
  'Button', 'Badge', 'Avatar', 'AvatarGroup', 'IconButton', 'Card', 'Alert',
  'Progress', 'Skeleton', 'Spinner', 'EmptyState', 'Tabs', 'Breadcrumbs',
  'BrandMark', 'Divider', 'ToastProvider',
] as const;

export type CoreScenarioName = typeof coreScenarioNames[number];

/** Each page owns scenario-specific previews and the source displayed beside them. */
export function CoreScenarios({ name }: { name: CoreScenarioName }) {
  switch (name) {
    case 'Button': return <ButtonScenarios />;
    case 'Badge': return <BadgeScenarios />;
    case 'Avatar': return <AvatarScenarios />;
    case 'AvatarGroup': return <AvatarGroupScenarios />;
    case 'IconButton': return <IconButtonScenarios />;
    case 'Card': return <CardScenarios />;
    case 'Alert': return <AlertScenarios />;
    case 'Progress': return <ProgressScenarios />;
    case 'Skeleton': return <SkeletonScenarios />;
    case 'Spinner': return <SpinnerScenarios />;
    case 'EmptyState': return <EmptyStateScenarios />;
    case 'Tabs': return <TabsScenarios />;
    case 'Breadcrumbs': return <BreadcrumbsScenarios />;
    case 'BrandMark': return <BrandMarkScenarios />;
    case 'Divider': return <DividerScenarios />;
    case 'ToastProvider': return <ToastProviderScenarios />;
  }
}
