import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ChordReference } from "@/types/interfaces/ChordReference";
import { NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { RhythmUtils } from "@/utils/RhythmUtils";
import {
  advanceScaleSequenceStep,
  type PreparedChordProgressionSequence,
} from "@/utils/SequencePlaybackUtils";

import {
  SCALE_AUDIO_WARMUP_MS,
  SCALE_STEP_MS_DRONED,
  SCALE_STEP_MS_SINGLE_NOTE,
  SCALE_STEP_MS_TRIAD,
} from "@/lib/audio/playbackDurations";
import { SEQUENCE_PLAYBACK, stepNoteDurationSec } from "@/lib/audio/playbackProfiles";
import type { ScheduledStep, SequenceSchedule } from "@/lib/audio/sequenceScheduler";

/** Runs on the draw loop when a step is due, so the UI follows the note rather than causing it. */
export type SequenceStepVisual = (
  stepIndex: number,
  notes: NoteIndices,
  chordRef?: ChordReference,
) => void;

export function scaleStepMs(mode: ScalePlaybackMode): number {
  switch (mode) {
    case ScalePlaybackMode.SingleNote:
      return SCALE_STEP_MS_SINGLE_NOTE;
    case ScalePlaybackMode.DronedSingleNote:
      return SCALE_STEP_MS_DRONED;
    default:
      return SCALE_STEP_MS_TRIAD;
  }
}

/**
 * Every step of the run, timed from its start. Laying the whole sequence out up front is what
 * lets it be handed to the audio clock in one go: from then on no step costs the main thread
 * anything, so nothing the main thread does can move one.
 *
 * The key is read once here and frozen for the whole run.
 */
export function buildScaleSchedule(
  key: MusicalKey,
  mode: ScalePlaybackMode,
  onStep: SequenceStepVisual,
  onComplete: () => void,
): SequenceSchedule {
  const stepSec = scaleStepMs(mode) / 1000;
  const warmupSec = SCALE_AUDIO_WARMUP_MS / 1000;
  const durationSec = stepNoteDurationSec(SEQUENCE_PLAYBACK, stepSec);

  const steps: ScheduledStep[] = [];
  for (let stepIndex = 0; ; stepIndex++) {
    const sequenceStep = advanceScaleSequenceStep(key, stepIndex, mode);
    if (sequenceStep === null) break;

    const { notesToPlay, chordRef } = sequenceStep.step;
    const index = stepIndex;
    steps.push({
      atSec: warmupSec + index * stepSec,
      indices: notesToPlay,
      durationSec,
      onVisual: () => onStep(index, notesToPlay, chordRef),
    });

    if (sequenceStep.nextStepIndex === undefined) break;
  }

  return {
    steps,
    envelope: SEQUENCE_PLAYBACK.envelope,
    // The final step gets a full interval of its own before the run is called finished.
    endsAtSec: warmupSec + steps.length * stepSec,
    onComplete,
  };
}

/**
 * As {@link buildScaleSchedule}, but step spacing comes from each chord's notated rhythm - so each
 * step's hold is clamped to its own length rather than to one length shared by the run.
 */
export function buildProgressionSchedule(
  prepared: PreparedChordProgressionSequence,
  onStep: SequenceStepVisual,
  onComplete: () => void,
): SequenceSchedule {
  const steps: ScheduledStep[] = [];
  let atSec = 0;
  prepared.steps.forEach((step, stepIndex) => {
    const stepSec =
      RhythmUtils.chordDurationMs(prepared.tempo, step.noteLength, step.rhythmDots) / 1000;
    steps.push({
      atSec,
      indices: step.value,
      durationSec: stepNoteDurationSec(SEQUENCE_PLAYBACK, stepSec),
      onVisual: () => onStep(stepIndex, step.value),
    });
    atSec += stepSec;
  });

  return {
    steps,
    envelope: SEQUENCE_PLAYBACK.envelope,
    endsAtSec: atSec,
    onComplete,
  };
}
