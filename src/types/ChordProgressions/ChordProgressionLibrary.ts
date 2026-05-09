import { ChordProgression } from "./ChordProgression";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { KeyType } from "@/types/enums/KeyType";
import {
  PerfectCadenceChords,
  PlagalCadenceChords,
  LineClicheChords,
  GypsyWomanChords,
  AroundTheWorldChords,
  LetItBeChords,
  LetItBeIntermissionChords,
  WithOrWithoutYouChords,
  SomethingChords,
  BluesChords,
  CreepChords,
} from "./songs";

class ChordProgressionLibrarySingleton {
  private static instance: ChordProgressionLibrarySingleton;

  private constructor() {}

  public static getInstance(): ChordProgressionLibrarySingleton {
    if (!ChordProgressionLibrarySingleton.instance) {
      ChordProgressionLibrarySingleton.instance = new ChordProgressionLibrarySingleton();
    }
    return ChordProgressionLibrarySingleton.instance;
  }

  public getProgression(chordProgEnum: ChordProgressionType): ChordProgression {
    switch (chordProgEnum) {
      case ChordProgressionType.Perfect_Cadence:
        return new ChordProgression(PerfectCadenceChords, chordProgEnum);

      case ChordProgressionType.Plagal_Cadence:
        return new ChordProgression(PlagalCadenceChords, chordProgEnum);

      case ChordProgressionType.Line_Cliche:
        return new ChordProgression(LineClicheChords, chordProgEnum);

      case ChordProgressionType.Gypsy_Woman:
        return new ChordProgression(GypsyWomanChords, chordProgEnum, 120, MusicalKey.fromClassicalMode("F", KeyType.Major));

      //correct but plays weird if a Major is specified - investigate
      case ChordProgressionType.Around_The_World:
        return new ChordProgression(AroundTheWorldChords, chordProgEnum, 120, MusicalKey.fromClassicalMode("A", KeyType.Minor));

      case ChordProgressionType.LetItBe:
        return new ChordProgression(LetItBeChords, chordProgEnum, 102, MusicalKey.fromClassicalMode("C", KeyType.Major));

      case ChordProgressionType.LetItBe_Intermission:
        return new ChordProgression(LetItBeIntermissionChords, chordProgEnum, 102, MusicalKey.fromClassicalMode("C", KeyType.Major));

      case ChordProgressionType.WithOrWithoutYou:
        return new ChordProgression(WithOrWithoutYouChords, chordProgEnum, 110, MusicalKey.fromClassicalMode("D", KeyType.Major));

      case ChordProgressionType.Something:
        return new ChordProgression(SomethingChords, chordProgEnum, 133, MusicalKey.fromClassicalMode("C", KeyType.Major));

      case ChordProgressionType.Blues:
        return new ChordProgression(BluesChords, chordProgEnum);

      case ChordProgressionType.Creep:
        return new ChordProgression(CreepChords, chordProgEnum, 92, MusicalKey.fromClassicalMode("G", KeyType.Major));

      default:
        throw new Error(`Unknown chord progression type: ${chordProgEnum}`);
    }
  }
}

export const ChordProgressionLibrary = ChordProgressionLibrarySingleton.getInstance();
