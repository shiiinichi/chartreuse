import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { Menu, PanelRight } from 'lucide-react';
import { IconButton } from './components';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import { Sidebar } from './Sidebar';
import type { SidebarProps } from './Sidebar';
import './navbar.css';

export interface NavbarSidebarProps extends Omit<SidebarProps, 'aria-label' | 'hidden' | 'dangerouslySetInnerHTML'> {
  label: string;
  /** Toggle icon. Defaults to Menu for the left sidebar and PanelRight for the right sidebar. Shown in both states unless openToggleIcon is set. */
  toggleIcon?: IconSource;
  /** Toggle icon while the sidebar is open. */
  openToggleIcon?: IconSource;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Remembers the uncontrolled open state in localStorage under this key. */
  storageKey?: string;
}

export interface NavbarProps extends ComponentPropsWithRef<'nav'> {
  size?: 'md' | 'lg';
  width?: 'comfortable' | 'full';
  /** Layout. The legacy dark-green value can be replaced by surface="evergreen". */
  variant?: 'default' | 'dark-green' | 'workspace';
  surface?: 'white' | 'evergreen';
  brand?: ReactNode;
  actions?: ReactNode;
  workspaceContent?: ReactNode;
  workspaceProps?: Omit<ComponentPropsWithRef<'div'>, 'children' | 'dangerouslySetInnerHTML'>;
  leftSidebar?: NavbarSidebarProps;
  rightSidebar?: NavbarSidebarProps;
}

type NavbarBarProps = Omit<NavbarProps, 'workspaceContent' | 'workspaceProps' | 'leftSidebar' | 'rightSidebar'>;

/** A navigation landmark with an optional full-height workspace. */
export function Navbar({
  variant = 'default', workspaceContent, workspaceProps, leftSidebar, rightSidebar, ...props
}: NavbarProps) {
  if (variant === 'workspace') {
    return <WorkspaceNavbar {...props} workspaceContent={workspaceContent} workspaceProps={workspaceProps} leftSidebar={leftSidebar} rightSidebar={rightSidebar} />;
  }
  return <NavbarBar {...props} variant={variant} />;
}

function NavbarBar({
  size = 'md', width = 'comfortable', variant, surface, brand, actions, children, className, 'aria-label': label = 'Primary',
  leftToggle, rightToggle, ...props
}: NavbarBarProps & { leftToggle?: ReactNode; rightToggle?: ReactNode }) {
  const content = <>
    <div className="cr-navbar-brand">{brand}</div>
    <div className="cr-navbar-links">{children}</div>
    <div className="cr-navbar-actions">{actions}</div>
  </>;
  return (
    <nav {...props} aria-label={label} className={['cr-navbar', className].filter(Boolean).join(' ')} data-width={width} data-variant={variant} data-size={size} data-surface={surface}>
      <div className="cr-navbar-inner">
        {leftToggle}
        {variant === 'workspace' ? <div className="cr-navbar-content">{content}</div> : content}
        {rightToggle}
      </div>
    </nav>
  );
}

