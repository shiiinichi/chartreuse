import { useId, useState } from 'react';
import { BrandMark, Card } from '../system/components';
import { Navbar, NavbarItem } from '../system/Navbar';
import { SegmentedControl } from '../system/SegmentedControl';
import { Sidebar } from '../system/Sidebar';
import { Stat } from '../system/Stat';
import { StatGroup } from '../system/StatGroup';
import { WorkspaceContent } from '../system/WorkspaceContent';
import type { WorkspaceContentProps } from '../system/WorkspaceContent';
import { WorkspaceLayout } from '../system/WorkspaceLayout';
import { workspaceContentReferences } from './reference/workspace-content';
import { Showcase } from './shared';
import './workspace-content-demo.css';

const widthOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'full', label: 'Full width' },
];
const { importCode, usageCode } = workspaceContentReferences[0];

export function WorkspaceContentDemo({ page = 'workspace-content' }: { page?: 'workspace-content' | 'workspace-layout' }) {
  const [width, setWidth] = useState<NonNullable<WorkspaceContentProps['width']>>('comfortable');
  const id = useId();
  const headingId = `${id}-heading`;

  return (
    <Showcase title="Workspace layout" description="This preview uses a smaller width cap so you can compare both modes beside a sidebar." code={`${importCode}\n\n${usageCode}`}>
      <div className="workspace-content-demo">
        <SegmentedControl label="Content width" name={`workspace-content-width-${id}`} size="sm" options={widthOptions} value={width}
          onValueChange={value => setWidth(value === 'full' ? 'full' : 'comfortable')} />
        <div className="workspace-content-demo-shell">
          <Navbar width="full" variant="dark-green" aria-label="Example workspace pages"
            brand={<a href="#workspace"><BrandMark /><span>Sample workspace</span></a>}>
            <NavbarItem href={`#components/${page}`} aria-current="page">Overview</NavbarItem>
            <NavbarItem href="#task-board">Task board</NavbarItem>
          </Navbar>
          <WorkspaceLayout className="workspace-content-demo-layout">
            <Sidebar width={168} aria-label="Example project sidebar" contentLabel="Project links" header={<strong>Projects</strong>}>
              <nav className="workspace-content-demo-links" aria-label="Example project pages">
                <a href="#record-search">Records</a>
                <a href="#metrics-dashboard">Run metrics</a>
              </nav>
            </Sidebar>
            <WorkspaceContent as="section" width={width} aria-labelledby={headingId} className="workspace-content-demo-body">
              <h4 id={headingId}>Project overview</h4>
              <StatGroup aria-label="Project totals" columns={{ base: 1, sm: 2 }} gap={3}>
                <Card className="workspace-content-demo-stat"><Stat label="Open tasks" value={12} /></Card>
                <Card className="workspace-content-demo-stat"><Stat label="Ready for review" value={4} /></Card>
              </StatGroup>
            </WorkspaceContent>
          </WorkspaceLayout>
        </div>
      </div>
    </Showcase>
  );
}
