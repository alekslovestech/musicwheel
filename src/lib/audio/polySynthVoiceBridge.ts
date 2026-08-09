import type { ActualIndex } from "@/types/IndexTypes";
import type { SynthEnvelope } from "@/lib/audio/playbackProfiles";

/**
 * Bridges Tone.PolySynth (AudioPlayer) and sequence playback (useSequencePlayback), which owns
 * the schedule but not the synth: AudioPlayer registers once, and the sequencer then releases
 * voices or queues notes on the Web Audio clock without holding a reference to the synth.
 */
export type SequenceSynth = {
  releaseAll: () => void;
  setEnvelope: (envelope: SynthEnvelope) => void;
  /** `time` is an instant on the Web Audio clock, not a delay from now. */
  triggerNotes: (indices: readonly ActualIndex[], durationSec: number, time: number) => void;
};

let sequenceSynth: SequenceSynth | null = null;

/** AudioPlayer: wire the live Tone.PolySynth; pass null on teardown. */
export function setSequenceSynth(synth: SequenceSynth | null): void {
  sequenceSynth = synth;
}

/** Tone.PolySynth.releaseAll — no-op until AudioPlayer has registered. */
export function releasePolySynthVoicesNow(): void {
  sequenceSynth?.releaseAll();
}

/**
 * Set once per playback run rather than per step: notes are queued ahead of time, so changing
 * the envelope mid-run would reshape voices that are already scheduled but not yet sounding.
 */
export function setSequenceEnvelope(envelope: SynthEnvelope): void {
  sequenceSynth?.setEnvelope(envelope);
}

/** Queues one step's notes at an exact instant, whatever the main thread is doing meanwhile. */
export function triggerSequenceNotes(
  indices: readonly ActualIndex[],
  durationSec: number,
  time: number,
): void {
  sequenceSynth?.triggerNotes(indices, durationSec, time);
}
