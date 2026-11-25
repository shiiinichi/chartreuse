import { Alert, Text } from '../system';
import { CodeBlock, SectionTitle } from './shared';

const prefix = 'npm exec --offline --no -- chartreuse';

const commands: ReadonlyArray<{ usage: string; description: string }> = [
  { usage: 'list', description: 'List the public components, grouped as Actions, Forms, Feedback, Content, Navigation, Overlays, Layout, and Agents.' },
  { usage: 'search <query>', description: 'Find components, guides, and CSS tokens by keyword. Matches whole words, plurals, and common synonyms, and returns up to ten results with a kind of component, guide, or token. Token results include their default value.' },
  { usage: 'info <component>', description: 'Show props, defaults, native attributes, and implementation notes. JSON output adds example (the demo snippet) and seeAlso, similar components with a reason for each.' },
  { usage: 'demo <component>', description: 'Print the documented TSX example. Module-shaped snippets paste in as is; JSX-shaped snippets go inside a component body.' },
  { usage: 'token [component]', description: 'Show global CSS variables, or the styling hooks and selectors for one component, followed by customization notes.' },
  { usage: 'guide [topic] [--code]', description: 'List guidance topics or read one. Pattern guides such as settings-editor print notes; --code adds the full component source and CSS.' },
];

const guides: ReadonlyArray<[string, string]> = [
  ['setup', 'Install steps and a starter snippet. Read it before first use.'],
  ['choosing', 'A decision table for similar components, such as Dialog, Drawer, and Sidebar.'],
  ['layout, typography', 'Choosing between Grid, Flex, and Masonry, and the shared type scale.'],
  ['color, spacing, shape, icons, accessibility, writing', 'Foundation guides.'],
  ['settings-editor and other patterns', 'Application patterns with notes and, with --code, the source.'],
];

export function CliSkillPage() {
  return <>
    <div className="document-section"><SectionTitle title="The chartreuse command" />
      <Text size="body">The <code>chartreuse</code> command ships with <code>@chartreuse/ui</code> and answers component questions from your terminal. It reads the reference bundled with the installed version, so it works offline and always matches the components you import. Run it from the app or workspace that uses Chartreuse.</Text>
      <CodeBlock language="sh" code={`${prefix} search 'folder path' --format json\n${prefix} info PathSelector --format json\n${prefix} demo PathSelector\n${prefix} token Grid\n${prefix} guide choosing`} />
      <Text size="body">In the Chartreuse source repository, run <code>npm run build:lib</code> once, then use <code>npm run --silent query --</code> in place of the prefix above.</Text>
    </div>
    <div className="document-section"><SectionTitle title="Commands" />
      <ul>{commands.map(command => <li key={command.usage}><code>{command.usage}</code>: {command.description}</li>)}</ul>
    </div>
    <div className="document-section"><SectionTitle title="Guide topics" />
      <ul>{guides.map(([topic, description]) => <li key={topic}><code>{topic}</code>: {description}</li>)}</ul>
    </div>
    <div className="document-section"><SectionTitle title="Output formats" />
      <Text size="body">Pass <code>--format json</code> for machine-readable output; the default is text. Every JSON response carries <code>schemaVersion</code> and <code>chartreuseVersion</code>, and a successful query writes its result to stdout under <code>data</code>. A lookup that resolved through an alias, such as <code>info modal</code>, adds <code>data.resolvedFrom</code>.</Text>
      <Text size="body">Errors are structured JSON on stderr. Exit status 1 means the reference is unavailable, and 2 means invalid usage. An unknown or ambiguous name adds <code>error.suggestions</code> with close matches. Warnings appear as <code>warnings: [{'{ code, message }'}]</code>; in a source checkout, <code>STALE_BUILD</code> means the CLI build is older than its sources and <code>npm run build:lib</code> will refresh it.</Text>
    </div>
    <div className="document-section"><SectionTitle title="The Chartreuse agent skill" />
      <Text size="body">The package includes an agent skill that teaches a coding agent to use the command above instead of guessing at props. It lists the setup requirements to check before building, such as importing the stylesheet once, wrapping <code>useToast</code> callers in <code>ToastProvider</code>, and importing from client components in RSC apps. It then directs the agent to <code>search</code>, <code>info</code>, <code>demo</code>, <code>token</code>, and <code>guide</code>.</Text>
      <Text size="body">To use it in a consuming project, install a Chartreuse release that includes it, then copy it into the repository from the project root:</Text>
      <CodeBlock language="sh" code={`mkdir -p .agents/skills/chartreuse\ncp node_modules/@chartreuse/ui/.agents/skills/chartreuse/SKILL.md .agents/skills/chartreuse/`} />
      <Text size="body">Once it is in place, ask your agent a component question and it will query the CLI for the answer:</Text>
      <CodeBlock language="text" code="Which Chartreuse component should I use to enter a repository folder path?" />
      <Alert tone="neutral" title="Version matching">The skill queries the CLI installed in the app or workspace where the agent is working, so answers follow the version that app has installed. Update the copied SKILL.md when you upgrade Chartreuse.</Alert>
    </div>
  </>;
}
