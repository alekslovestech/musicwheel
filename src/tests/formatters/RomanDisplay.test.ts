import { SEVEN, TWELVE } from "@/types/constants/NoteConstants";
import { ixChromatic } from "@/types/ChromaticIndex";
import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { KeyboardUtils } from "@/utils/Keyboard/KeyboardUtils";

import { SCALE_MODE_REGISTRY } from "@/types/ScaleModes/ScaleModeRegistry";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { MusicalKeyNoteFormatter } from "@/utils/formatters/MusicalKeyNoteFormatter";
import { ScaleModeFormatter } from "@/utils/formatters/ScaleModeFormatter";
import { GreekTestConstants } from "../utils/GreekTestConstants";

function verifyRomanDisplayStrings(greekMode: ScaleModeType, expectedNotes: string[]) {
  expect(expectedNotes.length).toBe(SEVEN);
  const scaleModeInfo = SCALE_MODE_REGISTRY[greekMode];
  const romanDisplayStrings = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
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
    {
      mode: ScaleModeType.PhrygianDominant,
      expected: ["I", "♭II", "iii°", "iv", "v°", "♭VI+", "♭vii"],
    },
    {
      mode: ScaleModeType.DoubleHarmonicMajor,
      expected: ["I", "♭II", "iii", "iv", "V♭5", "♭VI+", "VIIsus2♯4"],
    },
    {
      mode: ScaleModeType.PanthuVaraali,
      expected: ["I", "♭IIsus", "iii", "♯IVsus2♯4", "V♭5", "♭VI+", "VIIsus2"],
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
          expected: ["I", "", "ii", "", "iii", "IV", "", "V", "", "vi", "", "vii°"],
        },
        {
          key: "D Ionian",
          musicalKey: constants.D_IONIAN_KEY,
          expected: ["", "vii°", "I", "", "ii", "", "iii", "IV", "", "V", "", "vi"],
        },
      ],
    },
    {
      desc: "Dorian Mode",
      cases: [
        {
          key: "C Dorian",
          musicalKey: constants.C_DORIAN_KEY,
          expected: ["i", "", "ii", "♭III", "", "IV", "", "v", "", "vi°", "♭VII", ""],
        },
        {
          key: "D Dorian",
          musicalKey: constants.D_DORIAN_KEY,
          expected: ["♭VII", "", "i", "", "ii", "♭III", "", "IV", "", "v", "", "vi°"],
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

describe("Roman Seventh label mode", () => {
  const constants = GreekTestConstants.getInstance();

  function verifySeventhDisplayStrings(greekMode: ScaleModeType, expectedNotes: string[]) {
    expect(expectedNotes.length).toBe(SEVEN);
    const romanDisplayStrings = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
      SCALE_MODE_REGISTRY[greekMode],
      KeyDisplayMode.RomanSeventh,
    );
    expect(romanDisplayStrings).toEqual(expectedNotes);
  }

  // Compact form: numeral + bare "7", quality dropped (wheel has no room, color conveys it).
  // Full quality (Δ7, ø7, ...) is what formatRomanChord produces for the roomy contexts
  // (chord display, legend) - this KeyDisplayMode only feeds the wheel.
  it("shows numeral + 7 for Ionian, not full seventh quality", () => {
    verifySeventhDisplayStrings(ScaleModeType.Ionian, [
      "I7",
      "ii7",
      "iii7",
      "IV7",
      "V7",
      "vi7",
      "vii7",
    ]);
  });

  it("shows numeral + 7 for Aeolian, not full seventh quality", () => {
    verifySeventhDisplayStrings(ScaleModeType.Aeolian, [
      "i7",
      "ii7",
      "♭III7",
      "iv7",
      "v7",
      "♭VI7",
      "♭VII7",
    ]);
  });

  it("differs from the triad labels on the dominant", () => {
    const triads = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
      SCALE_MODE_REGISTRY[ScaleModeType.Ionian],
      KeyDisplayMode.Roman,
    );
    const sevenths = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
      SCALE_MODE_REGISTRY[ScaleModeType.Ionian],
      KeyDisplayMode.RomanSeventh,
    );
    expect(triads[4]).toBe("V");
    expect(sevenths[4]).toBe("V7");
  });

  it("wheel uses roman labels for both chordal playback modes only", () => {
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.Triad)).toBe(true);
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.Seventh)).toBe(true);
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.SingleNote)).toBe(false);
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.DronedSingleNote)).toBe(false);
  });

  it("wheel label text for the dominant carries the seventh in Seventh mode", () => {
    const key = constants.C_IONIAN_KEY;
    // G is chromatic index 7 in C Ionian - the dominant.
    const labelIn = (mode: ScalePlaybackMode) =>
      KeyboardUtils.getNoteText(KeyboardUIType.Circular, ixChromatic(7), true, key, mode);

    expect(labelIn(ScalePlaybackMode.Triad)).toBe("V");
    expect(labelIn(ScalePlaybackMode.Seventh)).toBe("V7");
  });
});

describe("Panthu Varaali Roman Seventh labels (regression: bII7/#IV7/VII7 were Unknown)", () => {
  it("labels the diatonic seventh on every degree - no chord left unresolved", () => {
    const romanDisplayStrings = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
      SCALE_MODE_REGISTRY[ScaleModeType.PanthuVaraali],
      KeyDisplayMode.RomanSeventh,
    );
    // Compact form (see "Roman Seventh label mode" above): numeral + bare "7" everywhere,
    // regardless of what the actual chord quality is (Major7Sus4, Sus2Add6, ...) - this is
    // what makes ♭VI7 legible now too, sidestepping the AugMajor7 roman-quality gap entirely.
    expect(romanDisplayStrings).toEqual(["I7", "♭II7", "iii7", "♯IV7", "V7", "♭VI7", "VII7"]);
  });
});
