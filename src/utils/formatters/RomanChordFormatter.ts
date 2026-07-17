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
   * Numeral + case only (no quality postfix or bass), for compact UI where color
   * already conveys chord quality (e.g. the sequence legend ribbon).
   */
  static formatRomanNumeralOnly(romanChord: RomanChord): string {
    const accidentalString = AccidentalFormatter.getAccidentalSignForDisplay(romanChord.accidental);
    const { isLowerCase } = getRomanQuality(romanChord.chordType);
    return `${accidentalString}${formatNumeralForDegree(romanChord.scaleDegree, isLowerCase)}`;
  }
}
