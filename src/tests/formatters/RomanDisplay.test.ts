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
      // V is MajFlat5 and VII is Sus2sharp4: both outside roman vocabulary, both marked. The
      // degree still separates them, and ♭VI keeps "+" because augmented is roman vocabulary.
      expected: ["I", "♭II", "iii", "iv", "V*", "♭VI+", "VII*"],
    },
    {
      mode: ScaleModeType.PanthuVaraali,
      // ♯IV is Sus2sharp4 (1-2-♯4) and VII is a real Sus2 (1-2-5) - two different chords,
      // both diatonic here, so they must not share a label. Abbreviating ♯IV to "sus2" once
      // put the same string on both wheel positions; the marker keeps them apart.
      expected: ["I", "♭IIsus", "iii", "♯IV*", "V*", "♭VI+", "VIIsus2"],
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

  // Numeral only, no quality suffix: a bare "7" was tried and dropped - it misrepresented
  // chords with no literal 7th (Minor6, AugMajor7, ...; see the Panthu Varaali case below).
  // Full quality (Δ7, ø7, ...) is what formatRomanChord produces for the roomy contexts
  // (chord display, legend) - this KeyDisplayMode only feeds the wheel.
  it("shows numeral only for Ionian, not seventh quality", () => {
    verifySeventhDisplayStrings(ScaleModeType.Ionian, ["I", "ii", "iii", "IV", "V", "vi", "vii"]);
  });

  it("shows numeral only for Aeolian, not seventh quality", () => {
    verifySeventhDisplayStrings(ScaleModeType.Aeolian, [
      "i",
      "ii",
      "♭III",
      "iv",
      "v",
      "♭VI",
      "♭VII",
    ]);
  });

  it("matches Triad's numeral+case exactly, dropping only Roman's quality suffix", () => {
    // Roman (Triad) shows full quality on the wheel ("vii°"); RomanSeventh now shows just
    // the numeral+case portion of that same string, with nothing appended for Seventh mode.
    const sevenths = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
      SCALE_MODE_REGISTRY[ScaleModeType.Ionian],
      KeyDisplayMode.RomanSeventh,
    );
    expect(sevenths).toEqual(["I", "ii", "iii", "IV", "V", "vi", "vii"]);
  });

  it("wheel uses roman labels for both chordal playback modes only", () => {
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.Triad)).toBe(true);
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.Seventh)).toBe(true);
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.SingleNote)).toBe(false);
    expect(KeyboardUtils.usesRomanScaleLabels(ScalePlaybackMode.DronedSingleNote)).toBe(false);
  });

  it("wheel keeps Triad's short quality symbol but drops it for Seventh", () => {
    const key = constants.C_IONIAN_KEY;
    // B is chromatic index 11 in C Ionian - the leading tone (vii), a diminished triad.
    const labelIn = (mode: ScalePlaybackMode) =>
      KeyboardUtils.getNoteText(KeyboardUIType.Circular, ixChromatic(11), true, key, mode);

    expect(labelIn(ScalePlaybackMode.Triad)).toBe("vii°");
    expect(labelIn(ScalePlaybackMode.Seventh)).toBe("vii");
  });
});

describe("Panthu Varaali Roman Seventh labels (regression: bII7/#IV7/VII7 were Unknown)", () => {
  it("labels the diatonic seventh on every degree - no chord left unresolved", () => {
    const romanDisplayStrings = ScaleModeFormatter.formatAllScaleDegreesForDisplay(
      SCALE_MODE_REGISTRY[ScaleModeType.PanthuVaraali],
      KeyDisplayMode.RomanSeventh,
    );
    // Numeral only (see "Roman Seventh label mode" above): regardless of the actual chord
    // quality (Major7Sus4, Sus2Add6, ...), only the degree's numeral+case shows - this is
    // what makes ♭VI legible here too, sidestepping the AugMajor7 roman-quality gap entirely.
    expect(romanDisplayStrings).toEqual(["I", "♭II", "iii", "♯IV", "V", "♭VI", "VII"]);
  });
});
