import {
  ixScaleDegreeIndex,
  scaleDegreeIndexToDegree,
  scaleDegreeToIndex,
  ScaleDegree,
} from "./ScaleModes/ScaleDegreeType";

type RomanNumeralString =
  | "I"
  | "II"
  | "III"
  | "IV"
  | "V"
  | "VI"
  | "VII"
  | "i"
  | "ii"
  | "iii"
  | "iv"
  | "v"
  | "vi"
  | "vii";

const UPPER_ROMAN_NUMERALS: RomanNumeralString[] = ["I", "II", "III", "IV", "V", "VI", "VII"];

const LOWER_ROMAN_NUMERALS: RomanNumeralString[] = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

export function formatNumeralForDegree(
  degree: ScaleDegree,
  isLowerCase: boolean,
): RomanNumeralString {
  const idx = scaleDegreeToIndex(degree);
  return isLowerCase ? LOWER_ROMAN_NUMERALS[idx] : UPPER_ROMAN_NUMERALS[idx];
}

export function scaleDegreeFromRomanNumeral(roman: string): ScaleDegree | undefined {
  const idx = UPPER_ROMAN_NUMERALS.indexOf(roman.toUpperCase() as RomanNumeralString);
  return idx === -1 ? undefined : scaleDegreeIndexToDegree(ixScaleDegreeIndex(idx));
}

export function isLowercaseRomanNumeral(numeral: string): boolean {
  return numeral.toLowerCase() === numeral;
}


