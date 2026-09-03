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
export const STEP_SUSTAIN_RATIO = 0.85;

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

/**
 * Ceiling on how long a progression chord rings. Sized for a chord that's clearly been let ring,
 * not a click - well above {@link DEFAULT_CLICK}'s duration - but short of a whole note's full
 * notated length, which would otherwise drone for most of a bar.
 */
const PROGRESSION_HOLD_CAP_SEC = 0.8;

/**
 * How long a progression chord rings, given its own notated length. Shorter notes (quarters,
 * eighths) scale with their step so they stay clearly distinct from one another; longer notes
 * (halves, wholes) are clamped to {@link PROGRESSION_HOLD_CAP_SEC} rather than holding their full
 * length, which would otherwise drone for most of a bar.
 */
export function progressionStepDurationSec(stepSec: number): number {
  return Math.min(PROGRESSION_HOLD_CAP_SEC, stepSec * STEP_SUSTAIN_RATIO);
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
