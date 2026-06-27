"use client";
import React from "react";

import { InputMode } from "@/types/enums/InputMode";
import { ixActual, ixInversion } from "@/types/IndexTypes";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";

import { useChordPresets } from "@/contexts/ChordPresetContext";
import { useMusical } from "@/contexts/MusicalContext";

import { LAYOUT_PATTERNS } from "@/lib/design";
import { useBorder, useGlobalMode } from "@/lib/hooks";

import { InversionButton } from "../Buttons/InversionButton";
import { SectionTitle } from "../Common/SectionTitle";
import { ChordPresetButton } from "./ChordPresetButton";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { track } from "@/lib/tracking/track";

export const ChordPresetSelector: React.FC = () => {
  const { inputMode } = useChordPresets();

  const { selectedNoteIndices, currentChordRef, setCurrentChordRef } = useMusical();
  const border = useBorder();
  const globalMode = useGlobalMode();
  if (inputMode !== InputMode.ChordPresets && inputMode !== InputMode.IntervalPresets) return null;

  const handlePresetChange = (newPresetId: NoteGroupingId) => {
    track("chord_preset_changed", {
      global_mode: globalMode,
      input_mode: inputMode,
      preset_id: newPresetId,
    });
    // Use currentChordRef.rootNote if available, otherwise fall back to chord recognition or default
    const rootNote =
      currentChordRef?.rootNote ??
      (selectedNoteIndices.length > 0
        ? MusicalDisplayFormatter.getChordReferenceFromIndices(selectedNoteIndices)?.rootNote
        : ixActual(7));

    // Create new chord reference with inversion 0
    const newChordRef = makeChordReference(rootNote!, newPresetId);

    setCurrentChordRef(newChordRef);
  };

  const renderIntervalPresetButtons = () => {
    const presets = NoteGroupingLibrary.IntervalOrChordIds(true);
    return (
      <div
        className={`preset-buttons-grid grid gap-tight w-full ${border}`}
        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        {presets
          .filter((preset) => NoteGroupingLibrary.getGroupingById(preset).isVisiblePreset)
          .map((presetId) => (
            <ChordPresetButton
              key={presetId}
              presetId={presetId}
              selected={presetId === currentChordRef?.id}
              onClick={handlePresetChange}
            />
          ))}
      </div>
    );
  };

  const renderChordPresetButtons = () => {
    const presets = NoteGroupingLibrary.IntervalOrChordIds(false);
    return (
      <div
        className={`preset-buttons-grid grid gap-tight w-full ${border}`}
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {presets
          .filter((preset) => NoteGroupingLibrary.getGroupingById(preset).isVisiblePreset)
          .map((presetId) => (
            <ChordPresetButton
              key={presetId}
              presetId={presetId}
              selected={presetId === currentChordRef?.id}
              onClick={handlePresetChange}
            />
          ))}
      </div>
    );
  };

  const renderInversionButtons = () => {
    if (!currentChordRef) return null;

    const presetDefinition = NoteGroupingLibrary.getGroupingById(currentChordRef.id);
    if (presetDefinition && presetDefinition.hasInversions) {
      const inversionCount = presetDefinition.inversions.length;
      return (
        <div className="inversion-controls flex flex-col gap-tight border-t border-containers-divider">
          <SectionTitle centered={true}>Inversion</SectionTitle>
          <div className={`inversion-button-container flex flex-row gap-snug justify-center`}>
            {Array.from({ length: inversionCount }, (_, i) => (
              <InversionButton key={i} inversionIndex={ixInversion(i)} />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`presets-selector ${border} flex flex-col gap-snug ${LAYOUT_PATTERNS.fullSize}`}
    >
      {inputMode === InputMode.IntervalPresets
        ? renderIntervalPresetButtons()
        : renderChordPresetButtons()}
      {inputMode === InputMode.ChordPresets && renderInversionButtons()}
    </div>
  );
};
