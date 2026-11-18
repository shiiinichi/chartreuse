import { createContext, useContext, useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDownToLine, ArrowRight, Check, Code2, Copy, Eye, Maximize2 } from 'lucide-react';
import { Button, IconButton, useToast } from '../system';
import { Masonry, MasonryItem } from '../system/Masonry';
import type { MasonryProps } from '../system/Masonry';

const ExampleGalleryContext = createContext(false);

/** The documentation uses the same packing primitive exported to applications. */
export function ExampleGallery({ children, className, maxColumns = 24, ...props }: Omit<MasonryProps, 'columns' | 'minColumnWidth' | 'gap'>) {
  return <Masonry {...props} className={['example-gallery', className].filter(Boolean).join(' ')}
    minColumnWidth="var(--docs-example-min, 26rem)" maxColumns={maxColumns} gap={6}>
    <ExampleGalleryContext value>{children}</ExampleGalleryContext>
  </Masonry>;
}

export async function copyText(value: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(value); return true; }
  catch { return false; }
}

export function CodeBlock({ code, language = 'tsx' }: { code: string; language?: string }) {
  const notify = useToast();
  const [copied, setCopied] = useState(false);
  useEffect(() => { setCopied(false); }, [code]);
  return <div className="code-block"><div className="code-block-bar"><span>{language}</span><IconButton icon={copied ? Check : Copy} label={copied ? 'Code copied' : 'Copy code'} size="sm" onClick={async () => {
    const success = await copyText(code); setCopied(success); notify(success ? 'Code copied to clipboard' : 'Copy failed. Select and copy the code.', success ? 'success' : 'warning');
  }} /></div><pre tabIndex={0}><code>{code.split('\n').map((line, i) => <span className="code-line" key={i}>{highlight(line)}{'\n'}</span>)}</code></pre></div>;
}

function highlight(line: string) {
  const segments = line.split(/("[^"]*"|'[^']*'|\/\/.*$|#.*$|\b(?:import|from|export|default|function|return|const)\b|<\/?[A-Z][a-zA-Z]*)/g);
  return segments.map((segment, i) => <span key={i} className={/^['"]/.test(segment) ? 'syntax-string' : /^(\/\/|#)/.test(segment) ? 'syntax-comment' : /^(import|from|export|default|function|return|const)$/.test(segment) ? 'syntax-keyword' : /^<\/?[A-Z]/.test(segment) ? 'syntax-tag' : undefined}>{segment}</span>);
}

export const ShowcaseHeadingLevelContext = createContext<2 | 3>(2);

export function Showcase({ title, description, code, children, className = '', toolbar, onExpand, headingLevel, align = 'start', language = 'tsx', span = 'auto' }: { title: string; description?: string; code: string; children: ReactNode; className?: string; toolbar?: ReactNode; onExpand?: () => void; headingLevel?: 2 | 3; align?: 'start' | 'center'; language?: string; span?: 'auto' | 'full' }) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const inheritedHeadingLevel = useContext(ShowcaseHeadingLevelContext);
  const inGallery = useContext(ExampleGalleryContext);
  const Heading = (headingLevel ?? inheritedHeadingLevel) === 2 ? 'h2' : 'h3';
  const id = useId();
  const previewId = `${id}-preview`;
  const codeId = `${id}-code`;
  const frame = <section className={`showcase ${className}`} data-align={align} data-example-span={span}><header className="showcase-header"><div><Heading>{title}</Heading>{description && <p>{description}</p>}</div><div className="showcase-actions"><div className="view-switch" role="group" aria-label={`${title} display`}><button type="button" aria-pressed={view === 'preview'} aria-controls={previewId} onClick={() => setView('preview')} aria-label={`Preview ${title}`}><Eye size={13} aria-hidden="true" /></button><button type="button" aria-pressed={view === 'code'} aria-controls={codeId} onClick={() => setView('code')} aria-label={`View ${title} code`}><Code2 size={13} aria-hidden="true" /></button></div>{onExpand && <IconButton size="sm" icon={Maximize2} label={`Expand ${title}`} onClick={onExpand} />}</div></header>
    <div className="showcase-preview" id={previewId} hidden={view !== 'preview'}>{children}</div><div className="showcase-code" id={codeId} hidden={view !== 'code'}><CodeBlock code={code} language={language} /></div>{toolbar && <footer className="showcase-footer">{toolbar}</footer>}
  </section>;
  return inGallery && span === 'full' ? <MasonryItem span="full" className="example-gallery-full">{frame}</MasonryItem> : frame;
}

export function SectionTitle({ title, description, action, onAction }: { title: string; description?: string; action?: string; onAction?: () => void }) {
  return <div className="section-title"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <button className="text-link" type="button" onClick={onAction}>{action}<ArrowRight size={14} aria-hidden="true" /></button>}</div>;
}

export function downloadFile(content: string, name: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DownloadButton({ content, name, label = 'Export tokens', type }: { content: string; name: string; label?: string; type?: string }) {
  const notify = useToast();
  return <Button variant="secondary" icon={ArrowDownToLine} size="sm" onClick={() => { downloadFile(content, name, type); notify(`${name} exported`); }}>{label}</Button>;
}
