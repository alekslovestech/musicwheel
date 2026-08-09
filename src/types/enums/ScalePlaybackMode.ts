export enum ScalePlaybackMode {
  SingleNote = "Single Note",
  Triad = "Triad",
  DronedSingleNote = "Droned Single Note",
  Seventh = "Seventh",
}

/**
 * Modes that stack a chord on each scale degree, as opposed to sounding single notes.
 * These share behaviour throughout the UI: roman-numeral labels, a named chord reference,
 * a chords-only legend scoped to the qualities the key actually contains, and - in the
 * playback mode selector - one button with a 3/4 density control rather than two peers.
 */
export function isChordalScalePlaybackMode(mode: ScalePlaybackMode): boolean {
  return mode === ScalePlaybackMode.Triad || mode === ScalePlaybackMode.Seventh;
}

/**
 * One line under the ribbon naming what each mode holds fixed and what it varies - the parallel
 * (same tonic) vs. relative (same collection) distinction the app exists to make, which no icon
 * can carry. Triad and Seventh share a caption: they differ only in chord density, not in what
 * they're teaching.
 */
export const SCALE_PLAYBACK_MODE_CAPTIONS: Record<ScalePlaybackMode, string> = {
  [ScalePlaybackMode.SingleNote]: "the scale, plain",
  [ScalePlaybackMode.DronedSingleNote]: "same tonic, different scale",
  [ScalePlaybackMode.Triad]: "same chords, different home",
  [ScalePlaybackMode.Seventh]: "same chords, different home",
};
