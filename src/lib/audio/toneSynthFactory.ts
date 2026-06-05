import * as Tone from "tone";

import { CLICK_NOTE_TONE_DEFAULT, CLICK_NOTE_TONE_DEMO } from "@/lib/audio/playbackDurations";

const DESTINATION_VOLUME_DB = -8;

const DEMO_ENVELOPE = {
  attack: 0.05,
  decay: 0.2,
  sustain: 0.7,
  release: 1.5,
};

const DEFAULT_ENVELOPE = {
  attack: 0.03,
  decay: 0.1,
  sustain: 0.3,
  release: 0.8,
};

export function noteDurationForDemoMode(isDemoMode: boolean): string {
  return isDemoMode ? CLICK_NOTE_TONE_DEMO : CLICK_NOTE_TONE_DEFAULT;
}

export function createPolySynth(isDemoMode: boolean): Tone.PolySynth {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "fatsine2",
    },
    envelope: isDemoMode ? DEMO_ENVELOPE : DEFAULT_ENVELOPE,
  }).toDestination();

  Tone.getDestination().volume.value = DESTINATION_VOLUME_DB;
  return synth;
}
