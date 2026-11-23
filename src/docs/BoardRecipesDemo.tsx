import { useState } from 'react';
import { ChipGroup, SegmentedProgress, ToggleChip } from '../system';
import { CompactBoardRecipe } from './board-recipes/CompactBoardRecipe';
import { FixedWidthBoardRecipe } from './board-recipes/FixedWidthBoardRecipe';
import { KanbanBoardRecipe } from './board-recipes/KanbanBoardRecipe';
import { RemLaneWidthRecipe } from './board-recipes/RemLaneWidthRecipe';
import compactBoardSource from './board-recipes/CompactBoardRecipe.tsx?raw';
import fixedWidthBoardSource from './board-recipes/FixedWidthBoardRecipe.tsx?raw';
import kanbanBoardSource from './board-recipes/KanbanBoardRecipe.tsx?raw';
import remLaneWidthSource from './board-recipes/RemLaneWidthRecipe.tsx?raw';
import { ExampleGallery, Showcase } from './shared';

export function recipeCode(source: string) {
  return source.replace("} from '../../system';", "} from '@chartreuse/ui';\nimport '@chartreuse/ui/styles.css';").trim();
}

/** Board recipes: the classic kanban board, the compact single-surface board, and fixed lane widths. */
export function SwimlaneGroupDemo() {
  return <ExampleGallery maxColumns={1}>
    <Showcase span="full" title="Kanban board" description="Seven stages in separate lanes with category accents, stage filters, a summary bar, collapsible lanes, and dashed add actions. Collapse a lane to keep its add action and count in a 48px rail."
      code={recipeCode(kanbanBoardSource)}><KanbanBoardRecipe /></Showcase>
    <Showcase span="full" title="Compact board" description="All seven stages on one surface: flush, compact lanes with dot headers and compact task cards that link to their task pages. Done starts collapsed."
      code={recipeCode(compactBoardSource)}><CompactBoardRecipe /></Showcase>
    <Showcase span="full" title="Fixed lane width" description="Recommended for boards with many stages. laneWidth={256} gives every expanded lane 256px, so titles and header actions keep their room and the row scrolls horizontally instead of squeezing lanes until titles truncate. The collapsed Done lane keeps its 48px rail."
      code={recipeCode(fixedWidthBoardSource)}><FixedWidthBoardRecipe /></Showcase>
    <Showcase span="full" title="Lane width as a CSS length" description='laneWidth also takes any CSS length. laneWidth="18rem" sizes lanes with the root font size, so they widen when text is enlarged.'
      code={recipeCode(remLaneWidthSource)}><RemLaneWidthRecipe /></Showcase>
  </ExampleGallery>;
}

export function ToggleChipDemo() {
  const [active, setActive] = useState<string[]>(['review']);
  const toggle = (id: string) => setActive(current =>
    current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <ChipGroup label="Filter by stage">
    <ToggleChip dot accent="cat-2" count={4} pressed={active.includes('todo')}
      onClick={() => toggle('todo')}>To do</ToggleChip>
    <ToggleChip dot accent="cat-4" count={2} pressed={active.includes('review')}
      onClick={() => toggle('review')}>In review</ToggleChip>
    <ToggleChip variant="dashed" addIcon>Add stage</ToggleChip>
  </ChipGroup>;
}

export function ChipGroupDemo() {
  return <ChipGroup label="Quick filters">
    <ToggleChip pressed={false}>Assigned to me</ToggleChip>
    <ToggleChip pressed>High priority</ToggleChip>
  </ChipGroup>;
}

export function SegmentedProgressDemo() {
  return <SegmentedProgress label="Cards by stage" legend segments={[
    { id: 'todo', label: 'To do', value: 6, accent: 'cat-2' },
    { id: 'doing', label: 'In progress', value: 3, accent: 'cat-3' },
    { id: 'done', label: 'Done', value: 9, accent: 'cat-6' },
  ]} />;
}
