"use client";
import React from "react";

import { useIsChordsOrIntervals, useIsFreeformMode } from "@/contexts/ChordPresetContext";

import { InputModeSelector } from "./InputModeSelector";
import { ChordPresetSelector } from "./ChordPresetsSelector";
import { LAYOUT_PATTERNS } from "@/lib/design/LayoutPatterns";
import { MusicalKeySelector } from "../MusicalKeySelector";

export const InputSettings: React.FC = () => {
  const showPresets = useIsChordsOrIntervals();
  const isFreeformMode = useIsFreeformMode();
  return (
    <div className={`settings-container flex flex-row ${LAYOUT_PATTERNS.fullSize} gap-loose`}>
      <div className="w-1/3 h-full flex items-center justify-center border-r border-containers-divider pr-loose">
        <InputModeSelector />
      </div>
      <div className={`presets-container w-2/3 h-full ${LAYOUT_PATTERNS.centerFlex}`}>
        {showPresets ? (
          <ChordPresetSelector />
        ) : (
          isFreeformMode && <MusicalKeySelector useDropdownSelector={false} />
        )}
      </div>
    </div>
  );
};
