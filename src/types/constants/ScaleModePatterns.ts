export const SCALE_MODE_PATTERNS = {
  //greek modes
  IONIAN: [0, 2, 4, 5, 7, 9, 11], //aka Major
  DORIAN: [0, 2, 3, 5, 7, 9, 10],
  PHRYGIAN: [0, 1, 3, 5, 7, 8, 10],
  LYDIAN: [0, 2, 4, 6, 7, 9, 11],
  MIXOLYDIAN: [0, 2, 4, 5, 7, 9, 10],
  AEOLIAN: [0, 2, 3, 5, 7, 8, 10], // aka Natural Minor
  LOCRIAN: [0, 1, 3, 5, 6, 8, 10],

  //other scales
  UKRAINIAN_DORIAN: [0, 2, 3, 6, 7, 9, 10], // Dorian with #4
  PHRYGIAN_DOMINANT: [0, 1, 4, 5, 7, 8, 10], // Phrygian Dominant
  BYZANTINE: [0, 1, 4, 5, 7, 8, 11], // Byzantine
  HARMONIC_MINOR: [0, 2, 3, 5, 7, 8, 11], // Harmonic Minor
  HUNGARIAN_MINOR: [0, 2, 3, 6, 7, 8, 11], // Hungarian Minor
  PANTHU_VARAALI: [0, 1, 4, 6, 7, 8, 11], // Panthu Varaali
};
