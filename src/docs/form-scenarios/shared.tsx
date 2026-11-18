import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Showcase } from '../shared';
import './styles.css';

export { ExampleGallery } from '../shared';

export function FormScenario({ title, description, code, children, wide = false, span = 'auto' }: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
  wide?: boolean;
  span?: 'auto' | 'full';
}) {
  return <Showcase title={title} description={description} code={code} span={span}>
    <div className={`form-scenario-content${wide ? ' form-scenario-wide' : ''}`}>{children}</div>
  </Showcase>;
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="form-scenario-actions">{children}</div>;
}

export function ScenarioForm({ children, ...props }: ComponentPropsWithRef<'form'>) {
  return <form {...props}>{children}</form>;
}

export function formCode(components: string, example: string, react = '', extraImport = '') {
  const imports = [react && `import { ${react} } from 'react';`, `import { ${components} } from '@chartreuse/ui';`, extraImport].filter(Boolean).join('\n');
  return `${imports}\n\n${example}`;
}
