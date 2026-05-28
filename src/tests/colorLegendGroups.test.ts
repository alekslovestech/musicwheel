import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import {
  adjacentDeltaESum,
  buildColorLegendMap,
  ColorLegendGroup,
  getAllColorLegendCatalogIds,
  getColorLegendGroupsForDisplay,
  isIntervalLegendGroup,
  legendBucketKey,
  legendLabelsForGroup,
  seriateLegendGroupsByDeltaE,
} from "@/components/ColorLegend/colorLegendGroups";
import {
  COLOR_LEGEND_CHORD_DISPLAY_IDS,
  COLOR_LEGEND_DISPLAY_IDS,
} from "@/components/ColorLegend/colorLegendEntries";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";

describe("colorLegendGroups", () => {
  let catalogMap: Map<string, NoteGroupingId[]>;

  beforeEach(() => {
    catalogMap = buildColorLegendMap(getAllColorLegendCatalogIds());
  });

  function idsInBucket(id: NoteGroupingId): NoteGroupingId[] {
    return catalogMap.get(legendBucketKey(id)) ?? [];
  }

  function expectSameBucket(...ids: NoteGroupingId[]) {
    const keys = new Set(ids.map(legendBucketKey));
    expect(keys.size).toBe(1);
    const bucket = idsInBucket(ids[0]!);
    for (const id of ids) {
      expect(bucket).toContain(id);
    }
  }

  function expectDistinctBuckets(a: NoteGroupingId, b: NoteGroupingId) {
    expect(legendBucketKey(a)).not.toBe(legendBucketKey(b));
    expect(idsInBucket(a)).not.toContain(b);
    expect(idsInBucket(b)).not.toContain(a);
  }

  function singleDisplayGroup(id: NoteGroupingId) {
    const groups = getColorLegendGroupsForDisplay([id]);
    expect(groups).toHaveLength(1);
    return groups[0]!;
  }

  describe("buildColorLegendMap", () => {
    it("groups inverse intervals under the same bucket", () => {
      expectSameBucket(IntervalType.Minor2, IntervalType.Major7);
    });

    it("groups equivalent chord types under the same bucket", () => {
      expectSameBucket(ChordType.Sus2, ChordType.Sus4);
    });

    it("does not group intervals with chords that share the same rgb", () => {
      expectSameBucket(IntervalType.Major3, IntervalType.Minor6);
      expectDistinctBuckets(IntervalType.Major3, ChordType.Augmented);
    });
  });

  describe("getColorLegendGroupsForDisplay", () => {
    it("returns one group per display bucket", () => {
      const groups = getColorLegendGroupsForDisplay(COLOR_LEGEND_DISPLAY_IDS);
      const displayBuckets = new Set(COLOR_LEGEND_DISPLAY_IDS.map(legendBucketKey));

      expect(groups.length).toBe(displayBuckets.size);
    });

    it("includes all equivalent labels from the full catalog, not just display ids", () => {
      const labels = legendLabelsForGroup(singleDisplayGroup(IntervalType.Minor2));
      expect(labels).toContain("m2");
      expect(labels).toContain("M7");
    });

    it("dedupes labels that only differ by case", () => {
      expect(legendLabelsForGroup(singleDisplayGroup(ChordType.Major))).toBe("Maj");
    });

    it("dedupes spread variants with identical short labels", () => {
      expect(legendLabelsForGroup(singleDisplayGroup(ChordType.Minor))).toBe("min");
    });

    it("includes all interval buckets when displaying every interval", () => {
      const intervalIds = COLOR_LEGEND_DISPLAY_IDS.filter(
        (id) => NoteGroupingLibrary.getGroupingById(id).numNotes === 2,
      );
      const groups = getColorLegendGroupsForDisplay(intervalIds);
      expect(groups.length).toBeGreaterThanOrEqual(7);
    });

    it("does not attach spread chord labels to standard triads", () => {
      expect(legendLabelsForGroup(singleDisplayGroup(ChordType.Major))).toBe("Maj");
    });
  });

  describe("seriateLegendGroupsByDeltaE", () => {
    let chordGroups: ColorLegendGroup[];

    beforeEach(() => {
      chordGroups = getColorLegendGroupsForDisplay(COLOR_LEGEND_CHORD_DISPLAY_IDS).filter(
        (group) => !isIntervalLegendGroup(group),
      );
    });

    it("preserves all groups", () => {
      const seriated = seriateLegendGroupsByDeltaE(chordGroups);
      expect(seriated).toHaveLength(chordGroups.length);
      expect(new Set(seriated.map((group) => group.color))).toEqual(
        new Set(chordGroups.map((group) => group.color)),
      );
    });

    it("reduces total adjacent deltaE versus catalog order", () => {
      const catalogAdjacent = adjacentDeltaESum(chordGroups);
      const seriatedAdjacent = adjacentDeltaESum(seriateLegendGroupsByDeltaE(chordGroups));
      expect(seriatedAdjacent).toBeLessThanOrEqual(catalogAdjacent);
    });
  });
});
