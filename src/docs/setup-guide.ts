export const basicAppSnippet = `import { Button, TextField, ToastProvider } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';\n\nexport default function App() {\n  return (\n    <ToastProvider>\n      <TextField label="Task name" placeholder="Enter a task title" />\n      <Button>Create task</Button>\n    </ToastProvider>\n  );\n}`;

export const setupGuide = {
  id: 'setup',
  label: 'Setup',
  description: 'Install @chartreuse/ui, import its stylesheet, and configure fonts, providers, and light and dark themes.',
  docsPath: '#getting-started',
  notes: [
    "GitHub Packages requires registry authentication, including for public packages, and a scope mapping so npm does not resolve @shiiinichi against npmjs. Sign in once per machine with npm login --scope=@shiiinichi --registry=https://npm.pkg.github.com --auth-type=legacy (use a classic token with read:packages as the password), or add @shiiinichi:registry=https://npm.pkg.github.com and an _authToken line to the project's .npmrc.",
    "Install the package under the @chartreuse/ui alias: npm install '@chartreuse/ui@npm:@shiiinichi/chartreuse@latest'.",
    'React and React DOM 19 are peer dependencies supplied by the application.',
    "Import '@chartreuse/ui/styles.css' once at the application entry. Components render unstyled without it.",
    'The stylesheet does not style body. Set body { background: var(--cr-color-canvas); color: var(--cr-color-text); font-family: var(--cr-font-sans); } so the page follows the theme.',
    'Wrap every component that calls useToast in ToastProvider, typically once near the application root.',
    'Inter is not bundled for consumers. Bundle @fontsource-variable/inter, supply Inter yourself, or override --cr-font-sans; system font fallbacks are included.',
    'Colors follow the document color-scheme through light-dark(), so light and dark follow the system by default. Force one with <meta name="color-scheme" content="light"> or content="dark".',
    'Styles live in the cascade layers cr-base, cr-tokens, and cr-components, so unlayered application CSS overrides them without extra specificity. If the application layers its own CSS (for example Tailwind v4), declare @layer cr-base, cr-tokens, cr-components; before its own layers, or Chartreuse styles win.',
    "The package has no 'use client' directive and uses client-only React APIs such as useState and createContext. In React Server Component applications, import @chartreuse/ui only from client components ('use client' files); @chartreuse/ui/tokens has no React import and is safe on the server.",
    'Icon props accept lucide-react components, React SVG components, or inline SVG elements. SVG strings are not accepted.',
    'The @chartreuse/ui/tokens subpath exports static JavaScript token data. Use the --cr-* CSS variables for styling.',
  ],
  code: basicAppSnippet,
};
