import { ChordType } from "@/types/enums/ChordType";

import { ChromaticIndex } from "@/types/ChromaticIndex";
import { NoteConverter } from "@/utils/NoteConverter";

export class AbsoluteChord {
  public readonly chromaticIndex: ChromaticIndex;
  public readonly chordType: ChordType;
  public readonly bassNote: ChromaticIndex;

  constructor(
    note: string | ChromaticIndex,
    quality: ChordType,
    bassNote?: ChromaticIndex,
  ) {
    this.chromaticIndex =
      typeof note === "string" ? NoteConverter.toChromaticIndex(note) : note;
    this.chordType = quality;
    this.bassNote = bassNote ?? this.chromaticIndex;
  }
}
