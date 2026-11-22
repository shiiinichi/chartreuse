/** Provenance points to the authoring source, not generated/minified output. */
export interface TokenSource {
  file: string;
  selector?: string;
  detail?: string;
}

/** An actual CSS custom property declared, or consumed with an explicit fallback, in source. */
export interface TokenDefinition {
  name: string;
  description: string;
  type: string;
  defaultValue: string;
  source: TokenSource;
  sources?: TokenSource[];
  /** Actual var() dependencies; do not infer aliases from equal literal values. */
  references?: string[];
  themes?: { light: string; dark: string };
  responsive?: string;
  availability?: 'library-css' | 'docs-css';
  /** Read with a var() fallback and never declared by the library CSS, so a wrapper override is inherited. */
  fallback?: boolean;
  notes?: string[];
}

/** Prop/state-owned variables are documented separately from styling hooks. */
export interface RuntimeVariableDefinition {
  name: string;
  description: string;
  source: TokenSource;
  notes?: string[];
}

export interface ComponentTokenDoc {
  component: string;
  componentTokens: TokenDefinition[];
  /** CSS variable names that resolve to the shared global catalog. */
  globalTokens: string[];
  runtimeVariables?: RuntimeVariableDefinition[];
  notes?: string[];
}
