import { ixScaleDegree, ScaleDegree } from "./ScaleModes/ScaleDegreeType";

export type RomanNumeralString =
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

export const UPPER_ROMAN_NUMERALS: RomanNumeralString[] = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
];

export const LOWER_ROMAN_NUMERALS: RomanNumeralString[] = [
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
];

export function formatNumeralForDegree(
  degree: ScaleDegree,
  isLowerCase: boolean,
): RomanNumeralString {
  const idx = Number(degree) - 1;
  return isLowerCase ? LOWER_ROMAN_NUMERALS[idx] : UPPER_ROMAN_NUMERALS[idx];
}

export function scaleDegreeFromRomanNumeral(roman: string): ScaleDegree | undefined {
  const idx = UPPER_ROMAN_NUMERALS.indexOf(roman.toUpperCase() as RomanNumeralString);
  return idx === -1 ? undefined : ixScaleDegree(idx + 1);
}

export function isLowercaseRomanNumeral(numeral: string): boolean {
  return numeral.toLowerCase() === numeral;
}

export const isRoman = (numeral: string): boolean =>
  UPPER_ROMAN_NUMERALS.includes(numeral.toUpperCase() as RomanNumeralString);

export function ixRomanString(numeral: string): RomanNumeralString {
  if (!isRoman(numeral)) {
    throw new Error("Invalid Roman Numeral");
  }
  return numeral as RomanNumeralString;
}
