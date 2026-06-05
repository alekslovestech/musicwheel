import * as Tone from "tone";

import { DEFAULT_ENVELOPE } from "@/lib/audio/playbackProfiles";

const DESTINATION_VOLUME_DB = -8;

export function createPolySynth(): Tone.PolySynth {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "fatsine2",
    },
    envelope: DEFAULT_ENVELOPE,
  }).toDestination();

  Tone.getDestination().volume.value = DESTINATION_VOLUME_DB;
  return synth;
}
