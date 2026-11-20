import * as Tone from "tone";

import type { SynthEnvelope } from "@/lib/audio/playbackProfiles";
import { INTERACTIVE_LOOKAHEAD_SEC, setLookAhead } from "@/lib/audio/sequenceScheduler";
import { setSequenceSynth } from "@/lib/audio/sequenceVoiceBridge";
import { VoicePool } from "@/lib/audio/voicePool";
import type { ActualIndex } from "@/types/IndexTypes";

/**
 * The one audio engine, shared by the interactive app and the Learn figures. It owns the Tone
 * context (resumed from any user gesture), the voice pool, and silencing on backgrounding. It is
 * started once from the root layout, so every route has it from the start.
 */

let pool: VoicePool | null = null;
let initialized = false;
let ready = false;

const listeners = new Set<() => void>();

export function subscribeAudioEngine(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** True once the context is running and the voice pool is built. */
export function isAudioReady(): boolean {
  return ready;
}

function setReady(value: boolean): void {
  if (ready === value) return;
  ready = value;
  listeners.forEach((listener) => listener());
}

/** Builds every voice once, so that no step of a sequence ever pays for one. */
function ensurePool(): void {
  if (pool) return;
  try {
    pool = new VoicePool();
    // VoicePool already matches SequenceSynth's shape, so the sequencer can call it directly.
    setSequenceSynth(pool);
  } catch (error) {
    pool = null;
    console.error("Failed to initialize synth:", error);
  }
}

function syncReady(): void {
  if (Tone.getContext().state !== "running") return;
  ensurePool();
  setReady(pool !== null);
}

export async function ensureToneContextRunning(): Promise<boolean> {
  try {
    if (Tone.getContext().state !== "running") {
      // The sequence scheduler owns this while a run is in flight and restores it on stop, so this
      // only ever applies to a cold start.
      setLookAhead(INTERACTIVE_LOOKAHEAD_SEC);
      await Tone.start();
    }
    syncReady();
    return ready;
  } catch (error) {
    console.error("Failed to resume audio context:", error);
    return false;
  }
}

/** Idempotent. Call once from the root of the page. */
export function initAudioEngine(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  const resume = () => void ensureToneContextRunning();
  const captureOptions: AddEventListenerOptions = { capture: true };

  document.addEventListener("click", resume, captureOptions);
  document.addEventListener("touchstart", resume, captureOptions);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // A one-off chord has no transport to pause, so releasing is the equivalent action.
      pool?.releaseAll();
    } else {
      resume();
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) resume();
  });
  Tone.getContext().rawContext?.addEventListener("statechange", syncReady);

  syncReady();
}

export function releaseAllVoices(): void {
  pool?.releaseAll();
}

/** Sounds the notes together once, cutting whatever was sounding. Returns false if not ready. */
export function playNotesNow(
  indices: readonly ActualIndex[],
  durationSec: number,
  envelope: SynthEnvelope,
): boolean {
  if (!pool) return false;
  pool.setEnvelope(envelope);
  pool.releaseAll();
  // One clock instant for the whole selection: triggering notes individually would put each
  // attack on its own microtask, spreading a chord's onset across several milliseconds.
  pool.triggerNotes(indices, durationSec, Tone.now());
  return true;
}
