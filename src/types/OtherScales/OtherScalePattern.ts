import { addChromatic, ChromaticIndex } from "@/types/ChromaticIndex";
import { TWELVE } from "@/types/constants/NoteConstants";

/**
 * Offsets for a scale that doesn't fit the 7-note diatonic model (whole tone, and future
 * symmetric/non-diatonic scales). Deliberately narrower than {@link ScalePattern}: no fixed
 * length, no key-signature-relative accidental spelling, no triad/seventh construction - none of
 * that generalizes to a scale with no diatonic reference to compare against.
 */
export class OtherScalePattern {
  private readonly offsets: number[];

  constructor(offsets: number[]) {
    this.offsets = [...offsets];
  }

  public get length(): number {
    return this.offsets.length;
  }

  public getAbsoluteScaleNotes(tonicIndex: ChromaticIndex): ChromaticIndex[] {
    return this.offsets.map((offset) => addChromatic(tonicIndex, offset));
  }

  /** Plain 0-based position in the scale, or null if the offset isn't one of its notes. */
  public findPositionInScale(relativeOffset: number): number | null {
    const normalizedOffset = ((relativeOffset % TWELVE) + TWELVE) % TWELVE;
    const index = this.offsets.findIndex((offset) => offset === normalizedOffset);
    return index === -1 ? null : index;
  }

  public getRootOffset(index: number): [number] {
    return [this.offsets[index]];
  }

  /** Drone stays on the tonic; melody moves to this degree - same shape as ScalePattern's, no
   * diatonic reference needed since it's just indexing into the pattern. */
  public getTonicDroneWithRootOffset(index: number): number[] {
    const droneOffset = this.offsets[0];
    const melodyOffset = this.offsets[index];
    return droneOffset === melodyOffset ? [melodyOffset] : [droneOffset, melodyOffset];
  }
}
