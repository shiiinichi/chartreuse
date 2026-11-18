import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowUp, CheckCheck, Clock3, Plus } from 'lucide-react';
import { Button, Card, Select, Switch } from '../system/components';
import { GridItem } from '../system/Grid';
import type { GridGap, GridResponsive } from '../system/Grid';
import { Slider } from '../system/Slider';
import { Stat } from '../system/Stat';
import { StatGroup } from '../system/StatGroup';
import { ExampleGallery, Showcase } from './shared';
import './stat-demo.css';

export function StatDemo() {
  const [processed, setProcessed] = useState(12893);
  const [locale, setLocale] = useState('en-US');
  const [precision, setPrecision] = useState('2');
  const [useGrouping, setUseGrouping] = useState(true);
  const [customSeparators, setCustomSeparators] = useState(false);
  const [loading, setLoading] = useState(true);
  const digits = precision === 'auto' ? undefined : Number(precision);
  return <ExampleGallery className="stat-demo">
    <Showcase title="Labels, values, and units" description="Stat renders label/value pairs with optional units, icons, descriptions, and actions." code={`import { useState } from 'react';\nimport { CheckCheck, Clock3, Plus } from 'lucide-react';\nimport { Stat, StatGroup, Button } from '@chartreuse/ui';\n\nfunction SummaryExample() {\n  const [processed, setProcessed] = useState(${processed});\n  return <StatGroup aria-label="Illustrative run summary">\n    <Stat label="Items processed" value={processed} icon={CheckCheck}\n      description="Sample total stored in local state."\n      action={<Button variant="secondary" size="sm" icon={Plus}\n        onClick={() => setProcessed(value => value + 100)}>\n        Add 100 example items\n      </Button>} />\n    <Stat label="Review coverage" value={93} suffix="/ 100"\n      description="Completed reviews out of the sample total." />\n    <Stat label="Run duration" value={42.125} precision={2}\n      icon={Clock3} suffix="s" description="Shown to two decimal places." />\n  </StatGroup>;\n}`}>
      <StatGroup aria-label="Illustrative run summary">
        <Stat label="Items processed" value={processed} icon={CheckCheck} description="Sample total stored in local state." action={<Button variant="secondary" size="sm" icon={Plus} onClick={() => setProcessed(value => value + 100)}>Add 100 example items</Button>} />
        <Stat label="Review coverage" value={93} suffix="/ 100" description="Completed reviews out of the sample total." />
        <Stat label="Run duration" value={42.125} precision={2} icon={Clock3} suffix="s" description="Shown to two decimal places." />
      </StatGroup>
    </Showcase>
    <Showcase title="Number formatting" description="Numeric values use locale-aware formatting. Strings and formatter output render as supplied." code={`import { Stat, StatGroup } from '@chartreuse/ui';\n\n<StatGroup aria-label="Number formatting examples">\n  <Stat label="Sample budget (USD)" value={112893.5} prefix="$"\n    locale=${JSON.stringify(locale)}${digits === undefined ? '' : ` precision={${digits}}`} useGrouping={${useGrouping}}${customSeparators ? '\n    groupSeparator=" " decimalSeparator="·"' : ''}\n    description="Static example. No currency conversion is applied." />\n  <Stat label="Preformatted reference" value="003 / 012" precision={2}\n    description="Strings render without numeric formatting." />\n  <Stat label="Custom batch label" value={24}\n    formatter={value => <span className="stat-demo-reference">\n      TASK-{String(value).padStart(3, '0')}\n    </span>} description="The formatter receives the original value." />\n</StatGroup>`}>
      <div className="stat-demo-stack"><div className="stat-demo-options">
        <Select label="Number locale" value={locale} onChange={event => setLocale(event.target.value)}><option value="en-US">English (US)</option><option value="de-DE">German (Germany)</option><option value="hi-IN">Hindi (India)</option></Select>
        <Select label="Fraction digits" value={precision} onChange={event => setPrecision(event.target.value)}><option value="auto">Preserve digits</option><option value="0">0</option><option value="2">2</option><option value="4">4</option></Select>
        <Switch label="Digit grouping" checked={useGrouping} onChange={event => setUseGrouping(event.target.checked)} />
        <Switch label="Custom separators" checked={customSeparators} onChange={event => setCustomSeparators(event.target.checked)} hint="Space between groups; · before fractions." />
      </div><StatGroup aria-label="Number formatting examples">
        <Stat label="Sample budget (USD)" value={112893.5} prefix="$" locale={locale} precision={digits} useGrouping={useGrouping} groupSeparator={customSeparators ? ' ' : undefined} decimalSeparator={customSeparators ? '·' : undefined} description="Static example. No currency conversion is applied." />
        <Stat label="Preformatted reference" value="003 / 012" precision={2} description="Strings render without numeric formatting." />
        <Stat label="Custom batch label" value={24} formatter={value => <span className="stat-demo-reference">TASK-{String(value).padStart(3, '0')}</span>} description="The formatter receives the original value." />
      </StatGroup></div>
    </Showcase>
    <Showcase title="Cards and loading state" description="Wrap Stat in a Card to add surface styling. Loading replaces the value with a placeholder." code={`import { useState } from 'react';\nimport { ArrowUp } from 'lucide-react';\nimport { Stat, StatGroup, Card, Switch } from '@chartreuse/ui';\n\nfunction CardExample() {\n  const [loading, setLoading] = useState(${loading});\n  return <div className="stat-demo-stack">\n    <Switch label="Show loading state" checked={loading}\n      onChange={event => setLoading(event.target.checked)} />\n    <StatGroup columns={{ base: 1, sm: 2 }} aria-label="Card examples">\n      <Card className="stat-demo-card">\n        <Stat label="Example change" value={11.28} precision={2}\n          suffix="%" tone="success" icon={ArrowUp}\n          description="An increase of 11.28% in this static example." />\n      </Card>\n      <Card className="stat-demo-card">\n        <Stat label="Items awaiting review" value={9} loading={loading}\n          description="A local loading preview; no request is sent." />\n      </Card>\n    </StatGroup>\n  </div>;\n}\n\n// The example card uses padding: var(--cr-space-6).`}>
      <div className="stat-demo-stack"><Switch label="Show loading state" checked={loading} onChange={event => setLoading(event.target.checked)} /><StatGroup columns={{ base: 1, sm: 2 }} aria-label="Card examples">
        <Card className="stat-demo-card"><Stat label="Example change" value={11.28} precision={2} suffix="%" tone="success" icon={ArrowUp} description="An increase of 11.28% in this static example." /></Card>
        <Card className="stat-demo-card"><Stat label="Items awaiting review" value={9} loading={loading} description="A local loading preview; no request is sent." /></Card>
      </StatGroup></div>
    </Showcase>
  </ExampleGallery>;
}

