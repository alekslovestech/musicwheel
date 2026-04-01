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
        return new ChordProgression(["V:1", "I"], chordProgEnum);

      case ChordProgressionType.Plagal_Cadence:
        return new ChordProgression(["IV:1", "I"], chordProgEnum);

      case ChordProgressionType.Line_Cliche:
        return new ChordProgression(["I:1", "I+", "vi/I"], chordProgEnum);

      //correct but plays weird if a Major is specified - investigate
      case ChordProgressionType.Around_The_World:
        return new ChordProgression(["i:2", "v", "VI", "VII"], chordProgEnum);

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

      case ChordProgressionType.LetItBe_Intermission:
        return new ChordProgression(
          [
            "IV/I:2",
            "I:4",
            "viio:4",
            "I/V:2",
            "V:4",
            "IV:4",
            "V/II:2",
            "IV/I:2",
            "I:1",
          ],
          chordProgEnum,
          102,
        );

      case ChordProgressionType.WithOrWithoutYou:
        return new ChordProgression(["I:1", "♭VII", "IV"], chordProgEnum, 110);

      case ChordProgressionType.Something:
        return new ChordProgression(
          ["I:1", "Imaj7", "I7", "IV", "iv", "I"],
          chordProgEnum,
          133,
        );

      case ChordProgressionType.Blues:
        return new ChordProgression(
          ["I:2", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "I"],
          chordProgEnum,
        );

      case ChordProgressionType.Creep:
        return new ChordProgression(["I:1", "III", "IV", "iv"], chordProgEnum);

      default:
        throw new Error(`Unknown chord progression type: ${chordProgEnum}`);
    }
  }
}

export const ChordProgressionLibrary =
  ChordProgressionLibrarySingleton.getInstance();
