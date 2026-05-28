import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import {
  getAllColorLegendCatalogIds,
  getColorLegendGroupsForDisplay,
  getColorLegendSections,
  legendLabelsForGroup,
} from "@/components/ColorLegend/colorLegendGroups";
import {
  buildColorLegendMap,
  CHORD_CATALOG_ORDER,
  ColorLegendGroup,
  isIntervalLegendGroup,
  legendBucketKey,
  sortChordLegendGroupsByCatalogOrder,
} from "@/utils/visual/ColorLegendGrouping";
import { COLOR_LEGEND_DISPLAY_IDS } from "@/components/ColorLegend/colorLegendEntries";

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

    it("includes all interval display buckets", () => {
      const intervalIds = COLOR_LEGEND_DISPLAY_IDS.filter((id) => isIntervalType(id));
      const groups = getColorLegendGroupsForDisplay(intervalIds);
      const displayBuckets = new Set(intervalIds.map(legendBucketKey));

      expect(groups.length).toBe(displayBuckets.size);
      expect(intervalIds).not.toContain(IntervalType.Octave);
    });

    it("does not attach spread chord labels to standard triads", () => {
      expect(legendLabelsForGroup(singleDisplayGroup(ChordType.Major))).toBe("Maj");
    });
  });

  describe("getColorLegendSections", () => {
    function expectedChordBucketOrder(displayIds: NoteGroupingId[]): string[] {
      const seen = new Set<string>();
      const order: string[] = [];

      for (const id of CHORD_CATALOG_ORDER) {
        if (!displayIds.includes(id)) continue;
        const key = legendBucketKey(id);
        if (seen.has(key)) continue;
        seen.add(key);
        order.push(key);
      }

      return order;
    }

    it("orders chord rows by ChordType catalog order", () => {
      const { chords } = getColorLegendSections();
      const bucketKeys = chords.map((group) => legendBucketKey(group.groupingIds[0]!));

      expect(bucketKeys).toEqual(expectedChordBucketOrder(COLOR_LEGEND_DISPLAY_IDS));
    });
  });

  describe("sortChordLegendGroupsByCatalogOrder", () => {
    function expectedChordBucketOrder(displayIds: NoteGroupingId[]): string[] {
      const seen = new Set<string>();
      const order: string[] = [];

      for (const id of CHORD_CATALOG_ORDER) {
        if (!displayIds.includes(id)) continue;
        const key = legendBucketKey(id);
        if (seen.has(key)) continue;
        seen.add(key);
        order.push(key);
      }

      return order;
    }

    let chordGroups: ColorLegendGroup[];

    beforeEach(() => {
      chordGroups = getColorLegendGroupsForDisplay(COLOR_LEGEND_DISPLAY_IDS).filter(
        (group) => !isIntervalLegendGroup(group),
      );
    });

    it("preserves all groups", () => {
      const sorted = sortChordLegendGroupsByCatalogOrder(chordGroups, COLOR_LEGEND_DISPLAY_IDS);
      expect(sorted).toHaveLength(chordGroups.length);
      expect(new Set(sorted.map((group) => group.color))).toEqual(
        new Set(chordGroups.map((group) => group.color)),
      );
    });

    it("orders chord rows by ChordType catalog order", () => {
      const sorted = sortChordLegendGroupsByCatalogOrder(chordGroups, COLOR_LEGEND_DISPLAY_IDS);
      const bucketKeys = sorted.map((group) => legendBucketKey(group.groupingIds[0]!));

      expect(bucketKeys).toEqual(expectedChordBucketOrder(COLOR_LEGEND_DISPLAY_IDS));
    });

    it("places duplicate-color buckets at the earliest ChordType anchor", () => {
      const sorted = sortChordLegendGroupsByCatalogOrder(chordGroups, COLOR_LEGEND_DISPLAY_IDS);
      const susBucket = sorted.find((group) => group.groupingIds.includes(ChordType.Sus2))!;
      const susIndex = sorted.indexOf(susBucket);

      expect(susBucket.groupingIds).toContain(ChordType.Sus4);
      expect(CHORD_CATALOG_ORDER.indexOf(ChordType.Sus4)).toBeLessThan(
        CHORD_CATALOG_ORDER.indexOf(ChordType.Sus2),
      );
      expect(susIndex).toBe(
        sorted.findIndex((group) => group.groupingIds.includes(ChordType.Sus4)),
      );
    });
  });
});
