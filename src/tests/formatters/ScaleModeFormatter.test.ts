import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScaleModeLibrary } from "@/types/ScaleModes/ScaleModeLibrary";

import { ScaleModeFormatter } from "@/utils/formatters/ScaleModeFormatter";

function verifyModeScaleDegreeDisplayStrings(
  greekMode: ScaleModeType,
  expectedNotes: string[],
) {
  const greekModeInfo = ScaleModeLibrary.getModeInfo(greekMode);
  const displayStrings = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
    greekModeInfo,
    KeyDisplayMode.ScaleDegree,
  );
  expect(displayStrings).toEqual(expectedNotes);
}

describe("ScaleModeFormatter.formatAllScaleDegreesForDisplay", () => {
  describe("Greek Mode Patterns", () => {
    const modePatternCases = [
      {
        mode: ScaleModeType.Ionian,
        expected: ["1", "2", "3", "4", "5", "6", "7"],
      },
      {
        mode: ScaleModeType.Dorian,
        expected: ["1", "2", "♭3", "4", "5", "6", "♭7"],
      },
      {
        mode: ScaleModeType.UkrainianDorian,
        expected: ["1", "2", "♭3", "♯4", "5", "6", "♭7"],
      },
      {
        mode: ScaleModeType.Phrygian,
        expected: ["1", "♭2", "♭3", "4", "5", "♭6", "♭7"],
      },
      {
        mode: ScaleModeType.Lydian,
        expected: ["1", "2", "3", "♯4", "5", "6", "7"],
      },
      {
        mode: ScaleModeType.Mixolydian,
        expected: ["1", "2", "3", "4", "5", "6", "♭7"],
      },
      {
        mode: ScaleModeType.Aeolian,
        expected: ["1", "2", "♭3", "4", "5", "♭6", "♭7"],
      },
      {
        mode: ScaleModeType.HarmonicMinor,
        expected: ["1", "2", "♭3", "4", "5", "♭6", "7"],
      },
      {
        mode: ScaleModeType.HungarianMinor,
        expected: ["1", "2", "♭3", "♯4", "5", "♭6", "7"],
      },
      {
        mode: ScaleModeType.Locrian,
        expected: ["1", "♭2", "♭3", "4", "♭5", "♭6", "♭7"],
      },
    ];

    modePatternCases.forEach(({ mode, expected }) => {
      test(`${mode} mode pattern`, () => {
        verifyModeScaleDegreeDisplayStrings(mode, expected);
      });
    });
  });
});
