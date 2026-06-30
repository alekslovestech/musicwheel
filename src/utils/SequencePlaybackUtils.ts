import type { NoteLength } from "@/types/Durated";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordType } from "@/types/enums/ChordType";
import { ActualIndex, ixInversion, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordReference, makeChordReference } from "@/types/interfaces/ChordReference";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ixScaleDegreeIndex, ScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { TWELVE } from "@/types/constants/NoteConstants";
import { IndexUtils } from "@/utils/IndexUtils";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { ChordSetUtils } from "./ChordSetUtils";

export type ScaleStepAtDegree = {
  notesToPlay: NoteIndices;
  chordRef?: ChordReference;
};

export enum ScaleSequenceStepKind {
  Play = "play",
  PlayFinal = "playFinal",
  Idle = "idle",
}

export type ScaleSequenceStep =
  | { kind: ScaleSequenceStepKind.Play; step: ScaleStepAtDegree; nextStepIndex: number }
  | { kind: ScaleSequenceStepKind.PlayFinal; step: ScaleStepAtDegree }
  | { kind: ScaleSequenceStepKind.Idle };

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

export function getScaleStepAtDegree(
  key: MusicalKey,
  scaleDegreeIndex: ScaleDegreeIndex,
  scalePlaybackMode: ScalePlaybackMode,
  transposeBy = 0,
): ScaleStepAtDegree {
  const notes = key.getNoteIndicesForScaleDegree(scaleDegreeIndex, scalePlaybackMode);
  const notesToPlay =
    transposeBy === 0 ? notes : IndexUtils.transposeNotes(notes, transposeBy);
  return {
    notesToPlay,
    chordRef: chordRefForScaleStep(key, scaleDegreeIndex, notesToPlay, scalePlaybackMode),
  };
}

/** Scale sequence cursor: 0..length-1 are scale degrees; length is the final octave tonic step. */
export function advanceScaleSequenceStep(
  key: MusicalKey,
  stepIndex: number,
  scalePlaybackMode: ScalePlaybackMode,
): ScaleSequenceStep {
  if (stepIndex > key.scalePatternLength) {
    return { kind: ScaleSequenceStepKind.Idle };
  }

  if (stepIndex === key.scalePatternLength) {
    return {
      kind: ScaleSequenceStepKind.PlayFinal,
      step: getScaleStepAtDegree(key, ixScaleDegreeIndex(0), scalePlaybackMode, TWELVE),
    };
  }

  return {
    kind: ScaleSequenceStepKind.Play,
    step: getScaleStepAtDegree(key, stepIndex as ScaleDegreeIndex, scalePlaybackMode),
    nextStepIndex: stepIndex + 1,
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
