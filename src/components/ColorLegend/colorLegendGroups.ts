import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { NoteGroupingType } from "@/types/enums/NoteGroupingType";
import { SpecialType } from "@/types/enums/SpecialType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { colorCss, AppColor } from "@/utils/visual/AppColor";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";

/** Spread, narrow, and hidden voicings omitted from the chord legend. */
const COLOR_LEGEND_EXCLUDED_CHORD_IDS: ReadonlySet<NoteGroupingId> = new Set([
  ChordType.SpreadMajor,
  ChordType.SpreadMinor,
  ChordType.SpreadAugmented,
  ChordType.SpreadDiminished,
  ChordType.Narrow23,
  ChordType.Narrow24,
  ChordType.Narrow34,
  ChordType.Narrow24sharp,
  ChordType.Narrow3flat4,
  ChordType.MajFlat5,
  ChordType.Add2,
  ChordType.Seven13,
]);

function isColorLegendId(id: NoteGroupingId): boolean {
  if (id === SpecialType.None || id === SpecialType.Note) return false;
  if (isIntervalType(id)) return id !== IntervalType.Octave;
  return !COLOR_LEGEND_EXCLUDED_CHORD_IDS.has(id);
}

const COLOR_LEGEND_DISPLAY_IDS: NoteGroupingId[] =
  NoteGroupingLibrary.getAllIds().filter(isColorLegendId);

/** {@link ChordType} declaration order; Unknown omitted. */
const CHORD_CATALOG_ORDER: readonly ChordType[] = (
  Object.values(ChordType) as ChordType[]
).filter((id) => id !== ChordType.Unknown);

export interface ColorLegendGroup {
  color: AppColor;
  groupingIds: NoteGroupingId[];
}

function isIntervalLegendGroup(group: ColorLegendGroup): boolean {
  return isIntervalType(group.groupingIds[0]!);
}

function sortChordLegendGroupsByCatalogOrder(
  groups: ColorLegendGroup[],
  displayIds: NoteGroupingId[],
): ColorLegendGroup[] {
  const displayIdSet = new Set(displayIds);

  const sortKey = (group: ColorLegendGroup): number => {
    const anchorIds = group.groupingIds.filter((id) => displayIdSet.has(id));
    const ids = anchorIds.length > 0 ? anchorIds : group.groupingIds;
    return Math.min(...ids.map((id) => CHORD_CATALOG_ORDER.indexOf(id as ChordType)));
  };

  return [...groups].sort((a, b) => sortKey(a) - sortKey(b));
}

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
