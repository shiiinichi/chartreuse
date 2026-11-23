/** Chartreuse palette values and their semantic roles. */
export const colors = {
  evergreen: { value: '#024340', token: '--cr-evergreen', role: 'Brand, primary actions, and active highlights' },
  evergreenLight: { value: '#096864', token: '--cr-evergreen-light', role: 'Selected navigation on evergreen' },
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

/**
 * Categorical accent palette for grouping that is not a status (workflow stages, labels, owners).
 * Each foreground meets 4.5:1 on its own background and on --cr-color-surface in both schemes, and
 * neighbouring hues alternate between darker and lighter so adjacent categories differ in lightness.
 * Color is never the only signal: pair an accent with a visible label.
 */
export const categoryColors = [
  { id: 'cat-1', name: 'Purple', token: '--cr-color-cat-1', backgroundToken: '--cr-color-cat-1-bg', light: { value: '#603394', background: '#f3edff' }, dark: { value: '#e4d6fe', background: '#392950' } },
  { id: 'cat-2', name: 'Magenta', token: '--cr-color-cat-2', backgroundToken: '--cr-color-cat-2-bg', light: { value: '#a53377', background: '#ffe9f3' }, dark: { value: '#f89ccc', background: '#4d213a' } },
  { id: 'cat-3', name: 'Teal', token: '--cr-color-cat-3', backgroundToken: '--cr-color-cat-3-bg', light: { value: '#015b60', background: '#e4f4f5' }, dark: { value: '#b0eaee', background: '#1b383a' } },
  { id: 'cat-4', name: 'Orange', token: '--cr-color-cat-4', backgroundToken: '--cr-color-cat-4-bg', light: { value: '#a04911', background: '#feece3' }, dark: { value: '#f3aa86', background: '#4b2916' } },
  { id: 'cat-5', name: 'Slate', token: '--cr-color-cat-5', backgroundToken: '--cr-color-cat-5-bg', light: { value: '#415165', background: '#ecf1f6' }, dark: { value: '#d1e0f1', background: '#2d333c' } },
  { id: 'cat-6', name: 'Blue', token: '--cr-color-cat-6', backgroundToken: '--cr-color-cat-6-bg', light: { value: '#3163b5', background: '#e8f1ff' }, dark: { value: '#97bfff', background: '#1f3353' } },
  { id: 'cat-7', name: 'Green', token: '--cr-color-cat-7', backgroundToken: '--cr-color-cat-7-bg', light: { value: '#305d0d', background: '#e9f4e3' }, dark: { value: '#c5ecb1', background: '#27391d' } },
  { id: 'cat-8', name: 'Amber', token: '--cr-color-cat-8', backgroundToken: '--cr-color-cat-8-bg', light: { value: '#835f0b', background: '#f8efe0' }, dark: { value: '#d6ba85', background: '#3e3116' } },
] as const;

/** A categorical accent: `'cat-1'` through `'cat-8'`. */
export type CategoryColor = typeof categoryColors[number]['id'];

export const spacing = [
  { name: '1', value: 4 }, { name: '2', value: 8 }, { name: '3', value: 12 },
  { name: '4', value: 16 }, { name: '5', value: 20 }, { name: '6', value: 24 },
  { name: '8', value: 32 }, { name: '10', value: 40 }, { name: '12', value: 48 },
  { name: '16', value: 64 },
] as const;

export const typography = [
  { id: 'display', name: 'Display', size: 56, weight: 500, lineHeight: 1.1, sample: 'Workspace overview' },
  { id: 'heading-1', name: 'Heading 1', size: 36, weight: 550, lineHeight: 1.2, sample: 'Workspace configuration' },
  { id: 'heading-2', name: 'Heading 2', size: 24, weight: 550, lineHeight: 1.3, sample: 'Task status and assignments' },
  { id: 'heading-3', name: 'Heading 3', size: 18, weight: 600, lineHeight: 1.4, sample: 'Recent activity' },
  { id: 'body', name: 'Body', size: 14, weight: 400, lineHeight: 1.65, sample: 'Use components and tokens to build application interfaces.' },
  { id: 'small', name: 'Small', size: 12, weight: 450, lineHeight: 1.5, sample: 'Supporting text for fields and controls.' },
  { id: 'label', name: 'Label', size: 10, weight: 600, lineHeight: 1.5, sample: 'COMPONENTS AND DESIGN TOKENS' },
] as const;

export const radii = { sm: 4, md: 7, lg: 10, xl: 14, full: 999 } as const;

export const tokens = {
  name: 'Chartreuse', version: '1.0.0',
  colors: Object.fromEntries(Object.entries(colors).map(([key, color]) => [key, color.value])),
  spacing: Object.fromEntries(spacing.map(space => [space.name, `${space.value}px`])),
  typography, radii,
} as const;
