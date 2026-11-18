import { useState } from 'react';
import { Button } from '../../system/components';
import { FilePicker } from '../../system/FilePicker';
import { MasonryItem } from '../../system/Masonry';
import { FilePickerDemo } from '../FilePickerDemo';
import { ExampleGallery, FormActions, FormScenario, ScenarioForm, formCode } from './shared';

function FileForm() {
  const [saved, setSaved] = useState<string[] | null>(null);
  return <FormScenario title="File names from FormData" description="Display selected file names from FormData in local state."
    code={formCode("FilePicker, Button", `export function EvidenceFormExample() {
  const [saved, setSaved] = useState<string[] | null>(null);
  return <form onReset={() => setSaved(null)} onSubmit={event => {
    event.preventDefault();
    const files = new FormData(event.currentTarget).getAll('evidence');
    setSaved(files.filter((entry): entry is File => entry instanceof File && !!entry.name)
      .map(file => file.name));
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FilePicker label="Review evidence" name="evidence" multiple accept=".md,.txt,.pdf" hint="Select Markdown, text, or PDF files." />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button type="submit">Read file names</Button>
        <Button type="reset" variant="secondary">Reset evidence</Button>
      </div>
      <p role="status" style={{ margin: 0 }}>{saved === null ? 'No file names read.'
        : 'Selected file names: ' + (saved.join(', ') || 'none')}</p>
    </div>
  </form>;
}`, 'useState')}>
    <ScenarioForm className="form-scenario-form" aria-label="File metadata form example" onReset={() => setSaved(null)} onSubmit={event => { event.preventDefault(); const files = new FormData(event.currentTarget).getAll('evidence'); setSaved(files.filter((entry): entry is File => entry instanceof File && !!entry.name).map(file => file.name)); }}>
      <FilePicker label="Review evidence" name="evidence" multiple accept=".md,.txt,.pdf" hint="Select Markdown, text, or PDF files." />
      <FormActions><Button type="submit">Read file names</Button><Button type="reset" variant="secondary">Reset evidence</Button></FormActions>
      <p className="form-scenario-feedback" role="status">{saved === null ? 'No file names read.' : 'Selected file names: ' + (saved.join(', ') || 'none')}</p>
    </ScenarioForm>
  </FormScenario>;
}

export function FilePickerScenarios() {
  return <ExampleGallery className="form-scenarios" maxColumns={4}>
    <FormScenario title="Single-file selection" description="Use accept to suggest Markdown, text, and PDF files in the native chooser."
      code={formCode('FilePicker', `<FilePicker label="Reference document" name="referenceDocument"
  accept=".md,.txt,.pdf"
  hint="Select one Markdown, text, or PDF file." />`)}>
      <FilePicker label="Reference document" name="referenceDocument" accept=".md,.txt,.pdf" hint="Select one Markdown, text, or PDF file." />
    </FormScenario>
    <FormScenario title="Folder selection" description="List the folder’s file entries using browser-provided relative paths."
      code={formCode('FilePicker', `<FilePicker label="Project folder" name="projectFolder" mode="folder"
  hint="Selected files include paths relative to the chosen folder." />`)}>
      <FilePicker label="Project folder" name="projectFolder" mode="folder" hint="Selected files include paths relative to the chosen folder." />
    </FormScenario>
    <FileForm />
    <FormScenario title="Disabled file picker" description="Prevent the native chooser from opening and exclude the field from form submission."
      code={formCode('FilePicker', `<FilePicker label="Managed attachments" name="managedAttachments"
  multiple disabled hint="Attachments are disabled for this workspace." />`)}>
      <FilePicker label="Managed attachments" name="managedAttachments" multiple disabled hint="Attachments are disabled for this workspace." />
    </FormScenario>
    <MasonryItem span="full"><FilePickerDemo /></MasonryItem>
  </ExampleGallery>;
}
