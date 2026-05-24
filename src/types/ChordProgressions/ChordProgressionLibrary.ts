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
  TheWorldIsNotEnoughChords,
  AllIWantForChristmasChords,
  CarelessWhisperChords,
  MichelleChords,
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
        return ChordProgression.fromFile(PerfectCadenceChords, chordProgEnum);

      case ChordProgressionType.Plagal_Cadence:
        return ChordProgression.fromFile(PlagalCadenceChords, chordProgEnum);

      case ChordProgressionType.Line_Cliche:
        return ChordProgression.fromFile(LineClicheChords, chordProgEnum);

      case ChordProgressionType.Gypsy_Woman:
        return ChordProgression.fromFile(
          GypsyWomanChords,
          chordProgEnum,
          120,
          MusicalKey.fromClassicalMode("F", KeyType.Major),
        );

      //correct but plays weird if a Major is specified - investigate
      case ChordProgressionType.Around_The_World:
        return ChordProgression.fromFile(
          AroundTheWorldChords,
          chordProgEnum,
          120,
          MusicalKey.fromClassicalMode("A", KeyType.Minor),
        );

      case ChordProgressionType.LetItBe:
        return ChordProgression.fromFile(
          LetItBeChords,
          chordProgEnum,
          102,
          MusicalKey.fromClassicalMode("C", KeyType.Major),
        );

      case ChordProgressionType.LetItBe_Intermission:
        return ChordProgression.fromFile(
          LetItBeIntermissionChords,
          chordProgEnum,
          102,
          MusicalKey.fromClassicalMode("C", KeyType.Major),
        );

      case ChordProgressionType.WithOrWithoutYou:
        return ChordProgression.fromFile(
          WithOrWithoutYouChords,
          chordProgEnum,
          110,
          MusicalKey.fromClassicalMode("D", KeyType.Major),
        );

      case ChordProgressionType.Something:
        return ChordProgression.fromFile(
          SomethingChords,
          chordProgEnum,
          133,
          MusicalKey.fromClassicalMode("C", KeyType.Major),
        );

      case ChordProgressionType.Blues:
        return ChordProgression.fromFile(BluesChords, chordProgEnum);

      case ChordProgressionType.Creep:
        return ChordProgression.fromFile(
          CreepChords,
          chordProgEnum,
          92,
          MusicalKey.fromClassicalMode("G", KeyType.Major),
        );

      case ChordProgressionType.The_World_Is_Not_Enough:
        return ChordProgression.fromFile(
          TheWorldIsNotEnoughChords,
          chordProgEnum,
          86,
          MusicalKey.fromClassicalMode("F", KeyType.Minor),
        );

      case ChordProgressionType.All_I_Want_For_Christmas:
        return ChordProgression.fromFile(
          AllIWantForChristmasChords,
          chordProgEnum,
          150,
          MusicalKey.fromClassicalMode("G", KeyType.Major),
        );

      case ChordProgressionType.Careless_Whisper:
        return ChordProgression.fromFile(
          CarelessWhisperChords,
          chordProgEnum,
          76,
          MusicalKey.fromClassicalMode("D", KeyType.Minor),
        );

      case ChordProgressionType.Michelle:
        return ChordProgression.fromFile(
          MichelleChords,
          chordProgEnum,
          72,
          MusicalKey.fromClassicalMode("F", KeyType.Minor),
        );

      default:
        throw new Error(`Unknown chord progression type: ${chordProgEnum}`);
    }
  }
}

export const ChordProgressionLibrary = ChordProgressionLibrarySingleton.getInstance();
