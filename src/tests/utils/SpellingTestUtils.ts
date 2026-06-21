import { NoteWithOctaveArray } from "@/types/interfaces/NoteWithOctave";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ixScaleDegreeIndex, ScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { computeScalePlaybackStep, ScalePlaybackStepOutput } from "@/utils/SequencePlaybackUtils";

export class SpellingTestUtils {
  static verifyNoteWithOctaveArray(
    actual: NoteWithOctaveArray,
    expected: NoteWithOctaveArray,
  ): void {
    expect(actual).toHaveLength(expected.length);
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i].noteName).toBe(expected[i].noteName);
      expect(actual[i].accidental).toBe(expected[i].accidental);
      expect(actual[i].octaveOffset).toBe(expected[i].octaveOffset);
    }
  }

  static computeScaleTriadPlaybackStep(
    key: MusicalKey,
    scaleDegree: ScaleDegree,
  ): ScalePlaybackStepOutput {
    return computeScalePlaybackStep(
      key,
      ixScaleDegreeIndex(Number(scaleDegree) - 1),
      ScalePlaybackMode.Triad,
    );
  }
}
