import { useState } from 'react';
import { Button, ButtonSelect, Flex } from '../system';

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

  return <ButtonSelect variant={selected.value} style={{ inlineSize: '8rem', maxInlineSize: '100%' }}
    aria-label={`${initial.label} style example, ${selected.label}`}
    content={({ close }) => (
      <Flex direction="column" gap={1} role="group" aria-label="Button style">
        {variants.map(option => {
          const isSelected = option.value === selected.value;
          return <Button key={option.value} size="sm" variant={isSelected ? 'primary' : 'ghost'}
            style={{
              border: 0,
              outlineOffset: 1,
              fontWeight: isSelected ? 650 : undefined,
              backgroundColor: isSelected ? undefined : 'transparent',
            }}
            aria-pressed={isSelected}
            onClick={() => { setSelected(option); close(); }}>
            {option.label}
          </Button>;
        })}
      </Flex>
    )}>
    {selected.label}
  </ButtonSelect>;
}

export function ButtonSelectVariants() {
  return <Flex wrap gap={3}>
    {variants.map(variant => <VariantPicker key={variant.value} initial={variant} />)}
  </Flex>;
}
