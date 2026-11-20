import { Flex, Grid, GridItem, Masonry, Text } from '../system';
import { ExampleGallery, Showcase } from './shared';

export function TextDemo() {
  return <ExampleGallery>
    <Showcase title="Heading and inline formatting" description="Text inherits the surrounding typography until it sets a size of its own." code={`import { Flex, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

<Flex direction="column" gap={3}>
  <Text size="heading-3">Release review <Text size="small" display="inline">Draft</Text></Text>
  <Text size="body">
    The checklist is <Text bold>ready</Text> for <Text italic>final review</Text>.
    {' '}The due date moved from <Text strikethrough>Thursday</Text> to Friday.
  </Text>
  <Text display="block" size="small">Updated today</Text>
</Flex>`}>
      <Flex direction="column" gap={3}>
        <Text size="heading-3">Release review <Text size="small" display="inline">Draft</Text></Text>
        <Text size="body">
          The checklist is <Text bold>ready</Text> for <Text italic>final review</Text>.
          {' '}The due date moved from <Text strikethrough>Thursday</Text> to Friday.
        </Text>
        <Text display="block" size="small">Updated today</Text>
      </Flex>
    </Showcase>
    <Showcase title="Text on grid tracks" description="GridItem sets the span. Block text stacks within each item." code={`import { Grid, GridItem, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

<Grid columns={2} gap={4}>
  <GridItem span={1}>
    <Text display="block" size="label">Owner</Text>
    <Text size="body">Sam Lee</Text>
  </GridItem>
  <GridItem span={1}>
    <Text display="block" size="label">Status</Text>
    <Text size="body">Awaiting final review</Text>
  </GridItem>
</Grid>`}>
      <Grid columns={2} gap={4}>
        <GridItem span={1}>
          <Text display="block" size="label">Owner</Text>
          <Text size="body">Sam Lee</Text>
        </GridItem>
        <GridItem span={1}>
          <Text display="block" size="label">Status</Text>
          <Text size="body">Awaiting final review</Text>
        </GridItem>
      </Grid>
    </Showcase>
    <Showcase title="Text in masonry columns" description="Each paragraph wraps to its column and takes the height it needs." code={`import { Masonry, Text } from '@chartreuse/ui';
import '@chartreuse/ui/styles.css';

<Masonry columns={2} gap={4}>
  <Text size="body">Send the release draft to the team.</Text>
  <Text size="body">Once everyone has reviewed the changes, record their approval in the release checklist.</Text>
  <Text size="body">Archive the review notes.</Text>
</Masonry>`}>
      <Masonry columns={2} gap={4}>
        <Text size="body">Send the release draft to the team.</Text>
        <Text size="body">Once everyone has reviewed the changes, record their approval in the release checklist.</Text>
        <Text size="body">Archive the review notes.</Text>
      </Masonry>
    </Showcase>
  </ExampleGallery>;
}
