import type { ComponentPropsWithRef, ReactNode } from 'react';
import './navbar.css';

export interface NavbarProps extends ComponentPropsWithRef<'nav'> {
  size?: 'md' | 'lg';
  width?: 'comfortable' | 'full';
  variant?: 'default' | 'dark-green';
  brand?: ReactNode;
  actions?: ReactNode;
}

/** A site navigation landmark with a parent-sized surface and a configurable content width. */
export function Navbar({
  size = 'md', width = 'comfortable', variant = 'default', brand, actions, children, className, 'aria-label': label = 'Primary', ...props
}: NavbarProps) {
  return (
    <nav {...props} aria-label={label} className={['cr-navbar', className].filter(Boolean).join(' ')} data-width={width} data-variant={variant} data-size={size}>
      <div className="cr-navbar-inner">
        <div className="cr-navbar-brand">{brand}</div>
        <div className="cr-navbar-links">{children}</div>
        <div className="cr-navbar-actions">{actions}</div>
      </div>
    </nav>
  );
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
