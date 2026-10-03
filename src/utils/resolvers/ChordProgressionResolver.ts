import { NoteIndices, OctaveOffset, ixOctaveOffset } from "@/types/IndexTypes";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { OctaveModifier } from "@/types/enums/OctaveModifier";
import { RomanChord } from "@/types/RomanChord";
import { ChordUtils } from "@/utils/ChordUtils";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

interface SequenceResult {
  noteArrays: NoteIndices[];
  totalMovement: number;
}

const OCTAVE_LOW = ixOctaveOffset(0);
const OCTAVE_HIGH = ixOctaveOffset(1);

/** Pins a chord to the resolver's high or low octave slot. */
function octaveSlot(modifier: OctaveModifier): OctaveOffset {
  return modifier === OctaveModifier.Up ? OCTAVE_HIGH : OCTAVE_LOW;
}

export class ChordProgressionResolver {
  /**
   * Determines chord root octaves for a given progression to minimize total root movement.
   * Tries both octave 0 and 1 for the first chord; at each step, greedily selects the next
   * chord realization (octave 0 vs 1) whose root is closest to the previous chosen root.
   * Returns the sequence with the least total movement (ties prefer the octave-0 start).
   */
  static computeProgressionOctaves(
    romanChords: RomanChord[],
    musicalKey: MusicalKey,
  ): NoteIndices[] {
    if (romanChords.length === 0) return [];

    const chords: AbsoluteChord[] = romanChords.map((r) =>
      RomanResolver.resolveRomanChord(r, musicalKey),
    );
    const octaveOverrides: (OctaveOffset | undefined)[] = romanChords.map((r) =>
      r.octaveOverride !== undefined ? octaveSlot(r.octaveOverride) : undefined,
    );

    const seq0 = this.buildSequence(chords, octaveOverrides, OCTAVE_LOW);
    const seq1 = this.buildSequence(chords, octaveOverrides, OCTAVE_HIGH);
    return seq0.totalMovement <= seq1.totalMovement ? seq0.noteArrays : seq1.noteArrays;
  }

  private static buildSequence(
    chords: AbsoluteChord[],
    octaveOverrides: (OctaveOffset | undefined)[],
    startOctave: OctaveOffset,
  ): SequenceResult {
    const firstNotes = ChordUtils.noteIndicesFromAbsoluteChord(
      chords[0],
      octaveOverrides[0] ?? startOctave,
    );

    const noteArrays: NoteIndices[] = [firstNotes];
    let prevRoot = firstNotes[0];
    let totalMovement = 0;

    for (let i = 1; i < chords.length; i++) {
      const chord = chords[i];
      const override = octaveOverrides[i];

      let chosen: NoteIndices;
      if (override !== undefined) {
        // Explicit "'" / "," marker on this step: honor it, skip the greedy nearest-root choice.
        chosen = ChordUtils.noteIndicesFromAbsoluteChord(chord, override);
      } else {
        const notesLow = ChordUtils.noteIndicesFromAbsoluteChord(chord, OCTAVE_LOW);
        const notesHigh = ChordUtils.noteIndicesFromAbsoluteChord(chord, OCTAVE_HIGH);

        const rootLow = notesLow[0];
        const rootHigh = notesHigh[0];

        const dLow = Math.abs(rootLow - prevRoot);
        const dHigh = Math.abs(rootHigh - prevRoot);

        // Greedy: choose the closest next root. On ties, prefer the lower root (more stable on repeats).
        chosen = dLow <= dHigh ? notesLow : notesHigh;
      }

      const chosenRoot = chosen[0];
      totalMovement += Math.abs(chosenRoot - prevRoot);
      noteArrays.push(chosen);
      prevRoot = chosenRoot;
    }
    return { noteArrays, totalMovement };
  }
}
