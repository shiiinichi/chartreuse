// Styling order of preference printed by `chartreuse token` and `chartreuse token <Component>`.
// Wording follows the color, shape, and setup guides; test/cli.test.mjs checks the scope claims
// (declared hooks, fallback hooks, CalloutBanner, tooltip and toast hosts) against the CSS and source.

export interface CustomizationHook {
  name: string;
  selector?: string;
  /** Read with a var() fallback and never declared by the library, so it also inherits from a wrapper. */
  fallback?: boolean;
}

export interface CustomizationTarget {
  name: string;
  /** Appearance props the component accepts, such as variant, tone, size, or surface. */
  styleProps: readonly string[];
  hooks: readonly CustomizationHook[];
  /** The component declares semantic --cr-color-* tokens on its own root. */
  redeclaresSemantic: boolean;
  /** The component's rules read brand primitives such as --cr-evergreen directly. */
  readsPrimitives: boolean;
}

/** Props that select a built-in appearance; the CLI keeps those a component accepts. */
export const appearanceProps = ['variant', 'tone', 'size', 'surface', 'color', 'markerVariant', 'headerHighlight', 'underline', 'divided'] as const;

/** Components whose floating content renders outside the component's own DOM position. */
const floatingContent: Readonly<Record<string, readonly ('tooltip' | 'toast' | 'popup')[]>> = {
  Select: ['popup'],
  Autocomplete: ['popup'],
  ButtonSelect: ['popup'],
  SplitButton: ['popup'],
  Menu: ['popup'],
  Tooltip: ['tooltip'],
  TaskCard: ['tooltip'],
  ToastProvider: ['toast'],
};

const list = (items: readonly string[]) => (items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`);

const tokenNote = 'Next, override semantic --cr-color-* and --cr-radius-* tokens on an application wrapper rather than restyling each component. Every library corner reads --cr-radius-md, so that one token sets the shape. Override colors in pairs with light-dark() for both themes, for example .my-feature { --cr-color-primary: light-dark(#096864, #dbffad); --cr-color-on-primary: light-dark(#fffdf6, #024340); }. Override --cr-space-* rarely: it is a numbered scale, so gap={4} would no longer be 16px; prefer the gap props.';
const calloutNote = 'CalloutBanner declares its own semantic --cr-color-* values on .cr-callout-banner, so wrapper overrides stop at the banner; set them on that selector.';
const hooksNote = 'Then set the component hooks that chartreuse token <Component> lists on the selector shown for each, for example .my-feature .cr-button { --button-bg: …; }, not on a wrapper or :root: the library declares most hooks on that selector, so an inherited value never wins. Hooks marked as read with a fallback, such as Stat\'s, are not declared by the library and also work on a wrapper.';
const classNote = 'Only then write unlayered CSS against cr- classes. Unlayered application CSS overrides the library layers without extra specificity, but the cr- class names and markup are not documented as a public API, so recheck such rules after upgrading.';
const primitiveNote = 'Override brand primitives such as --cr-evergreen only on :root; on a wrapper they change the few rules that read them directly but not the semantic tokens.';
const scopeNotes = {
  tooltip: 'Tooltip renders into the enclosing native dialog or document.body, so a wrapper override reaches a tooltip only when the wrapper contains that dialog; otherwise set tooltip overrides on :root. TaskCard metadata tooltips behave the same way.',
  toast: 'Toasts render where ToastProvider sits, usually near the application root, so set toast overrides on :root or on an element that contains ToastProvider.',
  popup: 'Select, Autocomplete, ButtonSelect, and SplitButton popups restore the root --cr-color-* tokens and color scheme, so a wrapper override or an evergreen Navbar restyles the trigger but not its popup. Set popup colors on :root, or target the popup itself, for example .my-feature .cr-option-list-popup or a ButtonSelect or SplitButton panelClassName. Popups follow the color-scheme meta tag, not a color-scheme set in application CSS.',
};

function componentHooksNote({ name, hooks }: CustomizationTarget) {
  if (!hooks.length) return `${name} has no component styling hooks, so props and the shared tokens it lists are its supported styling surface.`;
  const declared = [...new Set(hooks.filter(hook => !hook.fallback).map(hook => hook.name))];
  const fallback = [...new Set(hooks.filter(hook => hook.fallback).map(hook => hook.name))];
  const fallbackReason = 'read with a fallback and not declared by the library';
  if (!declared.length) return `Then override ${list(fallback)} on a wrapper or on the selector shown: ${fallback.length > 1 ? 'they are' : 'it is'} ${fallbackReason}, so an inherited value works.`;
  const example = hooks.find(hook => !hook.fallback && hook.selector)?.selector;
  const note = `Then set ${list(declared)} on the selector shown for each${example ? `, for example .my-feature ${example}` : ''}, not on a wrapper or :root: the library declares ${declared.length > 1 ? 'them' : 'it'} there, so an inherited value never wins.`;
  return fallback.length ? `${note} ${list(fallback)} ${fallback.length > 1 ? 'are' : 'is'} ${fallbackReason}, so ${fallback.length > 1 ? 'they' : 'it'} also work${fallback.length > 1 ? '' : 's'} on a wrapper.` : note;
}

/** Order of preference for styling, optionally specialized for one component. */
export function customizationNotes(component?: CustomizationTarget) {
  if (!component) {
    return [
      'Start with props such as variant, tone, size, and surface (chartreuse info <Component>) before writing CSS.',
      `${tokenNote} ${calloutNote}`, hooksNote, classNote, primitiveNote, scopeNotes.tooltip, scopeNotes.toast, scopeNotes.popup,
    ];
  }
  const { name, styleProps } = component;
  const props = styleProps.length
    ? `Start with ${name}'s ${list(styleProps)} ${styleProps.length > 1 ? 'props' : 'prop'} (chartreuse info ${name}) before writing CSS.`
    : `${name} has no appearance props such as variant, tone, or size; check chartreuse info ${name} for its other options before writing CSS.`;
  const notes = [props, component.redeclaresSemantic ? `${tokenNote} ${calloutNote}` : tokenNote, componentHooksNote(component), classNote];
  if (component.readsPrimitives) notes.push(primitiveNote);
  for (const scope of floatingContent[name] ?? []) notes.push(scopeNotes[scope]);
  return notes;
}

/**
 * Where to declare token overrides and why they win, shown on the docs site beside customizationNotes().
 * Scope claims follow scopeNotes so the site and the CLI describe tooltip and toast hosts the same way.
 */
export const tokenOverrideScope = {
  layers: 'The library declares its tokens inside @layer cr-tokens and its component rules inside @layer cr-components. Unlayered application CSS beats every layer, so a plain :root or wrapper rule overrides a token without !important or extra specificity. If the application puts its own CSS in layers (for example Tailwind v4), declare @layer cr-base, cr-tokens, cr-components; before its own layers so they come later and win.',
  root: `Use :root for changes the whole application should share, such as larger corner radii or a brand color. Floating content does not stay inside a feature wrapper: ${scopeNotes.tooltip} ${scopeNotes.toast} ${scopeNotes.popup}`,
  wrapper: 'Use an ordinary wrapper element to restyle one feature, page, or panel. Custom properties inherit, so components inside the wrapper pick up the new values and the rest of the application keeps the defaults.',
  javascript: 'The @chartreuse/ui/tokens JavaScript exports (colors, spacing, typography, radii, tokens) are independent descriptor values. They do not read computed CSS, so they keep the library defaults after a CSS override; read getComputedStyle(element).getPropertyValue(\'--cr-radius-md\') when code needs the value in effect.',
} as const;
