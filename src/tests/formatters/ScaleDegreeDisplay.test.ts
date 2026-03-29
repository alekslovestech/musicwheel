import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { TWELVE } from "@/types/constants/NoteConstants";

import { MusicalKeyFormatter } from "@/utils/formatters/MusicalKeyFormatter";
import { GreekTestConstants } from "../utils/GreekTestConstants";

function verifyScaleDegreesArray(
  musicalKey: MusicalKey,
  expectedArray: string[],
) {
  expect(expectedArray.length).toBe(TWELVE);

  const displayStrings = MusicalKeyFormatter.formatAllNotesForDisplay(
    musicalKey,
    KeyDisplayMode.ScaleDegree,
  );
  expect(displayStrings).toEqual(expectedArray);
}
describe("Scale Degree Display", () => {
  describe("Scale Degree Arrays", () => {
    let constants: GreekTestConstants;

    beforeEach(() => {
      constants = GreekTestConstants.getInstance();
    });

    const scaleCases = [
      {
        desc: "Ionian (Major) Scale",
        cases: [
          {
            key: "C Ionian",
            musicalKey: () => constants.C_IONIAN_KEY,
            expected: ["1", "", "2", "", "3", "4", "", "5", "", "6", "", "7"],
          },
          {
            key: "D Ionian",
            musicalKey: () => constants.D_IONIAN_KEY,
            expected: ["", "7", "1", "", "2", "", "3", "4", "", "5", "", "6"],
          },
        ],
      },
      {
        desc: "Dorian Mode",
        cases: [
          {
            key: "C Dorian",
            musicalKey: () => constants.C_DORIAN_KEY,
            expected: ["1", "", "2", "♭3", "", "4", "", "5", "", "6", "♭7", ""],
          },
          {
            key: "D Dorian",
            musicalKey: () => constants.D_DORIAN_KEY,
            expected: ["♭7", "", "1", "", "2", "♭3", "", "4", "", "5", "", "6"],
          },
        ],
      },
    ];

    scaleCases.forEach(({ desc, cases }) => {
      describe(desc, () => {
        cases.forEach(({ key, musicalKey, expected }) => {
          it(`should display correct scale degrees for ${key}`, () => {
            verifyScaleDegreesArray(musicalKey(), expected);
          });
        });
      });
    });
  });
});
