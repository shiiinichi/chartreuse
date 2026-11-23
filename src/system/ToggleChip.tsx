import { Plus } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Tone } from './components';
import type { CategoryColor } from './tokens';
import { ChipContent } from './chip-content';
import './toggle-chip.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface ToggleChipProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Visible label. It is also the start of the accessible name. */
  children: ReactNode;
  /** Shows an 8px dot before the label in the tone or accent color. Defaults to false. */
  dot?: boolean;
  /** 'solid' fills the dot; 'outline' draws a 1.5px ring. Defaults to 'solid'. */
  dotStyle?: 'solid' | 'outline';
  /** Status color for the dot. Defaults to 'neutral'. */
  tone?: Tone;
  /** Categorical color for the dot. Overrides tone for color only. */
  accent?: CategoryColor;
  /** A trailing tabular count. A count of 0 renders the label at a lower weight in the muted color. */
  count?: number;
  /** Sets aria-pressed so the chip acts as a toggle. Leave undefined for a plain action chip. */
  pressed?: boolean;
  /** Defaults to 'ghost'. 'dashed' is for add actions such as an empty stage. */
  variant?: 'ghost' | 'outline' | 'dashed';
  /** Height: sm 30px, md 32px; both grow to 44px under a coarse pointer. Defaults to 'md'. */
  size?: 'sm' | 'md';
  /** Shows a trailing + icon. Only the dashed variant draws it. Defaults to false. */
  addIcon?: boolean;
}

/** A compact native button with an optional dot, label, and count, usable as a filter toggle. */
export function ToggleChip({
  children, dot = false, dotStyle = 'solid', tone = 'neutral', accent, count, pressed, variant = 'ghost', size = 'md',
  addIcon = false, className, type = 'button', ...props
}: ToggleChipProps) {
  const value = count === undefined ? undefined : Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  return <button
    {...props}
    type={type}
    className={cx('cr-toggle-chip', className)}
    aria-pressed={pressed}
    data-variant={variant}
    data-size={size}
    data-tone={tone}
    data-accent={accent}
    data-empty={value === 0 || undefined}
  >
    <ChipContent dot={dot} dotStyle={dotStyle} count={value}>{children}</ChipContent>
    {addIcon && variant === 'dashed' && <Plus className="cr-toggle-chip-add" size={14} aria-hidden="true" />}
  </button>;
}

export interface ChipGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'role'> {
  /** Accessible name for the group of chips. */
  label: string;
  children?: ReactNode;
}

/** Groups related chips with role="group" and wraps them with 4px row and 6px column gaps. */
export function ChipGroup({ label, children, className, ...props }: ChipGroupProps) {
  return <div {...props} role="group" aria-label={label} className={cx('cr-chip-group', className)}>{children}</div>;
}
