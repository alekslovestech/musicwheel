import { NoteIndices } from "@/types/IndexTypes";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import {
  ScaleDegree,
  scaleDegreeGoesDown,
} from "@/types/ScaleModes/ScaleDegreeType";
import { RomanChord } from "@/types/RomanChord";
import { ChordUtils } from "@/utils/ChordUtils";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

interface SequenceResult {
  noteArrays: NoteIndices[];
  totalMovement: number;
}

export class ChordProgressionResolver {
  /**
   * Determines chord root octaves for a given progression to minimize total root movement.
   * Tries both octave 0 and 1 for the first chord; at each step, uses scale degree direction
   * (up or down) to select the next root octave. Returns the sequence with the least total movement.
   */
  static computeProgressionOctaves(
    romanChords: RomanChord[],
    musicalKey: MusicalKey,
  ): NoteIndices[] {
    if (romanChords.length === 0) return [];

    const degrees = romanChords.map((r) => r.scaleDegree);

    const chords: AbsoluteChord[] = romanChords.map((r) =>
      RomanResolver.resolveRomanChord(r, musicalKey),
    );

    const seq0 = this.buildSequence(chords, degrees, 0);
    const seq1 = this.buildSequence(chords, degrees, 1);
    return seq0.totalMovement <= seq1.totalMovement
      ? seq0.noteArrays
      : seq1.noteArrays;
  }

  private static buildSequence(
    chords: AbsoluteChord[],
    degrees: ScaleDegree[],
    startOctave: number,
  ): SequenceResult {
    const firstNotes = ChordUtils.noteIndicesFromAbsoluteChord(
      chords[0],
      startOctave,
    );

    const noteArrays: NoteIndices[] = [firstNotes];
    let prevRoot = firstNotes[0];
    let totalMovement = 0;

    for (let i = 1; i < chords.length; i++) {
      const chord = chords[i];
      const notesLow = ChordUtils.noteIndicesFromAbsoluteChord(chord, 0);
      const notesHigh = ChordUtils.noteIndicesFromAbsoluteChord(chord, 1);

      const rootLow = notesLow[0];
      const rootHigh = notesHigh[0];
      const goDown = scaleDegreeGoesDown(degrees[i - 1], degrees[i]);

      const chosen = goDown
        ? rootLow < prevRoot
          ? notesLow
          : rootHigh < prevRoot
            ? notesHigh
            : notesLow
        : rootHigh >= prevRoot
          ? notesHigh
          : rootLow >= prevRoot
            ? notesLow
            : notesHigh;

      const chosenRoot = chosen[0];
      totalMovement += Math.abs(chosenRoot - prevRoot);
      noteArrays.push(chosen);
      prevRoot = chosenRoot;
    }
    return { noteArrays, totalMovement };
  }
}