const columnRecipes: Record<string, GridResponsive<number>> = { standard: { base: 1, sm: 2, md: 3 }, four: { base: 1, sm: 2, md: 4 }, two: 2 };

export function StatGroupDemo() {
  const [width, setWidth] = useState(960);
  const [recipe, setRecipe] = useState('standard');
  const [gap, setGap] = useState<GridGap>(6);
  const [completed, setCompleted] = useState(96);
  const columns = columnRecipes[recipe];
  return <ExampleGallery className="stat-demo stat-group-gallery">
    <Showcase title="Columns based on container width" description="StatGroup uses Grid container breakpoints and spacing tokens to control its columns and gaps." code={`import type { CSSProperties } from 'react';\nimport { Stat, StatGroup } from '@chartreuse/ui';\n\n<div className="stat-demo-container"\n  style={{ '--stat-demo-container-width': '${width}px' } as CSSProperties}>\n  <StatGroup aria-label="Workspace sample totals"\n    columns={${JSON.stringify(columns)}} gap={${gap}}>\n    <Stat label="Workspaces" value={8} />\n    <Stat label="Active agents" value={12} />\n    <Stat label="Queued tasks" value={24} />\n    <Stat label="Needs review" value={3} />\n  </StatGroup>\n</div>\n\n// .stat-demo-container: width var(--stat-demo-container-width),\n// max-width 100%, box-sizing border-box, 24px padding, 1px border.`}>
      <div className="stat-demo-stack"><div className="stat-demo-options">
        <Slider label="Preview width" min={280} max={960} step={20} value={width} onValueChange={setWidth} formatValue={value => `${value}px`} hint="The frame also fits the available page width." />
        <Select label="Columns" value={recipe} onChange={event => setRecipe(event.target.value)}><option value="standard">1 / 2 / 3 columns</option><option value="four">1 / 2 / 4 columns</option><option value="two">Always 2 columns</option></Select>
        <Select label="Gap token" value={String(gap)} onChange={event => setGap(Number(event.target.value) as GridGap)}><option value="4">space-4 · 16px</option><option value="6">space-6 · 24px</option><option value="8">space-8 · 32px</option></Select>
      </div><div className="stat-demo-container" style={{ '--stat-demo-container-width': `${width}px` } as CSSProperties}><StatGroup aria-label="Workspace sample totals" columns={columns} gap={gap}>
        <Stat label="Workspaces" value={8} /><Stat label="Active agents" value={12} /><Stat label="Queued tasks" value={24} /><Stat label="Needs review" value={3} />
      </StatGroup></div><p className="stat-demo-caption">Default columns are 1 below 480px, 2 from 480px, and 3 from 768px of the group’s own width. Gap values select the same spacing tokens as Grid.</p></div>
    </Showcase>
    <Showcase title="Cards and column spans" description="Wrap a direct child in GridItem to set its column span." code={`import { useState } from 'react';\nimport { Plus } from 'lucide-react';\nimport { Stat, StatGroup, GridItem, Card, Button } from '@chartreuse/ui';\n\nfunction SpanningExample() {\n  const [completed, setCompleted] = useState(${completed});\n  return <StatGroup columns={{ base: 1, sm: 2, md: 4 }}\n    aria-label="Illustrative task summary">\n    <GridItem span={{ base: 'full', md: 2 }}>\n      <Card className="stat-demo-card">\n        <Stat label="Completed tasks" value={completed} tone="success"\n          description="This card occupies two of four tracks at the medium tier."\n          action={<Button variant="secondary" size="sm" icon={Plus}\n            onClick={() => setCompleted(value => value + 1)}>\n            Increment completed count\n          </Button>} />\n      </Card>\n    </GridItem>\n    <Card className="stat-demo-card">\n      <Stat label="In review" value={12} description="Tasks awaiting review." />\n    </Card>\n    <Card className="stat-demo-card">\n      <Stat label="Queued" value={24} description="Tasks waiting to start." />\n    </Card>\n  </StatGroup>;\n}\n\n// Example cards use 24px padding and height: 100%.`}>
      <StatGroup columns={{ base: 1, sm: 2, md: 4 }} aria-label="Illustrative task summary"><GridItem span={{ base: 'full', md: 2 }}><Card className="stat-demo-card"><Stat label="Completed tasks" value={completed} tone="success" description="This card occupies two of four tracks at the medium tier." action={<Button variant="secondary" size="sm" icon={Plus} onClick={() => setCompleted(value => value + 1)}>Increment completed count</Button>} /></Card></GridItem><Card className="stat-demo-card"><Stat label="In review" value={12} description="Tasks awaiting review." /></Card><Card className="stat-demo-card"><Stat label="Queued" value={24} description="Tasks waiting to start." /></Card></StatGroup>
    </Showcase>
  </ExampleGallery>;
}
