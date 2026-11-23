import { Swimlane, SwimlaneGroup, type CategoryColor } from '../../system';

const stages: { title: string; accent: CategoryColor }[] = [
  { title: 'Inbox', accent: 'cat-8' },
  { title: 'Planned', accent: 'cat-2' },
  { title: 'In progress', accent: 'cat-3' },
  { title: 'Ready to ship', accent: 'cat-5' },
];

/** Any CSS length works: 18rem lanes scale with the root font size. */
export function RemLaneWidthRecipe() {
  return <SwimlaneGroup label="Lanes sized in rem" laneWidth="18rem">
    {stages.map(stage => <Swimlane key={stage.title} title={stage.title} count={0} accent={stage.accent}
      headerStyle="dot" variant="flush" density="compact" collapsible emptyContent="No tasks" />)}
  </SwimlaneGroup>;
}
