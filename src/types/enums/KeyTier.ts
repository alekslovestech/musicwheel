/**
 * How emphasized a key is, independent of whether it's black or white. Harmony mode uses Plain
 * and Spotlight (selected); Scales mode uses Muted, Active and Spotlight (see
 * KeyboardUtils.getKeyTier).
 */
export enum KeyTier {
  // Harmony mode, not selected. Black and white keys keep their piano colors.
  Plain = "Plain",
  // Scales mode, outside the scale. One tone for black and white keys, so the shape of the gaps
  // (the interval pattern) looks the same under rotation.
  Muted = "Muted",
  // Scales mode, in the scale but not selected.
  Active = "Active",
  // Selected, in either mode: the notes of a chord or the note playback is spotlighting.
  Spotlight = "Spotlight",
}
