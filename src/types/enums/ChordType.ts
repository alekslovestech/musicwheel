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
  MinorMajor7 = "Chord_MMaj7",
  HalfDiminished = "Chord_M7b5",
  Diminished7 = "Chord_Dim7",
  AugMajor7 = "Chord_AugMaj7",

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
  Narrow24 = "Chord_Narrow_24", //C D F
  Narrow34 = "Chord_Narrow_34", //C E F
  Narrow24sharp = "Chord_Narrow_24#", //C D F#

  Narrow3flat4 = "Chord_Narrow_3flat4", //C E Fb
}
