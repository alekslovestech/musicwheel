import { usePlaySelectedNotes } from "@/components/AudioPlayer";
import { Button } from "../Common/Button";
import { PlayIcon } from "../Icons/PlaybackIcons";

export const PlayNotesButton: React.FC = () => {
  const playSelectedNotes = usePlaySelectedNotes();

  return (
    <Button size="sm" variant="action" onClick={playSelectedNotes}>
      <PlayIcon />
    </Button>
  );
};
