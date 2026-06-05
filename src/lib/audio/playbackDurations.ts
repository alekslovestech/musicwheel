/** Fixed playback timing. Chord progression step intervals use RhythmUtils.chordDurationMs. */

// Scale sequence: ms between auto-play steps
export const SCALE_STEP_MS_SINGLE_NOTE = 300;
export const SCALE_STEP_MS_TRIAD = 500;

// Scale key click: ms synth note length
export const SCALE_CLICK_MS_SINGLE_NOTE = 50;
export const SCALE_CLICK_MS_TRIAD = 250;

// Freeform / harmony key click: Tone duration notation (4n ≈ 500ms at default tempo)
export const CLICK_NOTE_TONE_DEFAULT = "8n.";
export const CLICK_NOTE_TONE_DEMO = "4n";
