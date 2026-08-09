"use client";

import { useMemo } from "react";

import { useMusical } from "@/contexts/MusicalContext";
import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { useDisplay } from "@/contexts/DisplayContext";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { SCALE_PLAYBACK_MODE_CAPTIONS, ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";
import { getScaleStepAtSequenceIndex } from "@/utils/SequencePlaybackUtils";
import { StaffUtils } from "@/utils/StaffUtils";

import { ScaleRibbon } from "./ScaleRibbon";

export function SequenceLegendPanel() {
  const isScalesMode = useIsScalePreviewMode();
  const { selectedMusicalKey, selectedNoteIndices, setSelectionFromSequence } = useMusical();
  const { scalePlaybackMode, activeStepIndex, playbackState } = useAudio();
  const { showStepAnnotations, setShowStepAnnotations } = useDisplay();

  // The ribbon itself is the same for every step of a scale - only which cell is active moves -
  // so rebuilding it on each playback step is work the step does not need to pay for.
  const ribbon = useMemo(
    () => buildScaleRibbonData(selectedMusicalKey, scalePlaybackMode, showStepAnnotations),
    [selectedMusicalKey, scalePlaybackMode, showStepAnnotations],
  );

  if (!isScalesMode) return null;

  // Same setter the sequence player uses, so a click lands the notes on the wheel, staff and
  // audio exactly as stepping to that degree would.
  const selectStep = (stepIndex: number) => {
    const { notesToPlay, chordRef } = getScaleStepAtSequenceIndex(
      selectedMusicalKey,
      stepIndex,
      scalePlaybackMode,
    );
    setSelectionFromSequence(notesToPlay, chordRef);
  };

  const isScalePlaybackActive =
    playbackState === PlaybackState.SequencePlaying ||
    playbackState === PlaybackState.SequencePaused;
  const activeNoteIndex = isScalePlaybackActive
    ? activeStepIndex
    : StaffUtils.findScaleStepIndexForSelection(
        selectedMusicalKey,
        scalePlaybackMode,
        selectedNoteIndices,
      );

  return (
    <div className="mx-auto mt-tight w-full max-w-md rounded border border-containers-divider bg-canvas-bgDefault/95 p-snug">
      <ScaleRibbon
        ribbon={ribbon}
        activeNoteIndex={activeNoteIndex}
        onSelectStep={selectStep}
        caption={SCALE_PLAYBACK_MODE_CAPTIONS[scalePlaybackMode]}
        // Offered only where step segments have a meaning to overlay; Drone and Chords measure
        // against the tonic and against the chord tones, not against the neighbouring note.
        stepAnnotations={
          scalePlaybackMode === ScalePlaybackMode.SingleNote
            ? { checked: showStepAnnotations, onChange: setShowStepAnnotations }
            : undefined
        }
      />
    </div>
  );
}
