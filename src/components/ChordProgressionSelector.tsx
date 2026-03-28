"use client";
import React from "react";

import { Select } from "./Common/Select";
import { useAudio } from "@/contexts/AudioContext";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";

export const ChordProgressionSelector = () => {
  const { selectedProgression, setSelectedProgression } = useAudio();

  const chordSequenceText =
    selectedProgression != null
      ? ChordProgressionLibrary.getProgression(
          selectedProgression
        ).romans.join(" → ")
      : null;

  const handleChordProgressionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const progression = event.target.value as ChordProgressionType;
    setSelectedProgression(progression);
    console.log(`handling chord progression change`);
  };

  return (
    <div className="chord-progression-selector text-sm font-medium max-w-[80%]">
      {
        <div className="flex flex-col gap-2">
          <Select
            id="chord-progression-select"
            value={selectedProgression ?? ""}
            onChange={handleChordProgressionChange}
            title="Select chord progression"
            className="w-full max-w-full"
          >
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
          {chordSequenceText != null ? (
            <div>{chordSequenceText}</div>
          ) : null}
        </div>
      }
    </div>
  );
};
