import { CHORD_OFFSET_PATTERNS } from "@/types/constants/ChordOffsetPatterns";

import { ChordType } from "@/types/enums/ChordType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

import {
  addChromatic,
  ChromaticIndex,
  subChromatic,
} from "@/types/ChromaticIndex";

import { ScalePattern } from "./ScalePattern";
import { ScaleDegreeInfo } from "./ScaleDegreeInfo";
import { ScaleDegreeIndex } from "./ScaleDegreeType";
import { ixScaleDegreeIndex } from "./ScaleDegreeType";

export class ScaleModeInfo {
  /**
   * The scale pattern for this mode.
   * For most use cases, you can access this directly to use ScalePattern methods.
   * For common operations, consider using the domain-specific methods provided by GreekModeInfo.
   */
  public readonly scalePattern: ScalePattern;

  constructor(
    public readonly type: ScaleModeType,
    pattern: number[], // The pattern of the mode, typically 7 notes. e.g. [0, 2, 4, 5, 7, 9, 10] for Mixolydian
    public readonly modeNumber: number // The number of the mode, typically 1-7. e.g. 1 for Ionian, 2 for Dorian, etc.
  ) {
    this.scalePattern = new ScalePattern(pattern);
  }

  public getScalePatternLength(): number {
    return this.scalePattern.getLength();
  }

  /**
   * Gets the scale degree info for a chromatic note in this mode with the given tonic.
   * @param chromaticIndex The chromatic index of the note
   * @param tonicIndex The chromatic index of the tonic
   * @returns The scale degree info, or null if the note is not in the scale
   */
  public getScaleDegreeInfoFromChromatic(
    chromaticIndex: ChromaticIndex,
    tonicIndex: ChromaticIndex
  ): ScaleDegreeInfo | null {
    const relativeOffset = subChromatic(chromaticIndex, tonicIndex); // Normalize to 0-11
    const scaleDegreePosition = this.scalePattern.findPositionInScale(relativeOffset);

    return scaleDegreePosition === null
      ? null
      : this.scalePattern.getScaleDegreeInfoFromPosition(scaleDegreePosition);
  }

  /**
   * Gets the absolute scale notes for this mode with the given tonic.
   * @param tonicIndex The chromatic index of the tonic
   * @returns An array of chromatic indices representing the scale notes
   */
  public getAbsoluteScaleNotes(tonicIndex: ChromaticIndex): ChromaticIndex[] {
    return this.scalePattern.addOffsetsChromatic(tonicIndex);
  }

  public getIonianTonicIndex(tonicIndex: ChromaticIndex): ChromaticIndex {
    const offset = this.modeNumber - 1;

    const scaleLength = this.scalePattern.getLength();
    const ionianOffset = this.scalePattern.getOffsetAtIndex(
      ixScaleDegreeIndex((scaleLength - offset) % scaleLength)
    );

    // Apply the offset to the tonic to get the Ionian tonic
    return addChromatic(tonicIndex, ionianOffset);
  }

  public isDiatonicNote(
    chromaticIndex: ChromaticIndex,
    tonicIndex: ChromaticIndex
  ): boolean {
    const scaleNotes = this.getAbsoluteScaleNotes(tonicIndex);
    return scaleNotes.includes(chromaticIndex);
  }

  //scaleDegreeIndex is the index of the scale degree in the pattern (0-6)
  public determineChordType(offsetsFromRoot: number[]): ChordType {
    const patterns = {
      [ChordType.Major]: CHORD_OFFSET_PATTERNS.MAJOR,
      [ChordType.Minor]: CHORD_OFFSET_PATTERNS.MINOR,
      [ChordType.Diminished]: CHORD_OFFSET_PATTERNS.DIMINISHED,
      [ChordType.Augmented]: CHORD_OFFSET_PATTERNS.AUGMENTED,
    };

    // Find matching chord pattern
    const matchingPattern = Object.entries(patterns).find(([, pattern]) => {
      return offsetsFromRoot.every(
        (offset, index) => offset === pattern[index]
      );
    });

    return (matchingPattern?.[0] as ChordType) || ChordType.Unknown;
  }

  public getScaleDegreeInfoFromPosition(
    scaleDegreeIndex: ScaleDegreeIndex
  ): ScaleDegreeInfo {
    return this.scalePattern.getScaleDegreeInfoFromPosition(scaleDegreeIndex);
  }

  public getTriadOffsets(scaleDegreeInfo: ScaleDegreeInfo): number[] {
    const scaleDegreeIndex = scaleDegreeInfo.scaleDegreeIndex;
    const offsets135 = this.scalePattern.getOffsets135(scaleDegreeIndex);
    return offsets135.map((offset) => offset - offsets135[0]);
  }
}
