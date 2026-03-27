"use client";
import React from "react";

import { LAYOUT_PATTERNS } from "@/lib/design";
import { useBorder } from "@/lib/hooks";

import { ChordProgressionSelector } from "../ChordProgressionSelector";
import { MusicalKeySelector } from "../MusicalKeySelector";
import { TransposeWidget } from "../TransposeWidget";
import { PlaybackWidget } from "../PlaybackWidget";

export const SettingsPanelChordProgressions = () => {
  const settingsGap = "gap-tight";
  const outerGapVertical = "gap-tight";
  const outerGapHorizontal = "gap-normal";
  const border = useBorder();

  return (
    <div
      id="settings-panel-chord-progressions"
      className={`flex flex-col ${outerGapVertical} ${border} ${LAYOUT_PATTERNS.fullSize}`}
    >
      <div className={`flex justify-between ${outerGapHorizontal} flex-1`}>
        {/* Left Column - Musical Context */}
        <div
          className={`${LAYOUT_PATTERNS.centerFlexCol} rounded p-2 flex-1 ${settingsGap} ${border}`}
        >
          <MusicalKeySelector useDropdownSelector={false} />
          <ChordProgressionSelector />
        </div>

        {/* Right Column - Playback Settings */}
        <div
          className={`${LAYOUT_PATTERNS.centerFlexCol} ${settingsGap} rounded p-2 flex-1 ${border}`}
        >
          <div
            className={`${LAYOUT_PATTERNS.centerFlexCol} max-w-xs self-center gap-2`}
          >
            <TransposeWidget target="key" />
            <PlaybackWidget />
          </div>
        </div>
      </div>
    </div>
  );
};
