import { KeyType } from "@/types/enums/KeyType";
import { ChordType } from "@/types/enums/ChordType";
import { RomanChord } from "@/types/RomanChord";

function isMajorish(chordType: ChordType): boolean {
  return (
    chordType === ChordType.Major ||
    chordType === ChordType.Major7 ||
    chordType === ChordType.Dominant7 ||
    chordType === ChordType.Augmented ||
    chordType === ChordType.SpreadMajor ||
    chordType === ChordType.AugMajor7
  );
}

function isMinorish(chordType: ChordType): boolean {
  return (
    chordType === ChordType.Minor ||
    chordType === ChordType.Minor7 ||
    chordType === ChordType.MinorMajor7 ||
    chordType === ChordType.Minor6 ||
    chordType === ChordType.SpreadMinor
  );
}

function isDiminishedish(chordType: ChordType): boolean {
  return (
    chordType === ChordType.Diminished ||
    chordType === ChordType.Diminished7 ||
    chordType === ChordType.HalfDiminished ||
    chordType === ChordType.SpreadDiminished
  );
}

/**
 * Heuristically infer whether a roman-numeral progression is best interpreted
 * against a major (Ionian) vs minor (Aeolian) diatonic scale.
 *
 * This is intentionally a *defaulting* mechanism (mixture is common).
 */
export class ChordProgressionKeyTypeInferer {
  static inferKeyType(romanChords: RomanChord[]): KeyType {
    if (romanChords.length === 0) return KeyType.Major;

    let majorScore = 0;
    let minorScore = 0;

    const tonicDegree = 1;
    const dominantDegree = 5;

    // Strong tonic evidence: what quality is the "I" chord expressed as?
    for (let i = 0; i < romanChords.length; i++) {
      const c = romanChords[i];
      const degree = Number(c.scaleDegree);

      if (degree === tonicDegree) {
        if (isMajorish(c.chordType)) majorScore += 6;
        if (isMinorish(c.chordType) || isDiminishedish(c.chordType))
          minorScore += 6;

        // Phrase boundary tonic hits matter more.
        if (i === 0 || i === romanChords.length - 1) {
          if (isMajorish(c.chordType)) majorScore += 2;
          if (isMinorish(c.chordType) || isDiminishedish(c.chordType))
            minorScore += 2;
        }
      }
    }

    // Cadence-ish evidence: V -> I / i
    for (let i = 0; i < romanChords.length - 1; i++) {
      const a = romanChords[i];
      const b = romanChords[i + 1];
      const aDeg = Number(a.scaleDegree);
      const bDeg = Number(b.scaleDegree);

      if (aDeg === dominantDegree && bDeg === tonicDegree) {
        if (isMajorish(b.chordType)) majorScore += 3;
        if (isMinorish(b.chordType) || isDiminishedish(b.chordType))
          minorScore += 3;

        if (a.chordType === ChordType.Dominant7) {
          // Dominant7 resolving to tonic strongly suggests functional harmony.
          if (isMajorish(b.chordType)) majorScore += 1;
          if (isMinorish(b.chordType)) minorScore += 1;
        }
      }
    }

    // Weak evidence: count overall major/minor chord qualities (mixture tolerant).
    for (const c of romanChords) {
      if (isMajorish(c.chordType)) majorScore += 1;
      if (isMinorish(c.chordType)) minorScore += 1;
    }

    return minorScore > majorScore ? KeyType.Minor : KeyType.Major;
  }
}

