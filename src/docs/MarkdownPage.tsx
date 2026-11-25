import { useDeferredValue, useState } from 'react';
import type { MouseEvent } from 'react';
import { BookOpen, Check, Code2, Copy, RotateCcw } from 'lucide-react';
import { Alert, Badge, Button, TextArea } from '../system/components';
import { MarkdownRenderer } from '../system/MarkdownRenderer';
import { ExampleGallery, copyText, Showcase } from './shared';
import { Text } from '../system';
import './markdown-page.css';

const exampleMarkdown = [
  '## Component review',
  '',
  'The review covers **component props**, *optional behavior*, and ~~superseded defaults~~.',
  '',
  'Use the spacing token `--cr-space-6` for the example container padding.',
  '',
  '### Review checklist',
  '',
  '- [x] Inspect the public props.',
  '- [x] Record keyboard behavior.',
  '- [ ] Verify empty and loading states.',
  '',
  '### Review procedure',
  '',
  '1. Inspect the component implementation.',
  '2. Compare the preview with its source.',
  '   - Check labels and state descriptions.',
  '   - Record behavior that requires runtime verification.',
  '3. Update the API documentation.',
  '',
  '> Document the trigger, expected state, and observed result.',
  '',
  '### Review scope',
  '',
  '| Area | Status | Review scope |',
  '| --- | --- | --- |',
  '| Foundations | Ready | Color, typography, and spacing tokens. |',
  '| Components | In progress | Props, interaction states, and keyboard behavior. |',
  '| Patterns | In review | Composition of multiple components and shared state. |',
  '',
  '### React usage',
  '',
  '```tsx',
  "import { Button } from '@chartreuse/ui';",
  '',
  'export function NextStep() {',
  '  return <Button>View review notes</Button>;',
  '}',
  '```',
  '',
  'See the [React documentation](https://react.dev/). Record verification details in the task report.[^context]',
  '',
  '---',
  '',
  '#### Verification notes',
  '',
  'A review note should identify the component, the state tested, and the observed result.',
  '',
  '[^context]: Include test commands and relevant output when documenting a verified result.',
].join('\n');

const gfmMarkdown = [
  '#### Review checklist',
  '',
  '- [x] Collect the review notes.',
  '- [x] Verify the expected result.',
  '- [ ] Attach the review summary.',
  '',
  '#### Review matrix',
  '',
  '| Item | Status | Supporting context |',
  '| --- | --- | --- |',
  '| Workspace notes | Ready | Review decisions are recorded in the task report. |',
  '| Checklist | In review | Two sample items are complete; one remains. |',
  '| Handoff | Planned | Attach verification results for the next reviewer. |',
].join('\n');

const codeMarkdown = [
  'Use inline code such as `task.status` within a sentence.',
  '',
  '```ts',
  'const tasks = [',
  '  { title: "Collect review notes", done: true },',
  '  { title: "Attach review summary", done: false },',
  '];',
  '',
  'const completed = tasks.filter(task => task.done);',
  '```',
  '',
  'An unlabeled fence uses a plain text code block:',
  '',
  '```',
  'Review notes are ready.',
  'One sample checklist item remains.',
  '```',
].join('\n');

const safetyMarkdown = [
  'Inline code displays literal markup: `<button>Example</button>`.',
  '',
  '[Unsupported protocol](javascript:example()) is displayed as ordinary text.',
  '',
  '<strong>Raw HTML tags do not add formatting.</strong>',
  '',
  '<script>window.__chartreuseMarkdownExample = true;</script>',
  '',
  'A normal [React documentation](https://react.dev/) link remains available.',
].join('\n');

const longMarkdown = [
  '**Changes suggested.** SPEC-1 matches the verified discovery. Five gaps would leave an implementer guessing.',
  '',
  '1. No error state for a failed load.',
  '2. No limit on the preview length.',
  '3. No owner for the migration.',
  '4. The p95 target has no measurement method.',
  '5. The rollout has no flag.',
  '',
  'Fix these and the spec is ready to plan.',
].join('\n');

function markdownUsage(markdown: string) {
  return `import { MarkdownRenderer } from '@chartreuse/ui';\n\nconst markdown = [\n${markdown.split('\n').map(line => `  ${JSON.stringify(line)},`).join('\n')}\n].join('\\n');\n\n<MarkdownRenderer>{markdown}</MarkdownRenderer>`;
}

