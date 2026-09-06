import { useMusical } from "@/contexts/MusicalContext";
import { useAudio } from "@/contexts/AudioContext";
import { useDisplay } from "@/contexts/DisplayContext";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { showsStepSegments } from "@/utils/visual/scaleRibbonUtils";

import { useKeyboardHandlers } from "../KeyboardBase";
import { CircularKeyboardView } from "./CircularKeyboardView";

export const KeyboardCircular = () => {
  const { onCircularKeyClick, checkIsBassNote } = useKeyboardHandlers();
  const { selectedNoteIndices, selectedMusicalKey } = useMusical();
  const isScales = useIsScalePreviewMode();
  const { scalePlaybackMode } = useAudio();
  const { showStepAnnotations } = useDisplay();
  const showScaleStepIntervals =
    isScales && showsStepSegments(scalePlaybackMode, showStepAnnotations);

  return (
    <CircularKeyboardView
      musicalKey={selectedMusicalKey}
      highlightedNoteIndices={selectedNoteIndices}
      scalePlaybackMode={scalePlaybackMode}
      showStepAnnotations={showScaleStepIntervals}
      isScales={isScales}
      onKeyClick={onCircularKeyClick}
      isBassNote={checkIsBassNote}
      className="flex w-full max-w-[800px] h-full aspect-square p-[5px] justify-center items-center [container-type:inline-size]"
    />
  );
};
