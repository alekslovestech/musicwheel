export const CHORD_OFFSET_PATTERNS = {
  MAJOR: [0, 4, 7], //1-3-5
  MINOR: [0, 3, 7], //1-b3-5
  DIMINISHED: [0, 3, 6], //1-b3-b5
  AUGMENTED: [0, 4, 8], //1-3-#5
  MAJ_FLAT5: [0, 4, 6], //1-3-♭5
  SUS4: [0, 5, 7], //1-4-5
  SUS2: [0, 2, 7], //1-2-5

  DOMINANT7: [0, 4, 7, 10], //1-3-5-b7
  MAJOR7: [0, 4, 7, 11], //1-3-5-7
  MINOR7: [0, 3, 7, 10], //1-b3-5-b7
  HALF_DIMINISHED7: [0, 3, 6, 10], //1-b3-b5-b7
  DOMINANT7_FLAT5: [0, 4, 6, 10], //1-3-b5-b7
  MINOR_MAJOR7: [0, 3, 7, 11], //1-b3-5-7
  DIMINISHED7: [0, 3, 6, 9], //1-b3-b5-bb7

  MAJOR6: [0, 4, 7, 9], //1-3-5-6
  MINOR6: [0, 3, 7, 9], //1-b3-5-6
  AUGMENTED_MAJOR7: [0, 4, 8, 11], //1-3-#5-7
  MAJOR7_SUS4: [0, 5, 7, 11], //1-4-5-7
  DOMINANT7_SUS2_FLAT5: [0, 2, 6, 10], //1-2-b5-b7
  MAJOR7_FLAT5: [0, 4, 6, 11], //1-3-b5-7
  SUS2_ADD6: [0, 2, 7, 9], //1-2-5-6

  ADD9: [0, 4, 7, 14], //1-3-5-9
  ADD2: [0, 2, 4, 7], //1-2-3-5
  SEVEN13: [0, 4, 7, 10, 13], //1-3-5-b7-13

  SPREAD_MAJOR: [0, 7, 16], //1-5-1'
  SPREAD_MINOR: [0, 7, 15], //1-5-♭7'
  SPREAD_AUGMENTED: [0, 8, 16], //1-#5-1'
  SPREAD_DIMINISHED: [0, 6, 15], //1-♭5-♭7'

  NARROW_23: [0, 2, 4], //1-2-3
  NARROW_24: [0, 2, 5], //1-2-4
  NARROW_34: [0, 4, 5], //1-3-4
  NARROW_24_SHARP: [0, 2, 6], //1-2-#4 (sus2♯4)
  NARROW_3_FLAT_4: [0, 3, 5], //1-♭3-4
};
