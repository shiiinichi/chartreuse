import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Badge, Button, Select, Switch } from '../system/components';
import { PathSelector } from '../system/PathSelector';
import { ExampleGallery, Showcase } from './shared';
import './path-selector-demo.css';

export function PathSelectorDemo() {
  const [mode, setMode] = useState<'file' | 'folder'>('folder');
  const [result, setResult] = useState('choose');
  const [connected, setConnected] = useState(true);
  const [path, setPath] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  return <div className="path-selector-demo">
    <div className="path-selector-demo-options"><Select label="Path type" value={mode} onChange={event => setMode(event.target.value as 'file' | 'folder')}><option value="folder">Folder path</option><option value="file">File path</option></Select><Select label="Simulated response" value={result} disabled={!connected} onChange={event => setResult(event.target.value)}><option value="choose">Choose sample path</option><option value="cancel">Cancel selection</option><option value="fail">Picker error</option></Select><Switch label="Connect sample adapter" checked={connected} onChange={event => setConnected(event.target.checked)} /></div>
    <div className="path-selector-demo-adapter"><Badge tone="info">Simulated adapter</Badge><span>Browse returns an example path string without accessing the filesystem.</span></div>
    <ExampleGallery className="path-selector-example-gallery">
    <Showcase title="Editable paths with a browse adapter" description="Type or paste a path, or use the simulated browse adapter." code={`import { useState } from 'react';\nimport { PathSelector, Button } from '@chartreuse/ui';\n\nfunction PathExample() {\n  const [path, setPath] = useState(${JSON.stringify(path)});\n  return <form onSubmit={event => {\n    event.preventDefault();\n    console.log(new FormData(event.currentTarget).get('selectedPath'));\n  }}>\n    <PathSelector label=${JSON.stringify(mode === 'folder' ? 'Folder path' : 'File path')}\n      mode=${JSON.stringify(mode)} name="selectedPath" required\n      value={path} onValueChange={setPath}${connected ? `\n      onBrowse={async mode => {\n        // Simulated adapter for this example.${result === 'cancel' ? '\n        return null;' : result === 'fail' ? "\n        throw new Error('The simulated picker could not complete. Your path is unchanged.');" : "\n        return mode === 'folder' ? '/projects/sample-app' : '/projects/sample-app/notes.md';"}\n      }}` : ''} />\n    <Button type="reset" variant="secondary">Reset path</Button>\n    <Button type="submit">Use path</Button>\n  </form>;\n}`}><form aria-label="Path selector example" className="path-selector-demo-form" onSubmit={event => { event.preventDefault(); setSubmitted(String(new FormData(event.currentTarget).get('selectedPath') ?? '')); }} onReset={() => setSubmitted(null)}>
      <PathSelector label={mode === 'folder' ? 'Folder path' : 'File path'} name="selectedPath" mode={mode} value={path} onValueChange={setPath} required hint={connected ? 'Type a path or try the simulated Browse action.' : 'Type or paste a path. No browse adapter is connected.'} onBrowse={connected ? async selectedMode => {
        await new Promise(resolve => window.setTimeout(resolve, 650));
        if (result === 'cancel') return null;
        if (result === 'fail') throw new Error('The simulated picker could not complete. Your path is unchanged.');
        return selectedMode === 'folder' ? '/projects/sample-app' : '/projects/sample-app/notes.md';
      } : undefined} />
      <div className="path-selector-demo-actions"><Button type="reset" variant="secondary" size="sm" icon={RotateCcw}>Reset path</Button><Button type="submit" size="sm" icon={Check}>Use path</Button></div>
    </form>
    <div className="path-selector-demo-submitted"><strong>Submitted path</strong>{submitted === null ? <p>A path submitted from the example form appears here.</p> : <code>{submitted}</code>}</div></Showcase>
    <Showcase title="Manual entry" description="A path field with no browse adapter." code={`import { PathSelector } from '@chartreuse/ui';\n\n<PathSelector label="Manual path" name="manualPath"\n  defaultValue={${JSON.stringify('C:\\Projects\\sample-project')}}\n  hint="Type or paste a path; no browse adapter is connected." />`}><PathSelector label="Manual path" name="manualPath" defaultValue={'C:\\Projects\\sample-project'} hint="Type or paste a path; no browse adapter is connected." /></Showcase>
    </ExampleGallery>
    <p className="path-selector-demo-note">PathSelector only stores a string. It does not read files, normalize paths, or check whether a location exists. Supply onBrowse from your desktop, native, or backend picker when your application has one.</p>
  </div>;
}
