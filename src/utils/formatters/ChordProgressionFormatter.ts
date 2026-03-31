import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { RomanChordFormatter } from "./RomanChordFormatter";

export class ChordProgressionFormatter {
  /** Progression-style roman labels joined for compact UI (e.g. selector summary). */
  static formatRomanNumeralsForDisplay(progression: ChordProgression): string {
    return progression.progression
      .map((e) =>
        RomanChordFormatter.formatProgressionRomanChord(e.value),
      )
      .join("→");
  }
}
