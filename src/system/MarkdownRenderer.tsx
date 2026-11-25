import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, FocusEvent } from 'react';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import type { Components, ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { Button, IconButton } from './components';
import { Text } from './Text';
import type { TextProps } from './Text';
import './markdown-renderer.css';

export interface MarkdownRendererProps {
  children: string;
  className?: string;
  /**
   * Clamps the content to this many lines, with a fade at the edge and a toggle that appears only
   * when the content overflows. Focusing a link past the edge expands it.
   */
  maxLines?: number;
  /** Text of the toggle that shows the rest. Defaults to 'Show more'. */
  expandLabel?: string;
  /** Text of the toggle that clamps the content again. Defaults to 'Show less'. */
  collapseLabel?: string;
}

function nodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  if ('value' in node && typeof node.value === 'string') return node.value;
  return 'children' in node && Array.isArray(node.children) ? node.children.map(nodeText).join('') : '';
}

function MarkdownCodeBlock({ node, children, ...props }: ComponentPropsWithoutRef<'pre'> & ExtraProps) {
  const text = nodeText(node);
  const codeNode = node?.children.find(child => child.type === 'element' && child.tagName === 'code');
  const classes = codeNode?.type === 'element' ? codeNode.properties.className : undefined;
  const language = /language-([^\s]+)/.exec(Array.isArray(classes) ? classes.join(' ') : String(classes || ''))?.[1] || 'text';
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => { setCopied(false); setStatus(''); }, [text]);

  return <div className="cr-markdown-code-block"><div className="cr-markdown-code-bar"><span>{language}</span><span role="status" aria-atomic="true" className="cr-markdown-copy-status">{status}</span><IconButton size="sm" icon={copied ? Check : Copy} label={`Copy ${language} code`} onClick={async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setStatus('Copied'); }
    catch { setStatus('Select the code to copy it.'); }
  }} /></div><pre {...props} tabIndex={0} role="region" aria-label={`${language} code block`}>{children}</pre></div>;
}

function MarkdownLink({ node: _node, href, children, footnoteLabelId, ...props }: ComponentPropsWithoutRef<'a'> & ExtraProps & { footnoteLabelId: string }) {
  // A rejected protocol is displayed as ordinary text, never as an empty link.
  if (!href) return <span className="cr-markdown-unavailable-link">{children}</span>;
  const external = /^(?:https?:)?\/\//i.test(href);
  const describedBy = props['aria-describedby']?.split(' ').map(id => id === 'footnote-label' ? footnoteLabelId : id).join(' ');
  return <a {...props} href={href} aria-describedby={describedBy} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>;
}

function markdownText(format: Pick<TextProps, 'size' | 'bold' | 'italic' | 'strikethrough'>) {
  return function MarkdownText({ node: _node, ...props }: ComponentPropsWithoutRef<'span'> & ExtraProps) {
    return <Text {...props} {...format} />;
  };
}

const baseComponents: Components = {
  h1: markdownText({ size: 'heading-1' }),
  h3: markdownText({ size: 'heading-3' }),
  p: markdownText({ size: 'body' }),
  strong: markdownText({ bold: true }),
  em: markdownText({ italic: true }),
  del: markdownText({ strikethrough: true }),
  pre: MarkdownCodeBlock,
  table: ({ node: _node, ...props }) => <div className="cr-markdown-table" tabIndex={0} role="region" aria-label="Markdown table"><table {...props} /></div>,
  img: ({ node: _node, src, alt, ...props }) => src ? <img {...props} src={src} alt={alt || ''} loading="lazy" decoding="async" referrerPolicy="no-referrer" /> : <span className="cr-markdown-unavailable-image">{alt || 'Image unavailable'}</span>,
};

