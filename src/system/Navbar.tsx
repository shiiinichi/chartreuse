import { useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react';
import { PanelLeft, PanelRight, Pin } from 'lucide-react';
import { IconButton } from './components';
import type { IconSource } from './icons';
import { Sidebar } from './Sidebar';
import type { SidebarProps } from './Sidebar';
import './navbar.css';

export interface NavbarSidebarProps extends Omit<SidebarProps, 'aria-label' | 'hidden' | 'dangerouslySetInnerHTML'> {
  label: string;
  toggleIcon?: IconSource;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  pinned?: boolean;
  defaultPinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
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
  const left = useNavbarSidebar(leftSidebar, PanelLeft, props.size, 'left');
  const right = useNavbarSidebar(rightSidebar, PanelRight, props.size, 'right');

  return <div {...workspaceProps} className={['cr-navbar-workspace', workspaceProps?.className].filter(Boolean).join(' ')}>
    {left?.panel}
    <div className="cr-navbar-workspace-center">
      <NavbarBar {...props} variant="workspace" width="full" leftToggle={left?.toggle} rightToggle={right?.toggle} />
      <div className="cr-navbar-workspace-main" tabIndex={0} role="region" aria-label="Workspace content" onClick={event => {
        if (!event.currentTarget.contains(event.target as Node)) return;
        left?.dismiss();
        right?.dismiss();
      }}>{workspaceContent}</div>
    </div>
    {right?.panel}
  </div>;
}

function useNavbarSidebar(sidebar: NavbarSidebarProps | undefined, defaultIcon: IconSource, size: NavbarProps['size'], side: 'left' | 'right') {
  const { label = '', toggleIcon, open, defaultOpen = false, onOpenChange, pinned: controlledPinned, defaultPinned = false, onPinnedChange,
    id: suppliedId, header, children, onKeyDown, onFocusCapture, onBlurCapture, ...sidebarProps } = sidebar ?? {};
  const generatedId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const focusWithin = useRef(false);
  const present = sidebar !== undefined;
  const [state, setState] = useState({ present, open: defaultOpen, pinned: defaultPinned });
  if (state.present !== present) {
    setState({ present, open: defaultOpen, pinned: defaultPinned });
  }
  const expanded = open ?? state.open;
  const pinned = controlledPinned ?? state.pinned;
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
    if (open === undefined) setState(current => ({ ...current, open: next }));
    onOpenChange?.(next);
  }

  function dismiss() {
    if (!expanded || pinned) return false;
    changeOpen(false);
    return true;
  }

  function dismissOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape' || event.defaultPrevented || event.nativeEvent.isComposing || !dismiss()) return;
    event.preventDefault();
    event.stopPropagation();
  }

  const toggle = <IconButton className="cr-navbar-sidebar-toggle" ref={trigger} size={size} icon={toggleIcon ?? defaultIcon}
    label={label} title={`${expanded ? 'Hide' : 'Show'} ${label}`} aria-controls={id} aria-expanded={expanded}
    onClick={() => changeOpen(!expanded)} onKeyDown={dismissOnEscape} />;
  const panel = <Sidebar {...sidebarProps} id={id} data-side={side} aria-label={label} hidden={!expanded}
    header={<div className="cr-navbar-sidebar-header">
      <div className="cr-navbar-sidebar-heading">{header ?? label}</div>
      <IconButton className="cr-navbar-sidebar-pin" size="sm" icon={Pin} label={`Pin ${label}`} title={`${pinned ? 'Unpin' : 'Pin'} ${label}`}
        aria-pressed={pinned} onClick={() => {
          if (controlledPinned === undefined) setState(current => ({ ...current, pinned: !pinned }));
          onPinnedChange?.(!pinned);
        }} />
    </div>}
    onFocusCapture={event => {
      if (event.currentTarget.contains(event.target)) focusWithin.current = true;
      onFocusCapture?.(event);
    }}
    onBlurCapture={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) focusWithin.current = false;
      onBlurCapture?.(event);
    }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (event.currentTarget.contains(event.target as Node)) dismissOnEscape(event);
    }}>{children}</Sidebar>;

  return { toggle, panel, dismiss };
}

export type NavbarItemProps =
  | (ComponentPropsWithRef<'a'> & { href: string })
  | (ComponentPropsWithRef<'div'> & { href?: undefined });

/** A native link when given a destination, or a container for custom navbar content. */
export function NavbarItem(props: NavbarItemProps) {
  const className = ['cr-navbar-item', props.className].filter(Boolean).join(' ');
  if (props.href !== undefined) return <a {...props} className={className} />;
  return <div {...props} className={className} />;
}
