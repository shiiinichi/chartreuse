import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Flex, Spinner, Text } from '../../src/system';
import '../../src/system/styles.css';

const long = 'Running /bin/zsh -lc "npm test -- --run order-summary --reporter verbose --coverage --watch=false"';

createRoot(document.getElementById('root')!).render(<StrictMode>
  <main style={{ display: 'grid', gap: 24, padding: 24, inlineSize: 280 }}>
    <h1>Spinner fixture</h1>
    <Flex align="center" gap={2} data-testid="truncate">
      <Spinner size={16} label="Agent is working on a reply" />
      <Text size="small" style={{ flex: '1 1 auto', minInlineSize: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{long}</Text>
    </Flex>
    <Flex align="center" gap={2} data-testid="first-line" style={{ font: '400 13px/20px sans-serif' }}>
      <Spinner size={16} align="first-line" label="Working" />
      <Text size="body" style={{ margin: 0, font: 'inherit' }}>{long} and recording the results on the task card</Text>
    </Flex>
  </main>
</StrictMode>);
