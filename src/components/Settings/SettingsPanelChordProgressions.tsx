"use client";
import React from "react";

import { LAYOUT_PATTERNS } from "@/lib/design";
import { useBorder } from "@/lib/hooks";
import { useMusical } from "@/contexts/MusicalContext";

import { ChordProgressionSelector } from "../ChordProgression/ChordProgressionSelector";
import { TransposeWidget } from "../TransposeWidget";
import { PlaybackWidget } from "../PlaybackWidget";

export const SettingsPanelChordProgressions = () => {
  const { selectedMusicalKey } = useMusical();
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
          <PlaybackWidget />
          <TransposeWidget target="key" />
          <div
            id="chord-progressions-inferred-key"
            className="text-sm font-medium text-center max-w-xs"
          >
            <div className="text-muted-foreground text-xs font-normal mb-0.5">
              Musical Key
            </div>
            <div aria-live="polite" className="text-base font-semibold">
              {selectedMusicalKey.tonicString}{" "}
              {selectedMusicalKey.classicalMode}
            </div>
          </div>
        </div>

        {/* Right Column - Playback Settings */}
        <div
          className={`${LAYOUT_PATTERNS.centerFlexCol} ${settingsGap} rounded p-2 flex-1 ${border}`}
        >
          <div
            className={`${LAYOUT_PATTERNS.centerFlexCol} max-w-xs self-center gap-2`}
          >
            <ChordProgressionSelector />
          </div>
        </div>
      </div>
    </div>
  );
};
