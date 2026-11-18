import { useId, useState } from 'react';
import { Disclosure } from '../system/Disclosure';
import { Switch } from '../system/components';
import { ExampleGallery, Showcase } from './shared';
import { GuidanceNotes } from './GuidanceNotes';
import { componentReferences } from './reference';
import './DisclosurePage.css';

export function DisclosurePage({ showGuidance = true }: { showGuidance?: boolean } = {}) {
  const groupId = useId();
  const [exclusive, setExclusive] = useState(false);
  const groupName = exclusive ? `workspace-help-${groupId}` : undefined;
  return <>
    <p className="disclosure-page-intro">Disclosure renders native details and summary elements for collapsible content. Use defaultOpen for the initial state and name for an exclusive group.</p>
    <ExampleGallery className="disclosure-page-examples">
    <Showcase title="Initially expanded disclosure" description="defaultOpen expands the content on initial render. The summary toggles its visibility." code={`<Disclosure title="Hook coverage and limits" defaultOpen>\n  <p>Direct file tools, patches, directory and search tools,\n    and literal paths in common shell commands. Matching\n    messages are combined; any matching block rule denies\n    the request.</p>\n  <p>Variables, arbitrary scripts, and files opened internally\n    by other tools cannot be inspected by these hooks.\n    Filesystem isolation is controlled by the host.</p>\n</Disclosure>`}>
      <div className="disclosure-example"><Disclosure title="Hook coverage and limits" defaultOpen><p>Direct file tools, patches, directory and search tools, and literal paths in common shell commands. Matching messages are combined; any matching block rule denies the request.</p><p>Variables, arbitrary scripts, and files opened internally by other tools cannot be inspected by these hooks. Filesystem isolation is controlled by the host.</p></Disclosure></div>
    </Showcase>

    <Showcase title="Independent and exclusive disclosure groups" description="Omit name to allow multiple open disclosures. A shared name requests native exclusive grouping." toolbar={<Switch label="One open at a time" checked={exclusive} onChange={event => setExclusive(event.target.checked)} />} code={"import { useId, useState } from 'react';\nimport { Disclosure, Switch } from '@chartreuse/ui';\n\nfunction WorkspaceQuestions() {\n  const id = useId();\n  const [exclusive, setExclusive] = useState(false);\n  const groupName = exclusive ? `workspace-help-${id}` : undefined;\n  return <>\n    <Switch label=\"One open at a time\" checked={exclusive}\n      onChange={event => setExclusive(event.target.checked)} />\n    <div className=\"cr-disclosure-group\" role=\"group\" aria-label=\"Disclosure behavior examples\">\n      <Disclosure title=\"How is the initial state set?\" name={groupName} defaultOpen>\n        <p>defaultOpen sets the initial expanded state. Later toggles update the disclosure state without changing this prop.</p>\n        <p>Place links and buttons in the content so the summary remains a single toggle target.</p>\n      </Disclosure>\n      <Disclosure title=\"How is expanded content rendered?\" name={groupName}>\n        <p>Children remain inside the native details element. The browser controls their visibility when the summary is toggled.</p>\n      </Disclosure>\n      <Disclosure title=\"How does exclusive grouping work?\" name={groupName}>\n        <p>The switch supplies the same name to every disclosure. Opening one member of the named group closes the previously open member.</p>\n      </Disclosure>\n    </div>\n  </>;\n}"}>
      <div className="disclosure-example cr-disclosure-group" role="group" aria-label="Disclosure behavior examples"><Disclosure title="How is the initial state set?" name={groupName} defaultOpen><p>defaultOpen sets the initial expanded state. Later toggles update the disclosure state without changing this prop.</p><p>Place links and buttons in the content so the summary remains a single toggle target.</p></Disclosure><Disclosure title="How is expanded content rendered?" name={groupName}><p>Children remain inside the native details element. The browser controls their visibility when the summary is toggled.</p></Disclosure><Disclosure title="How does exclusive grouping work?" name={groupName}><p>The switch supplies the same name to every disclosure. Opening one member of the named group closes the previously open member.</p></Disclosure></div>
    </Showcase>

    <Showcase title="Highlight only the expanded header" description="headerHighlight=open applies the header background while expanded and retains hover feedback while collapsed." code={`import { Disclosure } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';\n\n<Disclosure title="Open-state header highlight" headerHighlight="open" defaultOpen>\n  <p>The header remains highlighted while expanded.\n    Collapse it to restore hover-only feedback.</p>\n</Disclosure>`}>
      <div className="disclosure-example"><Disclosure title="Open-state header highlight" headerHighlight="open" defaultOpen><p>The header remains highlighted while expanded. Collapse it to restore hover-only feedback.</p></Disclosure></div>
    </Showcase>

    <Showcase title="Highlight the header in both states" description="headerHighlight=always applies the header background in both states without changing the content surface." code={`import { Disclosure } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';\n\n<Disclosure title="Persistent header highlight" headerHighlight="always">\n  <p>The header remains highlighted in both states.\n    Toggling changes only content visibility.</p>\n</Disclosure>`}>
      <div className="disclosure-example"><Disclosure title="Persistent header highlight" headerHighlight="always"><p>The header remains highlighted in both states. Toggling changes only content visibility.</p></Disclosure></div>
    </Showcase>

    </ExampleGallery>
    {showGuidance && <GuidanceNotes notes={componentReferences.find(reference => reference.name === 'Disclosure')?.notes || []} />}
  </>;
}
