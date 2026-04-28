"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

import { makeChordReference } from "@/types/interfaces/ChordReference";

import { NoteGroupingId } from "@/types/NoteGroupingId";
import { InputMode } from "@/types/enums/InputMode";
import { SpecialType } from "@/types/enums/SpecialType";
import { IntervalType } from "@/types/enums/IntervalType";
import { ChordType } from "@/types/enums/ChordType";

import { useMusical } from "./MusicalContext";
export interface ChordPresetSettings {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
}

function getDefaultChordTypeForInputMode(newMode: InputMode): NoteGroupingId {
  switch (newMode) {
    case InputMode.IntervalPresets:
      return IntervalType.Major3;
    case InputMode.ChordPresets:
      return ChordType.Major;
    case InputMode.SingleNote:
      return SpecialType.Note;
    default:
      return SpecialType.None;
  }
}

const ChordPresetContext = createContext<ChordPresetSettings | null>(null);

export const ChordPresetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.ChordPresets);
  const { selectedNoteIndices, setCurrentChordRef } = useMusical();

  const handleInputModeChange = (newMode: InputMode) => {
    setInputMode(newMode);

    const rootNoteIndex = selectedNoteIndices[0] || null;
    const newChordType = getDefaultChordTypeForInputMode(newMode);

    if (newMode !== InputMode.Freeform && rootNoteIndex !== null) {
      setCurrentChordRef(makeChordReference(rootNoteIndex, newChordType, 0));
    } else {
      setCurrentChordRef(undefined);
    }
  };

  const value: ChordPresetSettings = {
    inputMode,
    setInputMode: handleInputModeChange,
  };

  return <ChordPresetContext.Provider value={value}>{children}</ChordPresetContext.Provider>;
};

export const useIsChordsOrIntervals = () => {
  const { inputMode } = useChordPresets();
  return inputMode === InputMode.ChordPresets || inputMode === InputMode.IntervalPresets;
};

export const useIsFreeformMode = () => {
  const { inputMode } = useChordPresets();
  return inputMode === InputMode.Freeform;
};

export const useChordPresets = () => {
  const context = useContext(ChordPresetContext);
  if (!context) {
    throw new Error("useChordPreset must be used within a ChordPresetProvider");
  }
  return context;
};
