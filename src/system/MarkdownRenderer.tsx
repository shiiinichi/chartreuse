import { useEffect, useId, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import type { Components, ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { IconButton } from './components';
import { Text } from './Text';
import type { TextProps } from './Text';
import './markdown-renderer.css';

export interface MarkdownRendererProps {
  children: string;
  className?: string;
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

/** Renders CommonMark and GFM with raw HTML skipped and URL schemes filtered. */
export function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  const id = useId();
  const prefix = `cr-markdown-${id.replace(/[^a-zA-Z0-9_-]/g, '')}-`;
  const footnoteLabelId = `${prefix}footnotes`;
  return <div className={['cr-markdown', className].filter(Boolean).join(' ')}><Markdown
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
