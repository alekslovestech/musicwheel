import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { Button } from "../Common/Button";
import { PlayIcon, StopIcon } from "../Icons";
import { PLAYBACK_BUTTON_STYLES } from "@/lib/design/PlaybackButtonStyles";

export const PlaySequenceButton: React.FC = () => {
  const { playbackState, startSequencePlayback, stopSequencePlayback } = useAudio();

  const isPlayingOrPaused = () =>
    playbackState === PlaybackState.SequencePlaying ||
    playbackState === PlaybackState.SequencePaused;

  const handleClick = () => {
    if (isPlayingOrPaused()) {
      stopSequencePlayback();
    } else {
      startSequencePlayback();
    }
  };

  return (
    <Button size="md" variant="action" onClick={handleClick}>
      {isPlayingOrPaused() ? (
        <StopIcon className={PLAYBACK_BUTTON_STYLES.scalesMode} />
      ) : (
        <PlayIcon className={PLAYBACK_BUTTON_STYLES.scalesMode} />
      )}
    </Button>
  );
};
