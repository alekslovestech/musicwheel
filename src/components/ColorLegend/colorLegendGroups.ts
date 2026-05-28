import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import {
  buildColorLegendMap,
  ColorLegendGroup,
  isIntervalLegendGroup,
  legendBucketKey,
  sortChordLegendGroupsByCatalogOrder,
} from "@/utils/visual/ColorLegendGrouping";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";
import { COLOR_LEGEND_DISPLAY_IDS } from "./colorLegendEntries";

function minOrderId(ids: NoteGroupingId[]): number {
  return Math.min(...ids.map((id) => NoteGroupingLibrary.getGroupingById(id).orderId));
}

function toColorLegendGroup(groupingIds: NoteGroupingId[]): ColorLegendGroup {
  return {
    color: getColorForGrouping(groupingIds[0]!),
    groupingIds,
  };
}

/** Groups from the full catalog, filtered to buckets referenced by `displayIds`.
 * Each row includes all equivalent labels from the full map, not just display ids.
 */
export function getColorLegendGroupsForDisplay(displayIds: NoteGroupingId[]): ColorLegendGroup[] {
  const fullMap = buildColorLegendMap(COLOR_LEGEND_DISPLAY_IDS);
  const displayBuckets = new Set(displayIds.map(legendBucketKey));

  return [...fullMap.entries()]
    .filter(([bucketKey]) => displayBuckets.has(bucketKey))
    .map(([, groupingIds]) => toColorLegendGroup(groupingIds))
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
  const groups = getColorLegendGroupsForDisplay(COLOR_LEGEND_DISPLAY_IDS);
  const intervals = groups.filter(isIntervalLegendGroup);
  const chords = sortChordLegendGroupsByCatalogOrder(
    groups.filter((group) => !isIntervalLegendGroup(group)),
    COLOR_LEGEND_DISPLAY_IDS,
  );
  return { intervals, chords };
}
