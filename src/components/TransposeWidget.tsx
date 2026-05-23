"use client";

import { IndexUtils } from "@/utils/IndexUtils";
import { useMusical } from "@/contexts/MusicalContext";
import { useChordPresets, useIsFreeformMode } from "@/contexts/ChordPresetContext";

import { Button } from "./Common/Button";
import { TYPOGRAPHY } from "@/lib/design";
import { track } from "@/lib/track";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";

type TransposeDirection = "up" | "down";
export type TransposeTarget = "key" | "notes";
interface TransposeButtonProps {
  direction: TransposeDirection;
  target: TransposeTarget;
}

const TransposeButton: React.FC<TransposeButtonProps> = ({ direction, target }) => {
  const arrow = direction === "up" ? "↑" : "↓";
  const amount = direction === "up" ? 1 : -1;
  const symbol = target === "notes" ? "♫" : "𝄞";
  const title = `Transpose ${target} ${direction}`;
  const isFreeformMode = useIsFreeformMode();
  const {
    selectedNoteIndices,
    selectedMusicalKey,
    setSelectedMusicalKey,
    currentChordRef,
    setCurrentChordRef,
    setNotesDirectly,
  } = useMusical();
  const globalMode = useGlobalMode();
  const { inputMode } = useChordPresets();
  const onClick = () => {
    track("transpose_interacted", {
      global_mode: globalMode,
      input_mode: inputMode,
    });
    if (target === "notes") {
      // Transpose selected notes
      const transposedIndices = IndexUtils.transposeNotes(selectedNoteIndices, amount);

      // Update notes directly (works for both modes)
      setNotesDirectly(transposedIndices);

      // In preset mode, update chord reference from the transposed notes
      if (!isFreeformMode && currentChordRef && transposedIndices.length > 0) {
        const newChordRef = MusicalDisplayFormatter.getChordReferenceFromIndices(transposedIndices);
        if (newChordRef) {
          setCurrentChordRef(newChordRef);
        }
      }
    } else {
      // Transpose musical key
      const newKey = selectedMusicalKey.getTransposedKey(amount);
      setSelectedMusicalKey(newKey);
    }
  };

  return (
    <Button
      id={`transpose-${direction}-button`}
      variant="action"
      size="md"
      onClick={onClick}
      title={title}
    >
      {`${arrow}${symbol}${arrow}`}
    </Button>
  );
};

// This component is used to transpose the selected notes OR the musical key.
export const TransposeWidget: React.FC<{
  target: TransposeTarget;
  label?: string;
}> = ({ target, label }) => {
  const flexDirection = /*target === "notes" ? "flex-col" : */ "flex-row";
  return (
    <div>
      {label && <div className={`${TYPOGRAPHY.chordNameText}`}>{label}</div>}
      <div className={`transpose-buttons-container flex ${flexDirection} gap-2`}>
        <TransposeButton direction="up" target={target} />
        <TransposeButton direction="down" target={target} />
      </div>
    </div>
  );
};
