import { AccidentalType } from "@/types/enums/AccidentalType";
import { OtherScaleType } from "@/types/enums/OtherScaleType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { ChromaticIndex, subChromatic } from "@/types/ChromaticIndex";
import { IScaleInfo } from "@/types/ScaleModes/IScaleInfo";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ixScaleDegree, ScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";

import { SluggedEntry } from "@/utils/slug/slugCodec";

import { OtherScalePattern } from "./OtherScalePattern";

/**
 * A non-diatonic scale's identity: a name and a pattern, nothing else. No key signature, no
 * scale-degree chords - see {@link OtherScalePattern} for why those don't generalize here.
 */
export class OtherScaleInfo implements SluggedEntry, IScaleInfo {
  public readonly pattern: OtherScalePattern;

  constructor(
    public readonly type: OtherScaleType,
    public readonly name: string,
    public readonly slug: string,
    offsets: number[],
  ) {
    this.pattern = new OtherScalePattern(offsets);
  }

  public get length(): number {
    return this.pattern.length;
  }

  public getAbsoluteScaleNotes(tonicIndex: ChromaticIndex): ChromaticIndex[] {
    return this.pattern.getAbsoluteScaleNotes(tonicIndex);
  }

  public isInScale(chromaticIndex: ChromaticIndex, tonicIndex: ChromaticIndex): boolean {
    return this.getAbsoluteScaleNotes(tonicIndex).includes(chromaticIndex);
  }

  /** Plain scale-degree number (1..N), no accidental - there's no diatonic reference to spell it against. */
  public getScaleDegreeInfoFromChromatic(
    chromaticIndex: ChromaticIndex,
    tonicIndex: ChromaticIndex,
  ): ScaleDegreeInfo | null {
    const relativeOffset = subChromatic(chromaticIndex, tonicIndex);
    const position = this.pattern.findPositionInScale(relativeOffset);
    return position === null ? null : new ScaleDegreeInfo(ixScaleDegree(position + 1), AccidentalType.None);
  }

  /** Plain scale-degree number, no accidental - same reasoning as {@link getScaleDegreeInfoFromChromatic}. */
  public getScaleDegreeInfoFromPosition(position: ScaleDegreeIndex): ScaleDegreeInfo {
    return new ScaleDegreeInfo(ixScaleDegree(position + 1), AccidentalType.None);
  }

  /** Root and droned-single-note both just index into the pattern; Triad/Seventh have no tertian
   * chords to offer here (see {@link OtherScalePattern}) - callers must not reach this for those
   * two modes (the UI disables them whenever a non-diatonic key is selected). */
  public getOffsets(scaleDegreeIndex: ScaleDegreeIndex, mode: ScalePlaybackMode): number[] {
    if (mode === ScalePlaybackMode.Triad || mode === ScalePlaybackMode.Seventh) {
      throw new Error(`${mode} is not supported for non-diatonic scales`);
    }
    return mode === ScalePlaybackMode.DronedSingleNote
      ? this.pattern.getTonicDroneWithRootOffset(scaleDegreeIndex)
      : this.pattern.getRootOffset(scaleDegreeIndex);
  }

  public getStepOffsets(): number[] {
    return Array.from({ length: this.pattern.length }, (_, i) => this.pattern.getRootOffset(i)[0]);
  }
}
