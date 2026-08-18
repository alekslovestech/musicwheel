"use client";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { Button } from "../Common/Button";
import { PlayIcon, PauseIcon } from "../Icons/PlaybackIcons";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";

export const PlayPauseSequenceButton: React.FC = () => {
  const trackAction = useTrack();
  const { playbackState, startSequencePlayback, pauseSequencePlayback, resumeSequencePlayback } =
    useAudio();

  const handleClick = () => {
    trackAction(TrackEvent.SequencePlaybackInteracted);
    if (playbackState === PlaybackState.SequencePlaying) {
      pauseSequencePlayback();
    } else if (playbackState === PlaybackState.SequencePaused) {
      resumeSequencePlayback();
    } else {
      startSequencePlayback();
    }
  };

  return (
    <Button id="play-pause-sequence-button" size="md" variant="action" onClick={handleClick}>
      {playbackState === PlaybackState.SequencePlaying ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
};
