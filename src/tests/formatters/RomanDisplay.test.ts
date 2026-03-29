import { SEVEN, TWELVE } from "@/types/constants/NoteConstants";
import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

import { ScaleModeLibrary } from "@/types/ScaleModes/ScaleModeLibrary";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { MusicalKeyNoteFormatter } from "@/utils/formatters/MusicalKeyNoteFormatter";
import { ScaleModeFormatter } from "@/utils/formatters/ScaleModeFormatter";
import { GreekTestConstants } from "../utils/GreekTestConstants";

function verifyRomanDisplayStrings(
  greekMode: ScaleModeType,
  expectedNotes: string[],
) {
  expect(expectedNotes.length).toBe(SEVEN);
  const scaleModeInfo = ScaleModeLibrary.getModeInfo(greekMode);
  const romanDisplayStrings =
    ScaleModeFormatter.formatAllScaleDegreesForDisplay(
      scaleModeInfo,
      KeyDisplayMode.Roman,
    );

  expect(romanDisplayStrings).toEqual(expectedNotes);
}

function verifyRomanArray(musicalKey: MusicalKey, expectedArray: string[]) {
  expect(expectedArray.length).toBe(TWELVE);

  const displayStrings = MusicalKeyNoteFormatter.formatAllNotesForDisplay(
    musicalKey,
    KeyDisplayMode.Roman,
  );
  expect(displayStrings).toEqual(expectedArray);
}

describe("Roman Mode Index Arrays", () => {
  const modePatternCases = [
    {
      mode: ScaleModeType.Ionian,
      expected: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
    },
    {
      mode: ScaleModeType.Dorian,
      expected: ["i", "ii", "♭III", "IV", "v", "vi°", "♭VII"],
    },
    {
      mode: ScaleModeType.Phrygian,
      expected: ["i", "♭II", "♭III", "iv", "v°", "♭VI", "♭vii"],
    },
    {
      mode: ScaleModeType.PhrygianDominant,
      expected: ["I", "♭II", "iii°", "iv", "v°", "♭VI+", "♭vii"],
    },
    {
      mode: ScaleModeType.Byzantine,
      expected: ["I", "♭II", "iii", "iv", "V", "♭VI+", "VII"],
    },
    {
      mode: ScaleModeType.Lydian,
      expected: ["I", "II", "iii", "♯iv°", "V", "vi", "vii"],
    },
    {
      mode: ScaleModeType.Mixolydian,
      expected: ["I", "ii", "iii°", "IV", "v", "vi", "♭VII"],
    },
    {
      mode: ScaleModeType.Aeolian,
      expected: ["i", "ii°", "♭III", "iv", "v", "♭VI", "♭VII"],
    },
    {
      mode: ScaleModeType.Locrian,
      expected: ["i°", "♭II", "♭iii", "iv", "♭V", "♭VI", "♭vii"],
    },
  ];

  describe("verifyFromPattern", () => {
    modePatternCases.forEach(({ mode, expected }) => {
      test(`${mode} mode pattern`, () => {
        verifyRomanDisplayStrings(mode, expected);
      });
    });
  });
});

describe("getScaleDegreeDisplayString", () => {
  const constants = GreekTestConstants.getInstance();

  const scaleCases = [
    {
      desc: "Ionian (Major) Scale",
      cases: [
        {
          key: "C Ionian",
          musicalKey: constants.C_IONIAN_KEY,
          expected: [
            "I",
            "",
            "ii",
            "",
            "iii",
            "IV",
            "",
            "V",
            "",
            "vi",
            "",
            "vii°",
          ],
        },
        {
          key: "D Ionian",
          musicalKey: constants.D_IONIAN_KEY,
          expected: [
            "",
            "vii°",
            "I",
            "",
            "ii",
            "",
            "iii",
            "IV",
            "",
            "V",
            "",
            "vi",
          ],
        },
      ],
    },
    {
      desc: "Dorian Mode",
      cases: [
        {
          key: "C Dorian",
          musicalKey: constants.C_DORIAN_KEY,
          expected: [
            "i",
            "",
            "ii",
            "♭III",
            "",
            "IV",
            "",
            "v",
            "",
            "vi°",
            "♭VII",
            "",
          ],
        },
        {
          key: "D Dorian",
          musicalKey: constants.D_DORIAN_KEY,
          expected: [
            "♭VII",
            "",
            "i",
            "",
            "ii",
            "♭III",
            "",
            "IV",
            "",
            "v",
            "",
            "vi°",
          ],
        },
      ],
    },
  ];

  scaleCases.forEach(({ desc, cases }) => {
    describe(desc, () => {
      cases.forEach(({ key, musicalKey, expected }) => {
        it(`should display correct scale degrees for ${key}`, () => {
          verifyRomanArray(musicalKey, expected);
        });
      });
    });
  });
});
