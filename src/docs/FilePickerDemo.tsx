import { useState } from 'react';
import { Files, RotateCcw } from 'lucide-react';
import { Badge, Button, Select, Switch } from '../system/components';
import { FilePicker } from '../system/FilePicker';
import { Grid, GridItem } from '../system/Grid';
import { ExampleGallery, Showcase } from './shared';
import './file-picker-demo.css';

export function FilePickerDemo() {
  const [mode, setMode] = useState<'file' | 'folder'>('file');
  const [multiple, setMultiple] = useState(true);
  const [filter, setFilter] = useState('all');
  const [files, setFiles] = useState<File[]>([]);
  const accept = filter === 'text' ? '.txt,.md,.json,.csv' : filter === 'images' ? 'image/*' : undefined;

  return <div className="file-picker-demo">
    <Grid className="file-picker-demo-options" columns={{ base: 1, sm: 2, md: 3 }} gap={4} align="end">
      <GridItem span={1}><Select label="Selection mode" value={mode} onChange={event => setMode(event.target.value as 'file' | 'folder')}><option value="file">Files</option><option value="folder">Folder</option></Select></GridItem>
      <GridItem span={1}><Select label="File type filter" value={filter} disabled={mode === 'folder'} onChange={event => setFilter(event.target.value)}><option value="all">All files</option><option value="text">Text and data files</option><option value="images">Images</option></Select></GridItem>
      <GridItem span={1}><Switch label="Allow multiple files" checked={multiple} disabled={mode === 'folder'} onChange={event => setMultiple(event.target.checked)} /></GridItem>
    </Grid>
    <ExampleGallery maxColumns={1}>
    <Showcase span="full" title={mode === 'folder' ? 'Folder files and relative paths' : 'File selection and metadata'} description="Inspect browser-provided file metadata and reset the native selection." code={`import { useState } from 'react';
import { Files, RotateCcw } from 'lucide-react';
import { Badge, Button, FilePicker } from '@chartreuse/ui';

export function FileSelectionExample() {
  const [files, setFiles] = useState<File[]>([]);
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      onSubmit={event => event.preventDefault()}>
      <FilePicker label=${JSON.stringify(mode === 'folder' ? 'Working folder' : 'Attachments')}
              mode=${JSON.stringify(mode)} name=${JSON.stringify(mode === 'folder' ? 'folderFiles' : 'attachments')}${mode === 'file' ? `
              multiple={${multiple}}${accept ? ` accept=${JSON.stringify(accept)}` : ''}` : ''}
              hint=${JSON.stringify(mode === 'folder' ? 'Select a folder to list its files.' : 'Select files to inspect their metadata.')}
              onFilesChange={setFiles} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span>Selected files remain local to this example.</span>
        <Button type="reset" variant="secondary" size="sm" icon={RotateCcw}>Reset selection</Button>
      </div>
    </form>
    <section aria-label="Selected file metadata">
        <h3><Files size={14} aria-hidden="true" /> Selected file metadata</h3>
        <Badge>{files.length} {files.length === 1 ? 'file' : 'files'}</Badge>
        {files.length ? <div role="region" aria-label="Selected file metadata" tabIndex={0}
          style={{ overflow: 'auto', maxBlockSize: 360 }}>
          <table>
            <thead><tr><th>Name and relative path</th><th>Size</th><th>Type</th></tr></thead>
            <tbody>{files.slice(0, 20).map((file, index) => <tr key={index}>
              <td><strong>{file.name}</strong><br /><code>{file.webkitRelativePath || 'No folder-relative path'}</code></td>
              <td>{file.size.toLocaleString()} B</td><td>{file.type || 'Unspecified'}</td>
            </tr>)}</tbody>
          </table>
          {files.length > 20 && <p>{files.length - 20} more files selected.</p>}
        </div> : <p>Select files or a folder to display names, sizes, MIME types, and relative paths.</p>}
    </section>
  </div>;
}`}>
      <div className="file-picker-demo-preview">
          <form className="file-picker-demo-form" aria-label="File picker example" onSubmit={event => event.preventDefault()}>
            <FilePicker label={mode === 'folder' ? 'Working folder' : 'Attachments'} mode={mode} name={mode === 'folder' ? 'folderFiles' : 'attachments'} multiple={multiple} accept={accept} hint={mode === 'folder' ? 'Select a folder to list its files.' : 'Select files to inspect their metadata.'} onFilesChange={setFiles} />
            <div className="file-picker-demo-reset">
              <span>Selected files remain local to this example.</span>
              <Button type="reset" variant="secondary" size="sm" icon={RotateCcw}>Reset selection</Button>
            </div>
          </form>
          <section className="file-picker-demo-metadata"><header><h3><Files size={14} aria-hidden="true" />Selected file metadata</h3><Badge>{files.length} {files.length === 1 ? 'file' : 'files'}</Badge></header>{files.length ? <div className="file-picker-demo-table" role="region" aria-label="Selected file metadata" tabIndex={0}><table><thead><tr><th>Name and relative path</th><th>Size</th><th>Type</th></tr></thead><tbody>{files.slice(0, 20).map((file, index) => <tr key={`${file.webkitRelativePath || file.name}-${index}`}><td><strong>{file.name}</strong><code>{file.webkitRelativePath || 'No folder-relative path'}</code></td><td>{file.size.toLocaleString()} B</td><td>{file.type || 'Unspecified'}</td></tr>)}</tbody></table>{files.length > 20 && <p>{files.length - 20} more files selected.</p>}</div> : <p className="file-picker-demo-empty">Select files or a folder to display names, sizes, MIME types, and relative paths.</p>}</section>
      </div>
    </Showcase>
    </ExampleGallery>
    <p className="file-picker-demo-note">File selection is local to this example. The browser supplies file names and folder-relative paths. Absolute filesystem paths are unavailable. Folder selection returns files; empty folders do not produce file entries. <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory" target="_blank" rel="noopener noreferrer">Directory input reference ↗</a></p>
  </div>;
}
