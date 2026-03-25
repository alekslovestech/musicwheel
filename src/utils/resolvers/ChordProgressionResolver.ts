import { ActualIndex, chromaticToActual, NoteIndices } from "@/types/IndexTypes";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import {
  ScaleDegree,
  scaleDegreeGoesDown,
} from "@/types/ScaleModes/ScaleDegreeType";
import { ChordUtils } from "@/utils/ChordUtils";
import { makeChordReference } from "@/types/interfaces/ChordReference";
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
    romanStrings: string[],
    chords: AbsoluteChord[],
  ): NoteIndices[] {
    if (chords.length === 0) return [];

    const degrees = romanStrings.map(
      (r) => RomanResolver.createRomanChordFromString(r).scaleDegree,
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
    const noteArrays: NoteIndices[] = [];
    let prevRoot = chromaticToActual(chords[0].chromaticIndex, startOctave);
    let totalMovement = 0;

    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i];
      const notesLow = ChordUtils.calculateChordNotesFromChordReference(
        makeChordReference(
          chromaticToActual(chord.chromaticIndex, 0),
          chord.chordType,
        ),
      );
      const notesHigh = ChordUtils.calculateChordNotesFromChordReference(
        makeChordReference(
          chromaticToActual(chord.chromaticIndex, 1),
          chord.chordType,
        ),
      );

      const rootLow = notesLow[0];
      const rootHigh = notesHigh[0];

      let chosen: NoteIndices;
      if (i === 0) {
        chosen = startOctave === 1 ? notesHigh : notesLow;
      } else {
        const goDown = scaleDegreeGoesDown(degrees[i - 1], degrees[i]);

        chosen = goDown
          ? rootLow < prevRoot
            ? notesLow
            : rootHigh < prevRoot
              ? notesHigh
              : rootLow <= rootHigh
                ? notesLow
                : notesHigh
          : rootHigh >= prevRoot
            ? notesHigh
            : rootLow >= prevRoot
              ? notesLow
              : rootHigh >= rootLow
                ? notesHigh
                : notesLow;
      }

      const chosenRoot = chosen[0];
      totalMovement += Math.abs(chosenRoot - prevRoot);
      noteArrays.push(chosen);
      prevRoot = chosenRoot;
    }
    return { noteArrays, totalMovement };
  }
}
