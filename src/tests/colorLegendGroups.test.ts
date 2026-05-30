import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { NoteGroupingType } from "@/types/enums/NoteGroupingType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import {
  ColorLegendGroup,
  getColorLegendSections,
  legendLabelsForGroup,
} from "@/components/ColorLegend/colorLegendGroups";
import { colorCss } from "@/utils/visual/AppColor";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";

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

function buildColorLegendMap(ids: NoteGroupingId[]): Map<string, NoteGroupingId[]> {
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

function colorLegendDisplayIds(): NoteGroupingId[] {
  const { intervals, chords } = getColorLegendSections();
  return [...intervals, ...chords].flatMap((group) => group.groupingIds);
}

function groupsForDisplayIds(displayIds: NoteGroupingId[]): ColorLegendGroup[] {
  const fullMap = buildColorLegendMap(colorLegendDisplayIds());
  const displayBuckets = new Set(displayIds.map(legendBucketKey));

  return [...fullMap.entries()]
    .filter(([bucketKey]) => displayBuckets.has(bucketKey))
    .map(([, groupingIds]) => toColorLegendGroup(groupingIds))
    .sort((a, b) => minOrderId(a.groupingIds) - minOrderId(b.groupingIds));
}

describe("colorLegendGroups", () => {
  let catalogMap: Map<string, NoteGroupingId[]>;
  let displayIds: NoteGroupingId[];

  beforeEach(() => {
    displayIds = colorLegendDisplayIds();
    catalogMap = buildColorLegendMap(displayIds);
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
    const groups = groupsForDisplayIds([id]);
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

  describe("color legend display groups", () => {
    it("returns one group per display bucket", () => {
      const groups = groupsForDisplayIds(displayIds);
      const displayBuckets = new Set(displayIds.map(legendBucketKey));

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
      const intervalIds = displayIds.filter((id) => isIntervalType(id));
      const groups = groupsForDisplayIds(intervalIds);
      const displayBuckets = new Set(intervalIds.map(legendBucketKey));

      expect(groups.length).toBe(displayBuckets.size);
      expect(intervalIds).not.toContain(IntervalType.Octave);
    });

    it("does not attach spread chord labels to standard triads", () => {
      expect(legendLabelsForGroup(singleDisplayGroup(ChordType.Major))).toBe("Maj");
    });
  });
});
