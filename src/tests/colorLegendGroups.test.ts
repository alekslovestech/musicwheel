import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import {
  getColorLegendGroups,
  getColorLegendGroupsForIds,
} from "@/components/ColorLegend/colorLegendGroups";
import { getTriadChordTypesForKey } from "@/components/ColorLegend/colorLegendSources";
import { expectSetsEqual } from "@/tests/utils/SetTestUtils";

describe("colorLegendGroups", () => {
  function singleDisplayGroup(id: NoteGroupingId) {
    const groups = getColorLegendGroupsForIds(new Set([id]));
    expect(groups).toHaveLength(1);
    return groups[0]!;
  }

  function allLegendGroupingIds(): Set<NoteGroupingId> {
    return new Set(getColorLegendGroups().flatMap((group) => group.groupingIds));
  }

  describe("color buckets", () => {
    it("groups inverse intervals under the same bucket", () => {
      const group = singleDisplayGroup(IntervalType.Minor2);
      expect(group.groupingIds).toEqual(
        expect.arrayContaining([IntervalType.Minor2, IntervalType.Major7]),
      );
      expect(singleDisplayGroup(IntervalType.Major7).groupingIds).toEqual(group.groupingIds);
    });

    it("groups equivalent chord types under the same bucket", () => {
      const group = singleDisplayGroup(ChordType.Sus2);
      expect(group.groupingIds).toEqual(expect.arrayContaining([ChordType.Sus2, ChordType.Sus4]));
      expect(singleDisplayGroup(ChordType.Sus4).groupingIds).toEqual(group.groupingIds);
    });

    it("does not group intervals with chords that share the same rgb", () => {
      const intervalGroup = singleDisplayGroup(IntervalType.Major3);
      expect(intervalGroup.groupingIds).toEqual(
        expect.arrayContaining([IntervalType.Major3, IntervalType.Minor6]),
      );
      expect(singleDisplayGroup(ChordType.Augmented).groupingIds).toEqual([ChordType.Augmented]);
      expect(singleDisplayGroup(ChordType.Augmented).groupingIds).not.toEqual(
        intervalGroup.groupingIds,
      );
    });

    it("includes all equivalent grouping ids from the full catalog, not just the query id", () => {
      expect(singleDisplayGroup(IntervalType.Minor2).groupingIds).toEqual(
        expect.arrayContaining([IntervalType.Minor2, IntervalType.Major7]),
      );
    });

    it("uses only standard triad ids for major and minor buckets", () => {
      expect(singleDisplayGroup(ChordType.Major).groupingIds).toEqual([ChordType.Major]);
      expect(singleDisplayGroup(ChordType.Minor).groupingIds).toEqual([ChordType.Minor]);
    });
  });

  describe("getColorLegendGroups", () => {
    it("returns one group per color bucket", () => {
      const groups = getColorLegendGroupsForIds(allLegendGroupingIds());
      expect(groups.map((group) => group.groupingIds)).toEqual(
        getColorLegendGroups().map((group) => group.groupingIds),
      );
    });

    it("includes every interval display bucket and excludes octave", () => {
      const groups = getColorLegendGroups();
      const intervalGroups = groups.filter((group) => isIntervalType(group.groupingIds[0]!));
      const intervalAnchorIds = new Set(intervalGroups.map((group) => group.groupingIds[0]!));

      expect(
        getColorLegendGroupsForIds(intervalAnchorIds).map((group) => group.groupingIds),
      ).toEqual(intervalGroups.map((group) => group.groupingIds));
      expect(allLegendGroupingIds().has(IntervalType.Octave)).toBe(false);
    });
  });

  describe("getColorLegendGroupsForIds", () => {
    it("returns the full legend when given every display id", () => {
      const filtered = getColorLegendGroupsForIds(allLegendGroupingIds());
      const full = getColorLegendGroups();

      expect(filtered.map((group) => group.groupingIds)).toEqual(
        full.map((group) => group.groupingIds),
      );
    });

    it("filters diatonic triads in Ionian", () => {
      const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
      const triadTypes = getTriadChordTypesForKey(key);

      expectSetsEqual(triadTypes, [ChordType.Major, ChordType.Minor, ChordType.Diminished]);

      const groups = getColorLegendGroupsForIds(triadTypes);
      expectSetsEqual(groups.flatMap((group) => group.groupingIds), triadTypes);
    });

    it("filters diatonic triads in Phrygian dominant", () => {
      const key = MusicalKey.fromGreekMode("C", ScaleModeType.PhrygianDominant);
      const triadTypes = getTriadChordTypesForKey(key);

      expectSetsEqual(triadTypes, [
        ChordType.Major,
        ChordType.Minor,
        ChordType.Diminished,
        ChordType.Augmented,
      ]);

      const groups = getColorLegendGroupsForIds(triadTypes);
      expectSetsEqual(groups.flatMap((group) => group.groupingIds), triadTypes);
    });

    it("filters diatonic triads in Hungarian minor", () => {
      const key = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
      const triadTypes = getTriadChordTypesForKey(key);

      expectSetsEqual(triadTypes, [
        ChordType.Major,
        ChordType.Minor,
        ChordType.MajFlat5,
        ChordType.Augmented,
        ChordType.Sus2sharp4,
      ]);

      const groups = getColorLegendGroupsForIds(triadTypes);
      expectSetsEqual(groups.flatMap((group) => group.groupingIds), triadTypes);
    });
  });
});
