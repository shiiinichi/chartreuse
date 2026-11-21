export const optionListMaxHeight = 280;
export const optionListFlipThreshold = 180;

export function optionListViewport(view: Window, doc: Document) {
  const layoutHeight = doc.documentElement.clientHeight;
  const viewport = view.visualViewport;
  const left = viewport?.offsetLeft ?? 0;
  const top = viewport?.offsetTop ?? 0;
  return {
    left, top, layoutHeight,
    right: left + (viewport?.width ?? doc.documentElement.clientWidth),
    bottom: top + (viewport?.height ?? layoutHeight),
  };
}

export function matchOptionListAnchor(rect: DOMRect, { left, top, right, bottom, layoutHeight }: ReturnType<typeof optionListViewport>) {
  const below = bottom - rect.bottom - 14;
  const above = rect.top - top - 14;
  const useAbove = below < optionListFlipThreshold && above > below;
  const width = Math.min(rect.width, Math.max(0, right - left - 16));

  return {
    left: Math.max(left + 8, Math.min(rect.left, right - width - 8)),
    top: rect.bottom + 6,
    bottom: layoutHeight - rect.top + 6,
    width,
    maxHeight: Math.max(0, Math.min(optionListMaxHeight, useAbove ? above : below)),
    above: useAbove,
  };
}

export function trackOptionListAnchor(
  anchor: HTMLElement,
  view: Window,
  ownsHit: (target: Element | null) => boolean,
  place: (rect: DOMRect, viewport: ReturnType<typeof optionListViewport>) => void,
  close: () => void,
) {
  const doc = anchor.ownerDocument;
  const tree = anchor.getRootNode();
  const hitTest = 'elementFromPoint' in tree ? tree as Document | ShadowRoot : doc;
  let frame = 0;
  let lastGeometry = '';

  const update = () => {
    const rect = anchor.getBoundingClientRect();
    const viewport = optionListViewport(view, doc);
    const { left, top, right, bottom, layoutHeight } = viewport;
    const geometry = `${rect.left},${rect.top},${rect.right},${rect.bottom},${left},${top},${right},${bottom},${layoutHeight}`;
    if (geometry !== lastGeometry) {
      const visibleLeft = Math.max(rect.left, left);
      const visibleRight = Math.min(rect.right, right);
      const visibleTop = Math.max(rect.top, top);
      const visibleBottom = Math.min(rect.bottom, bottom);
      // A top-layer popup can outlast its anchor when scrolling under a sticky surface.
      if (visibleLeft >= visibleRight || visibleTop >= visibleBottom
        || !ownsHit(hitTest.elementFromPoint((visibleLeft + visibleRight) / 2, (visibleTop + visibleBottom) / 2))) {
        close();
        return;
      }

      place(rect, viewport);
      lastGeometry = geometry;
    }
    frame = view.requestAnimationFrame(update);
  };

  update();
  return () => view.cancelAnimationFrame(frame);
}
