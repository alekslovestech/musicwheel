import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChromaticIndex } from "@/types/ChromaticIndex";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { createNoteInfo, NoteInfo } from "@/types/interfaces/NoteInfo";
import { ScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";
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
  static resolveNoteInScale(
    musicalKey: MusicalKey,
    chromaticIndex: ChromaticIndex,
  ): NoteInfo | null {
    const scaleDegreeInfo = musicalKey.scaleModeInfo.getScaleDegreeInfoFromChromatic(
      chromaticIndex,
      musicalKey.tonicIndex,
    );
    if (!scaleDegreeInfo) return null;

    if (scaleDegreeInfo.scaleDegree === 1) {
      return this.parseTonicNoteInfo(musicalKey.tonicString);
    }

    const letterName = this.getDiatonicLetterAtDegree(
      musicalKey.tonicString,
      scaleDegreeInfo.scaleDegree,
    );
    return this.spellLetterToChromatic(
      letterName,
      chromaticIndex,
      scaleDegreeInfo.accidentalPrefix,
    );
  }

  private static getDiatonicLetterAtDegree(tonicString: string, scaleDegree: ScaleDegree): string {
    const tonicLetter = NoteConverter.stripAccidentals(
      NoteConverter.sanitizeNoteString(tonicString),
    );
    const tonicLetterIndex = DIATONIC_LETTERS.indexOf(
      tonicLetter as (typeof DIATONIC_LETTERS)[number],
    );
    if (tonicLetterIndex === -1) {
      throw new Error(`Invalid tonic letter: ${tonicString}`);
    }
    return DIATONIC_LETTERS[(tonicLetterIndex + scaleDegree - 1) % DIATONIC_LETTERS.length];
  }

  private static parseTonicNoteInfo(tonicString: string): NoteInfo {
    const sanitized = NoteConverter.sanitizeNoteString(tonicString);
    const match = sanitized.match(/^([A-G])([#b]?)$/);
    if (!match) {
      throw new Error(`Invalid tonic string: ${tonicString}`);
    }
    return createNoteInfo(match[1], AccidentalFormatter.parseAccidentalType(match[2] ?? ""));
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
