import { ChordType } from "@/types/enums/ChordType";
import {
  getColorLegendGroupsForIds,
  getJoinedColorLegendGroupsForIds,
  getSeventhLegendGroups,
  legendLabelForGroup,
} from "@/utils/visual/colorLegendGroups";
import { getIntervalTypesForScaleFromRoot } from "@/utils/visual/scaleRibbonUtils";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { ChordSetUtils } from "@/utils/ChordSetUtils";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

/** What harmony mode's Chords legend shows: the preset buttons, joined by color. */
const chordPresetLegend = () =>
  getJoinedColorLegendGroupsForIds(new Set(NoteGroupingLibrary.getVisiblePresetIds(false)));

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

  it("gives same-colored qualities separate rows when both are present", () => {
    // A scale or progression names a short, known list, so each quality is spelled out even
    // where two share a swatch. Only the full catalog legend joins them.
    const groups = getColorLegendGroupsForIds(new Set([ChordType.Minor7, ChordType.Major6]));
    expect(groups.map((group) => group.groupingIds)).toEqual([
      [ChordType.Minor7],
      [ChordType.Major6],
    ]);
  });

  describe("legendLabelForGroup", () => {
    const labelFor = (...ids: ChordType[]) =>
      getColorLegendGroupsForIds(new Set(ids)).map(legendLabelForGroup);

    it("spells out the chord symbol a lone quality is written with elsewhere", () => {
      expect(labelFor(ChordType.Diminished)).toEqual(["dim (°)"]);
      expect(labelFor(ChordType.Augmented)).toEqual(["Aug (+)"]);
      expect(labelFor(ChordType.HalfDiminished)).toEqual(["m7♭5 (ø7)"]);
      expect(labelFor(ChordType.Major7)).toEqual(["Maj7 (Δ7)"]);
    });

    it("adds nothing when there is no second spelling to teach", () => {
      // Major's chord symbol is the empty suffix, and Dominant7/Sus2 write the same either
      // way - a parenthetical there would just repeat the row.
      expect(labelFor(ChordType.Major)).toEqual(["Maj"]);
      expect(labelFor(ChordType.Dominant7)).toEqual(["7"]);
      expect(labelFor(ChordType.Sus2)).toEqual(["sus2"]);
    });

    it("spells out both when a scale holds two same-colored qualities", () => {
      // Split rows are what let each carry its symbol; Major6 writes "6" either way.
      expect(labelFor(ChordType.Minor7, ChordType.Major6)).toEqual(["min7 (m7)", "6"]);
    });

    it("leaves the preset legend's joined rows short-form only", () => {
      // The preset legends are the only ones that still join, and "min7 (m7)·6" reads as noise.
      const presetLegend = chordPresetLegend().map(legendLabelForGroup);
      expect(presetLegend).toContain("min7·6");
      expect(presetLegend).toContain("dim (°)");
    });
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
    const groups = getColorLegendGroupsForIds(
      new Set([ChordType.Major7Flat5, ChordType.Dominant7, ChordType.Sus4, ChordType.Augmented]),
    );

    expect(groups.map((group) => group.groupingIds[0])).toEqual([
      ChordType.Augmented,
      ChordType.Sus4,
      ChordType.Dominant7,
      ChordType.Major7Flat5,
    ]);
  });

  it("scopes the harmony-mode legend to the preset buttons", () => {
    const rows = chordPresetLegend().flatMap((group) => group.groupingIds);

    expect(rows).toContain(ChordType.Major);
    expect(rows).toContain(ChordType.Diminished);
    // Hidden from the preset picker, so the legend explaining that picker must not list it.
    expect(rows).not.toContain(ChordType.Major7Flat5);
    expect(rows).not.toContain(ChordType.Sus2sharp4);
  });

  describe("Seventh-mode legend", () => {
    const seventhsByDegree = (mode: ScaleModeType) =>
      ChordSetUtils.seventhsByDegree(MusicalKey.fromGreekMode("C", mode));

    const legendRows = (mode: ScaleModeType) =>
      getSeventhLegendGroups([...seventhsByDegree(mode).keys()]).map(legendLabelForGroup);

    it("orders rows by the degree each quality first appears on", () => {
      // Scale order, not catalog order, so the rows run in the same direction as the ribbon.
      // The degrees themselves are not rendered - only the ordering they impose survives.
      expect(legendRows(ScaleModeType.Ionian)).toEqual(["Δ7", "m7", "7", "ø7"]);
    });

    it("labels with the chord symbol alone - seventh names are the catalog's longest", () => {
      // "maj7sus4 (Δ7sus4)" is the shape this replaces.
      expect(legendRows(ScaleModeType.PanthuVaraali)).toEqual([
        "Δ7",
        "Δ7sus4",
        "m6",
        "7sus2♭5",
        "Δ7♭5",
        "+Δ7",
        "6sus2",
      ]);
    });

    it("collects the degrees that share a quality", () => {
      expect(seventhsByDegree(ScaleModeType.Ionian).get(ChordType.Minor7)).toEqual([
        "ii",
        "iii",
        "vi",
      ]);
    });

    it("resolves inverted stacks that root-position lookup cannot", () => {
      // Hungarian Minor's ♯IV stacks to F♯ A♭ C E♭ = [0,2,6,9] - A♭7 voiced from its 7th, so
      // it once resolved to Unknown and vanished from the legend entirely.
      expect(seventhsByDegree(ScaleModeType.HungarianMinor).get(ChordType.Dominant7)).toEqual([
        "♯IV",
      ]);
      expect(seventhsByDegree(ScaleModeType.DoubleHarmonicMajor).get(ChordType.Dominant7)).toEqual([
        "VII",
      ]);
    });

    it("maps every degree of the scale to some quality", () => {
      for (const mode of [
        ScaleModeType.Ionian,
        ScaleModeType.HungarianMinor,
        ScaleModeType.DoubleHarmonicMajor,
        ScaleModeType.PanthuVaraali,
      ]) {
        expect([...seventhsByDegree(mode).values()].flat()).toHaveLength(7);
      }
    });
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
