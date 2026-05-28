import {
  ColorLegendGroup,
  getColorLegendGroupsForDisplay,
  isIntervalLegendGroup,
  legendLabelsForGroup,
  legendTitleForGroup,
  seriateLegendGroupsByDeltaE,
} from "./colorLegendGroups";
import { COLOR_LEGEND_DISPLAY_IDS } from "./colorLegendEntries";

function ColorLegendRow({ group }: { group: ColorLegendGroup }) {
  return (
    <div className="flex items-center gap-snug" title={legendTitleForGroup(group)}>
      <div
        className="h-3 w-[100px] shrink-0 rounded-sm border border-containers-divider/40"
        style={{ backgroundColor: group.color }}
      />
      <span className="min-w-0 flex-1 text-sm leading-tight">{legendLabelsForGroup(group)}</span>
    </div>
  );
}

function ColorLegendSection({
  title,
  groups,
}: {
  title: string;
  groups: ColorLegendGroup[];
}) {
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-tight">
      <div className="text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70">
        {title}
      </div>
      {groups.map((group) => (
        <ColorLegendRow
          key={group.groupingIds.map((id) => id).join("-")}
          group={group}
        />
      ))}
    </div>
  );
}

export function ColorLegendPanel() {
  const groups = getColorLegendGroupsForDisplay(COLOR_LEGEND_DISPLAY_IDS);
  const intervalGroups = groups.filter(isIntervalLegendGroup);
  const chordGroups = seriateLegendGroupsByDeltaE(
    groups.filter((group) => !isIntervalLegendGroup(group)),
  );

  return (
    <div className="max-h-[70vh] w-60 overflow-y-auto rounded border border-containers-divider bg-canvas-bgDefault/95 p-snug shadow-md">
      <div className="mb-snug text-sm font-medium">Color legend</div>
      <div className="flex flex-col gap-normal">
        <ColorLegendSection title="Intervals" groups={intervalGroups} />
        <ColorLegendSection title="Chords" groups={chordGroups} />
      </div>
    </div>
  );
}
