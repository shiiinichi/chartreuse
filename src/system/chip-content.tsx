import type { ReactNode } from 'react';

// Internal: shared by ToggleChip and the static SegmentedProgress legend. Not re-exported.
/** Shared chip interior. The count is announced after the label, e.g. "Review 3". */
export function ChipContent({ dot, dotStyle, count, children }: { dot: boolean; dotStyle: 'solid' | 'outline'; count?: number; children: ReactNode }) {
  return <>
    {dot && <span className="cr-toggle-chip-dot" data-style={dotStyle} aria-hidden="true" />}
    <span className="cr-toggle-chip-label">{children}</span>
    {count !== undefined && <span className="cr-toggle-chip-count"><span className="cr-sr-only">, </span>{count}</span>}
  </>;
}

