import { chordDurationMsFromTempo } from "@/types/ChordProgressions/ChordProgression";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/ScalePlaybackMode";
import {
  ScaleDegreeIndex,
  ixScaleDegreeIndex,
} from "@/types/ScaleModes/ScaleDegreeType";
import { TWELVE } from "@/types/constants/NoteConstants";
import { IndexUtils } from "@/utils/IndexUtils";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";

export interface ScalePlaybackStepOutput {
  notesToPlay: NoteIndices | null;
  /** When set, caller should replace the scale step index with this value. */
  nextIndex: number | null;
  /** When true, caller should mark the sequence complete and stop scheduling. */
  shouldEndSequence: boolean;
}

export const defaultScalePlaybackStepOutput: ScalePlaybackStepOutput = {
  notesToPlay: null,
  nextIndex: null,
  shouldEndSequence: false,
};

export function computeScalePlaybackStep(
  key: MusicalKey,
  currentIndex: number,
  scalePlaybackMode: ScalePlaybackMode
): ScalePlaybackStepOutput {
  const currentScaleDegreeIndex = currentIndex as ScaleDegreeIndex;

  if (currentScaleDegreeIndex === key.scalePatternLength) {
    const octaveNoteIndices = key.getNoteIndicesForScaleDegree(
      ixScaleDegreeIndex(0),
      scalePlaybackMode
    );
    const fittedOctaveIndices = IndexUtils.transposeNotes(
      octaveNoteIndices,
      TWELVE
    );
    return {
      ...defaultScalePlaybackStepOutput,
      notesToPlay: fittedOctaveIndices,
      shouldEndSequence: true,
    };
  }

  if (currentScaleDegreeIndex > key.scalePatternLength) {
    return { ...defaultScalePlaybackStepOutput };
  }

  const noteIndices = key.getNoteIndicesForScaleDegree(
    currentScaleDegreeIndex,
    scalePlaybackMode
  );
  return {
    ...defaultScalePlaybackStepOutput,
    notesToPlay: noteIndices,
    nextIndex: currentIndex + 1,
  };
}

export interface PreparedChordProgressionSequence {
  precomputedProgression: NoteIndices[];
  chordStepDurationsMs: number[];
}

export function prepareChordProgressionSequence(
  progressionType: ChordProgressionType,
  musicalKey: MusicalKey
): PreparedChordProgressionSequence {
  const progression = ChordProgressionLibrary.getProgression(progressionType);
  const precomputedProgression =
    ChordProgressionResolver.computeProgressionOctaves(
      progression.romans,
      musicalKey
    );
  const chordStepDurationsMs = progression.progression.map((entry) =>
    chordDurationMsFromTempo(progression.tempo, entry.duration)
  );
  return { precomputedProgression, chordStepDurationsMs };
}
