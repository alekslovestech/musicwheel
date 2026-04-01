import { useCallback } from "react";
import { ActualIndex } from "@/types/IndexTypes";

import { ChordUtils } from "@/utils/ChordUtils";
import { useMusical } from "@/contexts/MusicalContext";
import { useIsFreeformMode } from "@/contexts/ChordPresetContext";

export const CIRCLE_RADIUS = 5;
export const useKeyboardHandlers = () => {
  const isFreeformMode = useIsFreeformMode();
  const {
    currentChordRef,
    toggleNote,
    setChordRootNote,
    setChordBassNote, // Add this import
  } = useMusical();

  const handleKeyClick = useCallback(
    (clickedIndex: ActualIndex) => {
      if (isFreeformMode) {
        toggleNote(clickedIndex);
      } else if (currentChordRef) {
        // Chord mode: update via chord reference (reactive pattern)
        if (currentChordRef.inversionIndex === 0) {
          // Root position: clicked note becomes the new root note
          setChordRootNote(clickedIndex);
        } else {
          // Inversion: clicked note becomes the new bass note
          setChordBassNote(clickedIndex);
        }
      }
    },
    [
      toggleNote,
      currentChordRef,
      setChordRootNote,
      setChordBassNote,
      isFreeformMode,
    ],
  );

  const checkIsBassNote = useCallback(
    (index: ActualIndex) => {
      if (
        isFreeformMode ||
        !currentChordRef ||
        !ChordUtils.hasInversions(currentChordRef.id)
      ) {
        return false;
      }
      return index === currentChordRef.rootNote;
    },
    [currentChordRef, isFreeformMode],
  );

  return {
    handleKeyClick,
    checkIsBassNote,
  };
};
