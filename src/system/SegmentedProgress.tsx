import type { ComponentPropsWithRef, ReactNode } from 'react';
import { ChipContent } from './chip-content';
import type { ProgressSize, Tone } from './components';
import type { CategoryColor } from './tokens';
import { ChipGroup, ToggleChip } from './ToggleChip';
import './segmented-progress.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface SegmentedProgressSegment {
  id: string;
  value: number;
  /** Plain-text label, used in the image's accessible name and the legend. */
  label: string;
  tone?: Tone;
  /** Categorical color. Overrides tone for color only. */
  accent?: CategoryColor;
}

export interface SegmentedProgressProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Names the bar, e.g. "Cards by stage". The accessible name lists every segment after it. */
  label: string;
  segments: readonly SegmentedProgressSegment[];
  /** Total the track represents. Defaults to the sum of the segment values; unused space stays empty. */
  max?: number;
  /** Track height: sm 4px, md 6px, lg 8px. Defaults to 'lg'. */
  size?: ProgressSize;
  /** true renders a static legend; 'interactive' renders one ToggleChip per segment. Defaults to false. */
  legend?: boolean | 'interactive';
  /** Called with the segment id when an interactive legend chip is activated. */
  onSegmentSelect?: (id: string) => void;
  /** Segment ids whose interactive legend chips are pressed. When omitted, chips have no pressed state. */
  selectedSegments?: readonly string[];
  /** Optional content after the track, such as a total. */
  children?: ReactNode;
}

const clean = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;

/** A stacked, multi-segment bar exposed as one image with a text alternative, plus an optional legend. */
export function SegmentedProgress({
  label, segments, max, size = 'lg', legend = false, onSegmentSelect, selectedSegments, children, className, ...props
}: SegmentedProgressProps) {
  const values = segments.map(segment => clean(segment.value));
  const sum = values.reduce((total, value) => total + value, 0);
  const total = max === undefined ? sum : Math.max(clean(max), sum);
  const remainder = total - sum;
  const description = segments.map((segment, index) => `${segment.label} ${values[index]}`).join(', ');
  const name = `${label}: ${description || 'no segments'}${max !== undefined ? `, of ${total}` : ''}`;
  return <div {...props} className={cx('cr-segmented-progress', className)} data-size={size}>
    <div className="cr-segmented-progress-track" role="img" aria-label={name}>
      {segments.map((segment, index) => values[index] > 0 && <span
        key={segment.id}
        className="cr-segmented-progress-segment"
        data-tone={segment.tone ?? 'neutral'}
        data-accent={segment.accent}
        style={{ flexGrow: values[index] }}
      />)}
      {remainder > 0 && <span className="cr-segmented-progress-rest" style={{ flexGrow: remainder }} />}
    </div>
    {children}
    {legend === 'interactive' ? <ChipGroup label={`${label} legend`} className="cr-segmented-progress-legend">
      {segments.map((segment, index) => <ToggleChip
        key={segment.id}
        size="sm"
        dot
        tone={segment.tone ?? 'neutral'}
        accent={segment.accent}
        count={values[index]}
        pressed={selectedSegments ? selectedSegments.includes(segment.id) : undefined}
        onClick={onSegmentSelect && (() => onSegmentSelect(segment.id))}
      >{segment.label}</ToggleChip>)}
    </ChipGroup> : legend && <ul className="cr-segmented-progress-legend" aria-label={`${label} legend`}>
      {segments.map((segment, index) => <li
        key={segment.id}
        className="cr-toggle-chip"
        data-static=""
        data-size="sm"
        data-variant="ghost"
        data-tone={segment.tone ?? 'neutral'}
        data-accent={segment.accent}
        data-empty={values[index] === 0 || undefined}
      ><ChipContent dot dotStyle="solid" count={values[index]}>{segment.label}</ChipContent></li>)}
    </ul>}
  </div>;
}
