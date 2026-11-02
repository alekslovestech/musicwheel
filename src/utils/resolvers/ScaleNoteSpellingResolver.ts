import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChromaticIndex } from "@/types/ChromaticIndex";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { createNoteInfo, NoteInfo } from "@/types/interfaces/NoteInfo";
import { ScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

import { NoteConverter } from "@/utils/NoteConverter";
import { ChromaticNoteResolver } from "@/utils/resolvers/ChromaticNoteResolver";

const DIATONIC_LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;

const SINGLE_ACCIDENTALS = [
  AccidentalType.None,
  AccidentalType.Sharp,
  AccidentalType.Flat,
] as const;

/** Scale-degree-aware note spelling (e.g. C Phrygian ♭2 → D♭, not C♯). */
export class ScaleNoteSpellingResolver {
  /**
   * Works for a non-diatonic key too: {@link OtherScaleInfo} hands back a plain scale-degree
   * number with no accidental prefix, and letter-cycling degree-by-degree off the tonic (below)
   * doesn't actually depend on the scale being diatonic - it's what produces the conventional
   * "C D E F# G# A#" whole-tone spelling, one accidental short of a full key signature's worth.
   */
  static resolveNoteInScale(
    musicalKey: MusicalKey,
    chromaticIndex: ChromaticIndex,
  ): NoteInfo | null {
    const scaleDegreeInfo = musicalKey.getScaleDegreeInfo(chromaticIndex);
    if (!scaleDegreeInfo) return null;

    const tonic = this.parseTonicNoteInfo(musicalKey.tonicString);
    if (scaleDegreeInfo.scaleDegree === 1) return tonic;

    const letterName = this.getDiatonicLetterAtDegree(tonic, scaleDegreeInfo.scaleDegree);
    return this.spellLetterToChromatic(
      letterName,
      chromaticIndex,
      scaleDegreeInfo.accidentalPrefix,
    );
  }

  private static getDiatonicLetterAtDegree(tonic: NoteInfo, scaleDegree: ScaleDegree): string {
    const tonicLetterIndex = DIATONIC_LETTERS.indexOf(
      tonic.noteName as (typeof DIATONIC_LETTERS)[number],
    );
    return DIATONIC_LETTERS[(tonicLetterIndex + scaleDegree - 1) % DIATONIC_LETTERS.length];
  }

  private static parseTonicNoteInfo(tonicString: string): NoteInfo {
    const tonic = NoteConverter.parseNoteInfo(tonicString);
    if (!tonic) throw new Error(`Invalid tonic string: ${tonicString}`);
    return tonic;
  }

  private static spellLetterToChromatic(
    letterName: string,
    targetChromatic: ChromaticIndex,
    accidentalPrefix: AccidentalType,
  ): NoteInfo {
    for (const accidental of SINGLE_ACCIDENTALS) {
      const noteInfo = createNoteInfo(letterName, accidental);
      if (NoteConverter.tryNoteInfoToChromaticIndex(noteInfo) === targetChromatic) return noteInfo;
    }

    const preference =
      accidentalPrefix === AccidentalType.Sharp ? AccidentalType.Sharp : AccidentalType.Flat;
    return ChromaticNoteResolver.resolveAbsoluteNote(targetChromatic, preference);
  }
}
