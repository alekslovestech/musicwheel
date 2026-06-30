import { AccidentalType } from "@/types/enums/AccidentalType";
import { ActualIndex, actualIndexToChromaticAndOctave } from "@/types/IndexTypes";
import { createNoteWithOctave, NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChromaticNoteResolver } from "./ChromaticNoteResolver";
import { ScaleNoteSpellingResolver } from "./ScaleNoteSpellingResolver";

export class ActualNoteResolver {
  static resolveNoteInKeyWithOctave(
    musicalKey: MusicalKey,
    actualIndex: ActualIndex,
  ): NoteWithOctave {
    const { chromaticIndex, octaveOffset } = actualIndexToChromaticAndOctave(actualIndex);
    const noteInfo = ChromaticNoteResolver.resolveNoteInKey(musicalKey, chromaticIndex);
    return createNoteWithOctave(noteInfo.noteName, noteInfo.accidental, octaveOffset);
  }

  static resolveAbsoluteNoteWithOctave(
    actualIndex: ActualIndex,
    accidentalPreference: AccidentalType,
  ): NoteWithOctave {
    const { chromaticIndex, octaveOffset } = actualIndexToChromaticAndOctave(actualIndex);
    const noteInfo = ChromaticNoteResolver.resolveAbsoluteNote(
      chromaticIndex,
      accidentalPreference,
    );
    return createNoteWithOctave(noteInfo.noteName, noteInfo.accidental, octaveOffset);
  }

  static resolveNoteInScaleWithOctave(
    musicalKey: MusicalKey,
    actualIndex: ActualIndex,
  ): NoteWithOctave {
    const { chromaticIndex, octaveOffset } = actualIndexToChromaticAndOctave(actualIndex);
    const noteInfo = ScaleNoteSpellingResolver.resolveNoteInScale(musicalKey, chromaticIndex);
    if (!noteInfo) {
      return this.resolveNoteInKeyWithOctave(musicalKey, actualIndex);
    }
    return createNoteWithOctave(noteInfo.noteName, noteInfo.accidental, octaveOffset);
  }
}
