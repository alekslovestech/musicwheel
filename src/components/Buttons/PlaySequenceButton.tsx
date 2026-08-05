"use client";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { Button } from "../Common/Button";
import { PlayIcon, StopIcon } from "../Icons/PlaybackIcons";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";

export const PlaySequenceButton: React.FC = () => {
  const trackAction = useTrack();
  const { playbackState, startSequencePlayback, stopSequencePlayback } = useAudio();

  const isPlayingOrPaused = () =>
    playbackState === PlaybackState.SequencePlaying ||
    playbackState === PlaybackState.SequencePaused;

  const handleClick = () => {
    trackAction(TrackEvent.SequencePlaybackInteracted);
    if (isPlayingOrPaused()) {
      stopSequencePlayback();
    } else {
      startSequencePlayback();
    }
  };

  return (
    <Button id="play-stop-sequence-button" size="md" variant="action" onClick={handleClick}>
      {isPlayingOrPaused() ? <StopIcon /> : <PlayIcon />}
    </Button>
  );
};
