import type { ReactNode } from 'react';
import * as Chartreuse from '../system';
import './pattern-preview.css';

const workspacePages = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'task-board', label: 'Task board' },
  { id: 'agent-monitor', label: 'Agent monitor' },
  { id: 'metrics-dashboard', label: 'Metrics' },
  { id: 'settings-editor', label: 'Settings' },
] as const;

const recordPages = [
  { id: 'record-search', label: 'Record search' },
  { id: 'record-detail', label: 'Record details' },
] as const;

type PatternPage = (typeof workspacePages | typeof recordPages)[number]['id'];

export function PatternPreview({ page, children }: { page: PatternPage; children: ReactNode }) {
  const records = page === 'record-search' || page === 'record-detail';
  const pages = records ? recordPages : workspacePages;

  return (
    <div className="pattern-preview" data-page={page}>
      <Chartreuse.Navbar width="full" variant="dark-green" aria-label={records ? 'Record pages' : 'Workspace pages'}>
        <Chartreuse.Flex align="center" wrap gap={1}>
          {pages.map(({ id, label }) => (
            <Chartreuse.NavbarItem key={id} href={`#${id}`} aria-current={page === id ? 'page' : undefined}>
              {label}
            </Chartreuse.NavbarItem>
          ))}
        </Chartreuse.Flex>
      </Chartreuse.Navbar>
      <Chartreuse.WorkspaceLayout>
        {children}
      </Chartreuse.WorkspaceLayout>
    </div>
  );
}
