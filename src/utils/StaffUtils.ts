import type { PreparedChordProgressionSequence } from "@/utils/SequencePlaybackUtils";
import type { DuratedNoteChord } from "@/types/Durated";
import { makeDurated } from "@/types/Durated";
import type { MusicalKey } from "@/types/Keys/MusicalKey";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { SpellingUtils } from "@/utils/SpellingUtils";
import { SpellingKind } from "@/utils/spelling/SpellingContext";

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
      if (noteIndices == null || noteIndices.length === 0 || noteLength === undefined) {
        return [];
      }
      const chordRef = MusicalDisplayFormatter.getChordReferenceFromIndices(noteIndices)!;
      const notes = SpellingUtils.computeNotesForStaff(noteIndices, spellingKey, {
        kind: SpellingKind.ChordPreset,
        chordRef,
      });
      const rhythmDots = prepared.chordStepRhythmDots[entryIndex] ?? 0;
      return [makeDurated(notes, noteLength, rhythmDots)];
    });
  }
}
