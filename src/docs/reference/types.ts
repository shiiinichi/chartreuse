export interface PropDefinition {
  name: string;
  description: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
}

export interface ComponentReference {
  name: string;
  slug: string;
  summary: string;
  importCode: string;
  usageCode: string;
  props: PropDefinition[];
  nativeElement?: string;
  nativeProps?: string;
  notes?: string[];
}
