import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";

import {
  ixScaleDegreeIndex,
  ScaleDegree,
  ScaleDegreeIndex,
  ixScaleDegree,
} from "./ScaleModes/ScaleDegreeType";

export class RomanChord {
  //implements IRomanChord {
  scaleDegree: ScaleDegree;
  chordType: ChordType;
  accidental: AccidentalType;
  bassDegree: number | undefined;
  constructor(
    scaleDegree: ScaleDegree,
    chordType: ChordType,
    accidental: AccidentalType = AccidentalType.None,
    bassDegree: number | undefined = undefined,
  ) {
    this.scaleDegree = scaleDegree;
    this.chordType = chordType;
    this.accidental = accidental;
    this.bassDegree = bassDegree;
  }

  static fromScaleDegree(
    scaleDegree: number,
    chordType: ChordType,
    accidental: AccidentalType = AccidentalType.None,
    bassScaleDegree: number | undefined = undefined,
  ): RomanChord {
    const bass =
      bassScaleDegree !== undefined
        ? ixScaleDegree(bassScaleDegree)
        : undefined;
    return new RomanChord(
      ixScaleDegree(scaleDegree),
      chordType,
      accidental,
      bass,
    );
  }

  get scaleDegreeIndex(): ScaleDegreeIndex {
    return ixScaleDegreeIndex(this.scaleDegree - 1);
  }

  static fromRoman(roman: string): ScaleDegree | undefined {
    const normalized = roman.toUpperCase();
    switch (normalized) {
      case "I":
        return ixScaleDegree(1);
      case "II":
        return ixScaleDegree(2);
      case "III":
        return ixScaleDegree(3);
      case "IV":
        return ixScaleDegree(4);
      case "V":
        return ixScaleDegree(5);
      case "VI":
        return ixScaleDegree(6);
      case "VII":
        return ixScaleDegree(7);
      default:
        return undefined;
    }
  }

  /**
   * Checks if a Roman numeral string is lowercase.
   * @param numeral The Roman numeral string to check
   * @returns True if the numeral is lowercase, false otherwise
   */
  static isLowercaseRomanNumeral(numeral: string): boolean {
    return numeral.toLowerCase() === numeral;
  }

  /**
   * Determines the chord type based on whether the Roman numeral is lowercase and its suffix.
   * @param isLowercase Whether the Roman numeral is lowercase
   * @param suffix The chord suffix (e.g., "", "7", "maj7", "dim")
   * @returns The determined chord type
   */
  static determineChordType(isLowercase: boolean, suffix: string): ChordType {
    let chordType: ChordType;
    switch (suffix) {
      case "":
        chordType = isLowercase ? ChordType.Minor : ChordType.Major;
        break;
      case "7":
        chordType = isLowercase ? ChordType.Minor7 : ChordType.Dominant7;
        break;
      case "maj7":
        chordType = isLowercase ? ChordType.Unknown : ChordType.Major7;
        break;
      case "o":
      case "dim":
        chordType = isLowercase ? ChordType.Diminished : ChordType.Unknown;
        break;
      case "o7":
      case "dim7":
        chordType = isLowercase ? ChordType.Diminished7 : ChordType.Unknown;
        break;
      case "aug":
      case "+":
        chordType = isLowercase ? ChordType.Unknown : ChordType.Augmented;
        break;
      case "ø7":
        chordType = isLowercase ? ChordType.HalfDiminished : ChordType.Unknown;
        break;
      default:
        chordType = ChordType.Unknown;
    }

    return chordType;
  }
}
