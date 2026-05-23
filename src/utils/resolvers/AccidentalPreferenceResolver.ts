import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { ChordQuality } from "@/types/enums/ChordQuality";
import { IntervalType } from "@/types/enums/IntervalType";

import { NoteGroupingId } from "@/types/NoteGroupingId";
import { ChromaticIndex } from "@/types/ChromaticIndex";

import { BlackKeyUtils } from "@/utils/BlackKeyUtils";

export class AccidentalPreferenceResolver {
  static getChordPresetSpellingPreference(
    chordType: NoteGroupingId,
    rootChromaticIndex: ChromaticIndex,
  ): AccidentalType {
    const chordQuality = this.getChordQuality(chordType);

    return this.getChordAccidentalPreference(chordQuality, rootChromaticIndex);
  }

  private static getChordAccidentalPreference(
    chordQuality: ChordQuality,
    rootChromaticIndex: ChromaticIndex,
  ): AccidentalType {
    switch (chordQuality) {
      case ChordQuality.Minor_Interval:
        return BlackKeyUtils.isBlackKey(rootChromaticIndex)
          ? AccidentalType.Sharp
          : AccidentalType.Flat;
      case ChordQuality.Major_Interval:
        return BlackKeyUtils.isBlackKey(rootChromaticIndex)
          ? AccidentalType.Flat
          : AccidentalType.Sharp;

      case ChordQuality.Major:
        return [0, 1, 3, 5, 8, 10].includes(rootChromaticIndex)
          ? AccidentalType.Flat
          : AccidentalType.Sharp;
      case ChordQuality.Minor:
        return [0, 2, 3, 5, 7, 10].includes(rootChromaticIndex)
          ? AccidentalType.Flat
          : AccidentalType.Sharp;
      case ChordQuality.Diminished:
        return BlackKeyUtils.isBlackKey(rootChromaticIndex)
          ? AccidentalType.Sharp
          : AccidentalType.Flat;
      //there's no purely correct way to do this, sometimes mixed accidentals are best
      case ChordQuality.Augmented:
        return [1, 3, 6, 8, 10].includes(rootChromaticIndex)
          ? AccidentalType.Flat
          : AccidentalType.Sharp;

      //optimal spelling not yet defined, or there's no preference
      default:
        return BlackKeyUtils.isBlackKey(rootChromaticIndex)
          ? AccidentalType.Sharp
          : AccidentalType.Flat;
    }
  }

  private static getChordQuality(chordType: NoteGroupingId): ChordQuality {
    switch (chordType) {
      case IntervalType.Minor2:
      case IntervalType.Minor3:
      case IntervalType.Minor6:
      case IntervalType.Minor7:
      case IntervalType.Fourth:
        return ChordQuality.Minor_Interval;

      case IntervalType.Major2:
      case IntervalType.Major3:
      case IntervalType.Major6:
      case IntervalType.Major7:
      case IntervalType.Fifth:
        return ChordQuality.Major_Interval;

      case ChordType.Minor:
      case ChordType.Minor7:
      case ChordType.Minor6:
      case ChordType.MinorMajor7:
      case ChordType.SpreadMinor:
        return ChordQuality.Minor;

      case ChordType.Diminished:
      case ChordType.HalfDiminished:
      case ChordType.Diminished7:
      case ChordType.SpreadDiminished:
      case ChordType.MajFlat5:
        return ChordQuality.Diminished;

      case ChordType.Augmented:
      case ChordType.AugMajor7:
      case ChordType.SpreadAugmented:
        return ChordQuality.Augmented;

      case ChordType.Major:
      case ChordType.Major7:
      case ChordType.Dominant7:
      case ChordType.Major6:
      case ChordType.SpreadMajor:
        return ChordQuality.Major;

      default:
        return ChordQuality.Other;
    }
  }
}
