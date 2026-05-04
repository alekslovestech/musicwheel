"use client";

import React from "react";

import { LAYOUT_PATTERNS } from "@/lib/design";
import { InputMode } from "@/types/enums/InputMode";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { useBorder } from "@/lib/hooks";

import { Button } from "@/components/Common/Button";
import { SectionTitle } from "@/components/Common/SectionTitle";

import { useChordPresets, useIsChordsOrIntervals } from "@/contexts/ChordPresetContext";

interface ModeSelectorButton {
  id: string;
  mode: InputMode;
  description: string;
}

const AVAILABLE_MODES: ModeSelectorButton[] = [
  {
    id: "mode-freeform",
    mode: InputMode.Freeform,
    description: "Click notes to toggle them on/off",
  },
  {
    id: "mode-singlenote",
    mode: InputMode.SingleNote,
    description: "Click a note to select it",
  },
  {
    id: "mode-intervals",
    mode: InputMode.IntervalPresets,
    description: "Select from predefined intervals",
  },
  {
    id: "mode-chords",
    mode: InputMode.ChordPresets,
    description: "Select from predefined chord patterns",
  },
];

export const InputModeSelector: React.FC = () => {
  const { inputMode, setInputMode } = useChordPresets();
  const border = useBorder();
  const handleModeChange = (newMode: InputMode) => {
    setInputMode(newMode);
  };

  const gapSize = "gap-snug";
  const isScalesMode = useIsScalePreviewMode();
  const isChordsOrIntervals = useIsChordsOrIntervals(); // Move hook call here

  return (
    <div
      className={`input-mode-selector text-center space-y-2 ${border} ${LAYOUT_PATTERNS.fullSize}`}
    >
      <SectionTitle>Input Mode</SectionTitle>
      <div className={`mode-selector-buttons ${LAYOUT_PATTERNS.centerFlexCol} ${gapSize}`}>
        {AVAILABLE_MODES.map(({ id, mode, description }) => {
          const isHidden = isScalesMode && isChordsOrIntervals; // Use the variable instead of calling the hook

          return (
            <Button
              id={id}
              key={mode}
              variant="option"
              size="sm"
              onClick={() => handleModeChange(mode)}
              selected={inputMode === mode}
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
