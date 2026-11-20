import {
  buildProgressionSchedule,
  buildScaleSchedule,
  type SequenceStepVisual,
} from "@/lib/audio/sequenceSchedules";
import { resolveClickProfile, type SynthEnvelope } from "@/lib/audio/playbackProfiles";
import type { NoteIndices } from "@/types/IndexTypes";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import type { MusicalKey } from "@/types/Keys/MusicalKey";
import type { PreparedChordProgressionSequence } from "@/utils/SequencePlaybackUtils";

/**
 * Playback for Learn figures. The app's audio engine lives under the (app) route group so static
 * content never pulls in Tone.js; this module is the Learn side's stand-in. Tone, the voice pool and
 * the scheduler are loaded on the first play click, never at page load, and one shared pool then
 * serves every figure on every page.
 *
 * Only one figure sounds at a time: starting a figure ends the previous one, and ending a figure
 * runs its `onEnd` so any highlight it was showing is cleared.
 */

type Engine = {
  now: () => number;
  pool: {
    releaseAll: () => void;
    setEnvelope: (envelope: SynthEnvelope) => void;
    triggerNotes: (indices: NoteIndices, durationSec: number, time: number) => void;
  };
  startScheduledSequence: (schedule: ReturnType<typeof buildScaleSchedule>) => void;
  stopScheduledSequence: () => void;
};

let engine: Engine | null = null;
let enginePromise: Promise<Engine> | null = null;

let activeId: string | null = null;
let activeOnEnd: (() => void) | null = null;
let endTimer: ReturnType<typeof setTimeout> | null = null;
// Bumped by every start and stop, so a play that was still loading when another began can tell.
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

async function loadEngine(): Promise<Engine> {
  enginePromise ??= (async () => {
    const [Tone, { VoicePool }, bridge, scheduler] = await Promise.all([
      import("tone"),
      import("@/lib/audio/voicePool"),
      import("@/lib/audio/sequenceVoiceBridge"),
      import("@/lib/audio/sequenceScheduler"),
    ]);
    // Needs the user gesture that called play.
    await Tone.start();

    const pool = new VoicePool();
    bridge.setSequenceSynth(pool);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopLearnPlayback();
    });

    const loaded: Engine = {
      now: () => Tone.now(),
      pool,
      startScheduledSequence: scheduler.startScheduledSequence,
      stopScheduledSequence: scheduler.stopScheduledSequence,
    };
    engine = loaded;
    return loaded;
  })().catch((error) => {
    enginePromise = null;
    throw error;
  });
  return enginePromise;
}

function endCurrent(): void {
  if (endTimer !== null) clearTimeout(endTimer);
  endTimer = null;
  engine?.stopScheduledSequence();
  engine?.pool.releaseAll();

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

/** Plays the notes together once, as a click on the chord would in the app. */
export async function playChord(id: string, indices: NoteIndices): Promise<void> {
  const myToken = begin(id, null);
  try {
    const loaded = await loadEngine();
    if (myToken !== token) return;

    const profile = resolveClickProfile(ScalePlaybackMode.SingleNote, false);
    loaded.pool.setEnvelope(profile.envelope);
    loaded.pool.releaseAll();
    loaded.pool.triggerNotes(indices, profile.durationSec, loaded.now());
    endTimer = setTimeout(
      () => finish(myToken),
      (profile.durationSec + profile.envelope.release) * 1000,
    );
  } catch {
    finish(myToken);
  }
}

/** Plays the scale step by step; `onStep` follows each note, `onEnd` runs when it stops or ends. */
export async function playScale(
  id: string,
  key: MusicalKey,
  mode: ScalePlaybackMode,
  onStep: SequenceStepVisual,
  onEnd: () => void,
): Promise<void> {
  const myToken = begin(id, onEnd);
  try {
    const loaded = await loadEngine();
    if (myToken !== token) return;

    loaded.startScheduledSequence(
      buildScaleSchedule(key, mode, onStep, () => finish(myToken)),
    );
  } catch {
    finish(myToken);
  }
}

/** Plays a chord progression, each chord for its notated length. */
export async function playProgression(
  id: string,
  prepared: PreparedChordProgressionSequence,
): Promise<void> {
  const myToken = begin(id, null);
  try {
    const loaded = await loadEngine();
    if (myToken !== token) return;

    loaded.startScheduledSequence(
      buildProgressionSchedule(
        prepared,
        () => {},
        () => finish(myToken),
      ),
    );
  } catch {
    finish(myToken);
  }
}
