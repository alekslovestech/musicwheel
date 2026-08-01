import { ChordType } from "@/types/enums/ChordType";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { RomanChord } from "@/types/RomanChord";
import { getRomanQuality } from "@/types/RomanQualityRegistry";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";
import { formatNumeralForDegree } from "@/types/RomanTypes";
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

  static getSeventhChordType(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
  ): ChordType {
    const offsets = scaleModeInfo.getSeventhOffsets(scaleDegreeInfo);
    return NoteGroupingLibrary.matchChordTypeFromOffsets(offsets);
  }

  /** @param includeSeventh Build the 1-3-5-7 stack instead of the triad (Seventh playback mode). */
  static romanChordFromScaleDegree(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
    includeSeventh = false,
  ): RomanChord {
    const chordType = includeSeventh
      ? this.getSeventhChordType(scaleDegreeInfo, scaleModeInfo)
      : this.getTriadChordType(scaleDegreeInfo, scaleModeInfo);
    return new RomanChord(scaleDegreeInfo.scaleDegree, chordType, scaleDegreeInfo.accidentalPrefix);
  }

  /**
   * Progression / parser vocabulary (7, maj7, dim, slash bass), for chord-progression UI
   * and stable labels. Scale-mode UI uses {@link romanChordFromScaleDegree} via ScaleModeFormatter.
   * @param includeBass When true, appends slash-bass (e.g. `/ii`). Default false for compact display.
   */
  static formatRomanChord(romanChord: RomanChord, includeBass = false): string {
    const accidentalString = AccidentalFormatter.getAccidentalSignForDisplay(romanChord.accidental);
    const { suffix: chordPostfix, isLowerCase } = getRomanQuality(romanChord.chordType);
    const romanNumeralString = formatNumeralForDegree(romanChord.scaleDegree, isLowerCase);
    const bassSuffix =
      includeBass && romanChord.bassDegree !== undefined
        ? `/${formatNumeralForDegree(romanChord.bassDegree, false)}`
        : "";
    return `${accidentalString}${romanNumeralString}${chordPostfix}${bassSuffix}`;
  }

  /**
   * Numeral + case only (no quality postfix or bass), for compact UI where color already
   * conveys chord quality — e.g. the wheel and ribbon in Seventh playback mode, where a
   * partial marker like a bare "7" would be actively wrong on chords like Minor6 or
   * AugMajor7 that surface no literal 7th. Also used for Triad-mode ribbon labels.
   */
  static formatRomanNumeralOnly(romanChord: RomanChord): string {
    const accidentalString = AccidentalFormatter.getAccidentalSignForDisplay(romanChord.accidental);
    const { isLowerCase } = getRomanQuality(romanChord.chordType);
    return `${accidentalString}${formatNumeralForDegree(romanChord.scaleDegree, isLowerCase)}`;
  }
}
