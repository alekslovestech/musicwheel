"use client";

import { useMusical } from "@/contexts/MusicalContext";
import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { buildScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";
import { getScaleStepAtSequenceIndex } from "@/utils/SequencePlaybackUtils";
import { StaffUtils } from "@/utils/StaffUtils";

import { ScaleRibbon } from "./ScaleRibbon";

export function SequenceLegendPanel() {
  const isScalesMode = useIsScalePreviewMode();
  const { selectedMusicalKey, selectedNoteIndices, setSelectionFromSequence } = useMusical();
  const { scalePlaybackMode, activeStepIndex, playbackState } = useAudio();

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

  const ribbon = buildScaleRibbonData(selectedMusicalKey, scalePlaybackMode);

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
      <ScaleRibbon ribbon={ribbon} activeNoteIndex={activeNoteIndex} onSelectStep={selectStep} />
    </div>
  );
}
