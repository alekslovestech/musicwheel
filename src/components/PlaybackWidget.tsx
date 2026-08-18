import React from "react";
import { LAYOUT_PATTERNS } from "@/lib/design";
import { PlayPauseSequenceButton } from "./Buttons/PlayPauseSequenceButton";
import { StopSequenceButton } from "./Buttons/StopSequenceButton";

export const PlaybackWidget: React.FC<{ coupled?: boolean }> = ({ coupled = false }) => {
  return (
    <div
      id="playback-widget"
      className={`${LAYOUT_PATTERNS.centerFlexRowGap} max-w-xs self-center ${
        coupled ? LAYOUT_PATTERNS.coupledActionSlot : ""
      }`}
    >
      <PlayPauseSequenceButton />
      <StopSequenceButton />
    </div>
  );
};
