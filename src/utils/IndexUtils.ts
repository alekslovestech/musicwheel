import { TWELVE, TWENTY4 } from "@/types/constants/NoteConstants";

import { ChromaticIndex, subChromatic } from "@/types/ChromaticIndex";
import { ActualIndex, NoteIndices, toNoteIndices } from "@/types/IndexTypes";

export class IndexUtils {
  //everything relative to root note
  static normalizeIndices(indices: number[]): number[] {
    const rootNote = indices[0];
    return indices.map((note) =>
      subChromatic(note as ChromaticIndex, rootNote)
    );
  }

  static fitChordToAbsoluteRange(indices: number[]): number[] {
    let newIndices = this.shiftToRange(indices, 0, TWENTY4);

    // Step 3: Check if all notes are now within range
    if (newIndices.every((note) => this.isNoteInRange(note))) return newIndices;

    // Step 4: If not all notes fit, create two possible fits
    const lowerFit = newIndices.filter((note) => this.isNoteInRange(note));
    const upperFit = newIndices
      .map((note) => (note + TWELVE) as ActualIndex)
      .filter((note) => this.isNoteInRange(note));

    // Step 5: Return the fit that preserves more notes
    if (lowerFit.length !== upperFit.length)
      return lowerFit.length > upperFit.length ? lowerFit : upperFit;

    // If both fits have the same number of notes, prefer the one that includes the lowest note
    return lowerFit.includes(indices[0]) ? lowerFit : upperFit;
  }

  //put the first note at the end
  static firstNoteToLast(indices: number[]): number[] {
    let newIndices = [...indices] as number[];
    const firstNote = newIndices.shift()!;
    newIndices.push(firstNote + TWELVE);
    return this.shiftToRange(newIndices, -TWELVE, TWELVE);
  }

  static areIndicesEqual(indices1: number[], indices2: number[]): boolean {
    return (
      indices1.length === indices2.length &&
      indices1.every((note, index) => note === indices2[index])
    );
  }

  static shiftIndices(indices: number[], shiftAmount: number): number[] {
    const newIndices = indices.map((index) => index + shiftAmount);
    return this.fitChordToAbsoluteRange(newIndices);
  }

  /**
   * Transpose notes by a given amount, handling bounds via fitChordToAbsoluteRange.
   * @param indices The note indices to transpose
   * @param amount The number of semitones to shift (positive for up, negative for down)
   * @returns The transposed indices as ActualIndex array
   */
  static transposeNotes(indices: NoteIndices, amount: number): NoteIndices {
    return toNoteIndices(this.shiftIndices(indices, amount));
  }

  //if the new index is already selected, remove it, otherwise add it
  static ToggleNewIndex(
    selectedNoteIndices: NoteIndices,
    newIndex: ActualIndex
  ): NoteIndices {
    let updatedIndices = selectedNoteIndices.includes(newIndex)
      ? selectedNoteIndices.filter((index) => index !== newIndex)
      : [...selectedNoteIndices, newIndex];
    updatedIndices = updatedIndices.sort((a, b) => a - b);
    return updatedIndices;
  }

  private static isNoteInRange(note: number): boolean {
    return note >= 0 && note < TWENTY4;
  }

  private static shiftToRange(
    indices: number[],
    min: number,
    max: number
  ): number[] {
    const shift = indices.some((note) => note >= max)
      ? -TWELVE
      : indices.some((note) => note < min)
      ? TWELVE
      : 0;
    return indices.map((note) => note + shift);
  }
}