function useOverflow(content: HTMLDivElement | null, maxLines: number | undefined, source: string) {
  const [overflowing, setOverflowing] = useState(false);
  useLayoutEffect(() => {
    const view = content?.ownerDocument.defaultView;
    if (!content || !view || !maxLines) { setOverflowing(false); return; }
    // Compared with the clamp height rather than the box, so it holds while expanded too.
    const measure = () => {
      const lineHeight = parseFloat(view.getComputedStyle(content).lineHeight) || 24;
      setOverflowing(content.scrollHeight > Math.ceil(maxLines * lineHeight) + 1);
    };
    measure();
    const observer = new view.ResizeObserver(measure);
    observer.observe(content);
    for (const child of Array.from(content.children)) observer.observe(child);
    content.addEventListener('load', measure, true);
    return () => {
      observer.disconnect();
      content.removeEventListener('load', measure, true);
    };
  }, [content, maxLines, source]);
  return overflowing;
}

/** Renders CommonMark and GFM with raw HTML skipped and URL schemes filtered. */
export function MarkdownRenderer({ children, className, maxLines, expandLabel = 'Show more', collapseLabel = 'Show less' }: MarkdownRendererProps) {
  const id = useId();
  const prefix = `cr-markdown-${id.replace(/[^a-zA-Z0-9_-]/g, '')}-`;
  const footnoteLabelId = `${prefix}footnotes`;
  const clamp = maxLines !== undefined && maxLines > 0 ? Math.floor(maxLines) : undefined;
  const [content, setContent] = useState<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const overflowing = useOverflow(content, clamp, children);
  const markdown = renderMarkdown(children, className, prefix, footnoteLabelId, clamp ? {
    ref: setContent,
    id: `${prefix}content`,
    'data-clamped': overflowing && !expanded ? '' : undefined,
    style: { '--cr-markdown-max-lines': clamp } as CSSProperties,
    onFocus: (event: FocusEvent<HTMLDivElement>) => {
      if (expanded || !overflowing) return;
      // Focus scrolls the clipped box, so measure from its content top rather than its visible edge.
      const box = event.currentTarget;
      const bottom = event.target.getBoundingClientRect().bottom - box.getBoundingClientRect().top + box.scrollTop;
      if (bottom > box.clientHeight + 1) setExpanded(true);
      box.scrollTop = 0;
    },
  } : undefined);
  if (!clamp) return markdown;
  return <div className="cr-markdown-clamp" data-expanded={expanded || undefined}>
    {markdown}
    {overflowing && <Button ref={toggle} variant="link" size="sm" className="cr-markdown-toggle" aria-expanded={expanded} aria-controls={`${prefix}content`}
      onClick={() => {
        setExpanded(!expanded);
        // Collapsing can leave the reader below the shortened content.
        if (expanded) requestAnimationFrame(() => toggle.current?.scrollIntoView({ block: 'nearest' }));
      }}>{expanded ? collapseLabel : expandLabel}</Button>}
  </div>;
}

function renderMarkdown(children: string, className: string | undefined, prefix: string, footnoteLabelId: string,
  clampProps?: { ref: (element: HTMLDivElement | null) => void; id: string; style: CSSProperties; onFocus: (event: FocusEvent<HTMLDivElement>) => void; 'data-clamped'?: string }) {
  return <div {...clampProps} className={['cr-markdown', className].filter(Boolean).join(' ')}><Markdown
    remarkPlugins={[remarkGfm]}
    remarkRehypeOptions={{ clobberPrefix: prefix, footnoteLabelProperties: { className: ['cr-sr-only'] } }}
    skipHtml
    urlTransform={url => defaultUrlTransform(url) || undefined}
    components={{
      ...baseComponents,
      a: props => <MarkdownLink {...props} footnoteLabelId={footnoteLabelId} />,
      h2: ({ node: _node, id: headingId, ...props }) => <Text {...props} size="heading-2" id={headingId === 'footnote-label' ? footnoteLabelId : headingId} />,
    }}
  >{children}</Markdown></div>;
}
