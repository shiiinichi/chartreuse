import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronRight, Code2, Command, Maximize2, Menu, Minimize2, Moon, Search, Sun } from 'lucide-react';
import { Avatar, Badge, BrandMark, Button, Dialog, IconButton, Select, ToastProvider } from './system';
import { componentAliases, groups, pages, resolvePageId, snippets } from './docs/catalog';
import type { PageId } from './docs/catalog';
import { DocumentPage, Overview } from './docs/Pages';
import { CodeBlock } from './docs/shared';

const currentPage = (): PageId => resolvePageId(window.location.hash.slice(1));
type ContentWidth = 'comfortable' | 'full';
const contentWidthKey = 'chartreuse-content-width';
function readContentWidth(): ContentWidth {
  try { return localStorage.getItem(contentWidthKey) === 'full' ? 'full' : 'comfortable'; }
  catch { return 'comfortable'; }
}
const reactBadgeIcon = <svg className="react-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><circle cx={12} cy={12} r={1.7} fill="currentColor" stroke="none" /><ellipse cx={12} cy={12} rx={10} ry={4.1} /><ellipse cx={12} cy={12} rx={10} ry={4.1} transform="rotate(60 12 12)" /><ellipse cx={12} cy={12} rx={10} ry={4.1} transform="rotate(120 12 12)" /></svg>;

