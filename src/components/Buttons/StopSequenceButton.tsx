"use client";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { Button } from "../Common/Button";
import { StopIcon } from "../Icons/PlaybackIcons";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";

export const StopSequenceButton: React.FC = () => {
  const trackAction = useTrack();
  const { playbackState, stopSequencePlayback } = useAudio();

  const isPlayingOrPaused =
    playbackState === PlaybackState.SequencePlaying ||
    playbackState === PlaybackState.SequencePaused;

  const handleClick = () => {
    trackAction(TrackEvent.SequencePlaybackInteracted);
    stopSequencePlayback();
  };

  return (
    <Button
      id="stop-sequence-button"
      size="md"
      variant="action"
      disabled={!isPlayingOrPaused}
      onClick={handleClick}
    >
      <StopIcon />
    </Button>
  );
};
