import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { RomanChord } from "@/types/RomanChord";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";

describe("RomanChordFormatter.formatProgressionRomanChord", () => {
  function expectProgressionLabel(chord: RomanChord, expected: string) {
    expect(RomanChordFormatter.formatProgressionRomanChord(chord)).toBe(
      expected,
    );
  }

  it("formats triads and sevenths like progression input", () => {
    expectProgressionLabel(RomanChord.fromScaleDegree(1, ChordType.Major), "I");
    expectProgressionLabel(
      RomanChord.fromScaleDegree(6, ChordType.Minor),
      "vi",
    );
    expectProgressionLabel(
      RomanChord.fromScaleDegree(1, ChordType.Dominant7),
      "I7",
    );
    expectProgressionLabel(
      RomanChord.fromScaleDegree(1, ChordType.Major7),
      "Imaj7",
    );
    expectProgressionLabel(
      RomanChord.fromScaleDegree(7, ChordType.Major, AccidentalType.Flat),
      "♭VII",
    );
    expectProgressionLabel(
      RomanChord.fromScaleDegree(1, ChordType.Augmented),
      "I+",
    );
  });

  it("formats slash chords (bass numeral uppercase)", () => {
    // RomanChord stores bass as scale degree; I/V and I/v parse to the same structure.
    expectProgressionLabel(
      RomanChord.fromScaleDegree(1, ChordType.Major, AccidentalType.None, 5),
      "I/V",
    );
  });
});
