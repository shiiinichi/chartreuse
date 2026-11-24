import { useState } from 'react';
import { Button, Flex, SplitButton, Text } from '../../system';

const groups = [{ value: 'DEV-001', label: 'DEV-001' }, { value: 'DEV-002', label: 'DEV-002' }];
const boards = [{ value: 'GA-003', label: 'GA-003' }, { value: 'GA-004', label: 'GA-004' }];
const slash = <Text size="body" aria-hidden="true" style={{ color: 'var(--cr-color-muted)' }}>/</Text>;

export function BreadcrumbExample() {
  const [group, setGroup] = useState('DEV-001');
  const [board, setBoard] = useState('GA-003');
  const [opened, setOpened] = useState('');
  return <Flex direction="column" gap={3}>
    <nav aria-label="Breadcrumb">
      <Flex wrap gap={1} align="center">
        <Button variant="ghost" size="sm" onClick={() => setOpened('Orchestrator')}>Orchestrator</Button>
        {slash}
        <SplitButton variant="ghost" size="sm" divider={false} onClick={() => setOpened(group)}
          menuLabel={`Switch task group: ${group}`} options={groups} value={group} onValueChange={setGroup} checkmark>{group}</SplitButton>
        {slash}
        <SplitButton variant="ghost" size="sm" divider={false} onClick={() => setOpened(board)}
          menuLabel={`Switch board: ${board}`} options={boards} value={board} onValueChange={setBoard} checkmark>{board}</SplitButton>
      </Flex>
    </nav>
    <Text size="body" style={{ color: 'var(--cr-color-muted)' }}>{opened ? `Opened ${opened}.` : 'Select an ID to open it, or its chevron to switch.'}</Text>
  </Flex>;
}
