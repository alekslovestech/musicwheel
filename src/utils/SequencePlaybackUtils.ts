import type { NoteLength } from "@/types/Durated";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordType } from "@/types/enums/ChordType";
import { ActualIndex, ixInversion, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordReference, makeChordReference } from "@/types/interfaces/ChordReference";
import { ScalePlaybackMode } from "@/types/ScalePlaybackMode";
import { ScaleDegreeIndex, ixScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { TWELVE } from "@/types/constants/NoteConstants";
import { IndexUtils } from "@/utils/IndexUtils";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { ChordSetUtils } from "./ChordSetUtils";

export interface ScalePlaybackStepOutput {
  notesToPlay: NoteIndices | null;
  /** Set during triad playback; caller should update currentChordRef. */
  chordRef?: ChordReference;
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

function getScaleTriadChordRef(
  key: MusicalKey,
  scaleDegreeIndex: ScaleDegreeIndex,
  rootNote: ActualIndex,
): ChordReference {
  const scaleDegreeInfo = key.scaleModeInfo.getScaleDegreeInfoFromPosition(scaleDegreeIndex);
  const chordType = ChordSetUtils.getTriadChordType(scaleDegreeInfo, key.scaleModeInfo);
  return makeChordReference(rootNote, chordType, ixInversion(0));
}

function chordRefForScaleStep(
  key: MusicalKey,
  scaleDegreeIndex: ScaleDegreeIndex,
  noteIndices: NoteIndices,
  scalePlaybackMode: ScalePlaybackMode,
): ChordReference | undefined {
  if (scalePlaybackMode !== ScalePlaybackMode.Triad || noteIndices.length === 0) {
    return undefined;
  }
  const chordRef = getScaleTriadChordRef(key, scaleDegreeIndex, noteIndices[0]);
  return chordRef.id === ChordType.Unknown ? undefined : chordRef;
}

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
    const fittedOctaveIndices = IndexUtils.transposeNotes(octaveNoteIndices, TWELVE);
    return {
      ...defaultScalePlaybackStepOutput,
      notesToPlay: fittedOctaveIndices,
      chordRef: chordRefForScaleStep(
        key,
        ixScaleDegreeIndex(0),
        fittedOctaveIndices,
        scalePlaybackMode,
      ),
      shouldEndSequence: true,
    };
  }

  if (currentScaleDegreeIndex > key.scalePatternLength) {
    return { ...defaultScalePlaybackStepOutput };
  }

  const noteIndices = key.getNoteIndicesForScaleDegree(currentScaleDegreeIndex, scalePlaybackMode);
  return {
    ...defaultScalePlaybackStepOutput,
    notesToPlay: noteIndices,
    chordRef: chordRefForScaleStep(key, currentScaleDegreeIndex, noteIndices, scalePlaybackMode),
    nextIndex: currentIndex + 1,
  };
}

export interface PreparedChordProgressionSequence {
  precomputedProgression: NoteIndices[];
  chordStepNoteLengths: NoteLength[];
  /** Per step; 0 = undotted. Each dot multiplies that step's playback length by 1.5. */
  chordStepRhythmDots: number[];
  tempo: number;
}

export function prepareChordProgressionSequence(
  progressionType: ChordProgressionType,
  musicalKey: MusicalKey,
): PreparedChordProgressionSequence {
  const progression = ChordProgressionLibrary.getProgression(progressionType);
  const resolved = progression.progression.map((entry) =>
    RomanResolver.resolveRomanChordWithDuration(entry, musicalKey),
  );
  const precomputedProgression = ChordProgressionResolver.computeProgressionOctaves(
    progression.progression.map((e) => e.value),
    musicalKey,
  );
  const chordStepNoteLengths = resolved.map((e) => e.noteLength!);
  const chordStepRhythmDots = resolved.map((e) => e.rhythmDots ?? 0);
  return {
    precomputedProgression,
    chordStepNoteLengths,
    chordStepRhythmDots,
    tempo: progression.tempo,
  };
}
