"use client";
import React from "react";

import { Select } from "./Common/Select";
import { ChordProgressionDisplay } from "./ChordProgressionDisplay";
import { useAudio } from "@/contexts/AudioContext";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";

export const ChordProgressionSelector = () => {
  const { selectedProgression, setSelectedProgression } = useAudio();

  const chordSequenceBars =
    selectedProgression != null
      ? ChordProgressionFormatter.formatForDisplay(
          ChordProgressionLibrary.getProgression(selectedProgression),
        )
      : null;

  const handleChordProgressionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    if (value === "") {
      setSelectedProgression(null);
      return;
    }
    setSelectedProgression(value as ChordProgressionType);
    console.log(`handling chord progression change`);
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
        {chordSequenceBars != null ? (
          <ChordProgressionDisplay bars={chordSequenceBars} />
        ) : null}
      </div>
    </div>
  );
};
