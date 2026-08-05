"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";

import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { ChordDisplayMode } from "@/types/enums/SettingModes";

export interface DisplaySettings {
  scalePreviewMode: boolean;
  keyTextMode: KeyDisplayMode;
  chordDisplayMode: ChordDisplayMode;
  showBassInRomanNotation: boolean;
  setScalePreviewMode: (mode: boolean) => void;
  setKeyTextMode: (mode: KeyDisplayMode) => void;
  setChordDisplayMode: (mode: ChordDisplayMode) => void;
  setShowBassInRomanNotation: (show: boolean) => void;
}

const DisplayContext = createContext<DisplaySettings | null>(null);

export const DisplayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isScales = useIsScalePreviewMode();

  const [scalePreviewMode, setScalePreviewMode] = useState<boolean>(isScales);
  const [keyTextMode, setKeyTextMode] = useState<KeyDisplayMode>(
    isScales ? KeyDisplayMode.ScaleDegree : KeyDisplayMode.NoteNames,
  );
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>(
    ChordDisplayMode.Symbols,
  );
  const [showBassInRomanNotation, setShowBassInRomanNotation] = useState<boolean>(false);

  const value: DisplaySettings = {
    scalePreviewMode,
    keyTextMode,
    chordDisplayMode,
    showBassInRomanNotation,
    setScalePreviewMode,
    setKeyTextMode,
    setChordDisplayMode,
    setShowBassInRomanNotation,
  };

  return <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>;
};

export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) {
    throw new Error("useDisplay must be used within a DisplayProvider");
  }
  return context;
};
