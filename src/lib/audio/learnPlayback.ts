import {
  ensureToneContextRunning,
  playNotesNow,
  releaseAllVoices,
} from "@/lib/audio/audioEngine";
import { resolveClickProfile } from "@/lib/audio/playbackProfiles";
import { startScheduledSequence, stopScheduledSequence } from "@/lib/audio/sequenceScheduler";
import {
  buildProgressionSchedule,
  buildScaleSchedule,
  type SequenceStepVisual,
} from "@/lib/audio/sequenceSchedules";
import type { NoteIndices } from "@/types/IndexTypes";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import type { MusicalKey } from "@/types/Keys/MusicalKey";
import type { PreparedChordProgressionSequence } from "@/utils/SequencePlaybackUtils";

/**
 * Which Learn figure is sounding. The audio itself comes from the shared engine (audioEngine) and
 * scheduler, exactly as in the app; this module only adds the rule that one figure sounds at a
 * time: starting a figure ends the previous one, and ending a figure runs its `onEnd` so any
 * highlight it was showing is cleared.
 */

let activeId: string | null = null;
let activeOnEnd: (() => void) | null = null;
let endTimer: ReturnType<typeof setTimeout> | null = null;
// Bumped by every start and stop, so a play still waiting on the audio context can tell.
let token = 0;

const listeners = new Set<() => void>();

export function subscribeLearnPlayback(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The id of the figure currently sounding, or null. */
export function getActiveLearnPlaybackId(): string | null {
  return activeId;
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

function endCurrent(): void {
  if (endTimer !== null) clearTimeout(endTimer);
  endTimer = null;
  stopScheduledSequence();
  releaseAllVoices();

  const onEnd = activeOnEnd;
  activeOnEnd = null;
  activeId = null;
  onEnd?.();
}

function begin(id: string, onEnd: (() => void) | null): number {
  endCurrent();
  token += 1;
  activeId = id;
  activeOnEnd = onEnd;
  notify();
  return token;
}

function finish(myToken: number): void {
  if (myToken !== token) return;
  endCurrent();
  notify();
}

export function stopLearnPlayback(): void {
  token += 1;
  endCurrent();
  notify();
}

// Runs `play` once the engine is ready, ending the figure if it was superseded or fails.
async function run(id: string, onEnd: (() => void) | null, play: (myToken: number) => void) {
  const myToken = begin(id, onEnd);
  try {
    const running = await ensureToneContextRunning();
    if (myToken !== token) return;
    if (!running) throw new Error("Audio engine is not running");
    play(myToken);
  } catch (error) {
    console.error("Learn playback failed:", error);
    finish(myToken);
  }
}

/** Plays the notes together once, as a click on the chord would in the app. */
export function playChord(id: string, indices: NoteIndices): Promise<void> {
  return run(id, null, (myToken) => {
    const profile = resolveClickProfile(ScalePlaybackMode.SingleNote, false);
    playNotesNow(indices, profile.durationSec, profile.envelope);
    endTimer = setTimeout(
      () => finish(myToken),
      (profile.durationSec + profile.envelope.release) * 1000,
    );
  });
}

/** Plays the scale step by step; `onStep` follows each note, `onEnd` runs when it stops or ends. */
export function playScale(
  id: string,
  key: MusicalKey,
  mode: ScalePlaybackMode,
  onStep: SequenceStepVisual,
  onEnd: () => void,
): Promise<void> {
  return run(id, onEnd, (myToken) =>
    startScheduledSequence(buildScaleSchedule(key, mode, onStep, () => finish(myToken))),
  );
}

/** Plays a chord progression, each chord for its notated length. */
export function playProgression(
  id: string,
  prepared: PreparedChordProgressionSequence,
): Promise<void> {
  return run(id, null, (myToken) =>
    startScheduledSequence(
      buildProgressionSchedule(
        prepared,
        () => {},
        () => finish(myToken),
      ),
    ),
  );
}
