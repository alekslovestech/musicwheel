"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";

import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { CircularVisMode } from "@/types/SettingModes";
import { ChordDisplayMode } from "@/types/SettingModes";

export interface DisplaySettings {
  circularVisMode: CircularVisMode;
  monochromeMode: boolean;
  scalePreviewMode: boolean;
  keyTextMode: KeyDisplayMode;
  chordDisplayMode: ChordDisplayMode;
  setCircularVisMode: (mode: CircularVisMode) => void;
  setMonochromeMode: (mode: boolean) => void;
  setScalePreviewMode: (mode: boolean) => void;
  setKeyTextMode: (mode: KeyDisplayMode) => void;
  setChordDisplayMode: (mode: ChordDisplayMode) => void;
}

const DisplayContext = createContext<DisplaySettings | null>(null);

export const DisplayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isScales = useIsScalePreviewMode();

  const [circularVisMode, setCircularVisMode] = useState<CircularVisMode>(
    isScales ? CircularVisMode.Polygon : CircularVisMode.None
  );
  const [scalePreviewMode, setScalePreviewMode] = useState<boolean>(isScales);
  const [keyTextMode, setKeyTextMode] = useState<KeyDisplayMode>(
    isScales ? KeyDisplayMode.ScaleDegree : KeyDisplayMode.NoteNames
  );
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>(
    ChordDisplayMode.Symbols
  );

  const [monochromeMode, setMonochromeMode] = useState<boolean>(isScales);

  const value: DisplaySettings = {
    circularVisMode,
    monochromeMode,
    scalePreviewMode,
    keyTextMode,
    chordDisplayMode,
    setCircularVisMode,
    setMonochromeMode,
    setScalePreviewMode,
    setKeyTextMode,
    setChordDisplayMode,
  };

  return (
    <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>
  );
};

export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) {
    throw new Error("useDisplay must be used within a DisplayProvider");
  }
  return context;
};
