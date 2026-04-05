"use client";
import React, { useEffect, useMemo } from "react";

import { Select } from "./Common/Select";
import { ChordProgressionDisplay } from "./ChordProgressionDisplay";
import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";
import { useDisplay } from "@/contexts/DisplayContext";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import {
  ChordProgressionGridLane,
  COLUMNS_PER_BAR,
  type AllBars,
  type BarRow,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";

export const ChordProgressionSelector = () => {
  const {
    selectedProgression,
    setSelectedProgression,
    activeProgressionStepIndex,
  } = useAudio();
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();
  const { chordDisplayMode } = useDisplay();

  const progression = useMemo(() => {
    return selectedProgression != null
      ? ChordProgressionLibrary.getProgression(selectedProgression)
      : null;
  }, [selectedProgression]);

  useEffect(() => {
    if (progression == null) return;
    setSelectedMusicalKey(progression.suggestedMusicalKey);
  }, [progression, setSelectedMusicalKey]);

  const romanBars = useMemo(() => {
    return progression != null
      ? ChordProgressionFormatter.formatForDisplay(progression)
      : null;
  }, [progression]);

  const absoluteBars = useMemo(() => {
    if (progression == null) return null;

    const entries = progression.progression;
    const romanChords = entries.map((e) => e.value);

    const resolvedNoteArrays =
      ChordProgressionResolver.computeProgressionOctaves(
        romanChords,
        selectedMusicalKey,
      );

    const bars: AllBars = [];

    let colsInBar = 0;
    let barTokens: BarRow = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.noteLength === undefined) {
        throw new Error(
          "ChordProgression entries are expected to have carried noteLength applied",
        );
      }

      const colSpan = COLUMNS_PER_BAR / entry.noteLength;
      const indices = resolvedNoteArrays[i] ?? [];
      const label = MusicalDisplayFormatter.getDisplayInfoFromIndices(
        indices,
        chordDisplayMode,
        selectedMusicalKey,
      ).chordName;

      if (colsInBar > 0 && colsInBar + colSpan > COLUMNS_PER_BAR) {
        bars.push(barTokens);
        barTokens = [];
        colsInBar = 0;
      }

      barTokens.push({ label, colSpan, progressionEntryIndex: i });
      colsInBar += colSpan;

      if (colsInBar === COLUMNS_PER_BAR) {
        bars.push(barTokens);
        barTokens = [];
        colsInBar = 0;
      }
    }

    if (barTokens.length > 0) {
      bars.push(barTokens);
    }

    return bars;
  }, [progression, selectedMusicalKey, chordDisplayMode]);

  const romanLane = useMemo(() => {
    if (romanBars == null) return null;
    return new ChordProgressionGridLane(romanBars, activeProgressionStepIndex);
  }, [romanBars, activeProgressionStepIndex]);

  const absoluteLane = useMemo(() => {
    if (absoluteBars == null) return null;
    return new ChordProgressionGridLane(
      absoluteBars,
      activeProgressionStepIndex,
    );
  }, [absoluteBars, activeProgressionStepIndex]);

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
        {romanLane != null && absoluteLane != null ? (
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <ChordProgressionDisplay lane={romanLane} />
            </div>
            <div className="flex-1 min-w-0">
              <ChordProgressionDisplay lane={absoluteLane} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
