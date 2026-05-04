"use client";
import React from "react";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { Button } from "../Common/Button";

interface PresetButtonProps {
  presetId: NoteGroupingId;
  selected: boolean;
  onClick: (presetId: NoteGroupingId) => void;
}

export const ChordPresetButton: React.FC<PresetButtonProps> = ({ presetId, selected, onClick }) => {
  const elementId = NoteGroupingLibrary.getElementId(presetId);
  const displayName = NoteGroupingLibrary.getDisplayName(presetId);
  const buttonText = NoteGroupingLibrary.getPresetButtonName(presetId);

  return (
    <Button
      id={`preset-${elementId}`}
      key={presetId}
      variant="option"
      size="sm"
      selected={selected}
      onClick={() => onClick(presetId)}
      title={displayName}
    >
      {buttonText}
    </Button>
  );
};
