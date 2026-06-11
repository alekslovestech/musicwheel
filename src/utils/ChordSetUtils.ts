import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { ChordType } from "@/types/enums/ChordType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";

export class ChordSetUtils {
  /** Distinct chord qualities appearing in {@link progression}. */
  static distinctFromProgression(progression: ChordProgression): Set<ChordType> {
    const types = new Set<ChordType>();
    for (const step of progression.progression) {
      const chordType = step.value.chordType;
      if (chordType !== ChordType.Unknown) {
        types.add(chordType);
      }
    }
    return types;
  }

  static getTriadChordType(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
  ): ChordType {
    const offsets = scaleModeInfo.getTriadOffsets(scaleDegreeInfo);
    return NoteGroupingLibrary.matchChordTypeFromOffsets(offsets);
  }

  /** Distinct diatonic triad qualities for each scale degree in {@link key}. */
  static triadTypesForKey(key: MusicalKey): Set<ChordType> {
    const types = new Set<ChordType>();
    for (let i = 0; i < key.scalePatternLength; i++) {
      const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(
        ixScaleDegreeIndex(i),
      );
      const chordType = this.getTriadChordType(scaleDegreeInfo, key.scaleModeInfo);
      if (chordType !== ChordType.Unknown) {
        types.add(chordType);
      }
    }
    return types;
  }
}
