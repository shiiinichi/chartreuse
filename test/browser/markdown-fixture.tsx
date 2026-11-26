import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MarkdownRenderer } from '../../src/system';
import '../../src/system/styles.css';

const columns = ['Task', 'Owner', 'Status', 'Branch', 'Started', 'Checks left', 'Notes'];
const table = [
  `| ${columns.join(' | ')} |`,
  `| ${columns.map(() => '---').join(' | ')} |`,
  ...['Audit tokens', 'Review docs', 'Ship release'].map(task => `| ${task} | Release team | In progress | feature/a-long-branch-name | 2026-11-26 | 3 | Waiting on the design review |`),
].join('\n');
const code = '```ts\nexport const command = "npm test -- --run order-summary --reporter verbose --coverage --watch=false";\n```';
const filler = Array.from({ length: 12 }, (_, index) => `Paragraph ${index + 1} of the reply, long enough to give the panel something to scroll.`).join('\n\n');

// A narrow scrolling panel, like a chat panel, whose table and code block are wider than it is.
createRoot(document.getElementById('root')!).render(<StrictMode>
  <main data-testid="panel" style={{ inlineSize: 375, blockSize: 500, overflowY: 'auto', padding: 16, boxSizing: 'border-box' }}>
    <MarkdownRenderer>{`${filler}\n\n${table}\n\n${code}\n\n${filler}`}</MarkdownRenderer>
  </main>
</StrictMode>);
