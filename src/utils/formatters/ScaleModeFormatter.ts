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
        // Simplified quality: this feeds the wheel, where a label like "VIIsus2♯4" both
        // overflows and teaches notation the learner meets nowhere else. Full quality stays
        // in chord display and the progression UI, which have room for it.
        return RomanChordFormatter.formatRomanChordForDisplay(
          RomanChordFormatter.romanChordFromScaleDegree(scaleDegreeInfo, scaleModeInfo),
        );
      case KeyDisplayMode.RomanSeventh:
        // Numeral only, not full quality: this feeds the wheel, where a label like
        // "♭IIΔ7sus4" doesn't fit, and a bare "7" would be wrong on chords with no
        // literal 7th (e.g. Minor6, AugMajor7). Full quality lives in chord display and
        // the legend; color still distinguishes this from Triad mode on the wheel itself.
        return RomanChordFormatter.formatRomanNumeralOnly(
          RomanChordFormatter.romanChordFromScaleDegree(scaleDegreeInfo, scaleModeInfo, true),
        );
      default:
        return "???";
    }
  }
}
