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
import { resolvePlaybackProfile } from "@/lib/audio/playbackProfiles";
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
 * The key is read once here, matching the previous behaviour of freezing it for the run.
 */
export function buildScaleSchedule(
  key: MusicalKey,
  mode: ScalePlaybackMode,
  onStep: SequenceStepVisual,
  onComplete: () => void,
): SequenceSchedule {
  const stepSec = scaleStepMs(mode) / 1000;
  const warmupSec = SCALE_AUDIO_WARMUP_MS / 1000;
  // Sequence playback holds every step for the same length, scales and progressions alike; the
  // shorter per-mode profiles apply to clicking a single degree.
  const profile = resolvePlaybackProfile(mode, false);

  const steps: ScheduledStep[] = [];
  for (let stepIndex = 0; ; stepIndex++) {
    const sequenceStep = advanceScaleSequenceStep(key, stepIndex, mode);
    if (sequenceStep === null) break;

    const { notesToPlay, chordRef } = sequenceStep.step;
    const index = stepIndex;
    steps.push({
      atSec: warmupSec + index * stepSec,
      indices: notesToPlay,
      onVisual: () => onStep(index, notesToPlay, chordRef),
    });

    if (sequenceStep.nextStepIndex === undefined) break;
  }

  return {
    steps,
    noteDurationSec: profile.durationSec,
    envelope: profile.envelope,
    // The final step gets a full interval of its own before the run is called finished.
    endsAtSec: warmupSec + steps.length * stepSec,
    onComplete,
  };
}

/** As {@link buildScaleSchedule}, but step spacing comes from each chord's notated rhythm. */
export function buildProgressionSchedule(
  prepared: PreparedChordProgressionSequence,
  mode: ScalePlaybackMode,
  onStep: SequenceStepVisual,
  onComplete: () => void,
): SequenceSchedule {
  const profile = resolvePlaybackProfile(mode, false);

  const steps: ScheduledStep[] = [];
  let atSec = 0;
  prepared.steps.forEach((step, stepIndex) => {
    steps.push({
      atSec,
      indices: step.value,
      onVisual: () => onStep(stepIndex, step.value),
    });
    atSec += RhythmUtils.chordDurationMs(prepared.tempo, step.noteLength, step.rhythmDots) / 1000;
  });

  return {
    steps,
    noteDurationSec: profile.durationSec,
    envelope: profile.envelope,
    endsAtSec: atSec,
    onComplete,
  };
}
