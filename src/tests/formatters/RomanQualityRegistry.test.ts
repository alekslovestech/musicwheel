import { ChordType } from "@/types/enums/ChordType";
import {
  getRomanQuality,
  resolveRomanQuality,
} from "@/types/RomanQualityRegistry";
import { RomanChord } from "@/types/RomanChord";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";

describe("RomanQualityRegistry", () => {
  it("encodes and decodes major/minor triads via case", () => {
    expect(getRomanQuality(ChordType.Major)).toEqual({ suffix: "", isLowerCase: false });
    expect(getRomanQuality(ChordType.Minor)).toEqual({ suffix: "", isLowerCase: true });
    expect(resolveRomanQuality(false, "")).toBe(ChordType.Major);
    expect(resolveRomanQuality(true, "")).toBe(ChordType.Minor);
  });

  it("round-trips progression types through format and parse", () => {
    const types = [
      ChordType.Major,
      ChordType.Minor,
      ChordType.Dominant7,
      ChordType.Minor7,
      ChordType.Major7,
      ChordType.Diminished,
      ChordType.Diminished7,
      ChordType.HalfDiminished,
      ChordType.Augmented,
      ChordType.MajFlat5,
      ChordType.Major6,
      ChordType.Minor6,
      ChordType.Sus4,
      ChordType.Sus2,
    ];

    for (const chordType of types) {
      const roman = RomanChord.fromScaleDegree(3, chordType);
      const formatted = RomanChordFormatter.formatRomanChord(roman);
      const parsed = RomanResolver.createRomanChordFromString(formatted);
      expect(parsed.chordType).toBe(chordType);
      expect(parsed.scaleDegree).toBe(roman.scaleDegree);
    }
  });

  it("accepts parse aliases from the registry", () => {
    expect(resolveRomanQuality(false, "maj7")).toBe(ChordType.Major7);
    expect(resolveRomanQuality(true, "dim")).toBe(ChordType.Diminished);
    expect(resolveRomanQuality(true, "o7")).toBe(ChordType.Diminished7);
    expect(resolveRomanQuality(false, "aug")).toBe(ChordType.Augmented);
  });
});
