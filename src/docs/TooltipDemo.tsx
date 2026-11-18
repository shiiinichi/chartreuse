import { useId, useState } from 'react';
import { Pin } from 'lucide-react';
import { Button, Dialog, IconButton, Select, Switch } from '../system/components';
import { Flex } from '../system/Flex';
import { Grid, GridItem } from '../system/Grid';
import { Tooltip } from '../system/Tooltip';
import { ExampleGallery, Showcase } from './shared';
import './tooltip-demo.css';

const stackCss = `.tooltip-demo-stack { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.tooltip-demo-note { margin: 0; color: var(--cr-color-muted); font-size: 13px; line-height: 1.8; }
.tooltip-demo-link { color: var(--cr-color-success); text-underline-offset: 3px; }`;
const scrollCss = `.tooltip-demo-scroll { box-sizing: border-box; max-height: 168px; overflow: auto; border: 1px solid var(--cr-color-border); border-radius: var(--cr-radius-md); background: var(--cr-color-canvas); }
.tooltip-demo-scroll-content { box-sizing: border-box; display: flex; flex-direction: column; align-items: flex-start; gap: 24px; min-height: 320px; padding: 16px; }
.tooltip-demo-scroll:focus-visible { outline: 2px solid var(--cr-color-focus); outline-offset: 3px; }`;
const disabledCss = `.tooltip-demo-disabled-target { display: inline-flex; max-width: 100%; border-radius: var(--cr-radius-md); }
.tooltip-demo-disabled-target:focus-visible { outline: 2px solid var(--cr-color-focus); outline-offset: 3px; }
.tooltip-demo-disabled-target > :disabled { pointer-events: none; }`;
const source = (components: string, body: string, react = '', extra = '', css = stackCss) => [
  react ? `import { ${react} } from 'react';` : null,
  extra || null,
  `import { ${components} } from '@chartreuse/ui';`,
  '',
  body,
  css ? `\n/* Example layout:\n${css}\n*/` : null,
].filter(line => line !== null).join('\n');

const placements = [
  'top-start', 'top', 'top-end',
  'bottom-start', 'bottom', 'bottom-end',
  'left-start', 'left', 'left-end',
  'right-start', 'right', 'right-end',
] as const;

function BasicTooltip() {
  const id = useId();
  const [saved, setSaved] = useState(false);
  const [pinned, setPinned] = useState(false);
  return <Showcase title="Descriptions on hover or focus" description="Buttons, links, and icon actions retain their accessible names and behavior. Tooltips provide supplemental descriptions." code={source('Button, Flex, IconButton, Tooltip', `export function BasicTooltip() {
  const id = useId();
  const [saved, setSaved] = useState(${saved});
  const [pinned, setPinned] = useState(${pinned});
  return <div className="tooltip-demo-stack">
    <p id={id + '-hint'} className="tooltip-demo-note">State changes are local to this example.</p>
    <Flex wrap align="center" gap={3}>
      <Tooltip content="Save the current draft without leaving this page.">
        <Button aria-describedby={id + '-hint'} onClick={() => setSaved(true)}>Save draft</Button>
      </Tooltip>
      <Tooltip content="Read the available button variants and native behavior.">
        <a className="tooltip-demo-link" href="#components/button">Button reference</a>
      </Tooltip>
      <Tooltip content="Toggle the pinned state of this sample note.">
        <IconButton icon={Pin} label="Pin sample note" variant="secondary"
          aria-pressed={pinned} onClick={() => setPinned(value => !value)} />
      </Tooltip>
    </Flex>
    <p className="tooltip-demo-note" role="status">
      {saved ? 'The sample draft is saved.' : 'No sample changes saved.'}
      {' '}{pinned ? 'The sample note is pinned.' : 'The sample note is not pinned.'}
    </p>
  </div>;
}`, 'useId, useState', "import { Pin } from 'lucide-react';")}>
    <div className="tooltip-demo-stack"><p id={`${id}-hint`} className="tooltip-demo-note">State changes are local to this example.</p><Flex wrap align="center" gap={3}>
      <Tooltip content="Save the current draft without leaving this page."><Button aria-describedby={`${id}-hint`} onClick={() => setSaved(true)}>Save draft</Button></Tooltip>
      <Tooltip content="Read the available button variants and native behavior."><a className="tooltip-demo-link" href="#components/button">Button reference</a></Tooltip>
      <Tooltip content="Toggle the pinned state of this sample note."><IconButton icon={Pin} label="Pin sample note" variant="secondary" aria-pressed={pinned} onClick={() => setPinned(value => !value)} /></Tooltip>
    </Flex><p className="tooltip-demo-note" role="status">{saved ? 'The sample draft is saved.' : 'No sample changes saved.'}{' '}{pinned ? 'The sample note is pinned.' : 'The sample note is not pinned.'}</p></div>
  </Showcase>;
}

