import { ChordType } from "@/types/enums/ChordType";
import {
  getColorLegendGroupsForIds,
  getDegreeLabelledLegendGroups,
  getJoinedColorLegendGroupsForIds,
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

  describe("getDegreeLabelledLegendGroups", () => {
    const degreeRows = (mode: ScaleModeType) =>
      getDegreeLabelledLegendGroups(
        ChordSetUtils.seventhsByDegree(MusicalKey.fromGreekMode("C", mode)),
      ).map((group) => `${group.degrees!.join(",")} ${legendLabelForGroup(group)}`);

    it("keeps scale order and groups degrees sharing a quality", () => {
      // The wheel shows I ii iii IV V vi vii with no quality in Seventh mode, so these rows
      // are the only thing saying what sits on each degree. ii/iii/vi share one row rather
      // than repeating an identical swatch three times.
      expect(degreeRows(ScaleModeType.Ionian)).toEqual([
        "I,IV Δ7",
        "ii,iii,vi m7",
        "V 7",
        "vii ø7",
      ]);
    });

    it("labels with chord symbols, not preset short forms", () => {
      // Δ7 over Maj7, ø7 over m7♭5 - shorter, and the notation chord names already use.
      const panthuVaraali = degreeRows(ScaleModeType.PanthuVaraali);
      expect(panthuVaraali).toContain("I Δ7");
      expect(panthuVaraali).toContain("♭II Δ7sus4");
      expect(panthuVaraali).toContain("♯IV 7sus2♭5");
    });

    it("names inverted stacks by their quality, without flagging the inversion", () => {
      // Hungarian Minor's ♯IV stacks to F♯ A♭ C E♭ = [0,2,6,9] - A♭7 voiced from its 7th, so
      // root-position lookup called it Unknown and dropped the row entirely. The inversion
      // itself goes unmentioned: it changes neither the quality nor the swatch color.
      expect(degreeRows(ScaleModeType.HungarianMinor)).toContain("♯IV 7");
      expect(degreeRows(ScaleModeType.DoubleHarmonicMajor)).toContain("VII 7");
    });

    it("accounts for every degree of the scale", () => {
      for (const mode of [
        ScaleModeType.Ionian,
        ScaleModeType.HungarianMinor,
        ScaleModeType.DoubleHarmonicMajor,
        ScaleModeType.PanthuVaraali,
      ]) {
        const degrees = degreeRows(mode).flatMap((row) => row.split(" ")[0]!.split(","));
        expect(degrees).toHaveLength(7);
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
