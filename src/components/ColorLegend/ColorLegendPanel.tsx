"use client";

import { ColorLegendGroup } from "@/utils/visual/colorLegendGroups";
import { isIntervalType } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { useMusical } from "@/contexts/MusicalContext";
import { useAudio } from "@/contexts/AudioContext";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";
import { useColorLegendGroups } from "./useColorLegendGroups";
import { ScaleRibbon } from "./ScaleRibbon";

export function ColorLegendPanel() {
  const isScalesMode = useIsScalePreviewMode();
  const { selectedMusicalKey } = useMusical();
  const { scalePlaybackMode } = useAudio();
  const { groups, chordsOnly } = useColorLegendGroups();
  const { intervals, chords } = chordsOnly
    ? { intervals: [], chords: groups }
    : partitionColorLegendGroupsForDisplay(groups);
  const scaleRibbon = isScalesMode
    ? buildScaleRibbonData(selectedMusicalKey, scalePlaybackMode)
    : null;

  return (
    <div
      id="color-legend-panel"
      className="max-h-[70vh] w-64 overflow-y-auto rounded border border-containers-divider bg-canvas-bgDefault/95 p-snug shadow-md"
    >
      <div className="mb-snug text-sm font-medium">Legend</div>
      <div id="color-legend-sections" className="flex flex-col gap-normal">
        {scaleRibbon && <ScaleRibbon ribbon={scaleRibbon} />}
        {!chordsOnly && intervals.length > 0 && (
          <ColorLegendSection title="Intervals" groups={intervals} />
        )}
        {chords.length > 0 && <ColorLegendSection title="Chords" groups={chords} />}
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

function legendLabelsForGroup(group: ColorLegendGroup): string {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const id of group.groupingIds) {
    const label = NoteGroupingLibrary.getGroupingById(id).shortForm;
    const dedupeKey = label.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    labels.push(label);
  }
  return labels.join("·");
}

function partitionColorLegendGroupsForDisplay(groups: ColorLegendGroup[]): {
  intervals: ColorLegendGroup[];
  chords: ColorLegendGroup[];
} {
  const intervals: ColorLegendGroup[] = [];
  const chords: ColorLegendGroup[] = [];
  for (const group of groups) {
    if (isIntervalType(group.groupingIds[0]!)) {
      intervals.push(group);
    } else {
      chords.push(group);
    }
  }
  return { intervals, chords };
}
