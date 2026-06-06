import { ChordType } from "@/types/enums/ChordType";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { RomanChord } from "@/types/RomanChord";
import { getRomanQuality } from "@/types/RomanQualityRegistry";
import type { ScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";
import { RomanNumeralString } from "@/types/RomanTypes";
import { AccidentalFormatter } from "./AccidentalFormatter";

/**
 * Builds display strings for {@link RomanChord} (accidental + numeral + diatonic-style postfix).
 */
export class RomanChordFormatter {
  static getTriadChordType(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
  ): ChordType {
    const offsets = scaleModeInfo.getTriadOffsets(scaleDegreeInfo);
    return NoteGroupingLibrary.matchChordTypeFromOffsets(offsets);
  }

  static romanChordFromScaleDegree(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
  ): RomanChord {
    return new RomanChord(
      scaleDegreeInfo.scaleDegree,
      this.getTriadChordType(scaleDegreeInfo, scaleModeInfo),
      scaleDegreeInfo.accidentalPrefix,
    );
  }

  /**
   * Progression / parser vocabulary (7, maj7, dim, slash bass), for chord-progression UI
   * and stable labels. Scale-mode UI uses {@link romanChordFromScaleDegree} via ScaleModeFormatter.
   */
  static formatRomanChord(romanChord: RomanChord, includesBass = true): string {
    const accidentalString = AccidentalFormatter.getAccidentalSignForDisplay(romanChord.accidental);
    const romanNumeralString = this.getProgressionRootNumeral(romanChord);
    const quality = getRomanQuality(romanChord.chordType);
    const chordPostfix = quality?.suffix ?? "";
    const bass =
      includesBass && romanChord.bassDegree !== undefined
        ? `/${this.bassNumeral(romanChord.bassDegree as ScaleDegree)}`
        : "";
    return `${accidentalString}${romanNumeralString}${chordPostfix}${bass}`;
  }

  private static getProgressionRootNumeral(romanChord: RomanChord): RomanNumeralString {
    const scaleDegreeIndex = romanChord.scaleDegreeIndex;
    const quality = getRomanQuality(romanChord.chordType);
    const isLowercase = quality?.isLowerCase ?? false;
    return isLowercase
      ? this.LOWER_ROMAN_NUMERALS[scaleDegreeIndex]
      : this.UPPER_ROMAN_NUMERALS[scaleDegreeIndex];
  }

  private static bassNumeral(degree: ScaleDegree): RomanNumeralString {
    const idx = Number(degree) - 1;
    return this.UPPER_ROMAN_NUMERALS[idx];
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
