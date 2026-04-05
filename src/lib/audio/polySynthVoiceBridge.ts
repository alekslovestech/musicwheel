/**
 * Bridges Tone.PolySynth (AudioPlayer) and chord progression playback
 * (useSequencePlayback): register once, call releasePolySynthVoicesNow when needed.
 */
let releaseAllPolySynthVoices: (() => void) | null = null;

/** AudioPlayer: wire Tone.PolySynth.releaseAll; pass null on teardown. */
export function setPolySynthVoiceReleaser(fn: (() => void) | null): void {
  releaseAllPolySynthVoices = fn;
}

/** Tone.PolySynth.releaseAll — no-op until AudioPlayer has registered. */
export function releasePolySynthVoicesNow(): void {
  releaseAllPolySynthVoices?.();
}
