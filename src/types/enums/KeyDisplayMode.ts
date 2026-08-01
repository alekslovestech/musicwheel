export enum KeyDisplayMode {
  NoteNames = "Note Names",
  ScaleDegree = "Scale Degree",
  Roman = "Roman",
  /**
   * Compact roman numeral + bare "7" (e.g. V7), quality dropped since the wheel has no room
   * for it and color already conveys it. Derived from Seventh playback, not user-selectable.
   */
  RomanSeventh = "Roman Seventh",
}
