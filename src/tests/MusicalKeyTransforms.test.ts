import { MusicalKey } from "../types/Keys/MusicalKey";
import { KeyType } from "../types/enums/KeyType";
import { ScaleModeType } from "../types/enums/ScaleModeType";
import { GreekTestConstants } from "../tests/utils/GreekTestConstants";

const greekTestConstants = GreekTestConstants.getInstance();
describe("MusicalKey transforms", () => {
  describe("getOppositeKey", () => {
    const cases = [
      {
        desc: "C major => C minor",
        input: greekTestConstants.C_IONIAN_KEY,
        expected: MusicalKey.fromClassicalMode("C", KeyType.Minor),
      },
      {
        desc: "Db major => C# minor",
        input: MusicalKey.fromClassicalMode("Db", KeyType.Major),
        expected: MusicalKey.fromClassicalMode("C#", KeyType.Minor),
      },
      {
        desc: "Eb major => Eb minor",
        input: MusicalKey.fromClassicalMode("Eb", KeyType.Major),
        expected: MusicalKey.fromClassicalMode("Eb", KeyType.Minor),
      },
    ];

    cases.forEach(({ desc, input, expected }) => {
      it(desc, () => {
        expect(input.getOppositeKey()).toEqual(expected);
      });
    });
  });

  describe("getTransposedKey", () => {
    const cases = [
      {
        desc: "C major => Db major",
        input: greekTestConstants.C_IONIAN_KEY,
        semitones: 1,
        expected: MusicalKey.fromClassicalMode("Db", KeyType.Major),
      },
      {
        desc: "C Dorian => C# Dorian",
        input: greekTestConstants.C_DORIAN_KEY,
        semitones: 1,
        expected: MusicalKey.fromGreekMode("C#", ScaleModeType.Dorian),
      },
      {
        desc: "E Phrygian minor => F Phrygian minor",
        input: greekTestConstants.E_PHRYGIAN_KEY,
        semitones: 1,
        expected: MusicalKey.fromGreekMode("F", ScaleModeType.Phrygian),
      },
      {
        desc: "C major => B major",
        input: greekTestConstants.C_IONIAN_KEY,
        semitones: -1,
        expected: MusicalKey.fromClassicalMode("B", KeyType.Major),
      },
      {
        desc: "C Dorian => B Dorian",
        input: greekTestConstants.C_DORIAN_KEY,
        semitones: -1,
        expected: MusicalKey.fromGreekMode("B", ScaleModeType.Dorian),
      },
      {
        desc: "F Phrygian minor => E Phrygian minor",
        input: MusicalKey.fromGreekMode("F", ScaleModeType.Phrygian),
        semitones: -1,
        expected: MusicalKey.fromGreekMode("E", ScaleModeType.Phrygian),
      },
    ];

    cases.forEach(({ desc, input, semitones, expected }) => {
      it(desc, () => {
        expect(input.getTransposedKey(semitones)).toEqual(expected);
      });
    });
  });

  describe("getCanonicalIonianKey", () => {
    const cases = [
      {
        desc: "C major => C Ionian",
        input: greekTestConstants.C_IONIAN_KEY,
        expected: "C",
      },
      {
        desc: "D Dorian => C Ionian",
        input: greekTestConstants.D_DORIAN_KEY,
        expected: "C",
      },
      {
        desc: "E Phrygian => C Ionian",
        input: greekTestConstants.E_PHRYGIAN_KEY,
        expected: "C",
      },
      {
        desc: "C Lydian => G Ionian",
        input: greekTestConstants.C_LYDIAN_KEY,
        expected: "G",
      },
      {
        desc: "C Phrygian => Ab Ionian",
        input: greekTestConstants.C_PHRYGIAN_KEY,
        expected: "Ab",
      },
      {
        desc: "C double harmonic major => Ab Ionian",
        input: MusicalKey.fromGreekMode("C", ScaleModeType.DoubleHarmonicMajor),
        expected: "Ab",
      },
      {
        // Regression: this landed on the sole gap in MAJOR_KEY_SIGNATURES (no "Gb" entry, only
        // sharp-preferring "F#"), so the relative Ionian key was spelled with 6 sharps despite
        // Eb Aeolian's own key signature being 6 flats.
        desc: "Eb Aeolian => Gb Ionian (not F#, matching Eb minor's own flat key signature)",
        input: MusicalKey.fromGreekMode("Eb", ScaleModeType.Aeolian),
        expected: "Gb",
      },
    ];

    cases.forEach(({ desc, input, expected }) => {
      it(desc, () => {
        expect(input.getCanonicalIonianKey().tonicString).toEqual(expected);
      });
    });
  });

  describe("getStaffSpellingKey", () => {
    const cases = [
      {
        desc: "D Dorian => C Ionian (Greek mode)",
        input: greekTestConstants.D_DORIAN_KEY,
        expected: "C",
      },
      {
        desc: "C double harmonic major => A minor (best-fit exotic mode)",
        input: MusicalKey.fromGreekMode("C", ScaleModeType.DoubleHarmonicMajor),
        expected: "A",
      },
      {
        desc: "C Ukrainian Dorian => Bb major (best-fit exotic mode)",
        input: MusicalKey.fromGreekMode("C", ScaleModeType.UkrainianDorian),
        expected: "Bb",
      },
      {
        desc: "C Hungarian Minor => E minor (best-fit exotic mode)",
        input: MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor),
        expected: "E",
      },
      {
        desc: "Eb Aeolian => Gb major (Greek mode, respells to the flat side)",
        input: MusicalKey.fromGreekMode("Eb", ScaleModeType.Aeolian),
        expected: "Gb",
      },
    ];

    cases.forEach(({ desc, input, expected }) => {
      it(desc, () => {
        expect(input.getStaffSpellingKey().tonicString).toEqual(expected);
      });
    });

    it("Eb Aeolian's staff spelling key has the same 6 flats as its own key signature", () => {
      const ebAeolian = MusicalKey.fromGreekMode("Eb", ScaleModeType.Aeolian);
      expect(ebAeolian.getStaffSpellingKey().keySignature.getAccidentals()).toEqual(
        ebAeolian.keySignature.getAccidentals(),
      );
    });
  });

  describe("switching scale mode respells the tonic for the target classicalMode", () => {
    const cases = [
      {
        desc: "Db Ionian => Aeolian respells to C# Aeolian (Db isn't a legal minor tonic)",
        tonic: "Db",
        fromMode: ScaleModeType.Ionian,
        toMode: ScaleModeType.Aeolian,
        expectedTonic: "C#",
        expectedClassicalMode: KeyType.Minor,
      },
      {
        desc: "C# Aeolian => Ionian respells to Db Ionian (C# isn't a legal major tonic)",
        tonic: "C#",
        fromMode: ScaleModeType.Aeolian,
        toMode: ScaleModeType.Ionian,
        expectedTonic: "Db",
        expectedClassicalMode: KeyType.Major,
      },
      {
        desc: "C Ionian => Dorian keeps C (already legal for both)",
        tonic: "C",
        fromMode: ScaleModeType.Ionian,
        toMode: ScaleModeType.Dorian,
        expectedTonic: "C",
        expectedClassicalMode: KeyType.Minor,
      },
    ];

    cases.forEach(({ desc, tonic, fromMode, toMode, expectedTonic, expectedClassicalMode }) => {
      it(desc, () => {
        const original = MusicalKey.fromGreekMode(tonic, fromMode);
        const switched = MusicalKey.fromGreekMode(original.tonicString, toMode);
        expect(switched.tonicString).toBe(expectedTonic);
        expect(switched.classicalMode).toBe(expectedClassicalMode);
      });
    });
  });
});
