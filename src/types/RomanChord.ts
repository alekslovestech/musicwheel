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
    const bass = bassScaleDegree !== undefined ? ixScaleDegree(bassScaleDegree) : undefined;
    return new RomanChord(ixScaleDegree(scaleDegree), chordType, accidental, bass);
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
}
