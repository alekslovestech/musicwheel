/** Scale sequence step intervals (ms between auto-play steps). Chord progression steps use RhythmUtils.chordDurationMs. */

export const SCALE_STEP_MS_SINGLE_NOTE = 300;
export const SCALE_STEP_MS_DRONED = 400;
export const SCALE_STEP_MS_TRIAD = 500;

/** Delay before the first scale step so Tone + synth can initialize on play. */
export const SCALE_AUDIO_WARMUP_MS = 150;
