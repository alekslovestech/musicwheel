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
    test("labels each degree with numeral + bare 7, not full quality (ribbon is tight on space)", () => {
      // Textbook Ionian sevenths, plus the closing octave tonic. Compare to the Roman
      // Seventh case in RomanDisplay.test.ts, which shows full quality (Δ7, ø7, ...)
      // for the roomy contexts (chord display, legend).
      expect(labelsFor(cIonian, ScalePlaybackMode.Seventh)).toEqual([
        "I7",
        "ii7",
        "iii7",
        "IV7",
        "V7",
        "vi7",
        "vii7",
        "I7",
      ]);
    });

    test("labels natural minor sevenths, spelled relative to parallel major", () => {
      expect(labelsFor(aAeolian, ScalePlaybackMode.Seventh)).toEqual([
        "i7",
        "ii7",
        "♭III7",
        "iv7",
        "v7",
        "♭VI7",
        "♭VII7",
        "i7",
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
    test("Triad stays numeral-only so sevenths remain visually distinct", () => {
      expect(labelsFor(cIonian, ScalePlaybackMode.Triad)).toEqual([
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
