import type { ComponentTokenDoc, RuntimeVariableDefinition } from './types';

const positioning: RuntimeVariableDefinition[] = [
  { name: '--cr-tooltip-left', description: 'Measured horizontal viewport coordinate of the tooltip bubble.' },
  { name: '--cr-tooltip-top', description: 'Measured vertical viewport coordinate of the tooltip bubble.' },
  { name: '--cr-tooltip-arrow-x', description: 'Horizontal anchor position for the decorative arrow within the bubble.' },
  { name: '--cr-tooltip-arrow-y', description: 'Vertical anchor position for the decorative arrow within the bubble.' },
  { name: '--cr-tooltip-available-width', description: 'Available visual viewport width after the tooltip edge inset, measured before content sizing.' },
  { name: '--cr-tooltip-available-height', description: 'Available visual viewport height after the tooltip edge inset, measured before content sizing.' },
].map(variable => ({
  ...variable,
  source: { file: 'src/system/Tooltip.tsx', detail: 'The placement pass measures the visual viewport and floatingStyle serializes position; tooltip.css consumes these dimensions and coordinates.' },
  notes: ['Measurement-owned placement. Configure the public placement property rather than treating these coordinates as styling hooks.'],
}));

export const tooltipTokenDocs: ComponentTokenDoc[] = [{
  component: 'Tooltip', componentTokens: [],
  globalTokens: [
    '--cr-color-surface', '--cr-color-text', '--cr-font-sans', '--cr-radius-md',
    '--cr-shadow-md', '--cr-space-2', '--cr-space-3',
  ],
  runtimeVariables: positioning,
  notes: [
    'Tooltip has no independent styling hooks. tooltip.css uses the shared text color as its inverse surface and the shared surface color for its text; the arrow inherits that background.',
    'Shared space-2 and space-3 provide vertical and horizontal content padding. The bubble also consumes the shared font family, medium radius, and medium shadow.',
    'The 17.5rem maximum width, 8px trigger gap and viewport inset, 6px arrow, 1100 fallback stacking level, and body text size are literal implementation values rather than additional tokens.',
    'Measured bubble and arrow coordinates belong to placement behavior. The supplied trigger keeps its own component colors, typography, focus treatment, and token contract.',
    'Available width and height follow the visual viewport, including zoom. Their CSS fallbacks use the normal viewport dimensions until measurement is available.',
    'Forced-colors mode uses system CanvasText and Canvas colors with a visible border; those system keywords are not global design tokens.',
  ],
}];
