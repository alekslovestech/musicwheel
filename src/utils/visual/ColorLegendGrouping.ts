import { ChordType } from "@/types/enums/ChordType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";

/** {@link ChordType} declaration order; Unknown omitted. */
export const CHORD_CATALOG_ORDER: readonly ChordType[] = (
  Object.values(ChordType) as ChordType[]
).filter((id) => id !== ChordType.Unknown);

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

export function isIntervalLegendGroup(group: ColorLegendGroup): boolean {
  return isIntervalType(group.groupingIds[0]!);
}

function chordCatalogIndex(id: NoteGroupingId): number {
  const index = CHORD_CATALOG_ORDER.indexOf(id as ChordType);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/**
 * Order chord legend rows by {@link ChordType} catalog order.
 * Color-equivalent buckets use the earliest display anchor in that order.
 */
export function sortChordLegendGroupsByCatalogOrder(
  groups: ColorLegendGroup[],
  displayIds: NoteGroupingId[],
): ColorLegendGroup[] {
  const displayIdSet = new Set(displayIds);

  const sortKey = (group: ColorLegendGroup): number => {
    const anchorIds = group.groupingIds.filter((id) => displayIdSet.has(id));
    const ids = anchorIds.length > 0 ? anchorIds : group.groupingIds;
    return Math.min(...ids.map(chordCatalogIndex));
  };

  return [...groups].sort((a, b) => sortKey(a) - sortKey(b));
}
