import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { SpecialType } from "@/types/enums/SpecialType";
import chroma from "chroma-js";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";
import { isColorLegendExcluded } from "./colorLegendEntries";
export interface ColorLegendGroup {
  color: string;
  groupingIds: NoteGroupingId[];
}

function sortIdsByOrder(ids: NoteGroupingId[]): NoteGroupingId[] {
  return [...ids].sort(
    (a, b) =>
      NoteGroupingLibrary.getGroupingById(a).orderId -
      NoteGroupingLibrary.getGroupingById(b).orderId,
  );
}

/**
 * Group key: same computed color AND same catalog kind (interval vs chord).
 * Prevents accidental merges when a chord mix collides with a pure interval color.
 */
export function legendBucketKey(id: NoteGroupingId): string {
  const color = getColorForGrouping(id);
  const type = NoteGroupingLibrary.getGroupingById(id).getNoteGroupingType();
  return `${type}:${color}`;
}

/** Bucket catalog ids by legend bucket key. */
export function buildColorLegendMap(ids: NoteGroupingId[]): Map<string, NoteGroupingId[]> {
  const map = new Map<string, NoteGroupingId[]>();

  for (const id of ids) {
    const key = legendBucketKey(id);
    const group = map.get(key) ?? [];
    group.push(id);
    map.set(key, group);
  }

  for (const [key, group] of map) {
    map.set(key, sortIdsByOrder(group));
  }

  return map;
}

function minOrderId(ids: NoteGroupingId[]): number {
  return Math.min(...ids.map((id) => NoteGroupingLibrary.getGroupingById(id).orderId));
}

function toColorLegendGroup(groupingIds: NoteGroupingId[]): ColorLegendGroup {
  return {
    color: getColorForGrouping(groupingIds[0]!),
    groupingIds,
  };
}

/** Catalog ids used to resolve equivalent labels; spread/narrow omitted. */
export function getAllColorLegendCatalogIds(): NoteGroupingId[] {
  return NoteGroupingLibrary.getAllIds().filter(
    (id) =>
      id !== SpecialType.None &&
      id !== SpecialType.Note &&
      !isColorLegendExcluded(id),
  );
}
/**
 * Groups from the full catalog, filtered to buckets referenced by `displayIds`.
 * Each row includes all equivalent labels from the full map, not just display ids.
 */
export function getColorLegendGroupsForDisplay(displayIds: NoteGroupingId[]): ColorLegendGroup[] {
  const fullMap = buildColorLegendMap(getAllColorLegendCatalogIds());
  const displayBuckets = new Set(displayIds.map(legendBucketKey));

  return [...fullMap.entries()]
    .filter(([bucketKey]) => displayBuckets.has(bucketKey))
    .map(([, groupingIds]) => toColorLegendGroup(groupingIds))
    .sort((a, b) => minOrderId(a.groupingIds) - minOrderId(b.groupingIds));
}

export function isIntervalLegendGroup(group: ColorLegendGroup): boolean {
  return group.groupingIds.every(
    (id) => NoteGroupingLibrary.getGroupingById(id).numNotes === 2,
  );
}

/** Greedy nearest-neighbor ordering so perceptually similar swatches are adjacent. */
export function seriateLegendGroupsByDeltaE(groups: ColorLegendGroup[]): ColorLegendGroup[] {
  if (groups.length <= 1) return groups;

  const remaining = [...groups];
  remaining.sort((a, b) => chroma(a.color).lch()[2] - chroma(b.color).lch()[2]);

  const ordered: ColorLegendGroup[] = [remaining.shift()!];
  while (remaining.length > 0) {
    const last = chroma(ordered.at(-1)!.color);
    let bestIndex = 0;
    let bestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = chroma.deltaE(last, chroma(remaining[i]!.color));
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }

    ordered.push(remaining.splice(bestIndex, 1)[0]!);
  }

  return ordered;
}

export function adjacentDeltaESum(groups: ColorLegendGroup[]): number {
  let sum = 0;
  for (let i = 1; i < groups.length; i++) {
    sum += chroma.deltaE(chroma(groups[i - 1]!.color), chroma(groups[i]!.color));
  }
  return sum;
}

export function legendLabelsForGroup(group: ColorLegendGroup): string {  const seen = new Set<string>();
  const labels: string[] = [];

  for (const id of group.groupingIds) {
    const label = NoteGroupingLibrary.getGroupingById(id).shortForm;
    const dedupeKey = label.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    labels.push(label);
  }

  return labels.join(" · ");
}

export function legendTitleForGroup(group: ColorLegendGroup): string {
  const seen = new Set<string>();
  const titles: string[] = [];

  for (const id of group.groupingIds) {
    const title = NoteGroupingLibrary.getGroupingById(id).longForm;
    if (seen.has(title)) continue;
    seen.add(title);
    titles.push(title);
  }

  return titles.join(" · ");
}
