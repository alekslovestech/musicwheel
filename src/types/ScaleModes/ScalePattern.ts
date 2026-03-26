import { SCALE_MODE_PATTERNS } from "@/types/constants/ScaleModePatterns";
import { TWELVE } from "@/types/constants/NoteConstants";

import { AccidentalType } from "@/types/enums/AccidentalType";

import { addChromatic, ChromaticIndex } from "@/types/ChromaticIndex";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import {
  ixScaleDegreeIndex,
  ScaleDegreeIndex,
} from "@/types/ScaleModes/ScaleDegreeType";

export class ScalePattern {
  private readonly pattern: number[];
  private readonly SCALE_LENGTH = 7;

  constructor(pattern: number[]) {
    if (pattern.length !== this.SCALE_LENGTH) {
      throw new Error(
        `Scale pattern must have exactly ${this.SCALE_LENGTH} notes`
      );
    }
    this.pattern = [...pattern];
  }

  public getScaleDegreeInfoFromPosition(
    scaleDegreeIndex: ScaleDegreeIndex
  ): ScaleDegreeInfo {
    const currentNote = this.pattern[scaleDegreeIndex];
    const ionianNote = SCALE_MODE_PATTERNS.IONIAN[scaleDegreeIndex];
    const accidental =
      currentNote > ionianNote
        ? AccidentalType.Sharp
        : currentNote < ionianNote
        ? AccidentalType.Flat
        : AccidentalType.None;
    return ScaleDegreeInfo.fromScaleDegreeIndex(scaleDegreeIndex, accidental);
  }

  public getRootOffset(scaleDegreeIndex: ScaleDegreeIndex): [number] {
    return [this.pattern[scaleDegreeIndex]];
  }

  public getTonicDroneWithRootOffset(
    scaleDegreeIndex: ScaleDegreeIndex
  ): number[] {
    return [this.pattern[0], this.pattern[scaleDegreeIndex]];
  }

  public getOffsets135(scaleDegreeIndex: ScaleDegreeIndex): number[] {
    const rootOffset = this.pattern[scaleDegreeIndex];
    let thirdOffset = this.pattern[(scaleDegreeIndex + 2) % this.SCALE_LENGTH];
    let fifthOffset = this.pattern[(scaleDegreeIndex + 4) % this.SCALE_LENGTH];

    thirdOffset += thirdOffset < rootOffset ? TWELVE : 0;
    fifthOffset += fifthOffset < rootOffset ? TWELVE : 0;

    return [rootOffset, thirdOffset, fifthOffset];
  }

  public getOffsets1357(scaleDegreeIndex: ScaleDegreeIndex): number[] {
    const [rootOffset, thirdOffset, fifthOffset] =
      this.getOffsets135(scaleDegreeIndex);
    let seventhOffset =
      this.pattern[(scaleDegreeIndex + 6) % this.SCALE_LENGTH];
    seventhOffset += seventhOffset < rootOffset ? TWELVE : 0;
    return [rootOffset, thirdOffset, fifthOffset, seventhOffset];
  }

  public getLength(): number {
    return this.SCALE_LENGTH;
  }

  public getOffsetAtIndex(index: ScaleDegreeIndex): number {
    return this.pattern[index];
  }

  /**
   * Finds the position of a note in the scale based on its relative offset from the tonic.
   * @param relativeOffset The offset from the tonic (0-11)
   * @returns The position in the scale (0-6), or null if the note is not in the scale
   */
  public findPositionInScale(relativeOffset: number): ScaleDegreeIndex | null {
    const normalizedOffset = relativeOffset % TWELVE;
    const index = this.pattern.findIndex((offset) => offset === normalizedOffset);
    return index === -1 ? null : ixScaleDegreeIndex(index);
  }

  /**
   * Adds a base value to each offset in the pattern using addChromatic.
   * This is useful for converting relative offsets to absolute chromatic indices.
   * @param baseValue The base value to add to each offset
   * @returns An array of chromatic indices
   */
  public addOffsetsChromatic(chromaticIndex: ChromaticIndex): ChromaticIndex[] {
    return this.pattern.map((element) => addChromatic(chromaticIndex, element));
  }

  /**
   * Adds a base value to each offset in the pattern using simple addition.
   * This is useful for mathematical operations on the pattern.
   * @param baseValue The base value to add to each offset
   * @returns An array of numbers
   */
  public addOffsetsSimple(baseValue: number): number[] {
    return this.pattern.map((element) => element + baseValue);
  }
}
