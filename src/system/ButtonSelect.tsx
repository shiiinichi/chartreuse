import { ButtonSelectCore } from './button-select-core';
import type { ButtonSelectProps } from './button-select-core';

export type { ButtonSelectControls, ButtonSelectOption, ButtonSelectProps } from './button-select-core';

/** A Button that reveals a list of choices or caller-supplied content. */
export function ButtonSelect(props: ButtonSelectProps) {
  return <ButtonSelectCore {...props} />;
}
