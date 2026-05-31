"use client";
import React, { useMemo } from "react";

import { SpecialType } from "@/types/enums/SpecialType";
import { ChordType } from "@/types/enums/ChordType";

import { ChordDisplayInfo } from "@/types/interfaces/ChordDisplayInfo";
import { ChordDisplayMode } from "@/types/SettingModes";

import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";

import { useMusical } from "@/contexts/MusicalContext";
import { useDisplay } from "@/contexts/DisplayContext";
import { useIsChordsOrIntervals } from "@/contexts/ChordPresetContext";

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
  const isChordsOrIntervals = useIsChordsOrIntervals();
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
    const chordRefId = currentChordRef?.id;
    const shouldUseChordPresetSpelling =
      isChordsOrIntervals &&
      chordRefId !== SpecialType.None &&
      chordRefId !== SpecialType.Note &&
      chordRefId !== SpecialType.Freeform &&
      chordRefId !== ChordType.Unknown;

    if (shouldUseChordPresetSpelling && selectedNoteIndices.length > 0) {
      const chordRef =
        currentChordRef ||
        MusicalDisplayFormatter.getChordReferenceFromIndices(selectedNoteIndices);

      return MusicalDisplayFormatter.getChordPresetDisplayInfo(
        selectedNoteIndices,
        chordRef!,
        chordDisplayMode,
        //ChordDisplayMode.Symbols
      );
    } else {
      return MusicalDisplayFormatter.getDisplayInfoFromIndices(
        selectedNoteIndices,
        chordDisplayMode,
        selectedMusicalKey,
      );
    }
  }, [
    selectedNoteIndices,
    selectedMusicalKey,
    currentChordRef,
    isChordsOrIntervals,
    chordDisplayMode,
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
        <div id={chordNameElementId("note-grouping", idPrefix)} className={`${TYPOGRAPHY.controlLabel}`}>
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
    <div id={chordNameElementId("display", idPrefix)} className={`${LAYOUT_PATTERNS.fullSize} ${border}`}>
      <div
        onClick={toggleChordDisplayMode}
        className={`cursor-pointer hover:text-buttons-textSelected transition-colors duration-200 ${LAYOUT_PATTERNS.fullSize}`}
      >
        {renderChordDisplay(displayInfo)}
      </div>
    </div>
  );
};
