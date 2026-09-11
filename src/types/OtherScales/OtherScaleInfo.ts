import { AccidentalType } from "@/types/enums/AccidentalType";
import { OtherScaleType } from "@/types/enums/OtherScaleType";

import { ChromaticIndex, subChromatic } from "@/types/ChromaticIndex";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

import { SluggedEntry } from "@/utils/slug/slugCodec";

import { OtherScalePattern } from "./OtherScalePattern";

/**
 * A non-diatonic scale's identity: a name and a pattern, nothing else. No key signature, no
 * scale-degree chords - see {@link OtherScalePattern} for why those don't generalize here.
 */
export class OtherScaleInfo implements SluggedEntry {
  public readonly pattern: OtherScalePattern;

  constructor(
    public readonly type: OtherScaleType,
    public readonly name: string,
    public readonly slug: string,
    offsets: number[],
  ) {
    this.pattern = new OtherScalePattern(offsets);
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
}
