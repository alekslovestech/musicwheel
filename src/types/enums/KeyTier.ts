/**
 * How emphasized a key is, independent of whether it's black or white. Harmony mode uses Plain
 * and Active (selected); Scales mode uses Muted, Active and Spotlight (see
 * KeyboardUtils.getKeyTier).
 */
export enum KeyTier {
  // Harmony mode, not selected. Black and white keys keep their piano colors.
  Plain = "Plain",
  // Scales mode, outside the scale. One tone for black and white keys, so the shape of the gaps
  // (the interval pattern) looks the same under rotation.
  Muted = "Muted",
  // Selected in Harmony mode, in the scale in Scales mode.
  Active = "Active",
  // Scales mode, the specific note a figure or playback is spotlighting.
  Spotlight = "Spotlight",
}
