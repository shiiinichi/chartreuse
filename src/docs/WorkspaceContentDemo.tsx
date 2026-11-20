import { useId, useState } from 'react';
import { BrandMark, Card } from '../system/components';
import { Flex } from '../system/Flex';
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
import { Text } from '../system';
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
        <Card className="workspace-content-demo-shell">
          <Navbar size="lg" width="full" variant="dark-green" aria-label="Example workspace pages"
            brand={<a href="#workspace"><BrandMark /><span>Sample workspace</span></a>}>
            <NavbarItem href={`#components/${page}`} aria-current="page">Overview</NavbarItem>
            <NavbarItem href="#task-board">Task board</NavbarItem>
          </Navbar>
          <WorkspaceLayout>
            <Sidebar width={168} className="workspace-content-demo-sidebar" aria-label="Example project sidebar"
              contentLabel="Project links" header={<Text bold>Projects</Text>}>
              <nav className="workspace-content-demo-links" aria-label="Example project pages">
                <Flex direction="column" gap={1}>
                  <NavbarItem href="#record-search">Records</NavbarItem>
                  <NavbarItem href="#metrics-dashboard">Run metrics</NavbarItem>
                </Flex>
              </nav>
            </Sidebar>
            <WorkspaceContent as="section" width={width} aria-labelledby={headingId} className="workspace-content-demo-body">
              <Text size="heading-3" id={headingId}>Project overview</Text>
              <StatGroup aria-label="Project totals" columns={{ base: 1, sm: 2 }} gap={3}>
                <Card className="workspace-content-demo-stat"><Stat label="Open tasks" value={12} /></Card>
                <Card className="workspace-content-demo-stat"><Stat label="Ready for review" value={4} /></Card>
              </StatGroup>
            </WorkspaceContent>
          </WorkspaceLayout>
        </Card>
      </div>
    </Showcase>
  );
}
