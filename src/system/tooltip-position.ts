export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
export type TooltipPlacement = TooltipSide | `${TooltipSide}-start` | `${TooltipSide}-end`;

interface Rectangle { left: number; top: number; width: number; height: number }
interface Size { width: number; height: number }

export interface TooltipPosition {
  left: number;
  top: number;
  side: TooltipSide;
  placement: TooltipPlacement;
  arrowX: number;
  arrowY: number;
}

const nonnegative = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(value, Math.max(minimum, maximum)));

export function normalizeTooltipPlacement(value: unknown): TooltipPlacement {
  return typeof value === 'string' && /^(top|bottom|left|right)(-(start|end))?$/.test(value) ? value as TooltipPlacement : 'top';
}

/** Fixed-position geometry in viewport CSS pixels, independent of DOM mutation. */
export function tooltipPosition(anchor: Rectangle, popup: Size, viewport: Rectangle, requested: TooltipPlacement = 'top', rtl = false, gap = 8, padding = 8): TooltipPosition {
  const [requestedSide, alignment] = normalizeTooltipPlacement(requested).split('-') as [TooltipSide, 'start' | 'end' | undefined];
  const width = nonnegative(popup.width), height = nonnegative(popup.height);
  const inset = nonnegative(padding), offset = nonnegative(gap);
  const bounds = { left: viewport.left + inset, top: viewport.top + inset, right: viewport.left + nonnegative(viewport.width) - inset, bottom: viewport.top + nonnegative(viewport.height) - inset };
  const right = anchor.left + nonnegative(anchor.width), bottom = anchor.top + nonnegative(anchor.height);
  const space = { top: anchor.top - bounds.top - offset, bottom: bounds.bottom - bottom - offset, left: anchor.left - bounds.left - offset, right: bounds.right - right - offset };
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
  const needed = requestedSide === 'top' || requestedSide === 'bottom' ? height : width;
  let side: TooltipSide = space[requestedSide] < needed && space[opposite[requestedSide]] > space[requestedSide] ? opposite[requestedSide] : requestedSide;
  if (space[requestedSide] < needed && space[opposite[requestedSide]] < needed) {
    // Shifting on the requested axis can cover the focused trigger when neither
    // side fits. Prefer a fitting side on the other axis before clamping.
    const alternatives: TooltipSide[] = requestedSide === 'top' || requestedSide === 'bottom' ? ['left', 'right'] : ['top', 'bottom'];
    const alternateSize = requestedSide === 'top' || requestedSide === 'bottom' ? width : height;
    const fitting = alternatives.filter(candidate => space[candidate] >= alternateSize);
    if (fitting.length) side = fitting.reduce((best, candidate) => space[candidate] > space[best] ? candidate : best);
  }
  let left = anchor.left + (anchor.width - width) / 2;
  let top = anchor.top + (anchor.height - height) / 2;
  if (side === 'top' || side === 'bottom') {
    if (alignment === 'start') left = rtl ? right - width : anchor.left;
    if (alignment === 'end') left = rtl ? anchor.left : right - width;
    top = side === 'top' ? anchor.top - height - offset : bottom + offset;
  } else {
    if (alignment === 'start') top = anchor.top;
    if (alignment === 'end') top = bottom - height;
    left = side === 'left' ? anchor.left - width - offset : right + offset;
  }
  left = clamp(left, bounds.left, bounds.right - width);
  top = clamp(top, bounds.top, bounds.bottom - height);
  return {
    left, top, side, placement: `${side}${alignment ? `-${alignment}` : ''}` as TooltipPlacement,
    arrowX: clamp(anchor.left + anchor.width / 2 - left, 10, width - 10),
    arrowY: clamp(anchor.top + anchor.height / 2 - top, 10, height - 10),
  };
}
