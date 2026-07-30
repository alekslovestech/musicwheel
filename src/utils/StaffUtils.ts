import type { PreparedChordProgressionSequence, ScaleStepAtDegree } from "@/utils/SequencePlaybackUtils";
import { getScaleStepAtSequenceIndex } from "@/utils/SequencePlaybackUtils";
import type { DuratedNoteChord, NoteLength } from "@/types/Durated";
import { makeDurated } from "@/types/Durated";
import type { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { NoteIndices } from "@/types/IndexTypes";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { SpellingUtils } from "@/utils/SpellingUtils";
import { SpellingContext, SpellingKind } from "@/utils/spelling/SpellingContext";
import { HIGHLIGHT_ALPHA } from "@/lib/design/palette";
import { noteHighlightColor } from "@/utils/visual/noteHighlightColor";
import type { VexFlowDrawVoiceOptions } from "@/utils/VexFlowUtils";

/** Quarter notes: eight scale steps span two 4/4 bars on the staff. */
export const SCALE_STAFF_NOTE_LENGTH: NoteLength = 4;

/** Eight quarters in 8/4 gives even spacing without rhythmic flags or beams. */
export const SCALE_STAFF_VOICE_TIME = "8/4";

export const SCALE_STAFF_DRAW_OPTIONS: VexFlowDrawVoiceOptions = {
  voiceTime: SCALE_STAFF_VOICE_TIME,
  stemless: true,
};

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

  /** All scale degrees plus octave return (always 8 steps for diatonic scales). */
  static buildDuratedScaleStepsForBar(
    key: MusicalKey,
    scalePlaybackMode: ScalePlaybackMode,
    spellingKey: MusicalKey,
  ): DuratedNoteChord[] {
    const scaleLength = key.scalePatternLength;
    const steps: DuratedNoteChord[] = [];

    for (let i = 0; i <= scaleLength; i++) {
      const scaleStep = getScaleStepAtSequenceIndex(key, i, scalePlaybackMode);
      steps.push(this.toDuratedScaleStaffStep(scaleStep, key, spellingKey, scalePlaybackMode));
    }

    return steps;
  }

  static findScaleStepIndexForSelection(
    key: MusicalKey,
    scalePlaybackMode: ScalePlaybackMode,
    selectedNoteIndices: NoteIndices,
  ): number | null {
    if (selectedNoteIndices.length === 0) return null;

    const scaleLength = key.scalePatternLength;
    for (let i = 0; i <= scaleLength; i++) {
      const step = getScaleStepAtSequenceIndex(key, i, scalePlaybackMode);
      if (this.noteIndicesMatch(step.notesToPlay, selectedNoteIndices)) return i;
    }

    return null;
  }

  static scaleStaffHighlightColor(
    key: MusicalKey,
    scalePlaybackMode: ScalePlaybackMode,
    stepIndex: number,
  ): string {
    return noteHighlightColor(key, scalePlaybackMode, stepIndex).alpha(HIGHLIGHT_ALPHA).css();
  }

  private static toDuratedScaleStaffStep(
    scaleStep: ScaleStepAtDegree,
    key: MusicalKey,
    spellingKey: MusicalKey,
    scalePlaybackMode: ScalePlaybackMode,
  ): DuratedNoteChord {
    const spelling = this.spellingForScaleStaffStep(scaleStep, key, scalePlaybackMode);
    const notes = SpellingUtils.computeNotesForStaff(
      scaleStep.notesToPlay,
      spellingKey,
      spelling,
    );
    return makeDurated(notes, SCALE_STAFF_NOTE_LENGTH);
  }

  private static spellingForScaleStaffStep(
    scaleStep: ScaleStepAtDegree,
    key: MusicalKey,
    scalePlaybackMode: ScalePlaybackMode,
  ): SpellingContext {
    if (scalePlaybackMode === ScalePlaybackMode.Triad && scaleStep.chordRef != null) {
      return { kind: SpellingKind.ChordPreset, chordRef: scaleStep.chordRef };
    }
    return { kind: SpellingKind.ScaleDegree, musicalKey: key };
  }

  private static noteIndicesMatch(a: NoteIndices, b: NoteIndices): boolean {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
  }
}
