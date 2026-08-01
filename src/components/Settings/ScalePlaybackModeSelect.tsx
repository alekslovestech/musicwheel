"use client";
import React from "react";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { useAudio } from "@/contexts/AudioContext";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";
import { Button } from "@/components/Common/Button";
import { SectionTitle } from "@/components/Common/SectionTitle";
import { WheelShapeIcon } from "../Icons/wheel";
import { CircularVisMode } from "@/types/enums/SettingModes";

interface PlaybackModeOption {
  id: string;
  mode: ScalePlaybackMode;
  icon: React.ReactNode;
  description: string;
}

const SCALE_PLAYBACK_MODE_OPTIONS: PlaybackModeOption[] = [
  {
    id: "single-note",
    mode: ScalePlaybackMode.SingleNote,
    icon: "♪", // eighth note - one note played at a time
    description: "Play single notes",
  },
  {
    id: "droned-single-note",
    mode: ScalePlaybackMode.DronedSingleNote,
    // C to E: a Major 3rd, symbolic (not a tritone); dot marks the tonic
    icon: <WheelShapeIcon indices={[0, 4]} mode={CircularVisMode.Radial} dotIndices={[0]} />,
    description: "Play single notes with a tonic drone",
  },
  {
    id: "triad",
    mode: ScalePlaybackMode.Triad,
    // evenly spaced (not a real triad's actual notes) so the shape reads as a clean triangle
    icon: <WheelShapeIcon indices={[0, 4, 8]} mode={CircularVisMode.Polygon} />,
    description: "Play triads (3-note chords)",
  },
  {
    id: "seventh",
    mode: ScalePlaybackMode.Seventh,
    // rooted at 1, not 0, so the shape sits flat-top rather than as a diamond
    icon: <WheelShapeIcon indices={[1, 4, 7, 10]} mode={CircularVisMode.Polygon} />,
    description: "Play sevenths (4-note chords)",
  },
];

export const ScalePlaybackModeSelect: React.FC = () => {
  const trackAction = useTrack();
  const { scalePlaybackMode, setScalePlaybackMode, startSequencePlayback } = useAudio();

  const handleModeChange = (newMode: ScalePlaybackMode) => {
    if (newMode === scalePlaybackMode) return;
    trackAction(TrackEvent.ScalePlaybackModeChanged, { scale_playback_mode: newMode });
    setScalePlaybackMode(newMode);
    startSequencePlayback({ scalePlaybackMode: newMode });
  };

  return (
    <div className="playback-mode-select">
      <SectionTitle>Playback Mode</SectionTitle>
      <div className="grid grid-cols-2 gap-2 justify-items-center">
        {SCALE_PLAYBACK_MODE_OPTIONS.map(({ id, mode, icon, description }) => (
          <Button
            key={id}
            id={`playback-${id}`}
            variant="option"
            size="sm"
            selected={scalePlaybackMode === mode}
            onClick={() => handleModeChange(mode)}
            title={description}
          >
            {icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
