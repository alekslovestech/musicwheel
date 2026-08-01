export enum ScalePlaybackMode {
  SingleNote = "Single Note",
  Triad = "Triad",
  DronedSingleNote = "Droned Single Note",
  Seventh = "Seventh",
}

/**
 * Modes that stack a chord on each scale degree, as opposed to sounding single notes.
 * These share behaviour throughout the UI: roman-numeral labels, a named chord reference,
 * and a chords-only legend scoped to the qualities the key actually contains.
 */
export function isChordalScalePlaybackMode(mode: ScalePlaybackMode): boolean {
  return mode === ScalePlaybackMode.Triad || mode === ScalePlaybackMode.Seventh;
}
