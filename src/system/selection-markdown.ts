// Converts the selected part of a rendered Markdown body back to Markdown source.
// It covers the elements MarkdownRenderer produces; anything else falls back to its text.

const blockTags = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'ul', 'ol', 'li', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'div', 'section', 'figure']);

function isElement(node: Node): node is Element {
  return node.nodeType === 1;
}

function skipped(element: Element) {
  return element.matches('.cr-markdown-code-bar, .cr-sr-only, button, [data-footnote-backref], [aria-hidden="true"]');
}

function wrap(marker: string, text: string) {
  const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
  if (!match || !match[2]) return text;
  return `${match[1]}${marker}${match[2]}${marker}${match[3]}`;
}

function longestRun(text: string, character: string) {
  let longest = 0;
  for (const run of text.match(new RegExp(`${character === '`' ? '`' : '~'}+`, 'g')) ?? []) longest = Math.max(longest, run.length);
  return longest;
}

function codeSpan(text: string) {
  if (!text) return '';
  const fence = '`'.repeat(longestRun(text, '`') + 1);
  const pad = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${text}${pad}${fence}`;
}

function inline(node: Node): string {
  if (node.nodeType === 3) return node.textContent ?? '';
  if (!isElement(node) || skipped(node)) return '';
  const content = () => Array.from(node.childNodes, inline).join('');
  switch (node.localName) {
    case 'br': return '\n';
    case 'strong': case 'b': return wrap('**', content());
    case 'em': case 'i': return wrap('*', content());
    case 'del': case 's': return wrap('~~', content());
    case 'code': return codeSpan(node.textContent ?? '');
    case 'input': return node.getAttribute('type') === 'checkbox' ? (node.hasAttribute('checked') ? '[x] ' : '[ ] ') : '';
    case 'img': {
      const alt = node.getAttribute('alt') ?? '';
      const src = node.getAttribute('src');
      return src ? `![${alt}](${src})` : alt;
    }
    case 'a': {
      const text = content();
      const href = node.getAttribute('href');
      return href && !href.startsWith('#') && text.trim() ? `[${text}](${href})` : text;
    }
    default: return blockTags.has(node.localName) ? blocks(node) : content();
  }
}

function indent(text: string, prefix: string, first = prefix) {
  return text.split('\n').map((line, index) => (index === 0 ? first : line ? prefix : '') + line).join('\n');
}

function row(element: Element) {
  const cells = Array.from(element.children).filter(cell => cell.localName === 'td' || cell.localName === 'th');
  return `| ${cells.map(cell => Array.from(cell.childNodes, inline).join('').replace(/\n/g, ' ').replace(/\|/g, '\\|').trim()).join(' | ')} |`;
}

function table(element: Element) {
  const rows = Array.from(element.querySelectorAll('tr'));
  const lines = rows.map(row);
  const head = element.querySelector('thead tr');
  if (head && rows[0] === head) {
    const columns = Array.from(head.children).length;
    lines.splice(1, 0, `| ${Array(columns).fill('---').join(' | ')} |`);
  }
  return lines.join('\n');
}

function list(element: Element) {
  const ordered = element.localName === 'ol';
  const start = Number(element.getAttribute('start')) || 1;
  return Array.from(element.children).filter(item => item.localName === 'li').map((item, index) => {
    const marker = ordered ? `${start + index}. ` : '- ';
    return indent(blocks(item), ' '.repeat(marker.length), marker);
  }).join('\n');
}

function block(element: Element): string {
  if (skipped(element)) return '';
  const tag = element.localName;
  if (/^h[1-6]$/.test(tag)) return `${'#'.repeat(Number(tag[1]))} ${Array.from(element.childNodes, inline).join('').trim()}`;
  switch (tag) {
    case 'p': return Array.from(element.childNodes, inline).join('').trim();
    case 'hr': return '---';
    case 'pre': {
      const code = element.querySelector('code');
      const language = /language-([^\s]+)/.exec(code?.getAttribute('class') ?? '')?.[1] ?? '';
      const text = (element.textContent ?? '').replace(/\n$/, '');
      const fence = '`'.repeat(Math.max(3, longestRun(text, '`') + 1));
      return `${fence}${language}\n${text}\n${fence}`;
    }
    case 'ul': case 'ol': return list(element);
    case 'li': return indent(blocks(element), '  ', '- ');
    case 'blockquote': return blocks(element).split('\n').map(line => (line ? `> ${line}` : '>')).join('\n');
    case 'table': return table(element);
    case 'thead': case 'tbody': case 'tfoot': return Array.from(element.querySelectorAll('tr'), row).join('\n');
    case 'tr': return row(element);
    default: return blocks(element);
  }
}

function blocks(parent: Node): string {
  const output: string[] = [];
  let text = '';
  const flush = () => {
    if (text.trim()) output.push(text.trim());
    text = '';
  };
  for (const child of Array.from(parent.childNodes)) {
    if (isElement(child) && blockTags.has(child.localName)) {
      flush();
      const markdown = block(child);
      if (markdown.trim()) output.push(markdown);
    } else text += inline(child);
  }
  flush();
  return output.join('\n\n');
}

/** Markdown for the selected part of a message body, or the selection's plain text. */
export function selectionText(range: Range, body: Element) {
  const plain = range.toString();
  if (!body.querySelector(':scope > .cr-markdown, :scope > .cr-markdown-clamp > .cr-markdown')) return plain;
  try {
    // Rebuild the ancestors a partial selection lost, such as the code or list it sits in.
    let content: Node = range.cloneContents();
    let ancestor: Node | null = range.commonAncestorContainer;
    if (!isElement(ancestor)) ancestor = ancestor.parentNode;
    while (ancestor && ancestor !== body && isElement(ancestor)) {
      const shell = ancestor.cloneNode(false);
      shell.appendChild(content);
      content = shell;
      ancestor = ancestor.parentNode;
    }
    const container = body.ownerDocument.createElement('div');
    container.appendChild(content);
    return blocks(container) || plain;
  } catch {
    return plain;
  }
}
