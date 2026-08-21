import * as Tone from "tone";

import { DEFAULT_ENVELOPE, type SynthEnvelope } from "@/lib/audio/playbackProfiles";
import { frequencyFromIndex } from "@/lib/audio/toneFrequency";
import type { ActualIndex } from "@/types/IndexTypes";

const DESTINATION_VOLUME_DB = -8;

/**
 * Every voice is built once, up front, and kept for the life of the pool - none are constructed
 * or disposed while a sequence is running, so no chord note is ever waiting on a `fatsine2`
 * (three detuned oscillators) to finish being built before it can sound.
 *
 * Sized for the worst overlap a sequence produces - a four-note chord still ringing while the next
 * few steps attack - with enough spare that the allocator never has to steal a sounding voice.
 */
const VOICE_COUNT = 24;

/**
 * A pre-allocated bank of monophonic voices, played by absolute instants on the Web Audio clock.
 *
 * Each voice's `triggerAttackRelease` writes both the attack and the release as parameter
 * automation on the audio clock, so a note's timing is fixed the instant it is triggered and
 * nothing the main thread does afterwards - rendering, garbage collection, anything - can move it.
 */
export class VoicePool {
  private readonly voices: Tone.Synth[] = [];
  /** Clock instant each voice next falls silent; -Infinity for one that has never sounded. */
  private readonly silentAtSec: number[] = [];
  private envelope: SynthEnvelope = DEFAULT_ENVELOPE;

  constructor() {
    for (let index = 0; index < VOICE_COUNT; index++) {
      this.voices.push(
        new Tone.Synth({
          oscillator: { type: "fatsine2" },
          envelope: DEFAULT_ENVELOPE,
        }).toDestination(),
      );
      this.silentAtSec.push(Number.NEGATIVE_INFINITY);
    }

    Tone.getDestination().volume.value = DESTINATION_VOLUME_DB;
  }

  setEnvelope(envelope: SynthEnvelope): void {
    this.envelope = envelope;
    this.voices.forEach((voice) => voice.set({ envelope }));
  }

  /**
   * Queues one step's notes at an exact instant. Both the attack and the release are placed on the
   * audio clock here and now, so neither waits on the main thread getting another turn.
   */
  triggerNotes(indices: readonly ActualIndex[], durationSec: number, time: number): void {
    const silentAt = time + durationSec + this.envelope.release;

    indices.forEach((index) => {
      const voiceIndex = this.claimVoice(time);
      this.silentAtSec[voiceIndex] = silentAt;
      this.voices[voiceIndex].triggerAttackRelease(frequencyFromIndex(index), durationSec, time);
    });
  }

  /** Cuts short whatever is sounding. Voices already silent are left alone by Tone's own guards. */
  releaseAll(time: number = Tone.now()): void {
    const silentAt = time + this.envelope.release;

    this.voices.forEach((voice, index) => {
      voice.triggerRelease(time);
      this.silentAtSec[index] = Math.min(this.silentAtSec[index], silentAt);
    });
  }

  dispose(): void {
    this.voices.forEach((voice) => voice.dispose());
  }

  /**
   * The first voice already silent at this instant. The pool is sized so one always is - see
   * {@link VOICE_COUNT} - which is what keeps a note's tail from being cut out from under it by
   * the next step.
   */
  private claimVoice(time: number): number {
    return this.silentAtSec.findIndex((silentAt) => silentAt <= time);
  }
}
