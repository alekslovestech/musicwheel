import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { buildScaleRibbonData, ribbonUsesStepSegments } from "@/utils/visual/scaleRibbonUtils";
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
