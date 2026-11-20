import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Progress, Switch } from '../system/components';
import { Showcase } from './shared';
import { Text } from '../system';
import './ProgressDemo.css';

const modelWindow = 828400;
const initialContext = 31797;
const formatNumber = new Intl.NumberFormat('en-US');

export function ProgressDemo() {
  const [context, setContext] = useState(initialContext);
  const [showLabel, setShowLabel] = useState(true);
  const [showValue, setShowValue] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const percentage = Math.round(context / modelWindow * 100);
  return <Showcase title="Context token usage" description="Use value and max for the reported context size and model window. Toggle optional labels and supporting text." code={`import { Progress } from '@chartreuse/ui';\n\n<Progress\n  value={${context}}\n  max={${modelWindow}}\n  label="Last reported context"\n  showLabel={${showLabel}}${showValue ? `\n  valueText=${JSON.stringify(`${formatNumber.format(context)} / ${formatNumber.format(modelWindow)} tokens`)}` : ''}${showDescription ? `\n  description=${JSON.stringify(`${percentage}% of the reported model window. Context is separate from accumulated token usage.`)}` : ''}\n/>`}><div className="progress-demo">
    <div className="progress-demo-options"><Switch label="Show label" checked={showLabel} onChange={event => setShowLabel(event.target.checked)} /><Switch label="Show value text" checked={showValue} onChange={event => setShowValue(event.target.checked)} /><Switch label="Show description" checked={showDescription} onChange={event => setShowDescription(event.target.checked)} /></div>
    <div className="progress-demo-context"><Progress value={context} max={modelWindow} label="Last reported context" showLabel={showLabel} valueText={showValue ? `${formatNumber.format(context)} / ${formatNumber.format(modelWindow)} tokens` : undefined} aria-valuetext={`${formatNumber.format(context)} of ${formatNumber.format(modelWindow)} tokens`} description={showDescription ? `${percentage}% of the reported model window. Context is separate from accumulated token usage.` : undefined} /></div>
    <div className="progress-demo-controls"><label className="reference-range">Reported context<input type="range" min="0" max={modelWindow} step="1" value={context} onChange={event => setContext(Number(event.target.value))} /></label><Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => setContext(initialContext)}>Reset value</Button></div>
    <Text size="body" className="progress-demo-note">value and max set the native progress value. The caller provides labels, formatted values, units, and description.</Text>
  </div></Showcase>;
}