function followPreviewFragment(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || !event.currentTarget.contains(link) || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
  const fragment = link.getAttribute('href')?.slice(1);
  if (!fragment) return;
  let targetId: string;
  try { targetId = decodeURIComponent(fragment); } catch { return; }
  const target = event.currentTarget.ownerDocument.getElementById(targetId);
  if (!(target instanceof HTMLElement) || !event.currentTarget.contains(target)) return;
  event.preventDefault();
  target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  if (!target.hasAttribute('tabindex') && !target.matches('a[href], button, input, select, textarea, summary, [contenteditable="true"]')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}

export function MarkdownPage() {
  const [source, setSource] = useState(exampleMarkdown);
  const deferredSource = useDeferredValue(source);
  const [copied, setCopied] = useState(false);
  const rendererCode = markdownUsage(source);

  return <>
    <div className="markdown-page-intro"><Text size="body">MarkdownRenderer supports CommonMark and GFM content in notes, comments, reports, and conversation messages.</Text><div><Badge>CommonMark + GFM</Badge><Button variant="secondary" size="sm" icon={RotateCcw} disabled={source === exampleMarkdown} onClick={() => { setSource(exampleMarkdown); setCopied(false); }}>Reset example</Button></div></div>
    <ExampleGallery className="markdown-examples" maxColumns={3}><Showcase span="full" title="Editable Markdown source and preview" description="Edit the Markdown source to update the preview. The source view shows the corresponding React usage." code={rendererCode}><div className="markdown-playground">
      <section className="markdown-source-panel"><header><Text size="heading-2"><Code2 size={15} aria-hidden="true" />Source</Text><Button variant="ghost" size="sm" icon={copied ? Check : Copy} onClick={async () => setCopied(await copyText(source))}>{copied ? 'Copied' : 'Copy source'}</Button></header><div><TextArea label="Markdown source" name="markdownSource" value={source} onChange={event => { setSource(event.target.value); setCopied(false); }} rows={24} spellCheck={false} autoCapitalize="none" autoCorrect="off" /></div><Text size="body">Edit the source to preview headings, lists, tables, task lists, and code blocks.</Text></section>
      <section className="markdown-preview-panel" aria-busy={source !== deferredSource || undefined}><header><Text size="heading-2"><BookOpen size={15} aria-hidden="true" />Preview</Text><span>Live rendering</span></header><div onClick={followPreviewFragment}><MarkdownRenderer>{deferredSource}</MarkdownRenderer></div></section>
    </div></Showcase>
    <Showcase title="Clamped long content" description="maxLines clamps the content with a fade; the toggle appears only when it overflows." code={markdownUsage(longMarkdown).replace('<MarkdownRenderer>', '<MarkdownRenderer maxLines={4} expandLabel="Show full reply">')}><div className="markdown-focused-sample"><MarkdownRenderer maxLines={4} expandLabel="Show full reply">{longMarkdown}</MarkdownRenderer></div></Showcase>
    <Showcase title="Tables and task lists" description="GFM checklist items retain their read-only checkbox state; wide tables scroll within the rendered content." code={markdownUsage(gfmMarkdown)}><div className="markdown-focused-sample"><MarkdownRenderer>{gfmMarkdown}</MarkdownRenderer></div></Showcase>
    <Showcase title="Inline and fenced code" description="Language labels, copy actions, and keyboard-scrollable code blocks are supplied by the renderer." code={markdownUsage(codeMarkdown)}><div className="markdown-focused-sample"><MarkdownRenderer>{codeMarkdown}</MarkdownRenderer></div></Showcase>
    <Showcase title="Raw HTML and link protocols" description="Raw HTML is skipped, unsupported link protocols become text, and inline markup stays literal code." code={markdownUsage(safetyMarkdown)}><div className="markdown-focused-sample"><MarkdownRenderer>{safetyMarkdown}</MarkdownRenderer></div></Showcase></ExampleGallery>
    <div className="document-section"><Alert tone="neutral" title="Rendering behavior">Raw HTML is skipped. Unsupported link protocols remain plain text. Code and wide tables scroll inside their own boundaries, and external links open in a new tab.</Alert></div>
  </>;
}