function PlacementTooltips() {
  return <Showcase title="Choose a side and alignment" description="Twelve requested placements share the same content. Focus or hover a control; available viewport space can change the final side." code={source('Button, Flex, Tooltip', `const placements = ${JSON.stringify(placements, null, 2)} as const;

<Flex wrap align="center" gap={3}>
  {placements.map(placement => <Tooltip key={placement} placement={placement}
    content={'The ' + placement + ' position follows this control.'}>
    <Button variant="secondary" size="sm">{placement}</Button>
  </Tooltip>)}
</Flex>`, '', '', '')}>
    <Flex wrap align="center" gap={3}>{placements.map(placement => <Tooltip key={placement} placement={placement} content={`The ${placement} position follows this control.`}><Button variant="secondary" size="sm">{placement}</Button></Tooltip>)}</Flex>
  </Showcase>;
}

function TooltipInDialog() {
  const [open, setOpen] = useState(false);
  return <Showcase title="Tooltips in dialogs and scrolling panels" description="The tooltip renders outside the scrolling panel to avoid clipping. Escape dismisses the tooltip before the dialog." code={source('Button, Dialog, Tooltip', `export function TooltipInDialog() {
  const [open, setOpen] = useState(${open});
  return <div className="tooltip-demo-stack">
    <Button variant="secondary" onClick={() => setOpen(true)}>Open tooltip dialog</Button>
    <p className="tooltip-demo-note">Open the dialog, then focus or hover Inspect a note.</p>
    <Dialog open={open} onOpenChange={setOpen} title="Tooltip in a scrolling panel"
      description="Focus or hover the note control to display its tooltip."
      footer={<Button onClick={() => setOpen(false)}>Done inspecting</Button>}>
      <div className="tooltip-demo-stack">
        <p className="tooltip-demo-note">Press Escape once to dismiss an open tooltip. The dialog remains open.</p>
        <div className="tooltip-demo-scroll" role="region" aria-label="Scrollable tooltip example" tabIndex={0}>
          <div className="tooltip-demo-scroll-content">
            <Tooltip placement="top" openDelay={0} closeDelay={300}
              content="This description is outside the clipped panel and follows the note control.">
              <Button variant="secondary" autoFocus>Inspect a note</Button>
            </Tooltip>
            <p className="tooltip-demo-note">Scroll the panel while the trigger remains visible. The tooltip follows the trigger.</p>
            <p className="tooltip-demo-note">This content extends the panel to demonstrate scrolling.</p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>;
}`, 'useState', '', `${stackCss}\n${scrollCss}`)}>
    <div className="tooltip-demo-stack"><Button variant="secondary" onClick={() => setOpen(true)}>Open tooltip dialog</Button><p className="tooltip-demo-note">Open the dialog, then focus or hover Inspect a note.</p>
      <Dialog open={open} onOpenChange={setOpen} title="Tooltip in a scrolling panel" description="Focus or hover the note control to display its tooltip." footer={<Button onClick={() => setOpen(false)}>Done inspecting</Button>}>
        <div className="tooltip-demo-stack"><p className="tooltip-demo-note">Press Escape once to dismiss an open tooltip. The dialog remains open.</p><div className="tooltip-demo-scroll" role="region" aria-label="Scrollable tooltip example" tabIndex={0}><div className="tooltip-demo-scroll-content">
          <Tooltip placement="top" openDelay={0} closeDelay={300} content="This description is outside the clipped panel and follows the note control."><Button variant="secondary" autoFocus>Inspect a note</Button></Tooltip>
          <p className="tooltip-demo-note">Scroll the panel while the trigger remains visible. The tooltip follows the trigger.</p><p className="tooltip-demo-note">This content extends the panel to demonstrate scrolling.</p>
        </div></div></div>
      </Dialog>
    </div>
  </Showcase>;
}

