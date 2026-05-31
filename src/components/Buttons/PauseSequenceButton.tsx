import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { Button } from "../Common/Button";
import { PauseIcon, ResumeIcon } from "../Icons";
import { PLAYBACK_BUTTON_STYLES } from "@/lib/design/PlaybackButtonStyles";

export const PauseSequenceButton: React.FC = () => {
  const { playbackState, pauseSequencePlayback, resumeSequencePlayback } = useAudio();

  const handleClick = () => {
    if (playbackState === PlaybackState.SequencePlaying) {
      pauseSequencePlayback();
    } else if (playbackState === PlaybackState.SequencePaused) {
      resumeSequencePlayback();
    }
  };

  return (
    <Button id="pause-sequence-button" size="md" variant="action" onClick={handleClick}>
      {playbackState === PlaybackState.SequencePaused ? (
        <ResumeIcon className={PLAYBACK_BUTTON_STYLES.scalesMode} />
      ) : (
        <PauseIcon className={PLAYBACK_BUTTON_STYLES.scalesMode} />
      )}
    </Button>
  );
};
