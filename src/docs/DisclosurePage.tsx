import { useId, useState } from 'react';
import { Disclosure } from '../system/Disclosure';
import { Switch } from '../system/components';
import { ExampleGallery, Showcase } from './shared';
import { GuidanceNotes } from './GuidanceNotes';
import { componentReferences } from './reference';
import { Text } from '../system';
import './DisclosurePage.css';

export function DisclosurePage({ showGuidance = true }: { showGuidance?: boolean } = {}) {
  const groupId = useId();
  const [exclusive, setExclusive] = useState(false);
  const groupName = exclusive ? `workspace-help-${groupId}` : undefined;
  return <>
    <Text size="body" className="disclosure-page-intro">Disclosure renders native details and summary elements for collapsible content. Use defaultOpen for the initial state and name for an exclusive group.</Text>
    <ExampleGallery className="disclosure-page-examples">
    <Showcase title="Initially expanded disclosure" description="defaultOpen expands the content on initial render. The summary toggles its visibility." code={`import { Disclosure, Text } from '@chartreuse/ui';\n\n<Disclosure title="Hook coverage and limits" defaultOpen>\n  <Text size="body">Direct file tools, patches, directory and search tools,\n    and literal paths in common shell commands. Matching\n    messages are combined; any matching block rule denies\n    the request.</Text>\n  <Text size="body">Variables, arbitrary scripts, and files opened internally\n    by other tools cannot be inspected by these hooks.\n    Filesystem isolation is controlled by the host.</Text>\n</Disclosure>`}>
      <div className="disclosure-example"><Disclosure title="Hook coverage and limits" defaultOpen><Text size="body">Direct file tools, patches, directory and search tools, and literal paths in common shell commands. Matching messages are combined; any matching block rule denies the request.</Text><Text size="body">Variables, arbitrary scripts, and files opened internally by other tools cannot be inspected by these hooks. Filesystem isolation is controlled by the host.</Text></Disclosure></div>
    </Showcase>

    <Showcase title="Independent and exclusive disclosure groups" description="Omit name to allow multiple open disclosures. A shared name requests native exclusive grouping." toolbar={<Switch label="One open at a time" checked={exclusive} onChange={event => setExclusive(event.target.checked)} />} code={"import { useId, useState } from 'react';\nimport { Disclosure, Switch, Text } from '@chartreuse/ui';\n\nfunction WorkspaceQuestions() {\n  const id = useId();\n  const [exclusive, setExclusive] = useState(false);\n  const groupName = exclusive ? `workspace-help-${id}` : undefined;\n  return <>\n    <Switch label=\"One open at a time\" checked={exclusive}\n      onChange={event => setExclusive(event.target.checked)} />\n    <div className=\"cr-disclosure-group\" role=\"group\" aria-label=\"Disclosure behavior examples\">\n      <Disclosure title=\"How is the initial state set?\" name={groupName} defaultOpen>\n        <Text size='body'>defaultOpen sets the initial expanded state. Later toggles update the disclosure state without changing this prop.</Text>\n        <Text size='body'>Place links and buttons in the content so the summary remains a single toggle target.</Text>\n      </Disclosure>\n      <Disclosure title=\"How is expanded content rendered?\" name={groupName}>\n        <Text size='body'>Children remain inside the native details element. The browser controls their visibility when the summary is toggled.</Text>\n      </Disclosure>\n      <Disclosure title=\"How does exclusive grouping work?\" name={groupName}>\n        <Text size='body'>The switch supplies the same name to every disclosure. Opening one member of the named group closes the previously open member.</Text>\n      </Disclosure>\n    </div>\n  </>;\n}"}>
      <div className="disclosure-example cr-disclosure-group" role="group" aria-label="Disclosure behavior examples"><Disclosure title="How is the initial state set?" name={groupName} defaultOpen><Text size="body">defaultOpen sets the initial expanded state. Later toggles update the disclosure state without changing this prop.</Text><Text size="body">Place links and buttons in the content so the summary remains a single toggle target.</Text></Disclosure><Disclosure title="How is expanded content rendered?" name={groupName}><Text size="body">Children remain inside the native details element. The browser controls their visibility when the summary is toggled.</Text></Disclosure><Disclosure title="How does exclusive grouping work?" name={groupName}><Text size="body">The switch supplies the same name to every disclosure. Opening one member of the named group closes the previously open member.</Text></Disclosure></div>
    </Showcase>

    <Showcase title="Highlight only the expanded header" description="headerHighlight=open applies the header background while expanded and retains hover feedback while collapsed." code={`import { Disclosure, Text } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';\n\n<Disclosure title="Open-state header highlight" headerHighlight="open" defaultOpen>\n  <Text size="body">The header remains highlighted while expanded.\n    Collapse it to restore hover-only feedback.</Text>\n</Disclosure>`}>
      <div className="disclosure-example"><Disclosure title="Open-state header highlight" headerHighlight="open" defaultOpen><Text size="body">The header remains highlighted while expanded. Collapse it to restore hover-only feedback.</Text></Disclosure></div>
    </Showcase>

    <Showcase title="Highlight the header in both states" description="headerHighlight=always applies the header background in both states without changing the content surface." code={`import { Disclosure, Text } from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';\n\n<Disclosure title="Persistent header highlight" headerHighlight="always">\n  <Text size="body">The header remains highlighted in both states.\n    Toggling changes only content visibility.</Text>\n</Disclosure>`}>
      <div className="disclosure-example"><Disclosure title="Persistent header highlight" headerHighlight="always"><Text size="body">The header remains highlighted in both states. Toggling changes only content visibility.</Text></Disclosure></div>
    </Showcase>

    </ExampleGallery>
    {showGuidance && <GuidanceNotes notes={componentReferences.find(reference => reference.name === 'Disclosure')?.notes || []} />}
  </>;
}
