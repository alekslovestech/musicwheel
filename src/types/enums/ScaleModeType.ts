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
  DoubleHarmonicMajor = "Double Harmonic Major",
  HarmonicMinor = "Harmonic Minor",
  HungarianMinor = "Hungarian Minor",
  PanthuVaraali = "Panthu Varaali",
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
