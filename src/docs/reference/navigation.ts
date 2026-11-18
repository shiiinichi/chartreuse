import type { ComponentReference } from './types';

export interface ComponentNavigationItem {
  id: `components/${string}`;
  label: string;
  description: string;
  component: ComponentReference;
}

export function createComponentNavigation(references: readonly ComponentReference[]): ComponentNavigationItem[] {
  return [...references].sort((a, b) => a.name.localeCompare(b.name)).map(component => ({
    id: `components/${component.slug}`,
    label: component.name,
    description: component.summary,
    component,
  }));
}