function TooltipOptions() {
  const [arrow, setArrow] = useState(true);
  const [openDelay, setOpenDelay] = useState(300);
  const [closeDelay, setCloseDelay] = useState(100);
  const [disabled, setDisabled] = useState(false);
  return <Showcase title="Configure arrow, delays, and disabled state" description="Configure the arrow and pointer delays in milliseconds. Keyboard focus opens immediately. A disabled tooltip leaves its trigger available." code={source('Button, Grid, GridItem, Select, Switch, Tooltip', `export function TooltipOptions() {
  const [arrow, setArrow] = useState(${arrow});
  const [openDelay, setOpenDelay] = useState(${openDelay});
  const [closeDelay, setCloseDelay] = useState(${closeDelay});
  const [disabled, setDisabled] = useState(${disabled});
  return <div className="tooltip-demo-stack">
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Select label="Open delay" value={openDelay}
        onChange={event => setOpenDelay(Number(event.currentTarget.value))}>
        <option value={0}>Immediate</option><option value={300}>300ms</option><option value={800}>800ms</option>
      </Select></GridItem>
      <GridItem span={1}><Select label="Close delay" value={closeDelay}
        onChange={event => setCloseDelay(Number(event.currentTarget.value))}>
        <option value={100}>100ms</option><option value={400}>400ms</option><option value={800}>800ms</option>
      </Select></GridItem>
      <GridItem span={1}><Switch label="Show tooltip arrow" checked={arrow}
        onChange={event => setArrow(event.currentTarget.checked)} /></GridItem>
      <GridItem span={1}><Switch label="Disable tooltip" checked={disabled}
        onChange={event => setDisabled(event.currentTarget.checked)} /></GridItem>
    </Grid>
    <Tooltip content="This tooltip uses the selected arrow and delay settings."
      placement="bottom" arrow={arrow} openDelay={openDelay} closeDelay={closeDelay} disabled={disabled}>
      <Button variant="secondary">Preview tooltip settings</Button>
    </Tooltip>
  </div>;
}`, 'useState')}>
    <div className="tooltip-demo-stack"><Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <GridItem span={1}><Select label="Open delay" value={openDelay} onChange={event => setOpenDelay(Number(event.currentTarget.value))}><option value={0}>Immediate</option><option value={300}>300ms</option><option value={800}>800ms</option></Select></GridItem>
      <GridItem span={1}><Select label="Close delay" value={closeDelay} onChange={event => setCloseDelay(Number(event.currentTarget.value))}><option value={100}>100ms</option><option value={400}>400ms</option><option value={800}>800ms</option></Select></GridItem>
      <GridItem span={1}><Switch label="Show tooltip arrow" checked={arrow} onChange={event => setArrow(event.currentTarget.checked)} /></GridItem><GridItem span={1}><Switch label="Disable tooltip" checked={disabled} onChange={event => setDisabled(event.currentTarget.checked)} /></GridItem>
    </Grid><Tooltip content="This tooltip uses the selected arrow and delay settings." placement="bottom" arrow={arrow} openDelay={openDelay} closeDelay={closeDelay} disabled={disabled}><Button variant="secondary">Preview tooltip settings</Button></Tooltip></div>
  </Showcase>;
}

function ControlledTooltip() {
  const [open, setOpen] = useState(false);
  return <Showcase title="Control tooltip visibility" description="The parent owns open. The switch updates it directly; trigger interactions and Escape request changes through onOpenChange." code={source('Button, Grid, GridItem, Switch, Tooltip', `export function ControlledTooltip() {
  const [open, setOpen] = useState(${open});
  return <div className="tooltip-demo-stack">
    <Grid columns={1} gap={4}><GridItem span={1}>
      <Switch label="Controlled tooltip open" checked={open}
        onChange={event => setOpen(event.currentTarget.checked)} />
    </GridItem></Grid>
    <Tooltip content="Visibility is controlled by the example’s open state."
      open={open} onOpenChange={setOpen}>
      <Button variant="secondary">Controlled tooltip trigger</Button>
    </Tooltip>
    <p className="tooltip-demo-note">Current state: {open ? 'open' : 'closed'}.</p>
  </div>;
}`, 'useState')}>
    <div className="tooltip-demo-stack"><Grid columns={1} gap={4}><GridItem span={1}><Switch label="Controlled tooltip open" checked={open} onChange={event => setOpen(event.currentTarget.checked)} /></GridItem></Grid><Tooltip content="Visibility is controlled by the example’s open state." open={open} onOpenChange={setOpen}><Button variant="secondary">Controlled tooltip trigger</Button></Tooltip><p className="tooltip-demo-note">Current state: {open ? 'open' : 'closed'}.</p></div>
  </Showcase>;
}

function DisabledActionTooltip() {
  return <Showcase title="Describe a disabled action" description="A focusable wrapper exposes the tooltip for a native disabled button. The reason also appears as visible text." code={source('Button, Tooltip', `<div className="tooltip-demo-stack">
  <Tooltip content="An approved review is needed before this sample can be published.">
    <span className="tooltip-demo-disabled-target" role="group" tabIndex={0}
      aria-label="Publishing unavailable">
      <Button disabled>Publish update</Button>
    </span>
  </Tooltip>
  <p className="tooltip-demo-note">Publishing is unavailable until this local review is approved.</p>
</div>`, '', '', `${stackCss}\n${disabledCss}`)}>
    <div className="tooltip-demo-stack"><Tooltip content="An approved review is needed before this sample can be published."><span className="tooltip-demo-disabled-target" role="group" tabIndex={0} aria-label="Publishing unavailable"><Button disabled>Publish update</Button></span></Tooltip><p className="tooltip-demo-note">Publishing is unavailable until this local review is approved.</p></div>
  </Showcase>;
}

export function TooltipDemo() {
  return <div className="tooltip-demo"><p className="tooltip-demo-note">Hover or focus a trigger, move onto the tooltip to keep reading, or press Escape to dismiss it.</p><ExampleGallery>
    <BasicTooltip /><PlacementTooltips /><TooltipInDialog /><TooltipOptions /><ControlledTooltip /><DisabledActionTooltip />
  </ExampleGallery></div>;
}
