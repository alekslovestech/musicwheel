export enum ChordType {
  Unknown = "Chord_Unknown",
  // Triads
  Major = "Chord_Maj",
  Minor = "Chord_Min",
  Diminished = "Chord_Dim",
  Augmented = "Chord_Aug",

  // Seventh chords
  Major7 = "Chord_Maj7",
  Minor7 = "Chord_Min7",
  Dominant7 = "Chord_Dom7",
  Dominant7Flat5 = "Chord_Dom7b5", //C E G♭ B♭ - symmetric; enharmonic with the 7♭5 a tritone away
  MinorMajor7 = "Chord_MMaj7",
  HalfDiminished = "Chord_M7b5",
  Diminished7 = "Chord_Dim7",
  AugMajor7 = "Chord_AugMaj7",
  Major7Sus4 = "Chord_Maj7Sus4", //C F G B - sus4 with major 7th, no 3rd
  Dominant7Sus2Flat5 = "Chord_Dom7Sus2b5", //C D F# Bb - sus2 dominant 7th with flat 5, no 3rd
  Major7Flat5 = "Chord_Maj7Flat5", //C E Gb B - major 7th with flat 5 (distinct from HalfDiminished, the minor version)
  Sus2Add6 = "Chord_Sus2Add6", //C D G A - sus2 with added 6th, no 7th

  // Other
  Sus4 = "Chord_Sus4",
  Sus2 = "Chord_Sus2",
  Add9 = "Chord_Add9",
  Add2 = "Chord_Add2",
  Major6 = "Chord_Maj6",
  Minor6 = "Chord_Min6",
  Seven13 = "Chord_7Add13",

  //Spread triads
  SpreadMajor = "Chord_Spread_Maj",
  SpreadMinor = "Chord_Spread_Min",
  SpreadAugmented = "Chord_Spread_Aug",
  SpreadDiminished = "Chord_Spread_Dim",

  //Narrow chords
  MajFlat5 = "Chord_Maj_b5", //C E G♭
  Narrow23 = "Chord_Narrow_23", //C D E
  Sus2_4 = "Chord_Sus2_4", //C D F
  Narrow34 = "Chord_Narrow_34", //C E F
  Sus2sharp4 = "Chord_Sus2#4", //C D F#
  Narrow_b3_4 = "Chord_m_add4", //C Eb F
}
