import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  Badge, BrandMark, Button, Card, EmptyState, Flex, Navbar, NavbarItem,
  Sidebar, TextField, WorkspaceContent, WorkspaceLayout,
} from '../../system';

const runTones = { Succeeded: 'success', Running: 'info', Waiting: 'warning', Failed: 'danger' } as const;
type RunStatus = keyof typeof runTones;

const runTitles = [
  'Load task metadata and attached review reports.',
  'Check task dependencies and checklist status.',
  'Inspect the active agent and tool events.',
  'Verify build results before closing the task.',
  'Attach the conversation transcript to the task.',
  'Record review findings in the task report.',
  'Check sidebar overflow at narrow widths.',
  'Summarize command results from this run.',
  'Define acceptance criteria for the next change.',
];
const runStatuses: RunStatus[] = ['Succeeded', 'Running', 'Succeeded', 'Waiting', 'Succeeded', 'Succeeded', 'Failed'];
const initialRuns = runTitles.map((title, index) => ({
  id: `run-${1009 - index}`,
  title,
  provider: index % 3 === 2 ? 'Hosted agent' : 'Codex',
  status: runStatuses[index] ?? 'Succeeded',
  time: index === 0 ? 'A moment ago' : `${index * 12} min ago`,
  tokens: (index + 1) * 1240,
}));

export function RunHistoryExample() {
  const [runs, setRuns] = useState(initialRuns);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialRuns[0].id);
  const search = query.toLowerCase();
  const filtered = runs.filter(run => `${run.title} ${run.id} ${run.provider} ${run.status}`.toLowerCase().includes(search));
  const selected = filtered.find(run => run.id === selectedId) ?? filtered[0];

  function loadMore() {
    setRuns(previous => [...previous, ...initialRuns.slice(0, 3).map((run, index) => ({
      ...run,
      id: `run-${1000 - previous.length - index}`,
      time: 'Earlier in this example',
    }))]);
  }

  return (
    <Card className="sidebar-example">
      <Navbar size="lg" width="full" variant="dark-green" aria-label="Run history example pages"
        brand={<a href="#workspace"><BrandMark />Sample workspace</a>}>
        <NavbarItem href="#task-board">Task board</NavbarItem>
        <NavbarItem href="#agent-monitor">Agent monitor</NavbarItem>
      </Navbar>
      <WorkspaceLayout className="sidebar-example-floating-layout">
        <Sidebar variant="floating" className="sidebar-example-sidebar" aria-label="Run history" contentLabel="Recorded runs"
          header={
            <Flex direction="column" gap={3}>
              <Flex align="center" justify="space-between" wrap gap={2}>
                <h3>Run history</h3>
                <Badge>{filtered.length}</Badge>
              </Flex>
              <TextField label="Search loaded runs" type="search" icon={Search} name="runSearch" value={query}
                onChange={event => setQuery(event.currentTarget.value)} autoComplete="off" spellCheck={false} />
            </Flex>
          }
          footer={
            <Flex align="center" justify="space-between" wrap gap={2}>
              <small>{runs.length} recorded runs</small>
              <Button size="sm" variant="ghost" icon={Plus} onClick={loadMore}>Load more</Button>
            </Flex>
          }>
          {filtered.length > 0 ? (
            <Flex direction="column" gap={2} className="sidebar-example-list" role="group" aria-label="Select a run">
              {filtered.map(run => {
                const active = selected?.id === run.id;
                return (
                  <Button key={run.id} variant="ghost"
                    aria-pressed={active} onClick={() => setSelectedId(run.id)}>
                    <span className="sidebar-example-choice">
                      <span className="sidebar-example-choice-meta">
                        <strong>Coordinator</strong>
                        <Badge variant="ghost" tone={runTones[run.status]} dot>{run.status}</Badge>
                      </span>
                      <span>{run.title}</span>
                      <span className="sidebar-example-choice-meta">
                        <small>{run.provider}</small>
                        <small>{run.time}</small>
                      </span>
                    </span>
                  </Button>
                );
              })}
            </Flex>
          ) : (
            <EmptyState icon={Search} title="No matching runs" description="Search by task title, run ID, provider, or status."
              action={<Button variant="ghost" size="sm" onClick={() => setQuery('')}>Clear search</Button>} />
          )}
        </Sidebar>
        <WorkspaceContent as="section" width="full" className="sidebar-example-inspector" aria-label="Selected run">
          {selected ? (
            <Flex direction="column" gap={4}>
              <Flex align="center" wrap gap={2}>
                <h3>Coordinator</h3>
                <Badge variant="ghost" tone={runTones[selected.status]} dot>{selected.status}</Badge>
              </Flex>
              <p>{selected.title}</p>
              <dl className="sidebar-example-facts">
                <div><dt>Run</dt><dd><code>{selected.id}</code></dd></div>
                <div><dt>Provider</dt><dd>{selected.provider}</dd></div>
                <div><dt>Recorded</dt><dd>{selected.time}</dd></div>
                <div><dt>Tokens</dt><dd>{selected.tokens.toLocaleString()}</dd></div>
              </dl>
            </Flex>
          ) : <p>Change or clear the search to select a run.</p>}
        </WorkspaceContent>
      </WorkspaceLayout>
    </Card>
  );
}
