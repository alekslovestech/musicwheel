import { ChordType } from "@/types/enums/ChordType";
import { NoteGroupingType } from "@/types/enums/NoteGroupingType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { AppColor } from "@/utils/visual/AppColor";

/** {@link ChordType} declaration order; Unknown omitted. */
export const CHORD_CATALOG_ORDER: readonly ChordType[] = (
  Object.values(ChordType) as ChordType[]
).filter((id) => id !== ChordType.Unknown);

export interface ColorLegendGroup {
  color: AppColor;
  groupingIds: NoteGroupingId[];
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
