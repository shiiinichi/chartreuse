import { Send } from 'lucide-react';
import { Button, Flex, SplitButton } from '../../system';

const sizes = ['sm', 'md', 'lg'] as const;
const schedules = [{ value: 'later', label: 'Send later' }, { value: 'draft', label: 'Save as draft' }];

export function SplitButtonSizes() {
  return <Flex direction="column" gap={3}>
    {sizes.map(size => <Flex key={size} wrap gap={2} align="center">
      <Button variant="secondary" size={size}>Cancel</Button>
      <SplitButton size={size} icon={Send} menuLabel={`Other ${size} send options`} options={schedules}>Send</SplitButton>
    </Flex>)}
  </Flex>;
}
