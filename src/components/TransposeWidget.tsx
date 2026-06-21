"use client";

import { IndexUtils } from "@/utils/IndexUtils";
import { useMusical } from "@/contexts/MusicalContext";
import { useChordPresets, useIsFreeformMode } from "@/contexts/ChordPresetContext";

import { Button } from "./Common/Button";
import { LAYOUT_PATTERNS, TYPOGRAPHY } from "@/lib/design";
import { track } from "@/lib/track";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { TransposeTarget } from "@/types/enums/TransposeTarget";

// This component is used to transpose the selected notes OR the musical key.
export function TransposeWidget({
  target,
  label,
  coupled = false,
}: {
  target: TransposeTarget;
  label?: string;
  coupled?: boolean;
}) {
  const flexDirection = /*target === "notes" ? "flex-col" : */ "flex-row";
  return (
    <div className={coupled ? LAYOUT_PATTERNS.coupledActionSlot : undefined}>
      {label && <div className={`${TYPOGRAPHY.chordNameText}`}>{label}</div>}
      <div className={`transpose-buttons-container flex ${flexDirection} gap-2`}>
        <TransposeButton direction="up" target={target} />
        <TransposeButton direction="down" target={target} />
      </div>
    </div>
  );
}

type TransposeDirection = "up" | "down";

interface TransposeButtonProps {
  direction: TransposeDirection;
  target: TransposeTarget;
}

function TransposeButton({ direction, target }: TransposeButtonProps) {
  const arrow = direction === "up" ? "↑" : "↓";
  const amount = direction === "up" ? 1 : -1;
  const symbol = target === TransposeTarget.Notes ? "♫" : "𝄞";
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

  function onClick() {
    track("transpose_interacted", {
      global_mode: globalMode,
      transpose_target: target,
      ...(globalMode === GlobalMode.Scales
        ? { scale_type: selectedMusicalKey.scaleMode }
        : { input_mode: inputMode }),
    });
    if (target === TransposeTarget.Notes) {
      const transposedIndices = IndexUtils.transposeNotes(selectedNoteIndices, amount);
      setNotesDirectly(transposedIndices);

      if (!isFreeformMode && currentChordRef && transposedIndices.length > 0) {
        const newChordRef = MusicalDisplayFormatter.getChordReferenceFromIndices(transposedIndices);
        if (newChordRef) {
          setCurrentChordRef(newChordRef);
        }
      }
    } else {
      const newKey = selectedMusicalKey.getTransposedKey(amount);
      setSelectedMusicalKey(newKey);
    }
  }

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
}
