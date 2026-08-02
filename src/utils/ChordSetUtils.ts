import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { ChordType } from "@/types/enums/ChordType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";

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

  static getSeventhChordType(
    scaleDegreeInfo: ScaleDegreeInfo,
    scaleModeInfo: ScaleModeInfo,
  ): ChordType {
    const offsets = scaleModeInfo.getSeventhOffsets(scaleDegreeInfo);
    return NoteGroupingLibrary.matchChordTypeFromOffsets(offsets);
  }

  /** Distinct diatonic triad qualities for each scale degree in {@link key}. */
  static triadTypesForKey(key: MusicalKey): Set<ChordType> {
    return this.chordTypesForKey(key, false);
  }

  /** Distinct diatonic seventh qualities for each scale degree in {@link key}. */
  static seventhTypesForKey(key: MusicalKey): Set<ChordType> {
    return this.chordTypesForKey(key, true);
  }

  /**
   * Each diatonic seventh quality mapped to the degrees carrying it - `Minor7 -> ["ii", "iii",
   * "vi"]` - in scale order, since Map iterates by insertion. The Seventh wheel labels degrees
   * without any quality (a bare `7` would be wrong on chords like Minor6 that surface no
   * literal 7th), so the degree is the only handle a legend row has on a wheel position;
   * {@link seventhTypesForKey} has already discarded it.
   *
   * Keyed on quality alone. An inverted stack shares both its quality and its color with the
   * root-position chord, so splitting them apart would draw a line nothing on screen shows.
   */
  static seventhsByDegree(key: MusicalKey): Map<ChordType, string[]> {
    const degreesByQuality = new Map<ChordType, string[]>();

    for (let i = 0; i < key.scalePatternLength; i++) {
      const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(
        ixScaleDegreeIndex(i),
      );
      const offsets = key.scaleModeInfo.getSeventhOffsets(scaleDegreeInfo);
      const chordType = NoteGroupingLibrary.matchChordTypeAllowingInversions(offsets);
      if (chordType === ChordType.Unknown) continue;

      const numeral = RomanChordFormatter.formatRomanNumeralOnly(
        RomanChordFormatter.romanChordFromScaleDegree(scaleDegreeInfo, key.scaleModeInfo, true),
      );
      degreesByQuality.set(chordType, [...(degreesByQuality.get(chordType) ?? []), numeral]);
    }

    return degreesByQuality;
  }

  private static chordTypesForKey(key: MusicalKey, isSeventh: boolean): Set<ChordType> {
    const types = new Set<ChordType>();
    for (let i = 0; i < key.scalePatternLength; i++) {
      const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(
        ixScaleDegreeIndex(i),
      );
      const chordType = isSeventh
        ? this.getSeventhChordType(scaleDegreeInfo, key.scaleModeInfo)
        : this.getTriadChordType(scaleDegreeInfo, key.scaleModeInfo);
      if (chordType !== ChordType.Unknown) {
        types.add(chordType);
      }
    }
    return types;
  }
}
