import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Skeleton } from './components';
import type { Tone } from './components';
import { renderIcon } from './icons';
import type { IconSource } from './icons';
import './stat.css';

export interface StatProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'prefix'> {
  label: ReactNode;
  value: number | string;
  /** Fixed fraction digits for numbers; omitted precision preserves significant digits. */
  precision?: number;
  locale?: string;
  useGrouping?: boolean;
  groupSeparator?: string;
  decimalSeparator?: string;
  formatter?: (value: number | string) => ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  icon?: IconSource;
  tone?: Tone;
  description?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

function formatNumber(value: number, precision: number | undefined, locale: string, useGrouping: boolean, groupSeparator: string | undefined, decimalSeparator: string | undefined) {
  const digits = typeof precision === 'number' && Number.isFinite(precision) ? Math.min(20, Math.max(0, Math.floor(precision))) : undefined;
  const options: Intl.NumberFormatOptions = digits === undefined
    ? { useGrouping, maximumSignificantDigits: 21 }
    : { useGrouping, minimumFractionDigits: digits, maximumFractionDigits: digits };
  let numberFormat: Intl.NumberFormat;
  try {
    const supported = Intl.NumberFormat.supportedLocalesOf(locale).length > 0;
    numberFormat = new Intl.NumberFormat(supported ? locale : 'en-US', options);
  } catch {
    numberFormat = new Intl.NumberFormat('en-US', options);
  }
  return numberFormat.formatToParts(value).map(part => {
    if (part.type === 'group' && groupSeparator !== undefined) return groupSeparator;
    if (part.type === 'decimal' && decimalSeparator !== undefined) return decimalSeparator;
    return part.value;
  }).join('');
}

/** A native term/value pair. Formatting never infers a unit or changes the value's scale. */
export function Stat({ label, value, precision, locale = 'en-US', useGrouping = true, groupSeparator, decimalSeparator, formatter, prefix, suffix, icon, tone = 'neutral', description, action, loading = false, loadingLabel = 'Loading value', className, ...props }: StatProps) {
  const id = useId();
  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasAction = action !== undefined && action !== null && action !== false;
  const available = typeof value !== 'number' || Number.isFinite(value);
  const content = loading ? null : !available ? <><span aria-hidden="true">—</span><span className="cr-sr-only">Unavailable</span></> : formatter ? formatter(value) : typeof value === 'number' ? formatNumber(value, precision, locale, useGrouping, groupSeparator, decimalSeparator) : value;
  return <div {...props} className={['cr-stat', className].filter(Boolean).join(' ')} data-tone={tone} data-loading={loading}>
    <dl className="cr-stat-content" aria-busy={loading || undefined}>
      <dt className="cr-stat-label">{label}</dt>
      <dd className="cr-stat-value" aria-describedby={hasDescription ? `${id}-description` : undefined}>
        {loading ? <><Skeleton className="cr-stat-skeleton" /><span className="cr-sr-only">{loadingLabel}</span></> : <>
          {icon && renderIcon(icon, { size: 24, className: 'cr-stat-icon' })}
          {prefix !== undefined && prefix !== null && <div className="cr-stat-prefix">{prefix}</div>}
          <div className="cr-stat-number">{content}</div>
          {suffix !== undefined && suffix !== null && <div className="cr-stat-suffix">{suffix}</div>}
        </>}
      </dd>
    </dl>
    {hasDescription && <div className="cr-stat-description" id={`${id}-description`}>{description}</div>}
    {hasAction && <div className="cr-stat-action">{action}</div>}
  </div>;
}
