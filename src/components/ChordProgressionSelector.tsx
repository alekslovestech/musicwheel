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
  COLUMNS_PER_BAR,
  type BarRow,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { ChordProgressionKeyTypeInferer } from "@/utils/resolvers/ChordProgressionKeyTypeInferer";
import { MusicalKey } from "@/types/Keys/MusicalKey";

export const ChordProgressionSelector = () => {
  const { selectedProgression, setSelectedProgression } = useAudio();
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();
  const { chordDisplayMode } = useDisplay();

  const progression = useMemo(() => {
    return selectedProgression != null
      ? ChordProgressionLibrary.getProgression(selectedProgression)
      : null;
  }, [selectedProgression]);

  useEffect(() => {
    if (progression == null) return;

    const romanChords = progression.progression.map((e) => e.value);
    const inferredMode = ChordProgressionKeyTypeInferer.inferKeyType(romanChords);

    if (inferredMode === selectedMusicalKey.classicalMode) return;

    // Keep the user's current tonic (transpose still works), only switch how degrees map to pitches.
    setSelectedMusicalKey(
      MusicalKey.fromClassicalMode(selectedMusicalKey.tonicString, inferredMode),
    );
  }, [progression, selectedMusicalKey, setSelectedMusicalKey]);

  const romanBars = useMemo(() => {
    return progression != null
      ? ChordProgressionFormatter.formatForDisplay(progression)
      : null;
  }, [progression]);

  const absoluteBars = useMemo(() => {
    if (progression == null) return null;

    const entries = progression.progression;
    const romanChords = entries.map((e) => e.value);

    const resolvedNoteArrays = ChordProgressionResolver.computeProgressionOctaves(
      romanChords,
      selectedMusicalKey,
    );

    const bars: BarRow[] = [];

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

      if (colsInBar > 0 && colsInBar + colSpan > 16) {
        bars.push(barTokens);
        barTokens = [];
        colsInBar = 0;
      }

      barTokens.push({ label, colSpan });
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
        {romanBars != null && absoluteBars != null ? (
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <ChordProgressionDisplay bars={romanBars} />
            </div>
            <div className="flex-1 min-w-0">
              <ChordProgressionDisplay bars={absoluteBars} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
