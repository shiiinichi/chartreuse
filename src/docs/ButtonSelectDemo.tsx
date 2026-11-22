import { useState } from 'react';
import { Columns3 } from 'lucide-react';
import { Button, ButtonSelect, Checkbox, Flex, Grid } from '../system';
import { ButtonSelectVariants } from './ButtonSelectVariants';
import variantsSource from './ButtonSelectVariants.tsx?raw';
import { buttonSelectReference } from './reference/core';
import { ExampleGallery, Showcase } from './shared';

const variantsCode = variantsSource.replace("from '../system'", "from '@chartreuse/ui'").trim();

const views = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
];

function ViewSelect() {
  return <ButtonSelect variant="secondary" aria-label="View layout"
    options={views} defaultValue="grid" style={{ inlineSize: '10rem' }} />;
}

const columns = ['Owner', 'Status', 'Priority', 'Due date'];

function ColumnPicker() {
  const [visible, setVisible] = useState(['Owner', 'Status']);

  return <ButtonSelect size="lg" variant="accent" icon={Columns3}
    content={({ close }) => (
      <Flex direction="column" align="end" gap={3} style={{ inlineSize: 'min(16rem, calc(100dvw - 3rem))' }}>
        <Grid columns={2} gap={3} role="group" aria-label="Visible columns">
          {columns.map(column => <Checkbox key={column} label={column} checked={visible.includes(column)} onChange={event => {
            const checked = event.currentTarget.checked;
            setVisible(current => checked ? [...current, column] : current.filter(name => name !== column));
          }} />)}
        </Grid>
        <Button size="sm" onClick={close}>Done</Button>
      </Flex>
    )}>
    Columns ({visible.length})
  </ButtonSelect>;
}

const columnPickerCode = `import { useState } from 'react';
import { Columns3 } from 'lucide-react';
import { Button, ButtonSelect, Checkbox, Flex, Grid } from '@chartreuse/ui';

const columns = ['Owner', 'Status', 'Priority', 'Due date'];

export function ColumnPicker() {
  const [visible, setVisible] = useState(['Owner', 'Status']);

  return <ButtonSelect size="lg" variant="accent" icon={Columns3}
    content={({ close }) => (
      <Flex direction="column" align="end" gap={3}
        style={{ inlineSize: 'min(16rem, calc(100dvw - 3rem))' }}>
        <Grid columns={2} gap={3} role="group" aria-label="Visible columns">
          {columns.map(column => (
            <Checkbox key={column} label={column} checked={visible.includes(column)}
              onChange={event => {
                const checked = event.currentTarget.checked;
                setVisible(current => checked
                  ? [...current, column]
                  : current.filter(name => name !== column));
              }} />
          ))}
        </Grid>
        <Button size="sm" onClick={close}>Done</Button>
      </Flex>
    )}>
    Columns ({visible.length})
  </ButtonSelect>;
}`;

export function ButtonSelectDemo() {
  return <ExampleGallery>
    <Showcase title="Choose a view" code={`${buttonSelectReference.importCode}\n\n${buttonSelectReference.usageCode}`}>
      <ViewSelect />
    </Showcase>
    <Showcase title="Pick visible columns" code={columnPickerCode}>
      <ColumnPicker />
    </Showcase>
    <Showcase title="Full-width trigger" description="Set fullWidth to stretch the trigger. The label stays at the start and the chevron moves to the end. Add matchTriggerWidth to size the popover to match." code={"import { ButtonSelect } from '@chartreuse/ui';\n\nconst views = [\n  {\n    \"value\": \"grid\",\n    \"label\": \"Grid\"\n  },\n  {\n    \"value\": \"list\",\n    \"label\": \"List\"\n  },\n  {\n    \"value\": \"board\",\n    \"label\": \"Board\"\n  }\n];\n\n<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--cr-space-3)', inlineSize: 'min(100%, 20rem)' }}>\n  <ButtonSelect variant=\"secondary\" aria-label=\"View layout (default width)\"\n    options={views} defaultValue=\"grid\" />\n  <ButtonSelect variant=\"secondary\" aria-label=\"View layout (full width)\"\n    options={views} defaultValue=\"grid\" fullWidth matchTriggerWidth />\n</div>"}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--cr-space-3)', inlineSize: 'min(100%, 20rem)' }}>
        <ButtonSelect variant="secondary" aria-label="View layout (default width)" options={views} defaultValue="grid" />
        <ButtonSelect variant="secondary" aria-label="View layout (full width)" options={views} defaultValue="grid" fullWidth matchTriggerWidth />
      </div>
    </Showcase>
    <Showcase title="Button variants" description="Choose a style to change that button’s variant." span="full" code={variantsCode}>
      <ButtonSelectVariants />
    </Showcase>
  </ExampleGallery>;
}
