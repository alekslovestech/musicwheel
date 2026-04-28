import { NOTES_WITH_SHARP, NOTES_WITH_FLAT } from "@/types/constants/NoteConstants";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { NoteInfo } from "@/types/interfaces/NoteInfo";

import { ChromaticIndex } from "@/types/ChromaticIndex";
import { MusicalKey } from "@/types/Keys/MusicalKey";
export class ChromaticNoteResolver {
  static resolveNoteInKey(musicalKey: MusicalKey, chromaticIndex: ChromaticIndex): NoteInfo {
    const defaultAccidental = musicalKey.getDefaultAccidental();
    const absoluteNote = this.resolveAbsoluteNote(chromaticIndex, defaultAccidental);
    const resolvedAccidental = musicalKey.keySignature.applyToNote(
      absoluteNote.noteName,
      absoluteNote.accidental,
    );
    return {
      noteName: absoluteNote.noteName,
      accidental: resolvedAccidental,
    };
  }

  static resolveAbsoluteNote(
    chromaticIndex: ChromaticIndex,
    accidentalPreference: AccidentalType,
  ): NoteInfo {
    const notesArray = this.getNotesArray(accidentalPreference);
    return notesArray[chromaticIndex];
  }

  private static getNotesArray = (preference: AccidentalType): NoteInfo[] =>
    preference === AccidentalType.Flat ? NOTES_WITH_FLAT : NOTES_WITH_SHARP;
}
