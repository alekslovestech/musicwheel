"use client";

import React, { useMemo } from "react";

import { ProgressionNotebook } from "./ProgressionNotebook";
import { ProgressionPicker } from "./ProgressionPicker";
import { useAudio } from "@/contexts/AudioContext";
import { useDisplay } from "@/contexts/DisplayContext";
import { useMusical } from "@/contexts/MusicalContext";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { PROGRESSION_REGISTRY } from "@/types/ChordProgressions/progressionRegistry";
import { CP_PLAYBACK_DISPLAY_ROW_COUNT } from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { useIsLandscape } from "@/lib/hooks";

/** Chord/Roman view of the selected progression (picker + notebook). Staff notation is StaffRenderer. */
export function ProgressionChordScore() {
  const { selectedProgression, setSelectedProgression, activeStepIndex } = useAudio();
  const { selectedMusicalKey } = useMusical();
  const { showBassInRomanNotation } = useDisplay();
  const isLandscape = useIsLandscape();

  const progression = useMemo(() => {
    return selectedProgression != null
      ? ChordProgressionLibrary.getProgression(selectedProgression)
      : null;
  }, [selectedProgression]);

  const registryEntry =
    selectedProgression != null ? PROGRESSION_REGISTRY[selectedProgression] : null;
  const isCompact = registryEntry?.isPattern ?? false;

  const formatter = useMemo(
    () => (progression != null ? new ChordProgressionFormatter(progression) : null),
    [progression],
  );

  const displayGrid = useMemo(() => {
    if (formatter == null) return null;
    return formatter.formatForDisplay(selectedMusicalKey, isCompact, showBassInRomanNotation);
  }, [formatter, selectedMusicalKey, isCompact, showBassInRomanNotation]);

  const visibleGrid = useMemo(() => {
    if (displayGrid == null) return null;
    if (activeStepIndex == null || formatter == null) return displayGrid;

    return formatter.displayRowsForStep(
      displayGrid,
      activeStepIndex,
      isCompact,
      CP_PLAYBACK_DISPLAY_ROW_COUNT,
    );
  }, [displayGrid, activeStepIndex, formatter, isCompact]);

  const isPlaybackWindow = activeStepIndex != null;

  return (
    <div
      id="progression-chord-score"
      className={`progression-chord-score flex flex-col gap-2 text-sm font-medium ${
        isLandscape ? "h-full min-h-0 flex-1" : "shrink-0"
      }`}
    >
      <ProgressionPicker
        selectedProgression={selectedProgression}
        onProgressionChange={setSelectedProgression}
      />
      <div
        id="progression-notebook-scroll"
        className={
          isPlaybackWindow
            ? "w-full min-w-0 shrink-0 overflow-hidden"
            : isLandscape
              ? "min-h-0 w-full min-w-0 flex-1 overflow-y-auto"
              : "w-full min-w-0 shrink-0 overflow-y-auto max-h-48"
        }
        style={{ visibility: visibleGrid != null ? "visible" : "hidden" }}
      >
        <ProgressionNotebook
          grid={visibleGrid ?? []}
          readHeadStepIndex={activeStepIndex}
          isCompact={isCompact}
        />
      </div>
    </div>
  );
}
