import type { NoteLength } from "@/types/Timed";
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
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

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
  scalePlaybackMode: ScalePlaybackMode,
): ScalePlaybackStepOutput {
  const currentScaleDegreeIndex = currentIndex as ScaleDegreeIndex;

  if (currentScaleDegreeIndex === key.scalePatternLength) {
    const octaveNoteIndices = key.getNoteIndicesForScaleDegree(
      ixScaleDegreeIndex(0),
      scalePlaybackMode,
    );
    const fittedOctaveIndices = IndexUtils.transposeNotes(
      octaveNoteIndices,
      TWELVE,
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
    scalePlaybackMode,
  );
  return {
    ...defaultScalePlaybackStepOutput,
    notesToPlay: noteIndices,
    nextIndex: currentIndex + 1,
  };
}

export class PreparedChordProgressionSequence {
  precomputedProgression: NoteIndices[];
  /** Note length (LilyPond-style denominator) per step; convert to ms with `chordDurationMsFromTempo(tempo, d)`. */
  chordStepNoteLengths: NoteLength[];
  tempo: number;

  constructor(args: {
    precomputedProgression: NoteIndices[];
    chordStepNoteLengths: NoteLength[];
    tempo: number;
  }) {
    this.precomputedProgression = args.precomputedProgression;
    this.chordStepNoteLengths = args.chordStepNoteLengths;
    this.tempo = args.tempo;
  }

  getNotes(): NoteIndices[] {
    return this.precomputedProgression;
  }

  getNoteLengths(): NoteLength[] {
    return this.chordStepNoteLengths;
  }

  get length(): number {
    return this.precomputedProgression.length;
  }
}

export function prepareChordProgressionSequence(
  progressionType: ChordProgressionType,
  musicalKey: MusicalKey,
): PreparedChordProgressionSequence {
  const progression = ChordProgressionLibrary.getProgression(progressionType);
  const resolved = progression.progression.map((entry) =>
    RomanResolver.resolveRomanChordWithDuration(entry, musicalKey),
  );
  const precomputedProgression =
    ChordProgressionResolver.computeProgressionOctaves(
      progression.progression.map((e) => e.value),
      musicalKey,
    );
  const chordStepNoteLengths = resolved.map((e) => e.noteLength!);
  return new PreparedChordProgressionSequence({
    precomputedProgression,
    chordStepNoteLengths,
    tempo: progression.tempo,
  });
}
