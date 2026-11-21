import { useState } from 'react';
import { ButtonSelect, Flex } from '../system';

const variants = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'accent', label: 'Accent' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'danger', label: 'Danger' },
] as const;

type VariantChoice = (typeof variants)[number];

function VariantPicker({ initial }: { initial: VariantChoice }) {
  const [selected, setSelected] = useState(initial);

  return <ButtonSelect variant={selected.value} style={{ inlineSize: '8rem' }}
    aria-label={`${initial.label} style example, ${selected.label}`}
    options={variants} value={selected.value} onValueChange={value => {
      const next = variants.find(option => option.value === value);
      if (next) setSelected(next);
    }} />;
}

export function ButtonSelectVariants() {
  return <Flex wrap gap={3}>
    {variants.map(variant => <VariantPicker key={variant.value} initial={variant} />)}
  </Flex>;
}
