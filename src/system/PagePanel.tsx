import { useId } from 'react';
import type { ComponentPropsWithRef, FocusEvent, ReactNode } from 'react';
import { Text } from './Text';
import './page-panel.css';

export interface PagePanelProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  title: string;
  description?: ReactNode;
  leading?: ReactNode;
  headerActions?: ReactNode;
  navigation?: ReactNode;
  footer?: ReactNode;
  stickyFooter?: boolean;
  children: ReactNode;
}

const minimumStickyFooterViewportHeight = 480;

function observeFooterEdge(edge: HTMLSpanElement | null) {
  const footer = edge?.parentElement;
  const view = edge?.ownerDocument.defaultView;
  if (!edge || !footer || !view?.IntersectionObserver) return;

  const document = edge.ownerDocument;
  let scrollport: HTMLElement | null = null;
  for (let ancestor = footer.parentElement; ancestor && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
    const { display, overflowY } = view.getComputedStyle(ancestor);
    if (display === 'contents' || overflowY === 'visible' || overflowY === 'clip') continue;
    // The body's overflow can be propagated to the document viewport.
    if (ancestor !== document.body || view.getComputedStyle(document.documentElement).overflow !== 'visible') scrollport = ancestor;
    break;
  }

  // Inset the observer by one pixel so the edge leaves it as the footer docks.
  const observer = new view.IntersectionObserver(([entry]) => {
    if (entry.rootBounds && footer.hasAttribute('data-sticky')) {
      footer.toggleAttribute('data-stuck', entry.boundingClientRect.bottom > entry.rootBounds.bottom);
    }
  }, { root: scrollport ?? document, rootMargin: '0px 0px -1px' });

  const updateSticky = () => {
    const viewportHeight = document.documentElement.clientHeight;
    const availableHeight = Math.min(viewportHeight, scrollport?.clientHeight ?? viewportHeight);
    const sticky = availableHeight >= minimumStickyFooterViewportHeight;
    if (footer.hasAttribute('data-sticky') === sticky) return;

    footer.toggleAttribute('data-sticky', sticky);
    if (sticky) {
      observer.observe(edge);
    } else {
      observer.unobserve(edge);
      footer.removeAttribute('data-stuck');
    }
  };

  const resize = scrollport ? new view.ResizeObserver(updateSticky) : null;
  if (scrollport) resize?.observe(scrollport);
  view.addEventListener('resize', updateSticky);
  updateSticky();

  return () => {
    observer.disconnect();
    resize?.disconnect();
    view.removeEventListener('resize', updateSticky);
    footer.removeAttribute('data-sticky');
    footer.removeAttribute('data-stuck');
  };
}

function revealFocusedControl({ currentTarget: body, target }: FocusEvent<HTMLDivElement>) {
  const footer = body.nextElementSibling;
  if (body === target || !footer?.hasAttribute('data-sticky')) return;

  // Let the browser scroll the focused control into view before checking for overlap.
  body.ownerDocument.defaultView?.requestAnimationFrame(() => {
    if (body.ownerDocument.activeElement !== target || !footer.hasAttribute('data-sticky')) return;
    const footerBounds = footer.getBoundingClientRect();
    if (body.getBoundingClientRect().bottom <= footerBounds.top) return;

    const controlTop = target.getBoundingClientRect().top;
    if (controlTop >= footerBounds.top && controlTop < footerBounds.bottom) {
      target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    }
  });
}

/** A full-height layout surface with one scrolling body and a separate action footer. */
export function PagePanel({ title, description, leading, headerActions, navigation, footer, stickyFooter = true, children, className, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, ...props }: PagePanelProps) {
  const id = useId();
  const hasDescription = description !== undefined && description !== null && description !== false;
  return <section {...props} className={['cr-page-panel', className].filter(Boolean).join(' ')} aria-labelledby={labelledBy || `${id}-title`} aria-describedby={[describedBy, hasDescription && `${id}-description`].filter(Boolean).join(' ') || undefined}>
    <header className="cr-page-panel-header">{leading && <div className="cr-page-panel-leading">{leading}</div>}<div className="cr-page-panel-heading"><Text size="heading-2" id={`${id}-title`}>{title}</Text>{hasDescription && <div id={`${id}-description`} className="cr-page-panel-description">{description}</div>}</div>{headerActions && <div className="cr-page-panel-header-actions">{headerActions}</div>}</header>
    {navigation && <div className="cr-page-panel-navigation">{navigation}</div>}
    <div className="cr-page-panel-body" role="region" aria-label={`${title} content`} tabIndex={0} onFocusCapture={stickyFooter && footer ? revealFocusedControl : undefined}>{children}</div>
    {footer && <footer className="cr-page-panel-footer">{footer}{stickyFooter && <span className="cr-page-panel-footer-edge" ref={observeFooterEdge} aria-hidden="true" />}</footer>}
  </section>;
}
