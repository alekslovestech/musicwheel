import { ChordType } from "@/types/enums/ChordType";
import {
  DEFAULT_ROMAN_QUALITY,
  getRomanQuality,
  getRomanQualityForDisplay,
  resolveRomanQuality,
} from "@/types/RomanQualityRegistry";
import { makeRomanChord } from "../utils/RomanTestUtils";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

describe("RomanQualityRegistry", () => {
  it("encodes and decodes major/minor triads via case", () => {
    expect(getRomanQuality(ChordType.Major)).toEqual({ suffix: "", isLowerCase: false });
    expect(getRomanQuality(ChordType.Minor)).toEqual({ suffix: "", isLowerCase: true });
    expect(resolveRomanQuality(false, "")).toBe(ChordType.Major);
    expect(resolveRomanQuality(true, "")).toBe(ChordType.Minor);
  });

  it("returns default quality for unmapped chord types", () => {
    expect(getRomanQuality(ChordType.Unknown)).toEqual(DEFAULT_ROMAN_QUALITY);
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
      const roman = makeRomanChord(3, chordType);
      const formatted = RomanChordFormatter.formatRomanChord(roman);
      const parsed = RomanResolver.createRomanChordFromString(formatted);
      expect(parsed.chordType).toBe(chordType);
      expect(parsed.scaleDegree).toBe(roman.scaleDegree);
    }
  });

  it("simplifies third-less qualities for display, leaving the canonical suffix intact", () => {
    const simplified: [ChordType, string, string][] = [
      [ChordType.Sus2sharp4, "sus2♯4", "sus2"],
      [ChordType.Sus2Add6, "6sus2", "sus2"],
      [ChordType.Sus2_4, "sus24", "sus2"],
      [ChordType.Dominant7Sus2Flat5, "7sus2♭5", "sus2"],
      [ChordType.Major7Sus4, "Δ7sus4", "sus"],
    ];

    for (const [chordType, canonical, display] of simplified) {
      expect(getRomanQuality(chordType).suffix).toBe(canonical);
      expect(getRomanQualityForDisplay(chordType).suffix).toBe(display);
    }
  });

  it("keeps standard alteration notation on qualities that have a third", () => {
    for (const chordType of [ChordType.MajFlat5, ChordType.Dominant7Flat5, ChordType.Major7Flat5]) {
      expect(getRomanQualityForDisplay(chordType).suffix).toBe(getRomanQuality(chordType).suffix);
    }
  });

  it("never decodes a simplified display suffix back to the exotic chord type", () => {
    // Display simplification is lossy by design: "sus2" must stay Sus2, not become Sus2sharp4.
    expect(resolveRomanQuality(false, "sus2")).toBe(ChordType.Sus2);
    expect(resolveRomanQuality(false, "sus")).toBe(ChordType.Sus4);
  });

  it("accepts parse aliases from the registry", () => {
    expect(resolveRomanQuality(false, "maj7")).toBe(ChordType.Major7);
    expect(resolveRomanQuality(true, "dim")).toBe(ChordType.Diminished);
    expect(resolveRomanQuality(true, "o7")).toBe(ChordType.Diminished7);
    expect(resolveRomanQuality(false, "aug")).toBe(ChordType.Augmented);
  });
});
