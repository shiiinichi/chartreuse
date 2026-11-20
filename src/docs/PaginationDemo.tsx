import { useState } from 'react';
import { Flex, Pagination, Text } from '../system';
import { ExampleGallery, Showcase } from './shared';

const initialPage = 6;
const totalRuns = 176;
const pageSize = 10;
const pageCount = Math.ceil(totalRuns / pageSize);

const code = `import { useState } from 'react';
import { Flex, Pagination, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

export function RunHistoryPages() {
  const [page, setPage] = useState(${initialPage});
  const totalRuns = ${totalRuns};
  const pageSize = ${pageSize};
  const pageCount = Math.ceil(totalRuns / pageSize);
  const firstRun = (page - 1) * pageSize + 1;
  const lastRun = Math.min(page * pageSize, totalRuns);

  return (
    <Flex direction="column" gap={3}>
      <Text size="small">Runs {firstRun}–{lastRun} of {totalRuns}</Text>
      <Pagination aria-label="Run history pages" page={page} pageCount={pageCount}
        onPageChange={setPage} />
    </Flex>
  );
}`;

export function PaginationDemo() {
  const [page, setPage] = useState(initialPage);
  const firstRun = (page - 1) * pageSize + 1;
  const lastRun = Math.min(page * pageSize, totalRuns);

  return (
    <ExampleGallery maxColumns={1}>
      <Showcase title="Workspace run history" description="Jump to a numbered page or move one page at a time." code={code}>
        <Flex direction="column" gap={3}>
          <Text size="small">Runs {firstRun}–{lastRun} of {totalRuns}</Text>
          <Pagination aria-label="Run history pages" page={page} pageCount={pageCount}
            onPageChange={setPage} />
        </Flex>
      </Showcase>
    </ExampleGallery>
  );
}
