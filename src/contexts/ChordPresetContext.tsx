"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

import { makeChordReference } from "@/types/interfaces/ChordReference";

import { NoteGroupingId } from "@/types/NoteGroupingId";
import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";
import { SpecialType } from "@/types/enums/SpecialType";
import { IntervalType } from "@/types/enums/IntervalType";
import { ChordType } from "@/types/enums/ChordType";

import { useMusical } from "./MusicalContext";
export interface ChordPresetSettings {
  harmonyInputMode: HarmonyInputMode;
  setHarmonyInputMode: (mode: HarmonyInputMode) => void;
}

function getDefaultChordTypeForHarmonyInputMode(newMode: HarmonyInputMode): NoteGroupingId {
  switch (newMode) {
    case HarmonyInputMode.IntervalPresets:
      return IntervalType.Major3;
    case HarmonyInputMode.ChordPresets:
      return ChordType.Major;
    case HarmonyInputMode.SingleNote:
      return SpecialType.Note;
    default:
      return SpecialType.None;
  }
}

const ChordPresetContext = createContext<ChordPresetSettings | null>(null);

export const ChordPresetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [harmonyInputMode, setHarmonyInputMode] = useState<HarmonyInputMode>(
    HarmonyInputMode.ChordPresets,
  );
  const { selectedNoteIndices, setCurrentChordRef } = useMusical();

  const handleHarmonyInputModeChange = (newMode: HarmonyInputMode) => {
    setHarmonyInputMode(newMode);

    const rootNoteIndex = selectedNoteIndices[0] || null;
    const newChordType = getDefaultChordTypeForHarmonyInputMode(newMode);

    if (newMode !== HarmonyInputMode.Freeform && rootNoteIndex !== null) {
      setCurrentChordRef(makeChordReference(rootNoteIndex, newChordType, 0));
    } else {
      setCurrentChordRef(undefined);
    }
  };

  const value: ChordPresetSettings = {
    harmonyInputMode,
    setHarmonyInputMode: handleHarmonyInputModeChange,
  };

  return <ChordPresetContext.Provider value={value}>{children}</ChordPresetContext.Provider>;
};

export const useIsChordsOrIntervals = () => {
  const { harmonyInputMode } = useChordPresets();
  return (
    harmonyInputMode === HarmonyInputMode.ChordPresets ||
    harmonyInputMode === HarmonyInputMode.IntervalPresets
  );
};

export const useIsFreeformMode = () => {
  const { harmonyInputMode } = useChordPresets();
  return harmonyInputMode === HarmonyInputMode.Freeform;
};

export const useChordPresets = () => {
  const context = useContext(ChordPresetContext);
  if (!context) {
    throw new Error("useChordPreset must be used within a ChordPresetProvider");
  }
  return context;
};
