import { ChromaticIndex } from "@/types/ChromaticIndex";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { ScaleDegreeInfo } from "./ScaleDegreeInfo";
import { ScaleDegreeIndex } from "./ScaleDegreeType";

/**
 * Common surface MusicalKey needs from a scale, diatonic (ScaleModeInfo) or not (OtherScaleInfo),
 * so it can treat the two polymorphically instead of branching on which one it has. Diatonic-only
 * operations (triads/sevenths as ScaleDegreeInfo, Ionian-relative lookups) stay on ScaleModeInfo
 * itself - see MusicalKey.scaleModeInfo for those; getOffsets here still covers Triad/Seventh for
 * the diatonic case, it's just that OtherScaleInfo has none to offer and throws instead.
 */
export interface IScaleInfo {
  readonly length: number;
  getAbsoluteScaleNotes(tonicIndex: ChromaticIndex): ChromaticIndex[];
  isInScale(chromaticIndex: ChromaticIndex, tonicIndex: ChromaticIndex): boolean;
  getScaleDegreeInfoFromChromatic(
    chromaticIndex: ChromaticIndex,
    tonicIndex: ChromaticIndex,
  ): ScaleDegreeInfo | null;
  getScaleDegreeInfoFromPosition(position: ScaleDegreeIndex): ScaleDegreeInfo;
  getOffsets(scaleDegreeIndex: ScaleDegreeIndex, mode: ScalePlaybackMode): number[];
  getStepOffsets(): number[];
}
