"use client";
import React from "react";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { useAudio } from "@/contexts/AudioContext";
import { track } from "@/lib/tracking/track";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { Button } from "@/components/Common/Button";
import { SectionTitle } from "@/components/Common/SectionTitle";

interface PlaybackModeOption {
  id: string;
  mode: ScalePlaybackMode;
  label: string;
  description: string;
}

const SCALE_PLAYBACK_MODE_OPTIONS: PlaybackModeOption[] = [
  {
    id: "single-note",
    mode: ScalePlaybackMode.SingleNote,
    label: "♪",
    description: "Play single notes",
  },
  /*{
    id: "droned-single-note",
    mode: ScalePlaybackMode.DronedSingleNote,
    label: "♩_ ♪",
    description: "Play single notes with a tonic drone",
  },*/
  {
    id: "triad",
    mode: ScalePlaybackMode.Triad,
    label: "♪♪♪",
    description: "Play triads (3-note chords)",
  },
];

export const ScalePlaybackModeSelect: React.FC = () => {
  const { scalePlaybackMode, setScalePlaybackMode, startSequencePlayback } = useAudio();

  const handleModeChange = (newMode: ScalePlaybackMode) => {
    if (newMode === scalePlaybackMode) return;
    track("scale_playback_mode_changed", {
      global_mode: GlobalMode.Scales,
      scale_playback_mode: newMode,
    });
    setScalePlaybackMode(newMode);
    startSequencePlayback({ scalePlaybackMode: newMode });
  };

  return (
    <div className="playback-mode-select">
      <SectionTitle>Playback Mode</SectionTitle>
      <div className="flex gap-2 justify-center">
        {SCALE_PLAYBACK_MODE_OPTIONS.map(({ id, mode, label, description }) => (
          <Button
            key={id}
            id={`playback-${id}`}
            variant="option"
            size="sm"
            selected={scalePlaybackMode === mode}
            onClick={() => handleModeChange(mode)}
            title={description}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
