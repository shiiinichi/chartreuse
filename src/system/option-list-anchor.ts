const optionListMaxHeight = 280;
const optionListFlipThreshold = 180;
const optionListViewportInset = 8;

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

function positionOptionList(anchor: HTMLElement, panel: HTMLDivElement, view: Window, rect: DOMRect,
  { left, top, right, bottom, layoutHeight }: ReturnType<typeof optionListViewport>, matchTriggerWidth: boolean) {
  const inset = optionListViewportInset;
  const maxWidth = Math.max(0, right - left - 2 * inset);
  const direction = view.getComputedStyle(anchor).direction;
  panel.style.direction = direction;
  panel.style.minWidth = `${Math.min(rect.width, maxWidth)}px`;
  panel.style.maxWidth = `${maxWidth}px`;
  panel.style.width = matchTriggerWidth ? `${rect.width}px` : '';

  const { width } = panel.getBoundingClientRect();
  const start = direction === 'rtl' ? rect.right - width : rect.left;
  const below = bottom - rect.bottom - 14;
  const above = rect.top - top - 14;
  const opensAbove = below < optionListFlipThreshold && above > below;

  panel.style.left = `${Math.max(left + inset, Math.min(start, right - width - inset))}px`;
  panel.style.top = opensAbove ? 'auto' : `${rect.bottom + 6}px`;
  panel.style.bottom = opensAbove ? `${layoutHeight - rect.top + 6}px` : 'auto';
  panel.style.maxHeight = `${Math.max(0, Math.min(optionListMaxHeight, opensAbove ? above : below))}px`;
  panel.dataset.positioned = '';
}

export function trackOptionListAnchor(
  anchor: HTMLElement,
  panel: HTMLDivElement,
  view: Window & typeof globalThis,
  ownsHit: (target: Element | null) => boolean,
  close: () => void,
  matchTriggerWidth = false,
) {
  const doc = anchor.ownerDocument;
  const tree = anchor.getRootNode();
  const hitTest = 'elementFromPoint' in tree ? tree as Document | ShadowRoot : doc;
  let frame = 0;
  let lastGeometry = '';
  let panelResized = false;

  const update = () => {
    const rect = anchor.getBoundingClientRect();
    const viewport = optionListViewport(view, doc);
    const { left, top, right, bottom, layoutHeight } = viewport;
    const geometry = `${rect.left},${rect.top},${rect.right},${rect.bottom},${left},${top},${right},${bottom},${layoutHeight}`;
    if (panelResized || geometry !== lastGeometry) {
      const visibleLeft = Math.max(rect.left, left);
      const visibleRight = Math.min(rect.right, right);
      const visibleTop = Math.max(rect.top, top);
      const visibleBottom = Math.min(rect.bottom, bottom);
      // A top-layer popup can outlast its anchor when scrolling under a sticky surface.
      if (anchor.matches(':disabled') || visibleLeft >= visibleRight || visibleTop >= visibleBottom
        || !ownsHit(hitTest.elementFromPoint((visibleLeft + visibleRight) / 2, (visibleTop + visibleBottom) / 2))) {
        close();
        return;
      }

      positionOptionList(anchor, panel, view, rect, viewport, matchTriggerWidth);
      lastGeometry = geometry;
      panelResized = false;
    }
    frame = view.requestAnimationFrame(update);
  };

  const resize = new view.ResizeObserver(() => { panelResized = true; });
  resize.observe(panel, { box: 'border-box' });
  update();
  return () => {
    resize.disconnect();
    view.cancelAnimationFrame(frame);
    delete panel.dataset.positioned;
  };
}
