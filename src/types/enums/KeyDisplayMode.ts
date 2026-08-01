export enum KeyDisplayMode {
  NoteNames = "Note Names",
  ScaleDegree = "Scale Degree",
  Roman = "Roman",
  /**
   * Roman numeral only, no quality suffix: the wheel has no room for full quality (e.g.
   * "♭IIΔ7sus4"), and a bare "7" would misrepresent chords with no literal 7th. Color
   * conveys quality instead. Derived from Seventh playback, not user-selectable.
   */
  RomanSeventh = "Roman Seventh",
}
