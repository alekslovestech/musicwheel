"use client";

import React, { createContext, useEffect, useState, useContext, ReactNode } from "react";

import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";

import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { ChordDisplayMode } from "@/types/enums/SettingModes";

export interface DisplaySettings {
  scalePreviewMode: boolean;
  keyTextMode: KeyDisplayMode;
  chordDisplayMode: ChordDisplayMode;
  showBassInRomanNotation: boolean;
  /** W-H step annotations on the Notes ribbon and the wheel. Opt-in, and remembered across visits. */
  showStepAnnotations: boolean;
  setScalePreviewMode: (mode: boolean) => void;
  setKeyTextMode: (mode: KeyDisplayMode) => void;
  setChordDisplayMode: (mode: ChordDisplayMode) => void;
  setShowBassInRomanNotation: (show: boolean) => void;
  setShowStepAnnotations: (show: boolean) => void;
}

const STEP_ANNOTATIONS_STORAGE_KEY = "musicwheel:showStepAnnotations";

// Storage access is guarded: Safari throws on localStorage in private browsing, and an
// unremembered preference is a far better outcome than a toggle that crashes when clicked.
function readStoredStepAnnotations(): boolean {
  try {
    return window.localStorage.getItem(STEP_ANNOTATIONS_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeStoredStepAnnotations(show: boolean): void {
  try {
    window.localStorage.setItem(STEP_ANNOTATIONS_STORAGE_KEY, String(show));
  } catch {
    // Preference simply doesn't persist; the in-memory toggle still works this session.
  }
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
  const [showStepAnnotations, setShowStepAnnotationsState] = useState<boolean>(false);

  // Read after mount rather than seeding useState from storage: the server has no localStorage,
  // so a remembered `true` would hydrate a checked toggle against unchecked server HTML.
  useEffect(() => {
    setShowStepAnnotationsState(readStoredStepAnnotations());
  }, []);

  const setShowStepAnnotations = (show: boolean) => {
    setShowStepAnnotationsState(show);
    writeStoredStepAnnotations(show);
  };

  const value: DisplaySettings = {
    scalePreviewMode,
    keyTextMode,
    chordDisplayMode,
    showBassInRomanNotation,
    showStepAnnotations,
    setScalePreviewMode,
    setKeyTextMode,
    setChordDisplayMode,
    setShowBassInRomanNotation,
    setShowStepAnnotations,
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
