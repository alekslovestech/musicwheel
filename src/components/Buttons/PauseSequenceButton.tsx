import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { Button } from "../Common/Button";
import { PauseIcon, ResumeIcon } from "../Icons";
import { PLAYBACK_BUTTON_STYLES } from "@/lib/design/PlaybackButtonStyles";

export const PauseSequenceButton: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { playbackState, pauseSequencePlayback, resumeSequencePlayback } = useAudio();

  const handleClick = () => {
    if (playbackState === PlaybackState.SequencePlaying) {
      pauseSequencePlayback();
    } else if (playbackState === PlaybackState.SequencePaused) {
      resumeSequencePlayback();
    }
  };

  return (
    <Button
      id="pause-sequence-button"
      size="md"
      variant="action"
      className={visible ? undefined : "invisible pointer-events-none"}
      onClick={handleClick}
    >
      {playbackState === PlaybackState.SequencePaused ? (
        <ResumeIcon className={PLAYBACK_BUTTON_STYLES.scalesMode} />
      ) : (
        <PauseIcon className={PLAYBACK_BUTTON_STYLES.scalesMode} />
      )}
    </Button>
  );
};
