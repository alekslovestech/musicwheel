import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import {
  buildScaleRibbonData,
  getIntervalTypesForScaleFromRoot,
  getStepColorLegendItems,
  getStepSegmentsForScale,
  ribbonUsesStepSegments,
} from "@/utils/visual/scaleRibbonUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

describe("buildScaleRibbonData", () => {
  const constants = GreekTestConstants.getInstance();
  const cIonian = constants.C_IONIAN_KEY;
  const aAeolian = constants.A_AEOLIAN_KEY;

  const labelsFor = (key: typeof cIonian, mode: ScalePlaybackMode): string[] =>
    buildScaleRibbonData(key, mode).notes.map((note) => note.label);

  describe("Seventh mode", () => {
    test("labels each degree with numeral only, not full quality (ribbon is tight on space)", () => {
      // Textbook Ionian sevenths, plus the closing octave tonic. Compare to the Roman
      // Seventh case in RomanDisplay.test.ts, which also drops quality on the wheel -
      // formatRomanChord (full quality: Δ7, ø7, ...) is reserved for chord display and
      // the legend, where there is room for it.
      expect(labelsFor(cIonian, ScalePlaybackMode.Seventh)).toEqual([
        "I",
        "ii",
        "iii",
        "IV",
        "V",
        "vi",
        "vii",
        "I",
      ]);
    });

    test("labels natural minor sevenths, spelled relative to parallel major", () => {
      expect(labelsFor(aAeolian, ScalePlaybackMode.Seventh)).toEqual([
        "i",
        "ii",
        "♭III",
        "iv",
        "v",
        "♭VI",
        "♭VII",
        "i",
      ]);
    });

    test("is a chord ribbon, not a step ribbon", () => {
      const ribbon = buildScaleRibbonData(cIonian, ScalePlaybackMode.Seventh);
      expect(ribbon.title).toBe("Sevenths");
      expect(ribbon.steps).toHaveLength(0);
      expect(ribbonUsesStepSegments(ScalePlaybackMode.Seventh)).toBe(false);
    });

    test("every degree carries a color", () => {
      const ribbon = buildScaleRibbonData(cIonian, ScalePlaybackMode.Seventh);
      expect(ribbon.notes.every((note) => note.color !== undefined)).toBe(true);
    });
  });

  describe("step labels", () => {
    // Regression: steps were labelled with interval short forms, which name a harmonic
    // function a step does not carry. Hungarian Minor's E♭-F♯ and A♭-B are augmented 2nds,
    // spelled as 2nds; as "m3" they had the right size under the wrong name. W/H/1½ measure
    // instead of spelling, so they stay true for any scale.
    test("measures steps rather than spelling them as intervals", () => {
      const hungarianMinor = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
      const labels = getStepSegmentsForScale(hungarianMinor).map((step) => step.label);

      // C D E♭ F♯ G A♭ B, wrapping B->C: 2 1 3 1 1 3 1 semitones.
      expect(labels).toEqual(["W", "H", "1½", "H", "H", "1½", "H"]);
    });

    test("labels the major scale's steps", () => {
      expect(getStepSegmentsForScale(cIonian).map((step) => step.label)).toEqual([
        "W",
        "W",
        "H",
        "W",
        "W",
        "W",
        "H",
      ]);
    });

    test("legend uses the same vocabulary as the ribbon, distinct steps only", () => {
      const hungarianMinor = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
      expect(getStepColorLegendItems(hungarianMinor).map((step) => step.label)).toEqual([
        "H",
        "W",
        "1½",
      ]);
    });
  });

  describe("getIntervalTypesForScaleFromRoot", () => {
    const shortFormsFor = (key: MusicalKey): string[] =>
      [...getIntervalTypesForScaleFromRoot(key)].map(
        (id) => NoteGroupingLibrary.getGroupingById(id).shortForm,
      );

    // Regression: these were folded to interval class first, which replaced every interval
    // above the tritone with its inversion - the drone legend advertised m2, M3 and P4 for a
    // scale containing none of them.
    test("names intervals above the tritone, not their inversions", () => {
      const hungarianMinor = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);

      // Hungarian Minor is [0, 2, 3, 6, 7, 8, 11] semitones from the root.
      expect(shortFormsFor(hungarianMinor).sort()).toEqual(
        ["M2", "m3", "TT", "P5", "m6", "M7"].sort(),
      );
    });

    test("names the plain major scale's intervals", () => {
      expect(shortFormsFor(cIonian).sort()).toEqual(["M2", "M3", "P4", "P5", "M6", "M7"].sort());
    });
  });

  describe("mode-to-ribbon association", () => {
    test("Triad and Seventh render identical numerals - only color and title distinguish them", () => {
      const triadLabels = labelsFor(cIonian, ScalePlaybackMode.Triad);
      expect(triadLabels).toEqual(["I", "ii", "iii", "IV", "V", "vi", "vii", "I"]);
      expect(labelsFor(cIonian, ScalePlaybackMode.Seventh)).toEqual(triadLabels);
    });

    test("only single-note playback is shown as W-H steps", () => {
      expect(ribbonUsesStepSegments(ScalePlaybackMode.SingleNote)).toBe(true);
      expect(ribbonUsesStepSegments(ScalePlaybackMode.Triad)).toBe(false);
      expect(ribbonUsesStepSegments(ScalePlaybackMode.DronedSingleNote)).toBe(false);

      expect(
        buildScaleRibbonData(cIonian, ScalePlaybackMode.SingleNote).steps.length,
      ).toBeGreaterThan(0);
    });
  });
});
