import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

export type SynthEnvelope = {
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

/**
 * How much of a step a note may occupy. The remainder is what guarantees the release begins
 * before the following step attacks rather than partway through it.
 */
const STEP_SUSTAIN_RATIO = 0.85;

/** A single tap has nothing following it, so the tail can be generous. */
export const DEFAULT_ENVELOPE: SynthEnvelope = {
  attack: 0.03,
  decay: 0.1,
  sustain: 0.3,
  release: 0.8,
};

/**
 * Sequence playback envelope. The release only shapes how a note's tail decays -
 * {@link stepNoteDurationSec} is what keeps the release from starting late - so this can stay
 * generous without smearing into the step that follows.
 */
const SEQUENCE_ENVELOPE: SynthEnvelope = {
  attack: 0.02,
  decay: 0.1,
  sustain: 0.3,
  release: 0.4,
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

/** Harmony and progression key clicks. */
const DEFAULT_CLICK: PlaybackProfile = {
  durationSec: 0.375,
  envelope: DEFAULT_ENVELOPE,
};

/**
 * Sequence playback holds every step the same way, scales and progressions alike; the shorter
 * per-mode profiles above apply to clicking a single degree. The duration here is an upper bound -
 * see {@link stepNoteDurationSec} for what a step of a given length actually gets.
 */
export const SEQUENCE_PLAYBACK: PlaybackProfile = {
  durationSec: 0.375,
  envelope: SEQUENCE_ENVELOPE,
};

/**
 * How long a step's notes are held, given how long the step itself is.
 *
 * Clamping to the step guarantees the release begins before the following step attacks, rather
 * than partway through it.
 */
export function stepNoteDurationSec(profile: PlaybackProfile, stepSec: number): number {
  return Math.min(profile.durationSec, stepSec * STEP_SUSTAIN_RATIO);
}

/** The profile for clicking a key or a scale degree, as opposed to a step of a sequence. */
export function resolveClickProfile(
  scalePlaybackMode: ScalePlaybackMode,
  isScaleClick: boolean,
): PlaybackProfile {
  if (!isScaleClick) return DEFAULT_CLICK;
  return scalePlaybackMode === ScalePlaybackMode.SingleNote
    ? SCALE_SINGLE_NOTE_CLICK
    : SCALE_TRIAD_CLICK;
}
