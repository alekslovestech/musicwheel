import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { RomanChord } from "@/types/RomanChord";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";

describe("RomanChordFormatter.formatRomanChord", () => {
  function expectProgressionLabel(
    scaleDegree: number,
    chordType: ChordType,
    expected: string,
    accidental: AccidentalType = AccidentalType.None,
    bassDegree?: number,
  ) {
    const chord = RomanChord.fromScaleDegree(scaleDegree, chordType, accidental, bassDegree);
    const actual = RomanChordFormatter.formatRomanChord(chord);
    expect(actual).toBe(expected);
  }

  it("formats triads", () => {
    expectProgressionLabel(1, ChordType.Major, "I");
    expectProgressionLabel(6, ChordType.Minor, "vi");
    expectProgressionLabel(7, ChordType.Major, "♭VII", AccidentalType.Flat);
    expectProgressionLabel(2, ChordType.Diminished, "ii°");
    expectProgressionLabel(1, ChordType.Augmented, "I+");
  });

  it("formats tetrachords", () => {
    expectProgressionLabel(1, ChordType.Major6, "I6");
    expectProgressionLabel(2, ChordType.Minor6, "ii6");
    expectProgressionLabel(1, ChordType.Dominant7, "I7");
    expectProgressionLabel(2, ChordType.Minor7, "ii7");
    expectProgressionLabel(1, ChordType.Major7, "IΔ7");

    expectProgressionLabel(7, ChordType.HalfDiminished, "viiø7");
    expectProgressionLabel(7, ChordType.Diminished7, "vii°7");
  });

  it("formats slash chords (bass numeral uppercase)", () => {
    // RomanChord stores bass as scale degree; I/V and I/v parse to the same structure.
    expectProgressionLabel(1, ChordType.Major, "I/V", AccidentalType.None, 5);
    expectProgressionLabel(3, ChordType.Minor7, "iii7/II", AccidentalType.None, 2);
  });
});
