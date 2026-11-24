import { Play } from 'lucide-react';
import { Flex, SplitButton } from '../../system';

const variants = ['primary', 'secondary', 'accent', 'ghost', 'danger'] as const;
const runs = [{ value: 'tests', label: 'Run tests' }, { value: 'lint', label: 'Run lint' }];

export function SplitButtonVariants() {
  return <Flex direction="column" gap={3}>
    {variants.map(variant => <Flex key={variant} wrap gap={3} align="center">
      <SplitButton variant={variant} icon={Play} menuLabel={`More ${variant} run options`} options={runs}>Run</SplitButton>
      <SplitButton variant={variant} icon={Play} menuLabel={`More ${variant} run options, action disabled`} options={runs} disabled>Run</SplitButton>
      <SplitButton variant={variant} icon={Play} menuLabel={`More ${variant} run options, menu disabled`} options={runs} menuDisabled>Run</SplitButton>
    </Flex>)}
  </Flex>;
}
