import { ixActualArray } from "@/types/IndexTypes";
import { DEFAULT_MUSICAL_KEY, MusicalKey } from "@/types/Keys/MusicalKey";
import { KeyType } from "@/types/enums/KeyType";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

describe("ChordProgressionResolver.computeProgressionOctaves", () => {
  function expectRoots(
    roman: string[],
    musicalKey: MusicalKey,
    expectedRoots: number[],
  ) {
    const romanChords = roman.map((r) =>
      RomanResolver.createRomanChordFromString(r),
    );
    const resolved = ChordProgressionResolver.computeProgressionOctaves(
      romanChords,
      musicalKey,
    );
    expect(resolved.map((chord) => chord[0])).toEqual(ixActualArray(expectedRoots));
  }

  it("returns empty array for empty progression", () => {
    expect(
      ChordProgressionResolver.computeProgressionOctaves(
        [],
        DEFAULT_MUSICAL_KEY,
      ),
    ).toEqual([]);
  });

  it("single chord returns the octave-0 variant when both sequences tie on movement", () => {
    expectRoots(["I"], DEFAULT_MUSICAL_KEY, [0]);
  });

  it("slash I/V: bass is scale degree V (G=7 in C major), not the chord root", () => {
    expectRoots(["I/V"], DEFAULT_MUSICAL_KEY, [7]);
  });

  describe("two-chord voice leading direction", () => {
    it("I→V: shortest circular path is descending, so high C (12) → low G (7) wins", () => {
      // seq1 totalMovement=5 beats seq0 totalMovement=7
      expectRoots(
        ["I", "V"],
        DEFAULT_MUSICAL_KEY,
        [12, 7],
      );
    });

    it("V→I: shortest circular path is ascending, so low G (7) → high C (12) wins", () => {
      // seq0 totalMovement=5 beats seq1 totalMovement=5 (tie, seq0 wins)
      expectRoots(
        ["V", "I"],
        DEFAULT_MUSICAL_KEY,
        [7, 12],
      );
    });
  });

  it("I→IV→V: ascending steps throughout, low-octave start (seq0) wins", () => {
    // seq0 totalMovement=7, seq1 totalMovement=9
    expectRoots(
      ["I", "IV", "V"],
      DEFAULT_MUSICAL_KEY,
      [0, 5, 7],
    );
  });

  it("I→vi→IV→V (50s progression): descending preference picks high-octave start (seq1 wins)", () => {
    // seq1: C(12)→Am(9)→F(5)→G(7), totalMovement=9 vs seq0 totalMovement=15
    expectRoots(
      ["I", "vi", "IV", "V"],
      DEFAULT_MUSICAL_KEY,
      [12, 9, 5, 7],
    );
  });

  describe("non-default keys", () => {
    it("D major: I→V chooses high D (14) → low A (9)", () => {
      // D=2, A=9. Descending preference makes seq1: 14→9 (5) beat seq0: 2→9 (7).
      expectRoots(
        ["I", "V"],
        MusicalKey.fromClassicalMode("D", KeyType.Major),
        [14, 9],
      );
    });

    it("F major: I→IV resolves to F→Bb in octave 0", () => {
      // F=5, Bb=10. Ascending preference; seq0 wins tie on movement.
      expectRoots(
        ["I", "IV"],
        MusicalKey.fromClassicalMode("F", KeyType.Major),
        [5, 10],
      );
    });
  });
});
