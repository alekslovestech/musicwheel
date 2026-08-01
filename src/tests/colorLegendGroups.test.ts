import { ChordType } from "@/types/enums/ChordType";
import { getColorLegendGroups, getColorLegendGroupsForIds } from "@/utils/visual/colorLegendGroups";
import { getIntervalTypesForScaleFromRoot } from "@/utils/visual/scaleRibbonUtils";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { ChordSetUtils } from "@/utils/ChordSetUtils";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

describe("getColorLegendGroupsForIds", () => {
  // Minor7 and Major6 render as the same color (a catalog-wide coincidence), and so do
  // HalfDiminished (m7♭5) and Minor6. Regression: a scale/progression that only contains one
  // half of such a pair must not pull the other half in just because they share a color bucket.
  it("labels a lone Minor7 by itself, not joined with same-color Major6", () => {
    const groups = getColorLegendGroupsForIds(new Set([ChordType.Minor7]));
    expect(groups).toHaveLength(1);
    expect(groups[0]!.groupingIds).toEqual([ChordType.Minor7]);
  });

  it("labels a lone HalfDiminished by itself, not joined with same-color Minor6", () => {
    const groups = getColorLegendGroupsForIds(new Set([ChordType.HalfDiminished]));
    expect(groups).toHaveLength(1);
    expect(groups[0]!.groupingIds).toEqual([ChordType.HalfDiminished]);
  });

  it("still joins Minor7 and Major6 when both are actually present", () => {
    const groups = getColorLegendGroupsForIds(new Set([ChordType.Minor7, ChordType.Major6]));
    expect(groups).toHaveLength(1);
    expect(groups[0]!.groupingIds).toEqual([ChordType.Minor7, ChordType.Major6]);
  });

  // Regression: intervals sorted by catalog orderId, which pairs each with its inversion
  // (m2 beside M7), so a scale's intervals came out scrambled - Hungarian Minor read
  // "M7, M2, m3, m6, P5, TT" instead of climbing away from the tonic.
  it("orders the drone legend's intervals by distance from the root", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
    const groups = getColorLegendGroupsForIds(getIntervalTypesForScaleFromRoot(key));

    const labels = groups.map((group) =>
      group.groupingIds.map((id) => NoteGroupingLibrary.getGroupingById(id).shortForm).join("·"),
    );
    // Hungarian Minor is [0, 2, 3, 6, 7, 8, 11] semitones from the root.
    expect(labels).toEqual(["M2", "m3", "TT", "P5", "m6", "M7"]);
  });

  // Regression: chords used to sort by ChordType declaration order, which stranded sus4/sus2
  // after every seventh chord and put exotics like Δ7♭5 ahead of them. Catalog orderId groups
  // them with the triads they belong to.
  it("orders sus triads with the triads, ahead of sevenths and exotics", () => {
    const indexOfRowContaining = (id: ChordType) =>
      getColorLegendGroups().findIndex((g) => g.groupingIds.includes(id));

    expect(indexOfRowContaining(ChordType.Sus4)).toBeGreaterThan(
      indexOfRowContaining(ChordType.Augmented),
    );
    expect(indexOfRowContaining(ChordType.Sus4)).toBeLessThan(
      indexOfRowContaining(ChordType.Dominant7),
    );
    expect(indexOfRowContaining(ChordType.Sus4)).toBeLessThan(
      indexOfRowContaining(ChordType.Major7Flat5),
    );
  });

  it("C Ionian's diatonic sevenths each get their own row (regression case)", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
    const groups = getColorLegendGroupsForIds(ChordSetUtils.seventhTypesForKey(key));
    const groupingIdLists = groups.map((g) => g.groupingIds);

    expect(groupingIdLists).toContainEqual([ChordType.Minor7]);
    expect(groupingIdLists).toContainEqual([ChordType.HalfDiminished]);
    expect(groupingIdLists.every((ids) => ids.length === 1)).toBe(true);
  });
});
