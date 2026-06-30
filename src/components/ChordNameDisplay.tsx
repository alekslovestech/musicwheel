"use client";
import React, { useMemo } from "react";

import { ChordDisplayInfo } from "@/types/interfaces/ChordDisplayInfo";
import { ChordDisplayMode } from "@/types/enums/SettingModes";

import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import {
  ChordDisplayKind,
  resolveChordDisplayContext,
} from "@/utils/spelling/ChordDisplayContext";

import { useMusical } from "@/contexts/MusicalContext";
import { useDisplay } from "@/contexts/DisplayContext";
import { useChordPresets } from "@/contexts/ChordPresetContext";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";

import { TYPOGRAPHY } from "@/lib/design";
import { LAYOUT_PATTERNS } from "@/lib/design/LayoutPatterns";
import { useBorder } from "@/lib/hooks";

const MAX_CHORD_NAME_LENGTH = 7;
const BREAK_CHARACTER = "\u200B";

function chordNameElementId(part: string, idPrefix?: string): string {
  return idPrefix ? `chord-name-${idPrefix}-${part}` : `chord-name-${part}`;
}

export const ChordNameDisplay: React.FC<{ idPrefix?: string }> = ({ idPrefix }) => {
  const { selectedNoteIndices, selectedMusicalKey, currentChordRef } = useMusical();
  const { chordDisplayMode, setChordDisplayMode } = useDisplay();
  const { harmonyInputMode } = useChordPresets();
  const globalMode = useGlobalMode();
  const border = useBorder();

  const getOppositeDisplayMode = (prevDisplayMode: ChordDisplayMode): ChordDisplayMode => {
    if (prevDisplayMode === ChordDisplayMode.Letters) return ChordDisplayMode.Symbols;
    if (prevDisplayMode === ChordDisplayMode.Symbols) return ChordDisplayMode.Letters;
    return prevDisplayMode; //no change
  };

  function toggleChordDisplayMode(): void {
    setChordDisplayMode(getOppositeDisplayMode(chordDisplayMode));
  }

  const displayInfo = useMemo(() => {
    const displayContext = resolveChordDisplayContext({
      globalMode,
      harmonyInputMode,
      currentChordRef,
    });

    if (displayContext.kind === ChordDisplayKind.ChordPreset && selectedNoteIndices.length > 0) {
      return MusicalDisplayFormatter.getChordPresetDisplayInfo(
        selectedNoteIndices,
        currentChordRef!,
        chordDisplayMode,
      );
    }

    const useScaleNoteSpelling =
      displayContext.kind === ChordDisplayKind.FromIndices &&
      displayContext.useScaleNoteSpelling;

    return MusicalDisplayFormatter.getDisplayInfoFromIndices(
      selectedNoteIndices,
      chordDisplayMode,
      selectedMusicalKey,
      useScaleNoteSpelling,
    );
  }, [
    selectedNoteIndices,
    selectedMusicalKey,
    currentChordRef,
    harmonyInputMode,
    chordDisplayMode,
    globalMode,
  ]);

  const renderChordDisplay = (displayInfo: ChordDisplayInfo) => {
    const { chordName, noteGroupingString } = displayInfo;
    const chordNameDisplay =
      chordName.length > MAX_CHORD_NAME_LENGTH && chordName.includes("/")
        ? chordName.replace("/", `${BREAK_CHARACTER}/`)
        : chordName;
    return (
      <div
        id={chordNameElementId("description", idPrefix)}
        className={`chord-name-description ${LAYOUT_PATTERNS.centerFlexCol} ${LAYOUT_PATTERNS.fullSize}`}
      >
        <div
          id={chordNameElementId("note-grouping", idPrefix)}
          className={`${TYPOGRAPHY.controlLabel}`}
        >
          {`${noteGroupingString}:`}
        </div>
        <div
          id={chordNameElementId("value", idPrefix)}
          className={`${TYPOGRAPHY.chordNameText} max-w-full text-center break-words`}
        >
          {chordNameDisplay}
        </div>
      </div>
    );
  };

  return (
    <div
      id={chordNameElementId("display", idPrefix)}
      className={`${LAYOUT_PATTERNS.fullSize} ${border}`}
    >
      <div
        onClick={toggleChordDisplayMode}
        className={`cursor-pointer hover:text-buttons-textSelected transition-colors duration-200 ${LAYOUT_PATTERNS.fullSize}`}
      >
        {renderChordDisplay(displayInfo)}
      </div>
    </div>
  );
};
