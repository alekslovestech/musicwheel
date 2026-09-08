import { useKeyboardHandlers } from "@/components/Keyboard/KeyboardBase";
import { useMusical } from "@/contexts/MusicalContext";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";

import { LinearKeyboardView } from "./LinearKeyboardView";

export const KeyboardLinear = () => {
  const { onLinearKeyClick, checkIsBassNote } = useKeyboardHandlers();
  const { selectedMusicalKey, selectedNoteIndices } = useMusical();
  const isScales = useIsScalePreviewMode();

  return (
    <LinearKeyboardView
      musicalKey={selectedMusicalKey}
      highlightedNoteIndices={selectedNoteIndices}
      isScales={isScales}
      onKeyClick={onLinearKeyClick}
      isBassNote={checkIsBassNote}
      useRealisticColors={isScales}
    />
  );
};
