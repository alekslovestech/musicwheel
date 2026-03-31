import { ChordProgression } from "./ChordProgression";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

class ChordProgressionLibrarySingleton {
  private static instance: ChordProgressionLibrarySingleton;

  private constructor() {}

  public static getInstance(): ChordProgressionLibrarySingleton {
    if (!ChordProgressionLibrarySingleton.instance) {
      ChordProgressionLibrarySingleton.instance =
        new ChordProgressionLibrarySingleton();
    }
    return ChordProgressionLibrarySingleton.instance;
  }

  public getProgression(chordProgEnum: ChordProgressionType): ChordProgression {
    switch (chordProgEnum) {
      case ChordProgressionType.Perfect_Cadence:
        return new ChordProgression(["V", "I"], chordProgEnum);

      case ChordProgressionType.Plagal_Cadence:
        return new ChordProgression(["IV", "I"], chordProgEnum);

      case ChordProgressionType.LetItBe:
        return new ChordProgression(
          [
            "I:2",
            "I",
            "V",
            "V",
            "vi",
            "vi",
            "IV",
            "IV",
            "I:2",
            "I",
            "V",
            "V",
            "IV/I",
            "I/V:4",
            "viio",
            "I/V:2",
          ],
          chordProgEnum,
          102,
        );

      case ChordProgressionType.WithOrWithoutYou:
        return new ChordProgression(["I:1", "♭VII", "IV"], chordProgEnum, 110);

      case ChordProgressionType.Something:
        return new ChordProgression(
          ["I", "Imaj7", "I7", "IV", "iv", "I"],
          chordProgEnum,
          133,
        );

      default:
        throw new Error(`Unknown chord progression type: ${chordProgEnum}`);
    }
  }
}

export const ChordProgressionLibrary =
  ChordProgressionLibrarySingleton.getInstance();
