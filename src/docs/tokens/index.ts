import { globalTokens, globalTokenNotes } from './global';
import { coreTokenDocs } from './core';
import { extendedTokenDocs } from './extended';
import { masonryTokenDocs } from './masonry';
import { flexTokenDocs } from './flex';
import { formTokenDocs } from './form';
import { tooltipTokenDocs } from './tooltip';
import { tableTokenDocs } from './table';
import type { ComponentTokenDoc } from './types';

export { globalTokens, globalTokenNotes };
export type { ComponentTokenDoc, RuntimeVariableDefinition, TokenDefinition, TokenSource } from './types';

export const componentTokenDocs: ComponentTokenDoc[] = [...coreTokenDocs, ...extendedTokenDocs, ...masonryTokenDocs, ...flexTokenDocs, ...formTokenDocs, ...tooltipTokenDocs, ...tableTokenDocs].sort((a, b) => a.component.localeCompare(b.component));
const globalsByName = new Map(globalTokens.map(token => [token.name, token]));

export function getComponentTokenDoc(component: string) {
  return componentTokenDocs.find(documentation => documentation.component === component);
}

export function relevantGlobalTokens(documentation: ComponentTokenDoc) {
  const names = [...new Set(documentation.globalTokens)];
  return {
    tokens: names.flatMap(name => {
      const token = globalsByName.get(name);
      return token ? [token] : [];
    }).sort((a, b) => a.name.localeCompare(b.name)),
    unresolved: names.filter(name => !globalsByName.has(name)),
  };
}
export { appearanceProps, customizationNotes } from './customization';
