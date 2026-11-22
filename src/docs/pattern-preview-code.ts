// The PatternPreview wrapper appended to pattern examples. Only ?raw imports, so the agent CLI can bundle it.
import patternPreviewSource from './PatternPreview.tsx?raw';
import patternPreviewStyles from './pattern-preview.css?raw';

const previewCode = patternPreviewSource
  .replace("import './pattern-preview.css';\n", '')
  .replace("from '../system'", "from '@chartreuse/ui'")
  .trim();

export function withExampleStyles(code: string, styles: string) {
  return `${code}\n\n/* Add these rules to your stylesheet.\n${styles.replaceAll('*/', '* /').trim()}\n*/`;
}

export function withPatternPreview(code: string, patternStyles = '') {
  return withExampleStyles(`${code}\n\n${previewCode}`, [patternPreviewStyles, patternStyles].filter(Boolean).join('\n\n'));
}
