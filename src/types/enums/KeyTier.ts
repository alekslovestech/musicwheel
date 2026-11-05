/**
 * How emphasized a key is, independent of whether it's black or white. Harmony mode uses Plain
 * and Active (selected); Scales mode uses all 4 (see KeyboardUtils.getKeyTier).
 */
export enum KeyTier {
  Plain = "Plain",
  /** Scales mode, black key outside the scale. Never assigned to a white key. */
  Muted = "Muted",
  /** Selected in Harmony mode, in the scale in Scales mode. */
  Active = "Active",
  /** Scales mode, the specific note a figure or playback is spotlighting. */
  Spotlight = "Spotlight",
}
