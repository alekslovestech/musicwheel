"use client";
import React from "react";
import { LAYOUT_PATTERNS } from "@/lib/design";
import { useBorder } from "@/lib/hooks";

import { MusicalKeySelector } from "../MusicalKeySelector";
import { TransposeWidget } from "../TransposeWidget";
import { ScalePlaybackModeSelect } from "./ScalePlaybackModeSelect";
import { PlaybackWidget } from "../PlaybackWidget";
import { TransposeTarget } from "@/types/enums/TransposeTarget";

export const SettingsPanelScales = () => {
  const settingsGap = "gap-tight";
  const outerGapVertical = "gap-tight";
  const outerGapHorizontal = "gap-normal";
  const border = useBorder();

  return (
    <div
      id="settings-panel-scales"
      className={`flex flex-col ${outerGapVertical} ${border} ${LAYOUT_PATTERNS.fullSize}`}
    >
      <div className={`flex justify-between ${outerGapHorizontal} flex-1`}>
        {/* Left Column - Musical Context */}
        <div
          className={`${LAYOUT_PATTERNS.topFlexCol} rounded p-2 flex-1 ${settingsGap} ${border}`}
        >
          <TransposeWidget target={TransposeTarget.Key} />
          <MusicalKeySelector useDropdownSelector={true} />
          {/* currently disabled for simplicity */}
          {/*<NoteDisplayModeSelect />*/}
        </div>

        {/* Right Column - Playback Settings */}
        <div
          className={`${LAYOUT_PATTERNS.topFlexCol} ${settingsGap} rounded p-2 flex-1 ${border}`}
        >
          <ScalePlaybackModeSelect />
          <PlaybackWidget />
        </div>
      </div>
    </div>
  );
};
