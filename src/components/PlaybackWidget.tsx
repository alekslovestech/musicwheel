import React from "react";
import { LAYOUT_PATTERNS } from "@/lib/design";
import { PlaySequenceButton } from "./Buttons/PlaySequenceButton";
import { PauseSequenceButton } from "./Buttons/PauseSequenceButton";
import { PlaybackState, useAudio } from "@/contexts/AudioContext";

export const PlaybackWidget: React.FC = () => {
  const { playbackState } = useAudio();

  return (
    <div
      id="playback-widget"
      className={`${LAYOUT_PATTERNS.centerFlexRowGap} max-w-xs self-center`}
    >
      <PlaySequenceButton />
      <PauseSequenceButton visible={playbackState !== PlaybackState.SequenceComplete} />
    </div>
  );
};
