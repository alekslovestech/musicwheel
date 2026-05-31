import { ColorLegendGroup } from "./colorLegendGroups";
import {
  getColorLegendSections,
  legendLabelsForGroup,
} from "./colorLegendGroups";

export function ColorLegendPanel() {
  const { intervals, chords } = getColorLegendSections();

  return (
    <div
      id="color-legend-panel"
      className="max-h-[70vh] w-60 overflow-y-auto rounded border border-containers-divider bg-canvas-bgDefault/95 p-snug shadow-md"
    >
      <div className="mb-snug text-sm font-medium">Color legend</div>
      <div id="color-legend-sections" className="flex flex-col gap-normal">
        <ColorLegendSection title="Intervals" groups={intervals} />
        <ColorLegendSection title="Chords" groups={chords} />
      </div>
    </div>
  );
}

function ColorLegendRow({ group }: { group: ColorLegendGroup }) {
  return (
    <div id={`color-legend-row-${group.groupingIds[0]}`} className="flex items-center gap-snug">
      <div
        className="h-3 w-[100px] shrink-0 rounded-sm border border-containers-divider/40"
        style={{ backgroundColor: group.color.css() }}
      />
      <span className="min-w-0 flex-1 text-sm leading-tight">{legendLabelsForGroup(group)}</span>
    </div>
  );
}

function ColorLegendSection({ title, groups }: { title: string; groups: ColorLegendGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div id={`color-legend-section-${title}`} className="flex flex-col gap-tight">
      <div
        id={`color-legend-title-${title}`}
        className="text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70"
      >
        {title}
      </div>
      {groups.map((group) => (
        <ColorLegendRow key={group.groupingIds.map((id) => id).join("-")} group={group} />
      ))}
    </div>
  );
}
