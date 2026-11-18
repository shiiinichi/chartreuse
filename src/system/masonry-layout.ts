/** Geometry only: source items retain their order; no DOM nodes are moved. */
export interface MasonryLayoutItem {
  height: number;
  span?: number | 'full';
}

export interface MasonryLayoutOptions {
  width: number;
  columns: number;
  rowGap: number;
  columnGap: number;
}

export interface MasonryPlacement {
  column: number;
  span: number;
  inlineStart: number;
  blockStart: number;
  inlineSize: number;
  blockSize: number;
}

const nonnegative = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;

export function masonryGeometry(items: readonly MasonryLayoutItem[], options: MasonryLayoutOptions) {
  const width = nonnegative(options.width);
  const columns = Number.isFinite(options.columns) ? Math.min(24, Math.max(1, Math.floor(options.columns))) : 1;
  const rowGap = nonnegative(options.rowGap);
  const columnGap = columns === 1 ? 0 : Math.min(nonnegative(options.columnGap), Math.max(0, (width - 4 * columns) / (columns - 1)));
  const columnWidth = Math.max(0, (width - columnGap * (columns - 1)) / columns);
  const bottoms = Array<number>(columns).fill(0);
  const placements = items.map(item => {
    const span = item.span === 'full' ? columns : Number.isFinite(item.span) ? Math.min(columns, Math.max(1, Math.floor(item.span!))) : 1;
    let column = 0;
    let blockStart = Infinity;
    for (let start = 0; start <= columns - span; start += 1) {
      const top = Math.max(...bottoms.slice(start, start + span));
      if (top < blockStart) { column = start; blockStart = top; }
    }
    const blockSize = nonnegative(item.height);
    for (let index = column; index < column + span; index += 1) bottoms[index] = blockStart + blockSize + rowGap;
    return { column, span, inlineStart: column * (columnWidth + columnGap), blockStart, inlineSize: columnWidth * span + columnGap * (span - 1), blockSize };
  });
  return { placements, blockSize: items.length ? Math.max(...bottoms) - rowGap : 0, columnWidth, columnGap };
}
