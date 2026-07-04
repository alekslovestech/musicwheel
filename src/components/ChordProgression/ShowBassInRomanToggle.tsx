"use client";

import { useEffect, useMemo } from "react";

import { useAudio } from "@/contexts/AudioContext";
import { useDisplay } from "@/contexts/DisplayContext";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";

import { Toggle } from "../Common/Toggle";

export function ShowBassInRomanToggle() {
  const { selectedProgression } = useAudio();
  const { showBassInRomanNotation, setShowBassInRomanNotation } = useDisplay();

  const hasSlashChords = useMemo(() => {
    if (selectedProgression == null) return false;
    return ChordProgressionLibrary.getProgression(selectedProgression).hasSlashChords;
  }, [selectedProgression]);

  useEffect(() => {
    if (!hasSlashChords) setShowBassInRomanNotation(false);
  }, [hasSlashChords, setShowBassInRomanNotation]);

  if (!hasSlashChords) return null;

  return (
    <Toggle
      id="show-bass-in-roman-notation"
      checked={showBassInRomanNotation}
      onChange={setShowBassInRomanNotation}
      label="Show bass in Roman notation"
    />
  );
}
