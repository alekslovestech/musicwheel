"use client";

import chroma from "chroma-js";

import { ColorLegendGroup, legendLabelForGroup } from "@/utils/visual/colorLegendGroups";
import { isIntervalType } from "@/types/NoteGroupingId";
import { useMusical } from "@/contexts/MusicalContext";
import { useAudio } from "@/contexts/AudioContext";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import {
  getStepColorLegendItems,
  ribbonUsesStepSegments,
  ScaleRibbonStep,
} from "@/utils/visual/scaleRibbonUtils";
import { useColorLegendGroups } from "./useColorLegendGroups";

export function StaticColorLegendPanel() {
  const { groups, chordsOnly } = useColorLegendGroups();
  const { intervals, chords } = chordsOnly
    ? { intervals: [], chords: groups }
    : partitionColorLegendGroupsForDisplay(groups);
  const isScalesMode = useIsScalePreviewMode();
  const { scalePlaybackMode } = useAudio();
  const { selectedMusicalKey } = useMusical();
  const stepLegendItems =
    isScalesMode && ribbonUsesStepSegments(scalePlaybackMode)
      ? getStepColorLegendItems(selectedMusicalKey)
      : [];

  return (
    <div
      id="static-color-legend-panel"
      className="max-h-[70vh] w-fit max-w-xs overflow-y-auto rounded border border-containers-divider bg-canvas-bgDefault/95 p-snug shadow-md"
    >
      <div className="mb-snug text-sm font-medium">Legend</div>
      <div id="color-legend-sections" className="flex flex-col gap-normal">
        {stepLegendItems.length > 0 && <StepColorLegend steps={stepLegendItems} />}
        {!chordsOnly && intervals.length > 0 && (
          <ColorLegendSection title="Intervals" groups={intervals} />
        )}
        {chords.length > 0 && <ColorLegendSection title="Chords" groups={chords} />}
      </div>
    </div>
  );
}

function StepColorLegend({ steps }: { steps: ScaleRibbonStep[] }) {
  return (
    <div id="color-legend-section-Steps" className="flex flex-col gap-tight">
      <div className="text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70">
        Steps
      </div>
      {steps.map((step) => (
        <LegendSwatchRow key={step.label} color={step.color} label={step.label} />
      ))}
    </div> 
  );
}

function LegendSwatchRow({
  color,
  label,
  id,
}: {
  color: chroma.Color;
  label: string;
  id?: string;
}) {
  return (
    <div id={id} className="flex items-center gap-snug">
      <div
        className="h-4 w-4 shrink-0 rounded-sm border border-containers-divider/40"
        style={{ backgroundColor: color.css() }}
      />
      <span className="min-w-0 flex-1 text-sm leading-tight">{label}</span>
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
        <LegendSwatchRow
          key={group.groupingIds.map((id) => id).join("-")}
          id={`color-legend-row-${group.groupingIds[0]}`}
          color={group.color}
          label={legendLabelForGroup(group)}
        />
      ))}
    </div>
  );
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