function DesignSystem() {
  const [pageId, setPageId] = useState<PageId>(currentPage);
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [scheme, setScheme] = useState(document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')?.content || 'light dark');
  const [contentWidth, setContentWidth] = useState<ContentWidth>(readContentWidth);
  const content = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const page = pages.find(item => item.id === pageId)!;

  const navigate = (id: PageId) => {
    const target = resolvePageId(id);
    if (window.location.hash !== `#${target}`) window.location.hash = target;
    setPageId(target); setMobileNav(false); setSearchOpen(false); setSearch('');
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.setTimeout(() => content.current?.focus({ preventScroll: true }), 0);
  };

  useEffect(() => {
    const onHash = () => { const next = currentPage(); if (componentAliases[window.location.hash.slice(1)]) window.history.replaceState(null, '', `#${next}`); setPageId(next); setMobileNav(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
    const onKeyboard = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); setSearchOpen(value => !value); }
      if (event.key === 'Escape') setMobileNav(false);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'chartreuse-scheme' || event.key === null) {
        const next = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : 'light dark';
        setScheme(next); document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')!.content = next;
      }
      if (event.key === contentWidthKey || event.key === null) setContentWidth(event.newValue === 'full' ? 'full' : 'comfortable');
    };
    window.addEventListener('hashchange', onHash); window.addEventListener('keydown', onKeyboard); window.addEventListener('storage', onStorage);
    onHash();
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('keydown', onKeyboard); window.removeEventListener('storage', onStorage); };
  }, []);
  useEffect(() => { document.title = `${page.label} · Chartreuse Design System`; }, [page.label]);
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.docs-sidebar .docs-nav');
    const selected = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !selected || !nav.clientHeight) return;
    const bounds = nav.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.top < bounds.top) nav.scrollTop += item.top - bounds.top - 4;
    else if (item.bottom > bounds.bottom) nav.scrollTop += item.bottom - bounds.bottom + 4;
  }, [pageId]);
  useEffect(() => { if (searchOpen) window.setTimeout(() => searchRef.current?.focus(), 0); }, [searchOpen]);

  const updateScheme = (value: string) => {
    setScheme(value); document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')!.content = value;
    try { if (value === 'light dark') localStorage.removeItem('chartreuse-scheme'); else localStorage.setItem('chartreuse-scheme', value); } catch {}
  };
  const updateContentWidth = (value: ContentWidth) => {
    setContentWidth(value);
    try { localStorage.setItem(contentWidthKey, value); } catch {}
  };
  const toggleScheme = () => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = scheme === 'dark' || (scheme === 'light dark' && systemDark);
    const target = isDark ? 'light' : 'dark';
    updateScheme((target === 'dark') === systemDark ? 'light dark' : target);
  };
  const results = pages.filter(item => !item.hidden && `${item.label} ${item.description} ${item.group}`.toLowerCase().includes(search.toLowerCase()));

  const navigation = <><a className="brand" href="#overview" onClick={e => { e.preventDefault(); navigate('overview'); }} aria-label="Chartreuse home"><span className="brand-symbol"><BrandMark /></span><span><strong>chartreuse</strong><small>DESIGN SYSTEM</small></span></a><button type="button" className="workspace-selector" onClick={() => setSettingsOpen(true)}><span className="workspace-icon"><Command size={16} aria-hidden="true" /></span><span>Chartreuse<small>React component library</small></span><ChevronDown size={13} aria-hidden="true" /></button><button type="button" className="sidebar-search" onClick={() => setSearchOpen(true)}><Search size={14} aria-hidden="true" /><span>Search documentation…</span><kbd>⌘ K</kbd></button><nav className="docs-nav" aria-label="Design system">{groups.map(group => <div key={group} className="nav-group"><h2>{group}</h2>{pages.filter(item => item.group === group && !item.hidden).map(({ id, label, icon: Icon, tag }) => <a key={id} href={`#${id}`} aria-current={pageId === id ? 'page' : undefined} onClick={e => { e.preventDefault(); navigate(id); }}><Icon size={15} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span>{tag && <span className="nav-tag">{tag}</span>}</a>)}</div>)}</nav><div className="sidebar-bottom"><div className="sidebar-note"><span className="cr-status-dot" /><span>Component library</span><span>v1.0.0</span></div><button type="button" onClick={() => navigate('changelog')}>Release notes<ArrowUpRight size={12} aria-hidden="true" /></button></div></>;

  return <><a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); content.current?.focus(); }}>Skip to content</a><aside className="docs-sidebar">{navigation}</aside><header className="docs-topbar"><div className="topbar-location"><IconButton className="mobile-menu-button" label="Open navigation" icon={Menu} onClick={() => setMobileNav(true)} /><BookOpen size={15} aria-hidden="true" /><nav className="documentation-breadcrumbs" aria-label="Documentation breadcrumbs"><ol><li><a href="#overview" onClick={event => { event.preventDefault(); navigate('overview'); }}>Design system</a><ChevronRight size={12} aria-hidden="true" /></li><li><a href={`#${page.id}`} aria-current="page" onClick={event => { event.preventDefault(); navigate(page.id); }}>{page.label}</a></li></ol></nav></div><div className="topbar-actions"><button className="topbar-guide" type="button" onClick={() => navigate('getting-started')}>Documentation<ArrowUpRight size={13} aria-hidden="true" /></button><Badge className="react-badge" icon={reactBadgeIcon}>React 19</Badge><span className="topbar-divider" /><IconButton className="content-width-toggle" label={contentWidth === 'full' ? 'Use comfortable content width' : 'Use full content width'} icon={contentWidth === 'full' ? Minimize2 : Maximize2} onClick={() => updateContentWidth(contentWidth === 'full' ? 'comfortable' : 'full')} /><IconButton label="View integration code" icon={Code2} onClick={() => setSourceOpen(true)} /><button type="button" className="theme-toggle" onClick={toggleScheme}><Moon className="theme-icon-dark" size={17} aria-hidden="true" /><Sun className="theme-icon-light" size={17} aria-hidden="true" /><span className="theme-label-dark sr-only">Switch to dark theme</span><span className="theme-label-light sr-only">Switch to light theme</span></button><button type="button" className="profile-button" aria-label="Open display preferences" onClick={() => setSettingsOpen(true)}><Avatar name="Sam Lee" size="sm" /></button></div></header>
    <div className="docs-body" data-content-width={contentWidth}><main className="docs-main" id="main-content" ref={content} tabIndex={-1} key={pageId}>{pageId === 'overview' ? <Overview navigate={navigate} /> : <DocumentPage page={page} navigate={navigate} />}<footer className="docs-footer"><span><BrandMark />React component library</span><span>Chartreuse<span className="footer-dot">·</span>Design system v1.0.0</span><button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); content.current?.focus({ preventScroll: true }); }}>Back to top ↑</button></footer></main></div>
    <Dialog open={mobileNav} onOpenChange={setMobileNav} title="Documentation navigation" className="mobile-navigation"><div className="mobile-navigation-content">{navigation}</div></Dialog>
    <Dialog open={searchOpen} onOpenChange={setSearchOpen} title="Search documentation" description="Search foundations, components, and patterns." className="search-dialog"><div className="search-dialog-input"><Search size={18} aria-hidden="true" /><label htmlFor="command-search" className="sr-only">Search documentation</label><input id="command-search" ref={searchRef} autoFocus value={search} placeholder="Search documentation…" autoComplete="off" onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); searchResultsRef.current?.querySelector<HTMLButtonElement>('button')?.focus(); } if (e.key === 'Enter' && !e.nativeEvent.isComposing && results[0]) navigate(results[0].id); }} /><kbd>esc</kbd></div><div className="search-results" ref={searchResultsRef} onKeyDown={event => {
      const buttons = Array.from(searchResultsRef.current?.querySelectorAll<HTMLButtonElement>('button') || []);
      const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (event.key === 'ArrowUp' && i === 0) searchRef.current?.focus(); else buttons[(i + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus(); }
    }}>{results.map(({ id, label, group, icon: Icon }) => <button type="button" key={id} onClick={() => navigate(id)}><Icon size={17} aria-hidden="true" /><span>{label}<small>{group}</small></span><ArrowRight size={14} aria-hidden="true" /></button>)}{results.length === 0 && <p>No matching pages. Try “color”, “button”, or “workspace”.</p>}</div><div className="search-hint"><span>↑ ↓ to navigate</span><span>↵ to open</span><span>esc to close</span></div></Dialog>
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen} title="Display preferences" description="Choose the documentation theme and content width." footer={<Button size="sm" icon={Check} onClick={() => setSettingsOpen(false)}>Done</Button>}><div className="stack"><Select label="Appearance" value={scheme} onChange={e => updateScheme(e.target.value)}><option value="light dark">System preference</option><option value="light">Light</option><option value="dark">Dark</option></Select><Select label="Content width" hint="Comfortable centers the content. Full uses the available area beside navigation." value={contentWidth} onChange={event => updateContentWidth(event.target.value === 'full' ? 'full' : 'comfortable')}><option value="comfortable">Comfortable (default)</option><option value="full">Full available width</option></Select><div className="settings-workspace"><span className="workspace-icon"><Command size={18} aria-hidden="true" /></span><div><strong>Chartreuse</strong><p>Component documentation</p></div><Badge tone="success" dot>Documentation</Badge></div></div></Dialog>
    <Dialog open={sourceOpen} onOpenChange={setSourceOpen} title="React integration example" description="Import components and the shared stylesheet from @chartreuse/ui." className="source-dialog"><CodeBlock code={snippets.basic} /><div className="source-dialog-footer"><Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => { setSourceOpen(false); navigate('getting-started'); }}>View the integration guide</Button></div></Dialog>
  </>;
}

export default function App() { return <ToastProvider><DesignSystem /></ToastProvider>; }
