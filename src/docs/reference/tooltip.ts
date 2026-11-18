import type { ComponentReference } from './types';

export const tooltipReferences: ComponentReference[] = [{
  name: 'Tooltip', slug: 'tooltip',
  summary: 'A short supplementary description available on hover or keyboard focus, with viewport-aware placement.',
  importCode: "import { Tooltip, Button } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';",
  usageCode: `<Tooltip content="Save the draft without leaving this page.">
  <Button>Save draft</Button>
</Tooltip>

<Tooltip content="The requested side adjusts when space is limited."
  placement="bottom-start" arrow={false} openDelay={0}>
  <Button variant="secondary">Inspect note</Button>
</Tooltip>`,
  nativeElement: 'span trigger wrapper and floating div[role="tooltip"]',
  nativeProps: 'Native bubble attributes, id, className, style, and events target the tooltip div. Role, hidden state, popover behavior, and positioning are managed by Tooltip; no public native ref is exposed. The trigger remains the supplied child and keeps its native semantics.',
  props: [
    { name: 'children', type: 'ReactElement', required: true, description: 'One trigger element that forwards native aria-describedby and title properties. Keep a visible label or accessible name on an icon-only action.' },
    { name: 'content', type: 'ReactNode', required: true, description: 'Short noninteractive supplementary content. Use inline help for information people need to complete an action.' },
    { name: 'placement', type: 'TooltipPlacement', defaultValue: "'top'", description: 'Requested side and alignment: top, bottom, left, or right, optionally followed by -start or -end. Available viewport space can flip or shift the final position.' },
    { name: 'openDelay', type: 'number', defaultValue: '300', description: 'Pointer-hover opening delay in milliseconds. Keyboard focus opens immediately.' },
    { name: 'closeDelay', type: 'number', defaultValue: '100', description: 'Delay in milliseconds after interest leaves the trigger and bubble. Moving onto the tooltip keeps it available.' },
    { name: 'arrow', type: 'boolean', defaultValue: 'true', description: 'Shows the decorative directional arrow.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables tooltip behavior without changing the native availability of its trigger.' },
    { name: 'open', type: 'boolean', description: 'Controlled visibility. Respond to onOpenChange requests in the owner.' },
    { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Initial visibility when open is not controlled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Receives visibility requests from hover, focus, leaving, or Escape.' },
    { name: 'id', type: 'string', description: 'Stable identifier for the description element. Generated when omitted.' },
    { name: 'className', type: 'string', description: 'Additional classes on the floating tooltip div.' },
    { name: 'style', type: 'CSSProperties', description: 'Native bubble styles. Tooltip manages its measured position.' },
  ],
  notes: [
    'Use a tooltip for a short clarification that supplements an already named action. Required instructions, error messages, and information needed while typing belong inline.',
    'Hover and keyboard focus both open the tooltip. Focus opens immediately; openDelay applies to pointer hover. Escape dismisses it without moving focus or activating the trigger; moving onto the bubble lets people continue reading.',
    'The trigger keeps its original DOM and behavior. Existing aria-describedby relationships are retained alongside the tooltip description. A custom trigger component must forward the supplied aria-describedby and title properties to its native element.',
    'Tooltip content is noninteractive. Use a dialog or another explicit disclosure for links, buttons, form controls, or a longer interaction.',
    'Native disabled buttons cannot receive keyboard focus. To explain one, give an intentional wrapper a keyboard focus target and accessible name, and keep the reason visible nearby.',
    'Placement supports top, bottom, left, and right, each with optional -start and -end alignment. The bubble adjusts to the viewport and follows scrolling or size changes.',
    'Tooltip portals to document.body or the containing native dialog. It uses the top layer when the Popover API is available; otherwise it uses fixed portal positioning.',
    'Use open with onOpenChange for controlled state, or defaultOpen for an uncontrolled initial state. Pointer delay values are milliseconds.',
  ],
}];
