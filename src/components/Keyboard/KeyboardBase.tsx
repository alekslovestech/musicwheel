import { useCallback } from "react";
import {
  ActualIndex,
  actualIndexToChromaticAndOctave,
  actualToChromatic,
  chromaticToActual,
} from "@/types/IndexTypes";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { ChordUtils } from "@/utils/ChordUtils";
import { IndexUtils } from "@/utils/IndexUtils";
import { useMusical } from "@/contexts/MusicalContext";
import { useIsFreeformMode } from "@/contexts/ChordPresetContext";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";
import { ChordReference } from "@/types/interfaces/ChordReference";
import { scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { getScaleStepAtDegree, ScaleStepAtDegree } from "@/utils/SequencePlaybackUtils";

function applyScaleStepAtDegree(
  clickedIndex: ActualIndex,
  step: ScaleStepAtDegree,
  scalePlaybackMode: ScalePlaybackMode,
  keyboardUI: KeyboardUIType,
  setCurrentChordRef: (chordRef?: ChordReference) => void,
  setNotesDirectly: (notes: ActualIndex[]) => void,
) {
  const useLinearOctave = keyboardUI === KeyboardUIType.Linear;

  if (useLinearOctave && scalePlaybackMode === ScalePlaybackMode.SingleNote) {
    setCurrentChordRef(undefined);
    setNotesDirectly([clickedIndex]);
    return;
  }

  if (useLinearOctave && step.notesToPlay.length > 0) {
    if (step.chordRef !== undefined) {
      const { octaveOffset } = actualIndexToChromaticAndOctave(clickedIndex);
      const degreeRootChromatic = actualToChromatic(step.notesToPlay[0]);
      setCurrentChordRef({
        ...step.chordRef,
        rootNote: chromaticToActual(degreeRootChromatic, octaveOffset),
      });
      return;
    }

    const clickedChromatic = actualToChromatic(clickedIndex);
    const anchor =
      step.notesToPlay.find((n) => actualToChromatic(n) === clickedChromatic) ??
      step.notesToPlay[0];
    const shift = clickedIndex - anchor;
    setCurrentChordRef(undefined);
    setNotesDirectly(IndexUtils.transposeNotes(step.notesToPlay, shift));
    return;
  }

  if (step.chordRef !== undefined) {
    setCurrentChordRef(step.chordRef);
  } else {
    setCurrentChordRef(undefined);
    setNotesDirectly(step.notesToPlay);
  }
}

export const CIRCLE_RADIUS = 5;

export interface PianoKeyBaseProps {
  actualIndex: ActualIndex;
  isBassNote: boolean;
  onKeyClick: (index: ActualIndex) => void;
}

export const useKeyboardHandlers = () => {
  const trackAction = useTrack();
  const isFreeformMode = useIsFreeformMode();
  const isScalesMode = useIsScalePreviewMode();
  const { playbackState, scalePlaybackMode } = useAudio();
  const {
    selectedMusicalKey,
    currentChordRef,
    toggleNote,
    setChordRootNote,
    setChordBassNote,
    setNotesDirectly,
    setCurrentChordRef,
  } = useMusical();

  const handleKeyClick = useCallback(
    (clickedIndex: ActualIndex, keyboardUI: KeyboardUIType) => {
      if (isScalesMode) {
        if (playbackState === PlaybackState.SequencePlaying) return;

        const chromaticIndex = actualToChromatic(clickedIndex);
        const scaleDegreeInfo = selectedMusicalKey.scaleModeInfo.getScaleDegreeInfoFromChromatic(
          chromaticIndex,
          selectedMusicalKey.tonicIndex,
        );
        if (!scaleDegreeInfo) return;

        const step = getScaleStepAtDegree(
          selectedMusicalKey,
          scaleDegreeToIndex(scaleDegreeInfo.scaleDegree),
          scalePlaybackMode,
        );
        applyScaleStepAtDegree(
          clickedIndex,
          step,
          scalePlaybackMode,
          keyboardUI,
          setCurrentChordRef,
          setNotesDirectly,
        );
        return;
      }

      if (isFreeformMode) {
        toggleNote(clickedIndex);
      } else if (currentChordRef) {
        if (currentChordRef.inversionIndex === 0) {
          setChordRootNote(clickedIndex);
        } else {
          setChordBassNote(clickedIndex);
        }
      }
    },
    [
      isScalesMode,
      playbackState,
      selectedMusicalKey,
      scalePlaybackMode,
      setCurrentChordRef,
      setNotesDirectly,
      toggleNote,
      currentChordRef,
      setChordRootNote,
      setChordBassNote,
      isFreeformMode,
    ],
  );

  const checkIsBassNote = useCallback(
    (index: ActualIndex) => {
      if (isFreeformMode || !currentChordRef || !ChordUtils.hasInversions(currentChordRef.id)) {
        return false;
      }
      return index === currentChordRef.rootNote;
    },
    [currentChordRef, isFreeformMode],
  );

  const onLinearKeyClick = useCallback(
    (index: ActualIndex) => {
      trackAction(TrackEvent.KeyboardInteracted, { keyboard_ui: KeyboardUIType.Linear });
      handleKeyClick(index, KeyboardUIType.Linear);
    },
    [trackAction, handleKeyClick],
  );

  const onCircularKeyClick = useCallback(
    (index: ActualIndex) => {
      trackAction(TrackEvent.KeyboardInteracted, { keyboard_ui: KeyboardUIType.Circular });
      handleKeyClick(index, KeyboardUIType.Circular);
    },
    [trackAction, handleKeyClick],
  );

  return {
    onLinearKeyClick,
    onCircularKeyClick,
    checkIsBassNote,
  };
};
