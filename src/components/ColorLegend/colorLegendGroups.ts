import { NoteGroupingType } from "@/types/enums/NoteGroupingType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { colorCss } from "@/utils/visual/AppColor";
import {
  ColorLegendGroup,
  isIntervalLegendGroup,
  sortChordLegendGroupsByCatalogOrder,
} from "@/utils/visual/ColorLegendGrouping";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";
import { COLOR_LEGEND_DISPLAY_IDS } from "./colorLegendEntries";

function minOrderId(ids: NoteGroupingId[]): number {
  return Math.min(...ids.map((id) => NoteGroupingLibrary.getGroupingById(id).orderId));
}

function legendBucketKey(id: NoteGroupingId): string {
  const color = getColorForGrouping(id);
  const type = isIntervalType(id) ? NoteGroupingType.Interval : NoteGroupingType.Chord;
  return `${type}:${colorCss(color)}`;
}

function sortIdsByOrder(ids: NoteGroupingId[]): NoteGroupingId[] {
  return [...ids].sort(
    (a, b) =>
      NoteGroupingLibrary.getGroupingById(a).orderId -
      NoteGroupingLibrary.getGroupingById(b).orderId,
  );
}

function toColorLegendGroup(groupingIds: NoteGroupingId[]): ColorLegendGroup {
  return {
    color: getColorForGrouping(groupingIds[0]!),
    groupingIds,
  };
}

function buildColorLegendGroups(): ColorLegendGroup[] {
  const map = new Map<string, NoteGroupingId[]>();

  for (const id of COLOR_LEGEND_DISPLAY_IDS) {
    const key = legendBucketKey(id);
    const group = map.get(key) ?? [];
    group.push(id);
    map.set(key, group);
  }

  return [...map.values()]
    .map((groupingIds) => toColorLegendGroup(sortIdsByOrder(groupingIds)))
    .sort((a, b) => minOrderId(a.groupingIds) - minOrderId(b.groupingIds));
}

export function legendLabelsForGroup(group: ColorLegendGroup): string {
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

export function getColorLegendSections(): {
  intervals: ColorLegendGroup[];
  chords: ColorLegendGroup[];
} {
  const groups = buildColorLegendGroups();
  const intervals = groups.filter(isIntervalLegendGroup);
  const chords = sortChordLegendGroupsByCatalogOrder(
    groups.filter((group) => !isIntervalLegendGroup(group)),
    COLOR_LEGEND_DISPLAY_IDS,
  );
  return { intervals, chords };
}
