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
  /** Scale degrees carrying this quality, on legends labelled by position rather than color. */
  degrees?: string[];
}

/**
 * Rows keyed by the degrees carrying each quality, kept in scale order. For Seventh mode,
 * where the wheel labels degrees with no quality at all - so a row's degrees are the only
 * thing tying it to a wheel position, and color, which converges as tetrads mix four interval
 * hues, cannot be the handle. Deliberately unsorted: scale order is the point.
 */
export function getDegreeLabelledLegendGroups(
  degreesByQuality: Map<ChordType, string[]>,
): ColorLegendGroup[] {
  return [...degreesByQuality].map(([chordType, degrees]) => ({
    ...toColorLegendGroup([chordType]),
    degrees,
  }));
}

/**
 * One row per id. A scale or progression holds a short, known list of qualities, so each is
 * worth naming even where two of them share a color - and being alone on a row is what lets a
 * quality carry its chord symbol (`m7♭5 (ø7)`).
 */
export function getColorLegendGroupsForIds(displayIds: Set<NoteGroupingId>): ColorLegendGroup[] {
  const groups = [...displayIds].filter(isColorLegendId).map((id) => toColorLegendGroup([id]));
  return sortColorLegendGroups(groups);
}

/**
 * One row per color, same-colored qualities sharing it. For the preset legends, where the list
 * runs long enough that a row each would swamp the panel, and where joining is itself worth
 * seeing - it is how the legend shows that inversions (m2·M7) resolve to one color.
 */
export function getJoinedColorLegendGroupsForIds(
  displayIds: Set<NoteGroupingId>,
): ColorLegendGroup[] {
  const byColor = new Map<string, NoteGroupingId[]>();
  for (const id of displayIds) {
    if (!isColorLegendId(id)) continue;
    const key = legendBucketKey(id);
    byColor.set(key, [...(byColor.get(key) ?? []), id]);
  }

  const groups = [...byColor.values()].map((ids) => toColorLegendGroup(sortIdsByOrder(ids)));
  return sortColorLegendGroups(groups);
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

/**
 * Row text for a legend entry. A lone quality spells out its chord symbol - `dim (°)` - since
 * bridging the legend's `shortForm` to the `symbolForm` shown on the wheel and in chord names
 * is the whole point of the legend, and a side panel has room the wheel does not.
 *
 * Rows holding several same-colored qualities stay short-form only: stacking parentheticals
 * (`min7 (m7)·6`) reads as noise, and which symbol belongs to which name stops being obvious.
 */
export function legendLabelForGroup(group: ColorLegendGroup): string {
  const ids = distinctByShortForm(group.groupingIds);
  // Degree-labelled rows carry chord-symbol notation alone (`Δ7`, not `Maj7 (Δ7)`): the
  // parenthetical bridges a legend row to the symbol on the wheel, and Seventh mode shows
  // none there, so it would teach a mapping with nothing on the other end.
  if (group.degrees) return NoteGroupingLibrary.getGroupingById(ids[0]!).symbolForm;
  if (ids.length === 1) return labelWithChordSymbol(ids[0]!);
  return ids.map((id) => NoteGroupingLibrary.getGroupingById(id).shortForm).join("·");
}

function labelWithChordSymbol(id: NoteGroupingId): string {
  const { shortForm, symbolForm } = NoteGroupingLibrary.getGroupingById(id);
  // Intervals set both forms alike, and Major's symbol is the empty suffix - neither has a
  // second spelling to teach, so neither takes a parenthetical.
  const addsSomething = symbolForm.length > 0 && symbolForm !== shortForm;
  return addsSomething ? `${shortForm} (${symbolForm})` : shortForm;
}

function distinctByShortForm(ids: NoteGroupingId[]): NoteGroupingId[] {
  const seen = new Set<string>();
  return ids.filter(function isFirstWithShortForm(id) {
    const key = NoteGroupingLibrary.getGroupingById(id).shortForm.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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
