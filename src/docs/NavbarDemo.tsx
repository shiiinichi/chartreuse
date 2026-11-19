import { useId, useState } from 'react';
import { Badge, BrandMark } from '../system/components';
import { Flex } from '../system/Flex';
import { Navbar, NavbarItem } from '../system/Navbar';
import type { NavbarProps } from '../system/Navbar';
import { SegmentedControl } from '../system/SegmentedControl';
import { navbarReferences } from './reference/navbar';
import { Showcase } from './shared';
import './navbar-demo.css';

const widthOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'full', label: 'Full width' },
];
const variantOptions = [
  { value: 'default', label: 'Default' },
  { value: 'dark-green', label: 'Dark green' },
];
const { importCode, usageCode } = navbarReferences[0];

export function NavbarDemo() {
  const [width, setWidth] = useState<NonNullable<NavbarProps['width']>>('comfortable');
  const [variant, setVariant] = useState<NonNullable<NavbarProps['variant']>>('dark-green');
  const id = useId();

  return (
    <Showcase title="Appearance and width" description="The preview uses a smaller width cap to show how the links align in both modes." code={`${importCode}\n\n${usageCode}`}>
      <div className="navbar-demo">
        <Flex align="end" wrap gap={4}>
          <SegmentedControl label="Appearance" name={`navbar-variant-${id}`} size="sm" options={variantOptions} value={variant}
            onValueChange={value => setVariant(value === 'dark-green' ? 'dark-green' : 'default')} />
          <SegmentedControl label="Preview width" name={`navbar-width-${id}`} size="sm" options={widthOptions} value={width}
            onValueChange={value => setWidth(value === 'full' ? 'full' : 'comfortable')} />
        </Flex>
        <Navbar width={width} variant={variant} className="navbar-demo-bar" aria-label="Example site"
          brand={<a href="#overview"><BrandMark /><span>Chartreuse</span></a>}
          actions={<a href="#getting-started">Get started</a>}>
          <Flex align="center" wrap gap={2}>
            <NavbarItem href="#components/navbar" aria-current="page">Navbar</NavbarItem>
            <NavbarItem href="#layout">Layout</NavbarItem>
            <NavbarItem href="#tokens">Tokens</NavbarItem>
          </Flex>
        </Navbar>
      </div>
    </Showcase>
  );
}

export function NavbarItemDemo() {
  return (
    <Navbar width="full" className="navbar-demo-bar" aria-label="Example pages">
      <Flex align="center" wrap gap={2}>
        <NavbarItem href="#components/navbar">Navbar</NavbarItem>
        <NavbarItem href="#components/navbar-item" aria-current="page">Navbar item</NavbarItem>
        <NavbarItem href="#layout">Layout</NavbarItem>
        <NavbarItem><Badge tone="info">Read only</Badge></NavbarItem>
      </Flex>
    </Navbar>
  );
}
