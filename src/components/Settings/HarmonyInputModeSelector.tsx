"use client";

import React from "react";

import { LAYOUT_PATTERNS } from "@/lib/design";
import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { useBorder } from "@/lib/hooks";

import { Button } from "@/components/Common/Button";
import { SectionTitle } from "@/components/Common/SectionTitle";

import { useChordPresets, useIsChordsOrIntervals } from "@/contexts/ChordPresetContext";

interface ModeSelectorButton {
  id: string;
  mode: HarmonyInputMode;
  description: string;
}

const AVAILABLE_MODES: ModeSelectorButton[] = [
  {
    id: "mode-freeform",
    mode: HarmonyInputMode.Freeform,
    description: "Click notes to toggle them on/off",
  },
  {
    id: "mode-singlenote",
    mode: HarmonyInputMode.SingleNote,
    description: "Click a note to select it",
  },
  {
    id: "mode-intervals",
    mode: HarmonyInputMode.IntervalPresets,
    description: "Select from predefined intervals",
  },
  {
    id: "mode-chords",
    mode: HarmonyInputMode.ChordPresets,
    description: "Select from predefined chord patterns",
  },
];

export const HarmonyInputModeSelector: React.FC = () => {
  const { harmonyInputMode, setHarmonyInputMode } = useChordPresets();
  const border = useBorder();
  const handleModeChange = (newMode: HarmonyInputMode) => {
    setHarmonyInputMode(newMode);
  };

  const gapSize = "gap-snug";
  const isScalesMode = useIsScalePreviewMode();
  const isChordsOrIntervals = useIsChordsOrIntervals();

  return (
    <div
      className={`harmony-input-mode-selector text-center space-y-2 ${border} ${LAYOUT_PATTERNS.fullSize}`}
    >
      <SectionTitle>Harmony Input</SectionTitle>
      <div className={`mode-selector-buttons ${LAYOUT_PATTERNS.centerFlexCol} ${gapSize}`}>
        {AVAILABLE_MODES.map(({ id, mode, description }) => {
          const isHidden = isScalesMode && isChordsOrIntervals;

          return (
            <Button
              id={id}
              key={mode}
              variant="option"
              size="sm"
              onClick={() => handleModeChange(mode)}
              selected={harmonyInputMode === mode}
              title={description}
              hidden={isHidden}
            >
              {mode.toString()}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
