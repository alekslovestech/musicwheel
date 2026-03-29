import { RomanChord } from "@/types/RomanChord";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";
import { RomanChordFormatter } from "./RomanChordFormatter";

export class RomanFormatter {
  static formatForDisplay(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
  ): string {
    const romanChord = this.fromScaleDegreeInfo(scaleDegreeInfo, scaleModeInfo);
    return RomanChordFormatter.formatRomanChord(romanChord);
  }

  private static fromScaleDegreeInfo(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
  ): RomanChord {
    const offsets = scaleModeInfo.getTriadOffsets(scaleDegreeInfo);
    const chordType = scaleModeInfo.determineChordType(offsets);

    return new RomanChord(
      scaleDegreeInfo.scaleDegree,
      chordType,
      scaleDegreeInfo.accidentalPrefix,
    );
  }
}
