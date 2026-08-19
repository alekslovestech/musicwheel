import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

import { SCALE_AUDIO_WARMUP_MS } from "@/lib/audio/playbackDurations";
import { SEQUENCE_PLAYBACK } from "@/lib/audio/playbackProfiles";
import {
  buildProgressionSchedule,
  buildScaleSchedule,
  scaleStepMs,
} from "@/lib/audio/sequenceSchedules";
import { prepareChordProgressionSequence } from "@/utils/SequencePlaybackUtils";
import { RhythmUtils } from "@/utils/RhythmUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

const noop = () => {};

describe("buildScaleSchedule", () => {
  const constants = GreekTestConstants.getInstance();

  test("covers every scale degree plus the closing octave tonic", () => {
    const key = constants.C_IONIAN_KEY;
    const schedule = buildScaleSchedule(key, ScalePlaybackMode.SingleNote, noop, noop);

    expect(schedule.steps).toHaveLength(key.scalePatternLength + 1);
    schedule.steps.forEach((step) => expect(step.indices.length).toBeGreaterThan(0));
  });

  test.each([
    ScalePlaybackMode.SingleNote,
    ScalePlaybackMode.DronedSingleNote,
    ScalePlaybackMode.Triad,
  ])("spaces steps evenly after the warmup in %s", (mode) => {
    const key = constants.C_IONIAN_KEY;
    const schedule = buildScaleSchedule(key, mode, noop, noop);
    const stepSec = scaleStepMs(mode) / 1000;
    const warmupSec = SCALE_AUDIO_WARMUP_MS / 1000;

    schedule.steps.forEach((step, index) => {
      expect(step.atSec).toBeCloseTo(warmupSec + index * stepSec, 10);
    });
  });

  test("leaves the final step a full interval before completing", () => {
    const key = constants.C_IONIAN_KEY;
    const mode = ScalePlaybackMode.SingleNote;
    const schedule = buildScaleSchedule(key, mode, noop, noop);

    const lastStep = schedule.steps[schedule.steps.length - 1];
    expect(schedule.endsAtSec - lastStep.atSec).toBeCloseTo(scaleStepMs(mode) / 1000, 10);
  });

  test.each([
    ScalePlaybackMode.SingleNote,
    ScalePlaybackMode.DronedSingleNote,
    ScalePlaybackMode.Triad,
  ])("releases each note before the next step attacks in %s", (mode) => {
    const key = constants.C_IONIAN_KEY;
    const schedule = buildScaleSchedule(key, mode, noop, noop);
    const stepSec = scaleStepMs(mode) / 1000;

    schedule.steps.forEach((step) => {
      expect(step.durationSec).toBeLessThan(stepSec);
      expect(step.durationSec).toBeLessThanOrEqual(SEQUENCE_PLAYBACK.durationSec);
    });
  });

  test("clamps to the step only when the step is shorter than the profile allows", () => {
    const key = constants.C_IONIAN_KEY;
    const shortStep = buildScaleSchedule(key, ScalePlaybackMode.SingleNote, noop, noop);
    const longStep = buildScaleSchedule(key, ScalePlaybackMode.Triad, noop, noop);

    expect(shortStep.steps[0].durationSec).toBeLessThan(SEQUENCE_PLAYBACK.durationSec);
    expect(longStep.steps[0].durationSec).toBeCloseTo(SEQUENCE_PLAYBACK.durationSec, 10);
  });

  test("reports the step index and notes it scheduled", () => {
    const key = constants.C_IONIAN_KEY;
    const seen: number[] = [];
    const schedule = buildScaleSchedule(
      key,
      ScalePlaybackMode.SingleNote,
      (stepIndex) => seen.push(stepIndex),
      noop,
    );

    schedule.steps.forEach((step) => step.onVisual());
    expect(seen).toEqual(schedule.steps.map((_, index) => index));
  });
});

describe("buildProgressionSchedule", () => {
  const constants = GreekTestConstants.getInstance();

  test("advances each chord by its own notated duration", () => {
    const prepared = prepareChordProgressionSequence(
      ChordProgressionType.Fifties_Progression,
      constants.C_IONIAN_KEY,
    );
    const schedule = buildProgressionSchedule(prepared, noop, noop);

    expect(schedule.steps).toHaveLength(prepared.steps.length);

    let expectedAtSec = 0;
    prepared.steps.forEach((step, index) => {
      expect(schedule.steps[index].atSec).toBeCloseTo(expectedAtSec, 10);
      expectedAtSec +=
        RhythmUtils.chordDurationMs(prepared.tempo, step.noteLength, step.rhythmDots) / 1000;
    });

    expect(schedule.endsAtSec).toBeCloseTo(expectedAtSec, 10);
  });

  test("holds each chord clear of the chord that follows it", () => {
    const prepared = prepareChordProgressionSequence(
      ChordProgressionType.Fifties_Progression,
      constants.C_IONIAN_KEY,
    );
    const schedule = buildProgressionSchedule(prepared, noop, noop);

    schedule.steps.forEach((step, index) => {
      const nextAtSec = schedule.steps[index + 1]?.atSec ?? schedule.endsAtSec;
      expect(step.atSec + step.durationSec).toBeLessThan(nextAtSec);
      expect(step.durationSec).toBeLessThanOrEqual(SEQUENCE_PLAYBACK.durationSec);
    });
  });
});
