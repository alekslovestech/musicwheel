import * as Tone from "tone";

import type { ActualIndex } from "@/types/IndexTypes";
import type { SynthEnvelope } from "@/lib/audio/playbackProfiles";
import { setSequenceEnvelope, triggerSequenceNotes } from "@/lib/audio/polySynthVoiceBridge";

/**
 * How far ahead of its note each visual update is started.
 *
 * The tolerance here is strongly asymmetric: audio arriving ahead of the picture is noticeable
 * from roughly 45ms, while the picture arriving ahead of the audio goes unnoticed until well
 * past 100ms. So the lead is deliberately generous - it only has to exceed the time React needs
 * to commit and paint a step, and overshooting costs nothing perceptible.
 *
 * What this cannot absorb is a render cost that varies between steps, which is why the per-step
 * render work is kept small and predictable.
 */
const VISUAL_LEAD_SEC = 0.06;

/**
 * Lookahead while a sequence runs. Tone invokes each scheduled callback this far ahead of the
 * instant it names, so a main thread that stalls for less than this still places its notes on
 * the exact sample.
 *
 * It cannot simply be raised, because it is also how far playback overruns a pause: notes inside
 * the window are already committed to the audio graph and will sound. Tone's default trades
 * those off at 100ms, comfortably more headroom than a step's render needs.
 */
const SEQUENCE_LOOKAHEAD_SEC = 0.1;

/**
 * Lookahead when nothing is scheduled. Tapping a key has no future instant to aim at, so the
 * whole budget is latency between finger and sound, and it is kept short at the cost of the
 * headroom a sequence wants.
 */
export const INTERACTIVE_LOOKAHEAD_SEC = 0.05;

/** One step of a sequence: its notes, and the UI update that belongs with them. */
export type ScheduledStep = {
  /** Seconds from the start of the sequence. */
  atSec: number;
  indices: readonly ActualIndex[];
  /** Runs on the draw loop, timed to land with the note rather than to cause it. */
  onVisual: () => void;
};

export type SequenceSchedule = {
  steps: readonly ScheduledStep[];
  /** How long each step's notes are held before the envelope releases. */
  noteDurationSec: number;
  envelope: SynthEnvelope;
  /** Seconds from the start at which the sequence has finished sounding. */
  endsAtSec: number;
  onComplete: () => void;
};

export function setLookAhead(seconds: number) {
  Tone.getContext().lookAhead = seconds;
}

/**
 * Queues a whole sequence on the Transport up front.
 *
 * Each note is placed at a named instant on the audio clock, so no amount of render jank can
 * move it; the matching UI update is handed to Tone.Draw for the same instant, started early by
 * {@link VISUAL_LEAD_SEC} so that it has paint by the time the note sounds. The visuals follow
 * the audio here - the audio no longer waits on a React commit to know when to fire.
 */
export function startScheduledSequence(schedule: SequenceSchedule): void {
  // Before raising the lookahead, since stopping restores the interactive one.
  stopScheduledSequence();
  setLookAhead(SEQUENCE_LOOKAHEAD_SEC);

  const transport = Tone.getTransport();
  const draw = Tone.getDraw();
  draw.anticipation = VISUAL_LEAD_SEC;

  setSequenceEnvelope(schedule.envelope);

  for (const step of schedule.steps) {
    transport.scheduleOnce((time) => {
      triggerSequenceNotes(step.indices, schedule.noteDurationSec, time);
      draw.schedule(step.onVisual, time);
    }, step.atSec);
  }

  transport.scheduleOnce((time) => {
    draw.schedule(schedule.onComplete, time);
  }, schedule.endsAtSec);

  transport.start();
}

/** Freezes transport time, so everything still queued keeps its spacing on resume. */
export function pauseScheduledSequence(): void {
  Tone.getTransport().pause();
}

export function resumeScheduledSequence(): void {
  setLookAhead(SEQUENCE_LOOKAHEAD_SEC);
  Tone.getTransport().start();
}

export function stopScheduledSequence(): void {
  const transport = Tone.getTransport();
  transport.stop();
  transport.cancel(0);
  transport.position = 0;
  setLookAhead(INTERACTIVE_LOOKAHEAD_SEC);
}
