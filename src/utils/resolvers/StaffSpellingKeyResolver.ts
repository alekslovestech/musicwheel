import { AccidentalType } from "@/types/enums/AccidentalType";
import { KeyType } from "@/types/enums/KeyType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { KeySignature } from "@/types/Keys/KeySignature";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";

import { ActualNoteResolver } from "@/utils/resolvers/ActualNoteResolver";

type CandidateScore = {
  key: MusicalKey;
  explicitAccidentals: number;
  signatureAccidentals: number;
};

/** Picks a standard major/minor key signature that minimizes scale-degree accidentals. */
export class StaffSpellingKeyResolver {
  static resolveBestFit(scaleKey: MusicalKey): MusicalKey {
    let best: CandidateScore | null = null;

    for (const mode of [KeyType.Major, KeyType.Minor] as const) {
      for (const tonicString of KeySignature.getKeyList(mode)) {
        const candidate = MusicalKey.fromClassicalMode(tonicString, mode);
        const score = this.scoreCandidate(scaleKey, candidate);
        if (best == null || this.compareCandidates(score, best) < 0) {
          best = score;
        }
      }
    }

    return best?.key ?? MusicalKey.fromClassicalMode("C", KeyType.Major);
  }

  private static scoreCandidate(scaleKey: MusicalKey, candidateKey: MusicalKey): CandidateScore {
    return {
      key: candidateKey,
      explicitAccidentals: this.countExplicitAccidentals(scaleKey, candidateKey),
      signatureAccidentals: candidateKey.keySignature.getAccidentals().length,
    };
  }

  private static compareCandidates(a: CandidateScore, b: CandidateScore): number {
    if (a.explicitAccidentals !== b.explicitAccidentals) {
      return a.explicitAccidentals - b.explicitAccidentals;
    }
    if (a.signatureAccidentals !== b.signatureAccidentals) {
      return a.signatureAccidentals - b.signatureAccidentals;
    }
    return a.key.tonicString.localeCompare(b.key.tonicString);
  }

  private static countExplicitAccidentals(
    scaleKey: MusicalKey,
    candidateKey: MusicalKey,
  ): number {
    let count = 0;
    const scaleLength = scaleKey.scalePatternLength;

    for (let degree = 0; degree < scaleLength; degree++) {
      const notes = scaleKey.getNoteIndicesForScaleDegree(
        ixScaleDegreeIndex(degree),
        ScalePlaybackMode.SingleNote,
      );

      for (const actualIndex of notes) {
        const note = ActualNoteResolver.resolveNoteInScaleWithOctave(scaleKey, actualIndex);
        const displayAccidental = candidateKey.keySignature.applyToNote(
          note.noteName,
          note.accidental,
        );
        if (displayAccidental !== AccidentalType.None) {
          count++;
        }
      }
    }

    return count;
  }
}
