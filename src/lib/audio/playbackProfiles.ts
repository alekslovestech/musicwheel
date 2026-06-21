import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

type SynthEnvelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export type PlaybackProfile = {
  /** Note hold time before envelope release, in seconds. */
  durationSec: number;
  envelope: SynthEnvelope;
};

export const DEFAULT_ENVELOPE: SynthEnvelope = {
  attack: 0.03,
  decay: 0.1,
  sustain: 0.3,
  release: 0.8,
};

const SCALE_SINGLE_NOTE_CLICK: PlaybackProfile = {
  durationSec: 0.3,
  envelope: {
    attack: 0.025,
    decay: 0.1,
    sustain: 0.25,
    release: 0.38,
  },
};

const SCALE_TRIAD_CLICK: PlaybackProfile = {
  durationSec: 0.25,
  envelope: DEFAULT_ENVELOPE,
};

/** Sequence playback and harmony / progression key clicks. */
const DEFAULT_CLICK: PlaybackProfile = {
  durationSec: 0.375,
  envelope: DEFAULT_ENVELOPE,
};

export function resolvePlaybackProfile(
  scalePlaybackMode: ScalePlaybackMode,
  isScaleClick: boolean,
): PlaybackProfile {
  if (!isScaleClick) return DEFAULT_CLICK;
  return scalePlaybackMode === ScalePlaybackMode.SingleNote
    ? SCALE_SINGLE_NOTE_CLICK
    : SCALE_TRIAD_CLICK;
}
