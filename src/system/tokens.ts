/** Chartreuse palette values and their semantic roles. */
export const colors = {
  evergreen: { value: '#024340', token: '--cr-evergreen', role: 'Brand and primary actions' },
  chartreuse: { value: '#DBFFAD', token: '--cr-chartreuse', role: 'Accent surfaces' },
  paper: { value: '#FFFDF6', token: '--cr-paper', role: 'Cards and raised surfaces' },
  canvas: { value: '#F2F0E6', token: '--cr-canvas', role: 'Workspace background' },
  muted: { value: '#52645F', token: '--cr-muted', role: 'Supporting text' },
  border: { value: '#CECCC3', token: '--cr-border', role: 'Borders and dividers' },
  success: { value: '#0A7366', token: '--cr-success', role: 'Success and completion' },
  info: { value: '#125996', token: '--cr-info', role: 'Information and progress' },
  warning: { value: '#855900', token: '--cr-warning', role: 'Warnings and review' },
  danger: { value: '#992B3D', token: '--cr-danger', role: 'Errors and destructive actions' },
} as const;

export const spacing = [
  { name: '1', value: 4 }, { name: '2', value: 8 }, { name: '3', value: 12 },
  { name: '4', value: 16 }, { name: '5', value: 20 }, { name: '6', value: 24 },
  { name: '8', value: 32 }, { name: '10', value: 40 }, { name: '12', value: 48 },
  { name: '16', value: 64 },
] as const;

export const typography = [
  { name: 'Display', size: 56, weight: 500, lineHeight: 1.1, sample: 'Component documentation' },
  { name: 'Heading 1', size: 36, weight: 550, lineHeight: 1.2, sample: 'Workspace configuration' },
  { name: 'Heading 2', size: 24, weight: 550, lineHeight: 1.3, sample: 'Task status and assignments' },
  { name: 'Heading 3', size: 18, weight: 600, lineHeight: 1.4, sample: 'Recent activity' },
  { name: 'Body', size: 14, weight: 400, lineHeight: 1.65, sample: 'Use components and tokens to build application interfaces.' },
  { name: 'Small', size: 12, weight: 450, lineHeight: 1.5, sample: 'Supporting text for fields and controls.' },
  { name: 'Label', size: 10, weight: 600, lineHeight: 1.5, sample: 'COMPONENTS AND DESIGN TOKENS' },
] as const;

export const radii = { sm: 4, md: 7, lg: 10, xl: 14, full: 999 } as const;

export const tokens = {
  name: 'Chartreuse', version: '1.0.0',
  colors: Object.fromEntries(Object.entries(colors).map(([key, color]) => [key, color.value])),
  spacing: Object.fromEntries(spacing.map(space => [space.name, `${space.value}px`])),
  typography, radii,
} as const;