function WorkspaceNavbar({ workspaceContent, workspaceProps, leftSidebar, rightSidebar, ...props }: NavbarProps) {
  const left = useNavbarSidebar(leftSidebar, Menu, props.size, 'left');
  const right = useNavbarSidebar(rightSidebar, PanelRight, props.size, 'right');
  const center = useRef<HTMLDivElement>(null);
  const [barSize, setBarSize] = useState<number>();

  useLayoutEffect(() => {
    const bar = center.current?.firstElementChild;
    if (!bar) return;
    const measure = () => setBarSize(bar.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  const style = barSize === undefined ? workspaceProps?.style
    : { ...workspaceProps?.style, '--_cr-navbar-workspace-bar-size': `${barSize}px` } as CSSProperties;

  return <div {...workspaceProps} style={style} data-navbar-size={props.size ?? 'md'}
    className={['cr-navbar-workspace', workspaceProps?.className].filter(Boolean).join(' ')}>
    {left?.panel}
    <div className="cr-navbar-workspace-center" ref={center}>
      <NavbarBar {...props} variant="workspace" width="full" leftToggle={left?.toggle} rightToggle={right?.toggle} />
      <div className="cr-navbar-workspace-main" tabIndex={0} role="region" aria-label="Workspace content">{workspaceContent}</div>
    </div>
    {right?.panel}
  </div>;
}

const storageListeners = new Set<() => void>();

function readStoredOpen(key: string | undefined) {
  if (!key) return null;
  try {
    const value = window.localStorage.getItem(key);
    return value === 'open' ? true : value === 'closed' ? false : null;
  } catch {
    return null;
  }
}

function writeStoredOpen(key: string, open: boolean) {
  try {
    window.localStorage.setItem(key, open ? 'open' : 'closed');
  } catch {
    // Storage can be unavailable in private windows or sandboxed frames.
  }
  storageListeners.forEach(listener => listener());
}

function subscribeToStorage(listener: () => void) {
  storageListeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    storageListeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function useNavbarSidebar(sidebar: NavbarSidebarProps | undefined, defaultIcon: IconSource, size: NavbarProps['size'], side: 'left' | 'right') {
  const { label = '', toggleIcon, openToggleIcon, open, defaultOpen = false, onOpenChange, storageKey,
    id: suppliedId, header, children, onFocusCapture, onBlurCapture, ...sidebarProps } = sidebar ?? {};
  const generatedId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const focusWithin = useRef(false);
  const present = sidebar !== undefined;
  const [state, setState] = useState({ present, open: defaultOpen });
  if (state.present !== present) {
    setState({ present, open: defaultOpen });
  }
  const stored = useSyncExternalStore(subscribeToStorage, () => readStoredOpen(storageKey), () => null);
  const expanded = open ?? stored ?? state.open;
  const id = suppliedId ?? generatedId;

  useEffect(() => {
    if (expanded || !focusWithin.current) return;
    const button = trigger.current;
    const document = button?.ownerDocument;
    const active = document?.activeElement;
    if (button && (active === document?.body || document?.getElementById(id)?.contains(active ?? null))) {
      button.focus({ preventScroll: true });
    }
    focusWithin.current = false;
  }, [expanded, id]);

  if (!sidebar) return null;

  function changeOpen(next: boolean) {
    if (open === undefined) {
      setState(current => ({ ...current, open: next }));
      if (storageKey) writeStoredOpen(storageKey, next);
    }
    onOpenChange?.(next);
  }

  const toggle = <IconButton className="cr-navbar-sidebar-toggle" ref={trigger} size={size} icon={(expanded ? openToggleIcon : undefined) ?? toggleIcon ?? defaultIcon}
    label={label} title={`${expanded ? 'Hide' : 'Show'} ${label}`} aria-controls={id} aria-expanded={expanded}
    onClick={() => changeOpen(!expanded)} />;
  const panel = <Sidebar {...sidebarProps} id={id} data-side={side} aria-label={label} hidden={!expanded}
    header={<div className="cr-navbar-sidebar-header">
      <div className="cr-navbar-sidebar-heading">{header ?? label}</div>
    </div>}
    onFocusCapture={event => {
      if (event.currentTarget.contains(event.target)) focusWithin.current = true;
      onFocusCapture?.(event);
    }}
    onBlurCapture={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) focusWithin.current = false;
      onBlurCapture?.(event);
    }}>{children}</Sidebar>;

  return { toggle, panel };
}

type NavbarItemOwnProps = {
  /** Icon before the label. Inside an iconOnly NavbarItemGroup the label is visually hidden and stays the accessible name. */
  icon?: IconSource;
};

export type NavbarItemProps =
  | (ComponentPropsWithRef<'a'> & NavbarItemOwnProps & { href: string })
  | (ComponentPropsWithRef<'div'> & NavbarItemOwnProps & { href?: undefined });

export interface NavbarItemGroupProps extends ComponentPropsWithRef<'div'> {
  /** Segmented draws a rounded track with the current link filled. Default lays the items out in a row. */
  variant?: 'default' | 'segmented';
  /** Visually hides the labels of items that have an icon. Each label stays the link's accessible name and becomes its title. */
  iconOnly?: boolean;
}

const defaultContext = { iconOnly: false };
const iconOnlyContext = { iconOnly: true };
const NavbarItemGroupContext = createContext(defaultContext);

/** A row of related NavbarItem links, optionally drawn as a segmented page switcher. */
export function NavbarItemGroup({ variant = 'default', iconOnly = false, className, role, ...props }: NavbarItemGroupProps) {
  const labelled = props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined;
  return <NavbarItemGroupContext.Provider value={iconOnly ? iconOnlyContext : defaultContext}>
    <div {...props} role={role ?? (labelled ? 'group' : undefined)} className={['cr-navbar-item-group', className].filter(Boolean).join(' ')}
      data-variant={variant} data-icon-only={iconOnly || undefined} />
  </NavbarItemGroupContext.Provider>;
}

/** A native link when given a destination, or a container for custom navbar content. */
export function NavbarItem({ icon, ...props }: NavbarItemProps) {
  const { iconOnly } = useContext(NavbarItemGroupContext);
  const className = ['cr-navbar-item', props.className].filter(Boolean).join(' ');
  const iconNode = renderIcon(icon, { size: 16 });
  const children = iconNode ? <>{iconNode}<span className="cr-navbar-item-label">{props.children}</span></> : props.children;
  const title = props.title ?? (iconOnly && iconNode && typeof props.children === 'string' ? props.children : undefined);
  const shared = { className, title, 'data-icon': iconNode ? '' : undefined, children };
  if (props.href !== undefined) return <a {...props} {...shared} />;
  return <div {...props} {...shared} />;
}
