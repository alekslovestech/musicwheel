import chroma from "chroma-js";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { NoteGroupingType } from "@/types/enums/NoteGroupingType";
import { SpecialType } from "@/types/enums/SpecialType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";

export interface ColorLegendGroup {
  color: chroma.Color;
  groupingIds: NoteGroupingId[];
}

export function getColorLegendGroups(): ColorLegendGroup[] {
  return buildColorLegendGroups();
}

/** Subset of the full legend: one row per color bucket that matches any of {@link displayIds}. */
export function getColorLegendGroupsForIds(displayIds: Set<NoteGroupingId>): ColorLegendGroup[] {
  return groupsForDisplayIds(displayIds);
}

function groupsForDisplayIds(displayIds: Set<NoteGroupingId>): ColorLegendGroup[] {
  const fullMap = buildColorLegendMap(COLOR_LEGEND_DISPLAY_IDS);
  const displayBuckets = new Set([...displayIds].map(legendBucketKey));

  const groups = [...fullMap.entries()]
    .filter(([bucketKey]) => displayBuckets.has(bucketKey))
    // A color bucket can hold catalog-wide ids that share this color (e.g. Minor7 and
    // Major6 render identically) but aren't all diatonic to the current scale/progression -
    // only label the ones actually being displayed, or a row for "min7" alone shows "min7·6".
    .map(([, groupingIds]) => toColorLegendGroup(groupingIds.filter((id) => displayIds.has(id))));

  return sortColorLegendGroups(groups);
}

function buildColorLegendMap(ids: Set<NoteGroupingId>): Map<string, NoteGroupingId[]> {
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

/** Spread, narrow, and hidden voicings omitted from the chord legend. */
const COLOR_LEGEND_EXCLUDED_CHORD_IDS: ReadonlySet<NoteGroupingId> = new Set([
  ChordType.SpreadMajor,
  ChordType.SpreadMinor,
  ChordType.SpreadAugmented,
  ChordType.SpreadDiminished,
  ChordType.Narrow23,
  ChordType.Narrow34,
  ChordType.Narrow_b3_4,
  ChordType.Add2,
  ChordType.Seven13,
]);

const COLOR_LEGEND_DISPLAY_IDS: Set<NoteGroupingId> = new Set(
  NoteGroupingLibrary.getAllIds().filter(isColorLegendId),
);

function isColorLegendId(id: NoteGroupingId): boolean {
  if (id === SpecialType.None || id === SpecialType.Note) return false;
  if (isIntervalType(id)) return id !== IntervalType.Octave;
  return !COLOR_LEGEND_EXCLUDED_CHORD_IDS.has(id);
}

function isIntervalLegendGroup(group: ColorLegendGroup): boolean {
  return isIntervalType(group.groupingIds[0]!);
}

function sortColorLegendGroups(groups: ColorLegendGroup[]): ColorLegendGroup[] {
  return [...groups].sort(compareColorLegendGroupOrder);
}

/**
 * Intervals first, ordered by distance from the root so they read as a ladder up the scale.
 * Catalog {@link NoteGrouping.orderId} cannot do that job for them - it pairs each interval
 * with its inversion (m2 beside M7), which scatters a scale's rungs.
 *
 * Chords have no such natural scalar, so they keep catalog order, which already encodes the
 * pedagogical sequence (triads, sus, sevenths, sixths, extended, exotic). Sorting chords by
 * `ChordType` declaration order instead used to strand sus4/sus2 after every seventh chord,
 * and put exotics like `Δ7♭5` ahead of plain `6`.
 */
function compareColorLegendGroupOrder(a: ColorLegendGroup, b: ColorLegendGroup): number {
  const aIsInterval = isIntervalLegendGroup(a);
  const bIsInterval = isIntervalLegendGroup(b);

  if (aIsInterval !== bIsInterval) {
    return aIsInterval ? -1 : 1;
  }

  return aIsInterval
    ? minSemitonesFromRoot(a.groupingIds) - minSemitonesFromRoot(b.groupingIds)
    : minOrderId(a.groupingIds) - minOrderId(b.groupingIds);
}

/** Interval groupings are `[0, semitones]`, so the second offset is the distance from root. */
function minSemitonesFromRoot(ids: NoteGroupingId[]): number {
  return Math.min(
    ...ids.map(function semitonesForInterval(id) {
      return NoteGroupingLibrary.getGroupingById(id).offsets[1];
    }),
  );
}

function minOrderId(ids: NoteGroupingId[]): number {
  return Math.min(
    ...ids.map(function orderIdForGrouping(id) {
      return NoteGroupingLibrary.getGroupingById(id).orderId;
    }),
  );
}

function legendBucketKey(id: NoteGroupingId): string {
  const color = getColorForGrouping(id);
  const type = isIntervalType(id) ? NoteGroupingType.Interval : NoteGroupingType.Chord;
  return `${type}:${color.css()}`;
}

function sortIdsByOrder(ids: NoteGroupingId[]): NoteGroupingId[] {
  return [...ids].sort(function compareByOrderId(a, b) {
    return (
      NoteGroupingLibrary.getGroupingById(a).orderId -
      NoteGroupingLibrary.getGroupingById(b).orderId
    );
  });
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

  const groups = [...map.values()].map(function toSortedColorLegendGroup(groupingIds) {
    return toColorLegendGroup(sortIdsByOrder(groupingIds));
  });

  return sortColorLegendGroups(groups);
}
