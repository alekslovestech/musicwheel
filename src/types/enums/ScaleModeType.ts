export enum ScaleModeType {
  Ionian = "Ionian",
  Dorian = "Dorian",
  Phrygian = "Phrygian",
  Lydian = "Lydian",
  Mixolydian = "Mixolydian",
  Aeolian = "Aeolian",
  Locrian = "Locrian",
  UkrainianDorian = "Ukrainian Dorian",
  PhrygianDominant = "Phrygian Dominant",
  Byzantine = "Byzantine",
  HarmonicMinor = "Harmonic Minor",
  HungarianMinor = "Hungarian Minor",
  Aroha = "Aroha (South Indian)",
}

const GREEK_SCALE_MODES = new Set<ScaleModeType>([
  ScaleModeType.Ionian,
  ScaleModeType.Dorian,
  ScaleModeType.Phrygian,
  ScaleModeType.Lydian,
  ScaleModeType.Mixolydian,
  ScaleModeType.Aeolian,
  ScaleModeType.Locrian,
]);

/** Diatonic rotations of the major scale; all others use open C major for staff spelling. */
export function isGreekScaleMode(mode: ScaleModeType): boolean {
  return GREEK_SCALE_MODES.has(mode);
}
