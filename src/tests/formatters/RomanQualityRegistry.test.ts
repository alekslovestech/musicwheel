import { ChordType } from "@/types/enums/ChordType";
import {
  DEFAULT_ROMAN_QUALITY,
  EXOTIC_QUALITY_MARKER,
  getRomanQuality,
  getRomanQualityForDisplay,
  resolveRomanQuality,
} from "@/types/RomanQualityRegistry";
import { makeRomanChord } from "../utils/RomanTestUtils";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

/**
 * Qualities outside roman-numeral vocabulary. The last four are writable as chord symbols,
 * but nobody analyses a progression as `V♭5` or `i(add4)` - see the rule on ROMAN_QUALITY.
 */
const EXOTIC_TYPES: ChordType[] = [
  ChordType.Sus2sharp4,
  ChordType.Sus2_4,
  ChordType.Dominant7Sus2Flat5,
  ChordType.Major7Sus4,
  ChordType.Sus2Add6,
  ChordType.MajFlat5,
  ChordType.Dominant7Flat5,
  ChordType.Major7Flat5,
  ChordType.Narrow_b3_4,
];

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

  it("marks exactly the qualities outside roman vocabulary - no more, no fewer", () => {
    const marked = Object.values(ChordType).filter(
      (chordType) => getRomanQualityForDisplay(chordType).suffix === EXOTIC_QUALITY_MARKER,
    );

    expect(marked.sort()).toEqual([...EXOTIC_TYPES].sort());
  });

  it("marks for display only, leaving the suffix that encodes and parses untouched", () => {
    expect(EXOTIC_TYPES.map((chordType) => getRomanQuality(chordType).suffix)).toEqual([
      "sus2♯4",
      "sus24",
      "7sus2♭5",
      "Δ7sus4",
      "6sus2",
      "♭5",
      "7♭5",
      "Δ7♭5",
      "add4",
    ]);
  });

  it("keeps the qualities roman analysis actually names", () => {
    const shown = (chordType: ChordType) => getRomanQualityForDisplay(chordType).suffix;

    expect(shown(ChordType.Major)).toBe("");
    expect(shown(ChordType.Minor)).toBe("");
    expect(shown(ChordType.Diminished)).toBe("°");
    expect(shown(ChordType.Augmented)).toBe("+");
    expect(shown(ChordType.Dominant7)).toBe("7");
    expect(shown(ChordType.Major7)).toBe("Δ7");
    expect(shown(ChordType.HalfDiminished)).toBe("ø7");
    expect(shown(ChordType.Diminished7)).toBe("°7");
    expect(shown(ChordType.Major6)).toBe("6");
    // Not classical vocabulary, but "no 3rd" is a real category - and a genuine sus2 has to
    // stay distinguishable from the exotics sharing its wheel.
    expect(shown(ChordType.Sus4)).toBe("sus");
    expect(shown(ChordType.Sus2)).toBe("sus2");
  });

  it("resolves every parseable token unambiguously", () => {
    // resolveRomanQuality scans the table and takes the first match, so two qualities sharing
    // a (case, token) pair would make one unreachable. Nothing warns if that happens - hence
    // this check rather than a comment.
    const seen = new Map<string, ChordType>();

    for (const chordType of Object.values(ChordType)) {
      const spec = getRomanQuality(chordType);
      // Unmapped types all share the DEFAULT_ROMAN_QUALITY object, and would otherwise look
      // like a pile of collisions on (false, ""). Identity separates them from real entries.
      if (spec === DEFAULT_ROMAN_QUALITY) continue;

      for (const token of [spec.suffix, ...(spec.parseTokens ?? [])]) {
        const key = `${spec.isLowerCase}:${token}`;
        expect([key, seen.get(key)]).toEqual([key, undefined]);
        seen.set(key, chordType);
        expect(resolveRomanQuality(spec.isLowerCase, token)).toBe(chordType);
      }
    }

    expect(seen.size).toBeGreaterThan(20);
  });

  it("keeps the display marker out of the parser", () => {
    // The marker is display-only and deliberately ambiguous - it must never resolve to a
    // chord type, or parsing would silently pick one of the five exotics it stands for.
    expect(resolveRomanQuality(false, EXOTIC_QUALITY_MARKER)).toBe(ChordType.Unknown);
    expect(resolveRomanQuality(true, EXOTIC_QUALITY_MARKER)).toBe(ChordType.Unknown);
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
