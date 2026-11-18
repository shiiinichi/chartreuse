import { useState } from 'react';
import { Breadcrumbs, Select } from '../system/components';
import type { BreadcrumbsProps } from '../system/components';
import { Showcase } from './shared';
import './breadcrumbs-demo.css';

export function BreadcrumbsDemo() {
  const [underline, setUnderline] = useState<NonNullable<BreadcrumbsProps['underline']>>('none');
  return <Showcase title="Breadcrumb link underlining" description="Set underline to always, hover, or none. The final item remains the current page." code={`import { useState } from 'react';
import { Breadcrumbs, Select } from '@chartreuse/ui';
import type { BreadcrumbsProps } from '@chartreuse/ui';

export function BreadcrumbsExample() {
  const [underline, setUnderline] = useState<NonNullable<BreadcrumbsProps['underline']>>(${JSON.stringify(underline)});
  return <div className="breadcrumbs-demo">
    <Select label="Link underlining" value={underline}
      onChange={event => setUnderline(event.currentTarget.value as NonNullable<BreadcrumbsProps['underline']>)}>
      <option value="always">Always underline</option>
      <option value="hover">Underline on hover</option>
      <option value="none">No underline</option>
    </Select>
    <div className="breadcrumbs-demo-preview">
      <Breadcrumbs underline={underline} items={[
        { label: 'Overview', href: '#overview' },
        { label: 'Card', href: '#components/card' },
        { label: 'Breadcrumbs' },
      ]} />
    </div>
  </div>;
}

/* Example layout:
.breadcrumbs-demo { display: flex; flex-direction: column; gap: 22px; width: 100%; min-width: 0; }
.breadcrumbs-demo > .cr-field { width: 100%; max-width: 240px; }
.breadcrumbs-demo-preview { min-width: 0; padding: 23px 24px; border: 1px solid var(--cr-color-border); border-radius: var(--cr-radius-md); background: var(--cr-color-canvas); }
*/`}>
    <div className="breadcrumbs-demo">
      <Select label="Link underlining" value={underline} onChange={event => setUnderline(event.currentTarget.value as NonNullable<BreadcrumbsProps['underline']>)}><option value="always">Always underline</option><option value="hover">Underline on hover</option><option value="none">No underline</option></Select>
      <div className="breadcrumbs-demo-preview"><Breadcrumbs underline={underline} items={[{ label: 'Overview', href: '#overview' }, { label: 'Card', href: '#components/card' }, { label: 'Breadcrumbs' }]} /></div>
    </div>
  </Showcase>;
}
