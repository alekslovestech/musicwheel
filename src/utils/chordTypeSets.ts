import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { ChordType } from "@/types/enums/ChordType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";

/** Distinct chord qualities appearing in {@link progression}. */
export function getDistinctChordTypesFromProgression(
  progression: ChordProgression,
): Set<ChordType> {
  const types = new Set<ChordType>();
  for (const step of progression.progression) {
    const chordType = step.value.chordType;
    if (chordType !== ChordType.Unknown) {
      types.add(chordType);
    }
  }
  return types;
}

/** Distinct diatonic triad qualities for each scale degree in {@link key}. */
export function getTriadChordTypesForKey(key: MusicalKey): Set<ChordType> {
  const types = new Set<ChordType>();
  for (let i = 0; i < key.scalePatternLength; i++) {
    const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(ixScaleDegreeIndex(i));
    const chordType = RomanChordFormatter.getTriadChordType(scaleDegreeInfo, key.scaleModeInfo);
    if (chordType !== ChordType.Unknown) {
      types.add(chordType);
    }
  }
  return types;
}
