import { ChordProgression } from "./ChordProgression";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { PROGRESSION_REGISTRY } from "./progressionRegistry";

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
    const entry = PROGRESSION_REGISTRY[chordProgEnum];
    if (entry == null) {
      throw new Error(`Unknown chord progression type: ${chordProgEnum}`);
    }

    return ChordProgression.fromFile(
      entry.chords,
      chordProgEnum,
      entry.tempo,
      entry.suggestedMusicalKey,
    );
  }
}

export const ChordProgressionLibrary = ChordProgressionLibrarySingleton.getInstance();
