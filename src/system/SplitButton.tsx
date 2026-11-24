import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './components';
import type { ButtonProps } from './components';
import { ButtonSelectCore } from './button-select-core';
import type { ButtonSelectControls, ButtonSelectOption } from './button-select-core';
import type { IconSource } from './icons';
import './split-button.css';

export interface SplitButtonProps extends Omit<ButtonProps,
  'variant' | 'value' | 'defaultValue' | 'content' | 'popover' | 'popoverTarget' | 'popoverTargetAction' | 'command' | 'commandFor'
> {
  /** Visual emphasis shared by both segments. Defaults to 'primary'. */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  /** Accessible name of the menu segment, such as "Agent for this request: Claude · Opus". Also its default tooltip. */
  menuLabel: string;
  /** Tooltip on the menu segment. Defaults to menuLabel. */
  menuTitle?: string;
  /** Disables the menu segment and closes its popover. The action segment follows disabled instead. */
  menuDisabled?: boolean;
  /** Icon on the menu segment. Defaults to ChevronDown. */
  menuIcon?: IconSource;
  /** Draws a line between the segments. Set false for a seamless control, such as ghost breadcrumb items. Defaults to true. */
  divider?: boolean;
  /** Accessible name of the group. Defaults to the action segment's text. */
  groupLabel?: string;
  /** Choices displayed in the built-in popover. */
  options?: readonly ButtonSelectOption[];
  /** Controlled option ID in the built-in popover. */
  value?: string;
  /** Initial option ID for an uncontrolled built-in popover. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Show the standard checkmark or a custom icon beside the selected built-in option. Hidden by default. */
  checkmark?: boolean | IconSource;
  emptyMessage?: string;
  /** Custom popover content, or a renderer that can close the panel after an interaction. */
  content?: ReactNode | ((controls: ButtonSelectControls) => ReactNode);
  /** Keep the popover at the whole control's width, within the viewport. Defaults to false. */
  matchTriggerWidth?: boolean;
  panelClassName?: string;
}

/** A primary action Button joined to a menu segment that opens choices or custom content. */
export function SplitButton({ children, variant = 'primary', size = 'md', menuLabel, menuTitle, menuDisabled, menuIcon = ChevronDown,
  divider = true, groupLabel, options, value, defaultValue, onValueChange, checkmark, emptyMessage, content, matchTriggerWidth, panelClassName,
  fullWidth = false, className, id, ...props }: SplitButtonProps) {
  const generatedId = useId();
  const actionId = id ?? `${generatedId}-action`;
  const group = useRef<HTMLDivElement>(null);
  return <div ref={group} role="group" className={['cr-split-button', className].filter(Boolean).join(' ')}
    aria-label={groupLabel} aria-labelledby={groupLabel ? undefined : actionId}
    data-variant={variant} data-size={size} data-divider={divider ? undefined : 'false'} data-full-width={fullWidth || undefined}>
    <Button {...props} id={actionId} variant={variant} size={size} className="cr-split-button-action">{children}</Button>
    <ButtonSelectCore anchor={group} variant={variant} size={size} className="cr-split-button-menu" iconRight={menuIcon}
      aria-label={menuLabel} title={menuTitle ?? menuLabel} disabled={menuDisabled}
      options={options} value={value} defaultValue={defaultValue} onValueChange={onValueChange} checkmark={checkmark}
      onKeyDown={content === undefined ? undefined : event => {
        // Built-in options already open on ArrowDown; custom content follows the same key.
        if (event.key !== 'ArrowDown' || event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent.isComposing) return;
        event.preventDefault();
        if (event.currentTarget.getAttribute('aria-expanded') !== 'true') event.currentTarget.click();
      }}
      emptyMessage={emptyMessage} content={content} matchTriggerWidth={matchTriggerWidth} panelClassName={panelClassName}>{''}</ButtonSelectCore>
  </div>;
}
