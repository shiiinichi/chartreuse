import type { ComponentTokenDoc, RuntimeVariableDefinition } from './types';

const tiers = ['base', 'sm', 'md', 'lg', 'xl'] as const;
const recipes = [
  ['direction', 'Flex.direction', 'Main-axis direction'],
  ['wrap', 'Flex.wrap', 'Wrapping mode'],
  ['align', 'Flex.align', 'Cross-axis alignment'],
  ['justify', 'Flex.justify', 'Main-axis distribution'],
  ['row-gap', 'Flex.gap/rowGap', 'Resolved row spacing token'],
  ['column-gap', 'Flex.gap/columnGap', 'Resolved column spacing token'],
] as const;

const runtimeVariables: RuntimeVariableDefinition[] = recipes.flatMap(([name, property, description]) => tiers.map(tier => ({
  name: `--cr-flex-${name}-${tier}`,
  description: `${description} at the ${tier} container tier.`,
  source: { file: 'src/system/Flex.tsx', detail: `${property} is normalized and serialized by the variables helper. flex.css selects the recipe for the current container width.` },
  notes: ['Layout value controlled by props. Configure it through the documented Flex property.'],
})));

export const flexTokenDocs: ComponentTokenDoc[] = [{
  component: 'Flex', componentTokens: [],
  globalTokens: [1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map(step => `--cr-space-${step}`),
  runtimeVariables,
  notes: [
    'Flex has no independent styling hooks, surface, typography, or color tokens. Its gap props select the shared spacing tokens with pixel fallbacks; gap 0 resolves to 0px.',
    'The responsive CSS variables are controlled by layout props. Each instance resets all five tiers, allowing nested flex containers to choose their own direction, alignment, wrapping, and spacing.',
    'Container thresholds are literal 480/768/1024/1280px values shared with the Grid convention. Children consume their own component tokens.',
  ],
}];
