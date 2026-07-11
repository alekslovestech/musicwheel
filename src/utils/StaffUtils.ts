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
      const step = prepared.steps[entryIndex];
      if (step == null || step.value.length === 0) {
        return [];
      }
      const chordRef = MusicalDisplayFormatter.getChordReferenceFromIndices(step.value)!;
      const notes = SpellingUtils.computeNotesForStaff(step.value, spellingKey, {
        kind: SpellingKind.ChordPreset,
        chordRef,
      });
      return [makeDurated(notes, step.noteLength, step.rhythmDots)];
    });
  }
}
