"use client";
import React, { useEffect, useMemo } from "react";

import { Select } from "../Common/Select";
import { ChordProgressionDisplay } from "./ChordProgressionDisplay";
import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";

export const ChordProgressionSelector = () => {
  const {
    selectedProgression,
    setSelectedProgression,
    activeProgressionStepIndex,
  } = useAudio();
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();

  const progression = useMemo(() => {
    return selectedProgression != null
      ? ChordProgressionLibrary.getProgression(selectedProgression)
      : null;
  }, [selectedProgression]);

  useEffect(() => {
    if (progression == null) return;
    setSelectedMusicalKey(progression.suggestedMusicalKey);
  }, [progression, setSelectedMusicalKey]);

  const formatter = useMemo(
    () =>
      progression != null ? new ChordProgressionFormatter(progression) : null,
    [progression],
  );

  const romanGrid = useMemo(() => {
    if (formatter == null) return null;
    return formatter.formatForDisplay();
  }, [formatter]);

  const absoluteGrid = useMemo(() => {
    if (formatter == null) return null;
    return formatter.formatAbsoluteForDisplay(selectedMusicalKey);
  }, [formatter, selectedMusicalKey]);

  const handleChordProgressionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    if (value === "") {
      setSelectedProgression(null);
      return;
    }
    setSelectedProgression(value as ChordProgressionType);
  };

  return (
    <div className="chord-progression-selector text-sm font-medium max-w-[80%]">
      <div className="flex flex-col gap-2">
        <Select
          id="chord-progression-select"
          value={selectedProgression ?? ""}
          onChange={handleChordProgressionChange}
          title="Select chord progression"
          className="w-full max-w-full"
        >
          <option value="" disabled>
            Select chord progression
          </option>
          {Object.values(ChordProgressionType).map((mode) => (
            <option
              id={`chord-progression-option-${mode}`}
              key={mode}
              value={mode}
            >
              {mode}
            </option>
          ))}
        </Select>
        {romanGrid != null && absoluteGrid != null ? (
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <ChordProgressionDisplay
                grid={romanGrid}
                readHeadStepIndex={activeProgressionStepIndex}
              />
            </div>
            <div className="flex-1 min-w-0">
              <ChordProgressionDisplay
                grid={absoluteGrid}
                readHeadStepIndex={activeProgressionStepIndex}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
