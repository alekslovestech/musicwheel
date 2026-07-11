import type { Durated } from "@/types/Durated";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordType } from "@/types/enums/ChordType";
import { ActualIndex, ixInversion, NoteIndices, toNoteIndices } from "@/types/IndexTypes";
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

/** One scale degree step (keyboard clicks, spelling, etc.). */
export function getScaleStepAtDegree(
  key: MusicalKey,
  scaleDegreeIndex: ScaleDegreeIndex,
  scalePlaybackMode: ScalePlaybackMode,
): ScaleStepAtDegree {
  const notesToPlay = key.getNoteIndicesForScaleDegree(scaleDegreeIndex, scalePlaybackMode);
  return {
    notesToPlay,
    chordRef: chordRefForScaleStep(key, scaleDegreeIndex, notesToPlay, scalePlaybackMode),
  };
}

/** Scale sequence index: 0..length-1 are degrees; length is the final octave tonic. */
export function getScaleStepAtSequenceIndex(
  key: MusicalKey,
  stepIndex: number,
  scalePlaybackMode: ScalePlaybackMode,
): ScaleStepAtDegree {
  if (stepIndex === key.scalePatternLength) {
    if (scalePlaybackMode === ScalePlaybackMode.DronedSingleNote) {
      const lowerDroneTonic = getScaleStepAtDegree(
        key,
        ixScaleDegreeIndex(0),
        scalePlaybackMode,
      ).notesToPlay[0]!;
      const upperTonic = IndexUtils.transposeNotes(
        getScaleStepAtDegree(key, ixScaleDegreeIndex(0), ScalePlaybackMode.SingleNote).notesToPlay,
        TWELVE,
      )[0]!;
      return {
        notesToPlay: toNoteIndices([lowerDroneTonic, upperTonic]),
      };
    }

    const octaveTonic = getScaleStepAtDegree(
      key,
      ixScaleDegreeIndex(0),
      scalePlaybackMode,
    ).notesToPlay;
    return {
      notesToPlay: IndexUtils.transposeNotes(octaveTonic, TWELVE),
      chordRef: chordRefForScaleStep(
        key,
        ixScaleDegreeIndex(0),
        IndexUtils.transposeNotes(octaveTonic, TWELVE),
        scalePlaybackMode,
      ),
    };
  }

  return getScaleStepAtDegree(key, ixScaleDegreeIndex(stepIndex), scalePlaybackMode);
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

  const step = getScaleStepAtSequenceIndex(key, stepIndex, scalePlaybackMode);

  if (stepIndex === key.scalePatternLength) {
    return { kind: ScaleSequenceStepKind.PlayFinal, step };
  }

  return {
    kind: ScaleSequenceStepKind.Play,
    step,
    nextStepIndex: stepIndex + 1,
  };
}

/** Resolved chord step with note indices, length, and rhythm dots (after LilyPond carry). */
export type PreparedChordStep = Required<Durated<NoteIndices>>;

export interface PreparedChordProgressionSequence {
  steps: PreparedChordStep[];
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
  const steps: PreparedChordStep[] = resolved.map((entry, i) => ({
    value: precomputedProgression[i],
    noteLength: entry.noteLength!,
    rhythmDots: entry.rhythmDots ?? 0,
  }));
  return {
    steps,
    tempo: progression.tempo,
  };
}
