import { ChordType } from "@/types/enums/ChordType";
import { RomanChord } from "@/types/RomanChord";
import type { ScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";
import { RomanNumeralString } from "@/types/RomanTypes";
import { AccidentalFormatter } from "./AccidentalFormatter";

/**
 * Builds display strings for {@link RomanChord} (accidental + numeral + diatonic-style postfix).
 */
export class RomanChordFormatter {
  /**
   * Progression / parser vocabulary (7, maj7, dim, slash bass), for chord-progression UI
   * and stable labels. Scale-mode UI continues to use {@link formatRomanChord}.
   */
  static formatProgressionRomanChord(romanChord: RomanChord): string {
    const accidentalString = AccidentalFormatter.getAccidentalSignForDisplay(
      romanChord.accidental,
    );
    const romanNumeralString = this.getProgressionRootNumeral(romanChord);
    const chordPostfix = this.getProgressionChordSuffix(romanChord.chordType);
    const bass =
      romanChord.bassDegree !== undefined
        ? `/${this.bassNumeral(romanChord.bassDegree as ScaleDegree)}`
        : "";
    return `${accidentalString}${romanNumeralString}${chordPostfix}${bass}`;
  }

  static formatRomanChord(romanChord: RomanChord): string {
    const accidentalString = AccidentalFormatter.getAccidentalSignForDisplay(
      romanChord.accidental,
    );
    const romanNumeralString = this.getScaleDegreeAsRomanString(romanChord);
    const chordPostfix = this.getProgressionChordSuffix(romanChord.chordType);

    return `${accidentalString}${romanNumeralString}${chordPostfix}`;
  }

  private static getProgressionRootNumeral(
    romanChord: RomanChord,
  ): RomanNumeralString {
    const scaleDegreeIndex = romanChord.scaleDegreeIndex;
    const isLowercase = this.progressionRootIsLowercase(romanChord.chordType);
    return isLowercase
      ? this.LOWER_ROMAN_NUMERALS[scaleDegreeIndex]
      : this.UPPER_ROMAN_NUMERALS[scaleDegreeIndex];
  }

  private static progressionRootIsLowercase(chordType: ChordType): boolean {
    return (
      chordType === ChordType.Minor ||
      chordType === ChordType.Minor7 ||
      chordType === ChordType.Diminished ||
      chordType === ChordType.Diminished7 ||
      chordType === ChordType.HalfDiminished
    );
  }

  private static getProgressionChordSuffix(chordType: ChordType): string {
    switch (chordType) {
      case ChordType.Major:
      case ChordType.Minor:
        return "";
      case ChordType.Dominant7:
        return "7";
      case ChordType.Minor7:
        return "min7";
      case ChordType.Major7:
        return "maj7";
      case ChordType.Diminished:
        return "°";
      case ChordType.Diminished7:
        return "°7";
      case ChordType.HalfDiminished:
        return "ø7";
      case ChordType.Augmented:
        return "+";
      default:
        return "";
    }
  }

  private static bassNumeral(degree: ScaleDegree): RomanNumeralString {
    const idx = Number(degree) - 1;
    return this.UPPER_ROMAN_NUMERALS[idx];
  }

  private static getScaleDegreeAsRomanString(
    romanChord: RomanChord,
  ): RomanNumeralString {
    const scaleDegreeIndex = romanChord.scaleDegreeIndex;
    const isLowercase =
      romanChord.chordType === ChordType.Minor ||
      romanChord.chordType === ChordType.Diminished;
    return isLowercase
      ? this.LOWER_ROMAN_NUMERALS[scaleDegreeIndex]
      : this.UPPER_ROMAN_NUMERALS[scaleDegreeIndex];
  }

  private static UPPER_ROMAN_NUMERALS: RomanNumeralString[] = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
  ];
  private static LOWER_ROMAN_NUMERALS: RomanNumeralString[] = [
    "i",
    "ii",
    "iii",
    "iv",
    "v",
    "vi",
    "vii",
  ];
}
