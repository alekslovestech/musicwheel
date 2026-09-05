export const MAJOR_KEY_SIGNATURES: Record<string, string[]> = {
  C: [],
  G: ["F#"],
  D: ["F#", "C#"],
  A: ["F#", "C#", "G#"],
  E: ["F#", "C#", "G#", "D#"],
  B: ["F#", "C#", "G#", "D#", "A#"],
  "F#": ["F#", "C#", "G#", "D#", "A#", "E#"], //in major key we prefer sharps
  F: ["Bb"],
  Bb: ["Bb", "Eb"],
  Eb: ["Bb", "Eb", "Ab"],
  Ab: ["Bb", "Eb", "Ab", "Db"],
  Db: ["Bb", "Eb", "Ab", "Db", "Gb"],
};

export const MINOR_KEY_SIGNATURES: Record<string, string[]> = {
  A: [],
  E: ["F#"],
  B: ["F#", "C#"],
  "F#": ["F#", "C#", "G#"],
  "C#": ["F#", "C#", "G#", "D#"],
  "G#": ["F#", "C#", "G#", "D#", "A#"],
  D: ["Bb"],
  G: ["Bb", "Eb"],
  C: ["Bb", "Eb", "Ab"],
  F: ["Bb", "Eb", "Ab", "Db"],
  Bb: ["Bb", "Eb", "Ab", "Db", "Gb"],
  Eb: ["Bb", "Eb", "Ab", "Db", "Gb", "Cb"], //in minor key we prefer flats
};

/**
 * The one pitch class MAJOR_KEY_SIGNATURES has no flat spelling for (only sharp-preferring
 * "F#") - needed when a derived key (a mode's relative Ionian, via
 * {@link MusicalKey.getCanonicalIonianKey}) must respell using the flat side. Not one of the 12
 * canonical picker/URL tonics, so not added to MAJOR_KEY_SIGNATURES itself. Gb major and Eb minor
 * are relative keys and so share one signature - see MINOR_KEY_SIGNATURES.Eb above.
 */
export const ENHARMONIC_FLAT_MAJOR_TONIC = "Gb";
