import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";

import { RomanChordFormatter } from "./RomanChordFormatter";
import { ScaleDegreeFormatter } from "./ScaleDegreeFormatter";

export class ScaleModeFormatter {
  static formatAllScaleDegreesForDisplay(
    scaleModeInfo: ScaleModeInfo,
    keyTextMode: KeyDisplayMode,
  ): string[] {
    return Array.from({ length: scaleModeInfo.getScalePatternLength() }, (_, i) => {
      const scaleDegreeInfo = scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i));
      return this.formatScaleDegreeForDisplay(scaleModeInfo, scaleDegreeInfo, keyTextMode);
    });
  }

  static formatScaleDegreeForDisplay(
    scaleModeInfo: ScaleModeInfo,
    scaleDegreeInfo: ScaleDegreeInfo,
    keyTextMode: KeyDisplayMode,
  ): string {
    switch (keyTextMode) {
      case KeyDisplayMode.ScaleDegree:
        return ScaleDegreeFormatter.formatForDisplay(scaleDegreeInfo);
      case KeyDisplayMode.Roman:
        return RomanChordFormatter.formatRomanChord(
          RomanChordFormatter.romanChordFromScaleDegree(scaleDegreeInfo, scaleModeInfo),
        );
      default:
        return "???";
    }
  }
}
