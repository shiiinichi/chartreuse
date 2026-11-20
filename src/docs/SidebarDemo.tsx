import { Flex, Text } from '../system';
import { RunHistoryExample } from './sidebar-examples/RunHistoryExample';
import { TaskNavigationExample } from './sidebar-examples/TaskNavigationExample';
import runHistorySource from './sidebar-examples/RunHistoryExample.tsx?raw';
import taskNavigationSource from './sidebar-examples/TaskNavigationExample.tsx?raw';
import { ExampleGallery, Showcase } from './shared';
import layoutStyles from './sidebar-demo.css?raw';
import './sidebar-demo.css';

function exampleCode(source: string) {
  const usage = source.replace("from '../../system';", "from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';");
  return `${usage.trim()}\n\n/* Add these layout rules to your stylesheet.\n${layoutStyles.trim()}\n*/`;
}

export function SidebarDemo() {
  return (
    <Flex direction="column" gap={8}>
      <Text size="body" className="body-copy">
        The examples place a <a href="#components/navbar">Navbar</a> above a{' '}
        <a href="#components/workspace-layout">WorkspaceLayout</a> that holds the sidebar and{' '}
        <a href="#components/workspace-content">WorkspaceContent</a>. The sidebar header and footer remain visible while the body scrolls.
      </Text>
      <ExampleGallery maxColumns={1}>
        <Showcase title="Floating run history" description="Filter local run records and select a run to inspect its metadata."
          code={exampleCode(runHistorySource)}>
          <RunHistoryExample />
        </Showcase>
        <Showcase title="Flush task navigation" description="Filter tasks by project and title, create a task in local state, and toggle its checklist items."
          code={exampleCode(taskNavigationSource)}>
          <TaskNavigationExample />
        </Showcase>
      </ExampleGallery>
    </Flex>
  );
}
