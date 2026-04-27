import type { PreparedChordProgressionSequence } from "@/lib/sequencePlaybackHelpers";
import type { DuratedNoteChord } from "@/types/Durated";
import { makeDurated } from "@/types/Durated";
import type { MusicalKey } from "@/types/Keys/MusicalKey";
import { SpellingUtils } from "@/utils/SpellingUtils";

/**
 * Durated chord steps for one bar of a prepared progression, for staff rendering.
 */
export class StaffUtils {
  static buildDuratedChordStepsForBar(
    prepared: PreparedChordProgressionSequence,
    stepIndicesInBar: readonly number[],
    spellingKey: MusicalKey,
  ): DuratedNoteChord[] {
    return stepIndicesInBar.flatMap((entryIndex) => {
      const noteIndices = prepared.precomputedProgression[entryIndex];
      const noteLength = prepared.chordStepNoteLengths[entryIndex];
      const notes = SpellingUtils.computeNotesFromMusicalKey(
        noteIndices,
        spellingKey,
      );
      if (
        noteIndices == null ||
        noteIndices.length === 0 ||
        noteLength === undefined
      ) {
        return [];
      }
      return [makeDurated(notes, noteLength)];
    });
  }
}
